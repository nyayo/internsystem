import pytest
from unittest.mock import patch, call
from django.contrib.auth import get_user_model

User = get_user_model()

pytestmark = pytest.mark.django_db


# ══════════════════════════════════════════════════════════════════
# Unit Test 1
# Targets: accounts/signals.py lines 16-19, 26-27
# Tests that post_save signal on new user creation triggers
# send_verification_email_task
# ══════════════════════════════════════════════════════════════════

class TestAccountSignalNewUserRegistration:
    @patch("accounts.tasks.send_verification_email_task.delay")
    def test_verification_email_sent_on_registration(
        self, mock_delay
    ):
        """
        Creating a new user should trigger send_verification_email_task.
        """
        user = User.objects.create_user(
            username       = "signaltest",
            email          = "signaltest@mak.ac.ug",
            password       = "testpass123",
            first_name     = "Signal",
            last_name      = "Test",
            role           = "student",
            phone_number   = "+256700000099",
            account_status = "registered",
        )

        mock_delay.assert_called_once_with(user.id)

    @patch("accounts.tasks.send_verification_email_task.delay")
    def test_verification_email_not_sent_on_update(
        self, mock_delay
    ):
        """
        Updating an existing user should NOT trigger
        send_verification_email_task — only creation does.
        """
        user = User.objects.create_user(
            username       = "signaltest2",
            email          = "signaltest2@mak.ac.ug",
            password       = "testpass123",
            first_name     = "Signal",
            last_name      = "Test",
            role           = "student",
            phone_number   = "+256700000088",
            account_status = "registered",
        )
        # Reset mock after creation so we only track the update call
        mock_delay.reset_mock()

        # Update a non-status field
        user.first_name = "Updated"
        user.save()

        mock_delay.assert_not_called()


class TestPlacementSignalsAndModel:
    @pytest.fixture
    def placement(
        self,
        make_placement,
    ):
        return make_placement

    @patch(
        "placements.tasks.notify_placement_status_change.delay"
    )
    def test_placement_submit_triggers_notification(
        self, mock_delay, placement
    ):
        """
        Covers placements/signals.py lines 14-26.
        Transitioning placement status to pending_approval
        should trigger notify_placement_status_change task.
        """
        placement.status = "pending_approval"
        placement.save()

        mock_delay.assert_called_once_with(placement.id)

    @patch(
        "placements.tasks.notify_placement_status_change.delay"
    )
    def test_placement_approval_triggers_notification(
        self, mock_delay, placement
    ):
        """
        Covers placements/signals.py lines 34-46.
        Transitioning placement to approved should trigger
        notify_placement_status_change task.
        """
        placement.status = "approved"
        placement.save()

        mock_delay.assert_called_once_with(placement.id)


class TestLogSignalsAndModel:
    @patch("logs.tasks.notify_log_status_change.delay")
    def test_log_submitted_triggers_notification(
        self, mock_delay, make_log
    ):
        """
        Covers logs/signals.py lines 12-22.
        Transitioning a log to submitted should trigger
        notify_log_status_change task.
        """
        from django.utils import timezone

        log = make_log
        log.status       = "submitted"
        log.submitted_at = timezone.now()
        log.save()

        mock_delay.assert_called_once_with(log.id)

    @patch("logs.tasks.notify_log_status_change.delay")
    def test_log_endorsed_triggers_notification(
        self, mock_delay, make_log, wp_supervisor
    ):
        """
        Covers logs/signals.py lines 26-37.
        Transitioning a log to endorsed should trigger
        notify_log_status_change task.
        """
        from django.utils import timezone

        log = make_log
        # Move through submitted first
        log.status       = "submitted"
        log.submitted_at = timezone.now()
        log.save()
        mock_delay.reset_mock()

        # Now endorse
        log.status                = "endorsed"
        log.workplace_endorsed_by = wp_supervisor
        log.workplace_endorsed_at = timezone.now()
        log.save()

        mock_delay.assert_called_once_with(log.id)

    @patch("logs.tasks.notify_log_status_change.delay")
    def test_log_resubmit_triggers_notification(
        self, mock_delay, make_log
    ):
        """
        Covers logs/signals.py line 33.
        Transitioning a log to resubmit should trigger
        notify_log_status_change task.
        """
        from django.utils import timezone

        log = make_log
        log.status       = "submitted"
        log.submitted_at = timezone.now()
        log.save()
        mock_delay.reset_mock()

        log.status            = "resubmit"
        log.workplace_comment = "Please add more detail."
        log.save()

        mock_delay.assert_called_once_with(log.id)


    def test_weekly_log_str_method(self, make_log):
        """
        Covers logs/models.py line 71.
        __str__ returns the correct string representation.
        """
        log = make_log
        expected = (
            f"Week {log.week_number}"
            f"--{log.placement.student.get_full_name()}"
        )
        assert str(log) == expected


class TestEvaluationSignalsAndModel:
    @patch(
        "evaluations.tasks.notify_evaluation_status_change.delay"
    )
    def test_evaluation_submitted_triggers_notification(
        self, mock_delay, make_evaluation
    ):
        """
        Covers evaluations/signals.py lines 14-24, 28-37.
        Transitioning evaluation to submitted should trigger
        notify_evaluation_status_change task.
        """
        from django.utils import timezone

        evaluation = make_evaluation
        evaluation.status       = "submitted"
        evaluation.submitted_at = timezone.now()
        evaluation.save()

        mock_delay.assert_called_once_with(evaluation.id)

    @patch(
        "evaluations.tasks.notify_evaluation_status_change.delay"
    )
    def test_evaluation_acknowledged_triggers_notification(
        self, mock_delay, make_evaluation, ac_supervisor
    ):
        """
        Covers evaluations/signals.py lines 28-37.
        Transitioning evaluation to acknowledged should trigger
        notify_evaluation_status_change task.
        """
        from django.utils import timezone

        evaluation = make_evaluation
        evaluation.status       = "submitted"
        evaluation.submitted_at = timezone.now()
        evaluation.save()
        mock_delay.reset_mock()

        evaluation.status          = "acknowledged"
        evaluation.acknowledged_by = ac_supervisor
        evaluation.acknowledged_at = timezone.now()
        evaluation.save()

        mock_delay.assert_called_once_with(evaluation.id)


    def test_evaluation_original_status_set_on_init(
        self, make_evaluation
    ):
        """
        Covers evaluations/models.py lines 60-68.
        __original_status is set on model instantiation.
        """
        from evaluations.models import Evaluation

        evaluation = Evaluation.objects.get(pk=make_evaluation.pk)
        assert (
            evaluation._Evaluation__original_status == "not_started"
        )

    def test_calculate_total_score_with_multiple_scores(
        self, make_evaluation, make_criteria
    ):
        """
        Covers evaluations/models.py lines 80-81.
        calculate_total_score sums all linked EvaluationScore records.
        """
        from decimal import Decimal
        from evaluations.models import EvaluationScore

        evaluation = make_evaluation
        c1, c2     = make_criteria

        EvaluationScore.objects.create(
            evaluation    = evaluation,
            criteria      = c1,
            score_awarded = 18,
        )
        EvaluationScore.objects.create(
            evaluation    = evaluation,
            criteria      = c2,
            score_awarded = 14,
        )

        result = evaluation.calculate_total_score()

        assert result == Decimal("32")
        evaluation.refresh_from_db()
        assert evaluation.total_score == Decimal("32")
