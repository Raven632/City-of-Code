from app import app
from models import db, User, SchoolClass, BuildingType, Level, LevelUnlock

with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. Lehrer -> commit, damit lehrer.id existiert
    lehrer = User(
        username="herr_mueller",
        password_hash="fake_hash_fuer_tests",
        role="teacher",
    )
    db.session.add(lehrer)
    db.session.commit()

    # 2. Klasse braucht lehrer.id -> commit, damit bfi1.id existiert
    bfi1 = SchoolClass(
        name="HBFI 12",
        class_code="AB12CD",
        teacher_id=lehrer.id,
    )
    db.session.add(bfi1)
    db.session.commit()

    # 3. Schueler braucht bfi1.id
    student = User(
        username="Khalil",
        password_hash="fake_hash_fuer_tests",
        role="student",
        class_id=bfi1.id,
    )
    db.session.add(student)
    db.session.commit()

    # 4. Katalogdaten: Gebaeudetyp und Level haengen nicht voneinander ab
    bauamt = BuildingType(
        code="bauamt",
        name="Bauamt",
        category="main",
        width=3,
        height=3,
        max_count=1,
        asset_key="bauamt",
    )
    level1 = Level(
        number=1,
        title="Systemstart",
        chapter=1,
        python_week=1,
        validator_key="level_01",
        coin_reward=25,
    )
    db.session.add_all([bauamt, level1])
    db.session.commit()

    # 5. Verbindung braucht level1.id und bauamt.code
    unlock1 = LevelUnlock(
        level_id=level1.id,
        building_code=bauamt.code,
        count=1,
    )

    db.session.add(unlock1)
    db.session.commit()

    wohnhaus = BuildingType(
        code="wohnhaus",
        name="wohnhaus",
        category="main",
        width=2,
        height=2,
        max_count=10,
        asset_key="bauamt",
    )
    db.session.add(wohnhaus)
    db.session.commit()
    
    level3 = Level(
        number=3,
        title="Die ersten Bewohner",
        chapter=1,
        python_week=1,
        validator_key="level_03",
        coin_reward=25,
    )
    db.session.add(level3)
    db.session.commit()
    


    unlock3 = LevelUnlock(
        level_id=level3.id,
        building_code=wohnhaus.code,
        count=1,
    )
    db.session.add(unlock3)
    db.session.commit()

    wohnhaus = BuildingType(
            code="wohnhaus",
            name="wohnhaus",
            category="main",
            width=2,
            height=2,
            max_count=10,
            asset_key="bauamt",
        )
    db.session.add(wohnhaus)
    db.session.commit()
        
    level11 = Level(
        number=3,
        title="Die ersten Bewohner",
        chapter=1,
        python_week=1,
        validator_key="level_03",
        coin_reward=25,
    )
    db.session.add(level11)
    db.session.commit()
    


    unlock11 = LevelUnlock(
        level_id=level11.id,
        building_code=wohnhaus.code,
        count=1,
    )
    db.session.add(unlock11)
    db.session.commit()







    print("Lehrer:", lehrer.id, "| Klasse:", bfi1.id, "| Schueler:", student.id, "-> Klasse", student.class_id)
    print("Level:", level1.id, "| Unlock:", unlock1.level_id, unlock1.building_code, unlock1.count)