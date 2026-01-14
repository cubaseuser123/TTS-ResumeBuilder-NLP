def generate_resume_structure(extracted: dict) -> dict:
    # Get raw_text to use as fallback for experience/education/summary
    raw_text = extracted.get("raw_text", "")
    
    # Use structured fields if present, otherwise use raw_text
    experience = extracted.get("experience") or raw_text
    education = extracted.get("education") or raw_text
    
    # Use extracted_skills if skills not present
    skills = extracted.get("skills") or extracted.get("extracted_skills", [])
    
    # Use raw_text for summary if summary field is empty but content exists
    summary = extracted.get("summary", "")
    if not summary and raw_text:
        summary = raw_text
    
    # Build profile from entities if not provided
    profile = extracted.get("profile")
    if not profile or (isinstance(profile, dict) and len(profile) == 0):
        entities = extracted.get("entities", {})
        profile = {
            "email": entities.get("email", ""),
            "role": entities.get("role", ""),
            "company": entities.get("company", ""),
            "years": entities.get("years", ""),
        }
    
    result = {
        "profile" : profile,
        "summary" : summary,
        "experience": experience,
        "education" : education,
        "skills" : skills,
        "projects" : extracted.get("projects", []),
        "certificates": extracted.get("certificates", []),
        "publications": extracted.get("publications", []),
        "interests": extracted.get("interests", []),
        "volunteering": extracted.get("volunteering", []),
        "references": extracted.get("references", []),
    }
    return result