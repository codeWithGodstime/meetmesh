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
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': env("POSTGRES_DBNAME"),
        'USER': env("POSTGRES_USER"),
        'PASSWORD': env("POSTGRES_PASS"),
        'HOST': env("POSTGRES_HOST"),
        'PORT': env("POSTGRES_PORT")
    } 
}

SIMPLE_JWT = {  
    "ACCESS_TOKEN_LIFETIME": timedelta(days=3), 
    "REFRESH_TOKEN_LIFETIME": timedelta(days=6),
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

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS").split(",")
CORS_ALLOW_CREDENTIALS = True

AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_STORAGE_BUCKET_NAME = "mesh"
AWS_S3_CUSTOM_DOMAIN = "localhost:9444/ui/mesh"
AWS_S3_ENDPOINT_URL = "http://meetmesh-storage:9000"  # Set the S3Ninja endpoint URL
AWS_S3_USE_SSL = False
AWS_S3_URL_PROTOCOL = "http:"

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",  # <-- For media (uploads)
        "OPTIONS": {
            "bucket_name": AWS_STORAGE_BUCKET_NAME,
            "custom_domain": AWS_S3_CUSTOM_DOMAIN,
            "endpoint_url": AWS_S3_ENDPOINT_URL,
            "use_ssl": False,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",  # <-- Local static files
    },
}

STATIC_URL = 'static/'
MEDIA_URL = f"{AWS_S3_CUSTOM_DOMAIN}/media/"
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

