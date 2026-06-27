import { html } from '../app.js';

export const onMount = (container) => {
    // Tree view toggle logic
    const treeItems = container.querySelectorAll('.tree-file');
    const contentPanel = container.querySelector('#file-content');
    const fileTitle = container.querySelector('#file-title');

    const filesData = {
        'skill': `<span style="color: #569cd6;">---</span>
<span style="color: #9cdcfe;">name</span>: <span style="color: #ce9178;">calc24_solver</span>
<span style="color: #9cdcfe;">description</span>: <span style="color: #ce9178;">调用刚才写好的 24 点求解程序。当用户给出四个数字时，自动返回一个等于 24 的表达式；无解则说明无解。</span>
<span style="color: #569cd6;">---</span>

<span style="color: #569cd6;"># 24点计算技能</span>

<span style="color: #d4d4d4;">刚才我们已经用 Claude Code 写出了求解器。现在把它封装成一个 Skill，任何 Agent 只要看到 24 点任务，就知道该调用这个程序，而不是靠大模型硬算。</span>

<span style="color: #c586c0;">## 触发条件</span>

<span style="color: #d4d4d4;">当用户明确要求计算 24 点，或者在微信/飞书/命令行里给出类似“请用 a, b, c, d 算 24 点”的任务时，应使用本技能。</span>

<span style="color: #c586c0;">## 使用方法</span>

<span style="color: #b5cea8;">1.</span> <span style="color: #d4d4d4;">从用户消息中提取四个数字。</span>
<span style="color: #b5cea8;">2.</span> <span style="color: #d4d4d4;">在系统 shell 中执行以下命令：</span>
   <span style="color: #569cd6;">\`\`\`bash</span>
   <span style="color: #4ec9b0;">python</span> <span style="color: #d4d4d4;">calc24.py &lt;num1&gt; &lt;num2&gt; &lt;num3&gt; &lt;num4&gt;</span>
   <span style="color: #569cd6;">\`\`\`</span>`,

        'py': `<span style="color: #c586c0;">import</span> sys

<span style="color: #9cdcfe;">EPSILON</span> = <span style="color: #b5cea8;">1e-9</span>

<span style="color: #c586c0;">def</span> <span style="color: #dcdcaa;">tidy</span>(<span style="color: #9cdcfe;">expr</span>):
    <span style="color: #c586c0;">if</span> expr.<span style="color: #dcdcaa;">startswith</span>(<span style="color: #ce9178;">"("</span>) <span style="color: #c586c0;">and</span> expr.<span style="color: #dcdcaa;">endswith</span>(<span style="color: #ce9178;">")"</span>):
        <span style="color: #c586c0;">return</span> expr[<span style="color: #b5cea8;">1</span>:-<span style="color: #b5cea8;">1</span>]
    <span style="color: #c586c0;">return</span> expr

<span style="color: #c586c0;">def</span> <span style="color: #dcdcaa;">search</span>(<span style="color: #9cdcfe;">items</span>):
    <span style="color: #c586c0;">if</span> <span style="color: #dcdcaa;">len</span>(items) == <span style="color: #b5cea8;">1</span>:
        value, expr = items[<span style="color: #b5cea8;">0</span>]
        <span style="color: #c586c0;">return</span> tidy(expr) <span style="color: #c586c0;">if</span> <span style="color: #dcdcaa;">abs</span>(value - <span style="color: #b5cea8;">24</span>) &lt; <span style="color: #9cdcfe;">EPSILON</span> <span style="color: #c586c0;">else</span> <span style="color: #569cd6;">None</span>

    <span style="color: #c586c0;">for</span> i <span style="color: #c586c0;">in</span> <span style="color: #dcdcaa;">range</span>(<span style="color: #dcdcaa;">len</span>(items)):
        <span style="color: #c586c0;">for</span> j <span style="color: #c586c0;">in</span> <span style="color: #dcdcaa;">range</span>(<span style="color: #dcdcaa;">len</span>(items)):
            <span style="color: #c586c0;">if</span> i == j:
                <span style="color: #c586c0;">continue</span>

            rest = [item <span style="color: #c586c0;">for</span> index, item <span style="color: #c586c0;">in</span> <span style="color: #dcdcaa;">enumerate</span>(items) <span style="color: #c586c0;">if</span> index <span style="color: #c586c0;">not in</span> (i, j)]
            a_value, a_expr = items[i]
            b_value, b_expr = items[j]
            candidates = [
                (a_value + b_value, <span style="color: #ce9178;">f"({a_expr} + {b_expr})"</span>),
                (a_value - b_value, <span style="color: #ce9178;">f"({a_expr} - {b_expr})"</span>),
                (a_value * b_value, <span style="color: #ce9178;">f"({a_expr} × {b_expr})"</span>),
            ]

            <span style="color: #c586c0;">if</span> <span style="color: #dcdcaa;">abs</span>(b_value) &gt; <span style="color: #9cdcfe;">EPSILON</span>:
                candidates.<span style="color: #dcdcaa;">append</span>((a_value / b_value, <span style="color: #ce9178;">f"({a_expr} ÷ {b_expr})"</span>))

            <span style="color: #c586c0;">for</span> candidate <span style="color: #c586c0;">in</span> candidates:
                found = search(rest + [candidate])
                <span style="color: #c586c0;">if</span> found:
                    <span style="color: #c586c0;">return</span> found

    <span style="color: #c586c0;">return</span> <span style="color: #569cd6;">None</span>

<span style="color: #c586c0;">def</span> <span style="color: #dcdcaa;">solve_24</span>(<span style="color: #9cdcfe;">numbers</span>):
    items = [(num, <span style="color: #dcdcaa;">str</span>(num)) <span style="color: #c586c0;">for</span> num <span style="color: #c586c0;">in</span> numbers]
    <span style="color: #c586c0;">return</span> search(items)

<span style="color: #c586c0;">if</span> __name__ == <span style="color: #ce9178;">"__main__"</span>:
    <span style="color: #c586c0;">if</span> <span style="color: #dcdcaa;">len</span>(sys.<span style="color: #9cdcfe;">argv</span>) != <span style="color: #b5cea8;">5</span>:
        <span style="color: #4ec9b0;">print</span>(<span style="color: #ce9178;">"Usage: python calc24.py n1 n2 n3 n4"</span>)
        sys.<span style="color: #dcdcaa;">exit</span>(<span style="color: #b5cea8;">1</span>)

    numbers = [<span style="color: #dcdcaa;">float</span>(arg) <span style="color: #c586c0;">for</span> arg <span style="color: #c586c0;">in</span> sys.<span style="color: #9cdcfe;">argv</span>[<span style="color: #b5cea8;">1</span>:]]
    result = solve_24(numbers)
    <span style="color: #4ec9b0;">print</span>(<span style="color: #ce9178;">f"{result} = 24"</span> <span style="color: #c586c0;">if</span> result <span style="color: #c586c0;">else</span> <span style="color: #ce9178;">"No solution"</span>)`
    };

    treeItems.forEach(item => {
        item.addEventListener('click', () => {
            treeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const fileKey = item.getAttribute('data-file');
            fileTitle.innerHTML = item.innerHTML;
            contentPanel.innerHTML = filesData[fileKey];
        });
    });

    // Default select
    if (treeItems[0]) treeItems[0].click();

    // Deepseek Modal Logic
    const dsBtn = container.querySelector('#show-deepseek-btn');
    const dsModal = container.querySelector('#deepseek-modal');
    const dsClose = container.querySelector('#deepseek-close');

    dsBtn.addEventListener('click', () => {
        dsModal.style.display = 'flex';
    });
    dsClose.addEventListener('click', () => {
        dsModal.style.display = 'none';
    });
    dsModal.addEventListener('click', (e) => {
        if (e.target === dsModal) dsModal.style.display = 'none';
    });

    // CLI Demo Logic
    const runBtn = container.querySelector('#run-demo-btn');
    const cliOutput = container.querySelector('#cli-demo-output');

    let isRunning = false;
    runBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;
        cliOutput.innerHTML = '';
        runBtn.textContent = '运行中...';
        runBtn.style.opacity = '0.5';

        const lines = [
            { text: '> /calc24 3 3 8 8', delay: 400, color: '#f8fafc', bold: true },
            { text: '\n🤔 [思考中] 龙虾/Agent 识别到 24 点任务，匹配到 calc24_solver Skill...', delay: 800, color: '#94a3b8' },
            { text: '\n⚙️  Running skill calc24_solver (python calc24.py 3 3 8 8)...', delay: 600, color: '#38bdf8' },
            { text: '\n✅ 程序执行完毕。返回结果: 8 / (3 - (8 / 3)) = 24', delay: 1000, color: '#10b981' },
            { text: '\n🤖 龙虾回复用户：算出来了，8 ÷ (3 - 8 ÷ 3) = 24。', delay: 600, color: '#f8fafc', bold: true }
        ];

        for (const line of lines) {
            await new Promise(r => setTimeout(r, line.delay || 300));

            const el = document.createElement('span');
            el.style.color = line.color;
            if (line.bold) el.style.fontWeight = 'bold';
            cliOutput.appendChild(el);

            for (let i = 0; i < line.text.length; i++) {
                el.textContent += line.text[i];
                await new Promise(r => setTimeout(r, 20)); // typing speed
                if (i % 5 === 0) cliOutput.scrollTop = cliOutput.scrollHeight;
            }
            cliOutput.scrollTop = cliOutput.scrollHeight;
        }

        runBtn.textContent = '重新演示';
        runBtn.style.opacity = '1';
        isRunning = false;
    });
};

