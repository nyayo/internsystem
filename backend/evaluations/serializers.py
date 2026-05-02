from rest_framework import serializers
from .models import EvaluationCriteria, Evaluation, EvaluationScore

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True, default=None
    )

    class Meta:
        model  = EvaluationCriteria
        fields = [
            "id",
            "title",
            "description",
            "max_score",
            "category",
            "evaluator_role",
            "is_active",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def validate_max_score(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Max score must be greater than zero."
            )
        return value
    

class EvaluationScoreSerializer(serializers.ModelSerializer):
    criteria_title     = serializers.CharField(
        source="criteria.title", read_only=True
    )
    criteria_max_score = serializers.IntegerField(
        source="criteria.max_score", read_only=True
    )
    criteria_category  = serializers.CharField(
        source="criteria.category", read_only=True
    )

    class Meta:
        model  = EvaluationScore
        fields = [
            "id",
            "criteria",
            "criteria_title",
            "criteria_category",
            "criteria_max_score",
            "score_awarded",
            "comment",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        criteria    = attrs.get("criteria")
        score       = attrs.get("score_awarded")
        if criteria and score is not None:
            if score < 0:
                raise serializers.ValidationError(
                    {"score_awarded": "Score cannot be negative."}
                )
            if score > criteria.max_score:
                raise serializers.ValidationError(
                    {
                        "score_awarded": (
                            f"Score {score} exceeds the maximum of "
                            f"{criteria.max_score} for '{criteria.title}'."
                        )
                    }
                )
        return attrs


class EvaluationListSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(
        source="placement.student.get_full_name", read_only=True
    )
    student_number  = serializers.CharField(
        source="placement.student.student_number", read_only=True
    )
    organisation    = serializers.CharField(
        source="placement.organisation_name", read_only=True
    )
    evaluator_name  = serializers.CharField(
        source="evaluator.get_full_name", read_only=True
    )

    class Meta:
        model  = Evaluation
        fields = [
            "id",
            "placement",
            "student_name",
            "student_number",
            "organisation",
            "evaluator_name",
            "evaluation_type",
            "status",
            "total_score",
            "submitted_at",
        ]


class EvaluationDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for evaluation detail views.
    Includes nested scores and all related user names.
    """
    student_name        = serializers.CharField(
        source="placement.student.get_full_name", read_only=True
    )
    student_number      = serializers.CharField(
        source="placement.student.student_number", read_only=True
    )
    organisation        = serializers.CharField(
        source="placement.organisation_name", read_only=True
    )
    evaluator_name      = serializers.CharField(
        source="evaluator.get_full_name", read_only=True
    )
    acknowledged_by_name = serializers.CharField(
        source="acknowledged_by.get_full_name", read_only=True, default=None
    )
    scores = EvaluationScoreSerializer(many=True, read_only=True)

    class Meta:
        model  = Evaluation
        fields = [
            "id",
            "placement",
            "student_name",
            "student_number",
            "organisation",
            "evaluator",
            "evaluator_name",
            "evaluation_type",
            "status",
            "scores",
            "total_score",
            "overall_remarks",
            "acknowledged_by",
            "acknowledged_by_name",
            "acknowledgement_notes",
            "acknowledged_at",
            "submitted_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "placement",
            "evaluator",
            "evaluation_type",
            "status",
            "total_score",
            "acknowledged_by",
            "acknowledged_at",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

class EvaluationSubmitSerializer(serializers.Serializer):
    overall_remarks = serializers.CharField(allow_blank=True, default="")
    scores = serializers.ListField(
        child=serializers.DictField(), allow_empty=False
    )

    def validate_scores(self, value):
        from .models import EvaluationCriteria

        active_criteria = EvaluationCriteria.objects.filter(is_active=True)
        active_ids      = set(active_criteria.values_list("id", flat=True))
        submitted_ids   = set()

        for item in value:
            if "criteria" not in item:
                raise serializers.ValidationError(
                    "Each score entry must include a 'criteria' id."
                )
            if "score_awarded" not in item:
                raise serializers.ValidationError(
                    "Each score entry must include a 'score_awarded' value."
                )

            criteria_id = item["criteria"]
            score       = item["score_awarded"]

            if criteria_id not in active_ids:
                raise serializers.ValidationError(
                    f"Criteria {criteria_id} is not active."
                )

            if criteria_id in submitted_ids:
                raise serializers.ValidationError(
                    f"Criteria {criteria_id} appears more than once."
                )
            submitted_ids.add(criteria_id)

            criteria = active_criteria.get(id=criteria_id)
            try:
                score = float(score)
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    f"Score for '{criteria.title}' must be a number."
                )
            if score < 0 or score > criteria.max_score:
                raise serializers.ValidationError(
                    f"Score for '{criteria.title}' must be between 0 and {criteria.max_score}."
                )

        if submitted_ids != active_ids:
            missing = active_ids - submitted_ids
            missing_titles = active_criteria.filter(
                id__in=missing
            ).values_list("title", flat=True)
            raise serializers.ValidationError(
                f"Missing scores for: {', '.join(missing_titles)}."
            )

        return value

    def update(self, instance, validated_data):
        from django.utils import timezone
        from .models import EvaluationCriteria, EvaluationScore

        if instance.status not in ("not_started", "in_progress"):
            raise serializers.ValidationError(
                {"status": "Only not_started or in_progress evaluations can be submitted."}
            )

        overall_remarks = validated_data.get("overall_remarks", "")
        scores_data     = validated_data.get("scores")

        instance.scores.all().delete()

        for item in scores_data:
            criteria = EvaluationCriteria.objects.get(id=item["criteria"])
            EvaluationScore.objects.create(
                evaluation    = instance,
                criteria      = criteria,
                score_awarded = item["score_awarded"],
                comment       = item.get("comment", ""),
            )

        instance.overall_remarks = overall_remarks
        instance.status          = "submitted"
        instance.submitted_at    = timezone.now()
        instance.save()
        instance.calculate_total_score()

        return instance


class EvaluationSaveDraftSerializer(serializers.Serializer):
    """
    Workplace supervisor saves partial scores without submitting.
    Scores list may be incomplete — no validation against active criteria.
    """
    overall_remarks = serializers.CharField(allow_blank=True, default="")
    scores = serializers.ListField(
        child=serializers.DictField(), allow_empty=True
    )

    def update(self, instance, validated_data):
        from .models import EvaluationCriteria, EvaluationScore

        if instance.status not in ("not_started", "in_progress"):
            raise serializers.ValidationError(
                {"status": "Cannot update a submitted or acknowledged evaluation."}
            )

        scores_data = validated_data.get("scores", [])

        for item in scores_data:
            criteria_id = item.get("criteria")
            score       = item.get("score_awarded")
            comment     = item.get("comment", "")

            if not criteria_id or score is None:
                continue

            try:
                criteria = EvaluationCriteria.objects.get(
                    id=criteria_id, is_active=True
                )
            except EvaluationCriteria.DoesNotExist:
                continue

            EvaluationScore.objects.update_or_create(
                evaluation=instance,
                criteria=criteria,
                defaults={
                    "score_awarded": score,
                    "comment":       comment,
                },
            )

        instance.overall_remarks = validated_data.get(
            "overall_remarks", instance.overall_remarks
        )
        instance.status = "in_progress"
        instance.save()
        return instance



class EvaluationAcknowledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Evaluation
        fields = ["acknowledgement_notes"]

    def update(self, instance, validated_data):
        from django.utils import timezone

        if instance.status != "submitted":
            raise serializers.ValidationError(
                {"status": "Only submitted evaluations can be acknowledged."}
            )

        instance.acknowledged_by    = self.context["request"].user
        instance.acknowledgement_notes = validated_data.get(
            "acknowledgement_notes", ""
        )
        instance.acknowledged_at    = timezone.now()
        instance.status             = "acknowledged"
        instance.save()
        return instance