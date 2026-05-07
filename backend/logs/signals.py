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
    _dispatch_log_notification(instance, current)


def _dispatch_log_notification(log, new_status):
    from .tasks import notify_log_status_change

    notifiable_statuses = {
        "submitted",
        "endorsed",
        "resubmit",
        "assessed",
        "closed",
    }

    if new_status in notifiable_statuses:
        notify_log_status_change.delay(log.id)