"""
============================================================
OPS Prometheus — Brief Builder Module
============================================================
Copyright (c) 2026 V.T. Owens / OPS Studios. All Rights Reserved.
Proprietary and confidential. See LICENSE for terms.
============================================================

5-Layer Context Engineering system.
Takes a rough one-liner and engineers a complete,
production-ready structured prompt brief.

Layers:
  1. Identity   — Who is the AI acting as?
  2. World      — What context does it need?
  3. Task       — What exactly must happen?
  4. Example    — What does great (and bad) look like?
  5. Constraint — What are the non-negotiables?
"""

import json
import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# ── Layer definitions ─────────────────────────────────────────────────────────
LAYERS = [
    {
        "id":          "identity",
        "label":       "01 · Identity",
        "question":    "Who is the AI acting as?",
        "hint":        "Role, expertise level, personality, perspective",
        "placeholder": "e.g. You are a senior copywriter with 15 years of direct-response experience...",
    },
    {
        "id":          "world",
        "label":       "02 · World",
        "question":    "What context does it need?",
        "hint":        "Audience, business context, background, what's been tried",
        "placeholder": "e.g. My audience are indie founders who use AI tools but don't use them consistently...",
    },
    {
        "id":          "task",
        "label":       "03 · Task",
        "question":    "What exactly needs to happen?",
        "hint":        "The specific action, deliverable, format, and scope",
        "placeholder": "e.g. Write a 200-word email inviting them to a free live workshop...",
    },
    {
        "id":          "example",
        "label":       "04 · Example",
        "question":    "What does great — and bad — look like?",
        "hint":        "A good example AND a bad example. The bad example does most of the work.",
        "placeholder": "Good: feels like a friend texting something useful. Bad: event-poster energy, words like 'unlock' or 'transform'...",
    },
    {
        "id":          "constraint",
        "label":       "05 · Constraint",
        "question":    "What are the non-negotiables?",
        "hint":        "Word limits, format rules, things to never do, style rules",
        "placeholder": "e.g. Under 200 words. No bullet points. No emojis. Subject line under 10 words...",
    },
]

# ── System prompt ─────────────────────────────────────────────────────────────
BRIEF_SYSTEM = """You are an expert context engineer and prompt architect.
Your job: take a rough one-liner and build a complete, production-ready 5-layer prompt brief.

The 5 layers:
1. IDENTITY — Who is the AI acting as? (role, expertise, personality) — write in second person "You are..."
2. WORLD — What context does it need? (audience, background, situation) — direct instructions
3. TASK — What exactly must happen? (action, deliverable, format, scope)
4. EXAMPLE — What does great look like AND what does bad look like?
   The bad example is more important — name the exact mistakes to avoid, specifically.
5. CONSTRAINT — Non-negotiables. Make them measurable (under 200 words, not "keep it short").

Rules:
- Be specific and concrete. Generic advice produces generic output.
- Bad examples must be vivid and name exact wrong approaches.
- After all 5 layers, assemble them into a FINAL PROMPT ready to use directly.

Return ONLY this exact JSON structure — no markdown fences, no preamble:
{
  "analysis": "One sentence on what this task really is and why it needs all 5 layers",
  "layers": {
    "identity": "...",
    "world": "...",
    "task": "...",
    "example": "...",
    "constraint": "..."
  },
  "final_prompt": "The complete assembled prompt — flows naturally, ready to use",
  "missing_info": ["things that would make this prompt even stronger"],
  "model_recommendation": {
    "model": "Haiku / Sonnet / Opus",
    "effort": "Low / Normal / High",
    "thinking": true,
    "reason": "one sentence"
  }
}"""

REFINE_SYSTEM = """You are an expert context engineer.
Refine one specific layer of a 5-layer prompt brief based on user feedback.
Return ONLY the improved layer content as plain text. No JSON, no labels, no preamble."""

REBUILD_SYSTEM = """You are an expert context engineer.
Assemble a final copy-paste prompt from 5 given layers.
Return ONLY the assembled prompt as plain text — no JSON, no labels, no preamble.
Keep layers logically ordered but make it read naturally as one document."""


def get_client() -> Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in .env file")
    return Anthropic(api_key=api_key)


def build_brief(one_liner: str, extra_context: str = "") -> dict:
    """
    Takes a rough one-liner and returns a complete 5-layer brief as a dict.
    """
    client = get_client()
    user_msg = f'Here is my rough one-liner:\n\n"{one_liner}"'
    if extra_context.strip():
        user_msg += f"\n\nExtra context:\n{extra_context.strip()}"
    user_msg += "\n\nBuild me a complete 5-layer context engineering brief. Return ONLY valid JSON."

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        system=BRIEF_SYSTEM,
        messages=[{"role": "user", "content": user_msg}]
    )
    raw = response.content[0].text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


def refine_layer(layer_id: str, current_content: str, feedback: str, one_liner: str) -> str:
    """
    Refines a single layer based on user feedback.
    Returns the improved layer content as a string.
    """
    client = get_client()
    user_msg = (
        f'Original task: "{one_liner}"\n\n'
        f"Layer to refine: {layer_id.upper()}\n\n"
        f"Current content:\n{current_content}\n\n"
        f"User feedback:\n{feedback}\n\n"
        f"Rewrite this layer to be stronger based on the feedback."
    )
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=REFINE_SYSTEM,
        messages=[{"role": "user", "content": user_msg}]
    )
    return response.content[0].text.strip()


def rebuild_final_prompt(layers: dict, one_liner: str) -> str:
    """
    Reassembles the final prompt after layer edits.
    Returns the rebuilt prompt as a string.
    """
    client = get_client()
    user_msg = (
        f'Task: "{one_liner}"\n\n'
        f"Layers:\n"
        f"IDENTITY: {layers['identity']}\n"
        f"WORLD: {layers['world']}\n"
        f"TASK: {layers['task']}\n"
        f"EXAMPLE: {layers['example']}\n"
        f"CONSTRAINT: {layers['constraint']}\n\n"
        f"Assemble into a single flowing copy-paste prompt."
    )
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=REBUILD_SYSTEM,
        messages=[{"role": "user", "content": user_msg}]
    )
    return response.content[0].text.strip()
