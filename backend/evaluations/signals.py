from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Evaluation
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


@receiver(post_save, sender=InternshipPlacement)
def create_evaluations_on_activation(sender, instance, created, **kwargs):
    """
    Fires when a placement is saved.
    When a placement transitions to active, immediately create the
    midterm and final Evaluation records if they do not already exist.
    This complements the Celery beat task which handles the same
    job on a schedule — this signal handles the instant creation
    so there is no delay between activation and evaluation setup.
    """
    if created:
        return

    original = getattr(instance, "_InternshipPlacement__original_status", None)
    current  = instance.status

    if original == current or current != "active":
        return

    if not instance.workplace_supervisor:
        return

    for eval_type in ("midterm", "final"):
        Evaluation.objects.get_or_create(
            placement       = instance,
            evaluator       = instance.workplace_supervisor,
            evaluation_type = eval_type,
            defaults        = {"status": "not_started"},
        )