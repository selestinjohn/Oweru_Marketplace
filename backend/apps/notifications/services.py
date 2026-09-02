from django.db import transaction
from django.utils import timezone

from apps.audit.models import AuditCategory
from apps.audit.services import AuditService
from apps.authorization.exceptions import AuthorizationDenied

from .models import Notification, NotificationType
from .policies import NotificationPolicy


class NotificationService:

    @staticmethod
    @transaction.atomic
    def notify_party(
        *,
        party,
        title,
        message,
        notification_type=NotificationType.SYSTEM,
        resource=None,
        payload=None,
        actor=None,
    ):
        if not party.user_id:
            return None

        return NotificationService.notify_user(
            user=party.user,
            recipient_party=party,
            title=title,
            message=message,
            notification_type=notification_type,
            resource=resource,
            payload=payload,
            actor=actor,
        )

    @staticmethod
    @transaction.atomic
    def notify_user(
        *,
        user,
        title,
        message,
        notification_type=NotificationType.SYSTEM,
        resource=None,
        payload=None,
        recipient_party=None,
        actor=None,
    ):
        if recipient_party is None:
            recipient_party = getattr(
                user,
                "party",
                None,
            )

        notification = Notification.objects.create(
            recipient_user=user,
            recipient_party=recipient_party,
            notification_type=notification_type,
            title=title,
            message=message,
            resource_type=NotificationService._resource_type(resource),
            resource_id=NotificationService._resource_id(resource),
            payload=payload or {},
        )

        AuditService.record(
            actor=actor,
            category=AuditCategory.NOTIFICATION,
            action="notification.created",
            resource=notification,
            summary="Notification created.",
            after={
                "recipient_user_id": str(user.id),
                "recipient_party_id": (
                    str(recipient_party.id)
                    if recipient_party
                    else ""
                ),
                "notification_type": notification.notification_type,
                "resource_type": notification.resource_type,
                "resource_id": notification.resource_id,
            },
        )

        return notification

    @staticmethod
    @transaction.atomic
    def mark_read(
        *,
        party,
        notification,
    ):
        if not NotificationPolicy.can_manage(
            party=party,
            notification=notification,
        ):
            raise AuthorizationDenied()

        if notification.read_at is None:
            notification.read_at = timezone.now()
            notification.save(
                update_fields=[
                    "read_at",
                    "updated_at",
                ]
            )

        return notification

    @staticmethod
    @transaction.atomic
    def mark_all_read(
        *,
        party,
    ):
        if not party:
            raise AuthorizationDenied()

        now = timezone.now()

        return Notification.objects.filter(
            recipient_user=party.user,
            read_at__isnull=True,
            archived_at__isnull=True,
        ).update(
            read_at=now,
            updated_at=now,
        )

    @staticmethod
    @transaction.atomic
    def archive(
        *,
        party,
        notification,
    ):
        if not NotificationPolicy.can_manage(
            party=party,
            notification=notification,
        ):
            raise AuthorizationDenied()

        if notification.archived_at is None:
            notification.archived_at = timezone.now()
            notification.save(
                update_fields=[
                    "archived_at",
                    "updated_at",
                ]
            )

        return notification

    @staticmethod
    def _resource_type(resource):
        if resource is None:
            return ""

        return resource._meta.label

    @staticmethod
    def _resource_id(resource):
        if resource is None:
            return ""

        return str(resource.pk)
