import secrets

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

from models import db, SchoolClass

bp = Blueprint("classes", __name__)

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def generate_class_code():
    while True:
        code = "".join(secrets.choice(ALPHABET) for _ in range(6))

        if  not SchoolClass.query.filter_by(class_code=code).first():
            return code
    
    # TODO A: в цикле while True:
    #   - сгенерировать код из 6 символов (см. выше)
    #   - если SchoolClass с таким class_code НЕТ -> return code


@bp.post("/classes")
@jwt_required()
def create_class():

# TODO 1: если роль не teacher -> 403
    if get_jwt()["role"] != "teacher":
        return jsonify({"error": "Nur für Lehrkräfte"}), 403

    # TODO 2: достать name из JSON (get_json(silent=True) or {}); пустой -> 400
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "name erforderlich"}), 400
    
    # TODO 3: создать SchoolClass(name=..., class_code=generate_class_code(),
    #                             teacher_id=int(get_jwt_identity()))
    school_class = SchoolClass(name=name, class_code=generate_class_code(), teacher_id=int(get_jwt_identity()))

    # TODO 4: add + commit
    db.session.add(school_class)
    db.session.commit()

    # TODO 5: вернуть id, name, class_code -> 201
    return jsonify({"id": school_class.id, "name": school_class.name, "class_code": school_class.class_code}), 201


@bp.get("/classes")
@jwt_required()
def list_classes():

    # TODO 6: если роль не teacher -> 403

    if not get_jwt()["role"] == "teacher":
        return jsonify({"error": "Nur für Lehrkräfte"}), 403

    # TODO 7: найти все классы, где teacher_id == id из токена

    classes = SchoolClass.query.filter_by(teacher_id=int(get_jwt_identity())).all()

    #   подсказка: SchoolClass.query.filter_by(...).all()  -> список
    # TODO 8: вернуть список словарей [{id, name, class_code}, ...] -> 200
    #   подсказка: list comprehension  [ {...} for c in classes ]
    return jsonify([{"id": c.id, "name": c.name, "class_code": c.class_code} for c in classes]), 200 