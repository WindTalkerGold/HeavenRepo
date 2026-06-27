import { html } from '../app.js';

const content = html`
<style>
    .rag2-root {
        --c-agent: #16a34a;
        --c-agent-bg: #f0fdf4;
        --c-llm: #7c3aed;
        --c-llm-bg: #f5f0ff;
        --c-rag: #ea580c;
        --c-rag-bg: #fff7ed;
        --c-kb: #2563eb;
        --c-kb-bg: #eff6ff;
        --c-line: #cbd5e1;
        --c-line-active: #f59e0b;
        --c-text: #0f172a;
        --c-muted: #64748b;
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.6rem;
        font-family: var(--font-main);
        color: var(--c-text);
        position: relative;
    }
    .rag2-root h2 {
        font-size: 1.2rem;
        margin: 0;
        padding-bottom: 0.3rem;
        border-bottom: 2px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .rag2-root h2 .sub {
        font-size: 0.78rem;
        color: var(--c-muted);
        font-weight: 500;
    }

    .rag2-body {
        display: grid;
        grid-template-columns: 1fr 1.35fr;
        gap: 1rem;
        flex: 1;
        min-height: 0;
    }

    .rag2-panel {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 0.8rem 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        min-height: 0;
        position: relative;
        overflow: hidden;
    }
    .rag2-panel::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 0% 0%, rgba(37,99,235,0.04), transparent 40%),
            radial-gradient(circle at 100% 100%, rgba(124,58,237,0.04), transparent 40%);
        pointer-events: none;
    }
    .rag2-panel-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        font-size: 0.92rem;
        color: var(--c-text);
        z-index: 1;
    }
    .rag2-panel-title .dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: #f59e0b;
        box-shadow: 0 0 0 4px rgba(245,158,11,0.18);
        animation: pulseDot 1.6s ease-in-out infinite;
    }
    @keyframes pulseDot {
        0%,100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
    .rag2-panel-title .num {
        font-size: 0.7rem;
        color: var(--c-muted);
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    /* ====== LEFT: Ingestion Animation ====== */
    .ingest-stage {
        flex: 1 1 auto;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: 0.5rem;
        padding: 0.4rem 0.2rem;
        z-index: 1;
        min-height: 0;
    }
    .ingest-row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 0.4rem;
        position: relative;
        min-height: 56px;
    }
    .stage-cap small {
        display: block;
        color: #94a3b8;
        font-size: 0.58rem;
        font-weight: 500;
        margin-top: 1px;
    }

    /* Stage 1: file */
    .file-icon {
        width: 56px;
        height: 70px;
        background: linear-gradient(180deg, #ffffff 0%, #fef3c7 100%);
        border: 2px solid #f59e0b;
        border-radius: 6px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        box-shadow: 0 4px 12px rgba(245,158,11,0.18);
        flex-shrink: 0;
        transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
    }
    .file-icon::before {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 14px; height: 14px;
        background: #fbbf24;
        clip-path: polygon(0 0, 100% 100%, 0 100%);
    }
    .file-icon .ftype {
        font-size: 0.62rem;
        font-weight: 800;
        color: #b45309;
        letter-spacing: 0.05em;
    }
    .file-icon .fline {
        width: 60%;
        height: 2px;
        background: #fbbf24;
        border-radius: 2px;
        opacity: 0.6;
    }
    .file-label {
        font-size: 0.7rem;
        color: var(--c-muted);
        text-align: center;
        margin-top: 4px;
    }
    .stage-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 0;
    }
    .stage-cap {
        font-size: 0.62rem;
        color: var(--c-muted);
        font-weight: 600;
    }

    /* Stage 2: chunks */
    .chunks {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: stretch;
        width: 100%;
        max-width: 110px;
    }
    .chunk {
        height: 9px;
        background: #fff;
        border: 1.5px solid #94a3b8;
        border-radius: 4px;
        position: relative;
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        overflow: hidden;
    }
    .chunk::before {
        content: '';
        position: absolute;
        left: 4px; top: 50%;
        transform: translateY(-50%);
        width: 70%;
        height: 2px;
        background: #cbd5e1;
        border-radius: 1px;
    }
    .chunk.show {
        opacity: 1;
        transform: translateX(0);
    }

    /* Stage 3: tagged chunks */
    .tagged {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        max-width: 130px;
    }
    .tagged .chunk {
        display: flex;
        align-items: center;
        gap: 3px;
        padding: 0 3px;
        height: 11px;
        border-color: #16a34a;
        background: #f0fdf4;
    }
    .tagged .chunk::before { display: none; }
    .tag-pill {
        font-size: 0.5rem;
        font-weight: 700;
        padding: 1px 4px;
        border-radius: 3px;
        line-height: 1;
        background: #dcfce7;
        color: #15803d;
    }
    .tag-pill.b { background: #dbeafe; color: #1e40af; }
    .tag-pill.p { background: #fae8ff; color: #86198f; }
    .tag-bar {
        flex: 1;
        height: 2px;
        background: #86efac;
        border-radius: 1px;
        opacity: 0.6;
    }

    /* Stage 4: vectors */
    .vec-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 2px;
        width: 100%;
        max-width: 110px;
    }
    .vec-cell {
        aspect-ratio: 1;
        border-radius: 2px;
        background: #e0e7ff;
        opacity: 0;
        transform: scale(0.3);
        transition: all 0.3s ease;
    }
    .vec-cell.show {
        opacity: 1;
        transform: scale(1);
    }
    .vec-num {
        font-family: 'Consolas', monospace;
        font-size: 0.55rem;
        color: #4338ca;
        text-align: center;
    }
    .ingest-stage .stage-cap,
    .vec-num {
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .ingest-stage .stage-cap.show,
    .vec-num.show {
        opacity: 1;
        transform: translateY(0);
    }

    /* KB target */
    .kb-target {
        width: 80px;
        height: 70px;
        background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
        border: 2px solid var(--c-kb);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        position: relative;
        box-shadow: 0 4px 14px rgba(37,99,235,0.18);
        flex-shrink: 0;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .kb-target.show {
        opacity: 1;
        transform: translateY(0);
    }
    .kb-target .stack {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 60%;
    }
    .kb-target .stack span {
        height: 4px;
        border-radius: 1px;
        background: var(--c-kb);
        opacity: 0.4;
    }
    .kb-target .stack span:nth-child(2) { opacity: 0.6; }
    .kb-target .stack span:nth-child(3) { opacity: 0.85; }
    .kb-target .kbtxt {
        font-size: 0.55rem;
        font-weight: 700;
        color: var(--c-kb);
        letter-spacing: 0.04em;
    }
    .kb-target.pulse { animation: kbPulse 0.8s ease; }
    @keyframes kbPulse {
        0% { box-shadow: 0 4px 14px rgba(37,99,235,0.18); transform: scale(1); }
        50% { box-shadow: 0 6px 24px rgba(37,99,235,0.5); transform: scale(1.06); }
        100% { box-shadow: 0 4px 14px rgba(37,99,235,0.18); transform: scale(1); }
    }

    /* Connectors between stages */
    .ingest-arrow {
        flex: 0 0 auto;
        font-size: 1rem;
        color: #94a3b8;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.35s ease, transform 0.35s ease, color 0.3s;
    }
    .ingest-arrow.show {
        opacity: 1;
        transform: translateY(0);
    }
    .ingest-arrow.live {
        color: var(--c-line-active);
        animation: arrowPush 1.2s ease-in-out infinite;
    }
    @keyframes arrowPush {
        0%,100% { transform: translateX(0); }
        50% { transform: translateX(4px); }
    }

    /* Status strip */
    .ingest-status {
        background: #0f172a;
        border-radius: 8px;
        padding: 0.6rem 0.85rem;
        color: #e2e8f0;
        font-size: 0.92rem;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        z-index: 1;
        min-height: 48px;
        line-height: 1.4;
        margin-top: auto;
    }
    .ingest-status .badge {
        background: #f59e0b;
        color: #0f172a;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 5px;
        letter-spacing: 0.05em;
    }
    .ingest-status .msg {
        flex: 1;
        font-family: 'Consolas', 'Monaco', monospace;
    }

    /* ====== RIGHT: Q&A Flow ====== */
    .qa-stage {
        flex: 1;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-height: 0;
    }

    .user-bar {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.4rem 0.6rem;
        background: #f1f5f9;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }
    .user-bar .av {
        width: 26px; height: 26px;
        border-radius: 50%;
        background: #475569;
        color: white;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.85rem;
        flex-shrink: 0;
    }
    .user-bar .qtxt {
        font-size: 0.74rem;
        color: var(--c-text);
        line-height: 1.3;
        flex: 1;
    }
    .user-bar .qtxt b { color: #1e40af; }

    .cards-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 0.55rem;
        flex: 1;
        position: relative;
        min-height: 0;
    }

    .qa-card {
        border-radius: 10px;
        border: 2px solid;
        padding: 0.55rem 0.65rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        position: relative;
        background: white;
        transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        min-height: 0;
        overflow: hidden;
    }
    .qa-card.dim { opacity: 0.45; filter: grayscale(0.3); }
    .qa-card.active {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        z-index: 5;
    }
    .qa-card .head {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
    .qa-card .ico {
        width: 28px; height: 28px;
        border-radius: 7px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }
    .qa-card .name {
        font-weight: 800;
        font-size: 0.84rem;
        line-height: 1;
    }
    .qa-card .role {
        font-size: 0.62rem;
        color: var(--c-muted);
        margin-top: 2px;
    }
    .qa-card .status {
        font-size: 0.68rem;
        line-height: 1.35;
        color: #334155;
        background: #f8fafc;
        border-radius: 5px;
        padding: 4px 6px;
        flex: 1;
        font-family: 'Consolas','Monaco',monospace;
        white-space: pre-wrap;
        overflow: hidden;
        border-left: 2px solid #cbd5e1;
        transition: border-color 0.3s, background 0.3s;
    }
    .qa-card.active .status {
        background: white;
    }

    .qa-card--agent { border-color: var(--c-agent); background: var(--c-agent-bg); }
    .qa-card--agent .ico { background: var(--c-agent); color: white; }
    .qa-card--agent.active .status { border-left-color: var(--c-agent); }

    .qa-card--llm { border-color: var(--c-llm); background: var(--c-llm-bg); }
    .qa-card--llm .ico { background: var(--c-llm); color: white; }
    .qa-card--llm.active .status { border-left-color: var(--c-llm); }

    .qa-card--rag { border-color: var(--c-rag); background: var(--c-rag-bg); }
    .qa-card--rag .ico { background: var(--c-rag); color: white; }
    .qa-card--rag.active .status { border-left-color: var(--c-rag); }

    .qa-card--kb { border-color: var(--c-kb); background: var(--c-kb-bg); }
    .qa-card--kb .ico { background: var(--c-kb); color: white; }
    .qa-card--kb.active .status { border-left-color: var(--c-kb); }

    /* Particle layer over cards */
    .particle-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 6;
    }
    .pt {
        position: absolute;
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #f59e0b;
        box-shadow: 0 0 10px rgba(245,158,11,0.85);
        opacity: 0;
        transform: translate(-50%, -50%);
    }
    .pt.go {
        animation: ptMove 1.1s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes ptMove {
        0% { opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { opacity: 0; }
    }

    /* Final answer */
    .answer-bar {
        background: #0f172a;
        border-radius: 8px;
        padding: 0.6rem 0.85rem;
        color: #e2e8f0;
        font-size: 0.92rem;
        display: flex;
        gap: 0.6rem;
        align-items: flex-start;
        min-height: 52px;
        line-height: 1.45;
        transition: opacity 0.3s;
        margin-top: auto;
    }
    .answer-bar .lab {
        background: #22c55e;
        color: #0f172a;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 5px;
        flex-shrink: 0;
        letter-spacing: 0.05em;
    }
    .answer-bar .ans { flex: 1; font-family: 'Consolas','Monaco',monospace; }
    .answer-bar .ans .cite {
        color: #fbbf24;
        font-size: 0.78rem;
    }

    /* Footer legend */
    .rag2-foot {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.1rem;
        font-size: 0.7rem;
        color: var(--c-muted);
        padding-top: 0.2rem;
    }
    .rag2-foot .lg {
        display: flex; align-items: center; gap: 0.3rem;
    }
    .rag2-foot .sw {
        width: 10px; height: 10px; border-radius: 3px;
    }

    /* Step controls inside each panel */
    .rag2-ctrls {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        z-index: 1;
        flex-wrap: wrap;
    }
    .rag2-btn {
        background: #2563eb;
        color: white;
        border: 1px solid #2563eb;
        border-radius: 6px;
        padding: 0.28rem 0.7rem;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        font-family: var(--font-main);
    }
    .rag2-btn:hover { background: #1d4ed8; border-color: #1d4ed8; }
    .rag2-btn:disabled {
        background: #cbd5e1; border-color: #cbd5e1;
        cursor: not-allowed; opacity: 0.7;
    }
    .rag2-btn--ghost {
        background: white; color: #475569; border-color: #cbd5e1;
    }
    .rag2-btn--ghost:hover { background: #f1f5f9; border-color: #94a3b8; }
    .rag2-step-pill {
        font-size: 0.7rem;
        color: var(--c-muted);
        font-weight: 600;
        margin-left: auto;
        white-space: nowrap;
    }
    .rag2-dots { display: flex; gap: 5px; }
    .rag2-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #cbd5e1; transition: all 0.25s;
    }
    .rag2-dot.done { background: #22c55e; }
    .rag2-dot.cur  { background: #f59e0b; box-shadow: 0 0 5px rgba(245,158,11,0.6); transform: scale(1.4); }

    /* "Why vectorize?" button + modal */
    .why-btn {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #b45309;
        border-radius: 50%;
        width: 16px; height: 16px;
        font-size: 0.6rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        margin-left: 3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        vertical-align: middle;
    }
    .why-btn:hover {
        background: #f59e0b;
        color: white;
        transform: scale(1.15);
    }

    .why-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    .why-overlay.show {
        opacity: 1;
        pointer-events: auto;
    }
    .why-modal {
        background: white;
        border-radius: 14px;
        max-width: 720px;
        width: 90%;
        max-height: 90%;
        overflow-y: auto;
        padding: 1.4rem 1.6rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        transform: translateY(10px) scale(0.97);
        transition: transform 0.3s ease;
        position: relative;
        font-size: 0.92rem;
        line-height: 1.55;
    }
    .why-overlay.show .why-modal {
        transform: translateY(0) scale(1);
    }
    .why-modal h3 {
        margin: 0 0 0.6rem 0;
        font-size: 1.15rem;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
    .why-modal .lead {
        background: #fffbeb;
        border-left: 3px solid #f59e0b;
        padding: 0.6rem 0.85rem;
        font-size: 0.92rem;
        color: #78350f;
        border-radius: 0 6px 6px 0;
        margin-bottom: 0.8rem;
        line-height: 1.55;
    }
    .why-example {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
        margin: 0.6rem 0 0.5rem;
    }
    .why-example .box {
        padding: 0.6rem 0.75rem;
        border-radius: 8px;
        font-size: 0.92rem;
        line-height: 1.45;
    }
    .why-example .box.q { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; }
    .why-example .box.d { background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d; }
    .why-example .box .lab { font-size: 0.7rem; font-weight: 700; opacity: 0.7; display: block; margin-bottom: 3px; letter-spacing: 0.05em; }

    .why-section {
        font-size: 0.92rem;
        line-height: 1.6;
        color: #334155;
        margin: 0.6rem 0;
    }
    .why-section.note {
        font-size: 0.85rem;
        color: #64748b;
    }
    .why-section h4 {
        margin: 0.8rem 0 0.4rem;
        font-size: 1rem;
        color: #0f172a;
    }
    .why-section ul { margin: 0.3rem 0; padding-left: 1.3rem; }
    .why-section li { margin-bottom: 0.3rem; }
    .why-distance {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin: 0.5rem 0;
        font-family: 'Consolas', monospace;
        font-size: 0.88rem;
    }
    .why-distance .row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }
    .why-distance .pair { flex: 1; color: #475569; }
    .why-distance .dist { font-weight: 700; }
    .why-distance .dist.near { color: #16a34a; }
    .why-distance .dist.far  { color: #dc2626; }

    .why-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
        margin-top: 0.4rem;
    }
    .why-table th, .why-table td {
        padding: 0.5rem 0.7rem;
        border: 1px solid #e2e8f0;
        text-align: left;
        vertical-align: top;
    }
    .why-table th {
        background: #f8fafc;
        font-weight: 700;
        color: #0f172a;
        font-size: 0.9rem;
    }
    .why-table .yes { color: #16a34a; font-weight: 700; }
    .why-table .no  { color: #dc2626; font-weight: 700; }

    .why-close {
        position: absolute;
        top: 0.7rem;
        right: 0.8rem;
        background: #f1f5f9;
        border: none;
        width: 30px; height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        color: #475569;
        font-family: var(--font-main);
    }
    .why-close:hover { background: #e2e8f0; }
    .why-tagline {
        margin-top: 0.9rem;
        padding: 0.7rem 0.9rem;
        background: linear-gradient(90deg, #eff6ff, #f0fdf4);
        border-radius: 8px;
        font-size: 0.95rem;
        color: #0f172a;
        font-weight: 600;
        text-align: center;
        line-height: 1.5;
    }
</style>

<div class="rag2-root">
    <h2>4. 泛知识库类：本地知识库 + RAG + Agent <span class="sub">— 企业级 AI 协作架构</span></h2>

    <div class="rag2-body">

        <!-- ============ LEFT: INGESTION ============ -->
        <div class="rag2-panel">
            <div class="rag2-panel-title">
                <span class="dot"></span>
                <span>知识入库 · Ingestion</span>
                <span class="num" style="margin-left:auto;">PART 1</span>
            </div>

            <div class="ingest-stage">
                <div class="ingest-row">
                    <!-- 1. File -->
                    <div class="stage-block">
                        <div class="file-icon" id="ing-file">
                            <span class="ftype">PDF</span>
                            <span class="fline"></span>
                            <span class="fline"></span>
                            <span class="fline"></span>
                        </div>
                        <span class="stage-cap">原始文件</span>
                    </div>
                    <span class="ingest-arrow" id="arr-1">▶</span>
                    <!-- 2. Chunks -->
                    <div class="stage-block">
                        <div class="chunks" id="ing-chunks">
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                            <div class="chunk"></div>
                        </div>
                        <span class="stage-cap">语义切片<small>共 ~80 块</small></span>
                    </div>
                    <span class="ingest-arrow" id="arr-2">▶</span>
                    <!-- 3. Tagged -->
                    <div class="stage-block">
                        <div class="tagged" id="ing-tagged">
                            <div class="chunk"><span class="tag-pill">财务</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill b">差旅</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill p">合规</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill">财务</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill b">差旅</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill p">合规</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill">财务</span><span class="tag-bar"></span></div>
                            <div class="chunk"><span class="tag-pill b">差旅</span><span class="tag-bar"></span></div>
                        </div>
                        <span class="stage-cap">逐块打标签<small>每块均带标签</small></span>
                    </div>
                </div>

                <div class="ingest-row">
                    <!-- 4. Vectorize -->
                    <div class="stage-block">
                        <div class="vec-grid" id="ing-vec">
                            ${Array.from({length:18}).map(()=>'<div class="vec-cell"></div>').join('')}
                        </div>
                        <span class="vec-num">[0.12, -0.83, 0.45 …]</span>
                        <span class="stage-cap">向量化 Embedding <button class="why-btn" id="why-btn" title="为什么要向量化？">❓</button></span>
                    </div>
                    <span class="ingest-arrow" id="arr-3">▶</span>
                    <!-- 5. KB -->
                    <div class="stage-block">
                        <div class="kb-target" id="ing-kb">
                            <div class="stack"><span></span><span></span><span></span></div>
                            <span class="kbtxt">VECTOR DB</span>
                        </div>
                        <span class="stage-cap">本地知识库</span>
                    </div>
                </div>
            </div>

            <div class="ingest-status">
                <span class="badge" id="ing-badge">就绪</span>
                <span class="msg" id="ing-msg">点击"下一步"开始演示文件如何变成可检索的知识…</span>
            </div>

            <div class="rag2-ctrls">
                <button class="rag2-btn" id="ing-next">下一步 ▶</button>
                <button class="rag2-btn rag2-btn--ghost" id="ing-reset">↺ 重置</button>
                <div class="rag2-dots" id="ing-dots"></div>
                <span class="rag2-step-pill" id="ing-pill">0 / 5</span>
            </div>
        </div>

        <!-- ============ RIGHT: Q&A FLOW ============ -->
        <div class="rag2-panel">
            <div class="rag2-panel-title">
                <span class="dot"></span>
                <span>智能问答 · Retrieval & Generation</span>
                <span class="num" style="margin-left:auto;">PART 2</span>
            </div>

            <div class="qa-stage">
                <div class="user-bar">
                    <div class="av">👤</div>
                    <div class="qtxt" id="user-q">
                        <b>用户提问：</b>"公司最新的<b>出差住宿报销标准</b>是多少？2025 年有更新吗？"
                    </div>
                </div>

                <div class="cards-grid" id="cards-grid">
                    <div class="particle-layer">
                        <div class="pt" id="pt-1"></div>
                        <div class="pt" id="pt-2"></div>
                        <div class="pt" id="pt-3"></div>
                    </div>

                    <!-- Agent (top-left) -->
                    <div class="qa-card qa-card--agent" data-card="agent" data-pos="tl">
                        <div class="head">
                            <div class="ico">🤖</div>
                            <div>
                                <div class="name">Agent</div>
                                <div class="role">任务编排 · 工具调用</div>
                            </div>
                        </div>
                        <div class="status" id="st-agent">待命中…</div>
                    </div>

                    <!-- LLM (top-right) -->
                    <div class="qa-card qa-card--llm" data-card="llm" data-pos="tr">
                        <div class="head">
                            <div class="ico">🧠</div>
                            <div>
                                <div class="name">LLM</div>
                                <div class="role">大模型 · 理解与生成</div>
                            </div>
                        </div>
                        <div class="status" id="st-llm">待命中…</div>
                    </div>

                    <!-- RAG (bottom-left) -->
                    <div class="qa-card qa-card--rag" data-card="rag" data-pos="bl">
                        <div class="head">
                            <div class="ico">🔍</div>
                            <div>
                                <div class="name">RAG</div>
                                <div class="role">混合检索 · 排序</div>
                            </div>
                        </div>
                        <div class="status" id="st-rag">待命中…</div>
                    </div>

                    <!-- KB (bottom-right) -->
                    <div class="qa-card qa-card--kb" data-card="kb" data-pos="br">
                        <div class="head">
                            <div class="ico">🗄️</div>
                            <div>
                                <div class="name">本地知识库</div>
                                <div class="role">向量库 · 文档库</div>
                            </div>
                        </div>
                        <div class="status" id="st-kb">待命中…</div>
                    </div>
                </div>

                <div class="answer-bar" id="answer">
                    <span class="lab">回答</span>
                    <span class="ans" id="ans-text">点击"下一步"开始演示 Agent 如何检索并生成答案…</span>
                </div>

                <div class="rag2-ctrls">
                    <button class="rag2-btn" id="qa-next">下一步 ▶</button>
                    <button class="rag2-btn rag2-btn--ghost" id="qa-reset">↺ 重置</button>
                    <div class="rag2-dots" id="qa-dots"></div>
                    <span class="rag2-step-pill" id="qa-pill">0 / 8</span>
                </div>
            </div>
        </div>
    </div>

    <div class="rag2-foot">
        <span class="lg"><span class="sw" style="background:#16a34a;"></span>Agent 编排</span>
        <span class="lg"><span class="sw" style="background:#7c3aed;"></span>LLM 推理</span>
        <span class="lg"><span class="sw" style="background:#ea580c;"></span>RAG 检索</span>
        <span class="lg"><span class="sw" style="background:#2563eb;"></span>本地知识库</span>
        <span class="lg" style="margin-left:auto;">👆 点击下方"下一步"驱动演示</span>
    </div>

    <!-- "Why vectorize?" modal -->
    <div class="why-overlay" id="why-overlay">
        <div class="why-modal">
            <button class="why-close" id="why-close" aria-label="关闭">✕</button>
            <h3>🔢 为什么要向量化（Embedding）？</h3>

            <div class="lead">
                <b>核心问题：</b>计算机不懂"语义"，只会比对字符。<br>
                员工的口语化提问 和 文档里的正式措辞 往往<b>一个字都对不上</b>。
            </div>

            <div class="why-example">
                <div class="box q">
                    <span class="lab">用户提问</span>
                    "出差住宿能<b>报多少钱</b>？"
                </div>
                <div class="box d">
                    <span class="lab">文档原文</span>
                    "<b>差旅费</b>住宿<b>标准</b>为一线城市 500 元/晚"
                </div>
            </div>
            <div class="why-section note">
                两句话<b>没有任何相同关键词</b>（"出差"≠"差旅"，"报"≠"报销"，"多少钱"≠"标准"）。<br>
                传统的 Ctrl+F、SQL <code>LIKE</code>、ES 全文检索会<b style="color:#dc2626">直接漏掉</b>。
            </div>

            <div class="why-section">
                <h4>✨ 向量化做了什么</h4>
                <ul>
                    <li>用 Embedding 模型把每段文字转成一串数字（如 1024 维向量）—— 这串数字代表它的"<b>语义坐标</b>"</li>
                    <li><b>意思相近的句子，向量空间里的位置就相近</b></li>
                    <li>检索时把用户问题也转成向量，去库里找<b>距离最近的 Top-K 个片段</b></li>
                </ul>
                <div class="why-distance">
                    <div class="row"><span class="pair">"出差住宿报销" ↔ "差旅费住宿标准"</span><span class="dist near">距离 0.12 ✓ 很近</span></div>
                    <div class="row"><span class="pair">"出差住宿报销" ↔ "员工食堂菜单"</span><span class="dist far">距离 0.87 ✗ 很远</span></div>
                </div>
            </div>

            <div class="why-section">
                <h4>📊 三个关键能力对比</h4>
                <table class="why-table">
                    <thead>
                        <tr><th>能力</th><th>传统关键词检索</th><th>向量检索</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>同义词 / 改写</td><td><span class="no">✗</span> 必须字面匹配</td><td><span class="yes">✓</span> "出差" = "差旅"</td></tr>
                        <tr><td>跨语言</td><td><span class="no">✗</span> 中英不通</td><td><span class="yes">✓</span> 中英文混搜</td></tr>
                        <tr><td>模糊提问</td><td><span class="no">✗</span> "那个文件提过的标准"</td><td><span class="yes">✓</span> 按意图找</td></tr>
                        <tr><td>速度</td><td>慢（全表扫描）</td><td><span class="yes">✓</span> 毫秒级（HNSW 索引）</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="why-tagline">
                💡 一句话：向量化把"<b>文字</b>"变成"<b>可计算的语义指纹</b>" —— 让 AI 真正按<b>意思</b>搜，而不是按<b>字</b>搜。
            </div>
        </div>
    </div>
</div>
`;

