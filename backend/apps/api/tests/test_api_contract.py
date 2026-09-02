import pytest
from django.test import override_settings


@pytest.mark.django_db
def test_unauthenticated_api_error_uses_contract(api_client):
    response = api_client.get(
        "/api/v1/auth/me/",
    )

    assert response.status_code == 401
    assert response.data["detail"]
    assert response.data["error"]["code"] == "not_authenticated"
    assert response.data["error"]["message"]
    assert response.data["error"]["details"]["detail"]


@pytest.mark.django_db
def test_validation_api_error_preserves_field_errors(api_client):
    response = api_client.post(
        "/api/v1/auth/register/",
        {
            "password": "StrongPassword123!",
            "display_name": "Missing Contact",
        },
        format="json",
    )

    assert response.status_code == 400
    assert "non_field_errors" in response.data
    assert response.data["error"]["code"] == "validation_error"
    assert (
        "non_field_errors"
        in response.data["error"]["details"]
    )


@pytest.mark.django_db
def test_api_schema_documents_error_contract(api_client):
    response = api_client.get(
        "/api/v1/schema/",
    )

    assert response.status_code == 200
    assert (
        "ErrorResponse"
        in response.data["components"]["schemas"]
    )
    assert "/api/v1/auth/login/" in response.data["paths"]


@override_settings(
    CORS_ALLOWED_ORIGINS=[
        "http://localhost:5173",
    ]
)
def test_cors_preflight_allows_frontend_origin(api_client):
    response = api_client.options(
        "/api/v1/",
        HTTP_ORIGIN="http://localhost:5173",
        HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
    )

    assert response.status_code == 204
    assert (
        response["Access-Control-Allow-Origin"]
        == "http://localhost:5173"
    )
    assert "Authorization" in response[
        "Access-Control-Allow-Headers"
    ]
