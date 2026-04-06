from rest_framework              import status
from rest_framework.views        import APIView
from rest_framework.response     import Response
from rest_framework.permissions  import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens     import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from backend.accounts.serializers import UserRegistrationSerializer, LoginSerializer


class RegisterView(APIView):
    """
    POST /api/auth/register/
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
    POST /api/auth/login/
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

