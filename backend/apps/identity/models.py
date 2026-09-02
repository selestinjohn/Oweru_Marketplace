from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):

    def create_user(self, email=None, phone_number=None, password=None, **extra_fields):
        if not email and not phone_number:
            raise ValueError(
                "A user must have either an email or phone number."
            )

        if email:
            email = self.normalize_email(email)

        user = self.model(
            email=email,
            phone_number=phone_number,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            email=email,
            password=password,
            **extra_fields,
        )



class AccountStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    SUSPENDED = "SUSPENDED", "Suspended"
    DEACTIVATED = "DEACTIVATED", "Deactivated"


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
        unique=True,
        null=True,
        blank=True,
    )

    phone_number = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True,
    )

    status = models.CharField(
    max_length=20,
    choices=AccountStatus.choices,
    default=AccountStatus.ACTIVE,
)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email or self.phone_number or str(self.pk)