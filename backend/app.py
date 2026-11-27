import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager


from models import db
from api.auth import bp as auth_bp
from api.health import bp as health_bp
from api.classes import bp as classes_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///codequest.db"
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret")
    db.init_app(app)
    JWTManager(app)
    CORS(app)
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(classes_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    create_app().run(debug=True)