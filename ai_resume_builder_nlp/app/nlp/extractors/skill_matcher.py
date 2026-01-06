"""
Skill Matcher - Advanced skill matching with fuzzy matching
"""
import json
from pathlib import Path
from typing import List
import re


class SkillMatcher:
    def __init__(self):
        """Initialize with skills database"""
        data_dir = Path(__file__).parent.parent.parent / "data"
        
        with open(data_dir / "skills.json") as f:
            self.skills_data = json.load(f)
        
        # Flatten all skills into one list
        self.all_skills = []
        for category in self.skills_data['technical'].values():
            self.all_skills.extend(category)
        self.all_skills.extend(self.skills_data['soft_skills'])
        
        # Create lowercase mapping
        self.skill_map = {skill.lower(): skill for skill in self.all_skills}
    
    def match_skills(self, text: str) -> List[str]:
        """Match skills from text"""
        found_skills = set()
        text_lower = text.lower()
        
        # Exact matching
        for skill_lower, skill_original in self.skill_map.items():
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill_original)
        
        # Handle common variations
        variations = {
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'nodejs': 'Node.js',
            'nextjs': 'Next.js',
            'vuejs': 'Vue.js',
            'reactjs': 'React',
            'ml': 'Machine Learning',
            'ai': 'Machine Learning',
            'nlp': 'Natural Language Processing',
            'cv': 'Computer Vision',
        }
        
        for variant, official in variations.items():
            if variant in text_lower:
                found_skills.add(official)
        
        return sorted(list(found_skills))
    
    def categorize_skills(self, skills: List[str]) -> dict:
        """Categorize skills into technical and soft skills"""
        categorized = {
            'technical': [],
            'soft': []
        }
        
        # Check against soft skills
        soft_skills_lower = [s.lower() for s in self.skills_data['soft_skills']]
        
        for skill in skills:
            if skill.lower() in soft_skills_lower:
                categorized['soft'].append(skill)
            else:
                categorized['technical'].append(skill)
        
        return categorized