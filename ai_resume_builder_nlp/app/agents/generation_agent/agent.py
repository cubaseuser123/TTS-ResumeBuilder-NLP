import sys
from os.path import abspath, join, dirname

sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from google.adk.agents import Agent
from nlp.generators.content_generator import generate_resume_structure
from utils.file_loader import load_instructions_file

def generate_resume(state: dict) -> dict:
    print("Debug generation state keys:" , state.keys())
    print("Debug skills in test:", state.get("skills"))
    resume = generate_resume_structure(state)
    for feild in [
        "profile", "summary", "experience", "education",
    "skills", "projects", "certificates",
    "publications", "interests", "volunteering", "references"
    ]:
        if feild in state and state[feild]:
            resume[feild] = state[feild]
    return{"final_resume": resume}
    
    

generation_agent = Agent(
    name='generation_agent',
    description=load_instructions_file("agents/generation_agent/description.txt"),
    tools=[generate_resume],
)