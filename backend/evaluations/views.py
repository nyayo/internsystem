from rest_framework          import status
from rest_framework.views    import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import EvaluationCriteria, Evaluation
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
    IsWorkplaceSupervisor,
    IsAcademicSupervisor,
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


class EvaluationCriteriaListCreateView(APIView):
    """
    GET  /api/criteria/   — list all criteria (all authenticated roles)
    POST /api/criteria/   — create a new criterion (admin only)
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request):
        # All roles can read criteria to understand the rubric
        queryset   = EvaluationCriteria.objects.all().order_by("category", "title")
        active_only = request.query_params.get("active")
        if active_only == "true":
            queryset = queryset.filter(is_active=True)
        serializer = EvaluationCriteriaSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role != "internship_administrator":
            return Response(
                {"detail": "Only administrators can create evaluation criteria."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = EvaluationCriteriaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EvaluationCriteriaDetailView(APIView):
    """
    GET   /api/criteria/<id>/   — view criterion detail (all roles)
    PATCH /api/criteria/<id>/   — update criterion (admin only)
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get_object(self, pk):
        try:
            return EvaluationCriteria.objects.get(pk=pk), None
        except EvaluationCriteria.DoesNotExist:
            return None, Response(
                {"detail": "Criterion not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def get(self, request, pk):
        obj, err = self.get_object(pk)
        if err:
            return err
        serializer = EvaluationCriteriaSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        if request.user.role != "internship_administrator":
            return Response(
                {"detail": "Only administrators can update evaluation criteria."},
                status=status.HTTP_403_FORBIDDEN,
            )
        obj, err = self.get_object(pk)
        if err:
            return err
        serializer = EvaluationCriteriaSerializer(
            obj, data=request.data, partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EvaluationListView(APIView):
    """
    GET /api/evaluations/
    Lists evaluations filtered by the requesting user's role.

    Query params:
        ?placement=<id>           filter by placement
        ?type=midterm|final       filter by evaluation type
        ?status=<status>          filter by evaluation status
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request):
        queryset = get_queryset_for_role(request.user)

        placement_id  = request.query_params.get("placement")
        eval_type     = request.query_params.get("type")
        eval_status   = request.query_params.get("status")

        if placement_id:
            queryset = queryset.filter(placement_id=placement_id)
        if eval_type:
            queryset = queryset.filter(evaluation_type=eval_type)
        if eval_status:
            queryset = queryset.filter(status=eval_status)

        serializer = EvaluationListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EvaluationDetailView(APIView):
    """
    GET /api/evaluations/<id>/
    Returns full evaluation detail including nested scores.
    Accessible by any user linked to the placement.
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request, pk):
        evaluation, err = get_evaluation_or_404(pk, request.user)
        if err:
            return err
        serializer = EvaluationDetailSerializer(evaluation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EvaluationSaveDraftView(APIView):
    """
    POST /api/evaluations/<id>/save-draft/
    Workplace supervisor saves partial scores without submitting.
    Scores list may be incomplete.
    Status moves to in_progress.

    Request body:
        {
            "overall_remarks": "...",
            "scores": [
                { "criteria": 1, "score_awarded": 15, "comment": "..." },
                { "criteria": 2, "score_awarded": 17 }
            ]
        }
    """
    permission_classes = [IsAuthenticated, IsActiveAccount, IsWorkplaceSupervisor]

    def post(self, request, pk):
        evaluation, err = get_evaluation_or_404(pk, request.user)
        if err:
            return err

        if evaluation.evaluator != request.user:
            return Response(
                {"detail": "You are not the evaluator for this evaluation."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EvaluationSaveDraftSerializer(
            evaluation, data=request.data
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()

        return Response(
            {
                "detail": "Draft saved.",
                "status": evaluation.status,
            },
            status=status.HTTP_200_OK,
        )


class EvaluationSubmitView(APIView):
    """
    POST /api/evaluations/<id>/submit/
    Workplace supervisor submits a completed evaluation.
    All active criteria must be scored.
    Total score is calculated and stored automatically.

    Request body:
        {
            "overall_remarks": "...",
            "scores": [
                { "criteria": 1, "score_awarded": 17, "comment": "..." },
                { "criteria": 2, "score_awarded": 16, "comment": "..." },
                { "criteria": 3, "score_awarded": 15 },
                { "criteria": 4, "score_awarded": 16 },
                { "criteria": 5, "score_awarded": 14, "comment": "..." }
            ]
        }
    """
    permission_classes = [IsAuthenticated, IsActiveAccount, IsWorkplaceSupervisor]

    def post(self, request, pk):
        evaluation, err = get_evaluation_or_404(pk, request.user)
        if err:
            return err

        if evaluation.evaluator != request.user:
            return Response(
                {"detail": "You are not the evaluator for this evaluation."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EvaluationSubmitSerializer(
            evaluation, data=request.data
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()

        return Response(
            {
                "detail":      "Evaluation submitted successfully.",
                "status":      evaluation.status,
                "total_score": str(evaluation.total_score),
            },
            status=status.HTTP_200_OK,
        )


class EvaluationAcknowledgeView(APIView):
    """
    POST /api/evaluations/<id>/acknowledge/
    Academic supervisor acknowledges a submitted evaluation.
    Optionally adds acknowledgement notes.

    Request body:
        {
            "acknowledgement_notes": "..."   (optional)
        }
    """
    permission_classes = [IsAuthenticated, IsActiveAccount, IsAcademicSupervisor]

    def post(self, request, pk):
        evaluation, err = get_evaluation_or_404(pk, request.user)
        if err:
            return err

        if evaluation.placement.academic_supervisor != request.user:
            return Response(
                {"detail": "You are not the academic supervisor for this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EvaluationAcknowledgeSerializer(
            evaluation,
            data=request.data,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()

        return Response(
            {
                "detail": "Evaluation acknowledged.",
                "status": evaluation.status,
            },
            status=status.HTTP_200_OK,
        )


class PendingEvaluationsView(APIView):
    """
    GET /api/evaluations/pending/
    Returns evaluations that require the requesting supervisor's action.

    Workplace supervisor  → not_started and in_progress evaluations
    Academic supervisor   → submitted evaluations awaiting acknowledgement
    Administrator         → all evaluations not yet acknowledged
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request):
        user = request.user

        if user.role == "workplace_supervisor":
            queryset = Evaluation.objects.filter(
                placement__workplace_supervisor=user,
                status__in=("not_started", "in_progress"),
            )
        elif user.role == "academic_supervisor":
            queryset = Evaluation.objects.filter(
                placement__academic_supervisor=user,
                status="submitted",
            )
        elif user.role == "internship_administrator":
            queryset = Evaluation.objects.exclude(status="acknowledged")
        else:
            return Response(
                {"detail": "Pending evaluations are not applicable for your role."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EvaluationListSerializer(queryset, many=True)
        return Response(
            {
                "count":       queryset.count(),
                "evaluations": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PlacementEvaluationSummaryView(APIView):
    """
    GET /api/evaluations/placement/<placement_id>/summary/
    Returns both evaluations (midterm + final) for a placement
    with their scores and status.
    Accessible by any user linked to the placement.
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request, placement_id):
        try:
            placement = InternshipPlacement.objects.get(pk=placement_id)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        if not (
            user == placement.student
            or user == placement.workplace_supervisor
            or user == placement.academic_supervisor
            or user.role == "internship_administrator"
        ):
            return Response(
                {"detail": "You are not linked to this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )

        evaluations = Evaluation.objects.filter(
            placement=placement
        ).prefetch_related("scores__criteria")

        midterm = evaluations.filter(evaluation_type="midterm").first()
        final   = evaluations.filter(evaluation_type="final").first()

        def summarise(ev):
            if not ev:
                return None
            return {
                "id":             ev.id,
                "status":         ev.status,
                "total_score":    str(ev.total_score) if ev.total_score else None,
                "overall_remarks":ev.overall_remarks,
                "submitted_at":   ev.submitted_at,
                "acknowledged_at":ev.acknowledged_at,
                "scores": [
                    {
                        "criteria":    s.criteria.title,
                        "max_score":   s.criteria.max_score,
                        "score_awarded": str(s.score_awarded),
                        "comment":     s.comment,
                    }
                    for s in ev.scores.all()
                ],
            }

        # Combined average if both evaluations are acknowledged
        combined_avg = None
        if (
            midterm and midterm.total_score is not None
            and final and final.total_score is not None
        ):
            combined_avg = round(
                (float(midterm.total_score) + float(final.total_score)) / 2, 2
            )

        return Response(
            {
                "placement_id":   placement.id,
                "student":        placement.student.get_full_name(),
                "organisation":   placement.organisation_name,
                "midterm":        summarise(midterm),
                "final":          summarise(final),
                "combined_average": combined_avg,
            },
            status=status.HTTP_200_OK,
        )


