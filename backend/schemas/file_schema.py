from marshmallow import Schema, fields

from backend.schemas.custom_schemas import FileField


class UploadSchema(Schema):
    title = fields.Str(required=True)
    file = FileField(allowed_extensions=["jpg","png","pdf"], max_size_mb=5)


