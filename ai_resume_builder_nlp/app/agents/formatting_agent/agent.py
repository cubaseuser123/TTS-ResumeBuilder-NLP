import sys
from os.path import join, dirname, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 
from utils.schema_normalizer import normalize_resume_schema

def formatting_passthrough(resume_draft: dict) -> dict:
    formatted = normalize_resume_schema(resume_draft)
    return{
        "resumeData": formatted,
        "ready":True,
    }   

formatting_agent = Agent(
    name="formatting_agent",
    description=load_instructions_file("agents/formatting_agent/descriptions.txt"),
    # tools=[
    #     formatting_passthrough
    # ]
)