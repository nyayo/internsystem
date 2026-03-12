from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20)
    role = models.CharField(max_length=30)
    gender = models.CharField(max_length=20, blank=True)
    district = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    account_status = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    student_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    programme = models.CharField(max_length=200, blank=True, null=True)
    job_title = models.CharField(max_length=200, blank=True, null=True)
    organisation_name = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
