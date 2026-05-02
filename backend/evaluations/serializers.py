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
    
    