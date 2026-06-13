import pytest
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db


class TestRegistrationAndLoginFlow:
    """
    E2E Test 1
    Full flow: register → attempt login before verification →
    verify email → login successfully → access /me/.
    """

    def test_full_registration_and_login(self, api_client, make_criteria):
        # Step 1 -- Register
        response = api_client.post(reverse("register"), {
            "username":       "new_student",
            "email":          "new@mak.ac.ug",
            "first_name":     "New",
            "last_name":      "Student",
            "phone_number":   "+256700111222",
            "role":           "student",
            "student_number": "21/U/999",
            "programme":      "B.Sc Computer Science",
            "year_of_study":  3,
            "university":     "Makerere University",
            "faculty":        "COCIS",
            "department":     "Computer Science",
            "password":       "testpass123",
            "password2":      "testpass123",
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert "Account created" in response.data["detail"]

        # Step 2 -- Login before verification should fail
        login_resp = api_client.post(reverse("login"), {
            "email":    "new@mak.ac.ug",
            "password": "testpass123",
        })
        assert login_resp.status_code == status.HTTP_400_BAD_REQUEST
        assert "verify your email" in str(login_resp.data).lower()

        # Step 3 -- Simulate email verification by directly activating
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.get(email="new@mak.ac.ug")
        user.account_status = "active"
        user.save()

        # Step 4 -- Login after verification should succeed
        login_resp = api_client.post(reverse("login"), {
            "email":    "new@mak.ac.ug",
            "password": "testpass123",
        })
        assert login_resp.status_code == status.HTTP_200_OK
        assert "access" in login_resp.data
        assert "refresh" in login_resp.data
        assert login_resp.data["user"]["role"] == "student"

        # Step 5 -- Access /me/ with the token
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_resp.data['access']}"
        )
        me_resp = api_client.get(reverse("me"))
        assert me_resp.status_code == status.HTTP_200_OK
        assert me_resp.data["email"] == "new@mak.ac.ug"
        assert me_resp.data["role"] == "student"

class TestPlacementSubmissionAndApprovalFlow:
    """
    E2E Test 2
    Full flow: student creates placement → uploads documents →
    submits → admin reviews and approves → placement becomes active.
    """

    def test_placement_submission_to_approval(
        self, auth_client, student, admin, ac_supervisor, tmp_path
    ):
        client = auth_client(student)

        # Step 1 -- Create draft placement
        import io
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake content")
        fake_pdf.name = "request.pdf"
        fake_pdf2 = io.BytesIO(b"%PDF-1.4 fake content 2")
        fake_pdf2.name = "acceptance.pdf"

        create_resp = client.post(reverse("placement_list_create"), {
            "organisation_name":     "Airtel Uganda",
            "organisation_type":     "private",
            "organisation_district": "Kampala",
            "department":            "IT",
            "wp_supervisor_name":    "John Doe",
            "wp_supervisor_email":   "john@airtel.ug",
            "wp_supervisor_phone":   "+256700333444",
            "start_date":            "2025-06-02",
            "end_date":              "2025-08-29",
            "remuneration_type":     "unpaid",
            "request_letter":        fake_pdf,
            "acceptance_letter":     fake_pdf2,
        }, format="multipart")
        assert create_resp.status_code == status.HTTP_201_CREATED
        placement_id = create_resp.data["id"]

        # Step 2 -- Submit for approval
        submit_resp = client.post(
            reverse("placement_submit", kwargs={"pk": placement_id})
        )
        assert submit_resp.status_code == status.HTTP_200_OK
        assert submit_resp.data["status"] == "pending_approval"

        # Step 3 -- Admin approves
        admin_client = auth_client(admin)
        approve_resp = admin_client.post(
            reverse("placement_approve", kwargs={"pk": placement_id}),
            {
                "status":               "approved",
                "academic_supervisor":  ac_supervisor.id,
                "intake_cohort":        "june",
            },
            format="json",
        )
        assert approve_resp.status_code == status.HTTP_200_OK
        assert approve_resp.data["status"] == "approved"

        # Step 4 -- Verify placement is approved in DB
        from placements.models import InternshipPlacement
        placement = InternshipPlacement.objects.get(pk=placement_id)
        assert placement.status == "approved"
        assert placement.academic_supervisor == ac_supervisor
        assert placement.approved_by == admin


