from rest_framework import serializers
from .models import WeeklyLogs


class WeeklyLogListSerializer(serializers.ModelSerializer):
    
    student_name = serializers.CharField(
        source="placement.student.get_full_name", read_only=True
    )
    student_number = serializers.CharField(
        source="placement.student.student_number", read_only=True
    )
    organisation = serializers.CharField(
        source="placement.organisation_name", read_only=True
    )

    class Meta:
        model  = WeeklyLogs
        fields = [
            "id",
            "student_name",
            "student_number",
            "organisation",
            "week_number",
            "week_start_date",
            "week_end_date",
            "status",
            "academic_grade",
            "submitted_at",
        ]


class WeeklyLogDetailSerializer(serializers.ModelSerializer):
   
    student_name = serializers.CharField(
        source="placement.student.get_full_name", read_only=True
    )
    student_number = serializers.CharField(
        source="placement.student.student_number", read_only=True
    )
    organisation = serializers.CharField(
        source="placement.organisation_name", read_only=True
    )
    workplace_endorsed_by_name = serializers.CharField(
        source="workplace_endorsed_by.get_full_name",
        read_only=True,
        default=None,
    )
    academic_assessed_by_name = serializers.CharField(
        source="academic_assessed_by.get_full_name",
        read_only=True,
        default=None,
    )

    class Meta:
        model  = WeeklyLogs
        fields = [
            "id",
            "placement",
            "student_name",
            "student_number",
            "organisation",
            "week_number",
            "week_start_date",
            "week_end_date",
            "activities_performed",
            "skills_gained",
            "challenges_faced",
            "student_remarks",
            "status",
            "workplace_comment",
            "workplace_endorsed_by",
            "workplace_endorsed_by_name",
            "workplace_endorsed_at",
            "academic_comment",
            "academic_grade",
            "academic_assessed_by",
            "academic_assessed_by_name",
            "academic_assessed_at",
            "submitted_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "workplace_comment",
            "workplace_endorsed_by",
            "workplace_endorsed_at",
            "academic_comment",
            "academic_grade",
            "academic_assessed_by",
            "academic_assessed_at",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        start = attrs.get(
            "week_start_date",
            getattr(self.instance, "week_start_date", None)
        )
        end = attrs.get(
            "week_end_date",
            getattr(self.instance, "week_end_date", None)
        )
        if start and end and end <= start:
            raise serializers.ValidationError(
                {"week_end_date": "End date must be after start date."}
            )
        return attrs

    def validate_placement(self, value):
        request = self.context.get("request")
        if value.student != request.user:
            raise serializers.ValidationError(
                "You can only create logs for your own placement."
            )
        if value.status != "active":
            raise serializers.ValidationError(
                "Logs can only be created for active placements."
            )
        return value

    def validate_week_number(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError(
                "Week number must be between 1 and 12."
            )
        return value


class WeeklyLogSubmitSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = WeeklyLogs
        fields = ["status"]

    def update(self, instance, validated_data):
        from django.utils import timezone

        if instance.status not in ("draft", "resubmit"):
            raise serializers.ValidationError(
                {"status": "Only draft or resubmit logs can be submitted."}
            )
        required = [
            "activities_performed",
            "skills_gained",
            "challenges_faced",
        ]
        for field in required:
            if not getattr(instance, field, "").strip():
                raise serializers.ValidationError(
                    {field: f"This field cannot be empty before submitting."}
                )

        instance.status       = "submitted"
        instance.submitted_at = timezone.now()
        instance.save()
        return instance






















