export default html`
    <style>
        .split-layout {
            display: flex;
            gap: 1.5rem;
            margin-top: 1rem;
            height: 300px;
            width: 100%;
            max-width: 900px;
        }
        
        .tree-panel {
            flex: 0 0 280px;
            background: #f1f5f9;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        .tree-header {
            font-weight: bold;
            color: #334155;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
        }

        .tree-dir {
            color: #475569;
            padding: 0.3rem 0;
            display: flex;
            align-items: center;
            font-weight: 500;
        }

        .tree-file {
            color: #64748b;
            padding: 0.4rem 0.5rem;
            margin: 0.2rem 0;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            transition: all 0.2s;
        }

        .tree-file:hover {
            background: #e2e8f0;
            color: #0f172a;
        }

        .tree-file.active {
            background: #3b82f6;
            color: #fff;
        }

        .code-panel {
            flex: 1;
            background: #1e1e1e;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
            overflow: hidden;
            min-width: 0;
        }

        .code-header {
            background: #2d2d2d;
            padding: 0.6rem 1rem;
            color: #e2e8f0;
            border-bottom: 1px solid #404040;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            display: flex;
            align-items: center;
        }

        .code-content {
            padding: 1rem;
            color: #d4d4d4;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            margin: 0;
            white-space: pre-wrap;
            overflow: auto;
            flex: 1;
            font-size: 1rem;
        }

        .terminal-panel {
            margin-top: 1rem;
            background: #0f172a;
            border-radius: 8px;
            padding: 1.2rem;
            height: 180px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            border-top: 4px solid #10b981;
            width: 100%;
            max-width: 900px;
        }

        .terminal-output {
            flex: 1;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 1rem;
            white-space: pre-wrap;
            overflow-y: auto;
            line-height: 1.6;
        }

        .run-btn {
            position: absolute;
            bottom: 1rem;
            right: 1.5rem;
            background: #10b981;
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .run-btn:hover {
            background: #059669;
        }

        .indent-1 { margin-left: 1rem; border-left: 1px solid #cbd5e1; padding-left: 0.5rem;}
        .indent-2 { margin-left: 2rem; border-left: 1px solid #cbd5e1; padding-left: 0.5rem;}
        .indent-3 { margin-left: 3rem; border-left: 1px solid #cbd5e1; padding-left: 0.5rem;}
    </style>

    <h2 class="huge-title" style="font-size: 2.2rem; margin-bottom: 0.5rem; background: linear-gradient(90deg, #0f172a, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        11. 进阶概念：把固定流程沉淀成 SKILL
    </h2>
    <p style="font-size: 1.15rem; color: #475569; margin-bottom: 0.5rem;">
        <strong>SKILLs：</strong> 刚才的 24 点程序已经跑通；下一步是把它沉淀成可调用的能力，让 Claude Code、龙虾或其他 Agent 遇到同类任务时直接调用。
    </p>
    <div style="background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 2px solid #86efac; border-radius: 8px; padding: 0.6rem 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 1.8rem;">📋</span>
        <div>
            <div style="font-weight: 800; color: #166534; font-size: 1.05rem;">核心比喻：SKILL = 给所有 Agent 的工具说明书</div>
            <div style="font-size: 0.92rem; color: #15803d; line-height: 1.4;">先把 24 点求解器写出来，再告诉 AI：什么时候用、怎么调用、如何解释结果。这样龙虾这类外层助手也能复用同一套能力。</div>
        </div>
    </div>

    <!-- Top Layout: Tree View + Code View -->
    <div class="split-layout">
        <!-- Tree Panel -->
        <div class="tree-panel">
            <div class="tree-header">📁 项目目录 (Workspace)</div>
            
            <div class="tree-dir">📂 .claude</div>
            <div class="tree-dir indent-1">📂 skills</div>
            <div class="tree-dir indent-2">📂 calc24</div>
            <div class="tree-file indent-3" data-file="skill">
                <span style="color:#f59e0b; margin-right:6px;">📝</span> SKILL.md
            </div>
            <div class="tree-file indent-3" data-file="py">
                <span style="color:#3b82f6; margin-right:6px;">🐍</span> calc24.py
            </div>
        </div>

        <!-- Code Content Panel -->
        <div class="code-panel">
            <div class="code-header" id="file-title">
                <span style="color:#f59e0b; margin-right:6px;">📝</span> SKILL.md
            </div>
            <pre class="code-content" id="file-content"></pre>
        </div>
    </div>

    <!-- Bottom Layout: Claude Code Terminal Simulation -->
    <div class="terminal-panel">
        <div class="terminal-output" id="cli-demo-output">
<span style="color: #64748b;">Claude Code Ready. Type '/' to use tools.</span>
<span style="color: #64748b;">────────────────────────────────────────</span>
</div>
        <button class="run-btn" id="run-demo-btn">▶ 点击演示 AI 执行流程</button>
    </div>
    <div>
        <button id="show-deepseek-btn" style="background: #3b82f6; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; margin-top: 10px; display: inline-flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background 0.2s;">
            对比：如果不用工具，只让大模型“心算”24 点会怎样？
        </button>
    </div>
    <!-- Deepseek Modal -->
    <div id="deepseek-modal" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 1000; align-items: center; justify-content: center; flex-direction: column; border-radius: 12px;">
        <div style="background: #fff; padding: 1.5rem; border-radius: 8px; position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            <button id="deepseek-close" style="position: absolute; top: -12px; right: -12px; background: #ef4444; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 1.2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; z-index: 10;">×</button>
            <h3 style="margin-top: 0; margin-bottom: 1rem; color: #0f172a; font-size: 1.3rem;">🚨 生聊对比现场：让缺乏底层执行能力的大模型直接算 8、8、3、3 的 24 点</h3>
            <div style="overflow-y: auto; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                <img src="./assets/calc24-deepseek.png" style="max-width: 100%; height: auto; object-fit: contain; max-height: calc(85vh - 100px);" alt="Deepseek calculation" />
            </div>
            <p style="text-align: center; margin-top: 10px; margin-bottom: 0; font-size: 0.95rem; color: #64748b;">(注：虽然语言大模型推理极强，但在涉及严密穷举的数学/逻辑时极易产生幻觉瞎凑。必须搭配外部系统或脚本工具！)</p>
        </div>
    </div>
    
    
`;
