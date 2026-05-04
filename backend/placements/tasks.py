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

