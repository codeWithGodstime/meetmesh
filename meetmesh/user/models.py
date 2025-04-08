from django.contrib.gis.db import models
from django.db.models import Q
from django.core.cache import cache
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django_countries.fields import CountryField
from user.manager import CustomUserManager
from utilities.utils import BaseModelMixin
from utilities.choices import NotificationType


class Conversation(BaseModelMixin):
    participants = models.ManyToManyField("User", related_name='conversations')

    @classmethod
    def get_room(cls, receiver, sender):
        users = [receiver, sender]
        if len(users) < 2:
            raise ValueError("At least two users must be provided")

        ids = [x if type(x) == str else x.id for x in users]

        room_id = ".".join(ids)

        room = cls.objects.get_or_create(id=room_id)[0]
        return room


class User(BaseModelMixin, AbstractUser):

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=300, blank=False, null=False)
    last_name = models.CharField(max_length=300, blank=False, null=False)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    city = models.CharField(max_length=60, null=True, blank=True)
    country = CountryField(blank=True, null=True, max_length=100)
    location = models.PointField(blank=True, null=True)
    has_completed_onboarding = models.BooleanField(default=False)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = CustomUserManager()

    class Meta:
        ordering = ["-created_at"]

    @property
    def fullname(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def conversations(self):
        return Conversation.objects.filter(
            Q(participants=self)
        )
    
    @property
    def channel_name(self):
        key = f"user_channel_name.{self.id}"
        return cache.get(key)

    @channel_name.setter
    def channel_name(self, value):
        key = f"user_channel_name.{self.id}"
        return cache.set(key, value, 60 * 60 * 24)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(
            subject,
            message,
            from_email,
            [self.email],
            fail_silently=True,
            **kwargs,
        )


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(blank=True, null=True)
    location_visibility = models.BooleanField(default=False)
    social_links = models.JSONField(blank=True, null=True, default=list)
    gender = models.CharField(max_length=10, null=True, blank=True)
    interests = models.JSONField(blank=True, null=True, default=list)

    """
    [
    {
        "name": linkedin,
        "profile_url": ""
    }, ...
    ]
    """
    occupation = models.CharField(max_length=300, blank=True, null=True)


class NotificationSetting(BaseModelMixin):
    notify_on_proximity = models.BooleanField(default=True, null=True)
    notify_radius_km = models.FloatField(blank=True, default=500.0, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="notification_setting")


class Notification(BaseModelMixin):
    receiver = models.ForeignKey("User", on_delete=models.CASCADE, related_name='notification_receiver')
    sender = models.ForeignKey("User", on_delete=models.CASCADE, related_name='notification_sender')
    type = models.CharField(max_length=20, choices=NotificationType.choices)
    is_read = models.BooleanField(default=False)
    metadata = models.JSONField(blank=True, null=True, default=dict)
    """e.g
    {
     message: "John just arrivend in akwa reach out to him"
     sender_profile_link: mesh.com/john
    }
    """


class Message(BaseModelMixin):
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default='deleted_account_user', related_name='message_sender')
    is_read = models.BooleanField(default=False)
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
