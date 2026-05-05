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
]