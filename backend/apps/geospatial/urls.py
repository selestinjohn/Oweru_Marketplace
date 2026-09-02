from rest_framework.routers import DefaultRouter

from .views import (
    PropertyBoundaryViewSet,
    PropertyLocationRecordViewSet,
    SiteRiskViewSet,
)


router = DefaultRouter()
router.register(
    "property-locations",
    PropertyLocationRecordViewSet,
    basename="property-location",
)
router.register(
    "property-boundaries",
    PropertyBoundaryViewSet,
    basename="property-boundary",
)
router.register(
    "site-risks",
    SiteRiskViewSet,
    basename="site-risk",
)

urlpatterns = router.urls
