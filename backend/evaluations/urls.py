from django.urls import path
from .views import (
    EvaluationCriteriaListCreateView,
    EvaluationCriteriaDetailView,
    EvaluationListView,
    EvaluationDetailView,
    EvaluationSaveDraftView,
    EvaluationSubmitView,
    EvaluationAcknowledgeView,
    PendingEvaluationsView,
    PlacementEvaluationSummaryView,
    EvaluationStatsView,
)

urlpatterns = [
    path(
        "criteria/",
        EvaluationCriteriaListCreateView.as_view(),
        name="criteria_list_create",
    ),
    path(
        "criteria/<int:pk>/",
        EvaluationCriteriaDetailView.as_view(),
        name="criteria_detail",
    ),
    path(
        "evaluations/pending/",
        PendingEvaluationsView.as_view(),
        name="evaluation_pending",
    ),
    path(
        "evaluations/placement/<int:placement_id>/summary/",
        PlacementEvaluationSummaryView.as_view(),
        name="evaluation_placement_summary",
    ),
]