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

def get_evaluation_or_404(pk, user):
    """
    Fetches an evaluation and verifies the user is linked
    to its placement. Returns (evaluation, error_response).
    """
    try:
        evaluation = Evaluation.objects.select_related(
            "placement__student",
            "placement__workplace_supervisor",
            "placement__academic_supervisor",
            "evaluator",
            "acknowledged_by",
        ).get(pk=pk)
    except Evaluation.DoesNotExist:
        return None, Response(
            {"detail": "Evaluation not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    user_obj = user
    if not (
        user_obj == evaluation.placement.student
        or user_obj == evaluation.placement.workplace_supervisor
        or user_obj == evaluation.placement.academic_supervisor
        or user_obj.role == "internship_administrator"
    ):
        return None, Response(
            {"detail": "You are not linked to this placement."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return evaluation, None


def get_queryset_for_role(user):
    """
    Returns evaluations visible to the requesting user based on role.
    """
    if user.role == "student":
        return Evaluation.objects.filter(placement__student=user)

    if user.role == "workplace_supervisor":
        return Evaluation.objects.filter(
            placement__workplace_supervisor=user
        )

    if user.role == "academic_supervisor":
        return Evaluation.objects.filter(
            placement__academic_supervisor=user
        )

    if user.role == "internship_administrator":
        return Evaluation.objects.all()

    return Evaluation.objects.none()
