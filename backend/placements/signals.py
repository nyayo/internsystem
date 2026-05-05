from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import InternshipPlacement


@receiver(post_save, sender=InternshipPlacement)
def placement_status_changed(sender, instance, created, **kwargs):
    """
    Fires after every InternshipPlacement save.
    Checks whether the status actually changed before dispatching
    a notification task.
    """
    if created:
        return

    original = getattr(instance, "_InternshipPlacement__original_status", None)
    current  = instance.status

    # No change — nothing to do
    if original == current:
        return

    instance.__original_status = current

    _dispatch_placement_notification(instance, current)


def _dispatch_placement_notification(placement, new_status):
    """
    Maps a placement status to the correct notification task.
    Using a dict keeps the mapping clean and avoids a chain of if/elif.
    """
    from .tasks import notify_placement_status_change

    notifiable_statuses = {
        "pending_approval",
        "approved",
        "rejected",
        "active",
        "completed",
        "withdrawn",
    }

    if new_status in notifiable_statuses:
        notify_placement_status_change.delay(placement.id)