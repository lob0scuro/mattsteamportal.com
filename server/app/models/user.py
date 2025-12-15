from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, Enum as saEnum
from flask_login import UserMixin
from app.extensions import db, bcrypt
from app.models.enums import RoleEnum, DepartmentEnum
from flask_bcrypt import generate_password_hash, check_password_hash
# from app.models.comment import Comment
# from app.models.post import Post
# from app.models.time_off_request import TimeOffRequest
# from app.models.schedule import Schedule

class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    role: Mapped[str] = mapped_column(
        saEnum(RoleEnum, values_callable=lambda x: [e.value for e in x]), 
        nullable=False, 
        default=RoleEnum.EMPLOYEE
    )
    department: Mapped[DepartmentEnum] = mapped_column(saEnum(DepartmentEnum), nullable=False)
    
    #realtionships
    posts = relationship("Post", back_populates="author", lazy=True)
    comments = relationship("Comment", back_populates="commenter", lazy=True)
    schedules = relationship("Schedule", back_populates="user", lazy=True)
    time_off_requests = relationship("TimeOffRequest", back_populates="user", lazy=True)
    
    
    #password methods
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "role": str(self.role),
            "department": str(self.department),
            "time_off_requests": [t.serialize() for t in self.time_off_requests]
        }
        
    def serialize_full(self):
        return {
            **self.serialize(),
            "created_at": self.created_at.isoformat(),
            "latest_update": self.updated_at.isoformat(),
            "posts": [p.serialize() for p in self.posts],
            "comments": [c.serialize() for c in self.comments],
            "schedules": [s.serialize() for s in self.schedules],
            "time_off_requests": [t.serialize() for t in self.time_off_requests]
        }