from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
 
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirm password')
 
    class Meta:
        model  = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone_number', 'role', 'gender', 'district',
            'password', 'password2',
            'student_number', 'programme', 'year_of_study',
            'university', 'faculty', 'department',
            'job_title', 'organisation_name',
        ]
 
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError(
                'An account with this email already exists.'
            )
        return value.lower()
 
    def validate_student_number(self, value):
        if value and CustomUser.objects.filter(student_number=value).exists():
            raise serializers.ValidationError(
                'This student number is already registered.'
            )
        return value
 
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError(
                {'password': 'Passwords do not match.'}
            )
        return attrs
 
    def create(self, validated_data):
        password = validated_data.pop('password')
        user     = CustomUser(**validated_data)
        user.set_password(password)
        user.account_status = 'registered'
        user.save()
        return user


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
                  
