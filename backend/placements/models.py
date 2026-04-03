from django.db import models
from django.conf import settings


class InternshipPlacement(models.Model):
    ORGANIZATION_TYPES = (
        ("private", "Private Company"),
        ("government", "Government Agency"),
        ("international", "International Organization"),
        ("parastatal", "Parastatal"),
        ("ngo", "Non-Governmental Organization"),
        ("other", "Other"),
    )

    REMUNERATION_TYPE = (("paid", "Paid"), ("unpaid", "Unpaid"), ("stipend", "Stipend"))

    INTAKE_COHORT = (
        ("january", "January"),
        ("april", "April"),
        ("june", "June"),
    )

    STATUS = (
        ("draft", "Draft"),
        ("pending", "Pending Approval"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
        ("active", "Active"),
        ("completed", "Completed"),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="placements",
        limit_choices_to={"role": "student"},
    )
    workplace_supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="workplace_placements",
        null=True,
        blank=True,
        limit_choices_to={"role": "workplace_supervisor"},
    )
    academic_supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="academic_placements",
        null=True,
        blank=True,
        limit_choices_to={"role": "academic_supervisor"},
    )
    approval_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="approved_placements",
        null=True,
        blank=True,
        limit_choices_to={"role": "internship_administrator"},
    )
    organisation_name = models.CharField(max_length=255)
    organisation_type = models.CharField(max_length=20, choices=ORGANIZATION_TYPES)
    organisation_district = models.CharField(max_length=100)
    organisation_address = models.TextField(blank=True)
    department = models.CharField(max_length=200)
    wp_supervisor_name = models.CharField(max_length=200)
    wp_supervisor_email = models.EmailField()
    wp_supervisor_phone = models.CharField(max_length=20)
    wp_supervisor_title = models.CharField(max_length=200, blank=True)
    academic_supervisor_name = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    intake_cohort = models.CharField(
        max_length=50, blank=True, null=True, choices=INTAKE_COHORT
    )
    remuneration_type = models.CharField(
        max_length=20, blank=True, choices=REMUNERATION_TYPE, default="unpaid"
    )
    placement_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    request_letter = models.FileField(
        upload_to="request_letters/", blank=True, null=True
    )
    acceptance_letter = models.FileField(
        upload_to="acceptance_letters/", blank=True, null=True
    )
    final_report = models.FileField(upload_to="final_reports/", blank=True, null=True)
    final_report_abstract = models.TextField(blank=True, null=True)
    report_declaration = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS, default="draft")
    rejection_reason = models.TextField(blank=True, null=True)
    withdrawal_reason = models.TextField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    activated_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.student.get_full_name()} @ {self.organisation_name} ({self.status})"
        )

    @property
    def duration_weeks(self):
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days // 7
        return None
