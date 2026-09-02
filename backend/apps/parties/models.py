from django.conf import settings
from django.db import models


class PartyType(models.TextChoices):
    PERSON = "PERSON", "Person"
    ORGANIZATION = "ORGANIZATION", "Organization"


class IdentityStatus(models.TextChoices):
    NOT_VERIFIED = "NOT_VERIFIED", "Not verified"
    PENDING = "PENDING", "Pending"
    VERIFIED = "VERIFIED", "Verified"
    EXPIRED = "EXPIRED", "Expired"
    REJECTED = "REJECTED", "Rejected"


class Party(models.Model):
    party_type = models.CharField(
        max_length=20,
        choices=PartyType.choices,
    )

    display_name = models.CharField(
        max_length=255,
    )

    identity_status = models.CharField(
        max_length=20,
        choices=IdentityStatus.choices,
        default=IdentityStatus.NOT_VERIFIED,
    )

    identity_verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    tax_status = models.CharField(
        max_length=100,
        blank=True,
    )

    tax_verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="party",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.display_name







class Role(models.Model):

    code = models.CharField(
        max_length=50,
        unique=True,
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.name



class PartyRole(models.Model):

    party = models.ForeignKey(
        Party,
        on_delete=models.CASCADE,
        related_name="roles",
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="party_roles",
    )

    is_active = models.BooleanField(
        default=True,
    )

    assigned_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["party", "role"],
                name="unique_party_role",
            )
        ]

    def __str__(self):
        return f"{self.party} - {self.role}"


class Permission(models.Model):

    code = models.CharField(
        max_length=100,
        unique=True,
    )

    name = models.CharField(
        max_length=150,
    )

    description = models.TextField(
        blank=True,
    )

    def __str__(self):
        return self.code


class RolePermission(models.Model):

    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="permissions",
    )

    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        related_name="roles",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["role", "permission"],
                name="unique_role_permission",
            )
        ]
