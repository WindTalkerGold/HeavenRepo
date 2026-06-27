import { html } from '../app.js';

export const onMount = (container) => {
    const icons = container.querySelectorAll('.float-icon');
    icons.forEach((icon, i) => {
        icon.style.animationDelay = `${i * 0.3}s`;
    });
};

export default html`
    <style>
        .cover-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .cover-badge {
            display: inline-block;
            background: linear-gradient(135deg, #dbeafe, #ede9fe);
            color: #3b82f6;
            font-size: 1rem;
            font-weight: 600;
            padding: 6px 18px;
            border-radius: 20px;
            margin-bottom: 1.5rem;
            letter-spacing: 1px;
        }
        .cover-title {
            font-size: 3.8rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.2rem;
            background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .cover-quote {
            max-width: 850px;
            margin: 0 auto 2.5rem auto;
            position: relative;
            padding: 0 2rem;
        }
        .quote-mark {
            position: absolute;
            top: -2rem;
            left: -1.5rem;
            font-family: 'Times New Roman', serif;
            font-size: 7rem;
            color: #3b82f6;
            opacity: 0.12;
            line-height: 1;
            pointer-events: none;
        }
        .quote-text {
            font-size: 1.55rem;
            color: #1e293b;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-style: italic;
            font-weight: 500;
            line-height: 1.6;
            margin: 0 0 1.1rem 0;
            position: relative;
            z-index: 1;
            text-align: left;
        }
        .quote-author {
            font-size: 1.15rem;
            color: #64748b;
            margin: 0;
            text-align: right;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .cover-goals {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.8rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        .goal-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 0.65rem 1rem;
            border-radius: 10px;
            font-size: 1.05rem;
            color: #334155;
            font-weight: 500;
            transition: all 0.3s;
        }
        .goal-chip:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
            border-color: #bae6fd;
        }
        .goal-icon {
            font-size: 1.35rem;
        }
        .cover-hint {
            font-size: 0.9rem;
            color: #94a3b8;
        }
        .cover-hint kbd {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 2px 8px;
            font-family: inherit;
            font-size: 0.85rem;
        }
        .float-icon {
            position: absolute;
            font-size: 2rem;
            opacity: 0.12;
            animation: floatUp 6s ease-in-out infinite;
        }
        @keyframes floatUp {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }
    </style>

    <div class="cover-wrap">
        <span class="float-icon" style="top: 8%; left: 8%;">🧠</span>
        <span class="float-icon" style="top: 15%; right: 12%;">🤖</span>
        <span class="float-icon" style="bottom: 20%; left: 10%;">⚡</span>
        <span class="float-icon" style="bottom: 12%; right: 8%;">🚀</span>
        <span class="float-icon" style="top: 45%; left: 5%;">💡</span>
        <span class="float-icon" style="top: 40%; right: 5%;">🛠️</span>

        <div class="cover-badge">AI EFFICIENCY · 2026</div>

        <h1 class="cover-title">不懂代码，也能驾驭 AI</h1>

        <div class="cover-quote">
            <div class="quote-mark">&ldquo;</div>
            <p class="quote-text">
                You're not going to lose your job to AI. You're going to lose your job to someone who uses AI, so get to it, that's the most important thing.
            </p>
            <p class="quote-author">—— Jensen Huang (黄仁勋)</p>
        </div>

        <div class="cover-goals">
            <div class="goal-chip">
                <span class="goal-icon">🗺️</span> 理解 AI 能力边界
            </div>
            <div class="goal-chip">
                <span class="goal-icon">🧩</span> 认识 AI 落地场景
            </div>
            <div class="goal-chip">
                <span class="goal-icon">💻</span> 理解写代码新范式
            </div>
            <div class="goal-chip">
                <span class="goal-icon">🎯</span> 掌握提效核心理念
            </div>
        </div>

        <p class="cover-hint">按 <kbd>→</kbd> 或点击右下角箭头开始</p>
    </div>
`;
