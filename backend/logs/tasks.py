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


@shared_task(name="logs.tasks.notify_log_deadlines")
def notify_log_deadlines():
    """
    Runs daily at 08:00 EAT.
    Sends two types of reminders:
      1. Students who have not submitted their log for the current week.
      2. Workplace supervisors with logs sitting in submitted status
         for more than 2 days.
    """
    from .models import WeeklyLogs
    from accounts.emails import (
        send_log_overdue_email,
        send_log_pending_endorsement_email,
    )

    today    = timezone.localdate()
    now      = timezone.now()
    two_days = now - timezone.timedelta(days=2)

    # Overdue logs — draft logs whose week_end_date has passed
    overdue_logs = WeeklyLogs.objects.filter(
        status="draft",
        week_end_date__lt=today,
        placement__status="active",
    ).select_related("placement__student")

    overdue_count = 0
    for log in overdue_logs:
        send_log_overdue_email(log)
        overdue_count += 1

    # Pending endorsement — submitted more than 2 days ago
    pending_logs = WeeklyLogs.objects.filter(
        status="submitted",
        submitted_at__lte=two_days,
        placement__status="active",
    ).select_related(
        "placement__workplace_supervisor",
        "placement__student",
    )

    pending_count = 0
    for log in pending_logs:
        send_log_pending_endorsement_email(log)
        pending_count += 1

    return (
        f"Log deadline reminders sent: "
        f"{overdue_count} overdue, {pending_count} pending endorsement."
    )
    
    
@shared_task(name="logs.tasks.close_assessed_logs")
def close_assessed_logs():
    """
    Runs daily at 09:00 EAT.
    Automatically closes all logs that have been assessed.
    No further edits are permitted after closing.
    """
    from .models import WeeklyLogs

    assessed_logs = WeeklyLogs.objects.filter(status="assessed")
    count = assessed_logs.count()
    assessed_logs.update(status="closed")

    return f"Closed {count} assessed log(s)."