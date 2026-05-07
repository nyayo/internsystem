from celery import shared_task


@shared_task(name="accounts.tasks.send_verification_email_task")
def send_verification_email_task(user_id):
    """
    Sends the email verification link to a newly registered user.
    Triggered by the post_save signal on CustomUser when created=True.
    """
    from django.contrib.auth import get_user_model
    from accounts.tokens import generate_email_verification_token
    from accounts.emails import send_verification_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    token = generate_email_verification_token(user)
    send_verification_email(user, token)
    return f"Verification email sent to {user.email}."

@shared_task(name="accounts.tasks.send_password_reset_email_task")
def send_password_reset_email_task(user_id):
    """
    Sends the password reset link.
    Triggered from the ForgotPasswordView, not from a signal,
    because it is an explicit user action rather than a model state change.
    """
    from django.contrib.auth import get_user_model
    from accounts.tokens import password_reset_token
    from accounts.emails import send_password_reset_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    token = password_reset_token.make_token(user)
    send_password_reset_email(user, token)
    return f"Password reset email sent to {user.email}"


@shared_task(name="accounts.tasks.send_welcome_email_task")
def send_welcome_email_task(user_id):
    """
    Sends the welcome email after account activation.
    Triggered by the signal when account_status changes to active.
    """
    from django.contrib.auth import get_user_model
    from accounts.emails import send_welcome_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    send_welcome_email(user)
    return f"Welcome email sent to {user.email}."

@shared_task(name="accounts.tasks.send_password_changed_email_task")
def send_password_changed_email_task(user_id):
    """
    Sends a security notification after a password change.
    Triggered from ChangePasswordView and ResetPasswordView
    after the new password is saved.
    """
    from django.contrib.auth import get_user_model
    from accounts.emails import send_password_changed_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    send_password_changed_email(user)
    return f"Password changed notification sent to {user.email}."

@shared_task(name="accounts.tasks.send_account_status_email_task")
def send_account_status_email_task(user_id, new_status):
    """
    Sends the correct account status email based on the new status.
    Triggered by the signal when account_status changes.

    Handles: suspended, reactivated (active from suspended), deactivated.
    Welcome email (registered → active) is handled by send_welcome_email_task.
    """
    from django.contrib.auth import get_user_model
    from accounts.emails import (
        send_account_suspended_email,
        send_account_reactivated_email,
        send_account_deactivated_email,
    )

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    handlers = {
        "suspended":   send_account_suspended_email,
        "deactivated": send_account_deactivated_email,
        "active":      send_account_reactivated_email,
    }

    handler = handlers.get(new_status)
    if handler:
        handler(user)
        return f"Account status email ({new_status}) sent to {user.email}."
    return f"No email configured for account_status: {new_status}."