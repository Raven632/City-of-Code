from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def utcnow():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")  # student | teacher
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=True)
    city_name = db.Column(db.String(40), nullable=True)  # wird erst in Level 2 gesetzt
    coin_balance = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    last_active_at = db.Column(db.DateTime, nullable=True)  # null = noch nie aktiv gewesen


class SchoolClass(db.Model):
    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    class_code = db.Column(db.String(20), unique=True, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id", use_alter=True, name="fk_classes_teacher"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class Level(db.Model):
    __tablename__ = "levels"

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    chapter = db.Column(db.Integer, nullable=False)
    python_week = db.Column(db.Integer, nullable=False)
    validator_key = db.Column(db.String(100), nullable=False)
    coin_reward = db.Column(db.Integer, nullable=False, default=0)


class BuildingType(db.Model):
    __tablename__ = "building_types"

    code = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    max_count = db.Column(db.Integer, nullable=True)
    price = db.Column(db.Integer, nullable=True)
    requires_access = db.Column(db.Boolean, nullable=False, default=False)
    asset_key = db.Column(db.String(80), nullable=False)

class LevelUnlock(db.Model):
    """Welches Level schaltet wie viele Gebaeude welchen Typs frei (n:m)."""
    __tablename__ = "level_unlocks"

    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), primary_key=True)
    building_code = db.Column(db.String(50), db.ForeignKey("building_types.code"), primary_key=True)
    count = db.Column(db.Integer, nullable=False, default=1)


class BuildingInstance(db.Model):
    """Konkretes Gebaeude eines Spielers. tile_x/tile_y = None -> noch nicht platziert."""
    __tablename__ = "building_instances"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    building_code = db.Column(db.String(50), db.ForeignKey("building_types.code"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)  # aus welchem Level freigeschaltet
    instance_number = db.Column(db.Integer, nullable=False)  # "Wohnhaus #7"
    tile_x = db.Column(db.Integer, nullable=True)
    tile_y = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "building_code", "instance_number", name="uq_instance"),
        db.Index("ix_instance_user", "user_id"),
    )


class LevelProgress(db.Model):
    """Eine Zeile pro Schueler und Level. Status wird aus den Zeitstempeln berechnet."""
    __tablename__ = "level_progress"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    attempts = db.Column(db.Integer, nullable=False, default=0)
    hints_used = db.Column(db.Integer, nullable=False, default=0)
    reward_claimed = db.Column(db.Boolean, nullable=False, default=False)
    code_passed_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "level_id", name="uq_progress"),
    )