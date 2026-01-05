def extract_entities(text: str) -> dict:
    return {}

def validate_data(data: dict) -> dict:
    return {"valid": True, "missing": []}

def check_completeness(data: dict) -> dict:
    return {"ready": False, "missing": ["education", "experience"]}
