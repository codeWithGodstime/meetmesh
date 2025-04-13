from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
     TokenRefreshView,
     TokenVerifyView,
     TokenBlacklistView
 )

from .views import UserViewset, TokenObtainPairView, UserPreferenceViewset, ProfileViewset
from .consumer import ChatConsumer

router = DefaultRouter()
router.register("users", UserViewset, basename="users")
router.register("preferences", UserPreferenceViewset, basename='preferences')
router.register("profile", ProfileViewset, basename="profile")

urlpatterns = [

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
     path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
] + router.urls


websocket_urlpatterns = [
    path('ws/chat/', ChatConsumer.as_asgi()),
]