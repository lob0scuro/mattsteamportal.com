from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User
from flask_mailman import EmailMessage


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
    if not current_user.is_admin:
        return jsonify(success=False, message="Unauthorized"), 403
    data = request.get_json()
    new_employee = data.get("email").strip()
    if not new_employee:
        return jsonify(success=False, message="No data in payload"), 400
    registration_link = "http://localhost:5173/register"
    
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello!</h2>
            <p>
                You have been invited to join <strong>Matt's Appliances Team Portal</strong>.
            </p>
            <p>
                Please follow the link below to register your account.
            </p>
            <p>
                <a href="{registration_link}" target="_blank" 
                style="background-color:#007BFF;color:white;padding:10px 15px;
                        text-decoration:none;border-radius:5px;">
                Register Your Account
                </a>
            </p>
            <br>
            <p style="font-size: 0.9em;">This invite was sent by {current_user.first_name}.</p>
        </body>
    </html>
    """
    
    email = EmailMessage(
        subject=f"{current_user.first_name} has invited you to join the Matt's Appliances team portal!",
        body=body,
        from_email=current_app.config.get("MAIL_DEFAULT_SENDER"),
        to=[new_employee]
    )
    
    email.content_subtype = "html"
    try:
        email.send()
    except Exception as e:
        print(f"Error when sending invite link: {e}")
        return jsonify(success=False, message="Failed to send invite link"), 500
    
    return jsonify(success=True, message=f"An invite link has been sent to {new_employee}."), 200
    
      
    