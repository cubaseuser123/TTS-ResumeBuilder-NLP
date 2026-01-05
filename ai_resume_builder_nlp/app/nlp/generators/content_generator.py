def generate_resume_structure(extracted: dict) -> dict:
    return{
        "profile" : extracted.get("profile", {}),
        "summary" : "",
        "experience": extracted.get("experience", []),
        "education" : extracted.get("education", []),
        "skills" : extracted.get("skills", []),
        "projects" :[],
        "certificates":[],
        "publications":[],
        "interests":[],
        "volunteering":[],
        "references":[],
    }