from celery import shared_task
from django.utils import timezone

@shared_task(name="evaluations.tasks.create_evaluations_for_active_placements")
def create_evaluations_for_active_placements():
    """
    Runs daily at 07:15 EAT.
    Creates midterm and final Evaluation records for any active placement
    that does not already have them.
    Uses get_or_create so it is safe to run multiple times.
    """
    from placements.models import InternshipPlacement
    from .models import Evaluation

    active_placements = InternshipPlacement.objects.filter(
        status="active",
        workplace_supervisor__isnull=False,
    )

    created_count = 0
    for placement in active_placements:
        for eval_type in ("midterm", "final"):
            _, created = Evaluation.objects.get_or_create(
                placement       = placement,
                evaluator       = placement.workplace_supervisor,
                evaluation_type = eval_type,
                defaults        = {"status": "not_started"},
            )
            if created:
                created_count += 1

    return f"Created {created_count} new evaluation record(s)."


@shared_task(name="evaluations.tasks.notify_evaluation_status_change")
def notify_evaluation_status_change(evaluation_id):
    """
    Triggered from a view after an evaluation status change.
    Dispatches the correct email based on the current evaluation status.
    """
    from .models import Evaluation
    from accounts.emails import (
        send_evaluation_submitted_email,
        send_evaluation_acknowledged_email,
    )

    try:
        evaluation = Evaluation.objects.select_related(
            "placement__student",
            "placement__workplace_supervisor",
            "placement__academic_supervisor",
        ).get(id=evaluation_id)
    except Evaluation.DoesNotExist:
        return f"Evaluation {evaluation_id} not found."

    handlers = {
        "submitted":    send_evaluation_submitted_email,
        "acknowledged": send_evaluation_acknowledged_email,
    }

    handler = handlers.get(evaluation.status)
    if handler:
        handler(evaluation)
        return (
            f"Notification sent for evaluation {evaluation_id} "
            f"— status: {evaluation.status}."
        )
    return f"No notification configured for status: {evaluation.status}."
