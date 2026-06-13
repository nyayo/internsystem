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
