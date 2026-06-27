import { html } from '../app.js';

export const onMount = (container) => {
    const tabBtns = container.querySelectorAll('.scenario-tab');
    const panels = container.querySelectorAll('.scenario-panel');
    const promptBtn = container.querySelector('#prompt-tip-btn');
    const promptOverlay = container.querySelector('#prompt-overlay');
    const promptClose = container.querySelector('#prompt-overlay-close');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            tabBtns.forEach(item => item.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            btn.classList.add('active');
            container.querySelector(`[data-panel="${tab}"]`).classList.add('active');
        });
    });

    promptBtn.addEventListener('click', () => {
        promptOverlay.style.display = 'flex';
    });

    promptClose.addEventListener('click', () => {
        promptOverlay.style.display = 'none';
    });

    promptOverlay.addEventListener('click', (event) => {
        if (event.target === promptOverlay) promptOverlay.style.display = 'none';
    });
};

export default html`
    <style>
        .scenario-root {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .scenario-title {
            font-size: 2.2rem;
            margin-bottom: 0.8rem;
            background: linear-gradient(90deg, #0f172a, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .scenario-shell {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 12px;
            padding: 1.1rem 1.3rem;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .scenario-tabs {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.9rem;
            margin-bottom: 0.9rem;
            flex-shrink: 0;
        }
        .scenario-tab {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            color: #64748b;
            padding: 0.75rem 1.35rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.15rem;
            font-weight: 700;
            transition: all 0.2s;
            font-family: inherit;
        }
        .scenario-tab:hover {
            background: #e0f2fe;
            border-color: #bae6fd;
            color: #0369a1;
        }
        .scenario-tab.active {
            background: #e0f2fe;
            border-color: #0284c7;
            color: #0369a1;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .scenario-panel {
            display: none;
            flex: 1;
            min-height: 0;
            opacity: 0;
            transform: translateY(8px);
        }
        .scenario-panel.active {
            display: flex;
            flex-direction: column;
            animation: panelFade 0.28s ease forwards;
        }
        @keyframes panelFade {
            to { opacity: 1; transform: translateY(0); }
        }

        .chat-intro {
            margin-bottom: 0.5rem;
            color:#475569;
            font-size: 1.15rem;
            line-height: 1.55;
        }
        .prompt-inline-btn {
            margin-left: 0.5rem;
            background: #fffbeb;
            border: 1px solid #fcd34d;
            color: #92400e;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-family: inherit;
        }
        .tool-logo {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            background-color: #fff;
            margin: 0 auto;
            display: block;
        }
        .tool-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            font-size: 1.03rem;
            background: #fff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            border-radius: 8px;
            overflow: hidden;
        }
        .tool-table td {
            border: 1px solid #e2e8f0;
            padding: 12px 16px;
            text-align: left;
            vertical-align: middle;
            color: #475569;
        }
        .tool-table tr:hover td {
            background-color: #f8fafc;
        }
        .logo-col {
            width: 58px;
            text-align: center;
        }
        .name-col {
            width: 160px;
            font-weight: bold;
            color: #0f172a !important;
            font-size: 1.1rem;
        }
        .desc-col {
            line-height: 1.55;
        }

        .enterprise-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.85rem;
            flex: 1;
            min-height: 0;
        }
        .enterprise-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.85rem;
            min-height: 0;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        }
        .enterprise-card h3 {
            margin: 0 0 0.4rem;
            color: #0f172a;
            font-size: 1.25rem;
        }
        .enterprise-num {
            width: 1.8rem;
            height: 1.8rem;
            border-radius: 50%;
            background: #1e40af;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            margin-bottom: 0.55rem;
            flex-shrink: 0;
        }
        .enterprise-card p {
            font-size: 0.98rem;
            color:#334155;
            line-height:1.5;
            margin: 0;
        }
        .enterprise-card ul {
            margin: 0.5rem 0 0;
            padding-left: 1.1rem;
            color: #475569;
            line-height: 1.45;
            font-size: 0.92rem;
        }
        .scenario-note {
            margin-top: auto;
            font-size: 0.86rem;
            color: #64748b;
            background: #f8fafc;
            border-radius: 8px;
            padding: 0.55rem;
        }
        .prompt-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        }
        .prompt-modal {
            background: #fffbeb;
            border: 2px solid #fcd34d;
            border-radius: 12px;
            padding: 1.8rem 2rem;
            max-width: 900px;
            width: 90vw;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            max-height: 90vh;
            overflow-y: auto;
        }
        .prompt-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #92400e;
            line-height: 1;
            font-family: inherit;
        }
        .prompt-compare {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
        }
        .prompt-box {
            border-radius: 8px;
            padding: 0.8rem;
        }
        .prompt-box.bad {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
        }
        .prompt-box.good {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
        }
        .prompt-code {
            font-family: Consolas, Monaco, monospace;
            padding: 0.5rem;
            border-radius: 4px;
            line-height: 1.45;
            margin-top: 0.4rem;
        }
    </style>

    <div class="scenario-root">
        <h2 class="scenario-title">3. 从个人使用到企业落地：AI 提效的两层场景</h2>

        <div class="scenario-shell">
            <div class="scenario-tabs">
                <button class="scenario-tab active" data-tab="personal">👤 个人使用 AI：先学会聊天</button>
                <button class="scenario-tab" data-tab="enterprise">🏢 企业使用 AI：三个落地场景</button>
            </div>

            <div class="scenario-panel active" data-panel="personal">
                <p class="chat-intro">💬 <strong>对话是理解 AI 最直接的方式。</strong>不用学代码，只要输入自然语言（Prompt），它就能帮你分析问题、写文章、查资料。
                    <button id="prompt-tip-btn" class="prompt-inline-btn">💡 Prompt 技巧</button>
                </p>
                <table class="tool-table">
                    <tbody>
                        <tr>
                            <td class="logo-col"><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64" class="tool-logo"></td>
                            <td class="name-col">Gemini</td>
                            <td class="desc-col">谷歌自研的顶级模型大本营，多模态推理能力强悍，如果你是谷歌生态重度用户则体验极佳。</td>
                        </tr>
                        <tr>
                            <td class="logo-col"><img src="https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64" class="tool-logo"></td>
                            <td class="name-col">ChatGPT</td>
                            <td class="desc-col">老牌全能型六边形战士，语音对话体验极度拟真，并且能直接调用丰富的插件。</td>
                        </tr>
                        <tr>
                            <td class="logo-col"><img src="https://www.google.com/s2/favicons?domain=deepseek.com&sz=64" class="tool-logo"></td>
                            <td class="name-col">DeepSeek</td>
                            <td class="desc-col">性价比极高并且深度开源的国产模型，深度思考（R1）相关的逻辑推理能力堪称一绝。</td>
                        </tr>
                        <tr>
                            <td class="logo-col"><img src="https://www.google.com/s2/favicons?domain=kimi.moonshot.cn&sz=64" class="tool-logo"></td>
                            <td class="name-col">Kimi</td>
                            <td class="desc-col">国产长文本处理标杆，非常适合一次性喂给它十几篇财报或超长 PDF 让它提炼总结。</td>
                        </tr>
                        <tr>
                            <td class="logo-col"><img src="https://www.google.com/s2/favicons?domain=doubao.com&sz=64" class="tool-logo"></td>
                            <td class="name-col">豆包</td>
                            <td class="desc-col">字节跳动旗下的全民 AI 大模型，速度极快，文本生成本土化体验好，日常轻办公的好帮手。</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="scenario-panel" data-panel="enterprise">
                <p style="margin: 0 0 0.65rem; color:#475569; font-size: 1.02rem; flex-shrink:0;">我了解到的企业 AI 落地，主要是三个场景：</p>
                <div class="enterprise-grid">
                    <div class="enterprise-card">
                        <div class="enterprise-num">1</div>
                        <h3>泛知识库类</h3>
                        <p>把文档、制度、会议记录、项目资料变成可问答的知识入口。</p>
                        <ul>
                            <li>企业制度 / 产品手册问答</li>
                            <li>会议纪要自动总结与待办提取</li>
                            <li>项目资料、历史方案、客户材料检索</li>
                        </ul>
                        <div class="scenario-note">关键词：RAG / 企业知识问答 / 第二大脑</div>
                    </div>
                    <div class="enterprise-card">
                        <div class="enterprise-num">2</div>
                        <h3>龙虾类常驻 Agent</h3>
                        <p>7×24 小时运行在电脑或云主机上，并接入钉钉、微信、飞书等 IM。</p>
                        <ul>
                            <li>读取本地文件、运行脚本</li>
                            <li>定时检查报表或异常</li>
                            <li>像群机器人一样接任务、回结果</li>
                            <li>结合多维表使用或有奇效</li>

                        </ul>
                        <div class="scenario-note">关键词：OpenClaw 及其变体 / Hermes / IM Agent</div>
                    </div>
                    <div class="enterprise-card">
                        <div class="enterprise-num">3</div>
                        <h3>嵌入原有工作流</h3>
                        <p>在既有系统的某个节点加入 AI，用户仍然在熟悉的系统里工作。</p>
                        <ul>
                            <li>审批页旁边加 AI 总结按钮</li>
                            <li>客服后台自动生成回复草稿</li>
                            <li>审核、录入、分类环节自动辅助</li>
                        </ul>
                        <div class="scenario-note">关键词：AI 节点 / 人确认 / 原流程继续</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="prompt-overlay" class="prompt-overlay">
            <div class="prompt-modal">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                    <h4 style="margin: 0; color: #92400e; font-size: 1.1rem;">💡 真实案例：同一篇英文文章 × 同一个模型(DeepSeek) × 不同 Prompt</h4>
                    <button id="prompt-overlay-close" class="prompt-close">&times;</button>
                </div>
                <div class="prompt-compare">
                    <div class="prompt-box bad">
                        <div style="font-weight: 700; color: #991b1b; font-size: 0.95rem; margin-bottom: 0.4rem;">❌ Prompt A — 一句话指令</div>
                        <div class="prompt-code" style="font-size: 0.85rem; color: #7f1d1d; background: #fff5f5;">基于这篇文章，写一篇中文的新闻报道，用于中英双语教学</div>
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #991b1b;"><strong>结果</strong>：43行，纯新闻改写，无教学增值</div>
                    </div>
                    <div class="prompt-box good">
                        <div style="font-weight: 700; color: #166534; font-size: 0.95rem; margin-bottom: 0.4rem;">✅ Prompt B — 结构化指令 (500+ 字)</div>
                        <div class="prompt-code" style="font-size: 0.8rem; color: #14532d; background: #f0fdf4; max-height: 80px; overflow-y: auto;">Role: 资深英语名师…<br>Task: 按结构撰写精读笔记<br>1. 核心精粹 → 内容梗概 + 深度解读<br>2. 语言点拆解 → 词法/语法/句法<br>3. 互动思考题<br>Output Style: 语气/排版/双语比例</div>
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #166534;"><strong>结果</strong>：94行，完整教案，含词源分析 + 长难句图解 + 互动题</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem;">
                        <span style="background: #fff; padding: 3px 10px; border-radius: 20px; color: #92400e; border: 1px solid #fcd34d;">🎭 设定角色</span>
                        <span style="background: #fff; padding: 3px 10px; border-radius: 20px; color: #92400e; border: 1px solid #fcd34d;">📋 拆解任务</span>
                        <span style="background: #fff; padding: 3px 10px; border-radius: 20px; color: #92400e; border: 1px solid #fcd34d;">📎 规范输出</span>
                    </div>
                    <a href="./compare.html" target="_blank" style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem; transition: all 0.3s; box-shadow: 0 2px 8px rgba(249,115,22,0.3);">📊 查看完整对比结果 →</a>
                </div>
                <div style="background: #fef9c3; border: 1px dashed #ca8a04; border-radius: 6px; padding: 0.6rem 0.8rem; font-size: 0.82rem; color: #713f12; line-height: 1.6;">
                    <strong>🤔 不知道 Prompt 怎么写？两个“偷懒”妙招：</strong><br>
                    ① <strong>让 AI 帮你写 Prompt</strong> → 先告诉它“我想做 XX，请帮我生成一个高质量的 Prompt”，用它生成的 Prompt 再去提问<br>
                    ② <strong>让 AI 反过来提问你</strong> → 告诉它“先不要开始，请你先问我 5 个问题，直到足够清楚了再动手”
                </div>
            </div>
        </div>
    </div>
`;
