from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import WeeklyLogs

@receiver(post_save, sender=WeeklyLogs)
def log_status_changed(sender, instance, created, **kwargs):
    """
    Fires after every WeeklyLogs save.
    Dispatches a notification task when the log status changes.
    """
    if created:
        return

    original = getattr(instance, "_WeeklyLogs__original_status", None)
    current  = instance.status

    if original == current:
        return

    instance.__original_status = current