class TestWeeklyLogFullWorkflow:
    """
    E2E Test 3
    Full log lifecycle: student creates draft → submits →
    workplace supervisor endorses → academic supervisor assesses → closed.
    """

    def test_log_lifecycle_draft_to_closed(
        self,
        auth_client,
        student,
        wp_supervisor,
        ac_supervisor,
        admin,
        make_placement,
    ):
        # Step 1 -- Student creates draft log
        student_client = auth_client(student)
        create_resp = student_client.post(reverse("log_list_create"), {
            "placement":             make_placement.id,
            "week_number":           1,
            "week_start_date":       "2025-01-06",
            "week_end_date":         "2025-01-10",
            "activities_performed":  "Worked on API integration.",
            "skills_gained":         "Django REST Framework.",
            "challenges_faced":      "CORS issues resolved.",
            "student_remarks":       "Good week.",
        }, format="json")
        assert create_resp.status_code == status.HTTP_201_CREATED
        log_id = create_resp.data["id"]

        # Step 2 -- Student submits the log
        submit_resp = student_client.post(
            reverse("log_submit", kwargs={"pk": log_id})
        )
        assert submit_resp.status_code == status.HTTP_200_OK
        assert submit_resp.data["status"] == "submitted"

        # Step 3 -- Workplace supervisor endorses
        wp_client    = auth_client(wp_supervisor)
        endorse_resp = wp_client.post(
            reverse("log_endorse", kwargs={"pk": log_id}),
            {
                "action":            "endorse",
                "workplace_comment": "Good progress this week.",
            },
            format="json",
        )
        assert endorse_resp.status_code == status.HTTP_200_OK
        assert endorse_resp.data["status"] == "endorsed"

        # Step 4 -- Academic supervisor assesses
        ac_client    = auth_client(ac_supervisor)
        assess_resp  = ac_client.post(
            reverse("log_assess", kwargs={"pk": log_id}),
            {
                "academic_grade":   78,
                "academic_comment": "Solid technical work.",
            },
            format="json",
        )
        assert assess_resp.status_code == status.HTTP_200_OK
        assert assess_resp.data["status"] == "assessed"
        assert assess_resp.data["grade"] == "78.00"

        # Step 5 -- Admin closes the log
        admin_client = auth_client(admin)
        close_resp   = admin_client.post(
            reverse("log_close", kwargs={"pk": log_id})
        )
        assert close_resp.status_code == status.HTTP_200_OK
        assert close_resp.data["status"] == "closed"

        # Step 6 -- Verify final state in DB
        from logs.models import WeeklyLogs
        log = WeeklyLogs.objects.get(pk=log_id)
        assert log.status == "closed"
        assert log.academic_grade == 78
        assert log.workplace_endorsed_by == wp_supervisor
        assert log.academic_assessed_by == ac_supervisor

