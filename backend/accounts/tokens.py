"""
Simple token utilities for email verification and password reset.
Uses Django's built-in signing module - no extra dependencies needed.
"""
from django.core import signing
from django.conf import settings

EMAIL_VERIFY_TOKEN_MAX_AGE = 60 * 60 * 24  # 24 hours
PASSWORD_RESET_TOKEN_MAX_AGE = 60 * 60  # 1 hour


def generate_email_verification_token(user):
    """Generate a signed token for email verification."""
    return signing.dumps(
        {'user_id': user.id, 'email': user.email, 'purpose': 'email_verify'},
        salt='email-verification'
    )


def verify_email_token(token):
    """
    Verify an email verification token.
    Returns user_id if valid, None otherwise.
    """
    try:
        data = signing.loads(
            token,
            salt='email-verification',
            max_age=EMAIL_VERIFY_TOKEN_MAX_AGE
        )
        if data.get('purpose') != 'email_verify':
            return None
        return data.get('user_id')
    except signing.BadSignature:
        return None


def generate_password_reset_token(user):
    """Generate a signed token for password reset."""
    return signing.dumps(
        {'user_id': user.id, 'email': user.email, 'purpose': 'password_reset'},
        salt='password-reset'
    )


def verify_password_reset_token(token):
    """
    Verify a password reset token.
    Returns user_id if valid, None otherwise.
    """
    try:
        data = signing.loads(
            token,
            salt='password-reset',
            max_age=PASSWORD_RESET_TOKEN_MAX_AGE
        )
        if data.get('purpose') != 'password_reset':
            return None
        return data.get('user_id')
    except signing.BadSignature:
        return None
