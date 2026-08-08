**
 * ============================================================
 * OPS PROMETHEUS — 5-Stage AI Pipeline
 * Context Engineering Brief Builder + OPS Jarvis Pipeline
 * ============================================================
 *
 * Copyright (c) 2026 V.T. Owens / OPS Studios
 * All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL
 *
 * This software and its source code are the exclusive property
 * of V.T. Owens / OPS Studios. Unauthorized copying, modification,
 * distribution, sublicensing, or commercial use of this file,
 * in whole or in part, via any medium, is strictly prohibited
 * without prior written permission from the author.
 *
 * BUYER LICENSE
 * Purchasers of this product receive a personal, non-transferable
 * license to use this software for their own business purposes only.
 * Resale, redistribution, sublicensing, or derivative commercial
 * products based on this code are expressly prohibited.
 *
 * INTELLECTUAL PROPERTY
 * The OPS Prometheus architecture, the 5-layer Context Engineering
 * Brief Builder, the Observe-Process-Systemize agent pipeline, and
 * all associated prompt engineering contained herein are original
 * works authored by V.T. Owens and protected under U.S. and
 * international copyright law.
 *
 * DMCA & ENFORCEMENT
 * Unauthorized use will be subject to DMCA takedown and legal action.
 * To report infringement: vtowens@gmail.com
 *
 * Product:  OPS Prometheus v1.0
 * Author:   V.T. Owens <vtowens@gmail.com>
 * GitHub:   https://github.com/vtowens/ops-jarvis
 * Store:    https://vtowensphere.gumroad.com
 * Created:  August 2026
 * ============================================================
 */

import { useState, useRef, useEffect } from "react";

// ── BRAND ─────────────────────────────────────────────────────────────────────
const C = {
  bg:       "#07071a",
  surface:  "#0d0d22",
  panel:    "#11112a",
  border:   "#1c1c3a",
  accent:   "#5533ff",
  accentHi: "#7755ff",
  cyan:     "#00d4ff",
  pink:     "#e91e8c",
  orange:   "#ff6b35",
  yellow:   "#ffb800",
  green:    "#00cc66",
  text:     "#e8e8ff",
  muted:    "#6666aa",
  dim:      "#2a2a4a",
  white:    "#ffffff",
};

// ── BRIEF LAYERS ──────────────────────────────────────────────────────────────
const LAYERS = [
  { id:"identity", label:"01 · Identity", color:C.cyan,    icon:"🎭", question:"Who is the AI acting as?",                           hint:"Role, expertise, personality" },
  { id:"world",    label:"02 · World",    color:C.pink,    icon:"🌍", question:"What context does it need?",                         hint:"Audience, background, situation" },
  { id:"task",     label:"03 · Task",     color:C.accent,  icon:"🎯", question:"What exactly needs to happen?",                      hint:"Action, deliverable, scope" },
  { id:"example",  label:"04 · Example",  color:C.orange,  icon:"✅", question:"What does great — and bad — look like?",             hint:"Good example AND bad example" },
  { id:"constraint",label:"05 · Constraint",color:C.yellow,icon:"🚧", question:"What are the non-negotiables?",                     hint:"Word limits, format rules, never-do" },
];

// ── JARVIS AGENTS ─────────────────────────────────────────────────────────────
const AGENTS = [
  { id:"observe",   label:"OBSERVE",   color:"#4488ff", tagline:"Reading your engineered brief" },
  { id:"process",   label:"PROCESS",   color:"#aa44ff", tagline:"Building execution strategy" },
  { id:"systemize", label:"SYSTEMIZE", color:C.green,   tagline:"Producing final output" },
];

// ── ALL 5 PIPELINE STAGES (for progress bar) ──────────────────────────────────
const PIPELINE_STAGES = [
  { id:"brief",     label:"Brief",     color:C.cyan,    system:"Brief Builder" },
  { id:"observe",   label:"Observe",   color:"#4488ff", system:"Jarvis" },
  { id:"process",   label:"Process",   color:"#aa44ff", system:"Jarvis" },
  { id:"systemize", label:"Systemize", color:C.green,   system:"Jarvis" },
  { id:"done",      label:"Output",    color:C.green,   system:"Complete" },
];

// ── SYSTEM PROMPTS ────────────────────────────────────────────────────────────
const BRIEF_SYSTEM = `You are an expert context engineer and prompt architect. Take a rough one-liner and build a complete, production-ready 5-layer prompt brief.

Layers:
1. IDENTITY — Who is the AI acting as? (role, expertise, personality) — write in second person "You are..."
2. WORLD — What context does it need? (audience, background, situation) — direct instructions
3. TASK — What exactly must happen? (specific action, deliverable, format, scope)
4. EXAMPLE — What does great look like AND what does bad look like? The bad example is more important — name the exact mistakes to avoid.
5. CONSTRAINT — Non-negotiables. Make them measurable (under 200 words, not "keep it short").

Rules:
- Be specific. Generic advice produces generic output.
- Bad examples: vivid, specific, name the exact wrong approaches.
- After all 5 layers, assemble them into a FINAL PROMPT someone can use directly.

Return ONLY this JSON structure, no markdown fences, no preamble:
{
  "analysis": "One sentence on what this task really is",
  "layers": {
    "identity": "...",
    "world": "...",
    "task": "...",
    "example": "...",
    "constraint": "..."
  },
  "finalPrompt": "The complete assembled prompt",
  "missingInfo": ["things that would make this stronger"],
  "modelRecommendation": {
    "model": "Haiku / Sonnet / Opus",
    "effort": "Low / Normal / High",
    "thinking": true,
    "reason": "one sentence"
  }
}`;

