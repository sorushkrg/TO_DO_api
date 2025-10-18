from flask_jwt_extended import create_access_token
from sqlalchemy import select
from werkzeug.security import generate_password_hash

from ..models import Users
from ..db import SessionLocal
from flask import request, jsonify, Blueprint
from marshmallow import ValidationError

from ..schemas.user_schema import RegisterSchema, LoginSchema

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    session = SessionLocal()

    register_schema = RegisterSchema(session=session)

    try:
        validated_data = register_schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    name = validated_data.name
    email = validated_data.email
    password = validated_data.password

    with SessionLocal() as session:

        user = Users(
            name=name,
            email=email,
            password=generate_password_hash(password)
        )
        session.add(user)
        session.commit()

        access_token = create_access_token(identity=user.id)

    return jsonify({
        "msg": "کاربر با موفقیت ثبت شد",
        "access_token": access_token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    login_schema = LoginSchema()

    try:
        login_schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    stmt = select(Users).where(Users.email == data["email"])
    with SessionLocal() as session:
        user = session.scalars(stmt).first()
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "msg": "ورود با موفقیت انجام شد.",
            "access_token": access_token
        }), 200