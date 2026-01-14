import re 
import copy

WEAK_TO_STRONG_VERBS = {
    "worked on": "Developed",
    "worked with": "Collaborated with",
    "responsible for": "Led",
    "helped": "Assisted",
    "did": "Executed",
    "made": "Created",
    "handled": "Managed"
}

def enhance_bullet(text : str) -> str:
    enhanced = text.strip()

    for weak,strong in WEAK_TO_STRONG_VERBS.items():
        pattern= re.compile(rf"\b{weak}\b", re.IGNORECASE)
        if pattern.search(enhanced):
            enhanced = pattern.sub(strong, enhanced)
            break
    if enhanced:
        enhanced = enhanced[0].upper() + enhanced[1:]
    return enhanced 


def enhance_resume_content(resume_draft : dict) -> dict:
    # Create a deep copy to avoid circular references
    enhanced = copy.deepcopy(resume_draft)
    experience = enhanced.get("experience", [])
    
    # Handle case where experience might not be a list
    if not isinstance(experience, list):
        return enhanced
    
    for i, job in enumerate(experience):
        # Skip if job is not a dictionary (might be a string)
        if not isinstance(job, dict):
            continue
        bullets = job.get("bullets", [])
        if isinstance(bullets, list):
            job["bullets"] = [enhance_bullet(b) for b in bullets if isinstance(b, str)]
    return enhanced

