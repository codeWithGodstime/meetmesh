from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django_countries.fields import CountryField
from user.manager import CustomUserManager
from utilities.utils import BaseModelMixin
from utilities.choices import NotificationType


class User(AbstractUser, BaseModelMixin):

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=300, blank=False, null=False)
    last_name = models.CharField(max_length=300, blank=False, null=False)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    city = models.CharField(max_length=30, null=True, blank=True)
    country = CountryField(blank=True, null=True)

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
    bio = models.TextField()
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField()
    location_visibility = models.BooleanField(default=False)
    social_links = models.JSONField(blank=True, null=True, default=list)
    """
    [
    {
        "name": linkedin,
        "profile_url": ""
    }, ...
    ]
    """
    occupation = models.CharField(max_length=300)


class NotificationSetting(BaseModelMixin):
    notify_on_proximity = models.BooleanField(default=True)
    notify_radius_km = models.FloatField()


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

class Conversation(BaseModelMixin):
    participants = models.ManyToManyField(User, related_name='conversations')


class Message(BaseModelMixin):
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default='deleted_account_user', related_name='message_sender')
    is_read = models.BooleanField(default=False)
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
