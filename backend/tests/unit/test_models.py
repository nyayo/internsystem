import pytest
from decimal import Decimal

from evaluations.models import EvaluationScore
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

class TestEvaluationScoreValidation:
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
        

class TestInternshipPlacementDurationWeeks:
    def test_duration_weeks_correct(self, make_placement):
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