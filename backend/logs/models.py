from django.db import models
from django.conf import settings
from placements.models import InternshipPlacement


class WeeklyLogs(models.Model):
    STATUS = (
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("endorsed", "Endorsed"),
        ("resubmit", "Resubmit"),
        ("assessed", "Assessed"),
        ("closed", "Closed"),
    )

    placement = models.ForeignKey(
        InternshipPlacement,
        models.CASCADE,
        related_name="weekly_logs",
        null=True,
        blank=True,
    )
    week_number = models.PositiveSmallIntegerField()
    week_start_date = models.DateField()
    week_end_date = models.DateField()
    activities_performed = models.TextField(
        help_text="Tasks and activities done this week"
    )
    skills_gained = models.TextField(help_text="Skills or knowledge acquired")
    challenges_faced = models.TextField(
        help_text="Difficulties encountered and how resolved"
    )
    student_remarks = models.TextField(blank=True, help_text="Any additional remarks")
    status = models.CharField(max_length=20, choices=STATUS)
    workplace_remarks = models.TextField(blank=True, null=True)
    workplace_endorsed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="endorsed_logs",
        limit_choices_to={"role": "workplace_supervisor"},
    )
    workplace_endorsed_at = models.DateTimeField(blank=True, null=True)
    resubmit_reason = models.TextField(blank=True, null=True)
    academic_remarks = models.TextField(blank=True, null=True)
    academic_grade = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    academic_assessed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assessed_logs",
        limit_choices_to={"role": "academic_supervisor"},
    )
    academic_assessed_at = models.DateTimeField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Weekly Log"
        verbose_name_plural = "Weekly Logs"
        ordering = ["placement", "week_number"]
        unique_together = ("placement", "week_number")

    def __str__(self):
        return f"Week {self.week_number}--{self.placement.student.get_full_name()}"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_status = self.status
