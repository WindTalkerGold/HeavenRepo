import { html } from '../app.js';

const content = html`
    <style>
        .agent-card {
            border-radius: 10px;
            padding: 0.5rem 0.6rem;
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }
        .agent-card h4 {
            margin-top: 0;
            margin-bottom: 0.15rem;
            font-size: 0.95rem;
        }
        .agent-card p, .agent-card li {
            font-size: 0.82rem;
            line-height: 1.4;
        }
        .agent-card ul {
            padding-left: 0.2rem;
            margin: 0.15rem 0;
            flex: 1;
            list-style-position: inside;
        }
        .sec-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.3rem;
        }
        .sec-item {
            background: white;
            border-radius: 8px;
            padding: 0.25rem 0.5rem;
            border: 1px solid #e5e7eb;
        }
        .sec-item-title {
            font-weight: 700;
            color: #1e40af;
            font-size: 0.75rem;
            margin-bottom: 0;
        }
        .sec-item-desc {
            font-size: 0.7rem;
            color: #475569;
            line-height: 1.25;
        }
        /* Enterprise modal button */
        .enterprise-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 0.2rem 0.7rem;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(99,102,241,0.3);
            vertical-align: middle;
            margin-left: 0.5rem;
        }
        .enterprise-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 16px rgba(99,102,241,0.45);
            background: linear-gradient(135deg, #818cf8, #a78bfa);
        }
        /* Modal overlay */
        .p11-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            backdrop-filter: blur(4px);
        }
        .p11-modal-overlay.active {
            display: flex;
            opacity: 1;
        }
        .p11-modal-content {
            background: linear-gradient(145deg, #ffffff, #f8faff);
            padding: 1.8rem 2rem;
            border-radius: 16px;
            max-width: 92%;
            max-height: 88vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 25px 60px -12px rgba(0,0,0,0.3);
            width: 780px;
            border: 1px solid rgba(99,102,241,0.15);
        }
        .p11-modal-close {
            position: absolute;
            top: 0.8rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.8rem;
            line-height: 1;
            cursor: pointer;
            color: #94a3b8;
            transition: color 0.2s;
        }
        .p11-modal-close:hover {
            color: #ef4444;
        }
        .ent-section {
            background: #f8fafc;
            border-radius: 10px;
            padding: 0.7rem 1rem;
            margin-bottom: 0.7rem;
            border-left: 4px solid #6366f1;
        }
        .ent-section h4 {
            margin: 0 0 0.3rem 0;
            font-size: 0.95rem;
            color: #312e81;
        }
        .ent-section p {
            margin: 0;
            font-size: 0.88rem;
            color: #475569;
            line-height: 1.55;
        }
        .ent-vs {
            display: flex;
            gap: 0.8rem;
            margin-bottom: 0.7rem;
        }
        .ent-vs-card {
            flex: 1;
            border-radius: 10px;
            padding: 0.7rem 0.9rem;
        }
        .ent-vs-card h5 {
            margin: 0 0 0.3rem 0;
            font-size: 0.9rem;
        }
        .ent-vs-card p, .ent-vs-card li {
            font-size: 0.82rem;
            line-height: 1.5;
            color: #334155;
        }
        .ent-vs-card ul {
            margin: 0.2rem 0 0 0;
            padding-left: 1.2rem;
        }
        .ent-summary {
            background: linear-gradient(135deg, #eef2ff, #faf5ff);
            border: 1px solid #c7d2fe;
            border-radius: 10px;
            padding: 0.7rem 1rem;
            text-align: center;
        }
        .ent-summary p {
            margin: 0;
            font-size: 0.9rem;
            color: #3730a3;
            line-height: 1.6;
            font-weight: 500;
        }
    </style>
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly; padding-bottom: 1rem;">
    <h2 style="font-size: 1.5rem; margin-bottom: 0.15rem;">14. 心态建设：如何与 AI 相处？</h2>

    <!-- Core Metaphor -->
    <div class="card" style="background: #fff1f2; border-left: 4px solid #e11d48; margin-bottom: 0.3rem; padding: 0.35rem 0.8rem;">
        <h3 style="color: #be123c; margin-top: 0; margin-bottom: 0.15rem; font-size: 0.95rem;">🎓 核心心态：品味与判断归人，算力与执行归 AI</h3>
        <p style="margin-bottom: 0.25rem; font-size: 0.99rem; color: #4c0519;">人是<strong>“架构师”与“审核者”</strong>。<strong>程序性、重复性的数字体力劳动</strong>交给 AI，而<strong>核心判断力（Judgment）与品味（Taste）</strong>是人的价值所在。</p>
        <p style="margin-bottom: 0; font-size: 0.99rem; color: #4c0519; line-height: 1.4;">同时也要<strong>正视这种协同模式的局限性</strong>——现阶段用 AI 开发<strong>自己的效率工具</strong>完全可以，但面对复杂客户交付时，AI 只能提供基础执行，最后 20% 的<strong>商业洞察与架构决断</strong>，依然需要由具备专业经验的人脑来完成。</p>
    </div>

    <!-- Three-tier AI Tool Comparison -->
    <h3 style="margin-top: 0; margin-bottom: 0.2rem; font-size: 1rem;">🤖 三种 AI 协作模式：你和"毕业生"的关系
        <button class="enterprise-btn" id="enterprise-btn">🏢 </button>
    </h3>

    <div style="display: flex; gap: 0.6rem; margin-bottom: 0.35rem; align-items: stretch;">
        <!-- Chat Tools -->
        <div class="agent-card" style="background: #eff6ff; border: 2px solid #bfdbfe;">
            <h4 style="color: #1e40af;">💬 网页聊天框</h4>
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 0.2rem;">ChatGPT / DeepSeek / Gemini / Kimi</div>
            <div style="background: #dbeafe; border-radius: 6px; padding: 0.3rem 0.5rem; margin-bottom: 0.3rem; border-left: 3px solid #3b82f6;">
                <div style="font-size: 0.8rem; color: #1e3a5f; font-style: italic;">👔 请了一位<strong>外部顾问</strong>——非常能干，但<strong>不了解你公司内部</strong>的运行方式。</div>
            </div>
            <ul style="color: #1e3a5f; font-size: 0.82rem; margin: 0;">
                <li>你描述问题，他给出建议</li>
                <li>【几乎】不碰你的文件和系统</li>
                <li>适合<strong>问答、创作、临时咨询</strong></li>
                <li>成本较低</li>
            </ul>
        </div>

        <!-- OpenClaw -->
        <div class="agent-card" style="background: #fefce8; border: 2px solid #fde68a;">
            <h4 style="color: #a16207;">🦞 龙虾 (OpenClaw)</h4>
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 0.2rem;">自动化 Agent · 远程执行</div>
            <div style="background: #fffbeb; border-radius: 6px; padding: 0.3rem 0.5rem; margin-bottom: 0.3rem; border-left: 3px solid #f59e0b;">
                <div style="font-size: 0.8rem; color: #92400e; font-style: italic;">📱 把毕业生<strong>一个人扔在公司</strong>，你跑了，通过<strong>电话/微信遥控</strong>。</div>
            </div>
            <ul style="color: #713f12; font-size: 0.82rem; margin: 0;">
                <li>独立干活，看不到中间过程</li>
                <li>错了只能口述纠正，再等一轮</li>
                <li><strong>标准化、低风险的批量任务</strong></li>
                <li>你回来说不定发现他已经把办公室砸了</li>
            </ul>
        </div>

        <!-- Coding Agent -->
        <div class="agent-card" style="background: #f0fdf4; border: 2px solid #86efac;">
            <h4 style="color: #166534;">⚡ Coding Agent</h4>
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 0.2rem;">Claude Code / Cursor / Codex</div>
            <div style="background: #dcfce7; border-radius: 6px; padding: 0.3rem 0.5rem; margin-bottom: 0.3rem; border-left: 3px solid #22c55e;">
                <div style="font-size: 0.8rem; color: #14532d; font-style: italic;">🪑 你<strong>坐在他旁边</strong>，看着他操作，发现错了<strong>立刻纠正</strong>。</div>
            </div>
            <ul style="color: #14532d; font-size: 0.82rem; margin: 0;">
                <li>AI 直接在你电脑上<strong>读写运行</strong></li>
                <li>每步可<strong>审批、暂停、回滚</strong></li>
                <li>适合<strong>复杂工程、持续迭代</strong></li>
            </ul>
        </div>
    </div>
    <!-- Security Section -->
    <div style="background: linear-gradient(135deg, #fef2f2, #fff7ed); border: 1px solid #fecaca; border-radius: 12px; padding: 0.4rem 0.7rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -10px; right: -5px; font-size: 3.5rem; opacity: 0.08; transform: rotate(15deg);">🛡️</div>
        <h3 style="margin-top: 0; margin-bottom: 0.15rem; color: #991b1b; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            ⚠️ 安全意识 —— 信任但要设边界
        </h3>
        <p style="font-size: 0.99rem; color: #7f1d1d; line-height: 1.35; margin-bottom: 0.3rem;">
            AI 时代的<strong>供应链攻击</strong>风险显著增加（恶意依赖包、工具链后门）。这就像 <strong>90年代的个人电脑</strong> ——早期发展，病毒疯狂肆虐。未来会逐步解决，但<strong>现在必须绷紧这根弦</strong>。
        </p>
        <div class="sec-grid" style="font-size: 0.88rem">
            <div class="sec-item">
                <div class="sec-item-title">🏖️ 沙盒隔离 (Sandbox)</div>
                <div class="sec-item-desc">把 AI 放到<strong>"安全沙盒"</strong>中运行，数据即使泄露，风险也可接受。</div>
            </div>
            <div class="sec-item">
                <div class="sec-item-title">🖥️ 物理 / 逻辑隔离</div>
                <div class="sec-item-desc">用<strong>独立电脑或 VM</strong> 运行 AI 工具，不直接接触核心业务系统。</div>
            </div>
            <div class="sec-item">
                <div class="sec-item-title">🔍 审查与顾问</div>
                <div class="sec-item-desc">AI 生成的代码和依赖包需要<strong>专业审查</strong>，重要决策引入安全顾问。</div>
            </div>
            <div class="sec-item">
                <div class="sec-item-title">🧠 核心原则</div>
                <div class="sec-item-desc"><strong>永远不要把不可承受损失的东西</strong>暴露在未经验证的工具链中。</div>
            </div>
        </div>
    </div>
    </div>

    <!-- Enterprise AI Modal -->
    <div id="enterprise-modal" class="p11-modal-overlay">
        <div class="p11-modal-content">
            <button class="p11-modal-close">&times;</button>
            <h2 style="margin-top: 0; margin-bottom: 0.2rem; color: #312e81; font-size: 1.35rem;">🏢 第四种协作模式：企业级智能体</h2>
            <p style="color: #6366f1; font-size: 0.85rem; margin-bottom: 0.8rem; font-style: italic;">Microsoft 365 Copilot · 钉钉悟空 —— 拿着企业钥匙的"大管家"</p>

            <div class="ent-section">
                <h4>🧬 核心底座：企业图谱（Graph）</h4>
                <p>普通 AI 像个<strong>失忆的聪明人</strong>，而它们的护城河在于<strong>上下文</strong>。微软靠 <strong>Microsoft Graph</strong> 串联邮件、Teams、OneDrive、日历；钉钉靠<strong>组织架构与业务数据底座</strong>打通部门、汇报线、会议纪要、审批流。</p>
            </div>

            <div class="ent-section" style="border-left-color: #059669;">
                <h4 style="color: #065f46;">🔐 严格按权限办事</h4>
                <p>完美解决了"龙虾"的<strong>越权痛点</strong>。你没有权限的文件，它们<strong>绝对不碰</strong>——戴着镣铐跳舞，合规且安全。</p>
            </div>

            <div class="ent-section" style="border-left-color: #d97706;">
                <h4 style="color: #92400e;">🦾 操作"手脚"都是自家全家桶</h4>
                <p>它们不是通用 AI，而是<strong>深度嵌入</strong>各自办公生态的每一个角落。</p>
            </div>

            <div class="ent-vs">
                <div class="ent-vs-card" style="background: #eff6ff; border: 2px solid #bfdbfe;">
                    <h5 style="color: #1e40af;">🪟 Microsoft 365 Copilot</h5>
                    <p>长在<strong>"文档与办公套件"</strong>的生态里</p>
                    <ul>
                        <li>Word 写文档、Excel 数据透视</li>
                        <li>PowerPoint 生成幻灯片</li>
                        <li>Teams 会议纪要</li>
                        <li>擅长复杂 Office 资产 & 跨国协同</li>
                    </ul>
                </div>
                <div class="ent-vs-card" style="background: #eef2ff; border: 2px solid #c7d2fe;">
                    <h5 style="color: #4338ca;">💎 钉钉悟空</h5>
                    <p>长在<strong>"即时通讯与组织管理"</strong>的生态里</p>
                    <ul>
                        <li>钉钉文档、宜搭低代码</li>
                        <li>审批流、日程表</li>
                        <li>企业内部知识库</li>
                        <li>擅长中国企业特色的群协作 & 打卡</li>
                    </ul>
                </div>
            </div>

            <div class="ent-summary">
                <p>💡 它们都是拿着企业钥匙的"大管家"。<br>区别仅仅在于生态位不同——一个长在 <strong>Office</strong>，一个长在<strong>钉钉</strong>。</p>
            </div>
        </div>
    </div>
`;

export const onMount = (container) => {
    const btn = container.querySelector('#enterprise-btn');
    const modal = container.querySelector('#enterprise-modal');
    const closeBtn = container.querySelector('.p11-modal-close');

    modal.setAttribute('tabindex', '-1');

    const openModal = () => {
        modal.classList.add('active');
        modal.focus({ preventScroll: true });
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
};

export default content;
