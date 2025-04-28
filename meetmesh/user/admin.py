from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from .models import User, Profile, UserPreference


@admin.register(User)
class UserAdmin(LeafletGeoAdmin):
    ordering = ['-created_at']


admin.site.register([Profile, UserPreference])