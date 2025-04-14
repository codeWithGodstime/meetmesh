import logging
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.views import TokenObtainPairView as SimpleJWTTokenObtainPairView
from django.conf import settings
from django.db import transaction
from geopy.distance import distance as geopy_distance
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserPreference, Profile
from core.models import Meetup
from .serializers import UserSerializer, TokenObtainSerializer, ProfileSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)

User = get_user_model()
channel_layer = get_channel_layer()

class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer.UserRetrieveSerializer
    queryset = User.objects.all()

    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        serializer = UserSerializer.UserCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            response_serializer = self.get_serializer(user)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            data = {
                "refresh": str(refresh),
                "access": str(access),
                "user": response_serializer.data
            }

            response = Response(data=data, status=status.HTTP_201_CREATED)
            return response
        else:
            logger.error(f"User registration failed due to invalid data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):

        instance = self.get_object()
        serializer = UserSerializer.UserUpdateSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self.perform_update(serializer)

        return Response(serializer.data)

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def me(self, request, *args, **kwargs):
        user = request.user
        profile = user.profile
        serializer = UserSerializer.ProfileSerializer(profile)
        return Response(data=serializer.data)
    
    @action(methods=['get'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def public(self, request, *args, **kwargs):
        """ viewing anther user profile """
        user = self.get_object()
        user = user.profile
        
        serializer = UserSerializer.ProfileSerializer(user)
        return Response(data=serializer.data)
    
    @action(methods=["post"], detail=False, permission_classes=[permissions.AllowAny])
    def reset_password(self, request, *args, **kwargs):
        logger.info(f"Password reset request with data: {request.data}")

        serializer = UserSerializer.ResetPasswordRequestSerializer(
            data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = request.data["email"]
            user = User.objects.filter(email__iexact=email).first()

            if user:
                logger.info(f"User found for email: {email}, initiating password reset.")
                token_generator = PasswordResetTokenGenerator()
                token = token_generator.make_token(user)
                logger.debug(f"Generated token: {token}")

                reset_url = f"{settings.PASSWORD_RESET_BASE_URL}/{user.id}:{token}"
                logger.info(f"Password reset URL: {reset_url}")

                subject = "Password Reset Request"
                message = f"Hi {user.first_name},\n\nPlease click the link below to reset your \npassword:{reset_url}\n\nIf you did not request this, please ignore this email."
                email_from = settings.DEFAULT_FROM_EMAIL

                logger.info(f"Sending password reset email to: {email}")
                user.email_user(subject, message, email_from)
                logger.info(f"Password reset email sent successfully to: {email}")

                return Response({'message': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
            else:
                logger.warning(f"User with email {email} not found.")
                return Response({"error": "User with email not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            logger.error(f"Password reset request failed due to invalid data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False, permission_classes=[permissions.AllowAny])
    def reset_password_complete(self, request, *args, **kwargs):
        logger.info(f"Password reset complete request with data: {request.data}")

        serializer = UserSerializer.ResetPasswordComplete(data=request.data)
        if serializer.is_valid():
            logger.info("Password reset request completed successfully.")
            serializer.save()
            logger.info(f"Password reset successfully for user: {self.request.user.id}")
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        else:
            logger.error(f"Password reset request failed due to invalid data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False, permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request, *args, **kwargs):

        serializer = UserSerializer.ChangePasswordSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            logger.info(f"Password change request with data: {request.data}")
            serializer.save()
            return Response({"message": "Password change successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @transaction.atomic
    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated]) 
    def complete_onboarding(self, request, *args, **kwargs):
        serializer = UserSerializer.UserOnBoardingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(instance=request.user, validated_data=serializer.validated_data)
            return Response({"message": "Onboarding completed!"})
        return Response(serializer.errors, status=400)

    @action(methods=["get"], detail=False, permission_classes=[permissions.IsAuthenticated])
    def feeds(self, request, *args, **kwargs):
        user = request.user
        location = user.base_location
        interests = set(user.profile.interests or [])
        radius_km = getattr(user.notification_setting, "notify_radius_km", 1000)  # default to 100km

        if not location:
            pass

        nearby_users = []
        other_users = User.objects.exclude(id=user.id).select_related('profile')

        serializer = UserSerializer.UserFeedSerializer(other_users, many=True)
        return Response({
            "status": "success",
            "message": "Nearby users with shared interests",
            "data": serializer.data
        })

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def dm_user(self, request, *args, **kwargs):
        sender = request.user
        receiver = self.get_object()

        room = Conversation.get_room(receiver, sender)
        message_serializer = MessageSerializer.MessageCreateSerializer(
            data=dict(
                conversation = room.id,
                sender=sender.id,
                content=request.data['content']
            )
        )

        # the sender is online to be able to send message, check if the receiver has a channel_name send messge else save to db
        # add user to group
        async_to_sync(channel_layer.group_add)(f"conversation_{room.id}", sender.channel_name)

        if(receiver.channel_name):
            async_to_sync(channel_layer.group_add)(f"conversation_{room.id}", receiver.channel_name)

        async_to_sync(channel_layer.group_send)(f"conversation_{room.id}", {"type": "send_mesage", "message": request.data['content']})
        # TODO: send notication

        message_serializer.is_valid(raise_exception=True)
        message_serializer.save()
        return Response(data=dict(message="Send successfully"))

    @action(methods=['put'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def update_user_preferences(self, request, *args, **kwargs):
        user = self.get_object()
        
        if user != request.user:
            return Response(data={"message": "Permission denied, can only update your preference"}, status=403)

        user_pref = user.user_preference

        serializer = UserSerializer.UserPreferenceSerializer(
            instance=user_pref,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        updated_pref = serializer.save()

        return Response(
            data={"message": "User preference updated successfully", "data": UserSerializer.UserPreferenceSerializer(updated_pref).data},
            status=status.HTTP_200_OK
        )
    
    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def user_preferences(self, request, *args, **kwargs):
        """"""
        user = request.user
        preferences, _ = UserPreference.objects.get_or_create(user=user.id)
        serializer = UserSerializer.UserPreferenceRetrieveSerializer(preferences)
        return Response(data=serializer.data, status=200)

    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def send_meetup_request(self, request, *args, **kwargs):
        receiver_user = self.get_object()
        sender_user = request.user

        if receiver_user == sender_user:
            return Response(
                {"detail": "You cannot send a meetup request to yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        sender_profile = get_object_or_404(Profile, pk=sender_user.id)
        receiver_profile = get_object_or_404(Profile, pk=receiver_user.id)

        existing_request = Meetup.objects.filter(
            sender=sender_profile,
            receiver=receiver_profile,
            status='pending'
        ).first()

        if existing_request:
            return Response(
                {"detail": "A pending meetup request already exists."},
                status=status.HTTP_409_CONFLICT
            )

        data = {
            "sender": sender_profile.id,
            "receiver": receiver_profile.id,
            "date": request.data.get("date"),
            "time": request.data.get("time"),
        }

        serializer = MeetupSerializer.MeetupCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserPreferenceViewset(viewsets.ModelViewSet):
    queryset = UserPreference.objects.all()
    serializer_class = UserSerializer.UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        if not self.request.user.is_superuser:
            return UserPreference.objects.get(user=self.request.user)
        return super().queryset(*args, **kwargs)

class ProfileViewset(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer.ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):

        user = request.user
        profile = Profile.objects.get(user=user)
        instance = profile
        
        serializer = ProfileSerializer.ProfileUpdateSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    

class TokenObtainPairView(SimpleJWTTokenObtainPairView):
     serializer_class = TokenObtainSerializer
 
     def post(self, request, *args, **kwargs) -> Response:
         return super().post(request, *args, **kwargs)