import sys
from os.path import abspath, join, dirname

sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from google.adk.agents import Agent
from nlp.generators.content_generator import generate_resume_structure
from utils.file_loader import load_instructions_file
from utils.schema_normalizer import normalize_resume_schema

def generate_resume(state: dict) -> dict:
    resume = generate_resume_structure(state)
    # NOTE: "profile" is intentionally excluded - content_generator builds it from entities
    for feild in [
        "summary", "experience", "education",
    "skills", "languages", "projects", "certificates",
    "publications", "awards", "interests", "volunteering", "references"
    ]:
        if feild in state and state[feild]:
            resume[feild] = state[feild]
    
    # Normalize schema to ensure list fields are lists BEFORE QA runs
    normalized_resume = normalize_resume_schema(resume)
    return{"final_resume": normalized_resume}
    
    

generation_agent = Agent(
    name='generation_agent',
    description=load_instructions_file("agents/generation_agent/description.txt"),
    tools=[generate_resume],
)