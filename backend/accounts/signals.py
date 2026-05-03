from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    """
    Central signal handler for all CustomUser save events.
    Handles two cases:
      1. New user created     → send verification email
      2. Existing user saved  → check what changed and dispatch accordingly
    """
    if created:
        _handle_new_registration(instance)
    else:
        _handle_existing_user_update(instance)

