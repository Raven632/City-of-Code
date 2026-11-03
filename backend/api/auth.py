from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from models import db, User, SchoolClass

bp = Blueprint("auth", __name__)


@bp.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    password = data.get("password")
    role = data.get("role")

    # TODO 1: если name или password пустые -> 400

    if not name or not password:
        return jsonify({"error": "name und password erforderlich"}), 400
    
    # TODO 2: если role не "student" и не "teacher" -> 400

    if role not in ("student", "teacher"):
        return jsonify({"error": "role muss student oder teacher sein"}), 400

    # TODO 3: если User с таким username уже есть -> 409

    if User.query.filter_by(username=name).first():
        return jsonify({"error": "Benutzername bereits vergeben"}), 409

    

    user = User(username=name, password_hash=generate_password_hash(password), role=role)

    if role == "student":
        # TODO 4
        school_class = SchoolClass.query.filter_by(class_code=data.get("classCode")).first()
        if not school_class:
            return jsonify({"error": "Klassencode ungültig"}), 404
        # TODO 5
        user.class_id = school_class.id

    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "username": user.username, "role": user.role}), 201