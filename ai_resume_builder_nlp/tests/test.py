# to start a uvicorn server : uv run python -m uvicorn app.main:app --reload

import sys
import os
import json
import asyncio
from pathlib import Path

# Add project root to sys.path to ensure app modules can be imported
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent
sys.path.append(str(project_root))

from app.pipeline_runner import pipeline

# Sample resume with minimal data to trigger QA failures:
# - Only 1 skill (needs 3+ to pass)
# - No measurable metrics
SAMPLE_RESUME_TEXT = """
John Doe
Software Engineer
Email: john.doe@example.com
Phone: 123-456-7890

Experience:
Developer at TechCorp (2020-Present)
- Worked on various projects
- Collaborated with team members

Education:
BS Computer Science, University of Technology

Skills:
- Python
"""

async def run_test():
    print("=" * 60)
    print("🚀 STARTING PIPELINE TEST")
    print("=" * 60)
    
    print(f"\n📄 Input Resume Text:\n{'-' * 20}\n{SAMPLE_RESUME_TEXT.strip()}\n{'-' * 20}\n")
    
    # Initial state
    state = {
        "raw_text": SAMPLE_RESUME_TEXT,
        "test_mode": True
    }
    
    print("⏳ Running pipeline.run_async(state)...")
            
    try:
        result = await pipeline.run_async(state)
        
        print("\n✅ Pipeline Execution Completed")
        print("=" * 60)
        
        # Display key results
        print("\n📊 RESULT SUMMARY:")
        print(f"Status: {result.get('status', 'Unknown')}")
        
        if result.get("needs_more_information"):
            print("\n❓ Clarification Needed:")
            questions = result.get("questions", [])
            for i, q in enumerate(questions, 1):
                print(f"  {i}. {q}")
                
        elif result.get("qa_passed") is False:
            print("\n❌ QA Failed:")
            issues = result.get("issues", [])
            for issue in issues:
                print(f"  - {issue}")
                
        elif "final_resume" in result:
            print("\n✨ Generated Resume Structure:")
            print(json.dumps(result["final_resume"], indent=2, default=str))

        if result.get("error"):
            print("\n⛔ Pipeline Stopped with Error:")
            print(f"  Stage: {result.get('failed_stage')}")
            print(f"  Error: {result.get('error')}")
            
        # Helper to print full state for debugging (optional, can be verbose)
        # print("\n🔍 Full State Keys:", list(result.keys()))

    except Exception as e:
        print(f"\n❌ Error during execution: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_test())