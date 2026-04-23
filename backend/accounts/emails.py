"""
Email utilities for account verification and password reset.
"""
from django.conf import settings
from django.core.mail import send_mail


def send_verification_email(user, token):
    """Send email verification link to user."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    subject = "Verify your email - InternSystem"
    message = f"""
Hello {user.first_name},

Thank you for registering with InternSystem.

Please verify your email by clicking the link below:
{verification_url}

This link will expire in 24 hours.

If you did not create an account, please ignore this email.

Best regards,
InternSystem Team
"""
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def send_password_reset_email(user, token):
    """Send password reset link to user."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    subject = "Reset your password - InternSystem"
    message = f"""
Hello {user.first_name},

You requested to reset your password.

Click the link below to set a new password:
{reset_url}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email.

Best regards,
InternSystem Team
"""
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
