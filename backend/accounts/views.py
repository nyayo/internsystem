from rest_framework              import status
from rest_framework.views        import APIView
from rest_framework.response     import Response
from rest_framework.permissions  import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens     import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from accounts.models import CustomUser
from accounts.permissions import IsActiveAccount, IsStudent, IsWorkplaceSupervisor, IsAcademicSupervisor, IsInternshipAdministrator
from accounts.serializers import UserRegistrationSerializer, LoginSerializer, UserProfileSerializer
from accounts.tokens import (
    generate_email_verification_token,
    verify_email_token,
    generate_password_reset_token,
    verify_password_reset_token,
)
from accounts.emails import send_verification_email, send_password_reset_email


class RegisterView(APIView):
    """
    POST /accounts/auth/register/
    Account starts with status = 'registered' and must verify email before login is permitted.
    """
    permission_classes = [AllowAny]
 
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        
        # Generate token and send verification email
        token = generate_email_verification_token(user)
        send_verification_email(user, token)
        
        return Response({
            'detail': 'Account created. Please check your email to verify your account.',
            'email':  user.email,
            'role':   user.role,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /accounts/auth/login/
    """
    permission_classes = [AllowAny]
 
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
 
        user          = serializer.validated_data['user']
        access_token  = serializer.validated_data['access_token']
        refresh_token = serializer.validated_data['refresh_token']
 
        return Response({
            'access':  access_token,
            'refresh': refresh_token,
            'user': {
                'id':             user.id,
                'email':          user.email,
                'full_name':      user.get_full_name(),
                'role':           user.role,
                'account_status': user.account_status,
                'student_number': user.student_number or '',
            },
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    POST /accounts/auth/logout/
    """
    permission_classes = [IsAuthenticated]
 
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'refresh': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'refresh': 'Token is invalid or already blacklisted.'},
                status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Successfully logged out.'},
                        status=status.HTTP_205_RESET_CONTENT)
        
class MeView(APIView):
    """
    GET /accounts/auth/me/
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]
 
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListView(APIView):
    """
    GET /api/auth/users/?role=student
    Administrator only. Filter by role using query parameter.
    """
    permission_classes = [IsAuthenticated, IsActiveAccount,
                          IsInternshipAdministrator]
 
    def get(self, request):
        role     = request.query_params.get('role')
        queryset = CustomUser.objects.all().order_by('last_name', 'first_name')
        if role:
            queryset = queryset.filter(role=role)
        serializer = UserProfileSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    POST /accounts/auth/change-password/
    """
    permission_classes = [IsAuthenticated, IsActiveAccount]
 
    def post(self, request):
        user             = request.user
        current_password = request.data.get('current_password')
        new_password     = request.data.get('new_password')
        new_password2    = request.data.get('new_password2')
 
        if not all([current_password, new_password, new_password2]):
            return Response(
                {'detail': 'All three password fields are required.'},
                status=status.HTTP_400_BAD_REQUEST)
 
        if not user.check_password(current_password):
            return Response(
                {'current_password': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST)
 
        if new_password != new_password2:
            return Response(
                {'new_password': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST)
 
        if len(new_password) < 8:
            return Response(
                {'new_password': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST)
 
        user.set_password(new_password)
        user.save()
        return Response(
            {'detail': 'Password changed. Please log in again.'},
            status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    """
    POST /accounts/auth/verify-email/
    Verifies the user's email using the token sent during registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response(
                {'token': 'Verification token is required.'},
                status=status.HTTP_400_BAD_REQUEST)

        user_id = verify_email_token(token)
        if not user_id:
            return Response(
                {'token': 'Invalid or expired verification token.'},
                status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'token': 'User not found.'},
                status=status.HTTP_400_BAD_REQUEST)

        if user.account_status != 'registered':
            return Response(
                {'detail': 'Account is already verified.'},
                status=status.HTTP_400_BAD_REQUEST)

        user.account_status = 'active'
        user.save()
        return Response(
            {'detail': 'Email verified successfully. You can now log in.'},
            status=status.HTTP_200_OK)


class ResendVerificationView(APIView):
    """
    POST /accounts/auth/resend-verification/
    Resends the verification email to the user.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        if not email:
            return Response(
                {'email': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST)

        # Always return same message for security
        response_msg = {'detail': 'If an account exists and is not yet verified, a verification email has been sent.'}

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(response_msg, status=status.HTTP_200_OK)

        if user.account_status != 'registered':
            return Response(response_msg, status=status.HTTP_200_OK)

        token = generate_email_verification_token(user)
        send_verification_email(user, token)
        
        return Response(response_msg, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    """
    POST /accounts/auth/forgot-password/
    Sends a password reset email to the user.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        if not email:
            return Response(
                {'email': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST)

        response_msg = {'detail': 'If an account exists, a password reset email has been sent.'}

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(response_msg, status=status.HTTP_200_OK)

        if user.account_status in ('suspended', 'deactivated'):
            return Response(response_msg, status=status.HTTP_200_OK)

        token = generate_password_reset_token(user)
        send_password_reset_email(user, token)
        
        return Response(response_msg, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """
    POST /accounts/auth/reset-password/
    Resets the user's password using the token from forgot password email.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        new_password2 = request.data.get('new_password2')

        if not all([token, new_password, new_password2]):
            return Response(
                {'detail': 'Token and both password fields are required.'},
                status=status.HTTP_400_BAD_REQUEST)

        if new_password != new_password2:
            return Response(
                {'new_password': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response(
                {'new_password': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST)

        user_id = verify_password_reset_token(token)
        if not user_id:
            return Response(
                {'token': 'Invalid or expired reset token.'},
                status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'token': 'User not found.'},
                status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response(
            {'detail': 'Password reset successfully. You can now log in.'},
            status=status.HTTP_200_OK)
