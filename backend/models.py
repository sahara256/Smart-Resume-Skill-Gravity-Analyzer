from database import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    resumes = db.relationship('Resume', backref='user', lazy=True)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # allow anonymous for demo
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Integer, nullable=True) # Overall resume score / 100
    ats_score = db.Column(db.Integer, nullable=True)
    raw_text = db.Column(db.Text, nullable=True)
    
    skills = db.relationship('Skill', backref='resume', lazy=True, cascade="all, delete-orphan")

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Programming, AI/ML, Databases, Soft skills, Tools
    proficiency = db.Column(db.Integer, nullable=False) # 0-100
    demand_score = db.Column(db.Integer, nullable=False) # 0-100 Recruiter demand
