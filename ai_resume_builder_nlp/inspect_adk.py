import google.adk
import pkgutil
import sys

print(f"Google ADK Location: {google.adk.__path__}")

def list_submodules(package):
    if hasattr(package, "__path__"):
        for importer, modname, ispkg in pkgutil.iter_modules(package.__path__):
            print(f"Found submodule: {modname}")

print("\nScanning google.adk submodules:")
list_submodules(google.adk)

try:
    from google.adk.models import lite_llm
    print("\nSUCCESS: google.adk.models.lite_llm found!")
except ImportError as e:
    print(f"\nFAILED to import google.adk.models.lite_llm: {e}")

try:
    from google.adk.agents import Agent
    print("SUCCESS: google.adk.agents.Agent found!")
except ImportError as e:
    print(f"FAILED to import google.adk.agents.Agent: {e}")
