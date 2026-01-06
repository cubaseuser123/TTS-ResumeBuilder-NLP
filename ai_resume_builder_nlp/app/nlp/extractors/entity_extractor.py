"""
Entity Extractor - Extracts structured information from user prompts
"""

import re
import json
from pathlib import Path
from typing import Dict, List, Optional


class EntityExtractor:
    def __init__(self):
        """Initialize with data files"""
        self.data_dir = Path(__file__).parent.parent.parent / "data"
        
        # Load companies data
        with open(self.data_dir / "companies.json") as f:
            companies_data = json.load(f)
            self.companies = self._flatten_companies(companies_data)
        
        # Load skills data
        with open(self.data_dir / "skills.json") as f:
            self.skills_data = json.load(f)
    
    def _flatten_companies(self, companies_data: Dict) -> List[str]:
        """Flatten company names and aliases"""
        companies = []
        for category in companies_data.values():
            for company in category:
                companies.append(company['name'].lower())
                companies.extend([alias.lower() for alias in company.get('aliases', [])])
        return companies
    
    def extract(self, prompt: str) -> Dict:
        """Extract all entities from prompt"""
        return {
            'role': self._extract_role(prompt),
            'years': self._extract_years(prompt),
            'company': self._extract_company(prompt),
            'skills': self._extract_skills(prompt),
            'education': self._extract_education(prompt),
            'level': self._extract_level(prompt),
            'missing': []  # Will be filled by validator
        }
    
    def _extract_role(self, text: str) -> Optional[str]:
        """Extract job role/title"""
        # Common patterns for role extraction
        patterns = [
            r"(?:I'm a|I am a|I work as a?|working as a?)\s+([A-Z][a-zA-Z\s]+?)(?:\s+with|\s+at|,|$)",
            r"(Software Engineer|Data Scientist|Product Manager|Frontend Developer|Backend Developer|Full Stack Developer|DevOps Engineer|ML Engineer|Data Engineer|QA Engineer|Security Engineer)",
            r"(Senior|Junior|Lead|Principal|Staff)\s+(Engineer|Developer|Scientist|Manager)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                role = match.group(1).strip()
                # Clean up common words
                role = re.sub(r'\s+', ' ', role)
                return role.title()
        
        return None
    
    def _extract_years(self, text: str) -> Optional[int]:
        """Extract years of experience"""
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience)?',
            r'(?:experience|worked|working)\s*(?:for|of)?\s*(\d+)\+?\s*(?:years?|yrs?)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_company(self, text: str) -> Optional[str]:
        """Extract company name"""
        text_lower = text.lower()
        
        # Check for exact company matches
        for company in self.companies:
            if company in text_lower:
                # Return properly capitalized version
                pattern = re.compile(re.escape(company), re.IGNORECASE)
                match = pattern.search(text)
                if match:
                    return match.group(0)
        
        # Pattern-based extraction
        patterns = [
            r'(?:at|@|with|from)\s+([A-Z][a-zA-Z\s&\.]+?)(?:\s+as|\s+for|,|$)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                company = match.group(1).strip()
                if len(company) > 2:  # Avoid single letters
                    return company
        
        return None
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills mentioned in text"""
        found_skills = []
        text_lower = text.lower()
        
        # Check technical skills
        for category, skills in self.skills_data['technical'].items():
            for skill in skills:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append(skill)
        
        # Check soft skills
        for skill in self.skills_data['soft_skills']:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    def _extract_education(self, text: str) -> Optional[str]:
        """Extract education information"""
        patterns = [
            r'((?:Bachelor|Master|PhD|BS|MS|MBA|BA|MA)(?:\s+of\s+(?:Science|Arts|Business Administration))?\s+in\s+[A-Za-z\s]+)',
            r'((?:BS|MS|BA|MA|MBA|PhD)\s+[A-Za-z\s]+)',
            r'(?:degree in|graduated in|studied)\s+([A-Za-z\s]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _extract_level(self, text: str) -> Optional[str]:
        """Extract seniority level"""
        text_lower = text.lower()
        
        levels = {
            'junior': ['junior', 'entry level', 'entry-level', 'associate'],
            'mid': ['mid level', 'mid-level', 'intermediate'],
            'senior': ['senior', 'sr', 'sr.'],
            'lead': ['lead', 'principal', 'staff'],
            'manager': ['manager', 'director', 'vp', 'head of']
        }
        
        for level, keywords in levels.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return level
        
        # Infer from years of experience
        years = self._extract_years(text)
        if years:
            if years <= 2:
                return 'junior'
            elif years <= 5:
                return 'mid'
            else:
                return 'senior'
        
        return None