import sys
import json
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from nlp.enhancers.text_enhancer import enhance_resume_content
from google.adk.agents import LlmAgent
from google import genai
from google.genai import types
import os


def enhance_with_gemini(pre_enhanced_content: dict) -> dict:
    """
    Use Gemini to further enhance the resume content.
    Takes the pre-enhanced content and polishes it for clarity and impact.
    """
    # Get the final_resume from the pre-enhanced content
    resume = pre_enhanced_content.get("final_resume") or pre_enhanced_content
    
    if not resume or not isinstance(resume, dict):
        return pre_enhanced_content
    
    # Prepare prompt for Gemini
    prompt = f"""You are enhancing a resume for clarity and impact.

Rules:
- Do NOT invent new skills, companies, roles, or metrics
- Do NOT remove existing information  
- Only improve wording, clarity, and professional impact
- Use existing metrics if present, do not create new ones
- Keep the same JSON structure
- Return valid JSON only

Here is the resume to enhance:
{json.dumps(resume, indent=2)}

Return ONLY the enhanced JSON, no explanations."""

    try:
        # Get API key from environment
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Gemini enhancement skipped: GOOGLE_API_KEY not set")
            return pre_enhanced_content
        
        # Use google.genai with API key
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.25,
            )
        )
        
        # Parse the response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        enhanced_resume = json.loads(response_text.strip())
        print("Gemini enhancement successful!")
        return {"final_resume": enhanced_resume, "gemini_enhanced": True}
        
    except Exception as e:
        # If Gemini fails, return the pre-enhanced content
        print(f"Gemini enhancement failed: {e}")
        return pre_enhanced_content


def enhance_resume(state: dict) -> dict:
    """
    Full enhancement pipeline:
    1. Manual enhancement (weak verbs → strong verbs)
    2. Gemini enhancement (polish for clarity and impact)
    """
    # Step 1: Manual enhancement
    pre_enhanced = enhance_resume_content(state)
    
    # Step 2: Gemini enhancement (skip in test mode to save API calls)
    if state.get("test_mode"):
        # In test mode, skip Gemini to avoid API costs
        return {"pre_enhanced_content": pre_enhanced}
    
    # Call Gemini for further enhancement
    gemini_result = enhance_with_gemini(state)
    
    # Merge results
    result = {
        "pre_enhanced_content": pre_enhanced,
    }
    
    # If Gemini enhanced successfully, update final_resume
    if gemini_result.get("gemini_enhanced"):
        result["final_resume"] = gemini_result["final_resume"]
    
    return result


# Legacy function for backward compatibility with pipeline_runner
def pre_enhance(state: dict) -> dict:
    """Legacy function - now calls the full enhancement pipeline."""
    return enhance_resume(state)


# LlmAgent for root coordinator compatibility
enhancement_agent = LlmAgent(
    name="enhancement_agent", 
    model='gemini-2.0-flash',
    instruction=load_instructions_file("agents/enhancer_agent/instructions.txt"),
    description=load_instructions_file("agents/enhancer_agent/description.txt"),
    generate_content_config=types.GenerateContentConfig(
        temperature=0.25
    ),
    tools=[pre_enhance] 
)
