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


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)
 
    def validate(self, attrs):
        email    = attrs.get('email').lower().strip()
        password = attrs.get('password')
 
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                {'email': 'No account found with this email address.'}
            )
 
        if not user.check_password(password):
            raise serializers.ValidationError(
                {'password': 'Incorrect password.'}
            )
 
        if user.account_status == 'registered':
            raise serializers.ValidationError(
                {'account': 'Please verify your email to activate your account.'}
            )
        if user.account_status == 'suspended':
            raise serializers.ValidationError(
                {'account': 'Your account is suspended. Contact the administrator.'}
            )
        if user.account_status == 'deactivated':
            raise serializers.ValidationError(
                {'account': 'Your account has been deactivated.'}
            )
 
        if not user.is_active:
            raise serializers.ValidationError(
                {'account': 'This account is inactive.'}
            )
 
        refresh = RefreshToken.for_user(user)
        refresh['role']           = user.role
        refresh['full_name']      = user.get_full_name()
        refresh['email']          = user.email
        refresh['account_status'] = user.account_status
        refresh['student_number'] = user.student_number or ''
 
        attrs['user']          = user
        attrs['refresh_token'] = str(refresh)
        attrs['access_token']  = str(refresh.access_token)
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
 
    full_name = serializers.SerializerMethodField()
 
    class Meta:
        model  = CustomUser
        fields = [
            'id', 'email', 'full_name', 'first_name', 'last_name',
            'phone_number', 'role', 'gender', 'district',
            'account_status', 'date_joined',
            'student_number', 'programme', 'year_of_study',
            'university', 'faculty', 'department',
            'job_title', 'organisation_name',
        ]
        read_only_fields = fields
 
    def get_full_name(self, obj):
        return obj.get_full_name()

                  
