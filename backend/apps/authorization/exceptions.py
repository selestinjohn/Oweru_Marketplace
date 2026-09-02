from rest_framework.exceptions import PermissionDenied


class AuthorizationDenied(PermissionDenied):
    default_detail = (
        "You are not authorized to perform this action."
    )