class TestEvaluationFullWorkflow:
    """
    E2E Test 4
    Full evaluation lifecycle: evaluation auto-created → workplace
    supervisor saves draft → submits → academic supervisor acknowledges →
    student can view their score.
    """

    def test_evaluation_lifecycle_not_started_to_acknowledged(
        self,
        auth_client,
        student,
        wp_supervisor,
        ac_supervisor,
        admin,
        make_placement,
        make_criteria,
    ):
        c1, c2 = make_criteria

        # Step 1 -- Verify evaluation records were auto-created
        # (signal fires when placement status = active)
        from evaluations.models import Evaluation
        evals = Evaluation.objects.filter(placement=make_placement)
        assert evals.count() == 2
        midterm = evals.get(evaluation_type="midterm")
        assert midterm.status == "not_started"

        # Step 2 -- WP supervisor saves a draft
        wp_client = auth_client(wp_supervisor)
        draft_resp = wp_client.post(
            reverse("evaluation_save_draft", kwargs={"pk": midterm.id}),
            {
                "overall_remarks": "",
                "scores": [
                    {"criteria": c1.id, "score_awarded": 15},
                ],
            },
            format="json",
        )
        assert draft_resp.status_code == status.HTTP_200_OK
        assert draft_resp.data["status"] == "in_progress"

        # Step 3 -- WP supervisor submits with all criteria
        submit_resp = wp_client.post(
            reverse("evaluation_submit", kwargs={"pk": midterm.id}),
            {
                "overall_remarks": "Good intern overall.",
                "scores": [
                    {"criteria": c1.id, "score_awarded": 17, "comment": "Always on time."},
                    {"criteria": c2.id, "score_awarded": 16, "comment": "Professional."},
                ],
            },
            format="json",
        )
        assert submit_resp.status_code == status.HTTP_200_OK
        assert submit_resp.data["status"] == "submitted"
        assert submit_resp.data["total_score"] == "33.00"

        # Step 4 -- Academic supervisor acknowledges
        ac_client = auth_client(ac_supervisor)
        ack_resp  = ac_client.post(
            reverse("evaluation_acknowledge", kwargs={"pk": midterm.id}),
            {"acknowledgement_notes": "Scores reviewed and accepted."},
            format="json",
        )
        assert ack_resp.status_code == status.HTTP_200_OK
        assert ack_resp.data["status"] == "acknowledged"

        # Step 5 -- Student views their evaluation
        student_client = auth_client(student)
        detail_resp = student_client.get(
            reverse("evaluation_detail", kwargs={"pk": midterm.id})
        )
        assert detail_resp.status_code == status.HTTP_200_OK
        assert detail_resp.data["total_score"] == "33.00"
        assert detail_resp.data["status"] == "acknowledged"
        assert len(detail_resp.data["scores"]) == 2

class TestRoleBasedAccessControl:
    """
    E2E Test 5
    Verifies that role-based access control is enforced correctly.
    Tests that users cannot access or perform actions outside their role.
    """

    def test_student_cannot_approve_placement(
        self, auth_client, student, make_placement
    ):
        client = auth_client(student)
        resp   = client.post(
            reverse("placement_approve", kwargs={"pk": make_placement.id}),
            {"status": "approved"},
            format="json",
        )
        # Student does not have internship_administrator role
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_wp_supervisor_cannot_assess_log(
        self, auth_client, wp_supervisor, make_log
    ):
        client = auth_client(wp_supervisor)
        resp   = client.post(
            reverse("log_assess", kwargs={"pk": make_log.id}),
            {"academic_grade": 80, "academic_comment": "Good."},
            format="json",
        )
        # Only academic supervisors can assess
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_unauthenticated_user_cannot_access_placements(
        self, api_client
    ):
        resp = api_client.get(reverse("placement_list_create"))
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_suspended_user_cannot_login(self, api_client, make_user):
        user = make_user(role="student", account_status="suspended")
        resp = api_client.post(reverse("login"), {
            "email":    user.email,
            "password": "testpass123",
        })
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert "suspended" in str(resp.data).lower()

    def test_wrong_supervisor_cannot_endorse_log(
        self, auth_client, make_user, make_log
    ):
        # A different workplace supervisor who is NOT assigned to this placement
        other_wp = make_user(role="workplace_supervisor")
        client   = auth_client(other_wp)
        resp     = client.post(
            reverse("log_endorse", kwargs={"pk": make_log.id}),
            {"action": "endorse", "workplace_comment": ""},
            format="json",
        )
        # Not the assigned workplace supervisor for this placement
        assert resp.status_code == status.HTTP_403_FORBIDDEN