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


class Meetup(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    sender = models.ForeignKey("user.Profile", related_name='sent_meetups', on_delete=models.CASCADE)
    receiver = models.ForeignKey("user.Profile", related_name='received_meetups', on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('sender', 'receiver', 'date', 'time')

    def __str__(self):
        return f"{self.sender} → {self.receiver} on {self.date} at {self.time} ({self.status})"