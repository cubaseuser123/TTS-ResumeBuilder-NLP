import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 

def qa_passthrough(resume_draft: dict) -> dict:
   
     """
    QA stub:
    - Does not modify resume content
    - Always approves
    - Returns empty issues list
    """
    return{
        "approved": True,
        "issues": [],
        "resume_draft":resume_draft,
    }

qna_agent = Agent(
    name="qna_agent",
    description=load_instructions_file("agents/qna_agent/description.txt"),
    instructions=load_instructions_file("agents/qna_agent/instructions.txt"),
    # tools=[qa_passthrough]
)