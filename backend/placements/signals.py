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
    # Skip on initial creation — no status change has occurred yet
    if created:
        return

    original = getattr(instance, "_InternshipPlacement__original_status", None)
    current  = instance.status

    # No change — nothing to do
    if original == current:
        return

    # Update the tracked value so repeated saves don't re-fire
    instance.__original_status = current
