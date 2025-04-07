from .common import *
environ.Env.read_env(os.path.join(BASE_DIR, 'env/.env.local'))

DEBUG = True
SECRET_KEY = env('SECRET_KEY')

ALLOWED_HOSTS = []

INSTALLED_APPS += [
    "debug_toolbar"
]

INTERNAL_IPS = [
    "127.0.0.1",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=2),
    "SIGNING_KEY": SECRET_KEY
}  

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 30,
}


CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS").split(",")
CORS_ALLOW_CREDENTIALS = True

STATIC_URL = 'static/'