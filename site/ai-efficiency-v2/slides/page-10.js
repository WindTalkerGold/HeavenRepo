import { html } from '../app.js';

export const onMount = (container) => {
    const toggleBtn = container.querySelector('#toggle-prereq');
    const prereqPanel = container.querySelector('#prereq-panel');
    if (toggleBtn && prereqPanel) {
        toggleBtn.addEventListener('click', () => {
            const isVisible = prereqPanel.style.maxHeight && prereqPanel.style.maxHeight !== '0px';
            if (isVisible) {
                prereqPanel.style.maxHeight = '0px';
                prereqPanel.style.opacity = '0';
                toggleBtn.querySelector('.arrow').textContent = '▸';
            } else {
                prereqPanel.style.maxHeight = prereqPanel.scrollHeight + 'px';
                prereqPanel.style.opacity = '1';
                toggleBtn.querySelector('.arrow').textContent = '▾';
            }
        });
    }

    const antigravityText = container.querySelector('#antigravity-trigger');
    const antigravityModal = container.querySelector('#antigravity-modal');
    const antigravityClose = container.querySelector('#antigravity-close');
    if (antigravityText && antigravityModal && antigravityClose) {
        const closeModal = () => antigravityModal.classList.remove('is-visible');
        antigravityText.addEventListener('click', () => antigravityModal.classList.add('is-visible'));
        antigravityClose.addEventListener('click', closeModal);
        antigravityModal.addEventListener('click', (event) => {
            if (event.target === antigravityModal) closeModal();
        });
    }
};

export default html`
    <style>
        .prereq-toggle {
            cursor: pointer;
            user-select: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #64748b;
            font-size: 1.05rem;
            font-weight: 500;
            padding: 4px 0;
            transition: color 0.2s;
            background: none;
            border: none;
            font-family: inherit;
        }
        .prereq-toggle:hover { color: var(--primary); }
        .prereq-panel {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.35s ease, opacity 0.3s ease;
        }
        .prereq-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.8rem;
            margin-top: 0.8rem;
        }
        .prereq-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 0.8rem;
            text-align: center;
        }
        .prereq-item img {
            width: 28px;
            height: 28px;
            margin-bottom: 4px;
        }
        .prereq-item .name { font-weight: 600; font-size: 0.95rem; color: #1e293b; }
        .prereq-item .desc { font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.3; }
        .antigravity-link {
            color: #3730a3;
            font-weight: 700;
            text-decoration: underline;
            text-underline-offset: 3px;
            cursor: pointer;
        }
        .antigravity-modal {
            position: fixed;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(15, 23, 42, 0.72);
            z-index: 1000;
            padding: 2rem;
        }
        .antigravity-modal.is-visible { display: flex; }
        .antigravity-modal-content {
            position: relative;
            background: #111827;
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }
        .antigravity-modal-content img {
            display: block;
            max-width: 85vw;
            max-height: 82vh;
            object-fit: contain;
            border-radius: 8px;
        }
        .antigravity-close {
            position: absolute;
            top: -0.8rem;
            right: -0.8rem;
            width: 2rem;
            height: 2rem;
            border: 0;
            border-radius: 999px;
            background: #fff;
            color: #0f172a;
            cursor: pointer;
            font-size: 1.4rem;
            line-height: 1;
        }
    </style>

    <h2>10. 上手第一步：配置 Vibe Coding 环境</h2>
    <p>有了前置知识后，下一步是把工具装好。根据不同的网络环境，选择合适的配置方案：</p>

    <div class="flex-col" style="gap: 1.5rem;">
        <div class="card">
            <h3>方案 A：国内网络环境</h3>
            <p>无需特殊网络设置，体验流畅，响应极快：</p>
            <ul>
                <li>
                    <span class="highlight">Claude Code (客户端) + GLM或者DeepSeek V4</span>
                    <a href="https://docs.bigmodel.cn/cn/guide/develop/claude" target="_blank" style="margin-left: 0.5rem; color: var(--secondary); text-decoration: none; font-size: 1rem;">[ 📖 GLM ]</a>
                    <a href="https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code" target="_blank" style="margin-left: 0.5rem; color: var(--secondary); text-decoration: none; font-size: 1rem;">[ 📖 DeepSeek ]</a>
                </li>
                <li><span class="highlight">Trae</span> 字节跳动，个人版免费。</li>
            </ul>
        </div>

        <div class="card">
            <h3>方案 B：具备外网访问条件</h3>
            <p>直接接驳国际最强模型的原生体验：</p>
            <ul>
                <li><span class="highlight">Claude Code + Claude Opus 4.7</span> - 推理能力最强、复杂重构和逻辑分析最为稳妥的组合。</li>
                <li><span class="highlight">Codex + Gpt-5.5</span> - 这个组合我五一之前刚刚开始使用，体感不输Claude Code。</li>
                <li>
                    <span class="highlight">Antigravity</span> - <span class="antigravity-link" id="antigravity-trigger">您现在看到的这份PPT，初版直接由 Antigravity 编写和生成的</span>
                </li>
            </ul>
        </div>

        <div class="antigravity-modal" id="antigravity-modal">
            <div class="antigravity-modal-content">
                <button class="antigravity-close" id="antigravity-close" aria-label="关闭截图">×</button>
                <img src="./assets/initial-prompt.png" alt="Antigravity 生成 PPT 的初始提示截图">
            </div>
        </div>

        <!-- 前置环境 -->
        <div>
            <button class="prereq-toggle" id="toggle-prereq">
                <span class="arrow">▸</span> 🛠️ 无论哪种方案，都需要提前安装的软件
            </button>
            <div class="prereq-panel" id="prereq-panel">
                <div class="prereq-grid">
                    <div class="prereq-item">
                        <img src="https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64" alt="VS Code">
                        <div class="name">VS Code</div>
                        <p class="desc">微软出品的代码编辑器，免费、轻量、插件丰富</p>
                    </div>
                    <div class="prereq-item">
                        <img src="https://www.google.com/s2/favicons?domain=nodejs.org&sz=64" alt="Node.js">
                        <div class="name">Node.js</div>
                        <p class="desc">JavaScript 运行环境，安装后自带 npm，是跑 Claude Code 的前提</p>
                    </div>
                    <div class="prereq-item">
                        <img src="https://www.google.com/s2/favicons?domain=git-scm.com&sz=64" alt="Git">
                        <div class="name">Git</div>
                        <p class="desc">版本控制工具，Claude Code 强制要求</p>
                    </div>
                    <div class="prereq-item" style="background: #fefce8; border-color: #fde68a;">
                        <img src="https://www.google.com/s2/favicons?domain=github.com&sz=64" alt="GitHub">
                        <div class="name">GitHub 账号</div>
                        <p class="desc">（可选）远程代码仓库，方便协作与备份</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
