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


@shared_task(name="evaluations.tasks.notify_pending_evaluations")
def notify_pending_evaluations():
    """
    Runs daily at 08:30 EAT.
    Sends two types of reminders:
      1. Workplace supervisors whose evaluation is not_started or in_progress
         and the placement is past its midpoint or end date.
      2. Academic supervisors with evaluations sitting in submitted status
         for more than 3 days.
    """
    from .models import Evaluation
    from accounts.emails import (
        send_evaluation_due_email,
        send_evaluation_pending_reminder_email,
    )

    today    = timezone.localdate()
    now      = timezone.now()
    three_days = now - timezone.timedelta(days=3)

    # Due evaluations — midterm past midpoint, final past end date
    due_midterm = Evaluation.objects.filter(
        evaluation_type = "midterm",
        status__in      = ("not_started", "in_progress"),
        placement__status = "active",
    ).select_related(
        "placement__workplace_supervisor",
        "placement__student",
        "placement",
    )

    due_final = Evaluation.objects.filter(
        evaluation_type  = "final",
        status__in       = ("not_started", "in_progress"),
        placement__status = "active",
        placement__end_date__lte = today,
    ).select_related(
        "placement__workplace_supervisor",
        "placement__student",
        "placement",
    )

    due_count = 0
    for evaluation in due_midterm:
        placement = evaluation.placement
        # Midterm is due when past the midpoint of the internship
        if placement.start_date and placement.end_date:
            total_days    = (placement.end_date - placement.start_date).days
            midpoint_date = placement.start_date + timezone.timedelta(days=total_days // 2)
            if today >= midpoint_date:
                send_evaluation_due_email(evaluation)
                due_count += 1

    for evaluation in due_final:
        send_evaluation_due_email(evaluation)
        due_count += 1

    # Pending acknowledgement — submitted more than 3 days ago
    pending_ack = Evaluation.objects.filter(
        status       = "submitted",
        submitted_at__lte = three_days,
    ).select_related(
        "placement__academic_supervisor",
        "placement__student",
    )

    pending_count = 0
    for evaluation in pending_ack:
        send_evaluation_pending_reminder_email(evaluation)
        pending_count += 1

    return (
        f"Evaluation reminders sent: "
        f"{due_count} due, {pending_count} pending acknowledgement."
    )
