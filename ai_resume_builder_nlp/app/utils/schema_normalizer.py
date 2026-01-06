def normalize_resume_schema(resume_draft: dict) -> dict:
    return {
        "profile": resume_draft.get("profile", {}),
        "summary": resume_draft.get("summary", ""),
        "experience": resume_draft.get("experience", []),
        "education": resume_draft.get("education", []),
        "skills": resume_draft.get("skills", {}),
        "projects": resume_draft.get("projects", []),
        "certificates": resume_draft.get("certificates", []),
        "publications": resume_draft.get("publications", []),
        "interests": resume_draft.get("interests", []),
        "volunteering": resume_draft.get("volunteering", []),
        "references": resume_draft.get("references", [])
    }
