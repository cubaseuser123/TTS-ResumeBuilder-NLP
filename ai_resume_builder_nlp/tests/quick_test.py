"""Quick test to verify extractors are using JSON-backed logic"""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.nlp.extractors.entity_extractor import extract_entities, extract_company, extract_role
from app.nlp.extractors.skill_matcher import extract_skills
from app.nlp.extractors.pattern_matcher import extract_metrics
from app.nlp.extractors.section_extractor import extract_sections

# Test text
TEST_TEXT = """
John Doe
Software Engineer at Google
Email: john.doe@example.com

Experience:
Developer at TechCorp (2020-Present)
- Improved performance by 30%
- Led team of 5 engineers

Education:
BS Computer Science, University of Technology

Skills:
Python, JavaScript, React, Machine Learning, Docker
"""

print("=" * 60)
print("EXTRACTOR TEST")
print("=" * 60)

# Test entity extraction
print("\n[1] Entity Extraction (uses companies.json, role_keywords.json):")
entities = extract_entities(TEST_TEXT)
for key, value in entities.items():
    print(f"  {key}: {value}")

# Test company extraction specifically
print(f"\n[2] Company Extraction (JSON-backed):")
print(f"  extract_company('Developer at Google') = {extract_company('Developer at Google')}")
print(f"  extract_company('Engineer at Microsoft') = {extract_company('Engineer at Microsoft')}")
print(f"  extract_company('Working at TechCorp') = {extract_company('Working at TechCorp')}")

# Test role extraction
print(f"\n[3] Role Extraction (JSON-backed):")
print(f"  extract_role('Software Engineer building...') = {extract_role('Software Engineer building...')}")

# Test skill extraction
print(f"\n[4] Skill Extraction (uses skills.json):")
skills = extract_skills(TEST_TEXT)
print(f"  Found skills: {skills}")

# Test metric extraction
print(f"\n[5] Metric Extraction:")
metrics = extract_metrics(TEST_TEXT)
print(f"  Found metrics: {metrics}")

# Test section extraction
print(f"\n[6] Section Extraction (now uses JSON-backed extractors):")
sections = extract_sections(TEST_TEXT)
for section_name, content in sections.items():
    if isinstance(content, list):
        print(f"  {section_name}: {len(content)} items")
        for i, item in enumerate(content[:2]):  # Show first 2
            if isinstance(item, dict):
                print(f"    [{i}] role={item.get('role', '')}, company={item.get('company', '')}")
            else:
                print(f"    [{i}] {str(item)[:50]}...")
    else:
        print(f"  {section_name}: {str(content)[:50]}...")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
