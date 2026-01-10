import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import LlmAgent
from google.genai import types
from nlp.enhancers.text_enhancer import enhance_resume_content

def pre_enhance(state: dict) -> dict:
    return{
        "pre_enhanced_content": enhance_resume_content(state)
    }


enhancement_agent = LlmAgent(
    name="enhancement_agent", 
    model='gemini-2.0-flash',
    instruction=load_instructions_file("agents/enhancer_agent/instructions.txt"),
    description=load_instructions_file("agents/enhancer_agent/description.txt"),
    generate_content_config=types.GenerateContentConfig(
        temperature=0.25
    ),
    tools=[pre_enhance] 
)
