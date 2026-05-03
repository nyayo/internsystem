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
