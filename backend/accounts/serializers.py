
from rest_framework import serializers
from .models import CustomUser

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id',
                  'username',
                  'email',
                  'first_name',
                  'last_name',
                  'phone_number',
                  'role',
                  'gender',
                  'district',
                  'profile photo',
                  'account_status',
                  'is_active',
                  'is_staff',
                  'date_joined',
                  'student_number',
                  'programme',
                  'job_title',
                  'organisation_name')
        read_only_fields = ('date_joined', 'is_active', 'is_staff')
                  
