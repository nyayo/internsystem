from celery import shared_task
from django.utils import timezone

@shared_task(name="placements.tasks.activate_approved_placements")
def activate_approved_placements():
    """
    Runs daily at 07:00 EAT.
    Finds all approved placements whose start_date is today or earlier
    and transitions them to active status.
    Sends activation email to the student.
    """
    from .models import InternshipPlacement
    from accounts.emails import send_placement_activated_email

    today = timezone.localdate()

    placements = InternshipPlacement.objects.filter(
        status="approved",
        start_date__lte=today,
    )

    activated = 0
    for placement in placements:
        placement.status       = "active"
        placement.activated_at = timezone.now()
        placement.save(update_fields=["status", "activated_at"])
        send_placement_activated_email(placement)
        activated += 1

    return f"Activated {activated} placement(s)."


@shared_task(name="placements.tasks.notify_placement_status_change")
def notify_placement_status_change(placement_id):
    """
    Triggered manually from a view after a status change.
    Dispatches the correct email based on the current placement status.
    """
    from .models import InternshipPlacement
    from accounts.emails import (
        send_placement_submitted_email,
        send_placement_approved_email,
        send_placement_rejected_email,
        send_placement_activated_email,
        send_placement_completed_email,
    )

    try:
        placement = InternshipPlacement.objects.get(id=placement_id)
    except InternshipPlacement.DoesNotExist:
        return f"Placement {placement_id} not found."

    handlers = {
        "pending_approval": send_placement_submitted_email,
        "approved":         send_placement_approved_email,
        "rejected":         send_placement_rejected_email,
        "active":           send_placement_activated_email,
        "completed":        send_placement_completed_email,
    }

    handler = handlers.get(placement.status)
    if handler:
        handler(placement)
        return f"Notification sent for placement {placement_id} — status: {placement.status}."
    return f"No notification configured for status: {placement.status}."

