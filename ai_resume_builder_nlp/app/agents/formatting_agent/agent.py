import sys
from os.path import join, dirname, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 
from utils.schema_normalizer import normalize_resume_schema

def formatting_passthrough(state: dict) -> dict:
    """Final formatting before sending to frontend - ensures all fields match frontend schema"""
    resume = state.get("resume", {}) or state 
    profile = resume.get("profile", {})
    return {
        "profile": {
            "name": profile.get("name", ""),
            "role": profile.get("role", ""),
            "email": profile.get("email", ""),
            "phone": profile.get("phone", ""),
            "location": profile.get("location", ""),
            "linkedin": profile.get("linkedin", ""),
            "github": profile.get("github", ""),
            "years": profile.get("years") or profile.get("years_experience"),
        },
        "summary": resume.get("summary", ""),
        "experience": resume.get("experience", []),
        "education": resume.get("education", []),
        "skills": resume.get("skills", []),
        "projects": resume.get("projects", []),
        "certificates": resume.get("certificates", []),
        "publications": resume.get("publications", []),
        "interests": resume.get("interests", []),
        "volunteering": resume.get("volunteering", []),
        "references": resume.get("references", []),
    }

formatting_agent = Agent(
    name="formatting_agent",
    description=load_instructions_file("agents/formatting_agent/descriptions.txt"),
     tools=[formatting_passthrough]
)