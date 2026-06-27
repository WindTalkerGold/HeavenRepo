import { html } from '../app.js';

const content = html`
    <style>
        .clickable-card {
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .clickable-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        }
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .modal-overlay.active {
            display: flex;
            opacity: 1;
        }
        .modal-content {
            background: #fff;
            padding: 2rem;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            width: 850px;
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            line-height: 1;
            cursor: pointer;
            color: #64748b;
        }
        .modal-close:hover {
            color: #ef4444;
        }
        .modal-body {
            margin-top: 1rem;
        }
        .cli-container {
            background: #1e1e1e;
            color: #4af626;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            padding: 1rem;
            border-radius: 8px;
            height: 300px;
            display: flex;
            flex-direction: column;
        }
        .cli-output {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 0.5rem;
            white-space: pre-wrap;
        }
        .cli-input-wrapper {
            display: flex;
            align-items: center;
        }
        .cli-input {
            background: transparent;
            color: #4af626;
            border: none;
            outline: none;
            flex: 1;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 1rem;
            margin-left: 0.5rem;
        }
    </style>

    <h2 style="font-size: 2rem; margin-bottom: 0.8rem;">9. 开始前必知：六块计算机基础敲门砖</h2>
    <p style="margin-bottom: 1rem; font-size: 1.1rem;">不需要成为程序员，但要知道 AI 在和哪些“计算机积木”打交道。</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem;">

        <div class="card clickable-card" data-modal="markdown" style="padding: 1rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #b91c1c;"><span style="margin-right: 0.5rem;">📝</span> 1. Markdown</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"AI的Word"</strong><br>比Word更轻量。你会发现不管是给大模型写复杂的Prompt，还是它回答你的结构化内容，默认都是采用这种带星号和井号的纯文本排版。</p>
        </div>

        <div class="card clickable-card" data-modal="json" style="padding: 1rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #0f766e;"><span style="margin-right: 0.5rem;">📄</span> 2. JSON</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"AI、程序之间对话的数据格式"</strong><br>一种结构极其清晰的文本格式（有很多键值对的大括号）。AI可以很容易地读懂和生成JSON，精确，高效。</p>
        </div>

        <div class="card clickable-card" data-modal="api" style="padding: 1rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #8b5cf6;"><span style="margin-right: 0.5rem;">🌐</span> 3. API (如 HTTP)</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"软件之间的沟通点单员"</strong><br>就像点外卖时的菜单服务。让代码去连接大模型或获取外界数据时，就是通过API发出标准请求然后等上菜。返回格式通常都是JSON。</p>
        </div>

        <div class="card clickable-card" data-modal="cli" style="padding: 1rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #1e40af;"><span style="margin-right: 0.5rem;">⌨️</span> 4. CLI (终端命令行)</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"剥去图形外衣的直接操控台"</strong><br>就像黑客电脑上的黑框框。这里没有花哨按钮，你用纯文本命令直接向操作系统或各类Agent发号施令。</p>
        </div>

        <div class="card clickable-card" data-modal="python" style="padding: 1rem; background: #fdf4ff; border-color: #f5d0fe;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #c026d3;"><span style="margin-right: 0.5rem;">🐍</span> 5. Python 与 JS/TS (Node)</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"AI时代的双核通用语言"</strong><br>Python 是当前底层AI算法调用、处理数据的主力；JS/TS 则是前端展示界面的霸主。两兄弟打配合，足已吃透80%的业务场景。</p>
        </div>

        <div class="card clickable-card" data-modal="git" style="padding: 1rem;">
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; color: #166534;"><span style="margin-right: 0.5rem;">📦</span> 6. Git (版本控制)</h3>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0;"><strong>"代码的时光机与保险柜"</strong><br>记录文稿的每次修改。Claude Code强制要求它，以确保如果不满意AI的改动，随时能一键安全撤销。</p>
        </div>

    </div>



    <div id="demo-modal" class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div id="modal-title-container"><h2 id="modal-title" style="margin-top:0; color: #1e293b;">标题</h2></div>
            <div id="modal-body" class="modal-body"></div>
        </div>
    </div>
`;

