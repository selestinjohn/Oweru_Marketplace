from rest_framework.response import Response

from .exceptions import with_error_envelope


def api_error_response(
    *,
    detail,
    status,
    code="api_error",
    details=None,
):
    payload = {
        "detail": detail,
    }

    if details is not None:
        payload["details"] = details

    return Response(
        with_error_envelope(
            data=payload,
            code=code,
        ),
        status=status,
    )
