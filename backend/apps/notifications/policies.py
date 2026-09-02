from apps.authorization.services import AuthorizationService


class NotificationPolicy:

    @staticmethod
    def can_view(
        *,
        party,
        notification,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not party:
            return False

        return (
            notification.recipient_user_id == party.user_id
            or notification.recipient_party_id == party.id
        )

    @staticmethod
    def can_manage(
        *,
        party,
        notification,
    ):
        return NotificationPolicy.can_view(
            party=party,
            notification=notification,
        )
