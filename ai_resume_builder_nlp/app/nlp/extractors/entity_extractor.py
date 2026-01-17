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

# Phone number patterns (international formats)
Phone_Regex = re.compile(
    r"(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}[-.\s]?\d{0,5}"
)

# Name extraction patterns
Name_Patterns = [
    re.compile(r"(?:my name is|i am|i'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)", re.IGNORECASE),
    re.compile(r"^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\.|,|\n)", re.MULTILINE),  # Name at start of line
]

# Location patterns
Location_Patterns = [
    re.compile(r"(?:based in|located in|from|living in|residing in)\s+([A-Za-z][A-Za-z\s,]+?)(?:\.|,|\n|$)", re.IGNORECASE),
    re.compile(r"location[:\s]+([A-Za-z][A-Za-z\s,]+?)(?:\.|,|\n|$)", re.IGNORECASE),
]

def extract_email(text: str):
    match = Email_Regex.search(text)
    return match.group(0) if match else None


def extract_phone(text: str):
    """Extract phone number from text."""
    match = Phone_Regex.search(text)
    if match:
        phone = match.group(0).strip()
        # Ensure it looks like a phone (at least 7 digits)
        digits = re.sub(r'\D', '', phone)
        if len(digits) >= 7:
            return phone
    return None


def extract_name(text: str):
    """Extract name from intro text."""
    for pattern in Name_Patterns:
        match = pattern.search(text)
        if match:
            name = match.group(1).strip()
            # Validate: should be 2-4 words, each capitalized
            words = name.split()
            if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words):
                return name
    return None


def extract_location(text: str):
    """Extract location from text."""
    for pattern in Location_Patterns:
        match = pattern.search(text)
        if match:
            location = match.group(1).strip().rstrip('.,;')
            if len(location) > 2:  # Skip very short matches
                return location
    return None


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
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "location": extract_location(text),
        "years": extract_years_of_experience(text),
        "role": extract_role(text),
        "company": extract_company(text),
    }
