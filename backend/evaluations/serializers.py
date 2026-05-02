from rest_framework import serializers
from .models import EvaluationCriteria, Evaluation, EvaluationScore

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    """
    Full serializer for criteria management.
    Administrator only for write operations.
    """
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
    """
    Serializer for individual criterion scores.
    Used nested inside EvaluationDetailSerializer.
    """
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
