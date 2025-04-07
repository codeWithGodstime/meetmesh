import uuid
from django.db import models

def generate_uuid():
    return str(uuid.uuid4())


class BaseModelMixin(models.Model):

    uid = models.CharField(max_length=300, unique=True, db_index=True, default=generate_uuid)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']