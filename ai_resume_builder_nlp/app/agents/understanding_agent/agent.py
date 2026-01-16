import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent
from app.nlp.extractors.entity_extractor import extract_entities
from app.nlp.extractors.skill_matcher import extract_skills
from app.nlp.extractors.pattern_matcher import extract_metrics
from app.nlp.validators.completeness_checker import check_completeness
from app.nlp.extractors.section_extractor import extract_sections

def understand_text(text: str) -> dict:
    entities = extract_entities(text)
    sections = extract_sections(text)  # NEW: Parse section content from raw_text
    
    result = {
        "raw_text": text,
        "entities": entities,
        "extracted_skills": extract_skills(text),
        "extracted_metrics": extract_metrics(text),
        "missing_fields": check_completeness(entities),
    }
    
    # Merge extracted sections into result (experience, education, summary, etc.)
    result.update(sections)
    
    return result


understanding_agent = Agent(
    name='understanding_agent',
    description=load_instructions_file("agents/understanding_agent/descriptions.txt"),
    tools=[understand_text]
)