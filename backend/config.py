"""Centralized environment configuration. All deploy-sensitive values live here,
read from the environment so nothing is hardcoded in source. See .env.example."""
import os
import secrets

from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "development")

# Falls back to a random key per-process in dev so local runs still work
# without a .env file, but a real deployment MUST set JWT_SECRET_KEY itself —
# otherwise every server restart invalidates all existing sessions.
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or secrets.token_hex(32)
if ENV == "production" and not os.getenv("JWT_SECRET_KEY"):
    raise RuntimeError(
        "JWT_SECRET_KEY must be set in production (no stable fallback allowed)."
    )

# SQLite by default for local dev; set DATABASE_URL to a postgres:// URL in production.
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./bharatvoice.db"
# Render/Heroku-style providers sometimes hand out "postgres://" which SQLAlchemy 2.x rejects.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Comma-separated list of allowed frontend origins, e.g. "https://app.netlify.app,http://localhost:5173"
_origins = os.getenv("CORS_ORIGINS") or "*"
CORS_ORIGINS = ["*"] if _origins.strip() == "*" else [o.strip() for o in _origins.split(",") if o.strip()] or ["*"]

UPLOAD_DIR = os.getenv("UPLOAD_DIR") or os.path.join(os.path.dirname(__file__), "uploads")
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES") or 5 * 1024 * 1024)  # 5 MB default
