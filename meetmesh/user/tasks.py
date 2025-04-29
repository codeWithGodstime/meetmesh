from celery import shared_task
from .recommendation import generate_user_vectors, calculate_similarity, recommend_top_n_users


@shared_task
def get_recommendatation_for_new_user(user):
    # generate recommendation for user based on location, interest and occupation save to redis
    pass

@shared_task
def generate_recommendation_for_all_users():
    # would be run on schedule
    pass

