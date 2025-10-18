from marshmallow import fields, validate, pre_load
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from ..db import SessionLocal
from ..models.Tasks import Tasks


class TaskSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tasks
        load_instance = True

    title = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Task title cannot be empty.")
    )
    description = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Description cannot be empty.")
    )

    due_date = fields.DateTime(
        required=False , allow_none=True)


    @pre_load
    def handle_empty_due_date(self, data, **kwargs):
        if data.get("due_date") == "":
            data["due_date"] = None
        return data

task_schema = TaskSchema(session=SessionLocal())
tasks_schema = TaskSchema(many=True, session=SessionLocal())
