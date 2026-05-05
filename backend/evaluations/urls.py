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

urlpatterns = []