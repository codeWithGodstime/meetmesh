import logging
from typing import Dict, Any
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as SimpleJWTTokenObtainPairSerializer
from .models import Profile, User, NotificationSetting
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
        occupation = serializers.CharField(source="profile.occupation")
        bio = serializers.CharField(source="profile.bio")
        interests = serializers.ListField(source="profile.interests")
        profile_image = serializers.ImageField(source="profile.profile_image")
        is_online = serializers.BooleanField(source="profile.is_online")
        location_visibility = serializers.BooleanField(source="profile.location_visibility")
        gender = serializers.CharField(source="profile.gender")
        social_links = serializers.ListField(source="profile.social_links")
        # fullname = serializers.CharField(source="fullname", read_only=True)
        location = serializers.SerializerMethodField()

        class Meta:
            model = User
            fields = [
                "id",
                "uid",
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
                "location_visibility",
                "gender",
                "social_links",
            ]
        
        def get_location(self, obj):
            if obj.location:
                return {
                    "latitude": obj.location.y,
                    "longitude": obj.location.x
                }
            return None

    class UserOnBoardingSerializer(serializers.Serializer):
        bio = serializers.CharField()
        gender = serializers.CharField()
        interests = serializers.ListField(child=serializers.CharField())
        location = serializers.ListField(child=serializers.CharField(), min_length=2, max_length=2)  # Expects city and country as list
        notifyNearby = serializers.BooleanField()
        occupation = serializers.CharField()
        profileImage = serializers.ImageField(required=False, allow_null=True)
        showLocation = serializers.BooleanField()
        socialMediaLinks = serializers.ListField(child=serializers.DictField(), required=False)

        def update(self, instance, validated_data):
            user = instance  # instance is the current user

            # Unpack location
            country, city = validated_data.get("location", [None, None])
            user.country = country  # Store country if necessary
            user.city = city  # Store city if necessary
            user.has_completed_onboarding = True

            # Geolocation using geopy (only for the city)
            if city:
                geolocator = Nominatim(user_agent="meetmesh_app")  # Choose a unique user agent for your app
                location = geolocator.geocode(city)

                if location:
                    # Create a PointField (latitude, longitude)
                    user.location = Point(location.longitude, location.latitude)  # Assuming `location` is a PointField
                else:
                    raise ValidationError(f"Could not find coordinates for city: {city}")

            user.save()

            # Profile updates
            profile_data = {
                "bio": validated_data.get("bio"),
                "gender": validated_data.get("gender"),
                "interests": validated_data.get("interests"),
                "occupation": validated_data.get("occupation"),
                "location_visibility": validated_data.get("showLocation"),
                "social_links": validated_data.get("socialMediaLinks", []),
            }

            if "profileImage" in validated_data:
                profile_data["profile_image"] = validated_data["profileImage"]

            Profile.objects.update_or_create(user=user, defaults=profile_data)

            # Notification settings
            NotificationSetting.objects.update_or_create(
                user=user, defaults={"notify_on_proximity": validated_data["notifyNearby"]},
            )

            return user

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

            # Decode user ID from the token
            try:
                user_id, token = token.split(":", 1)
                
                user = User.objects.get(id=user_id)
            except (ValueError, User.DoesNotExist):
                raise serializers.ValidationError({"token": "Invalid token."})

            # Validate the token
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


class TokenObtainSerializer(SimpleJWTTokenObtainPairSerializer):
 
     def validate(self, attrs: Dict[str, Any]):
 
         data = super().validate(attrs)
         user = self.user
         user_data = UserSerializer.UserRetrieveSerializer(user).data
         data['data'] = user_data
         return data