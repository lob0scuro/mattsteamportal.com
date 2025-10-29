from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post
from app.extensions import db
from flask_login import current_user, login_required
import os
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path


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
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        
        if file.filename.lower().endswith(".pdf"):
            pdf_save_path = os.path.join(upload_folder, f"{current_user.id}_{safe_filename}")
            file.save(pdf_save_path)
            
            images = convert_from_path(
                pdf_save_path,
                dpi=200,
                fmt="png",
                poppler_path=r"C:\\Program Files\\poppler-25.07.0\\Library\\bin"
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
        author_id=current_user.id
        )
        db.session.add(post)
        db.session.commit()
        
        return jsonify(success=True, message="Post has been successfully created!"), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error when uploading new post: {e}")
        return jsonify(success=False, message=f"There was an error when submitting new post"), 500
        
    
    