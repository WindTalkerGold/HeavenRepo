import { html } from '../app.js';

export const onMount = (container) => {
    const runBtn = container.querySelector('#run-claude-demo');
    const terminal = container.querySelector('#claude-demo-terminal');
    const preview = container.querySelector('#calc24-preview');
    const solveBtn = container.querySelector('#calc24-solve');
    const inputs = Array.from(container.querySelectorAll('.calc24-input'));
    const result = container.querySelector('#calc24-result');

    function solve24(numbers) {
        const epsilon = 1e-9;
        const initial = numbers.map(num => ({ value: num, expr: String(num) }));

        function tidy(expr) {
            return expr.startsWith('(') && expr.endsWith(')') ? expr.slice(1, -1) : expr;
        }

        function search(items) {
            if (items.length === 1) {
                return Math.abs(items[0].value - 24) < epsilon ? tidy(items[0].expr) : null;
            }

            for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < items.length; j++) {
                    if (i === j) continue;

                    const rest = items.filter((_, index) => index !== i && index !== j);
                    const a = items[i];
                    const b = items[j];
                    const candidates = [
                        { value: a.value + b.value, expr: `(${a.expr} + ${b.expr})` },
                        { value: a.value - b.value, expr: `(${a.expr} - ${b.expr})` },
                        { value: a.value * b.value, expr: `(${a.expr} × ${b.expr})` }
                    ];

                    if (Math.abs(b.value) > epsilon) {
                        candidates.push({ value: a.value / b.value, expr: `(${a.expr} ÷ ${b.expr})` });
                    }

                    for (const candidate of candidates) {
                        const found = search([...rest, candidate]);
                        if (found) return found;
                    }
                }
            }

            return null;
        }

        return search(initial);
    }

    function updateResult() {
        const numbers = inputs.map(input => Number(input.value));
        if (numbers.some(num => !Number.isFinite(num))) {
            result.className = 'answer fail';
            result.textContent = '请输入 4 个有效数字';
            return;
        }

        const expression = solve24(numbers);
        if (expression) {
            result.className = 'answer ok';
            result.textContent = `${expression} = 24`;
        } else {
            result.className = 'answer fail';
            result.textContent = '这组数字无解';
        }
    }

    const lines = [
        { text: '> claude', cls: 'cmd' },
        { text: 'Claude Code Ready. Tell me what to build.', cls: 'muted' },
        { text: '> 请帮我写一个完整的 24 点网页小游戏。用户输入任意 4 个数字，程序要穷举 + - × ÷ 和括号组合，找到一个等于 24 的表达式；如果无解就提示无解。', cls: 'cmd' },
        { text: '● 我会创建一个单文件网页：index.html', cls: 'think' },
        { text: '  - 4 个数字输入框', cls: 'task' },
        { text: '  - 递归穷举所有数字顺序和四则运算', cls: 'task' },
        { text: '  - 处理除以 0、无解、结果误差', cls: 'task' },
        { text: '  - 在浏览器里直接显示表达式', cls: 'task' },
        { text: '✦ Write index.html', cls: 'action' },
        { text: '✦ Test: 3, 3, 8, 8 → found', cls: 'action' },
        { text: '✦ Test: 1, 1, 1, 1 → no solution', cls: 'action' },
        { text: '✓ 完成：右侧就是一个可交互的完整求解器', cls: 'success' }
    ];

    async function play() {
        runBtn.disabled = true;
        runBtn.textContent = '演示中...';
        terminal.innerHTML = '';
        preview.classList.remove('show');

        for (const line of lines) {
            const row = document.createElement('div');
            row.className = `term-line ${line.cls}`;
            terminal.appendChild(row);
            for (let i = 0; i < line.text.length; i++) {
                row.textContent += line.text[i];
                terminal.scrollTop = terminal.scrollHeight;
                await new Promise(r => setTimeout(r, line.cls === 'cmd' ? 18 : 8));
            }
            await new Promise(r => setTimeout(r, 160));
        }

        preview.classList.add('show');
        updateResult();
        runBtn.disabled = false;
        runBtn.textContent = '重新演示';
    }

    runBtn.addEventListener('click', play);
    solveBtn.addEventListener('click', updateResult);
    inputs.forEach(input => input.addEventListener('keydown', event => {
        if (event.key === 'Enter') updateResult();
    }));
    updateResult();
};

