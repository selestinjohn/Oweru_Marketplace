from django.contrib.auth.models import AnonymousUser

from .models import AuditEvent


class AuditService:

    @staticmethod
    def record(
        *,
        action,
        category,
        actor=None,
        resource=None,
        resource_type="",
        resource_id="",
        summary="",
        before=None,
        after=None,
        metadata=None,
        request=None,
    ):
        if request is not None:
            actor = actor or getattr(
                request,
                "user",
                None,
            )

        if isinstance(actor, AnonymousUser):
            actor = None

        if resource is not None:
            resource_type = resource_type or resource._meta.label
            resource_id = resource_id or str(resource.pk)

        ip_address = ""
        user_agent = ""

        if request is not None:
            ip_address = AuditService._get_client_ip(
                request
            )
            user_agent = request.META.get(
                "HTTP_USER_AGENT",
                "",
            )

        return AuditEvent.objects.create(
            actor=actor,
            category=category,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else "",
            summary=summary,
            before=before or {},
            after=after or {},
            metadata=metadata or {},
            ip_address=ip_address or None,
            user_agent=user_agent,
        )

    @staticmethod
    def _get_client_ip(request):
        forwarded_for = request.META.get(
            "HTTP_X_FORWARDED_FOR",
            "",
        )

        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        return request.META.get(
            "REMOTE_ADDR",
            "",
        )
