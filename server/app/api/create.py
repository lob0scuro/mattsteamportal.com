from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post
from app.extensions import db
from flask_login import current_user, login_required
import os
from werkzeug.utils import secure_filename


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
    
    file = request.files.get("upload")
    file_path = None
    
    if file and allowed_file(file.filename):
        safe_filename = secure_filename(file.filename)
        filename = f"{current_user.id}_{safe_filename}"
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        save_path = os.path.join(upload_folder, filename)
        file.save(save_path)
        file_path = f"/uploads/{filename}"
        
    try:
        post = Post(
        title=title,
        content=content,
        category=category,
        file_path=file_path,
        author_id=current_user.id
        )
        db.session.add(post)
        db.session.commit()
        
        return jsonify(success=True, message="Post has been successfully created!"), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error when uploading new post: {e}")
        return jsonify(success=False, message=f"There was an error when submitting new post"), 500
        
    
    