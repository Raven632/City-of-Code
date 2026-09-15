from app import app
from models import db, User, SchoolClass, BuildingType, Level

with app.app_context():
    # 1. Lehrer anlegen
    lehrer = User(
        name="herr_mueller",
        password_hash="fake_hash_fuer_tests",
        role="teacher"
    )
    student = User(
        name="Khalil",
        password_hash="fake_hash_fuer_tests",
        role="student"
    )
    db.session.add_all([lehrer, student])
    db.session.commit()      # commit, damit lehrer.id entsteht

    print("Lehrer angelegt, id =", lehrer.id)
    print("Student angelegt, id =", student.id)

    building = BuildingType(
        name="herr_mueller",
        code=""
        role="teacher"
    )
    building = BuildingType(
        name="Khalil",
        password_hash="fake_hash_fuer_tests",
        role="student"
    )




    # 2. Klasse anlegen
    klasse = SchoolClass(
        name="10b",
        join_code="AB12CD",
        teacher_id=lehrer.id
    )
    db.session.add(klasse)
    db.session.commit()

    print("Klasse angelegt, id =", klasse.id)