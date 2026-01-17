# Quick test to verify section mapping is deterministic
import sys
import os
import json
import asyncio
from pathlib import Path

# Add project root to sys.path
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent
sys.path.append(str(project_root))

from app.pipeline_runner import pipeline

# Sample resume with distinct content for each section
SAMPLE_RESUME = """
John Smith
Senior Software Engineer
Email: john.smith@example.com
Phone: +1-555-0123
Location: San Francisco, CA

Summary:
Experienced software engineer with 8+ years of expertise in full-stack development.

Experience:
Software Engineer at Google (2020-2024)
- Led development of cloud infrastructure tools
- Improved system performance by 40%
- Managed team of 5 engineers

Junior Developer at Microsoft (2018-2020)
- Developed web applications using React and Node.js
- Reduced load times by 30%

Education:
BS Computer Science, MIT, 2018
MS Software Engineering, Stanford, 2020

Skills:
Python, JavaScript, React, Node.js, Docker, Kubernetes, AWS, TypeScript

Projects:
Open Source Contribution to Kubernetes
Personal blog engine built with Next.js
"""

async def test_section_mapping():
    print("=" * 70)
    print("🧪 TESTING DETERMINISTIC SECTION MAPPING")
    print("=" * 70)
    
    state = {"raw_text": SAMPLE_RESUME, "test_mode": True}
    
    print("\n⏳ Running pipeline...")
    result = await pipeline.run_async(state)
    
    print("\n" + "=" * 70)
    print("📋 FINAL RESUME OUTPUT")
    print("=" * 70)
    
    if "final_resume" in result:
        final = result["final_resume"]
        
        print("\n🔵 PROFILE:")
        print(json.dumps(final.get("profile", {}), indent=2))
        
        print("\n🟢 SUMMARY:")
        print(f"  '{final.get('summary', '')}'")
        
        print("\n🟡 EXPERIENCE:")
        exp = final.get("experience", [])
        if isinstance(exp, list):
            for i, e in enumerate(exp, 1):
                print(f"  Entry {i}:")
                print(f"    Role: {e.get('role', 'N/A') if isinstance(e, dict) else e}")
                print(f"    Company: {e.get('company', 'N/A') if isinstance(e, dict) else 'N/A'}")
        else:
            print(f"  [ERROR] Experience is not a list: {type(exp)}")
            print(f"  Content: {exp[:200]}..." if isinstance(exp, str) and len(exp) > 200 else exp)
        
        print("\n🟠 EDUCATION:")
        edu = final.get("education", [])
        if isinstance(edu, list):
            for i, e in enumerate(edu, 1):
                print(f"  Entry {i}: {e}")
        else:
            print(f"  [ERROR] Education is not a list: {type(edu)}")
            print(f"  Content: {edu[:200]}..." if isinstance(edu, str) and len(edu) > 200 else edu)
        
        print("\n🔴 SKILLS:")
        print(f"  {final.get('skills', [])}")
        
        # DUPLICATION CHECK
        print("\n" + "=" * 70)
        print("🔍 DUPLICATION CHECK")
        print("=" * 70)
        
        summary = str(final.get("summary", "")).lower()
        experience = str(final.get("experience", "")).lower()
        education = str(final.get("education", "")).lower()
        
        if summary and (summary in experience or summary in education):
            print("❌ FAILED: Summary text duplicated in experience or education!")
        elif experience and experience in summary:
            print("❌ FAILED: Experience text duplicated in summary!")
        elif education and education in summary:
            print("❌ FAILED: Education text duplicated in summary!")
        else:
            print("✅ PASSED: No obvious duplication detected!")
    
    else:
        print("⚠️ No final_resume in result")
        print(f"Result keys: {list(result.keys())}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_section_mapping())
