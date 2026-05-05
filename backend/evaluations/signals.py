from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Evaluation, EvaluationCriteria
from placements.models import InternshipPlacement