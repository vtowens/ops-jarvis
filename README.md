# OPS Jarvis - Multi-Agent AI System

A three-phase agentic AI system built on the Anthropic API.

## What It Does

Runs any problem through three specialized AI agents:

- OBSERVE - Analyzes input, extracts intent and success criteria
- PROCESS - Builds strategy with action steps and flags risks
- SYSTEMIZE - Converts strategy into a repeatable actionable system

## Tech Stack

- Python 3.14
- Anthropic API (claude-sonnet-4-6)
- python-dotenv

## Setup

1. Clone the repo
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. Add ANTHROPIC_API_KEY to .env file

## Run

python main.py

## About

Built by V.T. Owens - Senior Software Engineer and AI Systems Developer.
OPS = Observe - Process - Systemize
Contact: vtowens@gmail.com
