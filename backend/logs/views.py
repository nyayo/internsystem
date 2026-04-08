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
from .permissions import (
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



































