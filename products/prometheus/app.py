"""
============================================================
OPS Prometheus — Main Application
============================================================
Copyright (c) 2026 V.T. Owens / OPS Studios. All Rights Reserved.
Proprietary and confidential. See LICENSE for terms.
============================================================

Self-hosted 5-stage AI pipeline.
Context Engineering Brief Builder + OPS Jarvis Pipeline
combined into one local Streamlit application.

Run: streamlit run app.py
============================================================
"""

import streamlit as st
from brief_builder import LAYERS, build_brief, refine_layer, rebuild_final_prompt
from jarvis_pipeline import run_prometheus, observe, process, systemize

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="OPS Prometheus",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ── Brand CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

  html, body, [class*="css"] {
    font-family: 'Inter', system-ui, sans-serif;
  }
  .main { background: #07071a; }
  section[data-testid="stSidebar"] { background: #0a0a1a; }

  .ops-header {
    padding: 0 0 20px;
    border-bottom: 1px solid #1c1c3a;
    margin-bottom: 24px;
  }
  .ops-logo {
    font-size: 11px; font-weight: 800; letter-spacing: 0.2em;
    color: #5533ff; text-transform: uppercase; margin-bottom: 4px;
  }
  .ops-title {
    font-size: 26px; font-weight: 800; color: #ffffff;
    letter-spacing: -0.02em; margin: 0;
  }
  .ops-sub {
    font-size: 13px; color: #6666aa; margin-top: 4px;
  }

  .stage-bar {
    display: flex; align-items: center; gap: 0;
    padding: 14px 0; margin-bottom: 24px;
    border-bottom: 1px solid #1c1c3a;
    overflow-x: auto;
  }
  .stage-node {
    display: flex; flex-direction: column; align-items: center;
    gap: 4px; flex-shrink: 0;
  }
  .stage-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 900;
    border: 2px solid #1c1c3a;
    color: #2a2a4a; background: #0d0d22;
    transition: all 0.3s;
  }
  .stage-dot.active {
    background: #5533ff33; border-color: #5533ff;
    color: #5533ff; box-shadow: 0 0 12px #5533ff44;
  }
  .stage-dot.done {
    background: #00cc6633; border-color: #00cc66;
    color: #00cc66;
  }
  .stage-label {
    font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase; color: #2a2a4a;
  }
  .stage-label.active { color: #5533ff; }
  .stage-label.done   { color: #00cc66; }
  .stage-connector {
    width: 36px; height: 1px;
    background: #1c1c3a; margin: 0 6px;
    margin-bottom: 18px; flex-shrink: 0;
  }
  .stage-connector.done { background: #00cc6666; }

  .layer-card {
    background: #0d0d22; border-radius: 10px;
    padding: 16px; margin-bottom: 10px;
    border-left: 3px solid #5533ff;
  }
  .layer-label {
    font-size: 10px; font-weight: 800; letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .layer-content {
    font-size: 13px; color: #c0c0e0; line-height: 1.75;
    white-space: pre-wrap;
  }

  .agent-panel {
    background: #0d0d22; border-radius: 10px;
    border: 1px solid #1c1c3a; overflow: hidden;
    margin-bottom: 10px;
  }
  .agent-header {
    padding: 10px 16px; display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid #1c1c3a;
  }
  .agent-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #2a2a4a; flex-shrink: 0;
  }
  .agent-label {
    font-size: 10px; font-weight: 800; letter-spacing: 0.15em;
    text-transform: uppercase; color: #6666aa;
  }
  .agent-content {
    padding: 14px 16px;
    font-size: 12px; color: #a0a0c8; line-height: 1.7;
    font-family: 'SF Mono', 'Fira Code', monospace;
    white-space: pre-wrap; word-break: break-word;
    max-height: 280px; overflow-y: auto;
  }

  .final-output-box {
    background: #0a1a0a; border: 1px solid #00cc6644;
    border-radius: 12px; padding: 20px;
    font-size: 14px; color: #e0ffe0; line-height: 1.8;
    white-space: pre-wrap; word-break: break-word;
  }

  .prompt-box {
    background: #0d0d22; border: 1px solid #5533ff44;
    border-radius: 10px; padding: 16px;
    font-size: 13px; color: #c0c0e0; line-height: 1.75;
    white-space: pre-wrap; word-break: break-word;
  }

  .missing-box {
    background: #1a1500; border: 1px solid #ffb80033;
    border-radius: 10px; padding: 14px; margin-top: 12px;
  }

  .badge-green {
    display: inline-block; padding: 2px 10px; border-radius: 20px;
    background: #00cc6622; color: #00cc66;
    font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
  }
  .badge-blue {
    display: inline-block; padding: 2px 10px; border-radius: 20px;
    background: #5533ff22; color: #7755ff;
    font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
  }

  .stButton > button {
    border-radius: 8px; font-weight: 700; font-family: 'Inter', sans-serif;
  }
  div[data-testid="stTextArea"] textarea {
    background: #0d0d22 !important; color: #e0e0ff !important;
    border: 1px solid #1c1c3a !important; border-radius: 8px !important;
    font-family: 'Inter', sans-serif !important;
  }
  div[data-testid="stTextInput"] input {
    background: #0d0d22 !important; color: #e0e0ff !important;
    border: 1px solid #1c1c3a !important; border-radius: 8px !important;
  }
</style>
""", unsafe_allow_html=True)

# ── Layer colors ──────────────────────────────────────────────────────────────
LAYER_COLORS = {
    "identity":   "#00d4ff",
    "world":      "#e91e8c",
    "task":       "#5533ff",
    "example":    "#ff6b35",
    "constraint": "#ffb800",
}
AGENT_COLORS = {
    "observe":   "#4488ff",
    "process":   "#aa44ff",
    "systemize": "#00cc66",
}

# ── Session state init ────────────────────────────────────────────────────────
defaults = {
    "phase":        "input",       # input | brief_done | complete
    "brief":        None,
    "one_liner":    "",
    "pipeline_out": None,
    "error":        None,
}
for k, v in defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v


def reset():
    for k, v in defaults.items():
        st.session_state[k] = v


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style="padding-bottom:16px;border-bottom:1px solid #1c1c3a;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:0.2em;color:#5533ff;text-transform:uppercase;margin-bottom:4px;">OPS Studios</div>
      <div style="font-size:18px;font-weight:800;color:#ffffff;">Prometheus</div>
      <div style="font-size:11px;color:#6666aa;margin-top:2px;">5-Stage Self-Hosted AI Pipeline</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("**How it works**")
    stages = [
        ("🧠", "Brief Builder",  "Engineers 5-layer prompt structure"),
        ("👁",  "OBSERVE",        "Reads all 5 layers with precision"),
        ("⚙️", "PROCESS",        "Builds execution strategy"),
        ("⚡", "SYSTEMIZE",      "Delivers final output"),
        ("✅", "Done",           "Production-ready, zero editing"),
    ]
    for icon, name, desc in stages:
        st.markdown(f"""
        <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;">
          <span style="font-size:16px;flex-shrink:0;">{icon}</span>
          <div>
            <div style="font-size:11px;font-weight:700;color:#c0c0e0;">{name}</div>
            <div style="font-size:10px;color:#6666aa;line-height:1.4;">{desc}</div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown('<span class="badge-green">SELF-HOSTED</span> &nbsp; <span class="badge-blue">YOUR API KEY</span>', unsafe_allow_html=True)
    st.caption("All processing on your machine.\nData never stored. No subscription.")

    if st.session_state.phase != "input":
        st.markdown("---")
        if st.button("← Start Over", use_container_width=True):
            reset()
            st.rerun()


# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="ops-header">
  <div class="ops-logo">OPS Studios™</div>
  <div class="ops-title">⚡ OPS Prometheus</div>
  <div class="ops-sub">Context Engineering Brief Builder + Jarvis Pipeline · Self-Hosted · Your API Key</div>
</div>
""", unsafe_allow_html=True)


# ── Pipeline stage bar ────────────────────────────────────────────────────────
def stage_bar(active: str):
    phase = st.session_state.phase
    stages_def = [
        ("brief",     "Brief",     "#00d4ff"),
        ("observe",   "Observe",   "#4488ff"),
        ("process",   "Process",   "#aa44ff"),
        ("systemize", "Systemize", "#00cc66"),
        ("done",      "Output",    "#00cc66"),
    ]
    order = [s[0] for s in stages_def]
    active_idx = order.index(active) if active in order else -1

    html = '<div class="stage-bar">'
    for i, (sid, slabel, scolor) in enumerate(stages_def):
        is_done   = i < active_idx
        is_active = i == active_idx
        dot_class = "done" if is_done else ("active" if is_active else "")
        lbl_class = dot_class
        dot_bg    = f"background:{scolor}33;border-color:{scolor};color:{scolor};" if is_active else \
                    (f"background:{scolor}33;border-color:{scolor};color:{scolor};" if is_done else "")
        dot_content = "✓" if is_done else str(i+1)

        html += f'''
        <div class="stage-node">
          <div class="stage-dot {dot_class}" style="{dot_bg}">{dot_content}</div>
          <div class="stage-label {lbl_class}" style="{'color:'+scolor if is_done or is_active else ''}">{slabel}</div>
        </div>'''

        if i < len(stages_def) - 1:
            conn_class = "done" if is_done else ""
            conn_color = f"background:linear-gradient(90deg,{scolor},{stages_def[i+1][2]});" if is_done else ""
            html += f'<div class="stage-connector {conn_class}" style="{conn_color}"></div>'

    html += '</div>'
    st.markdown(html, unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE: INPUT
# ═══════════════════════════════════════════════════════════════════════════════
if st.session_state.phase == "input":

    col_main, col_tips = st.columns([1.6, 1], gap="large")

    with col_main:
        st.markdown("#### Your One-Liner")
        st.caption("Describe what you want in one sentence. Be specific — the more detail, the better the brief.")

        one_liner = st.text_area(
            label="one_liner_input",
            label_visibility="collapsed",
            placeholder=(
                "e.g. Write a cold email to a startup founder about a content partnership\n"
                "e.g. Create a YouTube script about self-hosted AI for indie makers\n"
                "e.g. Draft a proposal for a done-for-you AI agent build at $3,000"
            ),
            height=130,
            key="one_liner_input_field"
        )

        with st.expander("➕ Add extra context (optional)"):
            extra_ctx = st.text_area(
                "Extra context",
                label_visibility="collapsed",
                placeholder="Audience details, brand voice, past attempts, specific requirements...",
                height=80
            )
        extra_ctx = extra_ctx if 'extra_ctx' in dir() else ""

        col_btn, col_hint = st.columns([1, 1.5])
        with col_btn:
            build_clicked = st.button(
                "🧠 Build 5-Layer Brief →",
                type="primary",
                use_container_width=True,
                disabled=not one_liner.strip()
            )
        with col_hint:
            st.caption("⌘ + Enter · Builds Identity → World → Task → Example → Constraint")

        if st.session_state.error:
            st.error(st.session_state.error)

        # ── Sample starters ──
        st.markdown("---")
        st.markdown("**Try these starters**")
        samples = [
            "Write a cold email to a startup founder about a content partnership",
            "Create a Twitter thread on why self-hosted AI beats SaaS tools",
            "Write a sales page for my $59 AI pipeline product",
            "Draft a client proposal for a done-for-you AI agent build",
            "Write a LinkedIn post announcing my new self-hosted AI tool",
        ]
        cols = st.columns(2)
        for i, s in enumerate(samples):
            with cols[i % 2]:
                if st.button(s[:55] + "…" if len(s) > 55 else s, key=f"sample_{i}", use_container_width=True):
                    st.session_state.one_liner = s
                    st.rerun()

        # Pre-fill if sample was clicked
        if st.session_state.one_liner and not one_liner.strip():
            st.rerun()

    with col_tips:
        st.markdown("#### The 5 Layers")
        for layer in LAYERS:
            color = LAYER_COLORS[layer["id"]]
            st.markdown(f"""
            <div style="padding:12px;background:#0d0d22;border-left:3px solid {color};
                        border-radius:8px;margin-bottom:8px;">
              <div style="font-size:10px;font-weight:800;letter-spacing:0.12em;
                          color:{color};text-transform:uppercase;margin-bottom:4px;">
                {layer['label']}
              </div>
              <div style="font-size:12px;color:#6666aa;">{layer['question']}</div>
              <div style="font-size:11px;color:#444466;margin-top:2px;">{layer['hint']}</div>
            </div>
            """, unsafe_allow_html=True)

    # ── Trigger build ──
    if build_clicked and one_liner.strip():
        st.session_state.one_liner = one_liner.strip()
        with st.spinner("🧠 Engineering your 5-layer brief…"):
            try:
                brief = build_brief(one_liner.strip(), extra_ctx)
                st.session_state.brief = brief
                st.session_state.phase = "brief_done"
                st.session_state.error = None
            except Exception as e:
                st.session_state.error = f"Brief Builder error: {str(e)}"
        st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE: BRIEF DONE — show layers, offer Jarvis button
# ═══════════════════════════════════════════════════════════════════════════════
elif st.session_state.phase == "brief_done":

    stage_bar("observe")

    brief     = st.session_state.brief
    one_liner = st.session_state.one_liner

    st.markdown("### ✅ Stage 1 Complete — Brief Engineered")

    # Analysis
    st.info(f"**Analysis:** {brief.get('analysis', '')}")

    # Model recommendation
    rec = brief.get("model_recommendation", {})
    if rec:
        rcol1, rcol2, rcol3 = st.columns(3)
        rcol1.metric("Recommended Model", rec.get("model", "Sonnet"))
        rcol2.metric("Effort Level", rec.get("effort", "Normal"))
        rcol3.metric("Extended Thinking", "On" if rec.get("thinking") else "Off")
        st.caption(f"*{rec.get('reason', '')}*")

    st.markdown("---")

    # ── 5 Layer cards with inline refine ──
    st.markdown("#### The 5 Layers — Review and Refine")
    st.caption("Read each layer. If anything is off, use the refine field to improve it before running Jarvis.")

    for layer in LAYERS:
        color   = LAYER_COLORS[layer["id"]]
        content = brief["layers"].get(layer["id"], "")

        st.markdown(f"""
        <div style="border-left:3px solid {color};background:#0d0d22;
                    border-radius:10px;padding:14px 16px;margin-bottom:4px;">
          <div style="font-size:10px;font-weight:800;letter-spacing:0.15em;
                      color:{color};text-transform:uppercase;margin-bottom:8px;">
            {layer['label']} — {layer['question']}
          </div>
          <div style="font-size:13px;color:#c0c0e0;line-height:1.75;white-space:pre-wrap;">{content}</div>
        </div>
        """, unsafe_allow_html=True)

        with st.expander(f"✏ Refine {layer['label'].split(' · ')[1]}"):
            feedback = st.text_input(
                f"What to change in {layer['id']}",
                label_visibility="collapsed",
                placeholder=f"Tell Claude what to change in the {layer['id']} layer…",
                key=f"refine_input_{layer['id']}"
            )
            if st.button(f"Apply", key=f"refine_btn_{layer['id']}"):
                if feedback.strip():
                    with st.spinner(f"Refining {layer['label']}…"):
                        try:
                            improved = refine_layer(
                                layer["id"], content, feedback, one_liner
                            )
                            brief["layers"][layer["id"]] = improved
                            # Rebuild final prompt
                            brief["final_prompt"] = rebuild_final_prompt(
                                brief["layers"], one_liner
                            )
                            st.session_state.brief = brief
                        except Exception as e:
                            st.error(f"Refine error: {e}")
                    st.rerun()

    st.markdown("---")

    # ── Assembled final prompt ──
    st.markdown("#### Engineered Final Prompt")
    st.caption("This is what Stage 2–4 (Jarvis) will receive — a complete, structured prompt.")
    st.markdown(f'<div class="prompt-box">{brief.get("final_prompt", "")}</div>', unsafe_allow_html=True)

    if st.button("📋 Copy Final Prompt", key="copy_prompt"):
        st.code(brief.get("final_prompt", ""), language=None)

    # Missing info
    missing = brief.get("missing_info", [])
    if missing:
        st.markdown(f"""
        <div class="missing-box">
          <div style="font-size:10px;font-weight:800;color:#ffb800;letter-spacing:0.1em;margin-bottom:8px;">
            ⚡ WOULD MAKE THIS EVEN STRONGER:
          </div>
          {''.join(f'<div style="font-size:13px;color:#c0a060;margin-bottom:4px;">→ {m}</div>' for m in missing)}
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # ── RUN JARVIS BUTTON ──
    st.markdown("### Ready to run through Jarvis?")
    st.markdown("All 5 layers are locked. Jarvis will read every layer and produce production-ready output.")

    run_col, skip_col = st.columns([2, 1])
    with run_col:
        run_clicked = st.button(
            "⚡ Run Through Jarvis — Stages 2, 3, 4 →",
            type="primary",
            use_container_width=True
        )
    with skip_col:
        if st.button("← Rebuild Brief", use_container_width=True):
            st.session_state.phase = "input"
            st.rerun()

    if run_clicked:
        with st.spinner("⚡ OPS Prometheus pipeline running…"):
            try:
                # Show intermediate stages in real time
                status_placeholder = st.empty()

                status_placeholder.info("👁 OBSERVE — Reading your engineered brief…")
                pipeline_out = {}

                # Run observe
                from jarvis_pipeline import observe as obs_fn, process as proc_fn
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
                observation = obs_fn(brief_context)
                pipeline_out["observation"] = observation

                status_placeholder.info("⚙️ PROCESS — Building execution strategy…")
                strategy = proc_fn(observation)
                pipeline_out["strategy"] = strategy

                status_placeholder.info("⚡ SYSTEMIZE — Producing final output…")
                from jarvis_pipeline import systemize as sys_fn
                final_output = sys_fn(
                    strategy,
                    constraint_layer=brief['layers']['constraint'],
                    example_layer=brief['layers']['example']
                )
                pipeline_out["final_output"] = final_output

                status_placeholder.empty()
                st.session_state.pipeline_out = pipeline_out
                st.session_state.phase = "complete"
                st.session_state.error = None

            except Exception as e:
                st.session_state.error = f"Pipeline error: {str(e)}"
        st.rerun()

    if st.session_state.error:
        st.error(st.session_state.error)


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE: COMPLETE — show all 3 agent outputs + final result
# ═══════════════════════════════════════════════════════════════════════════════
elif st.session_state.phase == "complete":

    stage_bar("done")

    brief        = st.session_state.brief
    pipeline_out = st.session_state.pipeline_out
    one_liner    = st.session_state.one_liner

    # ── Summary stats ──
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("AI Stages", "5")
    col2.metric("Layers Built", "5")
    col3.metric("Agents Fired", "3")
    col4.metric("Status", "✅ Ready")

    st.markdown("---")

    # ── Agent panels ──
    st.markdown("### Stages 2–4 — Jarvis Pipeline Output")
    st.caption("Each agent's output — what OBSERVE extracted, what PROCESS decided, what SYSTEMIZE delivered.")

    agent_defs = [
        ("observation", "OBSERVE",   "#4488ff", "Read the engineered brief and extracted all 5 layers"),
        ("strategy",    "PROCESS",   "#aa44ff", "Built the execution strategy from the analysis"),
        ("final_output","SYSTEMIZE", "#00cc66", "Executed the strategy — production-ready output below"),
    ]

    for key, label, color, desc in agent_defs[:2]:
        content = pipeline_out.get(key, "")
        with st.expander(f"{label} — {desc}", expanded=False):
            st.markdown(f"""
            <div class="agent-content" style="background:#0d0d22;border-radius:8px;padding:14px;
                        font-family:'SF Mono','Fira Code',monospace;font-size:12px;
                        color:#a0a0c8;line-height:1.7;white-space:pre-wrap;">
{content}
            </div>
            """, unsafe_allow_html=True)

    st.markdown("---")

    # ── FINAL OUTPUT ──
    st.markdown("### ✅ Stage 5 — Final Output")
    st.caption("Production-ready. Immediately deployable. Zero editing required.")

    final = pipeline_out.get("final_output", "")

    st.markdown(f'<div class="final-output-box">{final}</div>', unsafe_allow_html=True)

    # Copy button
    st.markdown("&nbsp;")
    copy_col, refine_col, new_col = st.columns([1, 1, 1])

    with copy_col:
        if st.button("📋 Copy Output", use_container_width=True, type="primary"):
            st.code(final, language=None)
            st.success("Select all in the code block above and copy.")

    with refine_col:
        if st.button("✏ Refine Brief & Run Again", use_container_width=True):
            st.session_state.phase = "brief_done"
            st.session_state.pipeline_out = None
            st.rerun()

    with new_col:
        if st.button("🔄 Start Over", use_container_width=True):
            reset()
            st.rerun()

    # ── Show brief layers for reference ──
    st.markdown("---")
    with st.expander("📋 View Engineered Brief (for reference)"):
        for layer in LAYERS:
            color   = LAYER_COLORS[layer["id"]]
            content = brief["layers"].get(layer["id"], "")
            st.markdown(f"""
            <div style="border-left:3px solid {color};background:#0d0d22;
                        border-radius:8px;padding:12px 14px;margin-bottom:8px;">
              <div style="font-size:9px;font-weight:800;letter-spacing:0.15em;
                          color:{color};text-transform:uppercase;margin-bottom:6px;">
                {layer['label']}
              </div>
              <div style="font-size:12px;color:#a0a0c8;line-height:1.7;">{content}</div>
            </div>
            """, unsafe_allow_html=True)

    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align:center;padding:12px 0;">
      <span style="font-size:10px;color:#2a2a4a;font-weight:700;letter-spacing:0.1em;">
        OPS PROMETHEUS v1.0 · Copyright © 2026 V.T. Owens / OPS Studios · All Rights Reserved
      </span>
    </div>
    """, unsafe_allow_html=True)
