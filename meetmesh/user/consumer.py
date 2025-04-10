from channels.generic.websocket import JsonWebsocketConsumer
from channels.generic.http import AsyncHttpConsumer

class DBHelper:
    def set_user_channel_name(self):
        from .models import User

        user = self.user
        if user.channel_name != self.channel_name:
            user.channel_name = self.channel_name
            user.save(update_fields=["channel_name"])

    def clear_user_channel_name(self):
        from .models import User

        user = self.user
        if user.is_authenticated and user.channel_name:
            user.channel_name = None
            user.save(update_fields=["channel_name"])

class ChatConsumer(JsonWebsocketConsumer, DBHelper):
    def connect(self):
        from .models import User

        print("Attempting WebSocket connection...")
        self.accept()
        print("WebSocket accepted ✅")

        self.user = self.scope.get("user")
        print("Connected user:", self.user)

        if self.user and self.user.is_authenticated:
            self.conversations = set(self.get_user_conversations())
            print(self.conversations, "conversations==")
            if self.conversations:
                for conv_id in self.conversations:
                    group_name = f"conversation_{conv_id}"
                    self.channel_layer.group_add(group_name, self.channel_name)
                    print(f"Added to group: {group_name}")

            self.set_user_channel_name()
        else:
            print("⚠️ Anonymous user tried to connect")

    def disconnect(self, code):
        if self.user and self.user.is_authenticated:
            for conv_id in getattr(self, "conversations", []):
                self.channel_layer.group_discard(f"conversation_{conv_id}", self.channel_name)
            self.clear_user_channel_name()

    def get_user_conversations(self):
        return list(self.user.conversations.values_list("id", flat=True))


class NotificationConsumer(AsyncHttpConsumer):
    pass  # No need to change this one yet — it's async by default
