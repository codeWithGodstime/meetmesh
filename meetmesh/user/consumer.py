from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.consumer import async_to_sync
from channels.generic.http import AsyncHttpConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async


class DBHelper:
    @database_sync_to_async
    def set_user_channel_name(self):
        from .models import User

        user: User = self.user
        if user.channel_name != self.channel_name:
            user.channel_name = self.channel_name

    @database_sync_to_async
    def clear_user_channel_name(self):
        from .models import User

        user: User = self.user
        if user.is_authenticated and user.channel_name:
            user.channel_name = None


class ChatConsumer(AsyncJsonWebsocketConsumer, DBHelper):
    async def connect(self):
        from .models import User

        await self.accept()
        self.user = self.scope['user']

        if self.user.is_authenticated:
            user_conversations = await async_to_sync(self.user.conversations)

            self.conversations = set(user_conversations)
            for conv in self.conversations:
                await self.channel_layer.group(
                    conv,
                    self.channel_name
                )

        # cache the channel_name to database
        await self.set_user_channel_name()
        return super().connect()


class NotificationConsumer(AsyncHttpConsumer):
    pass