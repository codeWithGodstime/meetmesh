from django.db import models
from django.utils.translation import gettext_lazy as _


class NotificationType(models.TextChoices):
    PROXIMITY_ALERT = "PROXIMITY_ALERT", _("Proximity Alert")
    NEW_MESSAGE = "NEW_MESSAGE", _("New message")

