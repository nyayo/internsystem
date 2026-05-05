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
    _dispatch_evaluation_notification(instance, current)


def _dispatch_evaluation_notification(evaluation, new_status):
    from .tasks import notify_evaluation_status_change

    notifiable_statuses = {
        "in_progress",
        "submitted",
        "acknowledged",
    }

    if new_status in notifiable_statuses:
        notify_evaluation_status_change.delay(evaluation.id)