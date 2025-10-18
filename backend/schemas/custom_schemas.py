from marshmallow import fields, ValidationError
import os

class FileField(fields.Field):
    def __init__(self, allowed_extensions=None, max_size_mb=None, *args, **kwargs):
        # normalize allowed_extensions: ensure list of strings like ".jpg"
        exts = allowed_extensions or []
        self.allowed_extensions = [f".{e.lower().lstrip('.')}" for e in exts]
        self.max_size_mb = max_size_mb

        # call parent constructor (keeps marshmallow compatibility)
        super().__init__(*args, **kwargs)

    def _deserialize(self, value, attr, data, **kwargs):
        file = value
        if not file:
            raise ValidationError("No file provided.")

        filename = getattr(file, "filename", None)
        if not filename:
            raise ValidationError("Invalid file.")

        # extension check
        ext = os.path.splitext(filename)[1].lower()
        if self.allowed_extensions and ext not in self.allowed_extensions:
            raise ValidationError(f"File type not allowed ({ext}). Allowed: {', '.join(self.allowed_extensions)}")

        # size check
        file.seek(0, os.SEEK_END)
        size_mb = file.tell() / (1024 * 1024)
        file.seek(0)
        if self.max_size_mb and size_mb > self.max_size_mb:
            raise ValidationError(f"File size must be <= {self.max_size_mb} MB.")

        return file
