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
