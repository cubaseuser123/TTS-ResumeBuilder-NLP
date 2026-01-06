
import sys
import os

# Ensure current directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("Attempting to import root_coordinator_agent...")
    from agents.root_coordinator.agent import root_coordinator_agent
    print("Successfully imported root_coordinator_agent!")
    
    print("\nAgent Structure:")
    print(f"Name: {root_coordinator_agent.name}")
    print(f"Sub-agents: {len(root_coordinator_agent.sub_agents)}")
    for i, sub in enumerate(root_coordinator_agent.sub_agents):
        print(f"  {i+1}. {sub.name}")

except ImportError as e:
    print(f"ImportError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"An error occurred: {e}")
    import traceback
    traceback.print_exc()
