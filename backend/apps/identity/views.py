from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.responses import api_error_response

from .models import AccountStatus
from .serializers import (
    RegisterSerializer,
)
from .services import AuthContextService


class RegisterView(APIView):

    permission_classes = [
        AllowAny,
    ]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user, _party = serializer.save()

        return Response(
            AuthContextService.auth_response_payload(
                user,
            ),
            status=status.HTTP_201_CREATED,
        )



class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return api_error_response(
                detail="Email and password are required.",
                code="missing_credentials",
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request,
            email=email,
            password=password,
        )

        if user is None:
            return api_error_response(
                detail="Invalid email or password.",
                code="invalid_credentials",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if (
            not user.is_active
            or user.status != AccountStatus.ACTIVE
        ):
            return api_error_response(
                detail="This account is inactive.",
                code="account_inactive",
                status=status.HTTP_403_FORBIDDEN,
            )

        update_last_login(
            None,
            user,
        )

        return Response(
            AuthContextService.auth_response_payload(
                user,
            ),
            status=status.HTTP_200_OK,
        )

class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        refresh_token = request.data.get("refresh")

        if not refresh_token:

            return api_error_response(
                detail="Refresh token is required.",
                code="missing_refresh_token",
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(

                {

                    "detail": "Successfully logged out."

                },

                status=status.HTTP_205_RESET_CONTENT,

            )

        except Exception:

            return api_error_response(
                detail="Invalid or expired refresh token.",
                code="invalid_refresh_token",
                status=status.HTTP_400_BAD_REQUEST,
            )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            AuthContextService.context_for_user(
                request.user,
            )
        )
