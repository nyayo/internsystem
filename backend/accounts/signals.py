from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    """
    Central signal handler for all CustomUser save events.
    Handles two cases:
      1. New user created     → send verification email
      2. Existing user saved  → check what changed and dispatch accordingly
    """
    if created:
        _handle_new_registration(instance)
    else:
        _handle_existing_user_update(instance)

def _handle_new_registration(user):
    """
    Fires once when a new user account is created.
    Sends the email verification link asynchronously.
    """
    from accounts.tasks import send_verification_email_task
    send_verification_email_task.delay(user.id)

def _handle_existing_user_update(user):
    """
    Fires when an existing user is saved.
    Checks account_status for changes and dispatches the
    appropriate notification task.
    """
    from accounts.tasks import (
        send_welcome_email_task,
        send_account_status_email_task,
    )

    original_status = getattr(
        user, "_CustomUser__original_account_status", None
    )
    current_status  = user.account_status

    # No account_status change -- nothing to do
    if original_status == current_status:
        return

    # Update the tracker so repeated saves do not re-fire
    user.__original_account_status = current_status

    # registered → active: welcome email (first activation)
    if original_status == "registered" and current_status == "active":
        send_welcome_email_task.delay(user.id)
        return

    # suspended → active: reinstatement email
    # active → suspended: suspension email
    # any → deactivated: deactivation email
    notifiable_transitions = {
        ("active",     "suspended"),
        ("suspended",  "active"),
        ("active",     "deactivated"),
        ("suspended",  "deactivated"),
        ("registered", "deactivated"),
    }

    if (original_status, current_status) in notifiable_transitions:
        send_account_status_email_task.delay(user.id, current_status)