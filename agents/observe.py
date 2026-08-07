from utils.anthropic_client import call_claude

def observe(user_input: str) -> str:
    system = """You are the OBSERVE agent in the OPS Jarvis system.
Your job is to deeply analyze the user's input and extract:
- Core intent
- Key entities and context
- What success looks like
Be thorough. Your output feeds the next agent."""

    print("[OBSERVE] Analyzing input...")
    result = call_claude(system, user_input)
    print(f"[OBSERVE] Complete.\n")
    return result
