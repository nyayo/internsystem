from django.utils import timezone

from rest_framework          import status
from rest_framework.views    import APIView
from rest_framework.response import Response
from rest_framework.parsers  import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer, OpenApiParameter
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
    IsWorkplaceSupervisor,
    IsAcademicSupervisor,
    IsInternshipAdministrator,
    IsPlacementOwner,
    IsLinkedToPlacement,
)
from rest_framework.permissions import IsAuthenticated


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

class PlacementListCreateView(APIView):
    
    permission_classes = [IsAuthenticated, IsActiveAccount]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]
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
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk, user):
        try:
            obj = InternshipPlacement.objects.get(pk=pk)
        except InternshipPlacement.DoesNotExist:
            return None, Response(
                {"detail": "Placement not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        perm = IsLinkedToPlacement()
        if not perm.has_object_permission(None, None, obj):
           
            pass

        if not (
            user == obj.student
            or user == obj.academic_supervisor
            or user == obj.workplace_supervisor
            or user == obj.approved_by
            or user.role == "internship_administrator"
        ):
            return None, Response(
                {"detail": "You are not linked to this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
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
        obj, err = self.get_object(pk, request.user)
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
        obj, err = self.get_object(pk, request.user)
        if err:
            return err

        if request.user != obj.student:
            return Response(
                {"detail": "Only the student can edit a placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if obj.status != "draft":
            return Response(
                {"detail": "Only draft placements can be edited."},
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
        200: inline_serializer("PlacementSubmitResponse", fields={
            "detail": drf_serializers.CharField(),
            "status": drf_serializers.CharField(),
        }),
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
        200: inline_serializer("PlacementApprovalResponse", fields={
            "detail": drf_serializers.CharField(),
            "status": drf_serializers.CharField(),
        }),
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
        200: inline_serializer("PlacementActivateResponse", fields={
            "detail": drf_serializers.CharField(),
            "status": drf_serializers.CharField(),
        }),
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
        obj.status       = "active"
        obj.activated_at = timezone.now()
        obj.save()
        return Response(
            {"detail": "Placement is now active.", "status": obj.status},
            status=status.HTTP_200_OK,
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
                {"detail": "Only the student or an administrator can withdraw a placement."},
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
        obj.status       = "completed"
        obj.completed_at = timezone.now()
        obj.save()
        return Response(
            {"detail": "Placement marked as completed.", "status": obj.status},
            status=status.HTTP_200_OK,
        )



class FinalReportUploadView(APIView):
   
    permission_classes = [IsAuthenticated, IsActiveAccount, IsStudent]
    parser_classes     = [MultiPartParser, FormParser]

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


class PlacementStatsView(APIView):
   
    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def get(self, request):
        qs = InternshipPlacement.objects.all()

        by_status = {}
        for choice in InternshipPlacement.STATUS_CHOICES:
            code  = choice[0]
            label = choice[1]
            by_status[code] = {
                "label": label,
                "count": qs.filter(status=code).count(),
            }

        by_cohort = {}
        for choice in InternshipPlacement.INTAKE_COHORT_CHOICES:
            code  = choice[0]
            label = choice[1]
            by_cohort[code] = {
                "label": label,
                "count": qs.filter(intake_cohort=code).count(),
            }

        return Response(
            {
                "total":     qs.count(),
                "by_status": by_status,
                "by_cohort": by_cohort,
            },
            status=status.HTTP_200_OK,
        )









































   