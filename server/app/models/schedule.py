from sqlalchemy import Date, Time, Text, ForeignKey, Enum as saEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db
from datetime import date, time
from app.models.enums import LocationEnum
# from app.models.user import User
# from app.models.shift import Shift

class Schedule(db.Model):
    __tablename__ = "schedules"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    shift_id: Mapped[int] = mapped_column(ForeignKey("shifts.id"), nullable=False)
    shift_date: Mapped[date] = mapped_column(Date, nullable=False)
    location: Mapped[LocationEnum] = mapped_column(saEnum(LocationEnum), nullable=False)
    custom_start_time: Mapped[time] = mapped_column(Time, nullable=True)
    custom_end_time: Mapped[time] = mapped_column(Time, nullable=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    
    #relationships
    user = relationship("User", back_populates="schedules")
    shift = relationship("Shift", back_populates="schedules")
    
    def serialize(self):
        start = self.custom_start_time or self.shift.start_time
        end = self.custom_end_time or self.shift.end_time
        return {
            "id": self.id,
            "user_id": self.user_id,
            "shift_id": self.shift_id,
            "shift_date": self.shift_date.isoformat(),
            "location": str(self.location),
            "user": {
                "id": self.user.id,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "email": self.user.email,
                "role": str(self.user.role),
                "department": str(self.user.department)
            },
            "shift": {
                "title": self.shift.title,
                "start_time": start.strftime("%H:%M") if start else None,
                "end_time": end.strftime("%H:%M") if end else None
            },
            "note": self.note
        }