const OBSERVE_SYSTEM = `You are the OBSERVE agent in the OPS Prometheus pipeline. You receive a professionally engineered 5-layer prompt brief — not a vague request. This brief was built by a context engineering system with five explicit layers: Identity, World, Task, Example, and Constraint.

Your job: extract and structure everything in this brief so the PROCESS agent can build an optimal execution strategy.

Deliver:
1. ROLE DEFINED — the exact identity and expertise specified
2. AUDIENCE & CONTEXT — who this is for and the full situational background
3. DELIVERABLE — the specific output required (format, length, scope)
4. QUALITY BAR — what the good example demonstrates and what the bad example forbids
5. HARD CONSTRAINTS — every non-negotiable rule, measurable where specified
6. SUCCESS CRITERIA — what makes this output excellent, derived from all 5 layers

Be thorough. The PROCESS agent builds strategy entirely from your output.`;

const PROCESS_SYSTEM = `You are the PROCESS agent in the OPS Prometheus pipeline. You receive a structured analysis from the OBSERVE agent — built from a professionally engineered 5-layer prompt brief.

Your job: build the optimal execution strategy for this deliverable.

Deliver:
1. APPROACH — the single best structural strategy for this content (be decisive)
2. FRAMEWORK — the specific format and structure to use
3. KEY MOVES — 3-5 specific decisions that will make this output exceptional
4. ANTI-PATTERNS — the exact mistakes the Example layer flagged, plus others to avoid
5. EXECUTION NOTES — precise guidance for SYSTEMIZE including tone, voice, and pacing

Do not hedge. Make every decision. SYSTEMIZE will follow this exactly.`;

const SYSTEMIZE_SYSTEM = `You are the SYSTEMIZE agent in the OPS Prometheus pipeline. You receive an execution strategy from the PROCESS agent — built on a professionally engineered 5-layer brief.

Your job: execute the strategy and deliver the final output.

Rules:
- Produce the complete final content — not an outline, not a draft, not a skeleton
- Follow the Identity layer voice exactly
- Honor the Constraint layer without exception — word limits, format rules, never-do items
- Match the quality bar set by the Example layer's good example, avoid every bad example pattern
- Do not introduce yourself, explain what you are doing, or add meta-commentary
- Begin the output immediately
- Every line earns its place — zero filler`;

// ── API CALLS ─────────────────────────────────────────────────────────────────
const api = async (system, userMsg, maxTokens = 2048) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API error ${r.status}`);
  }
  const d = await r.json();
  return d.content.map(b => b.text || "").join("").trim();
};

const streamApi = async (system, userMsg, onChunk) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      stream: true,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API error ${r.status}`);
  }
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const d = line.slice(6).trim();
      if (d === "[DONE]") return;
      try {
        const p = JSON.parse(d);
        if (p.type === "content_block_delta" && p.delta?.text) onChunk(p.delta.text);
      } catch {}
    }
  }
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Dots({ color = C.accent }) {
  return (
    <span style={{ display:"inline-flex", gap:4, alignItems:"center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:5, height:5, borderRadius:"50%", background:color,
          animation:`dtpulse 1.2s ease-in-out ${i*0.2}s infinite`,
          display:"inline-block",
        }}/>
      ))}
      <style>{`@keyframes dtpulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}`}</style>
    </span>
  );
}

function CopyBtn({ text, label="Copy", small=false }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t); }
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: copied ? C.green : `linear-gradient(135deg,${C.accent},${C.pink})`,
      border:"none", borderRadius:small?6:8,
      padding: small?"6px 14px":"10px 22px",
      color:C.white, cursor:"pointer",
      fontSize:small?11:13, fontWeight:800,
      letterSpacing:"0.04em",
      transition:"background 0.3s",
      fontFamily:"inherit",
    }}>
      {copied ? "✓ Copied" : label}
    </button>
  );
}

