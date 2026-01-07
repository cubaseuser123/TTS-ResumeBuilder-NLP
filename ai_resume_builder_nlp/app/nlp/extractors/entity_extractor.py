import re 
import json 
from pathlib import Path

#importing all the json files here

ROLE_KEYWORDS= Path(__file__).resolve().parents[2]/'data'/'role_keywords.json'

COMPANIES_PATH = Path(__file__).resolve().parents[2]/"data"/"companies.json"

with open(ROLE_KEYWORDS, "r", encoding="utf-8") as f:
    ROLE_KEYWORDS = json.load(f)

with open(COMPANIES_PATH, "r", encoding="utf-8") as f:
    COMPANIES_JSON = json.load(f)

COMPANIES=[]
for group in COMPANIES_JSON.values():
    for company in group:
        COMPANIES.append(company["name"].lower())
        for alias in company.get("aliases", []):
            COMPANIES.append(alias.lower())

Email_Regex = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)

Years_Regex = re.compile(
    r"\b(\d+)\s*\+?\s*(years?|yrs?)\b",
    re.IGNORECASE
)

Company_REGEX = re.compile(
    r"\b(?:at|with|for)\s+([A-Z][A-Za-z0-9&.\- ]+)",
)

def extract_email(text: str):
    match = Email_Regex.search(text)
    return match.group(0) if match else None


def extract_years_of_experience(text:str):      
    match = Years_Regex.search(text)
    if not match:
        return None
    return int(match.group(1))

DOMINANT_ROLE_SIGNALS = {
    "data_scientist": [
        "machine learning",
        "deep learning",
        "nlp",
        "computer vision",
        "predictive modeling"
    ]
}

def extract_role(text: str):
    text_lower = text.lower()
    for role,data in ROLE_KEYWORDS.items():
        role_phrase = role.replace("_", " ")
        if role_phrase in text_lower:
            return role_phrase.title()

        for role,signals in DOMINANT_ROLE_SIGNALS.items():
            for sig in signals:
                if sig in text_lower:
                    return role.replace("_"," ").title()

    best_role= None
    best_score = 0
   
    for role, data in ROLE_KEYWORDS.items():
        score = sum(
            1 for kw in data.get("keywords", [])
            if(kw.lower() in text_lower)
        )
        if score > best_score:
            best_score = score 
            best_role = role
    return best_role.replace("_", "").title() if best_role else None

def extract_company(text : str):
    text_lower = text.lower()

    for company in COMPANIES:
        if f"{company}" in f"{text_lower}":
            return company.title()
    return None

def extract_entities(text: str) -> dict:
    return {
        "email": extract_email(text),
        "years_experience": extract_years_of_experience(text),
        "role": extract_role(text),
        "company": extract_company(text),
    }
