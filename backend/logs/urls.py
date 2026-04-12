
from django.urls import path
from .views import (
    WeeklyLogListCreateView,
    WeeklyLogDetailView,
    # WeeklyLogSubmitView,
    # WeeklyLogEndorseView,
    # WeeklyLogAssessView,
    # WeeklyLogCloseView,
    PlacementLogSummaryView,
    PendingLogsView,
)

urlpatterns = [
    path(
        "logs/",
        WeeklyLogListCreateView.as_view(),
        name="log_list_create",
    ),
    # Pending action for supervisors
    path(
        "logs/pending/",
        PendingLogsView.as_view(),
        name="log_pending",
    ),
    # Placement summary
    path(
        "logs/placement/<int:placement_id>/summary/",
        PlacementLogSummaryView.as_view(),
        name="log_placement_summary",
    ),
    # Detail & edit
    path(
        "logs/<int:pk>/",
        WeeklyLogDetailView.as_view(),
        name="log_detail",
    ),
    # Workflow actions
    # path(
    #     "logs/<int:pk>/submit/",
    #     WeeklyLogSubmitView.as_view(),
    #     name="log_submit",
    # ),
    # path(
    #     "logs/<int:pk>/endorse/",
    #     WeeklyLogEndorseView.as_view(),
    #     name="log_endorse",
    # ),
    # path(
    #     "logs/<int:pk>/assess/",
    #     WeeklyLogAssessView.as_view(),
    #     name="log_assess",
    # ),
    # path(
    #     "logs/<int:pk>/close/",
    #     WeeklyLogCloseView.as_view(),
    #     name="log_close",
    # ),
]









































