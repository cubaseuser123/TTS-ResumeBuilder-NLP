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
    for job in experience:
        bullets = job.get("bullets", [])
        job["bullets"] = [enhance_bullet(b) for b in bullets]
    return enhanced
