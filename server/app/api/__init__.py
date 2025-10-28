from flask import Blueprint
from .auth import auth_bp
from .read import read_bp
from .create import create_bp

api_bp = Blueprint('api', __name__, url_prefix='/api')

api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(read_bp, url_prefix='/read')
api_bp.register_blueprint(create_bp, url_prefix='/create')