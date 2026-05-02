from rest_framework          import status
from rest_framework.views    import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import EvaluationCriteria, Evaluation, EvaluationScore
from placements.models import InternshipPlacement
from .serializers import (
    EvaluationCriteriaSerializer,
    EvaluationListSerializer,
    EvaluationDetailSerializer,
    EvaluationSubmitSerializer,
    EvaluationSaveDraftSerializer,
    EvaluationAcknowledgeSerializer,
)
from accounts.permissions import (
    IsActiveAccount,
    IsStudent,
    IsWorkplaceSupervisor,
    IsAcademicSupervisor,
    IsInternshipAdministrator,
    IsAssignedEvaluator,
    IsAssignedAcademicSupervisor,
    CanViewEvaluation,
)
