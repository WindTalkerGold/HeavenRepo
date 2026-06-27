import { html } from '../app.js';

export default html`
    <style>
        .hazard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            margin-bottom: 0.6rem;
        }
        .hazard-card {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 0.5rem 0.7rem;
            border-left: 3px solid #ef4444;
        }
        .hazard-card h4 {
            margin: 0 0 0.15rem 0;
            font-size: 0.95rem;
            color: #991b1b;
        }
        .hazard-card p {
            margin: 0;
            font-size: 0.8rem;
            color: #7f1d1d;
            line-height: 1.35;
        }
        .rule-card {
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 0.55rem 0.7rem;
            flex: 1;
            min-width: 0;
        }
        .rule-num {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            background: #22c55e;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8rem;
        }
        .rule-card .text { flex: 1; }
        .rule-card strong { color: #166534; font-size: 0.9rem; }
        .rule-card p { margin: 0; font-size: 0.8rem; color: #14532d; line-height: 1.35; }
        .example-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 0.55rem 0.8rem;
            display: flex;
            gap: 0.8rem;
            align-items: flex-start;
        }
        .example-box code {
            background: #fff;
            border: 1px solid #fcd34d;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 0.8rem;
            color: #92400e;
        }
    </style>
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly; padding-bottom: 1rem;">

    <h2 style="font-size: 1.7rem; margin-bottom: 0.3rem; background: linear-gradient(90deg, #dc2626, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        14.2 认知陷阱：AI 也会“胡说八道”
    </h2>

    <div style="background: linear-gradient(135deg, #fef2f2, #fff7ed); border: 1px solid #fecaca; border-radius: 12px; padding: 0.5rem 0.8rem; margin-bottom: 0.5rem;">
        <div style="font-size: 1.1rem; font-weight: 800; color: #991b1b; margin-bottom: 0.1rem;">⚠️ "大语言模型"，不是"知识库"：它不是在查数据库，而是在做概率造句。</div>
        <div style="font-size: 0.99rem; color: #7f1f1d; line-height: 1.35;">它"太能说了"，经常一本正经地胡说八道。</div>
    </div>

    <h3 style="margin: 0 0 0.3rem 0; font-size: 1rem; color: #0f172a;">最容易幻觉的场景</h3>
    <div class="hazard-grid">
        <div class="hazard-card">
            <h4>🔢 数字与统计</h4>
            <p>市场数据、财报数字、年份、百分比——模型会自信地编造</p>
        </div>
        <div class="hazard-card">
            <h4>📚 引用与出处</h4>
            <p>编造不存在的论文、作者名、书名，看起来有模有样</p>
        </div>
        <div class="hazard-card">
            <h4>⚖️ 法条与政策</h4>
            <p>不同国家的法律条文、合规要求，易混淆或直接虚构</p>
        </div>
        <div class="hazard-card">
            <h4>🧮 精确逻辑计算</h4>
            <p>多步推理、复杂算术、穷举类问题——靠推理硬扛容易出错</p>
        </div>
    </div>

    <h3 style="margin: 0 0 0.3rem 0; font-size: 1rem; color: #0f172a;">三条保命原则</h3>
    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <div class="rule-card">
            <div class="rule-num">1</div>
            <div class="text">
                <strong>重要信息交叉验证</strong>
                <p>让 AI 给出具体来源（链接/文档名/章节），人进行核实。不能核实的就当它编的。</p>
            </div>
        </div>
        <div class="rule-card">
            <div class="rule-num">2</div>
            <div class="text">
                <strong>关键计算交给工具</strong>
                <p>算账、数据分析别让模型心算。让它写代码执行，代码跑出来才是准的。</p>
            </div>
        </div>
        <div class="rule-card">
            <div class="rule-num">3</div>
            <div class="text">
                <strong>结合知识库</strong>
                <p>对于专业、私域的问题，准备好知识库（流程、制度文档等）。</p>
            </div>
        </div>
    </div>

    <div class="example-box">
        <span style="font-size: 1.2rem;">💡</span>
        <div>
            <div style="font-weight: 700; color: #92400e; font-size: 0.85rem; margin-bottom: 0.15rem;">实战建议：写 Prompt 时加上这句话</div>
            <div style="font-size: 0.85rem; color: #78350f; line-height: 1.4;">
            <code>"请列出你的回答中哪些是确凿事实、哪些是你的推理推断。对于数据和引用，请给出你可以确认的来源。"</code>
            </div>
        </div>
    </div>

    <div class="example-box">
        <span style="font-size: 1.2rem;">💡</span>
        <div>
            <div style="font-weight: 700; color: #92400e; font-size: 0.85rem; margin-bottom: 0.15rem;">实战建议：用AI写工具，用工具完成任务</div>
            <div style="font-size: 0.85rem; color: #78350f; line-height: 1.4;">
            <code>"请你给我写一段Python程序，检查输入的Excel文件中，是否每一行都有开始时间、结束时间，且结束时间不早于开始时间。"</code>
            </div>
        </div>
    </div>

    </div>
`;
