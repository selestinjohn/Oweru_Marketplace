from rest_framework.routers import DefaultRouter

from .views import DueDiligenceRequestViewSet


router = DefaultRouter()
router.register(
    "due-diligence-requests",
    DueDiligenceRequestViewSet,
    basename="due-diligence-request",
)

urlpatterns = router.urls
