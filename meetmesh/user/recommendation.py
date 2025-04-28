import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()



def generate_user_vectors():
    all_profiles = Profile.objects.select_related('user')

    data = []
    user_ids = []

    for profile in all_profiles:
        user = profile.user
        user_ids.append(user.id)
        data.append({
            'user_id': user.id,
            'interests': profile.interests or [],
            'occupation': profile.occupation,
            'city': user.city,
        })

    df = pd.DataFrame(data)

    interests_df = df['interests'].explode().str.strip().dropna()
    all_unique_interests = interests_df.unique()

    for interest in all_unique_interests:
        df[f'interest_{interest}'] = df['interests'].apply(lambda x: int(interest in x))

    df = pd.get_dummies(df, columns=['occupation', 'city'], dummy_na=False)

    df.drop(columns=['user_id', 'interests'], inplace=True)

    return df.to_numpy(), user_ids


def calculate_similarity(vectors):
    similarity_matrix = cosine_similarity(vectors)
    return similarity_matrix


def recommend_top_n_users(similarity_matrix, user_ids, top_n=5):
    recommendations = {}

    for i, user_id in enumerate(user_ids):

        similarity_scores = similarity_matrix[i]

        similar_users_indices = similarity_scores.argsort()[-(top_n + 1):-1]
        
        similar_user_ids = [user_ids[idx] for idx in similar_users_indices]
        
        recommendations[user_id] = similar_user_ids

    return recommendations


def get_user_recommendations(top_n=5):

    vectors, user_ids = generate_user_vectors()

    similarity_matrix = calculate_similarity(vectors)

    recommendations = recommend_top_n_users(similarity_matrix, user_ids, top_n)

    return recommendations
