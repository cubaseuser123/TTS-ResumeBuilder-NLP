import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

print("Attempting to import enhancement_agent...")
try:
    from app.agents.enhancer_agent.agent import enhancement_agent
    print("Import SUCCESS")
except Exception as e:
    print(f"Import FAILED: {e}")
    import traceback
    traceback.print_exc()