// ── PIPELINE PROGRESS BAR ─────────────────────────────────────────────────────
function PipelineBar({ activeStage }) {
  const activeIdx = PIPELINE_STAGES.findIndex(s => s.id === activeStage);
  return (
    <div style={{
      display:"flex", alignItems:"center",
      padding:"14px 24px",
      borderBottom:`1px solid ${C.border}`,
      background:C.surface,
      gap:0, overflowX:"auto",
    }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = stage.id === activeStage;
        const isDone   = i < activeIdx;
        const isPending= i > activeIdx;
        return (
          <div key={stage.id} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background: isDone ? stage.color : isActive ? `${stage.color}33` : C.dim,
                border: `2px solid ${isDone||isActive ? stage.color : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:900, color:isDone?C.bg:isActive?stage.color:C.muted,
                transition:"all 0.4s",
                boxShadow: isActive ? `0 0 12px ${stage.color}66` : "none",
                animation: isActive ? "stagepulse 2s ease-in-out infinite" : "none",
              }}>
                {isDone ? "✓" : i+1}
              </div>
              <span style={{
                fontSize:9, fontWeight:800, letterSpacing:"0.12em",
                color: isDone||isActive ? stage.color : C.muted,
                textTransform:"uppercase", transition:"color 0.4s",
              }}>{stage.label}</span>
              <span style={{ fontSize:8, color:C.dim, letterSpacing:"0.05em" }}>
                {stage.system}
              </span>
            </div>
            {i < PIPELINE_STAGES.length-1 && (
              <div style={{
                width:40, height:1, margin:"0 6px", marginBottom:20,
                background: isDone
                  ? `linear-gradient(90deg,${stage.color},${PIPELINE_STAGES[i+1].color})`
                  : C.border,
                transition:"background 0.5s",
              }}/>
            )}
          </div>
        );
      })}
      <style>{`@keyframes stagepulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
    </div>
  );
}

// ── LAYER CARD (Brief Builder result) ─────────────────────────────────────────
function LayerCard({ layer, content, onRefine, isRefining }) {
  const [fb, setFb] = useState("");
  const [open, setOpen] = useState(false);

  const handleRefine = async () => {
    if (!fb.trim()) return;
    await onRefine(layer.id, fb);
    setFb(""); setOpen(false);
  };

  return (
    <div style={{
      border:`1px solid ${layer.color}44`,
      borderLeft:`3px solid ${layer.color}`,
      borderRadius:10, overflow:"hidden",
      background:C.panel,
    }}>
      <div style={{ padding:"14px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:16 }}>{layer.icon}</span>
          <span style={{ fontSize:11, fontWeight:800, color:layer.color, letterSpacing:"0.15em", textTransform:"uppercase" }}>
            {layer.label}
          </span>
          <span style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>{layer.question}</span>
        </div>
        <p style={{ margin:0, fontSize:13, color:"#c8c8e8", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{content}</p>
      </div>
      <div style={{
        borderTop:`1px solid ${C.border}`, padding:"8px 18px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={()=>setOpen(!open)} style={{
          background:"transparent", border:"none",
          color: open ? layer.color : C.muted,
          cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit",
        }}>
          {open ? "✕ Cancel" : "✏ Refine this layer"}
        </button>
        {isRefining && <Dots color={layer.color}/>}
      </div>
      {open && (
        <div style={{ padding:"0 18px 14px", display:"flex", gap:8 }}>
          <input
            value={fb} onChange={e=>setFb(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleRefine()}
            placeholder="What to change... (press Enter)"
            style={{
              flex:1, background:"#0a0a1a", border:`1px solid ${layer.color}66`,
              borderRadius:6, padding:"8px 12px", color:C.text,
              fontSize:13, outline:"none", fontFamily:"inherit",
            }}
          />
          <button onClick={handleRefine} style={{
            padding:"8px 16px",
            background:`${layer.color}22`, border:`1px solid ${layer.color}`,
            borderRadius:6, color:layer.color, cursor:"pointer",
            fontSize:12, fontWeight:700, fontFamily:"inherit",
          }}>Apply</button>
        </div>
      )}
    </div>
  );
}

// ── AGENT PANEL (Jarvis streaming) ────────────────────────────────────────────
function AgentPanel({ agent, content, status }) {
  const endRef = useRef(null);
  useEffect(()=>{
    if (status==="streaming") endRef.current?.scrollIntoView({ block:"nearest" });
  },[content, status]);

  const isIdle    = status==="idle";
  const isWaiting = status==="waiting";
  const isOn      = status==="streaming";
  const isDone    = status==="done";

  return (
    <div style={{
      border:`1px solid ${isOn||isDone?agent.color:C.border}`,
      borderRadius:10, background:C.panel, overflow:"hidden",
      transition:"border-color 0.4s",
      boxShadow: isOn ? `0 0 16px ${agent.color}22` : "none",
    }}>
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"11px 16px",
        borderBottom:`1px solid ${isOn||isDone?agent.color:C.border}`,
        background: isOn ? `${agent.color}0f` : "transparent",
        transition:"background 0.4s",
      }}>
        <div style={{
          width:7, height:7, borderRadius:"50%",
          background: isOn ? agent.color : isDone ? agent.color : isWaiting ? C.dim : C.dim,
          boxShadow: isOn ? `0 0 8px ${agent.color}` : "none",
          animation: isOn ? "pulse 1.2s ease-in-out infinite" : "none",
          flexShrink:0,
          transition:"background 0.4s",
        }}/>
        <span style={{
          fontFamily:"'SF Mono','Fira Code',monospace",
          fontSize:10, fontWeight:800, letterSpacing:"0.15em",
          color: isOn||isDone ? agent.color : C.muted,
          transition:"color 0.4s",
        }}>{agent.label}</span>
        <span style={{ flex:1 }}/>
        {isOn && <span style={{ fontSize:11, color:agent.color }}>{agent.tagline}…</span>}
        {isDone && <span style={{ fontFamily:"'SF Mono',monospace", fontSize:9, fontWeight:800, color:C.green }}>✓ DONE</span>}
        {isWaiting && <Dots color={C.dim}/>}
      </div>
      <div style={{ minHeight:isIdle?40:60, maxHeight:280, overflowY:"auto", padding:"12px 16px" }}>
        {isIdle && (
          <div style={{ fontSize:12, color:C.dim, fontStyle:"italic", textAlign:"center", paddingTop:4 }}>
            Waiting for pipeline
          </div>
        )}
        {(isOn||isDone) && content && (
          <pre style={{
            fontFamily:"'SF Mono','Fira Code',monospace",
            fontSize:11, lineHeight:1.65,
            color: isDone ? C.text : "#a0a0d0",
            whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0,
          }}>
            {content}
            {isOn && (
              <span style={{
                display:"inline-block", width:7, height:13,
                background:agent.color, marginLeft:2,
                verticalAlign:"middle",
                animation:"blink 0.8s step-end infinite",
              }}/>
            )}
          </pre>
        )}
        <div ref={endRef}/>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function OPSPrometheus() {
  // Brief Builder state
  const [oneLiner, setOneLiner] = useState("");
  const [extraCtx, setExtraCtx] = useState("");
  const [showCtx, setShowCtx]   = useState(false);
  const [brief, setBrief]       = useState(null);       // parsed JSON from Brief Builder
  const [briefStage, setBriefStage] = useState("");

  // Jarvis state
  const [agentStatus, setAgentStatus]   = useState({ observe:"idle", process:"idle", systemize:"idle" });
  const [agentContent, setAgentContent] = useState({ observe:"", process:"", systemize:"" });

  // Global phase
  const [phase, setPhase] = useState("input"); // input | brief-building | brief-done | jarvis-running | complete
  const [activeStage, setActiveStage] = useState("");   // for pipeline bar
  const [error, setError]             = useState(null);
  const [refiningLayer, setRefiningLayer]     = useState(null);
  const [rebuildingPrompt, setRebuildingPrompt] = useState(false);
  const outputRef = useRef(null);

  const BRIEF_STAGE_MSGS = [
    "Analyzing your idea…",
    "Crafting Identity layer…",
    "Building World context…",
    "Defining Task…",
    "Writing Examples…",
    "Setting Constraints…",
    "Assembling final prompt…",
  ];

  // ── helpers ────────────────────────────────────────────────────────────────
  const setAS = (agent, s) => setAgentStatus(p=>({...p,[agent]:s}));
  const appendAC = (agent, chunk) => setAgentContent(p=>({...p,[agent]:p[agent]+chunk}));
  const resetAll = () => {
    setPhase("input"); setBrief(null); setOneLiner(""); setExtraCtx("");
    setShowCtx(false); setError(null); setActiveStage("");
    setAgentStatus({observe:"idle",process:"idle",systemize:"idle"});
    setAgentContent({observe:"",process:"",systemize:""});
  };

  // ── STAGE 1: Build Brief ───────────────────────────────────────────────────
  const runBrief = async () => {
    if (!oneLiner.trim()) return;
    setError(null);
    setPhase("brief-building");
    setActiveStage("brief");

    let si = 0;
    setBriefStage(BRIEF_STAGE_MSGS[0]);
    const t = setInterval(() => {
      si = Math.min(si+1, BRIEF_STAGE_MSGS.length-1);
      setBriefStage(BRIEF_STAGE_MSGS[si]);
    }, 900);

    try {
      const msg = `Here is my rough one-liner:\n\n"${oneLiner.trim()}"${extraCtx.trim()?`\n\nExtra context:\n${extraCtx.trim()}`:""}

Build me a complete 5-layer context engineering brief. Return ONLY valid JSON, no markdown fences, no preamble.`;
      const raw = await api(BRIEF_SYSTEM, msg, 4000);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      clearInterval(t);
      setBrief(parsed);
      setPhase("brief-done");
      setActiveStage("observe");
    } catch(e) {
      clearInterval(t);
      setError(e.message || "Brief Builder failed. Check your connection.");
      setPhase("input");
      setActiveStage("");
    }
  };

  // ── Refine a single layer ──────────────────────────────────────────────────
  const handleRefineLayer = async (layerId, feedback) => {
    setRefiningLayer(layerId);
    try {
      const improved = await api(
        `You are an expert context engineer. Refine one layer of a 5-layer prompt brief based on user feedback. Return ONLY the improved layer content as plain text. No JSON, no labels, no preamble.`,
        `Original task: "${oneLiner}"\n\nLayer: ${layerId.toUpperCase()}\n\nCurrent content:\n${brief.layers[layerId]}\n\nFeedback:\n${feedback}\n\nRewrite this layer to be stronger.`,
        1000
      );
      const newLayers = { ...brief.layers, [layerId]: improved };
      setRebuildingPrompt(true);
      const newFinal = await api(
        `You are an expert context engineer. Assemble a final prompt from 5 layers. Return ONLY the assembled prompt as plain text. No JSON, no labels.`,
        `Task: "${oneLiner}"\n\nIDENTITY: ${newLayers.identity}\nWORLD: ${newLayers.world}\nTASK: ${newLayers.task}\nEXAMPLE: ${newLayers.example}\nCONSTRAINT: ${newLayers.constraint}\n\nAssemble into a single flowing prompt.`,
        1000
      );
      setBrief(b => ({ ...b, layers: newLayers, finalPrompt: newFinal }));
    } catch(e) {
      console.error(e);
    } finally {
      setRefiningLayer(null);
      setRebuildingPrompt(false);
    }
  };

  // ── STAGE 2–4: Run Jarvis on the engineered prompt ─────────────────────────
  const runJarvis = async () => {
    if (!brief?.finalPrompt) return;
    setError(null);
    setPhase("jarvis-running");

    const fullBriefContext = `ENGINEERED PROMPT BRIEF (5 layers):
IDENTITY: ${brief.layers.identity}
WORLD: ${brief.layers.world}
TASK: ${brief.layers.task}
EXAMPLE: ${brief.layers.example}
CONSTRAINT: ${brief.layers.constraint}

ASSEMBLED FINAL PROMPT:
${brief.layers.finalPrompt || brief.finalPrompt}

ORIGINAL TASK: "${oneLiner}"`;

    try {
      // OBSERVE
      setActiveStage("observe");
      setAS("observe","streaming");
      let observeOut = "";
      await streamApi(OBSERVE_SYSTEM, fullBriefContext, chunk => {
        observeOut += chunk;
        appendAC("observe", chunk);
      });
      setAS("observe","done");

      // PROCESS
      setActiveStage("process");
      setAS("process","waiting");
      await new Promise(r=>setTimeout(r,400));
      setAS("process","streaming");
      let processOut = "";
      await streamApi(PROCESS_SYSTEM, observeOut, chunk => {
        processOut += chunk;
        appendAC("process", chunk);
      });
      setAS("process","done");

      // SYSTEMIZE
      setActiveStage("systemize");
      setAS("systemize","waiting");
      await new Promise(r=>setTimeout(r,400));
      setAS("systemize","streaming");
      await streamApi(
        SYSTEMIZE_SYSTEM,
        `Strategy:\n${processOut}\n\nOriginal brief constraints:\nCONSTRAINT: ${brief.layers.constraint}\nEXAMPLE (what to avoid): ${brief.layers.example}`,
        chunk => appendAC("systemize", chunk)
      );
      setAS("systemize","done");

      setActiveStage("done");
      setPhase("complete");

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 300);
    } catch(e) {
      setError(e.message || "Pipeline error. Try again.");
      setPhase("brief-done");
      setActiveStage("observe");
    }
  };

  const isJarvisRunning = phase === "jarvis-running";
  const isBriefBuilding = phase === "brief-building";

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.bg};}
        textarea,input{font-family:'Inter',system-ui,sans-serif;}
        textarea:focus,input:focus{outline:none;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:${C.surface};}
        ::-webkit-scrollbar-thumb{background:${C.dim};border-radius:2px;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${C.accent}33}50%{box-shadow:0 0 40px ${C.accent}66}}
      `}</style>

      <div style={{
        minHeight:"100vh", background:C.bg,
        fontFamily:"'Inter',system-ui,sans-serif", color:C.text,
      }}>

        {/* ── HEADER ── */}
        <div style={{
          borderBottom:`1px solid ${C.border}`,
          background:C.surface,
        }}>
          <div style={{
            maxWidth:860, margin:"0 auto", padding:"16px 24px",
            display:"flex", alignItems:"center", gap:16,
          }}>
            {/* Logo */}
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background:`linear-gradient(135deg,${C.accent},${C.pink})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'SF Mono',monospace", fontSize:13, fontWeight:900, color:C.white,
            }}>OPS</div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:C.white, letterSpacing:"-0.02em" }}>
                Prometheus
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>
                Context Engineering + Jarvis Pipeline · 5-Stage AI System
              </div>
            </div>
            <div style={{ flex:1 }}/>
            {/* Stage count badge */}
            <div style={{
              padding:"4px 12px", borderRadius:20,
              border:`1px solid ${C.dim}`,
              fontSize:10, fontWeight:800, color:C.muted,
              letterSpacing:"0.08em", fontFamily:"'SF Mono',monospace",
            }}>5 AI STAGES</div>
            <div style={{
              padding:"4px 12px", borderRadius:20,
              background:`${C.green}18`, border:`1px solid ${C.green}44`,
              fontSize:10, fontWeight:800, color:C.green,
              letterSpacing:"0.08em",
            }}>SELF-HOSTED</div>
            {phase !== "input" && (
              <button onClick={resetAll} style={{
                background:"transparent", border:`1px solid ${C.border}`,
                borderRadius:6, padding:"6px 14px",
                color:C.muted, cursor:"pointer", fontSize:12, fontWeight:600,
                fontFamily:"inherit",
              }}>← Reset</button>
            )}
          </div>

          {/* Pipeline progress bar — visible after brief starts */}
          {phase !== "input" && (
            <PipelineBar activeStage={activeStage}/>
          )}
        </div>

        <div style={{ maxWidth:860, margin:"0 auto", padding:"0 24px 80px" }}>

          {/* ═══════════════════════════════════════════════════════════
              PHASE: INPUT
          ═══════════════════════════════════════════════════════════ */}
          {phase === "input" && (
            <div style={{ animation:"fadeUp 0.4s ease" }}>

              {/* Hero */}
              <div style={{ textAlign:"center", padding:"44px 0 32px" }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  padding:"4px 14px", borderRadius:20,
                  border:`1px solid ${C.accent}44`,
                  background:`${C.accent}0f`,
                  marginBottom:20,
                }}>
                  <div style={{
                    width:6, height:6, borderRadius:"50%", background:C.green,
                    boxShadow:`0 0 6px ${C.green}`, animation:"pulse 2s ease-in-out infinite",
                  }}/>
                  <span style={{ fontSize:10, fontWeight:800, color:C.green, letterSpacing:"0.12em" }}>
                    ONE SENTENCE → PRODUCTION OUTPUT
                  </span>
                </div>
                <h1 style={{
                  fontSize:"clamp(24px,4.5vw,36px)", fontWeight:800,
                  letterSpacing:"-0.03em", lineHeight:1.15, color:C.white, marginBottom:14,
                }}>
                  You write one sentence.<br/>
                  <span style={{
                    background:`linear-gradient(90deg,${C.cyan},${C.accent},${C.pink})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>
                    Five AI stages finish the job.
                  </span>
                </h1>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.65, maxWidth:500, margin:"0 auto" }}>
                  The Brief Builder engineers a 5-layer prompt from your idea.
                  The Jarvis pipeline — Observe, Process, Systemize — executes it.
                  Production-ready output. Your machine. Your API key.
                </p>
              </div>

              {/* 5 stage mini-map */}
              <div style={{
                display:"grid", gridTemplateColumns:"repeat(5,1fr)",
                gap:8, marginBottom:28,
              }}>
                {[
                  { n:1, label:"Brief",     color:C.cyan,   icon:"🧠", desc:"Engineers 5-layer structure from your one-liner" },
                  { n:2, label:"Observe",   color:"#4488ff",icon:"👁",  desc:"Reads and extracts all layers with precision" },
                  { n:3, label:"Process",   color:"#aa44ff",icon:"⚙️",  desc:"Builds optimal execution strategy" },
                  { n:4, label:"Systemize", color:C.green,  icon:"⚡",  desc:"Executes and delivers the final output" },
                  { n:5, label:"Output",    color:C.green,  icon:"✅",  desc:"Production-ready. Copy and deploy." },
                ].map(s => (
                  <div key={s.n} style={{
                    padding:"14px 10px", background:C.panel,
                    border:`1px solid ${s.color}33`,
                    borderTop:`3px solid ${s.color}`,
                    borderRadius:8, textAlign:"center",
                  }}>
                    <div style={{ fontSize:18, marginBottom:6 }}>{s.icon}</div>
                    <div style={{ fontSize:9, fontWeight:800, color:s.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                      {s.n}. {s.label}
                    </div>
                    <div style={{ fontSize:10, color:C.muted, lineHeight:1.4 }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* Input box */}
              <div style={{
                border:`1px solid ${C.border}`, borderRadius:12,
                background:C.surface, overflow:"hidden",
                boxShadow:`0 0 0 1px ${C.dim}`,
              }}>
                <div style={{ padding:"18px 20px 0" }}>
                  <label style={{
                    fontSize:10, fontWeight:800, color:C.accent,
                    letterSpacing:"0.15em", textTransform:"uppercase",
                  }}>Your One-Liner</label>
                  <textarea
                    value={oneLiner}
                    onChange={e=>setOneLiner(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)) runBrief(); }}
                    placeholder={"Describe what you want in one sentence…\n\nExamples:\n· Write a cold email to a startup founder about a partnership\n· Create a YouTube script about self-hosted AI for indie makers\n· Draft a client proposal for a done-for-you AI agent build\n· Write a LinkedIn post announcing my new prompt engine"}
                    style={{
                      width:"100%", minHeight:140, marginTop:10,
                      background:"transparent", border:"none",
                      color:C.text, fontSize:14, lineHeight:1.7,
                      resize:"none", fontFamily:"inherit",
                    }}
                  />
                </div>
                <div style={{ padding:"0 20px 18px" }}>
                  <button onClick={()=>setShowCtx(!showCtx)} style={{
                    background:"transparent", border:"none",
                    color: showCtx ? C.accent : C.muted,
                    cursor:"pointer", fontSize:12, fontWeight:600,
                    fontFamily:"inherit", padding:0,
                  }}>
                    {showCtx?"▼":"▶"} Add extra context (optional)
                  </button>
                  {showCtx && (
                    <textarea
                      value={extraCtx}
                      onChange={e=>setExtraCtx(e.target.value)}
                      placeholder="Audience details, brand voice, past attempts, specific requirements…"
                      style={{
                        width:"100%", minHeight:70, marginTop:10,
                        background:"#0a0a1a", border:`1px solid ${C.dim}`,
                        borderRadius:8, padding:"10px 12px",
                        color:"#c0c0d8", fontSize:13, lineHeight:1.6,
                        resize:"vertical", fontFamily:"inherit",
                      }}
                    />
                  )}
                </div>
                <div style={{
                  padding:"12px 20px",
                  borderTop:`1px solid ${C.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                }}>
                  <span style={{ fontSize:11, color:C.dim }}>⌘ + Enter to build</span>
                  <button
                    onClick={runBrief}
                    disabled={!oneLiner.trim()}
                    style={{
                      padding:"12px 28px",
                      background: oneLiner.trim()
                        ? `linear-gradient(135deg,${C.accent},${C.pink})`
                        : C.dim,
                      border:"none", borderRadius:8,
                      color: oneLiner.trim() ? C.white : C.muted,
                      cursor: oneLiner.trim() ? "pointer" : "default",
                      fontSize:14, fontWeight:800, fontFamily:"inherit",
                      transition:"all 0.2s",
                    }}>
                    Build 5-Layer Brief →
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  marginTop:16, padding:"12px 16px",
                  background:"#1a0a0a", border:`1px solid #cc334433`,
                  borderRadius:8, color:"#ff8888", fontSize:13,
                }}>⚠ {error}</div>
              )}

              {/* Sample starters */}
              <div style={{ marginTop:24 }}>
                <div style={{
                  fontSize:10, fontWeight:700, color:C.dim,
                  letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10,
                }}>Try these</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {[
                    "Write an email inviting my subscribers to a free AI workshop",
                    "Create a Twitter thread on why self-hosted AI beats SaaS tools",
                    "Write a cold email to a startup founder about a content partnership",
                    "Draft a sales page for my $97 prompt engineering course",
                    "Write a LinkedIn post announcing my new AI tool launch",
                  ].map(s => (
                    <button key={s} onClick={()=>setOneLiner(s)} style={{
                      padding:"6px 14px", background:C.panel,
                      border:`1px solid ${C.border}`, borderRadius:20,
                      color:C.muted, cursor:"pointer", fontSize:12,
                      fontFamily:"inherit", transition:"all 0.15s",
                    }}
                      onMouseEnter={e=>{e.target.style.borderColor=C.accent;e.target.style.color=C.accentHi;}}
                      onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.muted;}}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              PHASE: BRIEF BUILDING
          ═══════════════════════════════════════════════════════════ */}
          {phase === "brief-building" && (
            <div style={{ textAlign:"center", padding:"80px 0", animation:"fadeUp 0.4s ease" }}>
              <div style={{ fontSize:44, marginBottom:24 }}>🧠</div>
              <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:C.white }}>
                Engineering your brief…
              </h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:32 }}>
                "{oneLiner.length>70?oneLiner.slice(0,70)+"…":oneLiner}"
              </p>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
                <Dots color={C.accent}/>
              </div>
              <div style={{ fontSize:13, color:C.accent, fontWeight:600 }}>{briefStage}</div>
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:28 }}>
                {LAYERS.map((l,i) => (
                  <div key={l.id} style={{
                    width:8, height:8, borderRadius:"50%",
                    background: BRIEF_STAGE_MSGS.indexOf(briefStage) > i ? l.color : C.dim,
                    transition:"background 0.4s",
                  }}/>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              PHASE: BRIEF DONE — show brief, offer Jarvis button
          ═══════════════════════════════════════════════════════════ */}
          {(phase === "brief-done" || phase === "jarvis-running" || phase === "complete") && brief && (
            <div style={{ paddingTop:32, animation:"fadeUp 0.4s ease" }}>

              {/* ── Section label ── */}
              <div style={{
                display:"flex", alignItems:"center", gap:12, marginBottom:20,
              }}>
                <span style={{
                  fontSize:10, fontWeight:800, color:C.cyan, letterSpacing:"0.15em",
                  textTransform:"uppercase", fontFamily:"'SF Mono',monospace",
                }}>Stage 1 Complete — Brief Engineered</span>
                <div style={{ flex:1, height:1, background:C.border }}/>
                <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>✓</span>
              </div>

              {/* Analysis banner */}
              <div style={{
                padding:"12px 16px", background:`${C.accent}12`,
                border:`1px solid ${C.accent}33`, borderRadius:10, marginBottom:16,
              }}>
                <span style={{ fontSize:10, fontWeight:800, color:C.accent, letterSpacing:"0.1em", marginRight:8 }}>ANALYSIS:</span>
                <span style={{ fontSize:13, color:"#a090cc" }}>{brief.analysis}</span>
              </div>

              {/* Model rec */}
              {brief.modelRecommendation && (
                <div style={{
                  display:"flex", gap:10, alignItems:"center",
                  padding:"10px 16px", background:C.panel,
                  border:`1px solid ${C.border}`, borderRadius:10, marginBottom:20,
                  flexWrap:"wrap",
                }}>
                  <span style={{ fontSize:9, color:C.muted, fontWeight:800, letterSpacing:"0.1em" }}>RECOMMENDED:</span>
                  <span style={{
                    padding:"2px 10px", borderRadius:20,
                    background:`${C.accent}22`, color:C.accentHi,
                    fontSize:11, fontWeight:800,
                  }}>{brief.modelRecommendation.model}</span>
                  <span style={{ fontSize:11, color:C.muted }}>
                    {brief.modelRecommendation.effort} effort
                    {brief.modelRecommendation.thinking?" · Thinking ON":""}
                  </span>
                  <span style={{ fontSize:11, color:C.dim, fontStyle:"italic" }}>
                    — {brief.modelRecommendation.reason}
                  </span>
                </div>
              )}

              {/* 5 layer cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {LAYERS.map(layer => (
                  <LayerCard
                    key={layer.id}
                    layer={layer}
                    content={brief.layers[layer.id]}
                    onRefine={phase==="brief-done" ? handleRefineLayer : ()=>{}}
                    isRefining={refiningLayer===layer.id}
                  />
                ))}
              </div>

              {/* Final assembled prompt */}
              <div style={{
                background:C.panel, border:`1px solid ${C.border}`,
                borderRadius:12, overflow:"hidden", marginBottom:20,
              }}>
                <div style={{
                  padding:"12px 18px", borderBottom:`1px solid ${C.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  flexWrap:"wrap", gap:8,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:C.white, letterSpacing:"0.08em" }}>
                      ✦ ENGINEERED PROMPT — READY FOR JARVIS
                    </span>
                    {rebuildingPrompt && <Dots color={C.accent}/>}
                  </div>
                  <CopyBtn text={brief.finalPrompt} small/>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  <pre style={{
                    margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word",
                    fontSize:12, color:"#c0c0d8", lineHeight:1.75,
                    fontFamily:"inherit",
                  }}>{brief.finalPrompt}</pre>
                </div>
              </div>

              {/* Missing info */}
              {brief.missingInfo?.length > 0 && (
                <div style={{
                  padding:"14px 18px", background:"#1a1500",
                  border:`1px solid ${C.yellow}33`, borderRadius:10, marginBottom:20,
                }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.yellow, letterSpacing:"0.1em", marginBottom:10 }}>
                    ⚡ WOULD MAKE THIS EVEN STRONGER:
                  </div>
                  {brief.missingInfo.map((m,i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:5, alignItems:"flex-start" }}>
                      <span style={{ color:C.yellow, flexShrink:0 }}>→</span>
                      <span style={{ fontSize:13, color:"#c0a060", lineHeight:1.6 }}>{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── RUN JARVIS BUTTON ── */}
              {phase === "brief-done" && (
                <div style={{
                  border:`1px solid ${C.accent}66`,
                  borderRadius:12, padding:"24px",
                  background:`${C.accent}0a`,
                  textAlign:"center",
                  animation:"glow 3s ease-in-out infinite",
                }}>
                  <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>
                    Brief engineered. All 5 layers locked.
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.white, marginBottom:20 }}>
                    Ready to run through the Jarvis pipeline?
                  </div>
                  <button onClick={runJarvis} style={{
                    padding:"14px 40px",
                    background:`linear-gradient(135deg,${C.accent},${C.pink})`,
                    border:"none", borderRadius:10,
                    color:C.white, cursor:"pointer",
                    fontSize:16, fontWeight:800, fontFamily:"inherit",
                    letterSpacing:"-0.01em",
                    boxShadow:`0 4px 24px ${C.accent}44`,
                    transition:"transform 0.15s",
                  }}
                    onMouseEnter={e=>e.target.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.target.style.transform="translateY(0)"}
                  >
                    ⚡ Run Through Jarvis →
                  </button>
                  <div style={{ fontSize:11, color:C.dim, marginTop:12 }}>
                    Stages 2–4: Observe → Process → Systemize
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              PHASE: JARVIS RUNNING / COMPLETE — Agent panels
          ═══════════════════════════════════════════════════════════ */}
          {(phase === "jarvis-running" || phase === "complete") && (
            <div style={{ marginTop:28, animation:"fadeUp 0.4s ease" }}>

              {/* Section label */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <span style={{
                  fontSize:10, fontWeight:800, letterSpacing:"0.15em",
                  color:"#4488ff", textTransform:"uppercase",
                  fontFamily:"'SF Mono',monospace",
                }}>Stages 2–4 — Jarvis Pipeline</span>
                <div style={{ flex:1, height:1, background:C.border }}/>
                {phase==="complete" && (
                  <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>✓ Complete</span>
                )}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {AGENTS.map(agent => (
                  <AgentPanel
                    key={agent.id}
                    agent={agent}
                    content={agentContent[agent.id]}
                    status={agentStatus[agent.id]}
                  />
                ))}
              </div>

              {/* Final output + copy */}
              {phase === "complete" && agentContent.systemize && (
                <div ref={outputRef} style={{
                  marginTop:24, animation:"fadeUp 0.5s ease",
                }}>
                  {/* Separator */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                    <div style={{ flex:1, height:1, background:C.border }}/>
                    <span style={{
                      fontSize:10, fontWeight:800, color:C.green, letterSpacing:"0.15em",
                      fontFamily:"'SF Mono',monospace",
                    }}>STAGE 5 — FINAL OUTPUT</span>
                    <div style={{ flex:1, height:1, background:C.border }}/>
                  </div>

                  {/* Output card */}
                  <div style={{
                    background:C.panel, border:`1px solid ${C.green}44`,
                    borderRadius:12, overflow:"hidden",
                    boxShadow:`0 0 24px ${C.green}18`,
                  }}>
                    <div style={{
                      padding:"14px 18px", borderBottom:`1px solid ${C.border}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      flexWrap:"wrap", gap:8,
                    }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:C.green }}>
                          ✓ Pipeline Complete — Production Ready
                        </div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                          5 AI stages · Engineered brief + Jarvis execution · Zero editing required
                        </div>
                      </div>
                      <CopyBtn text={agentContent.systemize} label="Copy Output"/>
                    </div>
                    <div style={{ padding:"20px 18px" }}>
                      <pre style={{
                        margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word",
                        fontSize:13, color:C.text, lineHeight:1.8, fontFamily:"inherit",
                      }}>{agentContent.systemize}</pre>
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div style={{
                    display:"grid", gridTemplateColumns:"repeat(4,1fr)",
                    gap:8, marginTop:16,
                  }}>
                    {[
                      { label:"AI Stages",     value:"5",       color:C.cyan },
                      { label:"Layers Built",  value:"5",       color:C.pink },
                      { label:"Agents Fired",  value:"3",       color:C.accent },
                      { label:"Status",        value:"Ready",   color:C.green },
                    ].map(s => (
                      <div key={s.label} style={{
                        padding:"12px", background:C.panel,
                        border:`1px solid ${s.color}33`,
                        borderRadius:8, textAlign:"center",
                      }}>
                        <div style={{ fontSize:18, fontWeight:900, color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end", flexWrap:"wrap" }}>
                    <button onClick={()=>{
                      setPhase("brief-done");
                      setActiveStage("observe");
                      setAgentStatus({observe:"idle",process:"idle",systemize:"idle"});
                      setAgentContent({observe:"",process:"",systemize:""});
                    }} style={{
                      padding:"10px 20px", background:"transparent",
                      border:`1px solid ${C.border}`, borderRadius:8,
                      color:C.muted, cursor:"pointer", fontSize:13, fontWeight:600,
                      fontFamily:"inherit",
                    }}>Refine Brief & Run Again</button>
                    <button onClick={resetAll} style={{
                      padding:"10px 20px", background:"transparent",
                      border:`1px solid ${C.border}`, borderRadius:8,
                      color:C.muted, cursor:"pointer", fontSize:13, fontWeight:600,
                      fontFamily:"inherit",
                    }}>Start Over</button>
                    <CopyBtn text={agentContent.systemize} label="Copy Final Output"/>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  marginTop:16, padding:"12px 16px",
                  background:"#1a0a0a", border:`1px solid #cc334433`,
                  borderRadius:8, color:"#ff8888", fontSize:13,
                }}>⚠ {error}</div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
