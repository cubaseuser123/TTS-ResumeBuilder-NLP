import sys
from os.path import dirname,join,abspath
from google.adk.agents import SequentialAgent
sys.path.append(abspath(join(dirname(__file__),"..","..")))

from utils.file_loader import load_instructions_file

# Import sub-agents
from agents.understanding_agent.agent import understanding_agent
from agents.clarification_agent.clarification_agent import clarification_agent
from agents.generation_agent.agent import generation_agent
from agents.enhancer_agent.agent import enhancement_agent
from agents.qa_agent.agent import qna_agent
from agents.formatting_agent.agent import formatting_agent

root_coordinator_agent = SequentialAgent(
    name='root_coordinator_agent',
    sub_agents=[
        understanding_agent,
        clarification_agent,
        generation_agent,
        enhancement_agent,
        qna_agent,
        formatting_agent
    ],
    description=load_instructions_file("agents/root_coordinator/descriptions.txt")
)