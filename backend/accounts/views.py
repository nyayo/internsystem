from rest_framework              import status
from rest_framework.views        import APIView
from rest_framework.response     import Response
from rest_framework.permissions  import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens     import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from backend.accounts.permissions import IsActiveAccount
from backend.accounts.permissions import UserProfileSerializer, IsActiveAccount
from backend.accounts.serializers import UserRegistrationSerializer, LoginSerializer


class RegisterView(APIView):
    """
    POST /accounts/auth/register/
    Account starts with status = 'registered'and must verify email before login is permitted.
    """
    permission_classes = [AllowAny]
 
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response({
            'detail': 'Account created. Please verify your email.',
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

