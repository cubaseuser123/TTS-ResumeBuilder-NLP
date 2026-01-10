import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent

def clarification_questions(state : dict) -> dict:
    if state.get("test_mode"):
        return {
            "needs_more_information": False,
            "questions": []
        }
    REQUIRED_SECTIONS = [
        "profile",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certificates",
        "publications",
        "interests",
        "volunteering",
        "references",
    ]

    questions_map = {
        "profile": "Please provide your basic profile information.",
        "summary": "Please provide a professional summary.",
        "experience": "Please describe your work experience (roles, companies, duration, achievements).",
        "education": "What is your educational background? (degree, major, institution)",
        "skills": "What skills would you like to include?",
        "projects": "Have you worked on any projects you'd like to mention?",
        "certificates": "Do you have any certifications?",
        "publications": "Do you have any publications to include?",
        "interests": "Would you like to include any interests?",
        "volunteering": "Have you done any volunteering work?",
        "references": "Would you like to add references?",
    }
    
    missing_fields = state.get("missing_fields", [])
    if not isinstance(missing_fields, list):
        missing_fields = list(missing_fields)
        
    for field in REQUIRED_SECTIONS:
        value = state.get(field)
        
        is_missing = False
        if value is None:
            is_missing = True
        elif isinstance(value, str) and not value.strip():
            is_missing = True
        elif isinstance(value, list) and len(value) == 0:
            is_missing = True
        elif isinstance(value, dict) and len(value) == 0:
            is_missing = True
            
        if is_missing and field not in missing_fields:
            missing_fields.append(field)
    
    questions = []
    for field in missing_fields:
        if field in questions_map:
            questions.append({
                "field": field,
                "question": questions_map[field]
            })
    return{
        "needs_more_information": bool(questions),
        "questions" : questions
    }

clarification_agent = Agent(
    name="clarification_agent",
    description=load_instructions_file("agents/clarification_agent/descriptions.txt"),
    tools=[clarification_questions]
)