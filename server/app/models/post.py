from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey
from app.extensions import db
# from app.models.user import User
# from app.models.comment import Comment
from app.models.enums import PostCategoryEnum, PostVisibilityEnum


class Post(db.Model):
    __tablename__ = "posts"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    category: Mapped[PostCategoryEnum] = mapped_column(
        db.Enum(PostCategoryEnum), nullable=True
    )
    visibility: Mapped[PostVisibilityEnum] = mapped_column(
        db.Enum(PostVisibilityEnum), nullable=False, default=PostVisibilityEnum.PUBLIC
    )
    file_path: Mapped[str] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    #relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan", lazy=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": str(self.category),
            "visibility": str(self.visibility),
            "author": self.author.serialize()
        }
        
    def serialize_full(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "category": str(self.category),
            "visibility": str(self.visibility),
            "file_path": self.file_path,
            "created_at": self.created_at.isoformat(),
            "author": self.author.serialize(),
            "comments": [c.serialize() for c in self.comments]
        }
    
    