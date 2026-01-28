import sys
import json
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from nlp.enhancers.text_enhancer import enhance_resume_content
from google.adk.agents import LlmAgent
from google.adk.models.lite_llm import LiteLlm
import litellm
import os

# Configure LiteLLM for Vercel AI Gateway
os.environ.setdefault("OPENAI_API_BASE", "https://ai-gateway.vercel.sh/v1")
api_key = os.getenv("AI_GATEWAY_API_KEY")
if api_key:
    os.environ.setdefault("OPENAI_API_KEY", api_key)


def enhance_with_devstral(pre_enhanced_content: dict) -> dict:
    """
    Use Devstral 2 (via Vercel AI Gateway) to further enhance the resume content.
    Takes the pre-enhanced content and polishes it for clarity and impact.
    """
    # Get the final_resume from the pre-enhanced content
    resume = pre_enhanced_content.get("final_resume") or pre_enhanced_content
    
    if not resume or not isinstance(resume, dict):
        return pre_enhanced_content
    
    # Prepare prompt for Devstral
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
        gateway_key = os.getenv("AI_GATEWAY_API_KEY") or os.getenv("OPENAI_API_KEY")
        if not gateway_key:
            print("Devstral enhancement skipped: AI_GATEWAY_API_KEY not set")
            return pre_enhanced_content
        
        # Use LiteLLM to call Devstral 2 via Vercel AI Gateway
        response = litellm.completion(
            model="openai/mistral/devstral-2",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.25,
            max_tokens=4096,  # Ensure complete resume output
            api_base=os.environ.get("OPENAI_API_BASE", "https://ai-gateway.vercel.sh/v1"),
            api_key=gateway_key
        )
        
        # Parse the response
        response_text = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        enhanced_resume = json.loads(response_text.strip())
        print("Devstral enhancement successful!")
        return {"final_resume": enhanced_resume, "devstral_enhanced": True}
        
    except Exception as e:
        # If Devstral fails, return the pre-enhanced content
        print(f"Devstral enhancement failed: {e}")
        return pre_enhanced_content


def enhance_resume(state: dict) -> dict:
    """
    Full enhancement pipeline:
    1. Manual enhancement (weak verbs → strong verbs)
    2. Devstral enhancement (polish for clarity and impact)
    """
    # Step 1: Manual enhancement
    pre_enhanced = enhance_resume_content(state)
    
    # Step 2: Devstral enhancement (skip in test mode to save API calls)
    if state.get("test_mode"):
        # In test mode, skip Devstral to avoid API costs
        return {"pre_enhanced_content": pre_enhanced}
    
    # Call Devstral for further enhancement
    devstral_result = enhance_with_devstral(state)
    
    # Merge results
    result = {
        "pre_enhanced_content": pre_enhanced,
    }
    
    # If Devstral enhanced successfully, update final_resume
    if devstral_result.get("devstral_enhanced"):
        result["final_resume"] = devstral_result["final_resume"]
    
    return result


# Legacy function for backward compatibility with pipeline_runner
def pre_enhance(state: dict) -> dict:
    """Legacy function - now calls the full enhancement pipeline."""
    return enhance_resume(state)


# LlmAgent for root coordinator compatibility - using Devstral 2 via LiteLLM
enhancement_agent = LlmAgent(
    name="enhancement_agent", 
    model=LiteLlm(model="openai/mistral/devstral-2"),
    instruction=load_instructions_file("agents/enhancer_agent/instructions.txt"),
    description=load_instructions_file("agents/enhancer_agent/description.txt"),
    tools=[pre_enhance] 
)
