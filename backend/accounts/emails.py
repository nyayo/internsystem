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

    def send_account_suspended_email(user):
      """Notify a user that their account has been suspended."""
    _send(
        subject   = "Account suspended -- InternSystem",
        message   = (
            f"Hello {user.first_name},\n\n"
            f"Your InternSystem account has been suspended.\n"
            f"If you believe this is an error, please contact your "
            f"internship administrator.\n"
            f"Email: {settings.DEFAULT_FROM_EMAIL}"
            f"{_footer()}"
        ),
        recipient = user.email,
    )


# ── Placement notifications ───────────────────────────────────────

def send_placement_submitted_email(placement):
    """
    Notify the administrator that a student has submitted a placement
    application for review.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admins = User.objects.filter(
        role="internship_administrator",
        account_status="active",
    )
    student = placement.student
    for admin in admins:
        _send(
            subject   = f"New placement application -- {student.get_full_name()}",
            message   = (
                f"Hello {admin.first_name},\n\n"
                f"{student.get_full_name()} ({student.student_number}) has submitted "
                f"a placement application for review.\n\n"
                f"Organisation: {placement.organisation_name}\n"
                f"District:     {placement.organisation_district}\n"
                f"Start date:   {placement.start_date}\n"
                f"End date:     {placement.end_date}\n\n"
                f"Please log in to review and approve or reject the application:\n"
                f"{settings.FRONTEND_URL}/admin/placements/{placement.id}/"
                f"{_footer()}"
            ),
            recipient = admin.email,
        )
        def send_placement_approved_email(placement):
    
         """Notify the student and both supervisors that a placement has been approved."""
    
    student = placement.student
    _send(
        subject   = "Your placement has been approved -- InternSystem",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Great news! Your internship placement at "
            f"{placement.organisation_name} has been approved.\n\n"
            f"Details:\n"
            f"  Organisation:       {placement.organisation_name}\n"
            f"  Department:         {placement.department}\n"
            f"  Start date:         {placement.start_date}\n"
            f"  End date:           {placement.end_date}\n"
            f"  Academic supervisor:{placement.academic_supervisor.get_full_name()}\n"
            f"  Intake cohort:      {placement.get_intake_cohort_display()}\n\n"
            f"Log in to view your placement dashboard:\n"
            f"{settings.FRONTEND_URL}/student/placement/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )

    # Notify academic supervisor
    if placement.academic_supervisor:
        ac_sup = placement.academic_supervisor
        _send(
            subject   = f"New student assigned -- {student.get_full_name()}",
            message   = (
                f"Hello {ac_sup.first_name},\n\n"
                f"You have been assigned as the academic supervisor for "
                f"{student.get_full_name()} ({student.student_number}).\n\n"
                f"Organisation: {placement.organisation_name}\n"
                f"Start date:   {placement.start_date}\n"
                f"End date:     {placement.end_date}\n\n"
                f"Log in to view the placement:\n"
                f"{settings.FRONTEND_URL}/academic/placements/{placement.id}/"
                f"{_footer()}"
            ),
            recipient = ac_sup.email,
        )

    # Send invite to workplace supervisor
    _send(
        subject   = f"Internship supervisor invitation -- {student.get_full_name()}",
        message   = (
            f"Hello {placement.wp_supervisor_name},\n\n"
            f"You have been listed as the workplace supervisor for "
            f"{student.get_full_name()} during their internship at "
            f"{placement.organisation_name}.\n\n"
            f"Please register on InternSystem to review and endorse "
            f"the student's weekly logs:\n"
            f"{settings.FRONTEND_URL}/register/\n\n"
            f"Use the email address this message was sent to when registering."
            f"{_footer()}"
        ),
        recipient = placement.wp_supervisor_email,
    )


def send_placement_rejected_email(placement):
    """Notify the student that their placement was rejected."""
    student = placement.student
    _send(
        subject   = "Placement application not approved -- InternSystem",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Unfortunately your placement application at "
            f"{placement.organisation_name} was not approved.\n\n"
            f"Reason: {placement.rejection_reason}\n\n"
            f"You may edit your application and resubmit:\n"
            f"{settings.FRONTEND_URL}/student/placement/apply/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )