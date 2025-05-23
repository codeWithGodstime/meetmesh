from django.contrib.gis.db import models
from django.db.models import Q
from django.core.cache import cache
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django_countries.fields import CountryField
from user.manager import CustomUserManager
from utilities.utils import BaseModelMixin
from utilities import choices
from utilities.choices import NotificationType, GenderType, ProfileStatus



class User(BaseModelMixin, AbstractUser):

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=300, blank=False, null=False)
    last_name = models.CharField(max_length=300, blank=False, null=False)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    city = models.CharField(max_length=60, null=True, blank=True)
    country = CountryField(blank=True, null=True, max_length=100)
    base_location = models.PointField(blank=True, null=True)
    current_location = models.PointField(blank=True, null=True) # would be the browser location to get user current location
    has_completed_onboarding = models.BooleanField(default=False)

    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    gender = models.CharField(max_length=10, choices=GenderType.choices)

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
        from core import models 
        return models.Conversation.objects.filter(
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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    banner_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True, default=list)
    status = models.CharField(max_length=20, choices=ProfileStatus.choices, default="OPEN TO MEET")
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


class UserPreference(BaseModelMixin):
    notify_on_proximity = models.BooleanField(default=True, null=True, blank=True)
    notify_radius_km = models.FloatField(blank=True, default=500.0, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_preference")
    show_email = models.BooleanField(default=False, null=True, blank=True)
    dark_theme = models.BooleanField(default=False, null=True, blank=True)
    
    who_can_discover_me = models.CharField(max_length=20, choices=choices.WhoCanDiscover.choices, default=choices.WhoCanDiscover.EVERYONE)
    show_profile_of_people_meet = models.BooleanField(default=False, null=True, blank=True)
    only_verified_user_can_message = models.BooleanField(default=False, null=True, blank=True)
    auto_accept_meetup_request = models.BooleanField(default=False, null=True, blank=True)
    notify_on_profile_view = models.BooleanField(default=False, null=True, blank=True)
    notify_on_meetup_invites = models.BooleanField(default=False, null=True, blank=True)
    require_profile_completion = models.BooleanField(default=False, null=True, blank=True)


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


