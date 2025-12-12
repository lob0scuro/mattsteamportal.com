from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post, Comment
from app.extensions import db
from flask_login import current_user, login_required


delete_bp = Blueprint("delete", __name__)

@delete_bp.route("/delete_post/<int:id>", methods=["DELETE"])
@login_required
def delete_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify(success=False, message="Could not query post, please try again."), 400
    db.session.delete(post)
    db.session.commit()
    
    current_app.logger.info(f"{current_user.first_name} {current_user.last_name} has deleted post #{id}")
    return jsonify(success=True, message="Post has been deleted"), 200


@delete_bp.route("/delete_comment/<int:id>", methods=["DELETE"])
@login_required
def delete_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return jsonify(success=False, message="Something went wrong when finding comment"), 400
    if not current_user.is_admin:
        if comment.user_id != current_user.id:
            return jsonify(success=False, message="Sorry, you cant delete a comment that wasnt yours."), 403
    db.session.delete(comment)
    db.session.commit()
    
    current_app.logger.info(f"{current_user.first_name} {current_user.last_name} has deleted comment #{id}")
    return jsonify(success=True, message="Comment has been removed."), 200