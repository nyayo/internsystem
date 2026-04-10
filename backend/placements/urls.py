from django.urls import path
from .views import (
    PlacementListCreateView,
    PlacementDetailView,
    PlacementSubmitView,
    PlacementApprovalView,
    PlacementActivateView,
    PlacementWithdrawView,
    PlacementCompleteView,
    FinalReportUploadView,
    PlacementStatsView,
)

urlpatterns = [
   
    path(
        "placements/",
        PlacementListCreateView.as_view(),
        name="placement_list_create",
    ),
   
    path(
        "placements/<int:pk>/",
        PlacementDetailView.as_view(),
        name="placement_detail",
    ),
    path(
        "placements/<int:pk>/submit/",
        PlacementSubmitView.as_view(),
        name="placement_submit",
    ),
    path(
        "placements/<int:pk>/approve/",
        PlacementApprovalView.as_view(),
        name="placement_approve",
    ),
    path(
        "placements/<int:pk>/activate/",
        PlacementActivateView.as_view(),
        name="placement_activate",
    ),
    path(
        "placements/<int:pk>/withdraw/",
        PlacementWithdrawView.as_view(),
        name="placement_withdraw",
    ),
    path(
        "placements/<int:pk>/complete/",
        PlacementCompleteView.as_view(),
        name="placement_complete",
    ),
  
    path(
        "placements/<int:pk>/final-report/",
        FinalReportUploadView.as_view(),
        name="placement_final_report",
    ),
    path(
        "placements/stats/",
        PlacementStatsView.as_view(),
        name="placement_stats",
    ),
]





























