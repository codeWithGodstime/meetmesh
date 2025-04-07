from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.consumer import async_to_sync
from channels.generic.http import AsyncHttpConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    pass


class NotificationConsumer(AsyncHttpConsumer):
    pass