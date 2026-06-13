import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError

from evaluations.models import Evaluation, EvaluationCriteria, EvaluationScore
from logs.models import WeeklyLogs


pytestmark = pytest.mark.django_db