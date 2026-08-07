# OPS Jarvis — Multi-Agent AI System

A three-phase agentic AI system built on the Anthropic API using the OPS framework.

## What It Does

OPS Jarvis takes any complex problem and runs it through three specialized AI agents in sequence:

- **OBSERVE** — Analyzes the input, extracts intent, entities, and success criteria
- **PROCESS** — Builds a strategy with action steps and flags risks
- **SYSTEMIZE** — Converts the strategy into a repeatable, actionable system

## Architecture

\\\
ops-jarvis/
+-- main.py                    # Entry point
+-- agents/
¦   +-- observe.py             # Phase 1: Deep analysis
¦   +-- process.py             # Phase 2: Strategy building
¦   +-- systemize.py           # Phase 3: System output
+-- utils/
    +-- anthropic_client.py    # Anthropic API wrapper
\\\

## Tech Stack

- Python 3.14
- Anthropic API (claude-sonnet-4-6)
- python-dotenv

## Setup

\\\ash
git clone https://github.com/vtowens/ops-jarvis.git
cd ops-jarvis
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
\\\

Add your Anthropic API key to a \.env\ file:
\\\
ANTHROPIC_API_KEY=your-key-here
\\\

## Run

\\\ash
python main.py
\\\

## Example Output

Input: \Help me build a content system for a YouTube channel about AI tools\

OPS Jarvis fires all three agents in sequence and returns a fully structured, actionable system with protocols, frameworks, and step-by-step execution plans.

## About

Built by V.T. Owens — Senior Software Engineer and AI Systems Developer.
OPS = Observe ? Process ? Systemize
