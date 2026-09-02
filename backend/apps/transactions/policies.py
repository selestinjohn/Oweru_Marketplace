from apps.authorization.services import AuthorizationService
from apps.parties.constants import PermissionCode


class TransactionPolicy:

    @staticmethod
    def can_view(
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
    def can_manage(
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
            permission_code=PermissionCode.TRANSACTION_MANAGE,
        ):
            return False

        return party.id in {
            transaction.buyer_party_id,
            transaction.seller_party_id,
        }
