from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLES = (
        ("student", "Student"),
        ("workplace_supervisor", "Workplace Supervisor"),
        ("academic_supervisor", "Academic Supervisor"),
        ("internship_administrator", "Internship Administrator"),
    )

    GENDER = (("male", "Male"), ("female", "Female"))

    ACCOUNT_STATUS = (
        ("registered", "Registered"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("deactivated", "Deactivated"),
    )

    phone_number = models.CharField(max_length=20, blank=True, default="")
    role = models.CharField(max_length=30, choices=ROLES)
    gender = models.CharField(max_length=20, blank=True, choices=GENDER)
    district = models.CharField(max_length=100, blank=True, default="")
    profile_photo = models.ImageField(
        upload_to="profile_photos/", blank=True,
    )
    account_status = models.CharField(max_length=20, choices=ACCOUNT_STATUS)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    student_number = models.CharField(max_length=50, blank=True, unique=True, default="")
    year_of_study = models.CharField(max_length=20, blank=True, default="")
    university = models.CharField(max_length=200, blank=True, default="")
    programme = models.CharField(max_length=200, blank=True, default="")
    job_title = models.CharField(max_length=200, blank=True, default="")
    organisation_name = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_role_display(self):
        return dict(self.ROLES).get(self.role, "Unknown Role")
