from celery import shared_task


@shared_task(name="accounts.tasks.send_verification_email_task")
def send_verification_email_task(user_id):
    """
    Sends the email verification link to a newly registered user.
    Triggered by the post_save signal on CustomUser when created=True.
    """
    from django.contrib.auth import get_user_model
    from accounts.tokens import email_verification_token
    from notifications.emails import send_verification_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    token = email_verification_token.make_token(user)
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
    from notifications.emails import send_password_reset_email

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
    from notifications.emails import send_welcome_email

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return f"User {user_id} not found."

    send_welcome_email(user)
    return f"Welcome email sent to {user.email}."
