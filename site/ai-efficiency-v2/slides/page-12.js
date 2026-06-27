import { html } from '../app.js';

export const onMount = (container) => {
    const terminal = container.querySelector('#xlsx-terminal');
    const startBtn = container.querySelector('#xlsx-start-btn');
    const resultLink = container.querySelector('#result-link');
    let isRunning = false;

    const lines = [
        { type: 'prompt', text: '> /xlsx 分析 "Financial Sample.xlsx"的数据，将数据分析结果写到 demo.html', delay: 40 },
        { type: 'prompt', text: '  用chart.js画图，并告诉我核心insight', delay: 40 },
        { type: 'system', text: '', delay: 300 },
        { type: 'thinking', text: '╭─ ✦ Embellishing… (21s · ↓ 213 tokens · thinking)', delay: 0 },
        { type: 'task', text: '│  ■ 分析Excel文件数据结构', delay: 0 },
        { type: 'task', text: '│  □ 生成数据分析结果', delay: 0 },
        { type: 'task', text: '│  □ 总结核心insight', delay: 0 },
        { type: 'task', text: '│  □ 创建HTML可视化页面', delay: 0 },
        { type: 'system', text: '', delay: 400 },
        { type: 'action', text: '⚡ Create file: assets/analyze.py', delay: 0 },
        { type: 'code', text: '   import pandas as pd', delay: 0 },
        { type: 'code', text: '   df = pd.read_excel("Financial Sample.xlsx")', delay: 0 },
        { type: 'code', text: '   print(f"Data shape: {df.shape}")', delay: 0 },
        { type: 'code', text: '   print(f"Columns: {list(df.columns)}")', delay: 0 },
        { type: 'code', text: '   ...（共 42 行数据提取脚本）', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'action', text: '⚡ Run: python assets/analyze.py', delay: 0 },
        { type: 'output', text: '   Data shape: (700, 16)', delay: 0 },
        { type: 'output', text: '   Columns: [Segment, Country, Product, Sales, Profit, ...]', delay: 0 },
        { type: 'output', text: '   ✓ 数据提取完成 → assets/data_info.json', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'thinking', text: '╭─ ✦ 分析数据维度... 发现 6 个产品、5 个国家、5 个细分市场', delay: 0 },
        { type: 'task-done', text: '│  ✓ 分析Excel文件数据结构', delay: 0 },
        { type: 'task', text: '│  ■ 生成数据分析结果', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'action', text: '⚡ Create file: assets/data_analysis.py', delay: 0 },
        { type: 'code', text: '   # 产品维度分析', delay: 0 },
        { type: 'code', text: '   product_sales = df.groupby("Product").agg({...})', delay: 0 },
        { type: 'code', text: '   # 地区维度分析', delay: 0 },
        { type: 'code', text: '   country_sales = df.groupby("Country").agg({...})', delay: 0 },
        { type: 'code', text: '   # 月度趋势 + 折扣效果 + 价格分析', delay: 0 },
        { type: 'code', text: '   ...（共 85 行多维度分析脚本）', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'action', text: '⚡ Run: python assets/data_analysis.py', delay: 0 },
        { type: 'output', text: '   ✓ 产品销售分析完成', delay: 0 },
        { type: 'output', text: '   ✓ 地区利润率计算完成', delay: 0 },
        { type: 'output', text: '   ✓ 月度趋势生成完成', delay: 0 },
        { type: 'output', text: '   ✓ 导出 → assets/chart_data.json (6 个图表数据)', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'task-done', text: '│  ✓ 生成数据分析结果', delay: 0 },
        { type: 'task', text: '│  ■ 总结核心insight', delay: 0 },
        { type: 'system', text: '', delay: 400 },
        { type: 'thinking', text: '╭─ ✦ 核心发现:', delay: 0 },
        { type: 'insight', text: '│  💡 Paseo 是最畅销产品，占总销售额的 27.8%', delay: 0 },
        { type: 'insight', text: '│  💡 美国是最大市场，但利润率仅12%，低于均值', delay: 0 },
        { type: 'insight', text: '│  💡 Enterprise 细分市场出现亏损（-$61万），需关注', delay: 0 },
        { type: 'insight', text: '│  💡 高折扣利润率仅9.1% vs 低折扣17.9%，建议优化', delay: 0 },
        { type: 'insight', text: '│  💡 10月和12月出现销售高峰，建议增加备货', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'task-done', text: '│  ✓ 总结核心insight', delay: 0 },
        { type: 'task', text: '│  ■ 创建HTML可视化页面', delay: 0 },
        { type: 'system', text: '', delay: 300 },
        { type: 'action', text: '⚡ Create file: demo.html (674 行)', delay: 0 },
        { type: 'code', text: '   引入 Chart.js CDN', delay: 0 },
        { type: 'code', text: '   6个图表: 柱状图/折线图/雷达图/散点图', delay: 0 },
        { type: 'code', text: '   KPI 汇总卡片 + 核心洞察列表', delay: 0 },
        { type: 'code', text: '   响应式布局 + 渐变配色', delay: 0 },
        { type: 'system', text: '', delay: 500 },
        { type: 'success', text: '╰─ ✅ 全部完成！共生成 4 个文件，耗时 21 秒', delay: 0 },
        { type: 'success', text: '   📊 demo.html — 可视化报告（点击右下角查看 →）', delay: 0 },
        { type: 'cost', text: '   💰 本次 AI 成本: ¥0.43', delay: 0 },
    ];

    const typeStyles = {
        'prompt': 'color: #7dd3fc; font-weight: 600;',
        'system': '',
        'thinking': 'color: #c084fc;',
        'task': 'color: #94a3b8;',
        'task-done': 'color: #4ade80;',
        'action': 'color: #fbbf24; font-weight: 600;',
        'code': 'color: #6ee7b7; opacity: 0.85;',
        'output': 'color: #e2e8f0;',
        'insight': 'color: #fde68a;',
        'success': 'color: #4ade80; font-weight: 600;',
        'cost': 'color: #fbbf24; font-weight: 600;',
    };

    async function typeText(span, text, speed) {
        for (let i = 0; i < text.length; i++) {
            span.textContent += text[i];
            terminal.scrollTop = terminal.scrollHeight;
            await new Promise(r => setTimeout(r, speed));
        }
    }

    async function runDemo() {
        if (isRunning) return;
        isRunning = true;
        startBtn.style.display = 'none';
        terminal.innerHTML = '';
        resultLink.style.display = 'none';

        for (const line of lines) {
            const div = document.createElement('div');
            div.style.cssText = typeStyles[line.type] || '';
            div.style.minHeight = '1.3em';
            div.style.lineHeight = '1.5';
            terminal.appendChild(div);

            if (line.type === 'system') {
                await new Promise(r => setTimeout(r, line.delay));
            } else if (line.type === 'prompt') {
                await typeText(div, line.text, line.delay);
            } else {
                await new Promise(r => setTimeout(r, 60));
                div.textContent = line.text;
                terminal.scrollTop = terminal.scrollHeight;
            }

            if (line.delay > 0 && line.type !== 'prompt') {
                await new Promise(r => setTimeout(r, line.delay));
            }
        }

        resultLink.style.display = 'inline-flex';
        isRunning = false;
    }

    if (startBtn) {
        startBtn.addEventListener('click', runDemo);
    }

    // Modal logic
    const modal = container.querySelector('#xlsx-modal');
    const modalImg = container.querySelector('#xlsx-modal-img');
    const evidenceBtns = container.querySelectorAll('.evidence-btn');

    evidenceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-src');
            modalImg.src = src;
            modal.style.display = 'flex';
        });
    });

    modal.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImg.src = '';
    });
};

