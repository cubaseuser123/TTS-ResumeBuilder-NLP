import json 
from pathlib import Path

SKILLS_PATH = Path(__file__).resolve().parents[2]/'data'/'skills.json'

with open(SKILLS_PATH) as f:
    SKILLS_DATA = json.load(f)


def extract_material(text:str) -> list:
    pass