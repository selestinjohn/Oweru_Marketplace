from collections.abc import Mapping, Sequence

from rest_framework.exceptions import (
    AuthenticationFailed,
    MethodNotAllowed,
    NotAcceptable,
    NotAuthenticated,
    NotFound,
    ParseError,
    PermissionDenied,
    Throttled,
    UnsupportedMediaType,
    ValidationError,
)
from rest_framework.views import exception_handler


ERROR_CODES = {
    ValidationError: "validation_error",
    NotAuthenticated: "not_authenticated",
    AuthenticationFailed: "authentication_failed",
    PermissionDenied: "permission_denied",
    NotFound: "not_found",
    MethodNotAllowed: "method_not_allowed",
    ParseError: "parse_error",
    NotAcceptable: "not_acceptable",
    Throttled: "throttled",
    UnsupportedMediaType: "unsupported_media_type",
}


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    response.data = with_error_envelope(
        data=response.data,
        code=error_code_for_exception(exc),
    )

    return response


def with_error_envelope(
    *,
    data,
    code,
):
    details = normalize_error_detail(data)

    if isinstance(data, Mapping):
        response_data = dict(data)
    else:
        response_data = {
            "detail": data,
        }

    response_data["error"] = {
        "code": code,
        "message": error_message_from_detail(details),
        "details": details,
    }

    return response_data


def error_code_for_exception(exc):
    for exception_class, code in ERROR_CODES.items():
        if isinstance(exc, exception_class):
            return code

    return getattr(
        exc,
        "default_code",
        "api_error",
    )


def normalize_error_detail(value):
    if isinstance(value, Mapping):
        return {
            key: normalize_error_detail(item)
            for key, item in value.items()
        }

    if isinstance(value, str):
        return value

    if isinstance(value, Sequence):
        return [
            normalize_error_detail(item)
            for item in value
        ]

    return str(value)


def error_message_from_detail(details):
    if isinstance(details, Mapping):
        detail = details.get("detail")
        if detail:
            return error_message_from_detail(detail)

        first_value = next(
            iter(details.values()),
            "",
        )
        return error_message_from_detail(first_value)

    if isinstance(details, list):
        first_value = next(
            iter(details),
            "",
        )
        return error_message_from_detail(first_value)

    return str(details)
