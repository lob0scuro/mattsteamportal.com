from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify(success=False, message="No input data provided"), 400
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password1')
    check_password = data.get('password2')
    is_admin = data.get('is_admin')
    
    if password != check_password:
        return jsonify(success=False, message="Passwords do not match"), 400
    
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify(success=False, message="Username or email already exists"), 400
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        username=username,
        first_name=first_name.capitalize(),
        last_name=last_name.capitalize(),
        email=email,
        password_hash=password_hash,
        is_admin = is_admin
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(success=True, message="User registered successfully"), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify(success=True, message=f"{user.first_name} has been logged in", user=user.serialize_basic()), 200
    return jsonify(success=False, message="Invalid credentials"), 401


@auth_bp.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify(success=True, message="User logged out successfully"), 200



@auth_bp.route('/hydrate_user', methods=['GET'])
@login_required
def hydrate_user():
    user_data = current_user.serialize_basic()
    return jsonify(success=True, user=user_data), 200

@auth_bp.route("/invite_link", methods=["POST"])
def invite_link():
    email = request.form.get("email").strip()
    if not email:
        return jsonify(success=False, message="No data in payload"), 400
      
    