from flask import Blueprint, jsonify, request, abort, current_app
from flask_login import login_required, current_user    
from app.extensions import db
from app.models import User, Post, Comment, Shift, Schedule, TimeOffRequest
from sqlalchemy import desc, select
from datetime import datetime, timedelta, date
import json
import platform


read_bp = Blueprint('read', __name__)


if platform.system() == "Windows": 
    directory_path = "C:\\Users\\matts\\OneDrive\\Documents\\Cameron\\employees.json"
else:
    directory_path = "/home/cameron/employees.json"
    
def load_employee_data():   
    with open(directory_path) as f:
        return json.load(f)


########################
########################
##   GET USER DATA    ##
########################
########################
@read_bp.route('/user/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(success=False, message="User not found"), 404
    return jsonify(success=True, user=user.serialize()), 200


@read_bp.route('/users', methods=['GET'])
@login_required
def get_users():
    users = User.query.all()
    users_data = [user.serialize() for user in users]
    return jsonify(success=True, users=users_data), 200


########################
########################
##   GET POST DATA    ##
########################
########################
@read_bp.route("/post/<int:id>", methods=["GET"])
def get_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify(success=False, message="Could not query post"), 400
    
    current_app.logger.info(f"{current_user.first_name} {current_user.last_name} viewed post '{post.title}'")
    return jsonify(success=True, post=post.serialize_full()), 200


@read_bp.route("/posts/<category>/<int:page>/<int:limit>", methods=["GET"])
def get_posts(category, page, limit):
    page = max(page, 1)
    offset = (page - 1) * limit
    limit = int(limit)
    
    query = Post.query
    if category.lower() != "all":
        query = query.filter_by(category=category)
        
    total_posts = query.count()
    total_pages = (total_posts + limit - 1) // limit
    posts = query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()
    return jsonify(
        success=True, 
        page=page, 
        limit=limit, 
        total_posts=total_posts,
        total_pages=total_pages,
        posts=[p.serialize() for p in posts],
        message="No posts found" if not posts else "Posts retrieved successfully"
        ), 200

########################
########################
## GET SCHEDULE DATA  ##
########################
########################
@read_bp.route("/schedules", methods=["GET"])
@login_required
def get_schedules():
    schedules = Schedule.query.all()
    if not schedules:
        return jsonify(success=False, message="Schedules not found"), 404
    return jsonify(success=True, schedules=[s.serialize() for s in schedules]), 200

@read_bp.route("/user_schedule/<int:id>", methods=["GET"])
@login_required
def get_user_schedule(id):
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return jsonify(success=False, message="Start and End dates are required"), 400
    
    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    except ValueError:
        return jsonify(success=False, message="Invalid date format. Use YYYY-MM-DD"), 400
    
    user = User.query.get(id)
    if not user:
        return jsonify(success=False, message="User not found"), 404
    
    stmt = (
        select(Schedule)
        .where(
            Schedule.user_id == id,
            Schedule.shift_date.between(start, end)
        )
        .order_by(Schedule.shift_date.asc())
    )
    
    schedule = db.session.execute(stmt).scalars().all()
    
    return jsonify(success=True, user=user.serialize(), schedule=[s.serialize() for s in schedule]), 200



@read_bp.route("/employee_directory", methods=["GET"])
@login_required
def employee_directory():
    if not current_user.is_admin:
        return jsonify(success=False, message="Forbidden"), 403
    try:
        employee_data = load_employee_data()
    except FileNotFoundError as e:
        print(f"[ERROR]: {e}")
        return jsonify(success=False, message="Employee data file not found"), 500
    except json.JSONDecodeError as je:
        print(f"[ERROR]: {je}")
        return jsonify(success=False, message="Employee data is corrupted"), 500
    return jsonify(success=True, employees=employee_data), 200


@read_bp.route("/shifts", methods=["GET"])
@login_required
def get_shifts():
    shifts = Shift.query.all()
    if not shifts:
        return jsonify(success=False, message="Shifts not found"), 404
    return jsonify(success=True, shifts=[s.serialize() for s in shifts]), 200



#------------------
#   TIME OFF QUERY
#------------------
@read_bp.route("/time_off_request/<int:id>", methods=["GET"])
@login_required
def get_time_off_request(id):
    time_off_request = TimeOffRequest.query.get(id)
    if not time_off_request:
        return jsonify(success=False, message="Request not found"), 404
    return jsonify(success=True, time_off_request=time_off_request.serialize()), 200

@read_bp.route("/time_off_requests", methods=["GET"])
@login_required
def get_time_off_requests():
    try:
        time_off_requests = TimeOffRequest.query.all()
        by_status = {
            "pending": [],
            "approved": [],
            "denied": []
        }
        
        for to in time_off_requests:
            by_status[to.status.value].append(to.serialize())
        
        return jsonify(success=True, time_off_requests=by_status), 200
    except Exception as e:
        current_app.logger.error(f"[TIME OFF REQUEST QUERY ERROR]: {e}")
        return jsonify(success=False, message="There was an error when querying time off requests."), 500