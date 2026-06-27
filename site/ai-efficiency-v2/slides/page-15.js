import { html } from '../app.js';

export const onMount = (container) => {
    container.querySelectorAll('.quote-card h4').forEach(h4 => {
        h4.addEventListener('click', () => {
            h4.parentElement.classList.toggle('expanded');
        });
    });
};

export default html`
    <style>
        .boundary-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.8rem;
            overflow: hidden;
            border-radius: 12px;
            border: 1px solid #dbeafe;
            background: white;
        }
        .boundary-table th,
        .boundary-table td {
            padding: 0.35rem 0.5rem;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #eef2f7;
            vertical-align: top;
            line-height: 1.25;
        }
        .boundary-table th:last-child,
        .boundary-table td:last-child {
            border-right: none;
        }
        .boundary-table tr:last-child td {
            border-bottom: none;
        }
        .boundary-table thead th {
            background: #eff6ff;
            color: #1e3a8a;
            font-weight: 800;
        }
        .row-head {
            background: #f8fafc;
            font-weight: 700;
            color: #0f172a;
            width: 80px;
            font-size: 0.75rem;
        }
        .mode-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 0.78rem;
            font-weight: 700;
            border: 1px solid transparent;
        }
        .quote-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 0;
            overflow: hidden;
        }
        .quote-card h4 {
            margin: 0;
            padding: 0.35rem 0.6rem;
            font-size: 0.85rem;
            color: #0f172a;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;
            transition: background 0.2s;
        }
        .quote-card h4:hover {
            background: #f1f5f9;
        }
        .quote-card h4::after {
            content: "▸";
            font-size: 0.9rem;
            color: #94a3b8;
            transition: transform 0.2s;
        }
        .quote-card.expanded h4::after {
            transform: rotate(90deg);
        }
        .quote-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 0.6rem;
        }
        .quote-body-inner {
            padding-bottom: 0.4rem;
        }
        .quote-card.expanded .quote-body {
            max-height: 300px;
        }
        .quote-card blockquote {
            margin: 0 0 0.2rem 0;
            padding-left: 0.4rem;
            border-left: 3px solid #93c5fd;
            color: #334155;
            font-size: 0.78rem;
            line-height: 1.3;
        }
        .quote-card .src {
            font-size: 0.72rem;
            color: #64748b;
        }
        .strategy-card {
            border-radius: 8px;
            padding: 0.5rem 0.7rem;
            border: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #f8fafc, #ffffff);
        }
        .strategy-card h4 {
            margin: 0 0 0.1rem 0;
            font-size: 0.9rem;
        }
        .strategy-card ul {
            margin: 0;
            padding-left: 1rem;
            list-style-type: disc;
        }
        .strategy-card li {
            margin: 0.1rem 0;
            color: #475569;
            font-size: 0.8rem;
            line-height: 1.25;
            padding-left: 0;
        }
        .strategy-card li::before {
            content: none;
        }
    </style>
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly; padding-bottom: 0.5rem;">
    <h2 style="font-size: 1.5rem; margin-bottom: 0.15rem; background: linear-gradient(90deg, #0f172a, #1d4ed8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        14.1 安全认知：怎么理解 AI 的数据边界？
    </h2>

    <div style="background: linear-gradient(135deg, #fff7ed, #eff6ff); border: 1px solid #fed7aa; border-radius: 12px; padding: 0.4rem 0.7rem; margin-bottom: 0.4rem;">
        <div style="font-size: 0.9rem; font-weight: 800; color: #9a3412; margin-bottom: 0.1rem;">前面解决“态度”和“机制”问题，这一页解决“认知”问题：你到底把什么数据交给了谁？</div>
        <div style="font-size: 0.8rem; color: #475569; line-height: 1.3;">判断 AI 是否安全，不能只看"模型强不强"，而要先看<strong>接入模式</strong>。同一个模型，走个人账号、企业 API、私有化部署，安全边界完全不同。</div>
    </div>

    <div class="grid-2" style="gap: 0.6rem; align-items: start;">
        <div style="display:flex; flex-direction:column; gap: 0.3rem;">
            <div>
                <div style="font-size: 0.95rem; font-weight: 800; color:#0f172a; margin-bottom: 0.2rem;">AI 接入的三种模式 & 安全性对比</div>
                <table class="boundary-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th><span class="mode-badge" style="background:#dbeafe; color:#1d4ed8; border-color:#bfdbfe;">A：个人账户</span></th>
                            <th><span class="mode-badge" style="background:#ede9fe; color:#6d28d9; border-color:#ddd6fe;">B：企业级服务</span></th>
                            <th><span class="mode-badge" style="background:#dcfce7; color:#047857; border-color:#bbf7d0;">C：私有化部署</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="row-head">说明</td>
                            <td>员工自行注册，IT 几乎无感知</td>
                            <td>企业采购 API / Enterprise，有管理后台与审计</td>
                            <td>模型部署在企业内网或私有云</td>
                        </tr>
                        <tr>
                            <td class="row-head">典型代表</td>
                            <td>ChatGPT、DeepSeek、Gemini 网页版</td>
                            <td>OpenAI API、Vertex AI、Copilot Business</td>
                            <td>DeepSeek、千问、GLM 私有部署</td>
                        </tr>
                        <tr>
                            <td class="row-head">数据离开公司</td>
                            <td>是</td>
                            <td>是（进入服务商云端）</td>
                            <td>否</td>
                        </tr>
                        <tr>
                            <td class="row-head">用于再训练</td>
                            <td>常见默认可能会</td>
                            <td>主流条款通常默认不会</td>
                            <td>企业可完全自控</td>
                        </tr>
                        <tr>
                            <td class="row-head">安全控制力度</td>
                            <td>极低</td>
                            <td>中高（审计、权限可管）</td>
                            <td>极高</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="display:flex; flex-direction:column; gap: 0.25rem;">
            <div style="font-size: 0.95rem; font-weight: 800; color:#0f172a;">主流厂商条款摘要（2026）</div>

            <div class="quote-card">
                <h4>OpenAI</h4>
                <div class="quote-body"><div class="quote-body-inner">
                <blockquote>"We do not train our models on your business data by default." / 消费者服务政策则允许"use content ... to improve our Services"。</blockquote>
                <div class="src">来源：OpenAI Enterprise Privacy、Business Data、Consumer Services FAQ（官方政策页）</div>
                </div></div>
            </div>

            <div class="quote-card">
                <h4>Google</h4>
                <div class="quote-body"><div class="quote-body-inner">
                <blockquote>"Google won't use your data to train or fine-tune any AI/ML models without your prior permission or instruction." 另，Vertex AI Search 明确写明"客户数据不会用于训练基础模型"。</blockquote>
                <div class="src">来源：Google Cloud Vertex AI zero data retention / data governance 官方文档</div>
                </div></div>
            </div>

            <div class="quote-card">
                <h4>GitHub Copilot</h4>
                <div class="quote-body"><div class="quote-body-inner">
                <blockquote>"Interaction data ... from Copilot Free, Pro, and Pro+ users will be used ... unless they opt out." 同页同时写明：Business / Enterprise "are not affected by this update"。</blockquote>
                <div class="src">来源：GitHub Blog《Updates to GitHub Copilot interaction data usage policy》</div>
                </div></div>
            </div>

            <div class="quote-card">
                <h4>智谱 / GLM</h4>
                <div class="quote-body"><div class="quote-body-inner">
                <blockquote>开放平台公开说明强调：API / 开放平台数据默认不用于模型训练；而智谱清言个人产品隐私政策强调"去标识化处理后的信息不属于个人信息"，并允许围绕服务优化进行处理。</blockquote>
                <div class="src">来源：智谱开放平台公开说明、智谱清言隐私政策公开页</div>
                </div></div>
            </div>
        </div>
    </div>

    <div style="display: flex; gap: 0.5rem; margin-top: 0.2rem;">
        <div class="strategy-card" style="border-left: 4px solid #2563eb; flex: 1; padding: 0.4rem 0.7rem;">
            <h4 style="color:#1d4ed8; font-size: 0.9rem;">一句话结论</h4>
            <div style="font-size:0.78rem; color:#475569; line-height:1.3;">你愿意放进钉钉、飞书、微软 SharePoint 这类企业 SaaS 的内部资料，原则上就可以优先考虑<strong>模式 B</strong>；再往上更敏感，就升级到<strong>模式 C</strong>。</div>
        </div>

        <div class="strategy-card" style="border-left: 4px solid #16a34a; flex: 1; padding: 0.4rem 0.7rem;">
            <h4 style="color:#166534; font-size: 0.9rem;">落地策略：按数据机密程度选模式</h4>
            <ul style="padding-left: 1rem;">
                <li style="font-size:0.78rem; padding:0.15rem 0 0.15rem 0.8rem;"><strong>极度机密</strong>（核心知识产权、未公开代码）→ 必须用 <strong>模式 C</strong></li>
                <li style="font-size:0.78rem; padding:0.15rem 0 0.15rem 0.8rem;"><strong>内部业务数据</strong>（周报、常规代码、内部文档）→ 优先用 <strong>模式 B</strong></li>
                <li style="font-size:0.78rem; padding:0.15rem 0 0.15rem 0.8rem;"><strong>通用辅助</strong>（邮件润色、公开技术查询）→ 可用 <strong>模式 A</strong>，但需安全培训</li>
            </ul>
        </div>
    </div>
    </div>
`;
