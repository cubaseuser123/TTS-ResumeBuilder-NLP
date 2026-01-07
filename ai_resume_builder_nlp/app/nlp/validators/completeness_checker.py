REQUIRED_FEILDS = {
    "role" : "Job Role",
    "company": "Company",
    "years_of_experience": "Years Of Experience"
}

def check_completeness(entities: dict) -> list:
    missing=[] 

    for key, label in REQUIRED_FEILDS.items():
        if not entities.get(key):
            missing.append(label)
    return missing