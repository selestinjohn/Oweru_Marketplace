import pytest


@pytest.mark.django_db
def test_api_index_exposes_operational_endpoints(api_client):
    response = api_client.get(
        "/api/v1/",
    )

    assert response.status_code == 200
    assert response.data["version"] == "v1"
    assert response.data["schema"] == "/api/v1/schema/"

    paths = {
        endpoint["path"]
        for endpoint in response.data["endpoints"]
    }

    assert "/api/v1/transactions/" in paths
    assert "/api/v1/listings/" in paths
    assert "/api/v1/listings/{id}/publish/" in paths
    assert "/api/v1/transactions/{id}/timeline/" in paths
    assert "/api/v1/transaction-operations/dashboard/" in paths


@pytest.mark.django_db
def test_api_schema_exposes_openapi_style_paths(api_client):
    response = api_client.get(
        "/api/v1/schema/",
    )

    assert response.status_code == 200
    assert response.data["openapi"] == "3.0.0"
    assert "/api/v1/listings/" in response.data["paths"]
    assert "/api/v1/payments/" in response.data["paths"]
    assert "/api/v1/due-diligence-requests/" in response.data["paths"]

    listing_get = response.data["paths"]["/api/v1/listings/"]["get"]
    listing_parameters = {
        parameter["name"]
        for parameter in listing_get["parameters"]
    }

    assert "property_type" in listing_parameters
    assert "min_price" in listing_parameters
    assert "page_size" in listing_parameters

    payment_get = response.data["paths"]["/api/v1/payments/"]["get"]
    parameter_names = {
        parameter["name"]
        for parameter in payment_get["parameters"]
    }

    assert "status" in parameter_names
    assert "page_size" in parameter_names
