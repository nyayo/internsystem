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
    programme = serializers.CharField(
        source="placement.student.programme", read_only=True
    )

    class Meta:
        model  = WeeklyLogs
        fields = [
            "id",
            "student_name",
            "student_number",
            "programme",
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
    programme = serializers.CharField(
        source="placement.student.programme", read_only=True
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
            "programme",
            "week_number",
            "week_start_date",
            "week_end_date",
            "activities_performed",
            "skills_gained",
            "challenges_faced",
            "student_remarks",
            "status",
            "workplace_remarks",
            "workplace_endorsed_by",
            "workplace_endorsed_by_name",
            "workplace_endorsed_at",
            "academic_remarks",
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
            "workplace_remarks",
            "workplace_endorsed_by",
            "workplace_endorsed_at",
            "academic_remarks",
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
                    {field: "This field cannot be empty before submitting."}
                )

        instance.status       = "submitted"
        instance.submitted_at = timezone.now()
        instance.save()
        return instance

class WorkplaceEndorseSerializer(serializers.ModelSerializer):
   
    ACTION_CHOICES = (
        ("endorse", "Endorse"),
        ("return",  "Return for revision"),
    )
    action = serializers.ChoiceField(
        choices=ACTION_CHOICES, write_only=True
    )

    class Meta:
        model  = WeeklyLogs
        fields = ["action", "resubmit_reason", "workplace_remarks"]

    def validate(self, attrs):
        if attrs.get("action") == "return" and not attrs.get("resubmit_reason", "").strip():
            raise serializers.ValidationError(
                {"resubmit_reason": "A reason is required when returning a log for revision."}
            )
        return attrs

    def update(self, instance, validated_data):
        from django.utils import timezone

        if instance.status != "submitted":
            raise serializers.ValidationError(
                {"status": "Only submitted logs can be endorsed or returned."}
            )
        action = validated_data.pop("action")

        instance.resubmit_reason = validated_data.get(
            "resubmit_reason", instance.resubmit_reason
        )
        instance.workplace_remarks    =          validated_data.get("workplace_remarks", "")
        instance.workplace_endorsed_by = self.context["request"].user
        instance.workplace_endorsed_at = timezone.now()

        if action == "endorse":
            instance.status = "endorsed"
        else:
            instance.status = "resubmit"

        instance.save()
        return instance
    
class AcademicAssessSerializer(serializers.ModelSerializer):
   
    class Meta:
        model  = WeeklyLogs
        fields = ["academic_remarks", "academic_grade"]

    def validate_academic_grade(self, value):
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError(
                "Grade must be between 0 and 100."
            )
        return value

    def validate(self, attrs):
        if not attrs.get("academic_grade") and attrs.get("academic_grade") != 0:
            raise serializers.ValidationError(
                {"academic_grade": "A grade is required to assess a log."}
            )
        return attrs

    def update(self, instance, validated_data):
        from django.utils import timezone

        if instance.status != "endorsed":
            raise serializers.ValidationError(
                {"status": "Only endorsed logs can be assessed."}
            )
        instance.academic_remarks    = validated_data.get("academic_remarks", "")
        instance.academic_grade      = validated_data.get("academic_grade")
        instance.academic_assessed_by = self.context["request"].user
        instance.academic_assessed_at = timezone.now()
        instance.status              = "assessed"
        instance.save()
        return instance


class WeeklyLogCloseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = WeeklyLogs
        fields = ["status"]

    def update(self, instance, validated_data):
        if instance.status != "assessed":
            raise serializers.ValidationError(
                {"status": "Only assessed logs can be closed."}
            )
        instance.status = "closed"
        instance.save()
        return instance    




















































