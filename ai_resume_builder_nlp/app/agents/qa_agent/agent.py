import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 

MIN_SKILLS = 3
MIN_EXP_ITEMS= 1 

def qa_passthrough(state: dict) -> dict:
    issues = []
    entities = state.get("entities", {})
    skills = state.get("skills", [])
    metrics = state.get("metrics", {})
    
    if not entities.get("role"):
        issues.append("missing job role")
    
    if not entities.get("company"):
        issues.append("missing company")
    
    if not entities.get("years"):
        issues.append("missing years of experience")        

    if len(skills) < MIN_SKILLS:
        issues.append("too few skills listed")

    if not metrics:
        issues.append("no major import (metrics) found")
    
    return{
        "qa_passed" : len(issues) == 0,
        "issues" : issues
    }

qna_agent = Agent(
    name="qna_agent",
    description=load_instructions_file("agents/qa_agent/description.txt"),
    tools=[qa_passthrough]
)