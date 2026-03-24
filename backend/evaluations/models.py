from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Evaluation(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL,
    on_delete=models.PROTECT, related_name='evaluations_as_student',
    limit_choices_to = {'role':'student'})

    evaluator = models.ForeignKey(settings.AUTH_USER_MODEL, 
    on_delete = models.CASCADE, related_name= 'evaluations_as_supervisor',
    limit_choices_to = {'role': 'workplace_supervisor'})
    evaluation_type = models.CharField(max_length=10)
    status = models.CharField(max_length=15)
    overall_remarks = models.TextField(blank=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    


class EvaluationCriteria(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    max_score = models.PositiveSmallIntegerField(default=20)
    category = models.CharField(max_length=30)
    evaluator_role = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='scores')
    criteria = models.ForeignKey(EvaluationCriteria,
    on_delete=models.PROTECT,related_name='scores')

    score_awarded = models.DecimalField(max_digits=5, decimal_places=2)
    comment = models.TextField(blank=True)

class Meta:
    unique_together = ('evaluation','criteria')
def _str_(self):
    return f"{self.criteria.title}:{self.score_awarded}/{self.critera.max_score}"

