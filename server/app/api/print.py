from flask import Blueprint, render_template, make_response, request, abort
from app.models import Schedule
from app.extensions import db
from datetime import datetime
import pdfkit

print_bp = Blueprint("print", __name__)

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

@print_bp.route("/schedule", methods=["GET"])
def print_schedule():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        abort(400, "start date and end date are required")

    start = datetime.fromisoformat(start_date).date()
    end = datetime.fromisoformat(end_date).date()

    schedules = (
        db.session.query(Schedule)
        .join(Schedule.user)
        .join(Schedule.shift)
        .filter(Schedule.shift_date.between(start, end))
        .order_by(Schedule.user_id, Schedule.shift_date)
        .all()
    )

    grouped = {}

    for s in schedules:
        name = s.user.full_name

        # Ensure employee always has Mon–Sat slots
        if name not in grouped:
            grouped[name] = {day: None for day in DAYS}

        # ---- TIME STRING LOGIC ----
        if s.shift_id == 9999:
            time_str = "OFF"

        elif s.shift_id == 9998:
            start_str = s.custom_start_time.strftime("%I:%M %p") if s.custom_start_time else "--:--"
            end_str = s.custom_end_time.strftime("%I:%M %p") if s.custom_end_time else "--:--"
            time_str = f"{start_str} - {end_str}"

        else:
            start_time = s.custom_start_time or s.shift.start_time
            end_time = s.custom_end_time or s.shift.end_time

            start_str = start_time.strftime("%I:%M %p") if start_time else "--:--"
            end_str = end_time.strftime("%I:%M %p") if end_time else "--:--"
            time_str = f"{start_str} - {end_str}"

        day_key = s.shift_date.strftime("%a")

        grouped[name][day_key] = {
            "time": time_str,
            "location": s.location.name.lower()  # for CSS
        }

    html = render_template(
        "print_schedules.html",
        grouped=grouped,
        start=start.strftime("%B %d"),
        end=end.strftime("%B %d"),
        days=DAYS
    )

    config = pdfkit.configuration(
        wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
    )

    pdf = pdfkit.from_string(html, False, configuration=config)

    response = make_response(pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "attachment; filename=weekly_schedule.pdf"

    return response
