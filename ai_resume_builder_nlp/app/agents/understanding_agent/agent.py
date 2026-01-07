import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent
from app.nlp.extractors.entity_extractor import extract_entities
from app.nlp.extractors.skill_matcher import extract_material
from app.nlp.extractors.pattern_matcher import extract_metrics
from app.nlp.validators.completeness_checker import check_completeness

def understand_text(text: str) -> dict:
    entities = extract_entities(text)
    return {
        "raw_text": text,
        "entities": entities,
        "skills": extract_material(text),
        "metrics": extract_metrics(text),
        "missing_fields": check_completeness(entities)
    }

understanding_agent = Agent(
    name='understanding_agent',
    description=load_instructions_file("agents/understanding_agent/descriptions.txt"),
    tools=[understand_text]
)