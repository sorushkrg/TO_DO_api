import datetime
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "mysecretkey")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "default-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=30)


DEBUG = True
