from utils.anthropic_client import call_claude

def systemize(strategy: str) -> str:
    system = """You are the SYSTEMIZE agent in the OPS Jarvis system.
You receive a strategy from the PROCESS agent.
Your job is to:
- Convert the strategy into a repeatable system
- Define inputs, outputs, and steps clearly
- Produce a final deliverable the user can act on immediately
Output should be clean, structured, and professional."""

    print("[SYSTEMIZE] Building system output...")
    result = call_claude(system, strategy)
    print(f"[SYSTEMIZE] Complete.\n")
    return result
