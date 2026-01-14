import sys
from os.path import join, dirname, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 
from utils.schema_normalizer import normalize_resume_schema

def formatting_passthrough(state: dict) -> dict:
    """Final formatting before sending to frontend - ensures all fields match frontend schema"""
    resume = state.get("resume", {}) or state 
    
    # First normalize all list fields to ensure they are actually lists
    normalized = normalize_resume_schema(resume)
    
    # Extract and format profile separately - handle if profile is a string
    profile = resume.get("profile", {})
    if isinstance(profile, str):
        # If profile is a string, create a dict with the string as name
        normalized["profile"] = {
            "name": profile,
            "role": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "years": "",
        }
    elif isinstance(profile, dict):
        normalized["profile"] = {
            "name": profile.get("name", ""),
            "role": profile.get("role", ""),
            "email": profile.get("email", ""),
            "phone": profile.get("phone", ""),
            "location": profile.get("location", ""),
            "linkedin": profile.get("linkedin", ""),
            "github": profile.get("github", ""),
            "years": profile.get("years") or profile.get("years_experience"),
        }
    else:
        normalized["profile"] = {
            "name": "",
            "role": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "years": "",
        }
    
    return normalized

formatting_agent = Agent(
    name="formatting_agent",
    description=load_instructions_file("agents/formatting_agent/descriptions.txt"),
     tools=[formatting_passthrough]
)