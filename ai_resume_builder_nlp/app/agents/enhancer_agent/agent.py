import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent
from nlp.enhancers.text_enhancer import enhance_resume_content

enhancement_agent = Agent(
    name="enhancement_agent",
    description=load_instructions_file("agents/enhancer_agent/description.txt"),
    # tools=[enhance_resume_content]
)