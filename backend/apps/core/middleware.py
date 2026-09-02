from django.conf import settings
from django.http import HttpResponse
from django.utils.cache import patch_vary_headers


class FrontendCORSMiddleware:
    def __init__(
        self,
        get_response,
    ):
        self.get_response = get_response

    def __call__(
        self,
        request,
    ):
        is_preflight = (
            request.method == "OPTIONS"
            and request.headers.get(
                "Access-Control-Request-Method"
            )
        )

        if is_preflight:
            response = HttpResponse(
                status=204,
            )
        else:
            response = self.get_response(
                request,
            )

        origin = request.headers.get(
            "Origin",
        )

        if self._is_allowed_origin(
            origin,
        ):
            response[
                "Access-Control-Allow-Origin"
            ] = origin
            response[
                "Access-Control-Allow-Methods"
            ] = ", ".join(
                settings.CORS_ALLOWED_METHODS,
            )
            response[
                "Access-Control-Allow-Headers"
            ] = ", ".join(
                settings.CORS_ALLOWED_HEADERS,
            )
            response[
                "Access-Control-Max-Age"
            ] = str(
                settings.CORS_PREFLIGHT_MAX_AGE,
            )
            patch_vary_headers(
                response,
                [
                    "Origin",
                ],
            )

        return response

    def _is_allowed_origin(
        self,
        origin,
    ):
        if not origin:
            return False

        return origin in settings.CORS_ALLOWED_ORIGINS
