import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from faker import Faker
from django.core.files.base import ContentFile
from django.db.models.signals import post_save
from django.core.files.uploadedfile import SimpleUploadedFile
import io

from user.models import User, Profile, UserPreference

from user.signals import create_user_related_models
from django_countries.fields import Country

fake = Faker()


post_save.disconnect(create_user_related_models, sender=User)


def fetch_image_file(url, name="image.jpg"):
    response = requests.get(url)
    if response.status_code == 200:
        return SimpleUploadedFile(
            name,
            response.content,
            content_type='image/jpeg'
        )
    return None

# Sample Nigerian cities with coordinates
NIGERIAN_CITIES = [
    {"name": "Lagos", "lat": 6.5244, "lng": 3.3792},
    {"name": "Abuja", "lat": 9.0579, "lng": 7.4951},
    {"name": "Kano", "lat": 12.0022, "lng": 8.5919},
    {"name": "Ibadan", "lat": 7.3775, "lng": 3.9470},
    {"name": "Port Harcourt", "lat": 4.8156, "lng": 7.0498},
    {"name": "Enugu", "lat": 6.5246, "lng": 7.5187},
    {"name": "Uyo", "lat": 4.9057, "lng": 7.8537}
]

INTEREST_POOL = [
    "Music", "Art", "Gaming", "Football", "Tech", "Startups",
    "Movies", "Dancing", "Writing", "Cooking", "Traveling",
    "Reading", "Photography", "Politics", "Volunteering"
]

class Command(BaseCommand):
    help = "Seed the database with fake users"

    def add_arguments(self, parser):
        parser.add_argument(
            '--total', type=int, default=10,
            help='Number of users to create (default: 10)'
        )

    def handle(self, *args, **options):
        total = options['total']
        created_count = 0

        for _ in range(total):
            city = random.choice(NIGERIAN_CITIES)
            interests = random.sample(INTEREST_POOL, k=5)

            def randomize_coordinates(lat, lng, max_offset_km=100):
                # 1 degree ≈ 111 km, so we offset by ≈ max_offset_km / 111
                offset = max_offset_km / 111  # ~0.045 for 5km
                randomized_lat = lat + random.uniform(-offset, offset)
                randomized_lng = lng + random.uniform(-offset, offset)
                return randomized_lat, randomized_lng

            lat, lng = randomize_coordinates(city["lat"], city["lng"])

            email = fake.unique.email()
            first_name = fake.first_name()
            last_name = fake.last_name()
            username = fake.unique.user_name()

            user = User.objects.create_user(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
                city=city["name"],
                country="NG",
                base_location=Point(lng, lat),
                current_location=Point(lng, lat),
                gender=random.choice(["MALE", "FEMALE"]),
                password="timetokill",
                has_completed_onboarding=True,
                is_verified=False
            )

            SOCIAL_PLATFORMS = ["LinkedIn", "Twitter", "Instagram", "GitHub", "Facebook"]

            social_links = [
                {
                    "name": platform,
                    "profile_url": f"https://{platform.lower()}.com/{username}"
                }
                for platform in random.sample(SOCIAL_PLATFORMS, k=random.randint(2, 4))
            ]

            profile_image_url = f"https://i.pravatar.cc/300?u={username}"
            banner_image_url = f"https://picsum.photos/seed/{username}/800/200"

            profile_image = fetch_image_file(profile_image_url, name=f"{username}_profile.jpg")
            banner_image = fetch_image_file(banner_image_url, name=f"{username}_banner.jpg")

            Profile.objects.create(
                user=user,
                bio=fake.sentence(),
                interests=interests,
                occupation=fake.job(),
                social_links=social_links,
                profile_image=profile_image,
                banner_image=banner_image
            )

            UserPreference.objects.create(
                user=user
            )

            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created user: {email}"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully created {created_count} users!"))
