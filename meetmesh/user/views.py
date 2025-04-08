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

from .models import Conversation, Message


from .serializers import UserSerializer, TokenObtainSerializer, MessageSerializer, ConversationSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


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

            # Attach tokens to the serializer instance
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

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def me(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer.UserRetrieveSerializer(user)
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
    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated]) #TODO make this authenticated action
    def complete_onboarding(self, request, *args, **kwargs):
        serializer = UserSerializer.UserOnBoardingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(instance=request.user, validated_data=serializer.validated_data)
            return Response({"message": "Onboarding completed!"})
        return Response(serializer.errors, status=400)

    @action(methods=["get"], detail=False, permission_classes=[permissions.IsAuthenticated])
    def feeds(self, request, *args, **kwargs):
        user = request.user
        location = user.location
        interests = set(user.profile.interests or [])
        # radius_km = getattr(user.notification_setting, "notify_radius_km", 1000)  # default to 100km
        radius_km = 1000

        if not location:
            return Response({
                "status": "error",
                "message": "User location is not set."
            }, status=status.HTTP_400_BAD_REQUEST)

        nearby_users = []
        for other_user in User.objects.exclude(id=user.id).select_related('profile'):
            if not other_user.location:
                continue

            dist = geopy_distance(
                (location.y, location.x),  # (lat, lon)
                (other_user.location.y, other_user.location.x)
            ).km

            if dist <= radius_km:
                other_interests = set(other_user.profile.interests or [])
                nearby_users.append(other_user) #TODO remove later

                # if interests & other_interests:  # at least one interest overlaps
                #     other_user.distance_km = round(dist, 1)
                #     nearby_users.append(other_user)
            
        serializer = UserSerializer.UserFeedSerializer(nearby_users, many=True)
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
            conversation = room,
            sender=sender,
            content=data['content']
        )
        message_serializer.is_valid(raise_exception=True)


class ConversationViewset(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer.ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field ='uid'

    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object() 
        
        serializer = ConversationSerializer.ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data)

class TokenObtainPairView(SimpleJWTTokenObtainPairView):
     serializer_class = TokenObtainSerializer
 
     def post(self, request, *args, **kwargs) -> Response:
         return super().post(request, *args, **kwargs)