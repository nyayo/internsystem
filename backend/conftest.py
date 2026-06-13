import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from placements.models import InternshipPlacement
from evaluations.models import Evaluation, EvaluationCriteria, EvaluationScore
from logs.models import WeeklyLogs

User = get_user_model()


# ── User factories ────────────────────────────────────────────────

@pytest.fixture
def make_user():
    """
    Factory fixture. Returns a callable that creates a CustomUser
    with any role and account_status=active by default.
    Usage: make_user(role="student")
    """
    def _make(role="student", **kwargs):
        defaults = {
            "email":          f"{role}_{User.objects.count()}@test.ug",
            "username":       f"{role}_{User.objects.count()}",
            "first_name":     "Test",
            "last_name":      role.capitalize(),
            "phone_number":   "+256700000000",
            "role":           role,
            "account_status": "active",
        }
        defaults.update(kwargs)
        user = User(**defaults)
        user.set_password("testpass123")
        user.save()
        return user
    return _make