"""
Data Loader Service
This service loads all the JSON files (skills, action verbs, companies, etc.)
and makes them available to the AI for resume generation.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

# Get the path to the data directory
# __file__ is this current file, we go up to app/, then into data/
DATA_DIR = Path(__file__).parent.parent / "data"


class DataLoader:
    """Loads and caches JSON data files for resume generation"""
    
    def __init__(self):
        self._cache = {}  # Cache loaded data so we don't read files repeatedly
        self._load_all_data()
    
    def _load_json_file(self, filename: str) -> Dict[str, Any]:
        """
        Load a single JSON file from the data directory
        
        Args:
            filename: Name of the JSON file (e.g., "skills.json")
            
        Returns:
            Dictionary containing the JSON data
        """
        file_path = DATA_DIR / filename
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"✓ Loaded {filename}")
                return data
        except FileNotFoundError:
            logger.error(f"✗ File not found: {file_path}")
            return {}
        except json.JSONDecodeError as e:
            logger.error(f"✗ Invalid JSON in {filename}: {e}")
            return {}
        except Exception as e:
            logger.error(f"✗ Error loading {filename}: {e}")
            return {}
    
    def _load_all_data(self):
        """Load all JSON data files into the cache"""
        logger.info("Loading resume data files...")
        
        self._cache['skills'] = self._load_json_file('skills.json')
        self._cache['action_verbs'] = self._load_json_file('action_verbs.json')
        self._cache['companies'] = self._load_json_file('companies.json')
        self._cache['role_keywords'] = self._load_json_file('role_keywords.json')
        
        logger.info(f"✓ Loaded {len(self._cache)} data files")
    
    def get_skills(self) -> Dict[str, Any]:
        """Get all available skills (technical, soft skills, certifications)"""
        return self._cache.get('skills', {})
    
    def get_action_verbs(self) -> Dict[str, list]:
        """Get action verbs categorized by type (leadership, technical, etc.)"""
        return self._cache.get('action_verbs', {})
    
    def get_companies(self) -> Dict[str, Any]:
        """Get company information"""
        return self._cache.get('companies', {})
    
    def get_role_keywords(self) -> Dict[str, Any]:
        """Get role-specific keywords"""
        return self._cache.get('role_keywords', {})
    
    def get_all_data(self) -> Dict[str, Any]:
        """Get all loaded data as a single dictionary"""
        return self._cache
    
    def get_context_for_ai(self) -> str:
        """
        Format all data as a text context that can be sent to the AI.
        This helps the AI understand what skills, verbs, and companies are available.
        
        Returns:
            Formatted string with all available data
        """
        context_parts = []
        
        # Add skills
        skills = self.get_skills()
        if skills:
            context_parts.append("=== AVAILABLE SKILLS ===")
            
            # Technical skills
            if 'technical' in skills:
                context_parts.append("\nTechnical Skills:")
                for category, items in skills['technical'].items():
                    context_parts.append(f"  - {category}: {', '.join(items[:10])}")  # Limit to first 10
            
            # Soft skills
            if 'soft_skills' in skills:
                context_parts.append(f"\nSoft Skills: {', '.join(skills['soft_skills'][:15])}")
            
            # Certifications
            if 'certifications' in skills:
                context_parts.append(f"\nCertifications: {', '.join(skills['certifications'][:10])}")
        
        # Add action verbs
        action_verbs = self.get_action_verbs()
        if action_verbs:
            context_parts.append("\n\n=== ACTION VERBS BY CATEGORY ===")
            for category, verbs in action_verbs.items():
                context_parts.append(f"{category.upper()}: {', '.join(verbs[:10])}")
        
        return "\n".join(context_parts)


# Create a singleton instance
_data_loader_instance = None

def get_data_loader() -> DataLoader:
    """
    Get the singleton DataLoader instance.
    This ensures we only load the data files once.
    """
    global _data_loader_instance
    if _data_loader_instance is None:
        _data_loader_instance = DataLoader()
    return _data_loader_instance


# For easy testing
if __name__ == "__main__":
    # Test the data loader
    loader = get_data_loader()
    
    print("\n" + "=" * 60)
    print("DATA LOADER TEST")
    print("=" * 60)
    
    # Test each data source
    skills = loader.get_skills()
    print(f"\n✓ Skills loaded: {len(skills)} categories")
    
    action_verbs = loader.get_action_verbs()
    print(f"✓ Action verbs loaded: {len(action_verbs)} categories")
    
    companies = loader.get_companies()
    print(f"✓ Companies loaded: {len(companies)} items")
    
    role_keywords = loader.get_role_keywords()
    print(f"✓ Role keywords loaded: {len(role_keywords)} items")
    
    print("\n" + "=" * 60)
    print("Sample Context for AI:")
    print("=" * 60)
    print(loader.get_context_for_ai()[:500] + "...")  # Print first 500 chars
