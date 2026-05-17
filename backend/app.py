import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from models import User, Resume, Skill
from nlp_engine import extract_text_from_pdf, analyze_resume, get_demo_resume_data

app = Flask(__name__)
CORS(app)

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__name__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(file)
        if not text.strip():
            return jsonify({"error": "Could not extract text from PDF"}), 400
            
        analysis = analyze_resume(text)
        
        # Save to database (Anonymous upload for now)
        new_resume = Resume(filename=file.filename, score=analysis['score'], ats_score=analysis['ats_score'], raw_text=text)
        db.session.add(new_resume)
        db.session.flush() # get ID
        
        for skill_data in analysis['skills']:
            new_skill = Skill(
                resume_id=new_resume.id,
                name=skill_data['name'],
                category=skill_data['category'],
                proficiency=skill_data['proficiency'],
                demand_score=skill_data['demand_score']
            )
            db.session.add(new_skill)
            
        db.session.commit()
        
        return jsonify({
            "message": "Resume processed successfully",
            "resume_id": new_resume.id,
            "data": analysis
        })
        
    return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/api/demo', methods=['GET'])
def demo_resume():
    demo_data = get_demo_resume_data()
    return jsonify({
        "message": "Demo resume loaded",
        "data": demo_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
