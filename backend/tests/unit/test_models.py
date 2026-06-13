import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError

from evaluations.models import Evaluation, EvaluationCriteria, EvaluationScore
from logs.models import WeeklyLogs


pytestmark = pytest.mark.django_db
class TestCalculateTotalScore:
    """
    Unit Test 1
    Verifies that Evaluation.calculate_total_score() correctly
    sums EvaluationScore records and persists the result.
    """

    def test_total_score_is_sum_of_all_scores(
        self, make_evaluation, make_criteria
    ):
        evaluation  = make_evaluation
        c1, c2      = make_criteria

        EvaluationScore.objects.create(
            evaluation=evaluation, criteria=c1, score_awarded=17
        )
        EvaluationScore.objects.create(
            evaluation=evaluation, criteria=c2, score_awarded=15
        )

        result = evaluation.calculate_total_score()

        assert result == Decimal("32")
        evaluation.refresh_from_db()
        assert evaluation.total_score == Decimal("32")

    def test_total_score_is_zero_when_no_scores(self, make_evaluation):
        result = make_evaluation.calculate_total_score()
        assert result == Decimal("0")
        make_evaluation.refresh_from_db()
        assert make_evaluation.total_score == Decimal("0")

    def test_total_score_updates_after_score_added(
        self, make_evaluation, make_criteria
    ):
        evaluation = make_evaluation
        c1, c2     = make_criteria

        EvaluationScore.objects.create(
            evaluation=evaluation, criteria=c1, score_awarded=10
        )
        evaluation.calculate_total_score()
        assert evaluation.total_score == Decimal("10")

        # Add second score and recalculate
        EvaluationScore.objects.create(
            evaluation=evaluation, criteria=c2, score_awarded=18
        )
        evaluation.calculate_total_score()
        evaluation.refresh_from_db()
        assert evaluation.total_score == Decimal("28")
class TestEvaluationScoreValidation:
    """
    Unit Test 2
    Verifies that EvaluationScore.clean() raises ValidationError
    when score_awarded exceeds criteria.max_score.
    """

    def test_score_exceeding_max_raises_validation_error(
        self, make_evaluation, make_criteria
    ):
        evaluation = make_evaluation
        c1, _      = make_criteria

        score = EvaluationScore(
            evaluation    = evaluation,
            criteria      = c1,
            score_awarded = 25,   # max is 20
        )

        with pytest.raises(ValidationError) as exc:
            score.clean()

        assert "exceeds the maximum" in str(exc.value)

    def test_score_at_max_does_not_raise(
        self, make_evaluation, make_criteria
    ):
        evaluation = make_evaluation
        c1, _      = make_criteria

        score = EvaluationScore(
            evaluation    = evaluation,
            criteria      = c1,
            score_awarded = 20,   # exactly at max
        )
        # Should not raise
        score.clean()

    def test_score_of_zero_is_valid(self, make_evaluation, make_criteria):
        evaluation = make_evaluation
        c1, _      = make_criteria

        score = EvaluationScore(
            evaluation    = evaluation,
            criteria      = c1,
            score_awarded = 0,
        )
        score.clean()   # no exception expected



class TestWeeklyLogStatusTracking:
    """
    Unit Test 3
    Verifies that WeeklyLogs.__original_status is set on load
    and that status changes are tracked correctly.
    """

    def test_original_status_is_set_on_instantiation(self, make_log):
        log = make_log
        assert log._WeeklyLogs__original_status == "draft"

    def test_original_status_reflects_db_value_on_fetch(self, make_log):
        # Fetch from DB -- __init__ runs again
        log = WeeklyLogs.objects.get(pk=make_log.pk)
        assert log._WeeklyLogs__original_status == "draft"

    def test_original_status_does_not_change_before_save(self, make_log):
        log        = make_log
        log.status = "submitted"
        # Has not been saved -- original should still be draft
        assert log._WeeklyLogs__original_status == "draft"
        assert log.status == "submitted"
        

class TestInternshipPlacementDurationWeeks:
    """
    Unit Test 4
    Verifies that the duration_weeks property returns the correct
    number of weeks between start_date and end_date.
    """

    def test_duration_weeks_correct(self, make_placement):
        # start_date = 2025-01-06, end_date = 2025-04-30 = 114 days = 16 weeks
        assert make_placement.duration_weeks == 16

    def test_duration_weeks_none_when_dates_missing(self, make_placement):
        make_placement.start_date = None
        make_placement.end_date   = None
        assert make_placement.duration_weeks is None

class TestWeeklyLogUniqueConstraint:
    """
    Unit Test 5
    Verifies that the unique_together constraint on (placement, week_number)
    prevents duplicate logs for the same week.
    """

    def test_duplicate_week_raises_integrity_error(self, make_placement):
        from django.db import IntegrityError

        WeeklyLogs.objects.create(
            placement            = make_placement,
            week_number          = 1,
            week_start_date      = "2025-01-06",
            week_end_date        = "2025-01-10",
            activities_performed = "First log.",
            skills_gained        = "Django skills.",
            challenges_faced     = "None.",
            status               = "draft",
        )

        with pytest.raises(IntegrityError):
            WeeklyLogs.objects.create(
                placement            = make_placement,
                week_number          = 1,   # duplicate
                week_start_date      = "2025-01-06",
                week_end_date        = "2025-01-10",
                activities_performed = "Second log same week.",
                skills_gained        = "More skills.",
                challenges_faced     = "None.",
                status               = "draft",
            )
    def test_different_weeks_are_allowed(self, make_placement):
        WeeklyLogs.objects.create(
            placement            = make_placement,
            week_number          = 1,
            week_start_date      = "2025-01-06",
            week_end_date        = "2025-01-10",
            activities_performed = "Week 1.",
            skills_gained        = "Skills.",
            challenges_faced     = "None.",
            status               = "draft",
        )
        log2 = WeeklyLogs.objects.create(
            placement            = make_placement,
            week_number          = 2,
            week_start_date      = "2025-01-13",
            week_end_date        = "2025-01-17",
            activities_performed = "Week 2.",
            skills_gained        = "More skills.",
            challenges_faced     = "None.",
            status               = "draft",
        )
        assert log2.pk is not None