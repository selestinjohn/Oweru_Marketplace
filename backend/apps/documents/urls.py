from rest_framework.routers import DefaultRouter

from .views import (
    DocumentViewSet,
    EvidenceViewSet,
)

router = DefaultRouter()

router.register(
    "documents",
    DocumentViewSet,
    basename="document",
)

router.register(
    "evidence",
    EvidenceViewSet,
    basename="evidence",
)

urlpatterns = router.urls