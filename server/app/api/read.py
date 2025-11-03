from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user    
from app.models import User, Post, Comments
from sqlalchemy import desc
from datetime import datetime, timedelta


read_bp = Blueprint('read', __name__)



########################
########################
##   GET USER DATA    ##
########################
########################
@read_bp.route('/get_user/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(success=False, message="User not found"), 404
    return jsonify(success=True, user=user.serialize()), 200


@read_bp.route('/get_users', methods=['GET'])
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
    ordered_comments = Comments.query.filter_by(post_id=post.id).order_by(desc(Comments.created_on)).all()
    post_data = post.serialize()
    post_data["comments"] = [c.serialize() for c in ordered_comments]
    return jsonify(success=True, post=post_data), 200


@read_bp.route("/get_posts/<int:page>/<int:limit>", methods=["GET"])
def get_posts(page, limit):
    page = max(page, 1)
    offset = (page - 1) * limit
    limit = int(limit)
    posts = Post.query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()
    return jsonify(
        success=True, 
        page=page, 
        limit=limit, 
        posts=[p.serialize_basic() for p in posts],
        message="No posts found" if not posts else "Posts retrieved successfully"
        ), 200


@read_bp.route("/get_schedules", methods=["GET"])
@login_required
def get_schedules():
    today = datetime.today()
    monday = today - timedelta(days=today.weekday())
    monday = monday.replace(hour=0, minute=0, second=0, microsecond=0)
    
    try:
        weekly_posts = (
            Post.query.filter(Post.category == 'schedule').filter(Post.schedule_week == monday).order_by(Post.created_at.asc()).all()
        )
        if not weekly_posts:
            return jsonify(success=True, message="No schedules have been posted yet", schedules=[])
        
        return jsonify(success=True, schedules=[p.serialize_basic() for p in weekly_posts]), 200
    except Exception as e:
        return jsonify(success=False, message="There was an error when querying for this weeks schedules."), 500