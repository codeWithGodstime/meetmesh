from django.db import models
from django.utils.translation import gettext_lazy as _


class NotificationType(models.TextChoices):
    PROXIMITY_ALERT = "PROXIMITY_ALERT", _("Proximity Alert")
    NEW_MESSAGE = "NEW_MESSAGE", _("New message")
    PROFILE_VIEW = "PROFILE_VIEW", _("Profile_view")
    MEETUP_INVITE = 'MEETUP_INVITE', _("Meetup invite")

class GenderType(models.TextChoices):
    MALE = "MALE", _("Male")
    FEMALE = "FEMALE", _("Female")

class ProfileStatus(models.TextChoices):
    OPEN_TO_MEET = "OPEN_TO_MEET", _("Open to meet")
    BUSY = "BUSY", _("Busy")
    EXPLORING = "EXPLORING", _("Exploring")

class WhoCanDiscover(models.TextChoices):
    EVERYONE = 'EVERYONE'
    VERIFIED_USER = 'VERIFIED_USER'
    ONLY_ME = 'ONLY_ME'