from .models import Document


class DocumentQuerySet:

    @staticmethod
    def for_property(
        *,
        property,
    ):

        return Document.objects.filter(
            property=property,
        ).select_related(
            "uploaded_by",
            "property",
        )