from django.db import models


class WeeklyLogs(models.Model):
    week_number = models.PositiveSmallIntegerField()  # 1–12
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
    status = models.CharField(max_length=20)
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
