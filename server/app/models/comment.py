from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, DateTime, ForeignKey
from app.extensions import db
from app.models.user import User
from app.models.post import Post

class Comment(db.Model):
    __tablename__ = "comments"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    
    commenter: Mapped[User] = relationship("User", back_populates="comments")
    post: Mapped[Post] = relationship("Post", back_populates="comments")
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "commenter": self.commenter.serialize()
        }
        
    def serialize_full(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "commenter": self.commenter.serialize(),
            "post_id": self.post_id,
            "user_id": self.user_id
        }