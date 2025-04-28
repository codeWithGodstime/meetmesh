import logging
from typing import Dict, Any
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as SimpleJWTTokenObtainPairSerializer
from .models import Profile, User, UserPreference
from utilities import choices
from django_countries.fields import Country
from django_countries.serializer_fields import CountryField
from geopy.geocoders import Nominatim
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point


User = get_user_model()
logger = logging.getLogger(__file__)

class UserSerializer:
    class UserCreateSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = (
                "email",
                "password",
                "username",
            )

        def validate(self, attrs):
            return super().validate(attrs)
        
        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)        
            return user

    class UserFeedSerializer(serializers.ModelSerializer):
        occupation = serializers.SerializerMethodField()
        bio = serializers.SerializerMethodField()
        interests = serializers.SerializerMethodField()
        profile_image = serializers.SerializerMethodField()
        is_online = serializers.SerializerMethodField()
        social_links = serializers.SerializerMethodField()
        location = serializers.SerializerMethodField()
        country = serializers.SerializerMethodField()

        class Meta:
            model = User
            fields = [
                "id",
                "fullname",
                "email",
                "city",
                "country",
                "location",
                "occupation",
                "bio",
                "interests",
                "profile_image",
                "is_online",
                "gender",
                "social_links",
            ]

        def get_occupation(self, obj):
            return obj.profile.occupation if hasattr(obj, "profile") else None

        def get_bio(self, obj):
            return obj.profile.bio if hasattr(obj, "profile") else None

        def get_interests(self, obj):
            return obj.profile.interests if hasattr(obj, "profile") and obj.profile.interests else []

        def get_profile_image(self, obj):
            return obj.profile.profile_image.url if hasattr(obj, "profile") else None

        def get_is_online(self, obj):
            return obj.profile.is_online if hasattr(obj, "profile") else False

        def get_social_links(self, obj):
            return obj.profile.social_links if hasattr(obj, "profile") and obj.profile.social_links else []

        def get_location(self, obj):
            if obj.base_location:
                return {
                    "latitude": obj.base_location.y,
                    "longitude": obj.base_location.x
                }
            return None

        def get_country(self, obj):
            return {
                # "code": obj.country.code,
                "name": obj.country.name
            }

    class UserOnBoardingSerializer(serializers.Serializer):
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        bio = serializers.CharField()
        gender = serializers.CharField()
        interests = serializers.ListField(child=serializers.CharField())
        location = serializers.ListField(child=serializers.CharField(), max_length=200)
        notifyNearby = serializers.BooleanField()
        occupation = serializers.CharField()
        profileImage = serializers.ImageField(required=False, allow_null=True)
        showLocation = serializers.BooleanField()
        socialMediaLinks = serializers.ListField(child=serializers.DictField(), required=False)

        def update(self, instance, validated_data):
            user = instance

            country, city = validated_data.get("location", [None, None])
            user.country = country
            user.city = city 
            user.has_completed_onboarding = True
            user.first_name = validated_data.get("first_name")
            user.last_name = validated_data.get("last_name")

            if city:
                try:
                    geolocator = Nominatim(user_agent="meetmesh_app")
                    location = geolocator.geocode(city)
                        
                    if location:
                        user.base_location = Point(location.longitude, location.latitude)
                    else:
                        raise ValidationError(f"Could not find coordinates for city: {city}")
                except Exception as e:
                    logger.error(f"Could not geocode {city}", e)

            user.save()

            profile_data = {
                "bio": validated_data.get("bio"),
                "gender": validated_data.get("gender"),
                "interests": validated_data.get("interests"),
                "occupation": validated_data.get("occupation"),
                "social_links": validated_data.get("socialMediaLinks", []),
            }

            if "profileImage" in validated_data:
                profile_data["profile_image"] = validated_data["profileImage"]

            Profile.objects.update_or_create(user=user, defaults=profile_data)

            UserPreference.objects.update_or_create(
                user=user, defaults={"notify_on_proximity": validated_data["notifyNearby"]},
            )

            return user

    class UserMeSerializer(serializers.ModelSerializer):

        class Meta:
            model = User
            fields = (
                "email",
                "username",
                "has_completed_onboarding",
                "id",
            )

    class UserRetrieveSerializer(serializers.ModelSerializer):

        class Meta:
            model = User
            fields = (
                "email",
                "username",
                "has_completed_onboarding",
                "id",
            )
    class ResetPasswordRequestSerializer(serializers.Serializer):
        email = serializers.EmailField(required=True)

    class ResetPasswordComplete(serializers.Serializer):
        token = serializers.CharField(required=True)
        new_password = serializers.CharField(write_only=True, required=True)

        def validate_new_password(self, value):
            from django.contrib.auth.password_validation import validate_password
            validate_password(value)
            return value

        def validate(self, data):
            token = data.get("token")

            try:
                user_id, token = token.split(":", 1)
                
                user = User.objects.get(id=user_id)
            except (ValueError, User.DoesNotExist):
                raise serializers.ValidationError({"token": "Invalid token."})

            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                raise serializers.ValidationError(
                    {"token": "Invalid or expired token."})

            self.user = user
            return data

        def save(self):
            """
            Updates the user's password.
            """
            self.user.set_password(self.validated_data["new_password"])
            self.user.save()

    class ChangePasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField(required=True, write_only=True)
        new_password = serializers.CharField(required=True, write_only=True)

        def validate_new_password(self, value):
            from django.contrib.auth.password_validation import validate_password
            validate_password(value)
            return value
    
        def validate(self, attrs):
            user = self.context['request'].user
            old_password = attrs.get('old_password')

            is_password_valid = check_password(old_password, user.password)
            
            if not is_password_valid: 
                raise serializers.ValidationError({"old_password": "Invalid password."})
        
            return super().validate(attrs)
    
        def create(self, validated_data):
            """
            Updates the user's password.
            """
            user = self.context['request'].user
            user.set_password(self.validated_data["new_password"])
            user.save()
            return user

    class UserPreferenceSerializer(serializers.Serializer):
        notify_radius_km = serializers.FloatField(required=False)
        who_can_discover_me = serializers.CharField(required=False)
        dark_theme = serializers.BooleanField(required=False)
        show_profile_of_people_meet = serializers.BooleanField(required=False)
        auto_accept_meetup_request = serializers.BooleanField(required=False)
        require_profile_completion = serializers.BooleanField(required=False)
        notify_on_profile_view = serializers.BooleanField(required=False)
        notify_on_meetup_invites = serializers.BooleanField(required=False)
        notify_on_proximity = serializers.BooleanField(required=False)
        only_verified_user_can_message = serializers.BooleanField(required=False)

        def update(self, instance, validated_data):
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            return instance


    class UserUpdateSerializer(serializers.ModelSerializer):
        bio = serializers.CharField(required=False)  
        status = serializers.CharField(required=False)
        interests = serializers.JSONField(default=list, required=False)

        class Meta:
            model = User
            fields = ("first_name", "last_name", "city", "status", "bio", "interests") 

        def update(self, instance, validated_data):
            instance.first_name = validated_data.get("first_name", instance.first_name)
            instance.last_name = validated_data.get("last_name", instance.last_name)
            instance.city = validated_data.get("city", instance.city)
            instance.save()

            bio_data = validated_data.get("bio", None)
            status = validated_data.get("status", None)
            interests = validated_data.get("interests", None)
            user_profile = instance.profile

            if bio_data:
                user_profile.bio = bio_data
                user_profile.save()
            
            if status:
                user_profile.status = status
                user_profile.save()

            if interests:
                user_profile.interests = interests
                user_profile.save()

            return instance

    class UserPreferenceRetrieveSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserPreference
            fields = "__all__" #TODO: write this out explicitly 
    

    class ProfileSerializer(serializers.ModelSerializer):
        id = serializers.CharField(source="user.id")
        profileimage = serializers.ImageField(source='profile_image', required=False)
        bannerimage = serializers.ImageField(source='banner_image', required=False)
        fullname = serializers.CharField(source='user.get_full_name')
        username = serializers.CharField(source='user.username')
        location = serializers.SerializerMethodField()
        city = serializers.CharField(source='user.city', required=False)
        last_name = serializers.CharField(source="user.last_name", required=False)
        first_name = serializers.CharField(source="user.first_name", required=False)
        country = serializers.CharField(source='user.country', required=False)
        lastseen = serializers.DateTimeField(source='last_seen', required=False)
        bio = serializers.CharField(required=False)
        interests = serializers.ListField(child=serializers.CharField(), required=False)
        isverified = serializers.BooleanField(source='user.is_verified', required=False)
        is_online = serializers.BooleanField(required=False)
        occupation = serializers.CharField(required=False)
        social_links = serializers.ListField(child=serializers.DictField(), required=False)

        class Meta:
            model = Profile
            fields = [
                "id",
                "username",
                'profileimage',
                'bannerimage',
                'fullname',
                'status',
                'location',
                "last_name",
                "first_name",
                'city',
                'country',
                'lastseen',
                'bio',
                'interests',
                'isverified',
                'is_online',
                'occupation',
                'social_links',
            ]

        def get_location(self, obj):
            point = obj.user.base_location
            if isinstance(point, Point):
                return {"latitude": point.y, "longitude": point.x}
            return None


class ProfileSerializer:
    class ProfileUpdateSerializer(serializers.ModelSerializer):
        class Meta:
            model = Profile
            fields = "__all__"

class TokenObtainSerializer(SimpleJWTTokenObtainPairSerializer):
 
     def validate(self, attrs: Dict[str, Any]):
 
         data = super().validate(attrs)
         user = self.user
         user_data = UserSerializer.UserRetrieveSerializer(user).data
         data['data'] = user_data
         return data
