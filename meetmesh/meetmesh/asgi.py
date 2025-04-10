import os

# ✅ Set environment variable before anything Django-related
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meetmesh.settings.local')

import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# ✅ Setup Django explicitly (helps avoid early import issues)
django.setup()

from user.urls import websocket_urlpatterns
from .channel_auth_middleware import JWTAuthMiddlewareStack

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})
