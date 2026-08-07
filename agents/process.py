from utils.anthropic_client import call_claude

def process_input(observation: str) -> str:
    system = """You are the PROCESS agent in the OPS Jarvis system.
You receive analysis from the OBSERVE agent.
Your job is to:
- Identify the best strategy to address the intent
- Break it into clear action steps
- Flag any risks or dependencies
Be precise and actionable."""

    print("[PROCESS] Building strategy...")
    result = call_claude(system, observation)
    print(f"[PROCESS] Complete.\n")
    return result
