from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

from backend.db import SessionLocal
from backend.models import Users

public_bp = Blueprint("public", __name__)


@public_bp.route("/check", methods=["GET"])
@jwt_required()
def check_auth_task():
    current_user = get_jwt_identity()
    with SessionLocal() as session:
        stmt = select(Users.name).where(Users.id == current_user)
        result = session.execute(stmt).scalars().one_or_none()
    return jsonify({"msg": f"Welcome {result}!"})