from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


API_ENDPOINTS = [
    {
        "name": "Register",
        "path": "/api/v1/auth/register/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Login",
        "path": "/api/v1/auth/login/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Token Refresh",
        "path": "/api/v1/auth/refresh/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Logout",
        "path": "/api/v1/auth/logout/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Authenticated User Context",
        "path": "/api/v1/auth/me/",
        "methods": ["GET"],
        "filters": [],
    },
    {
        "name": "Properties",
        "path": "/api/v1/properties/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Listings",
        "path": "/api/v1/listings/",
        "methods": ["GET", "POST"],
        "filters": [
            "property_type",
            "location",
            "project",
            "min_price",
            "max_price",
            "promoted",
            "has_coordinates",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Listing Detail",
        "path": "/api/v1/listings/{id}/",
        "methods": ["GET"],
        "filters": [],
    },
    {
        "name": "My Listings",
        "path": "/api/v1/listings/mine/",
        "methods": ["GET"],
        "filters": [
            "page",
            "page_size",
        ],
    },
    {
        "name": "Publish Listing",
        "path": "/api/v1/listings/{id}/publish/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Pause Listing",
        "path": "/api/v1/listings/{id}/pause/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Resume Listing",
        "path": "/api/v1/listings/{id}/resume/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Close Listing",
        "path": "/api/v1/listings/{id}/close/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Offers",
        "path": "/api/v1/offers/",
        "methods": ["GET", "POST"],
        "filters": [
            "page",
            "page_size",
        ],
    },
    {
        "name": "Accept Offer",
        "path": "/api/v1/offers/{id}/accept/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Reject Offer",
        "path": "/api/v1/offers/{id}/reject/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Counter Offer",
        "path": "/api/v1/offers/{id}/counter/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Withdraw Offer",
        "path": "/api/v1/offers/{id}/withdraw/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Transactions",
        "path": "/api/v1/transactions/",
        "methods": ["GET"],
        "filters": [
            "status",
            "buyer_party",
            "seller_party",
            "property",
            "listing",
            "currency",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Transaction Timeline",
        "path": "/api/v1/transactions/{id}/timeline/",
        "methods": ["GET"],
        "filters": [],
    },
    {
        "name": "Transaction Transition",
        "path": "/api/v1/transactions/{id}/transition/",
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Transaction Checklist Transition",
        "path": (
            "/api/v1/transactions/{id}/checklist-items/"
            "{item_id}/transition/"
        ),
        "methods": ["POST"],
        "filters": [],
    },
    {
        "name": "Transaction Operations Dashboard",
        "path": "/api/v1/transaction-operations/dashboard/",
        "methods": ["GET"],
        "filters": [],
    },
    {
        "name": "Payments",
        "path": "/api/v1/payments/",
        "methods": ["GET", "POST"],
        "filters": [
            "transaction",
            "payer_party",
            "payee_party",
            "purpose",
            "method",
            "status",
            "currency",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Disputes",
        "path": "/api/v1/disputes/",
        "methods": ["GET", "POST"],
        "filters": [
            "transaction",
            "payment",
            "listing",
            "property",
            "opened_by_party",
            "assigned_to",
            "category",
            "priority",
            "status",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Notifications",
        "path": "/api/v1/notifications/",
        "methods": ["GET"],
        "filters": [
            "notification_type",
            "resource_type",
            "resource_id",
            "unread",
            "include_archived",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Property Locations",
        "path": "/api/v1/property-locations/",
        "methods": ["GET", "POST"],
        "filters": [
            "property",
            "source_type",
            "captured_by",
            "is_primary",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Property Boundaries",
        "path": "/api/v1/property-boundaries/",
        "methods": ["GET", "POST"],
        "filters": [
            "property",
            "boundary_type",
            "source_type",
            "captured_by",
            "is_current",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Site Risks",
        "path": "/api/v1/site-risks/",
        "methods": ["GET", "POST"],
        "filters": [
            "property",
            "risk_type",
            "severity",
            "source_type",
            "recorded_by",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
    {
        "name": "Due Diligence Requests",
        "path": "/api/v1/due-diligence-requests/",
        "methods": ["GET", "POST"],
        "filters": [
            "property",
            "transaction",
            "requested_by_party",
            "assigned_reviewer",
            "status",
            "search",
            "ordering",
            "page",
            "page_size",
        ],
    },
]


class APIIndexView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def get(self, request):
        return Response(
            {
                "name": "OWERU Marketplace API",
                "version": "v1",
                "schema": "/api/v1/schema/",
                "authentication": {
                    "type": "Bearer JWT",
                    "header": "Authorization: Bearer <access-token>",
                    "refresh_path": "/api/v1/auth/refresh/",
                },
                "error_format": {
                    "detail": "Human-readable summary when available.",
                    "error": {
                        "code": "Stable frontend error code.",
                        "message": "Display-safe error message.",
                        "details": "Field errors or underlying detail payload.",
                    },
                },
                "endpoints": API_ENDPOINTS,
            }
        )


class APISchemaView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def get(self, request):
        return Response(
            {
                "openapi": "3.0.0",
                "info": {
                    "title": "OWERU Marketplace API",
                    "version": "v1",
                },
                "components": self._components(),
                "paths": self._paths(),
            }
        )

    def _paths(self):
        paths = {}

        for endpoint in API_ENDPOINTS:
            paths[endpoint["path"]] = {
                method.lower(): {
                    "summary": endpoint["name"],
                    "parameters": [
                        {
                            "name": filter_name,
                            "in": "query",
                            "required": False,
                            "schema": {
                                "type": "string",
                            },
                        }
                        for filter_name in endpoint["filters"]
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response.",
                        },
                        "201": {
                            "description": "Created.",
                        },
                        "400": {
                            "description": "Validation error.",
                        },
                        "403": {
                            "description": "Permission denied.",
                        },
                        "404": {
                            "description": "Not found.",
                        },
                    },
                }
                for method in endpoint["methods"]
            }

        return paths

    def _components(self):
        return {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                },
            },
            "schemas": {
                "ErrorResponse": {
                    "type": "object",
                    "properties": {
                        "detail": {
                            "type": "string",
                        },
                        "error": {
                            "type": "object",
                            "properties": {
                                "code": {
                                    "type": "string",
                                },
                                "message": {
                                    "type": "string",
                                },
                                "details": {
                                    "type": "object",
                                },
                            },
                        },
                    },
                    "required": [
                        "error",
                    ],
                },
            },
        }
