from django.urls import include, path

from .views import APIIndexView, APISchemaView


urlpatterns = [
    path(
        "",
        APIIndexView.as_view(),
        name="api-v1-index",
    ),
    path(
        "schema/",
        APISchemaView.as_view(),
        name="api-v1-schema",
    ),
    path(
        "",
        include("apps.parties.urls"),
    ),
    path(
        "",
        include("apps.properties.urls"),
    ),
    path(
        "",
        include("apps.listings.urls"),
    ),
    path(
        "",
        include("apps.offers.urls"),
    ),
    path(
        "",
        include("apps.transactions.urls"),
    ),
    path(
        "",
        include("apps.payments.urls"),
    ),
    path(
        "",
        include("apps.disputes.urls"),
    ),
    path(
        "",
        include("apps.notifications.urls"),
    ),
    path(
        "",
        include("apps.geospatial.urls"),
    ),
    path(
        "",
        include("apps.due_diligence.urls"),
    ),
    path(
    "",
    include("apps.documents.urls"),
    ),
    path(
        "",
        include("apps.audit.urls"),
    ),
    path(
    "",
    include("apps.verification.urls"),
),

]
