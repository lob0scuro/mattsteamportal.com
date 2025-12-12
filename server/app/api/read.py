from flask import Blueprint, jsonify, request, abort, current_app
from flask_login import login_required, current_user    
from app.models import User, Post, Comment, Shift
from sqlalchemy import desc
from datetime import datetime, timedelta
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
@read_bp.route("/get_post/<int:id>", methods=["GET"])
def get_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify(success=False, message="Could not query post"), 400
    ordered_comments = Comment.query.filter_by(post_id=post.id).order_by(desc(Comment.created_on)).all()
    post_data = post.serialize()
    post_data["comments"] = [c.serialize() for c in ordered_comments]
    
    current_app.logger.info(f"{current_user.first_name} {current_user.last_name} viewed post '{post.title}'")
    return jsonify(success=True, post=post_data), 200


@read_bp.route("/get_posts/<category>/<int:page>/<int:limit>", methods=["GET"])
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
        posts=[p.serialize_basic() for p in posts],
        message="No posts found" if not posts else "Posts retrieved successfully"
        ), 200


@read_bp.route("/get_schedules", methods=["GET"])
@login_required
def get_schedules():
    today = datetime.today()
    monday = today - timedelta(days=today.weekday())
    monday = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    
    if today.weekday() == 6:
        monday += timedelta(days=7)
    
    try:
        weekly_posts = (
            Post.query.filter(Post.category == 'schedule').filter(Post.schedule_week == monday).order_by(Post.created_at.asc()).all()
        )
        
        expected_teams = {"Sales", "Cleaners", "Techs"}
        found_teams = {p.title for p in weekly_posts}
        
        missing = expected_teams - found_teams
        
        if not weekly_posts:
            return jsonify(success=True, message="No schedules have been posted yet", schedules=[])
        
        if missing:
            return jsonify(
                success=True,
                message=f"Schedules incomplete - missing: {','.join(missing)}",
                schedules=[p.serialize_basic() for p in weekly_posts],
            ), 200
        
        return jsonify(success=True, schedules=[p.serialize_basic() for p in weekly_posts]), 200
    except Exception as e:
        return jsonify(success=False, message="There was an error when querying for this weeks schedules."), 500
    

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