export const onMount = (container) => {
    const cards = container.querySelectorAll('.clickable-card');
    const modal = container.querySelector('#demo-modal');
    const modalTitle = container.querySelector('#modal-title');
    const modalBody = container.querySelector('#modal-body');
    const closeBtn = container.querySelector('.modal-close');

    modal.setAttribute('tabindex', '-1'); // enable focus for keyboard events

    const modalData = {
        markdown: {
            title: "Markdown 示例",
            content: `
                <div style="display: flex; gap: 20px; text-align: left;">
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin-top:0; color: #475569;">Markdown 原文</h4>
                        <pre style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 0.9rem; overflow-x: auto; border: 1px solid #e2e8f0; white-space: pre-wrap; color: #334155;">
# 大语言模型(LLM)简介

这是一段普通文本，其中包含**加粗强调**内容和*斜体*内容。

## 为什么使用Markdown？

- **简洁高效**：键盘不离手即可排版
- **通用性强**：几乎所有AI大模型默认输出

### 常见模型对比

| 模型名称 | 开发者 | 强项 |
| -------- | ------ | ---- |
| GPT-4    | OpenAI | 综合 |
| Claude 3 | Anthropic| 代码 |

> AI是提升效率的放大器。

![AI示意图](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80)
                        </pre>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin-top:0; color: #475569;">展示效果</h4>
                        <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; border-top: 4px solid #b91c1c; color: #334155;">
                            <h1 style="margin-top:0; font-size: 1.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; color: #0f172a;">大语言模型(LLM)简介</h1>
                            <p style="font-size: 0.95rem;">这是一段普通文本，其中包含<strong>加粗强调</strong>内容和<em>斜体</em>内容。</p>
                            <h2 style="font-size: 1.4rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 1rem; color: #0f172a;">为什么使用Markdown？</h2>
                            <ul style="padding-left: 1.5rem; margin-bottom: 1rem; font-size: 0.95rem;">
                                <li><strong>简洁高效</strong>：键盘不离手即可排版</li>
                                <li><strong>通用性强</strong>：几乎所有AI大模型默认输出</li>
                            </ul>
                            <h3 style="font-size: 1.2rem; color: #0f172a;">常见模型对比</h3>
                            <table style="border-collapse: collapse; width: 100%; text-align: left; margin-bottom: 1rem; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <tr style="background: #f8fafc;">
                                    <th style="border: 1px solid #e2e8f0; padding: 6px;">模型名称</th>
                                    <th style="border: 1px solid #e2e8f0; padding: 6px;">开发者</th>
                                    <th style="border: 1px solid #e2e8f0; padding: 6px;">强项</th>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">GPT-4</td>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">OpenAI</td>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">综合</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">Claude 3</td>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">Anthropic</td>
                                    <td style="border: 1px solid #e2e8f0; padding: 6px;">代码</td>
                                </tr>
                            </table>
                            <blockquote style="border-left: 4px solid #cbd5e1; padding-left: 1rem; color: #64748b; font-style: italic; margin: 1rem 0;">
                                AI是提升效率的放大器。
                            </blockquote>
                            <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80" alt="示意图" style="max-width: 100%; border-radius: 6px; border: 1px solid #e2e8f0;">
                        </div>
                    </div>
                </div>
            `
        },
        json: {
            title: "JSON (JavaScript Object Notation) 示例",
            content: `
                <p style="color: #64748b; margin-top:0; font-size: 1.1rem;">JSON 是一种轻量级的数据交换格式，非常结构化。</p>
                <div style="background: #1e1e1e; padding: 20px; border-radius: 8px; text-align: left; overflow-x: auto; font-size: 1.1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
<pre style="margin: 0; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; line-height: 1.5; color: #d4d4d4;">
<span style="color: #d4d4d4;">{</span>
  <span style="color: #9cdcfe;">"user"</span>: <span style="color: #d4d4d4;">{</span>
    <span style="color: #9cdcfe;">"id"</span>: <span style="color: #b5cea8;">1001</span>,
    <span style="color: #9cdcfe;">"name"</span>: <span style="color: #ce9178;">"张三"</span>,
    <span style="color: #9cdcfe;">"role"</span>: <span style="color: #ce9178;">"产品经理"</span>,
    <span style="color: #9cdcfe;">"isActive"</span>: <span style="color: #569cd6;">true</span>,
    <span style="color: #9cdcfe;">"skills"</span>: <span style="color: #d4d4d4;">[</span>
      <span style="color: #ce9178;">"需求分析"</span>,
      <span style="color: #ce9178;">"敏捷开发"</span>,
      <span style="color: #ce9178;">"AI运用"</span>
    <span style="color: #d4d4d4;">]</span>,
    <span style="color: #9cdcfe;">"preferences"</span>: <span style="color: #d4d4d4;">{</span>
      <span style="color: #9cdcfe;">"theme"</span>: <span style="color: #ce9178;">"dark"</span>,
      <span style="color: #9cdcfe;">"notifications"</span>: <span style="color: #569cd6;">false</span>
    <span style="color: #d4d4d4;">}</span>
  <span style="color: #d4d4d4;">}</span>,
  <span style="color: #9cdcfe;">"status"</span>: <span style="color: #ce9178;">"success"</span>,
  <span style="color: #9cdcfe;">"timestamp"</span>: <span style="color: #ce9178;">"2026-04-10T14:30:00Z"</span>
<span style="color: #d4d4d4;">}</span>
</pre>
                </div>
            `
        },
        api: {
            title: "API (Application Programming Interface) 抓包演示",
            content: `
                <p style="color: #64748b; margin-top:0; font-size: 1.1rem;">这展示了网页的F12 Network 面板调试：客户端与服务器通过API通信的JSON数据。</p>
                <div style="text-align: center; background: #0f172a; padding: 15px; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                    <img src="./assets/f12_network.png" alt="F12 Network Debug" style="max-width: 100%; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.5);">
                </div>
            `
        },
        cli: {
            title: "CLI (终端命令行) 交互体验",
            content: `
                <p style="color: #64748b; margin-top:0; font-size: 1.1rem;">在下方的黑框中输入代码并体验终端交互：</p>
                <p style="font-size: 1.1rem;">请尝试输入 <code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600; color:#1e40af; border:1px solid #cbd5e1;">calc24 3 3 8 8</code> 然后按回车。</p>
                <div class="cli-container" id="cli-demo" style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                    <div class="cli-output" id="cli-output" style="font-size: 1.2rem;">Welcome to Interactive Terminal v1.0.0
Type your command below.
</div>
                    <div class="cli-input-wrapper">
                        <span style="color: #4af626; font-weight: bold; margin-right: 8px; font-size: 1.2rem;">sh$</span>
                        <input class="cli-input" id="cli-input" type="text" autocomplete="off" style="font-size: 1.2rem;">
                    </div>
                </div>
            `
        },
        python: {
            title: "Python 🐍 与 JS 💛 简单示例",
            content: `
                <p style="color: #64748b; margin-top:0; font-size: 1.1rem;">这两门语言是你进行AI编程时的最佳搭档。</p>
                <div style="display: flex; gap: 20px; text-align: left;">
                    <div style="flex: 1; min-width: 0; background: #1e1e1e; padding: 20px; border-radius: 8px; border-top: 4px solid #3776ab; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                        <h4 style="margin-top:0; color: #fff;">Python (偏后端 & 数据处理)</h4>
                        <pre style="color: #d4d4d4; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 1rem; margin:0; white-space: pre-wrap;"><span style="color: #c586c0;">def</span> <span style="color: #dcdcaa;">greet_ai</span>(name):
    <span style="color: #c586c0;">return</span> <span style="color: #ce9178;">f"Hello </span><span style="color: #569cd6;">{</span>name<span style="color: #569cd6;">}</span><span style="color: #ce9178;">, optimizing efficiency..."</span>

<span style="color: #4ec9b0;">print</span>(greet_ai(<span style="color: #ce9178;">"Commander"</span>))</pre>
                    </div>
                    <div style="flex: 1; min-width: 0; background: #1e1e1e; padding: 20px; border-radius: 8px; border-top: 4px solid #f7df1e; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                        <h4 style="margin-top:0; color: #fff;">JavaScript / TypeScript (偏前端界面)</h4>
                        <pre style="color: #d4d4d4; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 1rem; margin:0; white-space: pre-wrap;"><span style="color: #569cd6;">const</span> <span style="color: #dcdcaa;">greetAI</span> = (name) <span style="color: #569cd6;">=></span> {
    <span style="color: #c586c0;">return</span> <span style="color: #ce9178;">\`Hello <span style="color: #569cd6;">\${</span>name<span style="color: #569cd6;">}</span>, rendering UI...\`</span>;
}

<span style="color: #9cdcfe;">console</span>.<span style="color: #dcdcaa;">log</span>(greetAI(<span style="color: #ce9178;">"Commander"</span>))</pre>
                    </div>
                </div>
            `
        },
        git: {
            title: "Git 版本控制",
            content: `
                <div style="text-align: center; padding: 40px;">
                    <span style="font-size: 6rem; display: block; margin-bottom: 30px; animation: bounce 2s infinite;">📦</span>
                    <p style="font-size: 1.5rem; margin-bottom: 15px; color: #1e293b; font-weight: bold;">Git 让你随时掌控代码历史</p>
                    <p style="color: #64748b; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 1.2rem; background: #f1f5f9; display: inline-block; padding: 8px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">> git commit -m 'Initial commit'</p>
                </div>
            `
        }
    };

    const openModal = (type) => {
        const data = modalData[type];
        if (data) {
            modalTitle.innerHTML = data.title;
            modalBody.innerHTML = data.content;
            modal.classList.add('active');
            modal.focus({ preventScroll: true });

            if (type === 'cli') {
                const cliInput = modalBody.querySelector('#cli-input');
                const cliOutput = modalBody.querySelector('#cli-output');

                setTimeout(() => {
                    cliInput && cliInput.focus();
                }, 100);

                if (cliInput && cliOutput) {
                    cliInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            const val = cliInput.value.trim();
                            cliOutput.innerHTML += `\n<span style="color:#f8fafc;">sh$ ${val}</span>`;

                            if (val.startsWith('calc24')) {
                                const parts = val.replace('calc24', '').trim().split(/\s+/);
                                const nums = parts.map(Number);
                                if (nums.length === 4 && !nums.includes(NaN)) {
                                    const solve24 = (arr) => {
                                        const EPS = 1e-6;
                                        let found = null;
                                        const dfs = (list, exprs) => {
                                            if (found) return;
                                            if (list.length === 1) {
                                                if (Math.abs(list[0] - 24) < EPS) found = exprs[0];
                                                return;
                                            }
                                            for (let i = 0; i < list.length; i++) {
                                                for (let j = 0; j < list.length; j++) {
                                                    if (i !== j) {
                                                        const nextList = [], nextExprs = [];
                                                        for (let k = 0; k < list.length; k++) {
                                                            if (k !== i && k !== j) { nextList.push(list[k]); nextExprs.push(exprs[k]); }
                                                        }
                                                        for (const op of ['+', '-', '*', '/']) {
                                                            if ((op === '+' || op === '*') && i > j) continue;
                                                            let nextVal;
                                                            if (op === '+') nextVal = list[i] + list[j];
                                                            else if (op === '-') nextVal = list[i] - list[j];
                                                            else if (op === '*') nextVal = list[i] * list[j];
                                                            else if (op === '/') {
                                                                if (Math.abs(list[j]) < EPS) continue;
                                                                nextVal = list[i] / list[j];
                                                            }
                                                            nextList.push(nextVal);
                                                            nextExprs.push('(' + exprs[i] + ' ' + op + ' ' + exprs[j] + ')');
                                                            dfs(nextList, nextExprs);
                                                            nextList.pop();
                                                            nextExprs.pop();
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        dfs(arr, arr.map(String));
                                        if (found && found.startsWith('(') && found.endsWith(')')) found = found.slice(1, -1);
                                        return found;
                                    };
                                    const result = solve24(nums);
                                    if (result) {
                                        cliOutput.innerHTML += `\n<span style="color:#38bdf8; font-weight: bold;">[Success] Found solution: ${result} = 24</span>`;
                                    } else {
                                        cliOutput.innerHTML += `\n<span style="color:#ef4444; font-weight: bold;">[Failed] No solution found for ${nums.join(' ')}.</span>`;
                                    }
                                } else {
                                    cliOutput.innerHTML += `\n<span style="color:#ef4444;">Invalid arguments. Usage: calc24 N N N N</span>`;
                                }
                            } else if (val) {
                                cliOutput.innerHTML += `\n<span style="color:#ef4444;">Command not recognized: "${val}". Try 'calc24 3 3 8 8'</span>`;
                            }

                            cliInput.value = '';
                            cliOutput.scrollTop = cliOutput.scrollHeight;
                        }
                    });
                }
            }
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 300);
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const modalType = card.getAttribute('data-modal');
            openModal(modalType);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle Escape key to close modal — listener on the modal element, not document
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
};

export default content;
