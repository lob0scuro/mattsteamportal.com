from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post, TimeOffStatusEnum, RoleEnum, TimeOffRequest
from app.extensions import db
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path
import os
import platform

update_bp = Blueprint("update", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@update_bp.route("/update_post/<int:id>", methods=["PATCH"])
def update_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify(success=False, message="Could not edit this post."), 403
    
    if post.author_id != current_user.id:
        return jsonify(success=False, message="You are not authorized to delete this post.")
    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()
    category = request.form.get("category", "").strip()
    file = request.files.get("upload")
    
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    file_path = post.file_path
    
    if file and allowed_file(file.filename):
        safe_filename = secure_filename(file.filename)
        
        if post.file_path:
            old_file = os.path.join(current_app.root_path, post.file_path.strip("/"))
            if os.path.exists(old_file):
                os.remove(old_file)
        
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
    
    post.title = title or post.title
    post.content = content or post.content
    post.category = category or post.category
    post.file_path = file_path
    
    try:
        db.session.commit()
        
        current_app.logger.info(f"{current_user.first_name} {current_user.last_name} has edited post #{post.id}")
        return jsonify(success=True, message="Post updated successfully"), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[POST UPDATE ERROR]: {e}")
        return jsonify(success=False, message="There was an error when updating post"), 500
    
    
@update_bp.route("/time_off_request/<int:id>/<status>", methods=["PATCH"])
@login_required
def update_time_off_status(id, status):
    if current_user.role not in [RoleEnum.ADMIN]:
        return jsonify(success=False, message="Unauthorized"), 403
    
    status = status.lower()    
    time_off_request = TimeOffRequest.query.get(id)
    
    if not time_off_request:
        return jsonify(success=False, message="Request not found"), 404
    
    try:
        status = TimeOffStatusEnum(status)
    except ValueError:
        return jsonify(success=False, message="Invalid request status"), 400
    
    time_off_request.status = status
    db.session.commit()
    return jsonify(success=True, message="Status updated!"), 200