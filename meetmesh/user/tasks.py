import logging

from celery import shared_task
from .recommendation import generate_user_vectors, calculate_similarity, recommend_top_n_users
from geopy.geocoders import Nominatim
from django.core.exceptions import ValidationError


logger = logging.getLogger(__file__)

@shared_task
def get_recommendatation_for_new_user(user):
    # generate recommendation for user based on location, interest and occupation save to redis
    pass

@shared_task
def generate_recommendation_for_all_users():
    # would be run on schedule
    pass

@shared_task
def get_user_city_geolocation(user, city):
    if city:
        try:
            geolocator = Nominatim(user_agent="meetmesh_app")
            location = geolocator.geocode(city)
                
            if location:
                user.base_location = dict(longitude=str(location.longitude), latitude=str(location.latitude))
            else:
                raise ValidationError(f"Could not find coordinates for city: {city}")
        except Exception as e:
            logger.error(f"Could not geocode {city}", e)

