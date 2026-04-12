from rest_framework          import status
from rest_framework.views    import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import WeeklyLogs
from placements.models import InternshipPlacement
from .serializers import (
    WeeklyLogListSerializer,
    WeeklyLogDetailSerializer,
    WeeklyLogSubmitSerializer,
    WorkplaceEndorseSerializer,
    AcademicAssessSerializer,
    WeeklyLogCloseSerializer,
)

from accounts.permissions import (
    IsActiveAccount,
    IsStudent,
    IsWorkplaceSupervisor,
    IsAcademicSupervisor,
    IsInternshipAdministrator,
)


def get_log_queryset(user):
   
    if user.role == "student":
        return WeeklyLogs.objects.filter(placement__student=user)

    if user.role == "workplace_supervisor":
        return WeeklyLogs.objects.filter(
            placement__workplace_supervisor=user
        )

    if user.role == "academic_supervisor":
        return WeeklyLogs.objects.filter(
            placement__academic_supervisor=user
        )

    if user.role == "internship_administrator":
        return WeeklyLogs.objects.all()


    return WeeklyLogs.objects.none()


def get_log_or_404(pk, user):
   
    try:
        log = WeeklyLogs.objects.select_related(
            "placement__student",
            "placement__workplace_supervisor",
            "placement__academic_supervisor",
            "workplace_endorsed_by",
            "academic_assessed_by",
        ).get(pk=pk)
    except WeeklyLogs.DoesNotExist:
        return None, Response(
            {"detail": "Weekly log not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not (
        user == log.placement.student
        or user == log.placement.workplace_supervisor
        or user == log.placement.academic_supervisor
        or user.role == "internship_administrator"
    ):
        return None, Response(
            {"detail": "You are not linked to this placement."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return log, None


class WeeklyLogListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request):
        queryset = get_log_queryset(request.user)

        placement_id = request.query_params.get("placement")
        log_status   = request.query_params.get("status")
        week         = request.query_params.get("week")

        if placement_id:
            queryset = queryset.filter(placement_id=placement_id)
        if log_status:
            queryset = queryset.filter(status=log_status)
        if week:
            queryset = queryset.filter(week_number=week)

        serializer = WeeklyLogListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request):
        if request.user.role != "student":
            return Response(
                {"detail": "Only students can create weekly logs."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = WeeklyLogDetailSerializer(
            data=request.data,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save(status="draft")
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WeeklyLogDetailView(APIView):
   
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request, pk):
        log, err = get_log_or_404(pk, request.user)
        if err:
            return err
        serializer = WeeklyLogDetailSerializer(log)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        log, err = get_log_or_404(pk, request.user)
        if err:
            return err

        if request.user != log.placement.student:
            return Response(
                {"detail": "Only the student can edit a log."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if log.status not in ("draft", "resubmit"):
            return Response(
                {"detail": "Only draft or resubmit logs can be edited."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = WeeklyLogDetailSerializer(
            log,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

class WeeklyLogSubmitView(APIView):
   
    permission_classes = [IsAuthenticated, IsActiveAccount, IsStudent]

    def post(self, request, pk):
        try:
            log = WeeklyLogs.objects.get(
                pk=pk, placement__student=request.user
            )
        except WeeklyLogs.DoesNotExist:
            return Response(
                {"detail": "Weekly log not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = WeeklyLogSubmitSerializer(
            log, data={}, partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(
            {
                "detail": "Log submitted for workplace supervisor review.",
                "status": log.status,
            },
            status=status.HTTP_200_OK,
        )
class WeeklyLogEndorseView(APIView):
    
    permission_classes = [IsAuthenticated, IsActiveAccount, IsWorkplaceSupervisor]

    def post(self, request, pk):
        try:
            log = WeeklyLogs.objects.get(pk=pk)
        except WeeklyLogs.DoesNotExist:
            return Response(
                {"detail": "Weekly log not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if log.placement.workplace_supervisor != request.user:
            return Response(
                {"detail": "You are not the workplace supervisor for this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = WorkplaceEndorseSerializer(
            log,
            data=request.data,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(
            {
                "detail": f"Log {log.status}.",
                "status": log.status,
            },
            status=status.HTTP_200_OK,
        )


class WeeklyLogAssessView(APIView):
    
    permission_classes = [IsAuthenticated, IsActiveAccount, IsAcademicSupervisor]

    def post(self, request, pk):
        try:
            log = WeeklyLogs.objects.get(pk=pk)
        except WeeklyLogs.DoesNotExist:
            return Response(
                {"detail": "Weekly log not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if log.placement.academic_supervisor != request.user:
            return Response(
                {"detail": "You are not the academic supervisor for this placement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = AcademicAssessSerializer(
            log,
            data=request.data,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(
            {
                "detail": "Log assessed successfully.",
                "status": log.status,
                "grade":  str(log.academic_grade),
            },
            status=status.HTTP_200_OK,
        )

class WeeklyLogCloseView(APIView):
    
    permission_classes = [IsAuthenticated, IsActiveAccount, IsInternshipAdministrator]

    def post(self, request, pk):
        try:
            log = WeeklyLogs.objects.get(pk=pk)
        except WeeklyLogs.DoesNotExist:
            return Response(
                {"detail": "Weekly log not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = WeeklyLogCloseSerializer(
            log, data={}, partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(
            {
                "detail": "Log closed successfully.",
                "status": log.status,
            },
            status=status.HTTP_200_OK,
        )


class PlacementLogSummaryView(APIView):
   
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

        logs = WeeklyLogs.objects.filter(placement=placement)

        
        status_counts = {}
        for code, _ in WeeklyLogs.STATUS:
            status_counts[code] = logs.filter(status=code).count()

       
        graded = logs.filter(
            academic_grade__isnull=False
        ).values_list("academic_grade", flat=True)

        avg_grade = None
        if graded:
            avg_grade = round(sum(graded) / len(graded), 2)

        
        log_list = WeeklyLogListSerializer(
            logs.order_by("week_number"), many=True
        ).data

        return Response(
            {
                "placement_id":   placement.id,
                "organisation":   placement.organisation_name,
                "student":        placement.student.get_full_name(),
                "total_weeks":    placement.duration_weeks,
                "submitted":      logs.exclude(status="draft").count(),
                "closed":         status_counts.get("closed", 0),
                "average_grade":  avg_grade,
                "status_counts":  status_counts,
                "logs":           log_list,
            },
            status=status.HTTP_200_OK,
        )


class PendingLogsView(APIView):
    
    permission_classes = [IsAuthenticated, IsActiveAccount]

    def get(self, request):
        user = request.user

        if user.role == "workplace_supervisor":
            queryset = WeeklyLogs.objects.filter(
                placement__workplace_supervisor=user,
                status="submitted",
            )
        elif user.role == "academic_supervisor":
            queryset = WeeklyLogs.objects.filter(
                placement__academic_supervisor=user,
                status="endorsed",
            )
        elif user.role == "internship_administrator":
            queryset = WeeklyLogs.objects.filter(
                status__in=("submitted", "endorsed")
            )
        else:
            return Response(
                {"detail": "Pending logs are not applicable for your role."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = WeeklyLogListSerializer(queryset, many=True)
        return Response(
            {
                "count": queryset.count(),
                "logs":  serializer.data,
            },
            status=status.HTTP_200_OK,
        )






















