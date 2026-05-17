from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_mock_resume():
    c = canvas.Canvas("mock_resume.pdf", pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, "Jane Doe - Full Stack Developer")

    c.setFont("Helvetica", 12)
    text = c.beginText(72, height - 100)
    
    lines = [
        "Email: jane.doe@example.com | Phone: 555-0100 | LinkedIn: linkedin.com/in/janedoe",
        "",
        "SUMMARY",
        "Passionate Full Stack Developer with 5 years of experience building scalable web applications.",
        "Strong problem solving skills and excellent teamwork and communication.",
        "",
        "SKILLS",
        "Programming: Python, JavaScript, TypeScript, Java",
        "Tools & Frameworks: React, Node.js, Docker, Git, AWS",
        "Databases: MySQL, PostgreSQL, MongoDB",
        "AI/ML: Machine Learning, Scikit-Learn, Pandas (basics)",
        "",
        "EXPERIENCE",
        "Senior Software Engineer | Tech Corp Inc. | Jan 2021 - Present",
        "- Developed and maintained large scale microservices using Python and Flask.",
        "- Built responsive user interfaces with React and TailwindCSS.",
        "- Utilized Docker for containerization and AWS for deployment.",
        "- Implemented Agile methodologies and Scrum processes to improve team velocity.",
        "",
        "Software Engineer | Web Solutions LLC | Jun 2018 - Dec 2020",
        "- Designed RESTful APIs using Node.js and Express.",
        "- Optimized PostgreSQL database queries, reducing load times by 30%.",
        "- Collaborated with cross-functional teams emphasizing communication and leadership."
    ]
    
    for line in lines:
        text.textLine(line)
        
    c.drawText(text)
    c.save()
    print("Created mock_resume.pdf successfully.")

if __name__ == "__main__":
    create_mock_resume()
