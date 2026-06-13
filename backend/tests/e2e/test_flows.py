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


