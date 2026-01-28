import os
import sys

# Set env vars for Vercel Gateway
os.environ["OPENAI_API_BASE"] = "https://ai-gateway.vercel.sh/v1"
# Ensure we have a key (mock it if needed for import test, but utilize real one if present)
if not os.getenv("OPENAI_API_KEY") and os.getenv("AI_GATEWAY_API_KEY"):
    os.environ["OPENAI_API_KEY"] = os.getenv("AI_GATEWAY_API_KEY")

print("Env vars set. Attempting imports...")

try:
    from google.adk.agents import Agent
    print("Agent imported.")
    from google.adk.models.lite_llm import LiteLlm
    print("LiteLlm imported.")
    
    print("Initializing Agent...")
    mistral_agent = Agent(
        name="mistral_agent",
        model=LiteLlm(model="openai/mistral/devstral-2"), # Use openai provider prefix for gateway
        description="A Mistral-powered agent",
    )
    print("Agent initialized successfully via LiteLLM!")

except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
