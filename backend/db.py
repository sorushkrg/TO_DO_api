from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import instance.config as local_config
class Base(DeclarativeBase):
    pass


DATABASE_URL = getattr(local_config, "DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
