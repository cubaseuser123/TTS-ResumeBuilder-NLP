import sys
from os.path import dirname,join,abspath
from google.adk.agents import SequentialAgent
sys.path.append(abspath(join(dirname(__file__),"..","..")))

from utils.file_loader import load_instructions_file

root_coordinator_agent = SequentialAgent(
    name='root_coordinator_agent',
    sub_agents=[
        undersanding_agent,
        clarification_agent,
        generation_agent,
        enhancement_agent,
        qna_agent,
        formatting_agent
    ],
    description=load_instructions_file("agents/root_coordinator/descriptions.txt")
)