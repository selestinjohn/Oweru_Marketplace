from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    TransactionOperationsDashboardView,
    TransactionViewSet,
)


router = DefaultRouter()

router.register(
    "transactions",
    TransactionViewSet,
    basename="transaction",
)

urlpatterns = [
    path(
        "transaction-operations/dashboard/",
        TransactionOperationsDashboardView.as_view(),
        name="transaction-operations-dashboard",
    ),
    *router.urls,
]
