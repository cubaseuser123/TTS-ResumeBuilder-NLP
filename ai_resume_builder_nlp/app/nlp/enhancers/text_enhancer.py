import re 
import copy

WEAK_TO_STRONG_VERBS = {
    "worked on": "Developed",
    "worked with": "Collaborated with",
    "responsible for": "Led",
    "helped": "Assisted",
    "did": "Executed",
    "made": "Created",
    "handled": "Managed",
    "i work": "I develop",
    "i worked": "I developed",
    "i am": "I am",
}

def enhance_text(text: str) -> str:
    """Enhance a single text string by replacing weak verbs with strong ones."""
    if not text or not isinstance(text, str):
        return text
    
    enhanced = text.strip()
    
    for weak, strong in WEAK_TO_STRONG_VERBS.items():
        pattern = re.compile(rf"\b{weak}\b", re.IGNORECASE)
        if pattern.search(enhanced):
            enhanced = pattern.sub(strong, enhanced)
    
    # Capitalize first letter
    if enhanced:
        enhanced = enhanced[0].upper() + enhanced[1:]
    
    return enhanced


def enhance_resume_content(resume_draft: dict) -> dict:
    """
    Enhance resume content by:
    - Replacing weak verbs with strong action verbs
    - Polishing descriptions
    """
    # Create a deep copy to avoid circular references
    enhanced = copy.deepcopy(resume_draft)
    
    # 1. Enhance Summary
    summary = enhanced.get("summary", "")
    if isinstance(summary, str) and summary:
        enhanced["summary"] = enhance_text(summary)
    
    # 2. Enhance Experience descriptions
    experience = enhanced.get("experience", [])
    if isinstance(experience, list):
        for job in experience:
            if not isinstance(job, dict):
                continue
            
            # Enhance description field
            if job.get("description"):
                job["description"] = enhance_text(job["description"])
            
            # Enhance achievements
            achievements = job.get("achievements", [])
            if isinstance(achievements, list):
                job["achievements"] = [
                    enhance_text(a) if isinstance(a, str) else a 
                    for a in achievements
                ]
            
            # Legacy: Also check bullets field
            bullets = job.get("bullets", [])
            if isinstance(bullets, list):
                job["bullets"] = [
                    enhance_text(b) if isinstance(b, str) else b 
                    for b in bullets
                ]
    
    # 3. Enhance Education summaries
    education = enhanced.get("education", [])
    if isinstance(education, list):
        for edu in education:
            if isinstance(edu, dict) and edu.get("summary"):
                edu["summary"] = enhance_text(edu["summary"])
    
    # 4. Enhance Project descriptions
    projects = enhanced.get("projects", [])
    if isinstance(projects, list):
        for proj in projects:
            if isinstance(proj, str):
                continue
            if isinstance(proj, dict):
                if proj.get("description"):
                    proj["description"] = enhance_text(proj["description"])
                if proj.get("summary"):
                    proj["summary"] = enhance_text(proj["summary"])
    
    # 5. Enhance Volunteering summaries
    volunteering = enhanced.get("volunteering", [])
    if isinstance(volunteering, list):
        for vol in volunteering:
            if isinstance(vol, dict) and vol.get("summary"):
                vol["summary"] = enhance_text(vol["summary"])
    
    return enhanced
