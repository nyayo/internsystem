from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncMonth

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    inline_serializer,
    OpenApiParameter,
)
from rest_framework import serializers as drf_serializers

from .models import InternshipPlacement
from .serializers import (
    PlacementListSerializer,
    PlacementDetailSerializer,
    PlacementApprovalSerializer,
    PlacementWithdrawSerializer,
    PlacementSubmitSerializer,
    FinalReportSerializer,
)
from accounts.permissions import (
    IsActiveAccount,
    IsStudent,
    IsInternshipAdministrator,
    IsLinkedToPlacement,
)


def get_queryset_for_role(user):

    if user.role == "student":
        return InternshipPlacement.objects.filter(student=user)

    if user.role == "academic_supervisor":
        return InternshipPlacement.objects.filter(academic_supervisor=user)

    if user.role == "workplace_supervisor":
        return InternshipPlacement.objects.filter(workplace_supervisor=user)

    if user.role == "internship_administrator":
        return InternshipPlacement.objects.all()

    return InternshipPlacement.objects.none()


def build_admin_report_payload():
    from evaluations.models import Evaluation
    from logs.models import WeeklyLogs

    placements = InternshipPlacement.objects.select_related(
        "student",
        "workplace_supervisor",
        "academic_supervisor",
    )

    total_placements = placements.count()
    final_reports_uploaded = placements.exclude(final_report="").exclude(
        final_report__isnull=True
    ).count()
    active_count = placements.filter(status="active").count()
    completed_count = placements.filter(status="completed").count()
    pending_approval_count = placements.filter(status="pending").count()
    approved_count = placements.filter(status="approved").count()
    withdrawn_count = placements.filter(status="withdrawn").count()

    pending_logs_qs = WeeklyLogs.objects.filter(status__in=("submitted", "endorsed"))
    pending_evaluations_qs = Evaluation.objects.exclude(status="acknowledged")

    def choice_breakdown(choices, field_name):
        rows = []
        for value, label in choices:
            count = placements.filter(**{field_name: value}).count()
            rows.append(
                {
                    "value": value,
                    "label": label,
                    "count": count,
                    "percentage": round((count / total_placements) * 100, 1)
                    if total_placements
                    else 0,
                }
            )
        return rows

    def top_rows(values, label_key, name_builder):
        return [
            {
                "label": name_builder(row),
                "count": row["count"],
                "key": row[label_key],
            }
            for row in values
        ]

    monthly_created = [
        {
            "month": row["month"].isoformat() if row["month"] else None,
            "count": row["count"],
        }
        for row in (
            placements.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
    ]
    monthly_approved = [
        {
            "month": row["month"].isoformat() if row["month"] else None,
            "count": row["count"],
        }
        for row in (
            placements.exclude(approval_date__isnull=True)
            .annotate(month=TruncMonth("approval_date"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
    ]
    monthly_activated = [
        {
            "month": row["month"].isoformat() if row["month"] else None,
            "count": row["count"],
        }
        for row in (
            placements.exclude(activated_at__isnull=True)
            .annotate(month=TruncMonth("activated_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
    ]
    monthly_completed = [
        {
            "month": row["month"].isoformat() if row["month"] else None,
            "count": row["count"],
        }
        for row in (
            placements.exclude(completed_at__isnull=True)
            .annotate(month=TruncMonth("completed_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
    ]

    top_organisations = top_rows(
        placements.values("organisation_name")
        .annotate(count=Count("id"))
        .order_by("-count", "organisation_name")[:10],
        "organisation_name",
        lambda row: row["organisation_name"] or "Unknown organisation",
    )
    top_districts = top_rows(
        placements.values("organisation_district")
        .annotate(count=Count("id"))
        .order_by("-count", "organisation_district")[:10],
        "organisation_district",
        lambda row: row["organisation_district"] or "Unknown district",
    )
    top_programmes = top_rows(
        placements.values("student__programme")
        .annotate(count=Count("id"))
        .order_by("-count", "student__programme")[:10],
        "student__programme",
        lambda row: row["student__programme"] or "Unknown programme",
    )
    top_workplace_supervisors = top_rows(
        placements.exclude(workplace_supervisor__isnull=True)
        .values(
            "workplace_supervisor__id",
            "workplace_supervisor__first_name",
            "workplace_supervisor__last_name",
        )
        .annotate(count=Count("id"))
        .order_by("-count", "workplace_supervisor__first_name")[:10],
        "workplace_supervisor__id",
        lambda row: (
            f"{row['workplace_supervisor__first_name']} {row['workplace_supervisor__last_name']}".strip()
            or "Unnamed supervisor"
        ),
    )
    top_academic_supervisors = top_rows(
        placements.exclude(academic_supervisor__isnull=True)
        .values(
            "academic_supervisor__id",
            "academic_supervisor__first_name",
            "academic_supervisor__last_name",
        )
        .annotate(count=Count("id"))
        .order_by("-count", "academic_supervisor__first_name")[:10],
        "academic_supervisor__id",
        lambda row: (
            f"{row['academic_supervisor__first_name']} {row['academic_supervisor__last_name']}".strip()
            or "Unnamed supervisor"
        ),
    )

    return {
        "overview": {
            "totalPlacements": total_placements,
            "pendingApprovals": pending_approval_count,
            "approvedPlacements": approved_count,
            "activePlacements": active_count,
            "completedPlacements": completed_count,
            "withdrawnPlacements": withdrawn_count,
            "finalReportsUploaded": final_reports_uploaded,
            "pendingLogs": pending_logs_qs.count(),
            "pendingEvaluations": pending_evaluations_qs.count(),
        },
        "breakdowns": {
            "byStatus": choice_breakdown(InternshipPlacement.STATUS, "status"),
            "byCohort": choice_breakdown(InternshipPlacement.INTAKE_COHORT, "intake_cohort"),
            "byOrganisationType": choice_breakdown(
                InternshipPlacement.ORGANIZATION_TYPES, "organisation_type"
            ),
            "byDistrict": top_districts,
            "byProgramme": top_programmes,
        },
        "trends": {
            "created": monthly_created,
            "approved": monthly_approved,
            "activated": monthly_activated,
            "completed": monthly_completed,
        },
        "workload": {
            "topOrganisations": top_organisations,
            "topWorkplaceSupervisors": top_workplace_supervisors,
            "topAcademicSupervisors": top_academic_supervisors,
        },
    }


class PlacementListCreateView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @extend_schema(
        operation_id="placements_list",
        parameters=[
            OpenApiParameter("status", str, description="Filter by placement status"),
            OpenApiParameter("cohort", str, description="Filter by intake cohort"),
        ],
        responses={200: PlacementListSerializer(many=True)},
    )
    def get(self, request):
        queryset = get_queryset_for_role(request.user)

        status_filter = request.query_params.get("status")
        cohort_filter = request.query_params.get("cohort")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if cohort_filter:
            queryset = queryset.filter(intake_cohort=cohort_filter)

        serializer = PlacementListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        operation_id="placements_create",
        request=PlacementDetailSerializer,
        responses={
            201: PlacementDetailSerializer,
            400: OpenApiResponse(description="Validation errors."),
            403: OpenApiResponse(description="Only students can create placements."),
        },
    )
    def post(self, request):
        if request.user.role != "student":
            return Response(
                {"detail": "Only students can create placements."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = PlacementDetailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(
            student=request.user,
            status="draft",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PlacementDetailView(APIView):
    """
    GET   /api/placements/<id>/  -- view placement detail
    PATCH /api/placements/<id>/  -- student edits their draft placement
    """

    permission_classes = [IsAuthenticated, IsActiveAccount]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk, request):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return None, Response({"detail": "Placement not found."}, status=404)

        perm = IsLinkedToPlacement()
        if not perm.has_object_permission(request, self, obj):
            return None, Response({"detail": perm.message}, status=403)

        return obj, None

    @extend_schema(
        operation_id="placements_detail",
        responses={
            200: PlacementDetailSerializer,
            403: OpenApiResponse(description="Not linked to this placement."),
            404: OpenApiResponse(description="Placement not found."),
        },
    )
    def get(self, request, pk):
        obj, err = self.get_object(pk, request)
        if err:
            return err
        serializer = PlacementDetailSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        operation_id="placements_partial_update",
        request=PlacementDetailSerializer,
        responses={
            200: PlacementDetailSerializer,
            400: OpenApiResponse(description="Not a draft or validation error."),
            403: OpenApiResponse(description="Only the student can edit a placement."),
            404: OpenApiResponse(description="Placement not found."),
        },
    )
    def patch(self, request, pk):
        obj, err = self.get_object(pk, request)
        if err:
            return err

        if request.user != obj.student:
            return Response(
                {"detail": "Only the student can edit a placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if obj.status not in ("draft", "rejected"):
            return Response(
                {"detail": "Only draft or rejected placements can be edited."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = PlacementDetailSerializer(obj, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    operation_id="placements_submit",
    request=None,
    responses={
        200: inline_serializer(
            "PlacementSubmitResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "status": drf_serializers.CharField(),
            },
        ),
        400: OpenApiResponse(description="Validation error."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class PlacementSubmitView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsStudent]

    def post(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk, student=request.user)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PlacementSubmitSerializer(obj, data={}, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            {"detail": "Placement submitted for review.", "status": obj.status},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_approve",
    request=PlacementApprovalSerializer,
    responses={
        200: inline_serializer(
            "PlacementApprovalResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "status": drf_serializers.CharField(),
            },
        ),
        400: OpenApiResponse(description="Validation error."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class PlacementApprovalView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def post(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PlacementApprovalSerializer(
            obj, data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            {
                "detail": f"Placement {obj.status}.",
                "status": obj.status,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_activate",
    request=None,
    responses={
        200: inline_serializer(
            "PlacementActivateResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "status": drf_serializers.CharField(),
            },
        ),
        400: OpenApiResponse(description="Only approved placements can be activated."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class PlacementActivateView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def post(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if obj.status != "approved":
            return Response(
                {"detail": "Only approved placements can be activated."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        obj.status = "active"
        obj.activated_at = timezone.now()
        obj.save()
        return Response(
            {"detail": "Placement is now active.", "status": obj.status},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_withdraw",
    request=PlacementWithdrawSerializer,
    responses={
        200: inline_serializer(
            "PlacementWithdrawResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "status": drf_serializers.CharField(),
            },
        ),
        400: OpenApiResponse(description="Validation error."),
        403: OpenApiResponse(description="Not permitted to withdraw this placement."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class PlacementWithdrawView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount]

    def post(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        if user.role not in ("student", "internship_administrator"):
            return Response(
                {
                    "detail": "Only the student or an administrator can withdraw a placement."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if user.role == "student" and obj.student != user:
            return Response(
                {"detail": "You can only withdraw your own placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = PlacementWithdrawSerializer(obj, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            {"detail": "Placement withdrawn.", "status": obj.status},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_complete",
    request=None,
    responses={
        200: inline_serializer(
            "PlacementCompleteResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "status": drf_serializers.CharField(),
            },
        ),
        400: OpenApiResponse(description="Preconditions not met."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class PlacementCompleteView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def post(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if obj.status != "active":
            return Response(
                {"detail": "Only active placements can be completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not obj.final_report:
            return Response(
                {"detail": "Student has not uploaded the final report yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        open_logs = obj.weekly_logs.exclude(status="closed").count()
        if open_logs > 0:
            return Response(
                {"detail": f"{open_logs} weekly log(s) are not yet closed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        final_eval = obj.evaluations.filter(evaluation_type="final").first()
        if not final_eval or final_eval.status != "acknowledged":
            return Response(
                {"detail": "The final evaluation has not been acknowledged yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        obj.status = "completed"
        obj.completed_at = timezone.now()
        obj.save()
        return Response(
            {"detail": "Placement marked as completed.", "status": obj.status},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_final_report_upload",
    request=FinalReportSerializer,
    responses={
        200: OpenApiResponse(description="Final report uploaded successfully."),
        400: OpenApiResponse(description="Validation error."),
        404: OpenApiResponse(description="Placement not found."),
    },
)
class FinalReportUploadView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsStudent]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, pk):
        try:
            obj = InternshipPlacement.objects.get(pk=pk, student=request.user)
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = FinalReportSerializer(obj, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            {"detail": "Final report uploaded successfully."},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    operation_id="placements_stats",
    request=None,
    responses={
        200: inline_serializer(
            "PlacementStatsResponse",
            fields={
                "total": drf_serializers.IntegerField(),
                "by_status": drf_serializers.DictField(
                    child=drf_serializers.DictField()
                ),
                "by_cohort": drf_serializers.DictField(
                    child=drf_serializers.DictField()
                ),
            },
        ),
    },
)
class PlacementStatsView(APIView):

    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def get(self, request):
        qs = InternshipPlacement.objects.all()

        by_status = {}
        for choice in InternshipPlacement.STATUS:
            code = choice[0]
            label = choice[1]
            by_status[code] = {
                "label": label,
                "count": qs.filter(status=code).count(),
            }

        by_cohort = {}
        for choice in InternshipPlacement.INTAKE_COHORT:
            code = choice[0]
            label = choice[1]
            by_cohort[code] = {
                "label": label,
                "count": qs.filter(intake_cohort=code).count(),
            }

        return Response(
            {
                "total": qs.count(),
                "by_status": by_status,
                "by_cohort": by_cohort,
            },
            status=status.HTTP_200_OK,
        )


class PlacementReportView(APIView):
    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def get(self, request):
        return Response(
            build_admin_report_payload(),
            status=status.HTTP_200_OK,
        )
