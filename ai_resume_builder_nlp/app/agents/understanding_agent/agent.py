import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent
from app.nlp.extractors.entity_extractor import extract_entities
    
from utils.logger import log_event
from utils.state_utils import update_state
from utils.json_utils import safe_json

understanding_agent = Agent(
    name='understanding_agent',
    description=load_instructions_file("agents/understanding_agent/descriptions.txt"),
    instructions=load_instructions_file("agents/understanding_agent/instructions.txt"),
    tools=[extract_entities]
)