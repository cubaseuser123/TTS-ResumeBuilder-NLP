REQUIRED_FIELDS = {
    "role" : "Job Role",
    "company": "Company",
    "years": "Years Of Experience"
}

def check_completeness(entities: dict) -> list:
    missing=[] 

    for key, label in REQUIRED_FIELDS.items():
        if not entities.get(key):
            missing.append(label)
    return missing