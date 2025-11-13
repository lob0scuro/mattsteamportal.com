from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, func, desc
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
    comments = relationship('Comments', back_populates='commenter', lazy=True)
    

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
    schedule_week = Column(DateTime, nullable=True)

    # many-to-one: each post belongs to one user
    author = relationship('User', back_populates='posts')
    comments = relationship('Comments', back_populates='post', cascade='all, delete-orphan', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'file_path': self.file_path,
            'author_id': self.author_id,
            'created_at': self.created_at,
            'author': self.author.serialize_basic(),
            'comments': [c.serialize_basic() for c in self.comments],
            'schedule_week': self.schedule_week
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
            'author': f"{self.author.first_name} {self.author.last_name[0]}.",
            'schedule_week': self.schedule_week,
            'username': self.author.username
        }


class Comments(db.Model):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_on = Column(DateTime, nullable=False, default=func.now())
    
    commenter = relationship('User', back_populates='comments')
    post = relationship('Post', back_populates='comments')
    
    def serialize(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'content': self.content,
            'created_on': self.created_on,
            'commenter': self.commenter.serialize_basic()
        }
        
    def serialize_basic(self):
        return {
            'id': self.id,
            'content': self.content,
            'created_on': self.created_on,
            'commenter': self.commenter.serialize_basic()
        }
        
        
class Reviews(db.Model):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(250), nullable=True)
    appliance = Column(String(100), nullable=True)
    sales_associate = Column(String(50), nullable=True)
    review = Column(Text, nullable=False)
    created_on = Column(DateTime, default=func.now())