export default html`
    <style>
        .demo-root {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 0.8rem;
        }
        .demo-intro {
            background: linear-gradient(135deg, #eff6ff, #f0fdf4);
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 0.75rem 1rem;
            color: #334155;
            font-size: 1rem;
            line-height: 1.45;
        }
        .demo-grid {
            display: grid;
            grid-template-columns: 1.12fr 0.88fr;
            gap: 1rem;
            min-height: 0;
            flex: 1;
        }
        .terminal-wrap {
            background: #0f172a;
            border-radius: 12px;
            border: 1px solid #1e293b;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        .terminal-head {
            background: #1e293b;
            color: #cbd5e1;
            padding: 0.55rem 0.8rem;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .terminal {
            flex: 1;
            padding: 0.9rem 1rem;
            overflow: auto;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.84rem;
            line-height: 1.55;
        }
        .term-line { white-space: pre-wrap; min-height: 1.4em; }
        .cmd { color: #7dd3fc; font-weight: 700; }
        .muted { color: #94a3b8; }
        .think { color: #c084fc; }
        .task { color: #e2e8f0; }
        .action { color: #fbbf24; font-weight: 700; }
        .success { color: #4ade80; font-weight: 700; }
        .run-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.45rem 0.9rem;
            border-radius: 999px;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
        }
        .run-btn:disabled { opacity: 0.65; cursor: default; }
        .right-col {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            min-height: 0;
        }
        .prompt-card, .preview-card, .lesson-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.75rem 0.9rem;
        }
        .prompt-card h3, .preview-card h3, .lesson-card h3 {
            margin: 0 0 0.35rem 0;
            color: #0f172a;
            font-size: 1rem;
        }
        .prompt-card pre {
            margin: 0;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 0.6rem;
            white-space: pre-wrap;
            color: #334155;
            font-size: 0.82rem;
            line-height: 1.45;
        }
        .mini-browser {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            overflow: hidden;
            background: #f8fafc;
            opacity: 0.45;
            transform: translateY(8px);
            transition: all 0.35s ease;
        }
        .mini-browser.show {
            opacity: 1;
            transform: translateY(0);
        }
        .browser-bar {
            background: #e2e8f0;
            padding: 0.35rem 0.55rem;
            font-size: 0.7rem;
            color: #64748b;
        }
        .game-ui {
            padding: 0.8rem;
            text-align: center;
            background: linear-gradient(135deg, #ffffff, #eff6ff);
        }
        .num-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.35rem;
            margin: 0.55rem 0;
        }
        .calc24-input {
            width: 100%;
            box-sizing: border-box;
            background: white;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 0.42rem 0.2rem;
            font-weight: 800;
            color: #1d4ed8;
            text-align: center;
            font-size: 1rem;
            font-family: inherit;
        }
        .solve-button {
            display: inline-block;
            background: #16a34a;
            color: white;
            border: none;
            border-radius: 999px;
            padding: 0.45rem 1rem;
            font-weight: 800;
            font-size: 0.85rem;
            margin-bottom: 0.55rem;
            cursor: pointer;
            font-family: inherit;
        }
        .answer {
            border-radius: 8px;
            padding: 0.5rem;
            font-weight: 800;
            font-size: 0.86rem;
            line-height: 1.35;
            min-height: 1.2em;
            word-break: break-word;
        }
        .answer.ok {
            background: #ecfdf5;
            border: 1px solid #86efac;
            color: #166534;
        }
        .answer.fail {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
        }
        .lesson-card ul {
            margin: 0;
            padding-left: 1.1rem;
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.5;
        }
    </style>

    <div class="demo-root">
        <h2 style="font-size: 2rem; margin: 0; background: linear-gradient(90deg, #2563eb, #16a34a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            8. 例子：用 AI 完成一个 24 点简易计算器
        </h2>

        <div class="demo-grid">
            <div class="terminal-wrap">
                <div class="terminal-head">
                    <div class="dots">
                        <span class="dot" style="background:#ef4444"></span>
                        <span class="dot" style="background:#f59e0b"></span>
                        <span class="dot" style="background:#22c55e"></span>
                    </div>
                    <span>Claude Code CLI</span>
                    <button class="run-btn" id="run-claude-demo">点击演示</button>
                </div>
                <div class="terminal" id="claude-demo-terminal">
                    <div class="term-line muted">点击右上角按钮，演示从一句需求到一个完整 HTML 求解器。</div>
                </div>
            </div>

            <div class="right-col">
                <div class="prompt-card">
                    <h3>给 AI 的一句话需求</h3>
                    <pre>请帮我写一个完整的 24 点网页小游戏。用户输入任意 4 个数字，程序要穷举 + - × ÷ 和括号组合，找到一个等于 24 的表达式；如果无解就提示无解。</pre>
                </div>

                <div class="preview-card">
                    <h3>最后得到的网页效果</h3>
                    <div class="mini-browser show" id="calc24-preview">
                        <div class="browser-bar">index.html</div>
                        <div class="game-ui">
                            <div style="font-weight: 900; color:#0f172a;">24 点求解器</div>
                            <div class="num-row">
                                <input class="calc24-input" type="number" value="3">
                                <input class="calc24-input" type="number" value="3">
                                <input class="calc24-input" type="number" value="8">
                                <input class="calc24-input" type="number" value="8">
                            </div>
                            <button class="solve-button" id="calc24-solve">求解 24 点</button>
                            <div class="answer ok" id="calc24-result"></div>
                        </div>
                    </div>
                </div>

                <div class="lesson-card">
                    <h3>这个例子想说明什么</h3>
                    <ul>
                        <li>自然语言即可编程。</li>
                        <li>人提供需求，让AI去实现。</li>
                        <li>清晰的验收能力。</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;
