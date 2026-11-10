from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, SchoolClass

bp = Blueprint("auth", __name__)

@bp.get("/auth/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()          # строка, например "3"
    # TODO 1: достать User по id

    user = db.session.get(User, int(user_id))
    
    
    #   подсказка: db.session.get(User, int(user_id))
    # TODO 2: если user нет (например, удалён после выдачи токена) -> 404

    if not user :
        return jsonify ({"error": "Benutzer nicht gefunden"}), 404

    # TODO 3: вернуть JSON: id, username, role, class_id, city_name, coin_balance
    return jsonify({"id": user.id, "username": user.username, "role": user.role, "class_id": user.class_id, "city_name": user.city_name, "coin_balance": user.coin_balance})

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

@bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}

    # 1. достань name и password
    name = data.get("name")
    password = data.get("password")

    if not name or not password:
        return jsonify({"error": "name und password erforderlich"}), 400

    # 2. найди User по username
    user = User.query.filter_by(username=name).first()

    # 3. если user нет ИЛИ check_password_hash(user.password_hash, password) == False

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Benutzername oder Passwort falsch"}), 401

    # 4. token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})

    # 5. return {"access_token": token, "role": user.role}, 200
    return {"access_token": token, "role": user.role}, 200