import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent

def clarification_questions(missing_feilds : list) -> dict:
    questions_map = {
        "education": "What is your educational background? (degree, major, institution)",
        
        "experience": "Can you describe your work experience? (role, company, duration)",
        
        "skills": "What skills would you like to include?",
        
        "projects": "Have you worked on any projects you'd like to mention?",
        
        "certifications": "Do you have any certifications?",
        
        "contact": "What contact details should be included?"
    }

    questions = []
    for feild in missing_feilds:
        if feild in questions_map:
            questions.append({
                "feild":feild,
                "question":questions_map[feild]
            })
    return{
        "needs more information" : True,
        "questions" : questions
    }

clarification_agent = Agent(
    name="clarification_agent",
    description=load_instructions_file("agents/clarification_agent/descriptions.txt"),
    instructions=load_instructions_file("agents/clarification_agent/instructions.txt"),
    # tools=[
    #     clarification_questions
    # ]
)