from django.db import models
from django.conf import settings


class InternshipPlacement(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,related_name='placements',
    limit_choices_to={'role': 'student'})
    organisation_name = models.CharField(max_length=255)
    organisation_type = models.CharField(max_length=20)
    organisation_district = models.CharField(max_length=100)
    organisation_address = models.TextField(blank=True)
    department = models.CharField(max_length=200)
    wp_supervisor_name = models.CharField(max_length=200)
    wp_supervisor_email = models.EmailField()
    wp_supervisor_phone = models.CharField(max_length=20)
    wp_supervisor_title = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20)
    rejection_reason = models.TextField(blank=True, null=True)
    withdrawal_reason = models.TextField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    activated_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
