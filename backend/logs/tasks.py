from celery import shared_task
from django.utils import timezone

@shared_task(name="logs.tasks.notify_log_status_change")
def notify_log_status_change(log_id):
    """
    Triggered from a view after a log status change.
    Dispatches the correct email based on the current log status.
    """
    from .models import WeeklyLogs
    from accounts.emails import (
        send_log_submitted_email,
        send_log_endorsed_email,
        send_log_returned_email,
        send_log_assessed_email,
    )

    try:
        log = WeeklyLogs.objects.select_related(
            "placement__student",
            "placement__workplace_supervisor",
            "placement__academic_supervisor",
        ).get(id=log_id)
    except WeeklyLogs.DoesNotExist:
        return f"Log {log_id} not found."

    handlers = {
        "submitted": send_log_submitted_email,
        "endorsed":  send_log_endorsed_email,
        "resubmit":  send_log_returned_email,
        "assessed":  send_log_assessed_email,
    }

    handler = handlers.get(log.status)
    if handler:
        handler(log)
        return f"Notification sent for log {log_id} — status: {log.status}."
    return f"No notification configured for status: {log.status}."