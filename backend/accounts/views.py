from rest_framework              import status
from rest_framework.views        import APIView
from rest_framework.response     import Response
from rest_framework.permissions  import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens     import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from backend.accounts.serializers import UserRegistrationSerializer


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

