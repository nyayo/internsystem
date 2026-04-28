from rest_framework import serializers
from .models import InternshipPlacement


class PlacementListSerializer(serializers.ModelSerializer):
    
    student_name      = serializers.CharField(source="student.get_full_name", read_only=True)
    student_number    = serializers.CharField(source="student.student_number", read_only=True)
    academic_sup_name = serializers.CharField(
        source="academic_supervisor.get_full_name", read_only=True, default=None
    )
    workplace_sup_name = serializers.CharField(
        source="workplace_supervisor.get_full_name", read_only=True, default=None
    )
    duration_weeks = serializers.ReadOnlyField()

    class Meta:
        model  = InternshipPlacement
        fields = [
            "id",
            "student_name",
            "student_number",
            "organisation_name",
            "organisation_type",
            "organisation_district",
            "organisation_address",
            "department",
            "start_date",
            "end_date",
            "duration_weeks",
            "status",
            "intake_cohort",
            "remuneration_type",
            "request_letter",
            "acceptance_letter",
            "academic_sup_name",
            "workplace_sup_name",   
            "wp_supervisor_email",
            "wp_supervisor_phone",
            "wp_supervisor_title",
        ]


class PlacementDetailSerializer(serializers.ModelSerializer):
   
    student_name       = serializers.CharField(source="student.get_full_name", read_only=True)
    student_number     = serializers.CharField(source="student.student_number", read_only=True)
    academic_sup_name  = serializers.CharField(
        source="academic_supervisor.get_full_name", read_only=True, default=None
    )
    workplace_sup_name = serializers.CharField(
        source="workplace_supervisor.get_full_name", read_only=True, default=None
    )
    approved_by_name   = serializers.CharField(
        source="approved_by.get_full_name", read_only=True, default=None
    )
    duration_weeks = serializers.ReadOnlyField()

    class Meta:
        model  = InternshipPlacement
        fields = [
            "id",
            "student",
            "student_name",
            "student_number",
            "organisation_name",
            "organisation_type",
            "organisation_district",
            "organisation_address",
            "department",
            "wp_supervisor_name",
            "wp_supervisor_email",
            "wp_supervisor_phone",
            "wp_supervisor_title",
            "start_date",
            "end_date",
            "duration_weeks",
            "intake_cohort",
            "remuneration_type",
            "placement_fee",
            "request_letter",
            "acceptance_letter",
            "final_report",
            "final_report_abstract",
            "report_declaration",
            "status",
            "rejection_reason",
            "withdrawal_reason",
            "approval_date",
            "activated_at",
            "completed_at",

            "academic_supervisor",
            "academic_sup_name",
            "workplace_supervisor",
            "workplace_sup_name",
            "approved_by",
            "approved_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id", "student", "status",
            "rejection_reason", "withdrawal_reason",
            "approval_date", "activated_at", "completed_at",
            "academic_supervisor", "workplace_supervisor", "approved_by",
            "created_at", "updated_at",
        ]

    def validate(self, attrs):
        start = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end   = attrs.get("end_date",   getattr(self.instance, "end_date",   None))

        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_date": "End date must be after start date."}
            )
        return attrs

    def validate_report_declaration(self, value):
        if self.instance and self.instance.status == "active":
            if self.instance.final_report and not value:
                raise serializers.ValidationError(
                    "You must declare that the report is your own work."
                )
        return value



class PlacementApprovalSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = InternshipPlacement
        fields = [
            "status",
            "academic_supervisor",
            "intake_cohort",
            "rejection_reason",
        ]

    def validate(self, attrs):
        status = attrs.get("status")

        if status == "approved" and not attrs.get("academic_supervisor"):
            raise serializers.ValidationError(
                {"academic_supervisor": "An academic supervisor must be assigned on approval."}
            )
        if status == "approved" and not attrs.get("intake_cohort"):
            raise serializers.ValidationError(
                {"intake_cohort": "An intake cohort must be set on approval."}
            )
        if status == "rejected" and not attrs.get("rejection_reason"):
            raise serializers.ValidationError(
                {"rejection_reason": "A rejection reason is required."}
            )
        return attrs

    def update(self, instance, validated_data):
        from django.utils import timezone

        status = validated_data.get("status")

        if instance.status != "pending_approval":
            raise serializers.ValidationError(
                {"status": "Only pending placements can be approved or rejected."}
            )
        if status not in ("approved", "rejected"):
            raise serializers.ValidationError(
                {"status": "Status must be 'approved' or 'rejected'."}
            )

        instance.status = status

        if status == "approved":
            instance.academic_supervisor = validated_data.get("academic_supervisor")
            instance.intake_cohort       = validated_data.get("intake_cohort")
            instance.approved_by         = self.context["request"].user
            instance.approval_date       = timezone.now()
        else:
            instance.rejection_reason = validated_data.get("rejection_reason")

        instance.save()
        return instance


class PlacementWithdrawSerializer(serializers.ModelSerializer):
   
    class Meta:
        model  = InternshipPlacement
        fields = ["withdrawal_reason"]

    def validate(self, attrs):
        if not attrs.get("withdrawal_reason"):
            raise serializers.ValidationError(
                {"withdrawal_reason": "A reason is required to withdraw a placement."}
            )
        return attrs

    def update(self, instance, validated_data):
        if instance.status not in ("approved", "active"):
            raise serializers.ValidationError(
                {"status": "Only approved or active placements can be withdrawn."}
            )
        instance.status            = "withdrawn"
        instance.withdrawal_reason = validated_data.get("withdrawal_reason")
        instance.save()
        return instance


class PlacementSubmitSerializer(serializers.ModelSerializer):
    
    class Meta:
        model  = InternshipPlacement
        fields = ["status"]

    def update(self, instance, validated_data):
        if instance.status != "draft":
            raise serializers.ValidationError(
                {"status": "Only draft placements can be submitted."}
            )
        if not instance.request_letter:
            raise serializers.ValidationError(
                {"request_letter": "Upload your university request letter before submitting."}
            )
        if not instance.acceptance_letter:
            raise serializers.ValidationError(
                {"acceptance_letter": "Upload the organisation acceptance letter before submitting."}
            )
        instance.status = "pending_approval"
        instance.save()
        return instance



class FinalReportSerializer(serializers.ModelSerializer):
   
    class Meta:
        model  = InternshipPlacement
        fields = ["final_report", "final_report_abstract", "report_declaration"]

    def validate(self, attrs):
        if not attrs.get("report_declaration"):
            raise serializers.ValidationError(
                {"report_declaration": "You must declare the report is your own original work."}
            )
        if not attrs.get("final_report"):
            raise serializers.ValidationError(
                {"final_report": "A report file must be uploaded."}
            )
        return attrs

    def update(self, instance, validated_data):
        if instance.status not in ("active", "completed"):
            raise serializers.ValidationError(
                {"status": "Final reports can only be uploaded for active or completed placements."}
            )
        instance.final_report          = validated_data.get("final_report")
        instance.final_report_abstract = validated_data.get("final_report_abstract", "")
        instance.report_declaration    = validated_data.get("report_declaration")
        instance.save()
        return instance












































