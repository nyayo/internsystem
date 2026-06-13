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


        
