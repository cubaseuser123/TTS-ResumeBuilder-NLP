"""
Section Extractor - Parses labeled sections from resume raw_text

This module extracts structured section content from free-form resume text.
It looks for section headers (e.g., "Experience:", "Education:") and extracts
the content between them.
"""

import re
from typing import Dict, List, Any


# Section header patterns (case-insensitive)
# NOTE: "profile" is intentionally excluded - entity extraction handles profile info
SECTION_HEADERS = [
    "summary", "professional summary", "objective", "about me",
    "experience", "work experience", "employment", "work history",
    "education", "academic background", "qualifications",
    "skills", "technical skills", "core competencies",
    "projects", "personal projects", "key projects",
    "certificates", "certifications", "credentials",
    "publications", "papers", "articles",
    "awards", "achievements", "honors",
    "volunteering", "volunteer experience", "community service",
    "interests", "hobbies", "personal interests",
    "references",
    "languages",
]

# Build regex to find section headers
SECTION_PATTERN = re.compile(
    r"^(" + "|".join(re.escape(h) for h in SECTION_HEADERS) + r")[\s]*[:.]?\s*",
    re.IGNORECASE | re.MULTILINE
)


def normalize_header(header: str) -> str:
    """Map various header names to canonical section names."""
    header_lower = header.lower().strip().rstrip(":.")
    
    mapping = {
        "professional summary": "summary",
        "objective": "summary",
        "about me": "summary",
        "work experience": "experience",
        "employment": "experience",
        "work history": "experience",
        "academic background": "education",
        "qualifications": "education",
        "technical skills": "skills",
        "core competencies": "skills",
        "personal projects": "projects",
        "key projects": "projects",
        "certifications": "certificates",
        "credentials": "certificates",
        "papers": "publications",
        "articles": "publications",
        "achievements": "awards",
        "honors": "awards",
        "volunteer experience": "volunteering",
        "community service": "volunteering",
        "hobbies": "interests",
        "personal interests": "interests",
    }
    
    return mapping.get(header_lower, header_lower)


def split_into_list_items(content: str) -> List[str]:
    """Split content by common list separators (bullets, dashes, newlines with content)."""
    # Split by common bullet patterns
    items = re.split(r"\n\s*[-•*]\s*|\n\s*\d+[.)]\s*", content)
    
    # Filter and clean
    result = []
    for item in items:
        item = item.strip()
        if item and len(item) > 3:  # Skip very short fragments
            result.append(item)
    
    return result if result else [content.strip()] if content.strip() else []


def parse_experience_entry(text: str) -> Dict[str, Any]:
    """Parse an experience entry into structured format."""
    entry = {
        "role": "",
        "company": "",
        "description": text,
        "achievements": []
    }
    
    # Try to extract role and company patterns
    # Pattern: "Role at Company (Date)" or "Role, Company" or "Company - Role"
    patterns = [
        r"^(.+?)\s+at\s+(.+?)(?:\s*\(|\s*,|\s*$)",  # "Role at Company"
        r"^(.+?)\s*[-–—]\s*(.+?)(?:\s*\(|\s*,|\s*$)",  # "Role - Company" or "Company - Role"
        r"^(.+?),\s*(.+?)(?:\s*\(|\s*$)",  # "Role, Company"
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text, re.IGNORECASE)
        if match:
            entry["role"] = match.group(1).strip()
            entry["company"] = match.group(2).strip()
            break
    
    # Extract metrics/achievements (percentages, numbers)
    metrics = re.findall(r'\d+(?:\.\d+)?%|\$\d+[KMB]?|\d+\s*(?:users?|projects?|clients?|team members?)', text, re.IGNORECASE)
    if metrics:
        entry["achievements"] = metrics
    
    return entry


def parse_education_entry(text: str) -> Dict[str, Any]:
    """Parse an education entry into structured format."""
    entry = {
        "degree": "",
        "institution": "",
        "year": "",
        "summary": text
    }
    
    # Try to extract degree and institution
    # Pattern: "Degree from/at Institution" or "Degree, Institution"
    patterns = [
        r"(.+?)\s+(?:from|at)\s+(.+?)(?:\s+in\s+|\s*,|\s*$)",
        r"(.+?),\s*(.+?)(?:\s+in\s+|\s*$)",
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text, re.IGNORECASE)
        if match:
            entry["degree"] = match.group(1).strip()
            entry["institution"] = match.group(2).strip()
            break
    
    # Extract year
    year_match = re.search(r'\b(19|20)\d{2}\b', text)
    if year_match:
        entry["year"] = year_match.group(0)
    
    return entry


def extract_sections(text: str) -> Dict[str, Any]:
    """
    Extract all resume sections from raw text.
    
    Returns dict with keys: summary, experience, education, skills, projects,
    certificates, publications, awards, volunteering, interests, references, languages
    """
    if not text or not isinstance(text, str):
        return {}
    
    # Find all section headers and their positions
    matches = list(SECTION_PATTERN.finditer(text))
    
    if not matches:
        # No headers found, return empty (will use existing flow)
        return {}
    
    sections = {}
    
    for i, match in enumerate(matches):
        header = match.group(1)
        section_name = normalize_header(header)
        start = match.end()
        
        # End is either the start of next section or end of text
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(text)
        
        content = text[start:end].strip()
        
        # Skip empty content
        if not content:
            continue
        
        # Parse based on section type
        if section_name == "summary":
            # Summary is a single string (take first paragraph)
            sections["summary"] = content.split("\n\n")[0].strip()
            
        elif section_name == "experience":
            items = split_into_list_items(content)
            sections["experience"] = [parse_experience_entry(item) for item in items]
            
        elif section_name == "education":
            items = split_into_list_items(content)
            sections["education"] = [parse_education_entry(item) for item in items]
            
        elif section_name == "skills":
            # Skills are usually comma-separated or bullet list
            if "," in content:
                skills = [s.strip() for s in content.split(",") if s.strip()]
            else:
                skills = split_into_list_items(content)
            sections["skills"] = skills
            
        elif section_name == "languages":
            # Languages are usually comma-separated
            if "," in content:
                langs = [l.strip() for l in content.split(",") if l.strip()]
            else:
                langs = split_into_list_items(content)
            sections["languages"] = langs
            
        elif section_name in ["projects", "certificates", "publications", "awards", "volunteering", "interests", "references"]:
            items = split_into_list_items(content)
            sections[section_name] = items
    
    return sections
