# Generated by Django 5.2 on 2025-04-09 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_message_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreference',
            name='meetup_periods',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
