from .models import Listing, ListingStatus


class ListingQuerySet:

    @staticmethod
    def public():

        return Listing.objects.filter(
            status=ListingStatus.PUBLISHED,
        ).select_related(
            "property",
            "property__project",
        ).prefetch_related(
            "parties__party",
            "property__verifications",
        )

    @staticmethod
    def for_party(
        *,
        party,
    ):

        return Listing.objects.filter(
            parties__party=party,
            parties__is_active=True,
            parties__ended_at__isnull=True,
        ).select_related(
            "property",
            "property__project",
        ).prefetch_related(
            "parties__party",
            "property__verifications",
        ).distinct()
