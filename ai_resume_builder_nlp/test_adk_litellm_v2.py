import os
import sys

# Set dummy Google Key to bypass potential import-time checks
os.environ["GOOGLE_API_KEY"] = "dummy_key_to_bypass_init_check"
# Set env vars for Vercel Gateway
os.environ["OPENAI_API_BASE"] = "https://ai-gateway.vercel.sh/v1"
if os.getenv("AI_GATEWAY_API_KEY"):
    os.environ["OPENAI_API_KEY"] = os.getenv("AI_GATEWAY_API_KEY")

print("Env vars set (including dummy GOOGLE_API_KEY). Attempting imports...")

try:
    from google.adk.agents import Agent
    print("Agent imported.")
    from google.adk.models.lite_llm import LiteLlm
    print("LiteLlm imported.")
    
    print("Initializing Agent...")
    mistral_agent = Agent(
        name="mistral_agent",
        model=LiteLlm(model="openai/mistral/devstral-2"), 
        description="A Mistral-powered agent",
    )
    print("Agent initialized system successfully via LiteLLM!")

except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