export const onMount = (container) => {
    /* ============================================================
       INGESTION (left) — click-driven
       ============================================================ */
    const ingFile  = container.querySelector('#ing-file');
    const ingChunks = container.querySelectorAll('#ing-chunks .chunk');
    const ingTagged = container.querySelectorAll('#ing-tagged .chunk');
    const ingVec    = container.querySelectorAll('#ing-vec .vec-cell');
    const ingKB     = container.querySelector('#ing-kb');
    const ingBadge  = container.querySelector('#ing-badge');
    const ingMsg    = container.querySelector('#ing-msg');
    const ingCaps = container.querySelectorAll('.ingest-stage .stage-cap');
    const vecNum = container.querySelector('.vec-num');
    const arr1 = container.querySelector('#arr-1');
    const arr2 = container.querySelector('#arr-2');
    const arr3 = container.querySelector('#arr-3');
    const ingNextBtn = container.querySelector('#ing-next');
    const ingResetBtn = container.querySelector('#ing-reset');
    const ingDots = container.querySelector('#ing-dots');
    const ingPill = container.querySelector('#ing-pill');

    function resetIngestVisuals() {
        ingChunks.forEach(c=>c.classList.remove('show'));
        ingTagged.forEach(c=>c.classList.remove('show'));
        ingVec.forEach(c=>c.classList.remove('show'));
        ingCaps.forEach(c=>c.classList.remove('show'));
        vecNum.classList.remove('show');
        ingKB.classList.remove('show');
        arr1.classList.remove('show', 'live');
        arr2.classList.remove('show', 'live');
        arr3.classList.remove('show', 'live');
        ingFile.style.transform = '';
        ingKB.classList.remove('pulse');
    }

    const INGEST_STEPS = [
        { badge: '步骤 1', msg: '📄 接收文件 report-2025.pdf  (12.4 MB / 38 页)',
          act: () => { resetIngestVisuals(); ingFile.style.transform = 'scale(1.06)'; ingCaps[0].classList.add('show'); } },
        { badge: '步骤 2', msg: '✂️ 按语义边界切分 → 共生成 ~80 个 Chunk (≈ 500 字/块，此处仅示意 8 块)',
          act: () => { ingFile.style.transform = 'scale(1)'; arr1.classList.add('show', 'live'); ingCaps[1].classList.add('show');
                       ingChunks.forEach((c,i)=>setTimeout(()=>c.classList.add('show'), i*70)); } },
        { badge: '步骤 3', msg: '🏷️ 为每个 Chunk 提取关键词与元数据 → 自动打上标签（财务/差旅/合规…），便于过滤检索',
          act: () => { arr1.classList.remove('live'); arr2.classList.add('show', 'live'); ingCaps[2].classList.add('show');
                       ingTagged.forEach((c,i)=>setTimeout(()=>c.classList.add('show'), i*70)); } },
        { badge: '步骤 4', msg: '🔢 调用 Embedding 模型 → 每个 Chunk 转为 1024 维向量（让"语义"变成可计算的数字）',
          act: () => { arr2.classList.remove('live'); ingCaps[3].classList.add('show'); vecNum.classList.add('show');
                       ingVec.forEach((c,i)=>setTimeout(()=>c.classList.add('show'), i*30)); } },
        { badge: '步骤 5', msg: '💾 向量 + 原文 + 标签 写入向量库 (Qdrant)，HNSW 索引建立完成 ✓ 可被毫秒级检索',
          act: () => { arr3.classList.add('show', 'live'); ingCaps[4].classList.add('show'); ingKB.classList.add('show');
                       setTimeout(()=>{ ingKB.classList.add('pulse'); setTimeout(()=>ingKB.classList.remove('pulse'),900); }, 150); } },
    ];

    // build ingest dots
    INGEST_STEPS.forEach(()=>{
        const d = document.createElement('span');
        d.className = 'rag2-dot';
        ingDots.appendChild(d);
    });
    const ingDotEls = ingDots.querySelectorAll('.rag2-dot');

    let ingI = -1;
    function ingRender() {
        ingDotEls.forEach((d,j)=>{
            d.classList.remove('done','cur');
            if (j < ingI) d.classList.add('done');
            if (j === ingI) d.classList.add('cur');
        });
        ingPill.textContent = `${Math.max(0,ingI+1)} / ${INGEST_STEPS.length}`;
        if (ingI >= INGEST_STEPS.length - 1) {
            ingNextBtn.textContent = '✓ 已完成';
            ingNextBtn.disabled = true;
        } else {
            ingNextBtn.textContent = ingI < 0 ? '▶ 开始' : '下一步 ▶';
            ingNextBtn.disabled = false;
        }
    }
    function ingReset() {
        ingI = -1;
        resetIngestVisuals();
        ingBadge.textContent = '就绪';
        ingMsg.textContent = '点击"下一步"开始演示文件如何变成可检索的知识…';
        ingRender();
    }
    ingNextBtn.addEventListener('click', () => {
        if (ingI >= INGEST_STEPS.length - 1) return;
        ingI++;
        const s = INGEST_STEPS[ingI];
        ingBadge.textContent = s.badge;
        ingMsg.textContent = s.msg;
        s.act();
        ingRender();
    });
    ingResetBtn.addEventListener('click', ingReset);
    ingReset();

    /* ============================================================
       Q&A FLOW (right) — click-driven
       ============================================================ */
    const cards = {
        agent: container.querySelector('[data-card="agent"]'),
        llm:   container.querySelector('[data-card="llm"]'),
        rag:   container.querySelector('[data-card="rag"]'),
        kb:    container.querySelector('[data-card="kb"]'),
    };
    const status = {
        agent: container.querySelector('#st-agent'),
        llm:   container.querySelector('#st-llm'),
        rag:   container.querySelector('#st-rag'),
        kb:    container.querySelector('#st-kb'),
    };
    const grid = container.querySelector('#cards-grid');
    const ans  = container.querySelector('#ans-text');
    const pts  = [
        container.querySelector('#pt-1'),
        container.querySelector('#pt-2'),
        container.querySelector('#pt-3'),
    ];
    const qaNextBtn = container.querySelector('#qa-next');
    const qaResetBtn = container.querySelector('#qa-reset');
    const qaDots = container.querySelector('#qa-dots');
    const qaPill = container.querySelector('#qa-pill');

    function centerOf(pos) {
        const card = container.querySelector(`[data-pos="${pos}"]`);
        const gr = grid.getBoundingClientRect();
        const cr = card.getBoundingClientRect();
        return {
            x: cr.left - gr.left + cr.width/2,
            y: cr.top  - gr.top  + cr.height/2,
        };
    }

    function fireParticle(idx, fromPos, toPos, color) {
        const p = pts[idx];
        if (!p) return;
        const a = centerOf(fromPos);
        const b = centerOf(toPos);
        p.classList.remove('go');
        p.style.transition = 'none';
        p.style.left = a.x + 'px';
        p.style.top  = a.y + 'px';
        p.style.background = color || '#f59e0b';
        p.style.boxShadow = `0 0 12px ${color || '#f59e0b'}`;
        void p.offsetWidth;
        p.style.transition = 'left 0.9s cubic-bezier(0.4,0,0.2,1), top 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.9s';
        p.classList.add('go');
        p.style.left = b.x + 'px';
        p.style.top  = b.y + 'px';
    }

    function setActive(...names) {
        Object.keys(cards).forEach(k => {
            cards[k].classList.remove('active');
            if (!names.includes(k)) cards[k].classList.add('dim');
            else cards[k].classList.remove('dim');
        });
        names.forEach(n => cards[n] && cards[n].classList.add('active'));
    }

    function clearCards() {
        Object.keys(cards).forEach(k => {
            cards[k].classList.remove('active','dim');
            status[k].textContent = '待命中…';
        });
    }

    const QA_STEPS = [
        { run: () => {
            clearCards();
            setActive('agent');
            status.agent.textContent = '⟳ 接收用户问题…';
            ans.innerHTML = '点击"下一步"开始演示 Agent 如何检索并生成答案…';
        }},
        { run: () => {
            setActive('agent','llm');
            status.agent.textContent = '→ 调用 LLM 理解意图';
            status.llm.textContent   = '解析: 意图=查询报销标准\n实体: 出差/住宿/2025';
            fireParticle(0, 'tl', 'tr', '#7c3aed');
        }},
        { run: () => {
            setActive('agent','rag');
            status.agent.textContent = '✎ 拆解为 3 条子查询\n下发 RAG 模块';
            status.llm.textContent   = '✓ 已返回查询计划';
            status.rag.textContent   = 'Q1: 出差住宿标准\nQ2: 2025 报销更新\nQ3: 住宿城市分级';
            fireParticle(0, 'tl', 'bl', '#ea580c');
        }},
        { run: () => {
            setActive('rag','kb');
            status.rag.textContent = '⟳ 向量检索 + BM25\n并行执行 3 路查询';
            status.kb.textContent  = '🔎 搜索向量库…\nTop-K 候选: 12 个 Chunk';
            fireParticle(0, 'bl', 'br', '#2563eb');
            fireParticle(1, 'bl', 'br', '#2563eb');
        }},
        { run: () => {
            setActive('rag','kb');
            status.kb.textContent  = '✓ 返回相关片段:\n[#12] 报销制度 v3.2\n[#07] 2025 差旅通知';
            status.rag.textContent = '⚙ 重排序 / 去重\n保留 Top-3';
            fireParticle(0, 'br', 'bl', '#ea580c');
        }},
        { run: () => {
            setActive('rag','agent');
            status.rag.textContent   = '✓ 输出上下文片段\n带来源 [#12][#07]';
            status.agent.textContent = '⟳ 收到检索结果\n准备调用 LLM 推理';
            fireParticle(0, 'bl', 'tl', '#16a34a');
        }},
        { run: () => {
            setActive('agent','llm');
            status.agent.textContent = '→ 注入上下文\n请求生成回答';
            status.llm.textContent   = '🧠 基于片段推理…\n融合多源信息';
            fireParticle(0, 'tl', 'tr', '#7c3aed');
        }},
        { run: () => {
            setActive('agent','llm');
            status.llm.textContent   = '✓ 生成带引用回答';
            status.agent.textContent = '✓ 完成 · 返回用户';
            ans.innerHTML = '一线城市 <b style="color:#fbbf24">500 元/晚</b>，其他城市 350 元/晚；2025 起新增高铁一等座可报销。 <span class="cite">来源: [#12 报销制度 v3.2] [#07 2025 差旅通知]</span>';
        }},
    ];

    QA_STEPS.forEach(()=>{
        const d = document.createElement('span');
        d.className = 'rag2-dot';
        qaDots.appendChild(d);
    });
    const qaDotEls = qaDots.querySelectorAll('.rag2-dot');

    let qaI = -1;
    function qaRender() {
        qaDotEls.forEach((d,j)=>{
            d.classList.remove('done','cur');
            if (j < qaI) d.classList.add('done');
            if (j === qaI) d.classList.add('cur');
        });
        qaPill.textContent = `${Math.max(0,qaI+1)} / ${QA_STEPS.length}`;
        if (qaI >= QA_STEPS.length - 1) {
            qaNextBtn.textContent = '✓ 已完成';
            qaNextBtn.disabled = true;
        } else {
            qaNextBtn.textContent = qaI < 0 ? '▶ 开始' : '下一步 ▶';
            qaNextBtn.disabled = false;
        }
    }
    function qaReset() {
        qaI = -1;
        clearCards();
        ans.innerHTML = '点击"下一步"开始演示 Agent 如何检索并生成答案…';
        qaRender();
    }
    qaNextBtn.addEventListener('click', () => {
        if (qaI >= QA_STEPS.length - 1) return;
        qaI++;
        QA_STEPS[qaI].run();
        qaRender();
    });
    qaResetBtn.addEventListener('click', qaReset);
    qaReset();

    /* ============================================================
       "Why vectorize?" modal
       ============================================================ */
    const whyBtn     = container.querySelector('#why-btn');
    const whyOverlay = container.querySelector('#why-overlay');
    const whyClose   = container.querySelector('#why-close');
    if (whyBtn && whyOverlay) {
        whyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            whyOverlay.classList.add('show');
        });
        whyClose.addEventListener('click', () => whyOverlay.classList.remove('show'));
        whyOverlay.addEventListener('click', (e) => {
            if (e.target === whyOverlay) whyOverlay.classList.remove('show');
        });
    }
};

export default content;
