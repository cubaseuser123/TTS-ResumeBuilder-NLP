import sys
import os 
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__),"..","..")))
from utils.file_loader import load_instructions_file, load_description_file
from nlp.enhancers.text_enhancer import enhance_resume_content

enhancement_agent = Agent(
    name="enhancement_agent",
    description=load_description_file("enhancer_agent/description.txt"),
    instructions=load_instructions_file("enhancer_agent/instructions.txt"),
    tools=[enhance_resume_content]
)