from datetime import datetime

from flask_jwt_extended import get_jwt_identity, jwt_required

from ..helpers.hashid import decode_id
from ..models import Tasks


@jwt_required()
def create_task(session, data):
    current_user = get_jwt_identity()

    new_task = Tasks(
        user_id=data.get("user_id", current_user),
        title=data.get("title"),
        description=data.get("description"),
        due_date=data.get("due_date", datetime.utcnow()),
        status=data.get("status", 0)
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task


@jwt_required()
def update_task(session, task_id, data):
    decoded_id = decode_id(task_id)

    task = session.query(Tasks).get(decoded_id)

    if not task:
        return None

    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    if "status" in data:
        task.status = data["status"]
    if "due_date" in data:
        task.due_date = data["due_date"]
    session.commit()
    session.refresh(task)

    return task


def delete_task(session, task_id):
    decoded_id = decode_id(task_id)
    task = session.get(Tasks, decoded_id)


    if not task:
        return None

    session.delete(task)
    session.commit()

    return task
