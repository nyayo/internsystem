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


@pytest.fixture
def student(make_user):
    return make_user(role="student", student_number="21/U/001", programme="B.Sc Computer Science", university="Makerere University")

@pytest.fixture
def wp_supervisor(make_user):
    return make_user(role="workplace_supervisor", job_title="Senior Engineer", organisation_name="MTN Uganda")

@pytest.fixture
def ac_supervisor(make_user):
    return make_user(role="academic_supervisor")

@pytest.fixture
def admin(make_user):
    return make_user(role="internship_administrator")


# ── Auth helper ───────────────────────────────────────────────────

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(api_client):
    """
    Returns a callable that authenticates the client as any user.
    Usage: auth_client(student)
    """
    def _auth(user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )
        return api_client
    return _auth

# ── Model factories ───────────────────────────────────────────────

@pytest.fixture
def make_placement(student, wp_supervisor, ac_supervisor, admin):
    """Creates an active InternshipPlacement."""
    return InternshipPlacement.objects.create(
        student               = student,
        workplace_supervisor  = wp_supervisor,
        academic_supervisor   = ac_supervisor,
        approved_by           = admin,
        organisation_name     = "MTN Uganda",
        organisation_type     = "private",
        organisation_district = "Kampala",
        department            = "Software Development",
        wp_supervisor_name    = wp_supervisor.get_full_name(),
        wp_supervisor_email   = wp_supervisor.email,
        wp_supervisor_phone   = "+256700000001",
        start_date            = "2025-01-06",
        end_date              = "2025-04-30",
        intake_cohort         = "january",
        remuneration_type     = "unpaid",
        request_letter        = "request.pdf",
        acceptance_letter     = "acceptance.pdf",
        status                = "active",
    )



@pytest.fixture
def make_criteria(admin):
    """Creates 2 active EvaluationCriteria totalling 40 points."""
    c1 = EvaluationCriteria.objects.create(
        title          = "Punctuality & Attendance",
        description    = "Was the student present and on time?",
        max_score      = 20,
        category       = "punctuality",
        evaluator_role = "workplace_supervisor",
        is_active      = True,
        created_by     = admin,
    )
    c2 = EvaluationCriteria.objects.create(
        title          = "Professional Conduct",
        description    = "Workplace behaviour and attitude.",
        max_score      = 20,
        category       = "professional_conduct",
        evaluator_role = "workplace_supervisor",
        is_active      = True,
        created_by     = admin,
    )
    return c1, c2

@pytest.fixture
def make_evaluation(make_placement, wp_supervisor):
    """Creates a not_started midterm Evaluation."""
    return Evaluation.objects.create(
        placement       = make_placement,
        evaluator       = wp_supervisor,
        evaluation_type = "midterm",
        status          = "not_started",
    )

