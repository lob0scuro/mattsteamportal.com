from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer


auth_bp = Blueprint('auth', __name__)

def generate_reset_token(email):
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return s.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=1800): #30 minutes
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=expiration)
    except Exception:
        return None
    return email



@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    admin_flag = request.args.get('admin') == 'true'
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
        is_admin=admin_flag
    )
    db.session.add(new_user)
    db.session.commit()
    
    current_app.logger.info(f"{new_user.first_name} {new_user.last_name} has been registered.")
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
    current_app.logger.info(f"{user.first_name} {user.last_name} logged in.")
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
    is_admin = data.get("is_admin", False)
    
    if not new_employee:
        return jsonify(success=False, message="No data in payload"), 400
    registration_link = f"https://mattsteamportal.com/register?admin={is_admin}"
    
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello!</h2>
            <p>
                You have been invited to join <strong>Matt's Appliances Team Portal</strong>.
            </p>
            <p>
                Please follow the link below to register your account!
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
        current_app.logger.error(f"Error when sending invite link: {e}")
        print(f"Error when sending invite link: {e}")
        return jsonify(success=False, message="Failed to send invite link"), 500
    
    current_app.logger.info(f"An invite link has been sent to {email}")
    return jsonify(success=True, message=f"An invite link has been sent to {new_employee}."), 200
    
      
    
@auth_bp.route("/request_password_reset", methods=["POST"])
def request_password_reset():
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify(success=False, message="No user with that email found."), 404
    
    token = generate_reset_token(user.email)
    reset_url = f"https://mattsteamportal.com/reset_password/{token}"
    
    message = EmailMessage(
        subject="Password Reset Request",
        body=f"Click the link to reset your password:\n\n{reset_url}",
        to=[user.email]
    )
    message.send()
    
    current_app.logger.info(f"{user.first_name} {user.last_name} has requested a password reset, A request has been sent to: {email}")
    return jsonify(success=True, message=f"Password reset has been sent to: {email}"), 200

@auth_bp.route("/reset_password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json()
    new_password = data.get("password")
    email = verify_reset_token(token)
    
    if not email:
        return jsonify(success=False, message="Invalid or expired token."), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(success=False, message="User not found"), 404
    
    hashed_pw = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password_hash = hashed_pw
    db.session.commit()
    
    current_app.logger.info(f"{user.first_name} {user.last_name} has reset their password")
    return jsonify(success=True, message="Your password has been reset!"), 200
    