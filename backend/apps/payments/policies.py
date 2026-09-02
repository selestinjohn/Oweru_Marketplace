from apps.authorization.services import AuthorizationService
from apps.parties.constants import PermissionCode


class PaymentPolicy:

    @staticmethod
    def can_create(
        *,
        party,
        transaction,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        if not AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.TRANSACTION_VIEW,
        ):
            return False

        return party.id in {
            transaction.buyer_party_id,
            transaction.seller_party_id,
        }

    @staticmethod
    def can_view(
        *,
        party,
        payment,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        return party.id in {
            payment.transaction.buyer_party_id,
            payment.transaction.seller_party_id,
            payment.payer_party_id,
            payment.payee_party_id,
        }

    @staticmethod
    def can_manage(
        *,
        party,
        payment,
    ):
        if AuthorizationService.is_admin(
            party=party,
        ):
            return True

        return AuthorizationService.has_permission(
            party=party,
            permission_code=PermissionCode.TRANSACTION_MANAGE,
        )
