import sys
from os.path import abspath, join, dirname

sys.path.append(abspath(join(dirname(__file__), "..")))
from google.adk.agents import Agent
from nlp.generator.content_generator import generate_resume_structure
from utils.file_loader import load_instructions_file

generation_agent = Agent(
    name='generation_agent',
    description=load_instructions_file("generation_agent/description.txt"),
    instructions=load_instructions_file("generation_agent/instructions.txt"),
    tools=[generate_resume_structure],
)