export default html`
    <style>
        .xlsx-terminal {
            background: #0f172a;
            border-radius: 0 0 10px 10px;
            padding: 1.2rem;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
            color: #e2e8f0;
            height: 380px;
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #1e293b;
            border-top: none;
            scrollbar-width: thin;
            scrollbar-color: #334155 transparent;
            line-height: 1.5;
            position: relative;
            width: 100%;
            box-sizing: border-box;
        }
        .xlsx-terminal::-webkit-scrollbar { width: 6px; }
        .xlsx-terminal::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .xlsx-terminal div {
            white-space: pre-wrap;
            word-break: break-all;
        }
        .xlsx-header {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #1e293b;
            padding: 10px 16px;
            border-radius: 10px 10px 0 0;
            border: 1px solid #1e293b;
        }
        .xlsx-dot { width: 10px; height: 10px; border-radius: 50%; }
        .xlsx-start-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 5;
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
            white-space: nowrap;
        }
        .xlsx-start-btn:hover {
            transform: translate(-50%, -52%) scale(1.05);
            box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.5);
        }
        .case-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .detail-item {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 0.8rem 1rem;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .detail-label {
            font-weight: 700;
            color: #1e293b;
            font-size: 0.9rem;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .detail-content {
            font-size: 0.85rem;
            color: #64748b;
            line-height: 1.4;
        }
        .cost-highlight {
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border: 1px solid #fde68a;
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
        }
        .premium-btn {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
            border: none;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        .premium-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);
            filter: brightness(1.05);
        }
        .data-source-banner {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f1f5f9;
            padding: 10px 16px;
            border-radius: 8px;
            border-left: 4px solid #94a3b8;
            margin-bottom: 1.5rem;
        }
        .skill-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e40af;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .evidence-btns {
            display: flex;
            gap: 8px;
            margin-top: 0.5rem;
        }
        .evidence-btn {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            color: #475569;
            padding: 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .evidence-btn:hover {
            background: #e2e8f0;
            border-color: #94a3b8;
            color: #1e293b;
        }
        .modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            backdrop-filter: blur(8px);
            animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .modal-img {
            max-width: 95vw;
            max-height: 95vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255,255,255,0.1);
        }
    </style>
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly; padding-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
        <h2 style="font-size: 2rem; margin: 0; background: linear-gradient(90deg, #1e40af, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            12. 实战案例：Excel → 可视化报告
        </h2>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="skill-badge">📦 xlsx Skill</span>
            <span class="skill-badge">🤖 Claude Code</span>
        </div>
    </div>

    <!-- Data Source Header -->
    <div class="data-source-banner" style="margin-bottom: 0.6rem;">
        <span style="font-size: 1.2rem;">📊</span>
        <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #334155;">输入文件：Financial Sample.xlsx</div>
            <div style="font-size: 0.85rem; color: #64748b;">
                微软官方提供的 Power BI 练习数据集，包含 2013-2014 年全球零售订单明细（700行数据）。
            </div>
        </div>
        <a href="https://www.kaggle.com/datasets/konstantinognev/financial-samplexlsx" target="_blank" style="font-size: 0.85rem; color: #3b82f6; text-decoration: none; font-weight: 600; background: white; padding: 4px 12px; border-radius: 6px; border: 1px solid #cbd5e1;">查看 Kaggle 原数据集 →</a>
    </div>

    <div class="grid-2" style="gap: 1.5rem; align-items: start;">
        <!-- Left Column: Terminal (2:1 width) -->
        <div style="min-width: 0; flex: 2;">
            <div style="position: relative; width: 100%;">
                <div class="xlsx-header">
                    <span class="xlsx-dot" style="background: #ef4444;"></span>
                    <span class="xlsx-dot" style="background: #fbbf24;"></span>
                    <span class="xlsx-dot" style="background: #22c55e;"></span>
                    <span style="color: #94a3b8; font-size: 0.8rem; margin-left: 8px; font-family: monospace;">Claude Code — Financial Sample.xlsx 分析全过程</span>
                </div>
                <div class="xlsx-terminal" id="xlsx-terminal">
                   <div style="color: #94a3b8; text-align: center; margin-top: 155px; font-style: italic;">等待开始演示...</div>
                </div>
                <button class="xlsx-start-btn" id="xlsx-start-btn">▶ 播放 AI 协作全过程</button>
                
                <!-- Modal Overlay -->
                <div class="modal-overlay" id="xlsx-modal">
                    <img class="modal-img" id="xlsx-modal-img" src="">
                </div>
            </div>
        </div>

        <!-- Right Column: Case Explanations (1/3 width) -->
        <div class="case-details" style="flex: 1; min-width: 0;">
            <div class="detail-item">
                <div class="detail-label">📥 需求 Prompt</div>
                <div class="detail-content" style="font-style: italic;">"分析这份 Excel，用 Chart.js 画图，提取 Insight 并生成报告"</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">⚡ 自动化执行</div>
                <div class="detail-content">AI 自动调用 <b>xlsx skill</b> 解析数据，编写 Python 脚本进行聚合计算，构建可视化网页。</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">🖼️ 过程回溯 (原图)</div>
                <div class="evidence-btns">
                    <button class="evidence-btn" data-src="./assets/prompt.png">💬 初始Prompt</button>
                    <button class="evidence-btn" data-src="./assets/steps.png">📋 步骤拆解</button>
                    <button class="evidence-btn" data-src="./assets/extract-excel.png">⚙️ Python解析</button>
                </div>
            </div>

            <div class="cost-highlight">
                <div style="font-size: 0.9rem; color: #854d0e; font-weight: 700; margin-bottom: 0.2rem;">💰 全自动分析成本</div>
                <div style="font-size: 1.6rem; color: #a16207; font-weight: 800;">¥ 0.43</div>
                <div style="font-size: 0.8rem; color: #ca8a04;">(DeepSeek-V3.2 + Claude Code)</div>
            </div>

            <a class="premium-btn" id="result-link" href="./demo.html" target="_blank">
                📊 预览生成的网页报告 →
            </a>
        </div>
    </div>
    </div>
`;
