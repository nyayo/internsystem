from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Evaluation, EvaluationCriteria
from placements.models import InternshipPlacement


@receiver(post_save, sender=Evaluation)
def evaluation_status_changed(sender, instance, created, **kwargs):
    """
    Fires after every Evaluation save.
    Dispatches a notification task when the evaluation status changes.
    """
    if created:
        return

    original = getattr(instance, "_Evaluation__original_status", None)
    current  = instance.status

    if original == current:
        return

    instance.__original_status = current