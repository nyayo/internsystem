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

def send_placement_activated_email(placement):
     """Notify the student that their internship is now active."""
    student = placement.student
    _send(
        subject   = "Your internship has started -- InternSystem",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Your internship at {placement.organisation_name} is now active.\n\n"
            f"You should begin submitting your weekly logs every Friday.\n"
            f"Log in to your dashboard to get started:\n"
            f"{settings.FRONTEND_URL}/student/dashboard/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )


def send_placement_completed_email(placement):
    """Notify the student that their placement has been marked complete."""
    student = placement.student
    _send(
        subject   = "Internship completed -- InternSystem",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Your internship at {placement.organisation_name} has been "
            f"marked as completed. Well done!\n\n"
            f"You can view your final evaluation and grades on your dashboard:\n"
            f"{settings.FRONTEND_URL}/student/dashboard/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )
    def send_log_submitted_email(log):
     """
    Notify the workplace supervisor that a student has submitted
    a weekly log for review.
    """
    wp_sup   = log.placement.workplace_supervisor
    student  = log.placement.student
    if not wp_sup:
        return
    _send(
        subject   = (
            f"Weekly log to review -- {student.get_full_name()} "
            f"Week {log.week_number}"
        ),
        message   = (
            f"Hello {wp_sup.first_name},\n\n"
            f"{student.get_full_name()} has submitted their Week {log.week_number} "
            f"log ({log.week_start_date} to {log.week_end_date}) "
            f"for your review.\n\n"
            f"Please log in to endorse or return the log:\n"
            f"{settings.FRONTEND_URL}/workplace/logs/{log.id}/"
            f"{_footer()}"
        ),
        recipient = wp_sup.email,
    )

    def send_log_endorsed_email(log):
     """
    Notify the academic supervisor that a log has been endorsed
    and is ready for grading.
    """
        ac_sup  = log.placement.academic_supervisor
        student = log.placement.student
        if not ac_sup:
            return
        _send(
            subject   = (
                f"Log endorsed -- {student.get_full_name()} "
                f"Week {log.week_number}"
            ),
            message   = (
                f"Hello {ac_sup.first_name},\n\n"
                f"{student.get_full_name()}'s Week {log.week_number} log has been "
                f"endorsed by the workplace supervisor and is ready for your assessment.\n\n"
                f"Workplace comment:\n\"{log.workplace_comment}\"\n\n"
                f"Please log in to grade the log:\n"
                f"{settings.FRONTEND_URL}/academic/logs/{log.id}/"
                f"{_footer()}"
            ),
            recipient = ac_sup.email,
        )

    def send_log_returned_email(log):
     """
    Notify the student that their log has been returned for revision.
    """
        student = log.placement.student
        _send(
            subject   = (
                f"Weekly log returned for revision -- Week {log.week_number}"
            ),
            message   = (
                f"Hello {student.first_name},\n\n"
                f"Your Week {log.week_number} log has been returned by your "
                f"workplace supervisor for revision.\n\n"
                f"Supervisor comment:\n\"{log.workplace_comment}\"\n\n"
                f"Please update and resubmit your log:\n"
                f"{settings.FRONTEND_URL}/student/logs/{log.id}/"
                f"{_footer()}"
            ),
            recipient = student.email,
        )

def send_log_assessed_email(log):
     
    """Notify the student that their log has been graded by the
    academic supervisor."""
        
    student = log.placement.student
    _send(
        subject   = f"Log graded -- Week {log.week_number}",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Your Week {log.week_number} log has been assessed by your "
            f"academic supervisor.\n\n"
            f"Grade:   {log.academic_grade}%\n"
            f"Comment: {log.academic_comment or 'No comment provided.'}\n\n"
            f"Log in to view your assessment:\n"
            f"{settings.FRONTEND_URL}/student/logs/{log.id}/"
            f"{_footer()}"
            ),
            recipient = student.email,
        )
    
def send_log_overdue_email(log):
    """
    Remind the student that a weekly log is overdue.
    Sent by the Celery beat task.
    """
    student = log.placement.student
    _send(
        subject   = f"Overdue weekly log -- Week {log.week_number}",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Your Week {log.week_number} log "
            f"({log.week_start_date} to {log.week_end_date}) "
            f"has not been submitted yet.\n\n"
            f"Please submit it as soon as possible to avoid falling behind:\n"
            f"{settings.FRONTEND_URL}/student/logs/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )


def send_log_pending_endorsement_email(log):
    """
    Remind the workplace supervisor of a submitted log awaiting endorsement.
    Sent by the Celery beat task.
    """
    wp_sup  = log.placement.workplace_supervisor
    student = log.placement.student
    if not wp_sup:
        return
    _send(
        subject   = (
            f"Reminder: log pending your endorsement -- "
            f"{student.get_full_name()} Week {log.week_number}"
        ),
        message   = (
            f"Hello {wp_sup.first_name},\n\n"
            f"A reminder that {student.get_full_name()}'s Week {log.week_number} "
            f"log is still waiting for your endorsement.\n\n"
            f"Please log in to review it:\n"
            f"{settings.FRONTEND_URL}/workplace/logs/{log.id}/"
            f"{_footer()}"
        ),
        recipient = wp_sup.email,
    )


def send_evaluation_due_email(evaluation):
    """
    Notify the workplace supervisor that an evaluation is due.
    Sent by the Celery beat task at the midpoint or end of the placement.
    """
    wp_sup  = evaluation.placement.workplace_supervisor
    student = evaluation.placement.student
    if not wp_sup:
        return
    eval_type = evaluation.get_evaluation_type_display()
    _send(
        subject   = (
            f"{eval_type} evaluation due -- {student.get_full_name()}"
        ),
        message   = (
            f"Hello {wp_sup.first_name},\n\n"
            f"The {eval_type.lower()} evaluation for "
            f"{student.get_full_name()} is now due.\n\n"
            f"Please log in to complete the evaluation form:\n"
            f"{settings.FRONTEND_URL}/workplace/evaluations/{evaluation.id}/"
            f"{_footer()}"
        ),
        recipient = wp_sup.email,
    )


def send_evaluation_submitted_email(evaluation):
    """
    Notify the academic supervisor that a workplace evaluation has
    been submitted and is ready for acknowledgement.
    """
    ac_sup  = evaluation.placement.academic_supervisor
    student = evaluation.placement.student
    if not ac_sup:
        return
    eval_type = evaluation.get_evaluation_type_display()
    _send(
        subject   = (
            f"{eval_type} evaluation submitted -- {student.get_full_name()}"
        ),
        message   = (
            f"Hello {ac_sup.first_name},\n\n"
            f"The {eval_type.lower()} evaluation for {student.get_full_name()} "
            f"has been submitted by the workplace supervisor.\n\n"
            f"Total score:    {evaluation.total_score} / 100\n"
            f"Overall remarks: {evaluation.overall_remarks or 'None provided.'}\n\n"
            f"Please log in to review and acknowledge the evaluation:\n"
            f"{settings.FRONTEND_URL}/academic/evaluations/{evaluation.id}/"
            f"{_footer()}"
        ),
        recipient = ac_sup.email,
    )


def send_evaluation_acknowledged_email(evaluation):
    """
    Notify the student that their evaluation has been acknowledged
    by the academic supervisor.
    """
    student   = evaluation.placement.student
    eval_type = evaluation.get_evaluation_type_display()
    _send(
        subject   = f"{eval_type} evaluation acknowledged -- InternSystem",
        message   = (
            f"Hello {student.first_name},\n\n"
            f"Your {eval_type.lower()} evaluation has been reviewed and "
            f"acknowledged by your academic supervisor.\n\n"
            f"Total score:          {evaluation.total_score} / 100\n"
            f"Acknowledgement notes: "
            f"{evaluation.acknowledgement_notes or 'None provided.'}\n\n"
            f"Log in to view your full evaluation:\n"
            f"{settings.FRONTEND_URL}/student/evaluations/{evaluation.id}/"
            f"{_footer()}"
        ),
        recipient = student.email,
    )



def send_evaluation_pending_reminder_email(evaluation):
    """
    Remind the workplace supervisor of a pending evaluation.
    Sent by the Celery beat task.
    """
    wp_sup  = evaluation.placement.workplace_supervisor
    student = evaluation.placement.student
    if not wp_sup:
        return
    eval_type = evaluation.get_evaluation_type_display()
    _send(
        subject   = (
            f"Reminder: {eval_type} evaluation pending -- "
            f"{student.get_full_name()}"
        ),
        message   = (
            f"Hello {wp_sup.first_name},\n\n"
            f"A reminder that the {eval_type.lower()} evaluation for "
            f"{student.get_full_name()} has not yet been submitted.\n\n"
            f"Please log in to complete it:\n"
            f"{settings.FRONTEND_URL}/workplace/evaluations/{evaluation.id}/"
            f"{_footer()}"
        ),
        recipient = wp_sup.email,
    )

     


