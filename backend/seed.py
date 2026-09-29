from app import app
from models import db, User, SchoolClass, BuildingType, Level, LevelUnlock

# Gebaeudetypen: (code, name, anzahl, groesse)
# Quelle: Production-Dokument Abschnitt 13 / Leon Abschnitt 5
BUILDING_TYPES = [
    ("bauamt", "Bauamt", 1, 3),
    ("ortsschild", "Ortsschild", 1, 1),
    ("wohnhaus", "Wohnhaus", 10, 2),
    ("lagerhaus", "Lagerhaus", 1, 3),
    ("stromstation", "Stromstation", 1, 3),
    ("buergerbuero", "Bürgerbüro", 1, 3),
    ("bank", "Bank", 1, 3),
    ("rathaus", "Rathaus", 1, 4),
    ("feuerwehr", "Feuerwehr", 2, 3),
    ("verkehrszentrale", "Verkehrszentrale", 1, 3),
    ("wohnkomplex", "Wohnkomplex", 1, 4),
    ("forstbetrieb", "Forstbetrieb", 1, 3),
    ("strassenmeisterei", "Straßenmeisterei", 1, 2),
    ("recyclingzentrum", "Recyclingzentrum", 1, 4),
    ("fabrik", "Fabrik", 1, 5),
    ("stadtpark", "Stadtpark", 1, 5),
    ("notrufzentrale", "Notrufzentrale", 1, 3),
    ("krankenhaus", "Krankenhaus", 1, 5),
    ("schule", "Schule", 1, 4),
    ("universitaet", "Universität", 1, 6),
]

# Level: (nummer, titel, kapitel, python_woche, {gebaeude_code: anzahl})
# Quelle: Production-Dokument Abschnitt 18/19 / Leon Abschnitt 6
# python_woche: Landingpage "LERNE ECHTES PYTHON" (Woche 1-6)
LEVELS = [
    (1, "Systemstart", 1, 1, {"bauamt": 1}),
    (2, "Der Name der Stadt", 1, 1, {"ortsschild": 1}),
    (3, "Die ersten Bewohner", 1, 1, {"wohnhaus": 1}),
    (4, "Das Materialdepot", 1, 1, {"lagerhaus": 1}),
    (5, "Energieversorgung", 2, 2, {"stromstation": 1}),
    (6, "Bürgerregistrierung", 2, 2, {"buergerbuero": 1}),
    (7, "Das Stadtbudget", 2, 2, {"bank": 1}),
    (8, "Das Rathaus", 2, 3, {"rathaus": 1}),
    (9, "Feueralarm", 2, 3, {"feuerwehr": 2}),
    (10, "Verkehrssteuerung", 2, 3, {"verkehrszentrale": 1}),
    (11, "Wohnungsnot", 3, 4, {"wohnhaus": 9, "wohnkomplex": 1}),
    (12, "Holzversorgung", 3, 4, {"forstbetrieb": 1}),
    (13, "Die Nachtschicht", 3, 4, {"strassenmeisterei": 1}),
    (14, "Der Müllkreislauf", 3, 4, {"recyclingzentrum": 1}),
    (15, "Die Produktionsroutine", 4, 5, {"fabrik": 1}),
    (16, "Das grüne Herz", 4, 5, {"stadtpark": 1}),
    (17, "Die Notrufzentrale", 4, 5, {"notrufzentrale": 1}),
    (18, "Krankenhausbetrieb", 4, 6, {"krankenhaus": 1}),
    (19, "Das Bildungszentrum", 4, 6, {"schule": 1}),
    (20, "Der Systemcheck", 4, 6, {"universitaet": 1}),
]

COIN_REWARD = 25  # Platzhalter, exakte Werte erst nach Prototyp (Abschnitt 72)


with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. Lehrer -> flush, damit lehrer.id existiert (noch kein commit)
    lehrer = User(
        username="herr_mueller",
        password_hash="fake_hash_fuer_tests",
        role="teacher",
    )
    db.session.add(lehrer)
    db.session.flush()

    # 2. Klasse braucht lehrer.id
    bfi1 = SchoolClass(
        name="HBFI 12",
        class_code="AB12CD",
        teacher_id=lehrer.id,
    )
    db.session.add(bfi1)
    db.session.flush()

    # 3. Schueler braucht bfi1.id
    student = User(
        username="Khalil",
        password_hash="fake_hash_fuer_tests",
        role="student",
        class_id=bfi1.id,
    )
    db.session.add(student)

    # 4. Katalog: Gebaeudetypen (Hauptgebaeude sind immer kostenlos -> price=None)
    for code, name, anzahl, groesse in BUILDING_TYPES:
        db.session.add(BuildingType(
            code=code,
            name=name,
            category="main",
            width=groesse,
            height=groesse,
            max_count=anzahl,
            asset_key=code,
        ))

    # 5. Katalog: Level + Freischaltungen (Level 11 schaltet zwei Typen frei)
    for nummer, titel, kapitel, woche, unlocks in LEVELS:
        level = Level(
            number=nummer,
            title=titel,
            chapter=kapitel,
            python_week=woche,
            validator_key=f"level_{nummer:02d}",
            coin_reward=COIN_REWARD,
        )
        db.session.add(level)
        db.session.flush()  # level.id wird fuer LevelUnlock gebraucht

        for code, anzahl in unlocks.items():
            db.session.add(LevelUnlock(level_id=level.id, building_code=code, count=anzahl))

    # Ein commit am Ende: entweder alles oder nichts
    db.session.commit()

    # Kontrolle gegen das Production-Dokument: 30 Pflichtobjekte, 310 Tiles
    unlocks = LevelUnlock.query.all()
    types = {bt.code: bt for bt in BuildingType.query.all()}
    objekte = sum(u.count for u in unlocks)
    tiles = sum(u.count * types[u.building_code].width * types[u.building_code].height for u in unlocks)

    print("Lehrer:", lehrer.id, "| Klasse:", bfi1.id, "| Schueler:", student.id, "-> Klasse", student.class_id)
    print("Level:", Level.query.count(), "| Gebaeudetypen:", len(types), "| Objekte:", objekte, "| Tiles:", tiles)
