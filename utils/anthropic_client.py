import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

def get_client():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in .env file")
    return Anthropic(api_key=api_key)

def call_claude(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    client = get_client()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )
    return message.content[0].text
