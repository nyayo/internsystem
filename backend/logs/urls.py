
from django.urls import path
from .views import (
    WeeklyLogListCreateView,
    WeeklyLogDetailView,
    WeeklyLogSubmitView,
    WeeklyLogEndorseView,
    WeeklyLogAssessView,
    WeeklyLogCloseView,
    PlacementLogSummaryView,
    PendingLogsView,
)

urlpatterns = [
    path(
        "logs/",
        WeeklyLogListCreateView.as_view(),
        name="log_list_create",
    ),
    path(
        "logs/pending/",
        PendingLogsView.as_view(),
        name="log_pending",
    ),
    path(
        "logs/placement/<int:placement_id>/summary/",
        PlacementLogSummaryView.as_view(),
        name="log_placement_summary",
    ),
    path(
        "logs/<int:pk>/",
        WeeklyLogDetailView.as_view(),
        name="log_detail",
    ),
    path(
        "logs/<int:pk>/submit/",
        WeeklyLogSubmitView.as_view(),
        name="log_submit",
    ),
    path(
        "logs/<int:pk>/endorse/",
        WeeklyLogEndorseView.as_view(),
        name="log_endorse",
    ),
    path(
        "logs/<int:pk>/assess/",
        WeeklyLogAssessView.as_view(),
        name="log_assess",
    ),
    path(
        "logs/<int:pk>/close/",
        WeeklyLogCloseView.as_view(),
        name="log_close",
    ),
]









































