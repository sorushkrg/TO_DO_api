import re

from marshmallow import validates, ValidationError, fields, Schema, validates_schema, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy import select
from werkzeug.security import check_password_hash

from ..db import SessionLocal
from ..models import Users


class RegisterSchema(SQLAlchemyAutoSchema):
    email = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Email cannot be empty.")
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Password cannot be empty.")
    )
    name = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Name cannot be empty.")
    )

    class Meta:
        model = Users
        load_instance = True
        include_relationships = True

    @validates("email")
    def validate_email(self, value):
        value = value.strip() if value else ""
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, value):
            raise ValidationError("Not a valid email address.")

        stmt = select(Users).filter_by(email=value)

        with SessionLocal() as session:
            existing_user = session.scalars(stmt).first()

        if existing_user:
            raise ValidationError("This email is already registered.")

        return value




class LoginSchema(Schema):
    email = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Email cannot be empty.")
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Password cannot be empty.")
    )

    @validates("email")
    def validate_email(self, value):
        value = value.strip() if value else ""
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, value):
            raise ValidationError("Not a valid email address.")

    @validates_schema
    def validate_user(self, data, **kwargs):
        stmt = select(Users).where(Users.email == data["email"])
        with SessionLocal() as session:
            user = session.scalars(stmt).first()
            if not user:
                raise ValidationError("No user found with this email.", field_name="email")

            if not check_password_hash(user.password, data["password"]):
                raise ValidationError("Incorrect password.", field_name="password")
