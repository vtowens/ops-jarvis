from agents.observe import observe
from agents.process import process_input
from agents.systemize import systemize

def run_jarvis(user_input: str):
    print("\n=== OPS JARVIS ACTIVATED ===\n")
    observation = observe(user_input)
    strategy = process_input(observation)
    final_output = systemize(strategy)
    print("=== FINAL OUTPUT ===\n")
    print(final_output)
    return final_output

if __name__ == "__main__":
    user_input = input("What do you need OPS Jarvis to solve? > ")
    run_jarvis(user_input)
