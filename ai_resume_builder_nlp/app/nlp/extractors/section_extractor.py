"""
Section Extractor - Parses labeled sections from resume raw_text

This module extracts structured section content from free-form resume text.
It looks for section headers (e.g., "Experience:", "Education:") and extracts
the content between them.

Uses existing JSON-backed extractors for entity/skill/metric extraction.
"""

import re
from typing import Dict, List, Any

# Import existing JSON-backed extractors
from app.nlp.extractors.entity_extractor import extract_company, extract_role
from app.nlp.extractors.skill_matcher import extract_skills
from app.nlp.extractors.pattern_matcher import extract_metrics


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

# Common degree patterns for education parsing
DEGREE_PATTERNS = [
    r"\b(Ph\.?D\.?|Doctor(?:ate)?)\b",
    r"\b(M\.?S\.?|M\.?Sc\.?|Master(?:'?s)?(?:\s+of\s+\w+)?)\b",
    r"\b(B\.?S\.?|B\.?Sc\.?|B\.?A\.?|B\.?Tech\.?|Bachelor(?:'?s)?(?:\s+of\s+\w+)?)\b",
    r"\b(MBA|M\.?B\.?A\.?)\b",
    r"\b(Associate(?:'?s)?(?:\s+Degree)?)\b",
    r"\b(Diploma|Certificate)\b",
]
DEGREE_REGEX = re.compile("|".join(DEGREE_PATTERNS), re.IGNORECASE)

# Year extraction pattern
YEAR_REGEX = re.compile(r'\b(19|20)\d{2}\b')


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


def extract_degree(text: str) -> str:
    """
    Extract degree from education text using pattern matching.
    Tries to capture the full degree including field of study.
    """
    # First try to extract full degree with field of study
    # Pattern: "Bachelor's degree in Information Technology" (stops before "from/at" or institution name)
    full_degree_patterns = [
        # "Bachelor's degree in Information Technology" - stops at "from/at" or end
        r"((?:Bachelor'?s?|Master'?s?|Ph\.?D\.?|Doctor(?:ate)?|Associate'?s?|MBA|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|B\.?Tech\.?|M\.?Tech\.?)(?:\s+degree)?(?:\s+in\s+[A-Za-z\s&]+?)?)(?:\s+(?:from|at)\s+|\s+[A-Z][a-z]+\s+(?:University|College|Institute)|$)",
    ]
    
    for pattern in full_degree_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            degree = match.group(1).strip()
            # Clean up trailing prepositions/articles
            degree = re.sub(r'\s+(from|at)\s*$', '', degree, flags=re.IGNORECASE)
            if len(degree) > 3:
                return degree
    
    # Try simpler pattern: "Degree in Field"
    simple_pattern = r"((?:Bachelor'?s?|Master'?s?|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|B\.?Tech\.?|M\.?Tech\.?)(?:'?s)?(?:\s+degree)?(?:\s+in\s+[A-Za-z\s&]+)?)"
    match = re.search(simple_pattern, text, re.IGNORECASE)
    if match:
        degree = match.group(1).strip()
        # Stop at "from" or "at" or institution names
        degree = re.split(r'\s+(?:from|at)\s+', degree, flags=re.IGNORECASE)[0].strip()
        if len(degree) > 3:
            return degree
    
    # Fallback to just degree type
    match = DEGREE_REGEX.search(text)
    if match:
        return match.group(0).strip()
    return ""


