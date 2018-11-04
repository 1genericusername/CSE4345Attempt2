from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True)
    class_name = Column(String(50))
    dept = Column(String(50))
    number = Column(String(120))
    desc = Column(String(120))

    def __init__(self, class_name=None, dept=None, number=None,desc=None):
        self.class_name = class_name
        self.dept = dept
        self.number = number
        self.desc = desc

    def __repr__(self):
        return '<Class %r>' % (self.class_name)

class User(UserMixin, Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(120), index=True, unique=True)
    smu_id = Column(String(12), index=True, unique=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    password_hash = Column(String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def is_admin(self):
        return self.is_admin

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, email, smu_id):
        self.email = email
        self.smu_id = smu_id

    def __repr__(self):
        return '<User {}>'.format(self.email)    