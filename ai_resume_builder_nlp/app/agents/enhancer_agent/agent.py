import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import LlmAgent
from nlp.enhancers.text_enhancer import enhance_resume_content

def pre_enhance(state: dict) -> dict:
    return{
        "pre_enhanced_content": enhance_resume_content(state)
    }


enhancement_agent = LlmAgent(
    name="enhancement_agent", 
    model='gemini-2.5-flash',
    instructions=load_instructions_file("agents/enhancer_agent/instructions.txt"),
    description=load_instructions_file("agents/enhancer_agent/description.txt"),
    temperature=0.25,
    tools=[pre_enhance]
)