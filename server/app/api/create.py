from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post, Comments
from app.extensions import db
from flask_login import current_user, login_required
import os
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path
import platform
from datetime import datetime


ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


create_bp = Blueprint("create", __name__)


@create_bp.route("/create_post", methods=["POST"])
@login_required
def create_post():
    
    title = request.form.get("title").strip()
    content = request.form.get("content", "").strip()
    category = request.form.get("category", "general").strip()
    schedule_week = request.form.get('schedule_week') or None
    date_obj = None
    
    if schedule_week:
        date_obj = datetime.strptime(schedule_week, "%Y-%m-%d")
    
    
    file = request.files.get("upload")
    file_path = None
    
    existing = Post.query.filter_by(
        category='schedule',
        title=title,
        schedule_week=schedule_week
    ).first()
    
    if existing:
        return jsonify(success=False, message="Schedule already exists for this team on this week"), 400
    
    if file and allowed_file(file.filename):
        safe_filename = secure_filename(file.filename)
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        
        if file.filename.lower().endswith(".pdf"):
            pdf_save_path = os.path.join(upload_folder, f"{current_user.id}_{safe_filename}")
            file.save(pdf_save_path)
            
            poppler_path = None
            
            if platform.system() == "Windows":
                poppler_path = r"C:\\Program Files\\poppler-25.07.0\\Library\\bin"
            
            images = convert_from_path(
                pdf_save_path,
                dpi=200,
                fmt="png",
                poppler_path=poppler_path
            )
            
            png_filename = f"{current_user.id}_{safe_filename.rsplit('.',1)[0]}.png"
            png_save_path = os.path.join(upload_folder, png_filename)
            images[0].save(png_save_path, "PNG")
            
            os.remove(pdf_save_path)
            
            file_path = f"/uploads/{png_filename}"
        else:
            filename = f"{current_user.id}_{safe_filename}"
            save_path = os.path.join(upload_folder, filename)
            file.save(save_path)
            file_path = f"/uploads/{filename}"
        
    try:
        post = Post(
        title=title,
        content=content,
        category=category,
        file_path=file_path,
        author_id=current_user.id,
        schedule_week=date_obj
        )
        db.session.add(post)
        db.session.commit()
        
        return jsonify(success=True, message="Post has been successfully created!", post_id=post.id), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error when uploading new post: {e}")
        return jsonify(success=False, message=f"There was an error when submitting new post"), 500
        
    
    
@create_bp.route("/add_comment/<int:post_id>", methods=["POST"])
@login_required
def add_comment(post_id):
    data = request.get_json()
    comment = data.get("comment")
    try:
        new_comment = Comments(
            post_id=post_id,
            user_id=current_user.id,
            content=comment
        )
        db.session.add(new_comment)
        db.session.commit()
        return jsonify(success=True, message="Posted!", comment=new_comment.serialize()), 201
    except Exception as e:
        print(f"[ERROR]: {e}")
        return jsonify(success=False, message="There was an error when posting new comment"), 500