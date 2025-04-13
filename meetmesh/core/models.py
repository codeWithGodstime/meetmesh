from django.db import models
from django.contrib.auth import get_user_model
from utilities.utils import BaseModelMixin
from utilities import choices


User = get_user_model()

class Conversation(BaseModelMixin):
    participants = models.ManyToManyField("user.User", related_name='conversations')

    def get_receiver(self, current_user):
        return self.participants.exclude(id=current_user.id).first()
    
    @classmethod
    def get_room(cls, receiver, sender):
        if not receiver or not sender:
            raise ValueError("Receiver and sender must be provided")

        conversation = cls.objects.filter(participants=receiver).filter(participants=sender).first()

        if not conversation:
            conversation = cls.objects.create()
            conversation.participants.add(receiver, sender)

        return conversation

class Message(BaseModelMixin):
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default='deleted_account_user', related_name='message_sender')
    is_read = models.BooleanField(default=False)
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created_at']