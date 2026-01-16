def generate_resume_structure(extracted: dict) -> dict:
    # Use structured fields only - no fallback to raw_text to prevent duplication
    experience = extracted.get("experience", [])
    education = extracted.get("education", [])
    
    # Use extracted_skills if skills not present
    skills = extracted.get("skills") or extracted.get("extracted_skills", [])
    
    # Use only extracted summary - no fallback to prevent duplication
    summary = extracted.get("summary", "")
    
    # Build profile from entities if not provided or if it's raw text (string)
    profile = extracted.get("profile")
    should_build_from_entities = (
        not profile or 
        isinstance(profile, str) or  # If profile is raw text string, rebuild
        (isinstance(profile, dict) and len(profile) == 0) or
        (isinstance(profile, list))  # If profile is a list, rebuild
    )
    
    if should_build_from_entities:
        entities = extracted.get("entities", {})
        profile = {
            "name": entities.get("name", ""),
            "email": entities.get("email", ""),
            "phone": entities.get("phone", ""),
            "location": entities.get("location", ""),
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