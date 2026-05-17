import spacy
import PyPDF2
from io import BytesIO
import random

# Load spacy model (we will use this for real extraction if needed, 
# but we can also use rule-based matching for specific skills to ensure categorization)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

SKILL_DB = {
    "Programming": ["Python", "JavaScript", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "Kotlin", "Rust", "PHP"],
    "AI/ML": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Scikit-Learn", "Keras", "Pandas", "NumPy"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", "DynamoDB"],
    "Soft skills": ["Leadership", "Communication", "Teamwork", "Problem Solving", "Time Management", "Agile", "Scrum"],
    "Tools": ["Git", "Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "GCP", "Linux", "React", "Vue", "Angular", "Node.js", "Flask", "Django"]
}

def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_skills(text):
    text_lower = text.lower()
    extracted_skills = []
    
    for category, skills in SKILL_DB.items():
        for skill in skills:
            if skill.lower() in text_lower:
                # Mock generating a proficiency and demand score based on the skill
                proficiency = random.randint(40, 95)
                demand_score = random.randint(60, 100)
                
                extracted_skills.append({
                    "name": skill,
                    "category": category,
                    "proficiency": proficiency,
                    "demand_score": demand_score
                })
                
    return extracted_skills

def analyze_resume(text):
    skills = extract_skills(text)
    
    # Mock analysis
    score = random.randint(65, 95)
    ats_score = random.randint(70, 98)
    
    return {
        "score": score,
        "ats_score": ats_score,
        "skills": skills
    }

def get_demo_resume_data():
    return {
        "score": 88,
        "ats_score": 92,
        "skills": [
            {"name": "Python", "category": "Programming", "proficiency": 95, "demand_score": 90},
            {"name": "JavaScript", "category": "Programming", "proficiency": 85, "demand_score": 95},
            {"name": "TypeScript", "category": "Programming", "proficiency": 75, "demand_score": 92},
            {"name": "React", "category": "Tools", "proficiency": 90, "demand_score": 96},
            {"name": "Node.js", "category": "Tools", "proficiency": 80, "demand_score": 88},
            {"name": "Docker", "category": "Tools", "proficiency": 65, "demand_score": 90},
            {"name": "AWS", "category": "Tools", "proficiency": 70, "demand_score": 95},
            {"name": "MySQL", "category": "Databases", "proficiency": 85, "demand_score": 80},
            {"name": "MongoDB", "category": "Databases", "proficiency": 75, "demand_score": 85},
            {"name": "Machine Learning", "category": "AI/ML", "proficiency": 60, "demand_score": 95},
            {"name": "TensorFlow", "category": "AI/ML", "proficiency": 50, "demand_score": 88},
            {"name": "Problem Solving", "category": "Soft skills", "proficiency": 95, "demand_score": 85},
            {"name": "Communication", "category": "Soft skills", "proficiency": 90, "demand_score": 90},
            {"name": "Agile", "category": "Soft skills", "proficiency": 85, "demand_score": 80}
        ]
    }
