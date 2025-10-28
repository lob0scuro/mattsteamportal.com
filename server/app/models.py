from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    is_admin = Column(Boolean, default=False)

    # one-to-many: a user can have many posts
    posts = relationship('Post', back_populates='author', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'is_admin': self.is_admin,
            'posts': [post.serialize_basic() for post in self.posts]
        }
        
    def serialize_basic(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'is_admin': self.is_admin
        }


class Post(db.Model):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    file_path = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=func.now())
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # many-to-one: each post belongs to one user
    author = relationship('User', back_populates='posts')

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'file_path': self.file_path,
            'author_id': self.author_id,
            'author': {
                'id': self.author.id,
                'username': self.author.username,
                'first_name': self.author.first_name,
                'last_name': self.author.last_name,
                'email': self.author.email
            }
        }

    def serialize_basic(self):
        """Simpler version to avoid recursion when serializing User → Posts → User → ..."""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'file_path': self.file_path,
            'created_at': self.created_at,
            'author': f"{self.author.first_name} {self.author.last_name[0]}."
        }
