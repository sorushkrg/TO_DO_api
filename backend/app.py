from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .routes import task_bp, auth_bp , public_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://localhost:5500"]}})
    app.config['JSON_AS_ASCII'] = False
    app.config.from_object(Config)
    JWTManager(app)
    app.register_blueprint(task_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(public_bp)




    return app

