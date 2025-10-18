
from flask import Blueprint, Response, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func
import json

from ..db import SessionLocal
from ..helpers.hashid import encode_id, decode_id
from ..models import Tasks
from ..schemas.task_schema import task_schema, tasks_schema

from ..services import create_task , update_task,delete_task

task_bp = Blueprint("task", __name__)

@task_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    current_user = get_jwt_identity()

    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 5))

    with SessionLocal() as session:
        stmt = select(Tasks).where(Tasks.user_id == current_user).order_by(Tasks.id.desc())
        total_tasks = session.scalar(select(func.count()).select_from(stmt.subquery()))

        tasks = session.execute(
            stmt.offset((page - 1) * per_page).limit(per_page)
        ).scalars().all()


    tasks_data = tasks_schema.dump(tasks)
    for task in tasks_data:
        task["id"] = encode_id(task["id"])

    return jsonify({
        "tasks": tasks_data,
        "page": page,
        "per_page": per_page,
        "total": total_tasks,
        "total_pages": (total_tasks + per_page - 1) // per_page
    })


@task_bp.route("/tasks/<string:task_id>", methods=["GET"])
@jwt_required()
def get_single_task(task_id):
    decoded_id = decode_id(task_id)

    with SessionLocal() as session:
        task = session.get(Tasks, decoded_id)
        if not task:
            return jsonify({"message": "Task not found"}), 404

        task_data = task_schema.dump(task)
        task_data["id"] = task_id

    return jsonify({"task": task_data})


@task_bp.route("/tasks", methods=["POST"])
def create_task_route():
    data = request.json
    errors = task_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    with SessionLocal() as session:
        new_task = create_task(session, data)

    return Response(
        json.dumps({
            "tasks": task_schema.dump(new_task)
        }, ensure_ascii=False),
        mimetype="application/json"
    ), 201

@task_bp.route("/tasks/<task_id>", methods=["PATCH","PUT"])
def patch_task_route(task_id):
    data = request.json

    errors = task_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    with SessionLocal() as session:
        task = update_task(session, task_id, data)

        if not task:
            return Response(
                json.dumps({"message": "Task not found"}, ensure_ascii=False),
                mimetype="application/json",
                status=404
            )

    return Response(
        json.dumps({"task": task_schema.dump(task)}, ensure_ascii=False),
        mimetype="application/json",
        status=200
    )




@task_bp.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task_route(task_id):
    print(task_id)
    with SessionLocal() as session:
        task = delete_task(session, task_id)

        if not task:
            return Response(
                json.dumps({"message": "Task not found"}, ensure_ascii=False),
                mimetype="application/json",
                status=404
            )

    return Response(
        json.dumps({"message": "Task deleted successfully"}, ensure_ascii=False),
        mimetype="application/json",
        status=200
    )