def extract_institution(text: str) -> str:
    """
    Extract institution from education text.
    Uses the company extractor (universities share similar name patterns with companies)
    and additional education-specific patterns.
    """
    # Try using company extractor first (works for known institutions in DB)
    institution = extract_company(text)
    if institution:
        return institution
    
    # Fallback: Look for common institution patterns
    patterns = [
        r"(?:from|at|@)\s+([A-Z][A-Za-z\s&]+(?:University|College|Institute|School|Academy))",
        r"([A-Z][A-Za-z\s&]+(?:University|College|Institute|School|Academy))",
        r"(?:from|at|@)\s+([A-Z][A-Za-z\s]+)\b",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            inst = match.group(1).strip()
            if len(inst) > 2:
                return inst
    
    return ""


def extract_year(text: str) -> str:
    """Extract year from text."""
    match = YEAR_REGEX.search(text)
    return match.group(0) if match else ""


def parse_experience_entry(text: str) -> Dict[str, Any]:
    """
    Parse an experience entry into structured format.
    Uses JSON-backed extractors for company and metrics, with fallback patterns.
    """
    entry = {
        "role": "",
        "company": "",
        "description": text,
        "achievements": []
    }
    
    # Use JSON-backed company extractor first
    company = extract_company(text)
    if company:
        entry["company"] = company
    
    # Use JSON-backed role extractor first
    role = extract_role(text)
    if role:
        entry["role"] = role
    
    # Fallback: Extract role and company using patterns if not found via JSON
    if not entry["role"] or not entry["company"]:
        # Pattern: "Role at Company (Date)"
        role_at_company = re.search(
            r"^([A-Za-z\s]+?)\s+at\s+([A-Za-z0-9\s&.,]+?)(?:\s*\(|\s*,|\s*-|\s*$)",
            text, re.IGNORECASE
        )
        if role_at_company:
            if not entry["role"]:
                entry["role"] = role_at_company.group(1).strip()
            if not entry["company"]:
                entry["company"] = role_at_company.group(2).strip()
        
        # Pattern: "Company - Role" or "Company | Role"
        if not entry["company"] or not entry["role"]:
            company_role = re.search(
                r"^([A-Za-z0-9\s&.,]+?)\s*[-|]\s*([A-Za-z\s]+?)(?:\s*\(|\s*,|\s*$)",
                text, re.IGNORECASE
            )
            if company_role:
                if not entry["company"]:
                    entry["company"] = company_role.group(1).strip()
                if not entry["role"]:
                    entry["role"] = company_role.group(2).strip()
    
    # If still no role, try extracting common role titles
    if not entry["role"]:
        patterns = [
            r"\b([A-Za-z\s]*(?:Engineer|Developer|Manager|Lead|Analyst|Designer|Architect|Director|Specialist|Consultant|Coordinator|Intern|Associate))\b",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                entry["role"] = match.group(1).strip()
                break
    
    # Use JSON-backed metrics extractor for achievements
    metrics = extract_metrics(text)
    if metrics:
        entry["achievements"] = metrics
    
    return entry


def parse_education_entry(text: str) -> Dict[str, Any]:
    """
    Parse an education entry into structured format.
    Uses pattern-based degree extraction and institution detection.
    """
    entry = {
        "degree": "",
        "institution": "",
        "year": "",
        "summary": text
    }
    
    # Extract degree using pattern matching
    entry["degree"] = extract_degree(text)
    
    # Extract institution (tries company DB first, then patterns)
    entry["institution"] = extract_institution(text)
    
    # Extract year
    entry["year"] = extract_year(text)
    
    return entry


def extract_sections(text: str) -> Dict[str, Any]:
    """
    Extract all resume sections from raw text.
    
    Returns dict with keys: summary, experience, education, skills, projects,
    certificates, publications, awards, volunteering, interests, references, languages
    
    Uses JSON-backed extractors for entity/skill/metric extraction.
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
            # Use JSON-backed skill matcher for proper skill extraction
            skills_from_db = extract_skills(content)
            if skills_from_db:
                sections["skills"] = skills_from_db
            else:
                # Fallback to simple parsing if no DB matches
                if "," in content:
                    skills = [s.strip() for s in content.split(",") if s.strip()]
                else:
                    skills = split_into_list_items(content)
                sections["skills"] = skills
            
        elif section_name == "languages":
            # Languages are usually comma-separated, clean up "and" from items
            if "," in content:
                langs = []
                for l in content.split(","):
                    cleaned = l.strip().rstrip(".")
                    # Remove leading "and " from items like "and Marathi"
                    if cleaned.lower().startswith("and "):
                        cleaned = cleaned[4:].strip()
                    if cleaned:
                        langs.append(cleaned)
            else:
                langs = [l.rstrip(".") for l in split_into_list_items(content)]
            sections["languages"] = langs
            
        elif section_name in ["projects", "certificates", "publications", "awards", "volunteering", "interests", "references"]:
            items = split_into_list_items(content)
            sections[section_name] = items
    
    return sections
