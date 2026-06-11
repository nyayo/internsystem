from django.db import models
from django.conf import settings
from placements.models import InternshipPlacement


class Evaluation(models.Model):

    STATUS = (
        ("not_started", "Not Started"),
        ("in_progress", "In Progress"),
        ("submitted", "Submitted"),
        ("acknowledge", "Acknowledge"),
    )

    EVALUATION_TYPE = (("midterm", "Midterm Evaluation"), ("final", "Final Evaluation"))

    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.CASCADE,
        related_name="evaluations",
        null=True,
        blank=True,
    )

    evaluator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="evaluations_as_supervisor",
        null=True,
        blank=True,
        limit_choices_to={"role": "workplace_supervisor"},
    )
    acknowledged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="acknowledged_evaluations",
        limit_choices_to={"role": "accademic supervisor"},
    )
    evaluation_type = models.CharField(max_length=10, choices=EVALUATION_TYPE)

    status = models.CharField(max_length=15, choices=STATUS)
    overall_remarks = models.TextField(blank=True)
    total_score = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )
    acknowledgement_notes = models.TextField(blank=True)
    acknowledged_at = models.DateTimeField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def calculate_total_score(self):
        """
        Sums all EvaluationScore.score_awarded values linked
        to this evaluation and stores the result in total_score.
        Call this after all EvaluationScore records have been saved.
        """
        from django.db.models import Sum

        total = self.scores.aggregate(
            total=Sum("score_awarded")
        )["total"]

        self.total_score = total if total is not None else 0
        self.save(update_fields=["total_score"])
        return self.total_score

    class Meta:
        verbose_name = "Evaluation"
        verbose_name_plural = "Evaluations"
        ordering = ["placement", "evaluation_type"]
        unique_together = ("placement", "evaluation_type")

    def __str__(self):
        return f"{self.evaluation_type}--{self.placement.student.get_full_name()}"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_status = self.status


class EvaluationCriteria(models.Model):
    CATEGORY = (
        ("professional_conduct", "Professional Conduct"),
        ("technical_skill", "Technical Skill"),
        ("communication", "Communication"),
        ("initiative", "Initiative and Problem Solving"),
        ("teamwork", "Teamwork and Collaboration"),
        ("punctuality", "Punctuality and Attendance"),
    )

    EVALUATOR_ROLE = (
        ("workplace_supervisor", "Workplace Supervisor"),
        ("academic_supervisor", "Aczdemic Supervisor"),
        ("both", "Both Supervisors"),
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    max_score = models.PositiveSmallIntegerField(default=20)
    category = models.CharField(max_length=30, choices=CATEGORY)
    evaluator_role = models.CharField(max_length=30, choices=EVALUATOR_ROLE)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_criteria",
        limit_choices_to={"role": "interniship_administrator"},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evaluation Criteria"
        verbose_name_plural = "Evaluatuion Criteria"

    def __str__(self):
        return f"{self.title}(max: {self.max_score})"


class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(
        Evaluation, on_delete=models.CASCADE, related_name="scores"
    )
    criteria = models.ForeignKey(
        EvaluationCriteria, on_delete=models.PROTECT, related_name="scores"
    )

    score_awarded = models.DecimalField(max_digits=5, decimal_places=2)
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ("evaluation", "criteria")

    def _str_(self):
        return f"{self.criteria.title}:{self.score_awarded}/{self.critera.max_score}"
    
