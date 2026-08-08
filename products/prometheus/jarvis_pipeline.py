"""
============================================================
OPS Prometheus — Jarvis Pipeline Module
============================================================
Copyright (c) 2026 V.T. Owens / OPS Studios. All Rights Reserved.
Proprietary and confidential. See LICENSE for terms.
============================================================

Enhanced Observe → Process → Systemize pipeline.
Upgraded from standalone Jarvis to read 5-layer engineered
briefs from the Brief Builder — producing higher-quality,
more consistent outputs than a plain prompt can deliver.
"""

import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# ── Agent system prompts ──────────────────────────────────────────────────────

OBSERVE_SYSTEM = """You are the OBSERVE agent in the OPS Prometheus pipeline.

You receive a professionally engineered 5-layer prompt brief — not a vague request.
This brief was built by a context engineering system with five explicit layers:
Identity, World, Task, Example, and Constraint.

Your job: extract and structure everything so PROCESS can build an optimal strategy.

Deliver:
1. ROLE DEFINED — the exact identity and expertise specified in the Identity layer
2. AUDIENCE & CONTEXT — who this is for and the full situational background from World
3. DELIVERABLE — the specific output required (format, length, scope) from Task
4. QUALITY BAR — what the good example demonstrates and what the bad example forbids
5. HARD CONSTRAINTS — every non-negotiable rule from the Constraint layer
6. SUCCESS CRITERIA — what makes this output excellent, derived from all 5 layers combined

Be thorough. The PROCESS agent builds strategy entirely from your output.
Surface every detail. Miss nothing."""

PROCESS_SYSTEM = """You are the PROCESS agent in the OPS Prometheus pipeline.

You receive a structured analysis from the OBSERVE agent — built from a
professionally engineered 5-layer prompt brief.

Your job: build the optimal execution strategy for this deliverable.

Deliver:
1. APPROACH — the single best structural strategy (be decisive, no hedging)
2. FRAMEWORK — the specific format and structure to use
3. KEY MOVES — 3-5 specific decisions that will make this output exceptional
4. ANTI-PATTERNS — the exact mistakes the Example layer flagged, plus others to avoid
5. EXECUTION NOTES — precise guidance for SYSTEMIZE: tone, voice, pacing, emphasis

Do not hedge. Make every decision. SYSTEMIZE executes this exactly as written."""

SYSTEMIZE_SYSTEM = """You are the SYSTEMIZE agent in the OPS Prometheus pipeline.

You receive an execution strategy from PROCESS — built on a professionally
engineered 5-layer brief. Every constraint, quality bar, and audience
consideration has already been defined for you.

Your job: execute the strategy and deliver the final output.

Rules:
- Produce the complete final content — not an outline, not a draft, not a skeleton
- Follow the Identity layer voice exactly
- Honor the Constraint layer without exception — word limits, format rules, never-do items
- Match the quality bar from the Example layer — hit the good, avoid the bad
- Do not introduce yourself, explain your approach, or add meta-commentary
- Begin the output immediately — the first word is the first word of the deliverable
- Every line earns its place — zero filler, zero hedging, zero throat-clearing
- The output must be immediately deployable with zero editing required"""


def get_client() -> Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in .env file")
    return Anthropic(api_key=api_key)


def call_agent(system: str, user_input: str, max_tokens: int = 2048) -> str:
    client = get_client()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_input}]
    )
    return message.content[0].text


def observe(brief_input: str) -> str:
    """
    OBSERVE Agent — reads the engineered 5-layer brief and
    extracts all structured information for the PROCESS agent.
    """
    return call_agent(OBSERVE_SYSTEM, brief_input)


def process(observation: str) -> str:
    """
    PROCESS Agent — builds execution strategy from
    the OBSERVE analysis.
    """
    return call_agent(PROCESS_SYSTEM, observation)


def systemize(strategy: str, constraint_layer: str = "", example_layer: str = "") -> str:
    """
    SYSTEMIZE Agent — executes the strategy and delivers
    the final production-ready output.
    """
    user_input = f"Strategy:\n{strategy}"
    if constraint_layer:
        user_input += f"\n\nOriginal Constraint layer (enforce these exactly):\n{constraint_layer}"
    if example_layer:
        user_input += f"\n\nOriginal Example layer (quality bar to match and bad patterns to avoid):\n{example_layer}"
    return call_agent(SYSTEMIZE_SYSTEM, user_input)


def run_prometheus(brief: dict, one_liner: str) -> dict:
    """
    Full OPS Prometheus pipeline:
    Observe → Process → Systemize

    Takes the complete 5-layer brief dict from brief_builder.build_brief()
    and runs it through all three Jarvis agents.

    Returns a dict with all three agent outputs plus the final result.
    """
    # Build the full brief context for OBSERVE
    brief_context = (
        f"ENGINEERED PROMPT BRIEF:\n\n"
        f"IDENTITY: {brief['layers']['identity']}\n\n"
        f"WORLD: {brief['layers']['world']}\n\n"
        f"TASK: {brief['layers']['task']}\n\n"
        f"EXAMPLE: {brief['layers']['example']}\n\n"
        f"CONSTRAINT: {brief['layers']['constraint']}\n\n"
        f"ASSEMBLED FINAL PROMPT:\n{brief.get('final_prompt', '')}\n\n"
        f"ORIGINAL ONE-LINER: \"{one_liner}\""
    )

    observation  = observe(brief_context)
    strategy     = process(observation)
    final_output = systemize(
        strategy,
        constraint_layer=brief['layers']['constraint'],
        example_layer=brief['layers']['example']
    )

    return {
        "observation":  observation,
        "strategy":     strategy,
        "final_output": final_output,
    }
