from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # Ensure postgresql:// scheme for SQLAlchemy 2.0+
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        echo=False
    )
    # Verify connectivity with graceful fallback
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"[{settings.APP_NAME}] Primary database unreachable: {e}. Transitioning to resilient local SQLite.")
    db_url = "sqlite:///./jarvis.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
