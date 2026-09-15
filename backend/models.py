from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=True)


class SchoolClass(db.Model):
    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    join_code = db.Column(db.String(20), unique=True, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class Level(db.Model):
    __tablename__ = "levels"

    id = db.Column(db.Integer, primary_key=True)
    nummer = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_code = db.Column(db.Text, nullable=True)
    building = db.Column(db.String(50), db.ForeignKey("building_types.code"), nullable=False)
    checker_function = db.Column(db.String(100), nullable=False)

class Building(db.Model):
    __tablename__ = "buildings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(50), db.ForeignKey("building_types.code"), nullable=False)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    __table_args__ = (
        db.UniqueConstraint("user_id", "x", "y", name="uq_tile"),
        db.Index("ix_building_user", "user_id"),
    )
class BuildingType(db.Model):
    __tablename__ = "building_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    code = db.Column(db.String(50), nullable=False, unique=True)

class Log(db.Model):
    __tablename__ = "logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    code = db.Column(db.Text)
    result = db.Column(db.String(50), nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    __table_args__ = (
        db.Index("ix_log_user_level", "user_id", "level_id"),
    )
