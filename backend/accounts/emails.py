from django.conf import settings
from django.core.mail import send_mail

def _send(subject, message, recipient):
    send_mail(
        subject = subject,
        message = message,
        from_email = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [recipient],
        fail_silently  = False,
    )


def _footer():
    return "\n\nBest regards,\nInternSystem Team"


# ── Account ───────────────────────────────────────────────────────

def send_verification_email(user, token):
    """Send email verification link after registration."""
    url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    _send(
        subject   = "Verify your email -- InternSystem",
        message   = (
            f"Hello {user.first_name},\n\n"
            f"Thank you for registering with InternSystem.\n"
            f"Please verify your email by clicking the link below:\n\n"
            f"{url}\n\n"
            f"This link will expire in 24 hours.\n"
            f"If you did not create an account, please ignore this email."
            f"{_footer()}"
        ),
        recipient = user.email,
    )


def send_password_reset_email(user, token):
    """Send password reset link."""
    url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    _send(
        subject   = "Reset your password -- InternSystem",
        message   = (
            f"Hello {user.first_name},\n\n"
            f"You requested to reset your password.\n"
            f"Click the link below to set a new password:\n\n"
            f"{url}\n\n"
            f"This link will expire in 1 hour.\n"
            f"If you did not request this, please ignore this email."
            f"{_footer()}"
        ),
        recipient = user.email,
    )