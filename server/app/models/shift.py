from datetime import datetime, time
from sqlalchemy import Time, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.extensions import db
from app.models.schedule import Schedule

class Shift(db.Model):
    __tablename__ = "shifts"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=True)
    end_time: Mapped[time] = mapped_column(Time, nullable=True)
    
    schedules: Mapped[list["Schedule"]] = relationship("Schedule", back_populates="shift", lazy=True)
    
    
    def duration(self):
        if not self.start_time or not self.end_time:
            return None
        start_dt = datetime.combine(datetime.today(), self.start_time)
        end_dt = datetime.combine(datetime.today(), self.end_time)
        
        return (end_dt - start_dt).total_seconds() / 3600
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "start_time": self.start_time.strftime("%H:%M") if self.start_time else None,
            "end_time": self.end_time.strftime("%H:%M") if self.end_time else None
        }
    