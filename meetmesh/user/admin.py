from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from .models import User, Profile, NotificationSetting


@admin.register(User)
class UserAdmin(LeafletGeoAdmin):
    pass

admin.site.register([Profile, NotificationSetting])