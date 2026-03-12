from django.db import models


class Evaluation(models.Model):
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
