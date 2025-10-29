from flask import Blueprint, jsonify, request
from app.models import User, Post
from app.extensions import db
from flask_login import current_user, login_required


delete_bp = Blueprint("delete", __name__)

@delete_bp.route("/delete_post/<int:id>", methods=["DELETE"])
def delete_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify(success=False, message="Could not query post, please try again."), 400
    db.session.delete(post)
    db.session.commit()
    return jsonify(success=True, message="Post has been deleted"), 200

