import re


def normalize_to_list(value, split_by_comma=False):
    """
    Ensures a value is a list.
    - If already a list, return as-is.
    - If a string and split_by_comma=True, split by comma and trim.
    - If a string and split_by_comma=False, wrap in single-item list.
    - Otherwise return empty list.
    """
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        if split_by_comma:
            # Split comma-separated strings into list of trimmed items
            return [item.strip() for item in value.split(",") if item.strip()]
        else:
            # Wrap string content into single-item list
            return [value] if value.strip() else []
    return []


def extract_metrics_from_text(text: str) -> list:
    """
    Extract numeric achievements (%, numbers, counts) from text.
    Returns a list of extracted metric strings.
    """
    if not isinstance(text, str):
        return []
    
    metrics = []
    
    # Pattern for percentages like "30%", "increased by 50%"
    percent_pattern = r'\d+(?:\.\d+)?%'
    percent_matches = re.findall(percent_pattern, text)
    metrics.extend(percent_matches)
    
    # Pattern for numbers with context (e.g., "5 projects", "100 users", "$50K")
    number_context_pattern = r'\$?\d+(?:,\d{3})*(?:\.\d+)?[KkMmBb]?\s*(?:projects?|users?|clients?|employees?|team members?|people|years?|months?)?'
    number_matches = re.findall(number_context_pattern, text, re.IGNORECASE)
    for match in number_matches:
        if match.strip() and match.strip() not in metrics:
            metrics.append(match.strip())
    
    return metrics


def extract_role_company_from_text(text: str) -> tuple:
    """
    Extract role and company from a string experience description.
    Patterns like: "work as a Software Engineer at TechCorp"
    Returns (role, company) tuple.
    """
    role = ""
    company = ""
    
    # Pattern: "as a/an [ROLE] at [COMPANY]"
    match = re.search(r'(?:work(?:ed|ing)?|am|was|serve[ds]?)\s+(?:as\s+)?(?:a\s+|an\s+)?([A-Z][a-zA-Z\s]+?)\s+at\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s*\(|\s*\.|\s*,|$)', text, re.IGNORECASE)
    if match:
        role = match.group(1).strip()
        company = match.group(2).strip()
        return (role, company)
    
    # Pattern: "[ROLE] at [COMPANY]"
    match = re.search(r'\b([A-Z][a-zA-Z\s]+?(?:Engineer|Developer|Manager|Analyst|Designer|Lead|Director|Consultant|Specialist|Intern|Associate))\s+at\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s*\(|\s*\.|\s*,|$)', text, re.IGNORECASE)
    if match:
        role = match.group(1).strip()
        company = match.group(2).strip()
        return (role, company)
    
    # Pattern: "at [COMPANY] as [ROLE]"
    match = re.search(r'at\s+([A-Z][a-zA-Z0-9\s]+?)\s+as\s+(?:a\s+|an\s+)?([A-Z][a-zA-Z\s]+?)(?:\s*\(|\s*\.|\s*,|$)', text, re.IGNORECASE)
    if match:
        company = match.group(1).strip()
        role = match.group(2).strip()
        return (role, company)
    
    return (role, company)


def normalize_experience_entry(exp) -> dict:
    """
    Normalize a single experience entry to ensure it has role, company, description.
    Maps alternative keys and extracts metrics.
    """
    
    # If experience is a string, wrap it into an object with extracted role/company
    if isinstance(exp, str):
        metrics = extract_metrics_from_text(exp)
        role, company = extract_role_company_from_text(exp)
        return {
            "role": role,
            "company": company,
            "description": exp,
            "achievements": metrics if metrics else []
        }
    
    # If not a dict, return empty normalized entry
    if not isinstance(exp, dict):
        return {
            "role": "",
            "company": "",
            "description": "",
            "achievements": []
        }
    
    # Map alternative keys to standard keys
    # role: title, position, job_title, role
    role = (
        exp.get("role") or 
        exp.get("title") or 
        exp.get("position") or 
        exp.get("job_title") or
        ""
    )
    
    # company: company, organization, employer, org
    company = (
        exp.get("company") or 
        exp.get("organization") or 
        exp.get("employer") or 
        exp.get("org") or
        ""
    )
    
    # description: description, summary, duties, responsibilities
    description = (
        exp.get("description") or 
        exp.get("summary") or 
        exp.get("duties") or 
        exp.get("responsibilities") or
        ""
    )
    
    # Get existing achievements or extract from description
    achievements = exp.get("achievements", [])
    if not achievements and description:
        achievements = extract_metrics_from_text(description)
    
    # Also check for bullets field
    bullets = exp.get("bullets", [])
    if bullets and isinstance(bullets, list):
        for bullet in bullets:
            if isinstance(bullet, str):
                bullet_metrics = extract_metrics_from_text(bullet)
                achievements.extend(bullet_metrics)
    
    # Build normalized entry, preserving other fields
    normalized = {
        "role": role,
        "company": company,
        "description": description,
        "achievements": achievements if isinstance(achievements, list) else [],
    }
    
    # Preserve other fields that might be useful
    for key in ["start_date", "end_date", "date", "location", "bullets"]:
        if key in exp:
            normalized[key] = exp[key]
    
    return normalized


def normalize_experience_list(experience) -> list:
    """
    Normalize the entire experience list.
    """
    # First ensure it's a list
    if isinstance(experience, str):
        experience = [experience]
    elif not isinstance(experience, list):
        return []
    
    # Normalize each entry
    return [normalize_experience_entry(exp) for exp in experience]


def normalize_resume_schema(resume_draft: dict) -> dict:
    """
    Normalize resume fields to ensure list fields are always lists
    and experience entries have proper structure.
    """
    return {
        "profile": resume_draft.get("profile", {}),
        "summary": resume_draft.get("summary", ""),
        # skills: split comma-separated strings into list
        "skills": normalize_to_list(resume_draft.get("skills", []), split_by_comma=True),
        # languages: split comma-separated strings into list
        "languages": normalize_to_list(resume_draft.get("languages", []), split_by_comma=True),
        # experience: normalize each entry to have role, company, achievements
        "experience": normalize_experience_list(resume_draft.get("experience", [])),
        # other list fields: wrap string in single-item list if needed
        "education": normalize_to_list(resume_draft.get("education", [])),
        "projects": normalize_to_list(resume_draft.get("projects", [])),
        "certificates": normalize_to_list(resume_draft.get("certificates", [])),
        "publications": normalize_to_list(resume_draft.get("publications", [])),
        "interests": normalize_to_list(resume_draft.get("interests", []), split_by_comma=True),
        "volunteering": normalize_to_list(resume_draft.get("volunteering", [])),
        "references": normalize_to_list(resume_draft.get("references", [])),
    }
