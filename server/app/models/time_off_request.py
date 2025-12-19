from datetime import date, time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Date, String, Boolean, Enum as saEnum
from app.models.enums import TimeOffStatusEnum
from app.extensions import db
# from app.models.user import User

class TimeOffRequest(db.Model):
    __tablename__ = "time_off_requests"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    is_pto: Mapped[bool] = mapped_column(Boolean,nullable=False, default=False)
    status: Mapped[TimeOffStatusEnum] = mapped_column(saEnum(TimeOffStatusEnum), nullable=False, default=TimeOffStatusEnum.PENDING)
    
    user = relationship("User", back_populates="time_off_requests")
    
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "reason": self.reason,
            "is_pto": self.is_pto,
            "status": str(self.status),
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name
            }
        }