import tempfile
from pathlib import Path

from .base import *


DEBUG = False

SECRET_KEY = "test-secret-key-for-oweru-backend-suite"

ALLOWED_HOSTS = ["testserver", "localhost", "127.0.0.1"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

MEDIA_ROOT = Path(tempfile.gettempdir()) / "oweru-test-media"

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
