import json 
from pathlib import Path

SKILLS_PATH = Path(__file__).resolve().parents[2]/'data'/'skills.json'

with open(SKILLS_PATH, "r", encoding="utf-8") as f:
    SKILLS_DATA = json.load(f)


def extract_material(text:str) -> list:
    text_lower = text.lower()
    found_skills = set()

    for section in SKILLS_DATA.values():
        if isinstance(section, dict):
            for skill_list in section.values():
                for skill in skill_list:
                    if(skill.lower() in text_lower):
                        found_skills.add(skill)
        elif isinstance(section, list):
            for skill in section:
                if(skill.lower() in text.lower()):
                    found_skills.add(skill)
    return sorted(found_skills)

