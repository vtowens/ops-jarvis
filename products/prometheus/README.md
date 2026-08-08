# ⚡ OPS Prometheus
### 5-Stage Self-Hosted AI Pipeline

**Context Engineering Brief Builder + OPS Jarvis Pipeline — combined into one local application.**

> Copyright © 2026 V.T. Owens / OPS Studios. All Rights Reserved.  
> Buyer license: personal use only. Resale and redistribution prohibited.

---

## What It Does

You type one sentence. Five AI stages turn it into production-ready output — running entirely on your machine with your own Anthropic API key. No subscription. No cloud dependency. No data stored anywhere.

```
Stage 1 — Brief Builder:  Engineers a 5-layer prompt structure from your one-liner
Stage 2 — OBSERVE:        Reads all 5 layers and extracts structured intelligence
Stage 3 — PROCESS:        Builds the optimal execution strategy
Stage 4 — SYSTEMIZE:      Executes the strategy and delivers the final output
Stage 5 — Output:         Production-ready. Copy and deploy.
```

## Why It's Different

Every other AI tool hands your request to a single model and gets back a single output. Prometheus engineers your prompt first (5 layers: Identity, World, Task, Example, Constraint) then runs it through three dedicated agents. The result is more consistent, more specific, and more on-brief than any single-call system can produce.

---

## Setup (Under 10 Minutes)

**Requirements:** Python 3.9+ · pip · Anthropic API key

**Step 1 — Clone or unzip**
```bash
cd ops-prometheus
```

**Step 2 — Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
```

**Step 3 — Install dependencies**
```bash
pip install -r requirements.txt
```

**Step 4 — Add your API key**
```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```
Open `.env` and replace `your_anthropic_api_key_here` with your key from [console.anthropic.com](https://console.anthropic.com/settings/keys)

**Step 5 — Run**
```bash
streamlit run app.py
```

Browser opens at `http://localhost:8501` — you are live.

---

## The 5 Layers

| Layer | What It Defines |
|-------|----------------|
| **Identity** | Who the AI is acting as — role, expertise, personality |
| **World** | The context it needs — audience, background, situation |
| **Task** | What exactly must happen — action, format, scope |
| **Example** | What great looks like AND what bad looks like |
| **Constraint** | The non-negotiables — word limits, format rules, never-do items |

---

## File Structure

```
ops-prometheus/
├── app.py              ← Streamlit UI — run this
├── brief_builder.py    ← 5-layer context engineering module
├── jarvis_pipeline.py  ← Observe → Process → Systemize agents
├── requirements.txt
├── .env.example        ← Copy to .env and add your API key
└── README.md
```

---

## Cost Per Run

Each full 5-stage run makes 4 Claude API calls (1 brief + 3 agents).  
At standard Sonnet pricing: approximately **$0.15–0.25 per complete run**.  
No subscription. No platform fees. Pay only for what you use.

---

## License

This software is proprietary. Buyers receive a personal, non-transferable license for their own business use. Resale, redistribution, and sublicensing are prohibited. See LICENSE for full terms.

**OPS Studios** · [vtowensphere.gumroad.com](https://vtowensphere.gumroad.com) · vtowens@gmail.com
