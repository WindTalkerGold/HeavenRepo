import { html } from '../app.js';

export default html`
    <style>
        .chat-shell {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            overflow: hidden;
            min-height: 390px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12);
        }
        .chat-header {
            background: linear-gradient(135deg, #16a34a, #0f766e);
            color: white;
            padding: 0.7rem 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.7rem;
        }
        .chat-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(255,255,255,0.22);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            flex-shrink: 0;
        }
        .chat-title {
            font-weight: 800;
            line-height: 1.1;
        }
        .chat-subtitle {
            font-size: 0.78rem;
            opacity: 0.82;
            margin-top: 0.15rem;
        }
        .chat-body {
            flex: 1;
            padding: 0.85rem;
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
            background:
                radial-gradient(circle at 0% 0%, rgba(34,197,94,0.08), transparent 32%),
                linear-gradient(180deg, #f8fafc, #eef2f7);
        }
        .chat-time {
            align-self: center;
            font-size: 0.72rem;
            color: #94a3b8;
            background: rgba(255,255,255,0.8);
            border-radius: 999px;
            padding: 0.1rem 0.55rem;
        }
        .msg-row {
            display: flex;
            gap: 0.45rem;
            align-items: flex-start;
        }
        .msg-row.me {
            justify-content: flex-end;
        }
        .mini-avatar {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            flex-shrink: 0;
        }
        .mini-avatar.bot { background: #dcfce7; color: #166534; }
        .bubble {
            max-width: 78%;
            border-radius: 14px;
            padding: 0.55rem 0.7rem;
            font-size: 0.92rem;
            line-height: 1.45;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
        }
        .bubble.user {
            background: #95ec69;
            color: #0f172a;
            border-top-right-radius: 4px;
        }
        .bubble.bot {
            background: white;
            color: #334155;
            border-top-left-radius: 4px;
        }
        .work-card {
            background: #0f172a;
            color: #e2e8f0;
            border-radius: 10px;
            padding: 0.55rem 0.65rem;
            font-size: 0.78rem;
            line-height: 1.5;
            margin-top: 0.4rem;
            font-family: Consolas, Monaco, monospace;
        }
        .work-card .ok { color: #86efac; }
        .work-card .run { color: #fbbf24; }
        .chat-input {
            background: white;
            border-top: 1px solid #e2e8f0;
            padding: 0.55rem 0.7rem;
            display: flex;
            align-items: center;
            gap: 0.45rem;
        }
        .fake-input {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 999px;
            padding: 0.4rem 0.75rem;
            color: #94a3b8;
            font-size: 0.82rem;
        }
        .send-dot {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #16a34a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
        }
    </style>

    <h2>5. 龙虾类：常驻在电脑上的独立 Agent</h2>
    <p>“打开一个网页问 AI” → 长期运行、接入 IM、访问本地资源：你像在微信/钉钉里发消息，背后是 Agent 在电脑上干活。</p>

    <div class="grid-2" style="gap: 1.2rem; align-items: stretch;">
        <div class="chat-shell">
            <div class="chat-header">
                <div class="chat-avatar">🦞</div>
                <div>
                    <div class="chat-title">销售报表助手</div>
                    <div class="chat-subtitle">企业微信 / 钉钉群机器人 · 常驻在线</div>
                </div>
                <div style="margin-left: auto; font-size: 0.78rem; opacity: 0.85;">在线</div>
            </div>
            <div class="chat-body">
                <div class="chat-time">今天 09:18</div>
                <div class="msg-row me">
                    <div class="bubble user">帮我看一下今天销售报表有没有异常，重点看地区和产品。</div>
                </div>
                <div class="msg-row">
                    <div class="mini-avatar bot">🦞</div>
                    <div class="bubble bot">
                        收到。我会读取本地报表，运行检查脚本，并把结果发回群里。
                        <div class="work-card">
                            <div class="run">▸ 读取 D:/Reports/sales_today.xlsx</div>
                            <div class="run">▸ 执行 anomaly_check.py</div>
                            <div>▸ 对比昨日 / 近 7 日均值</div>
                        </div>
                    </div>
                </div>
                <div class="msg-row">
                    <div class="mini-avatar bot">🦞</div>
                    <div class="bubble bot">
                        已发现 3 个异常：华东区销售额较 7 日均值下降 22%；Paseo 退货率升高；政府客户折扣异常偏高。
                        <div class="work-card">
                            <div class="ok">✓ 报告已生成：sales_anomaly_report.html</div>
                            <div class="ok">✓ 已附上证据行和建议动作</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <div class="fake-input">输入消息...</div>
                <div class="send-dot">↑</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
            <div class="card"><h3>接入 IM</h3><p style="font-size: 1rem; margin: 0;">钉钉、微信、飞书等入口，让同事用熟悉方式发起任务。</p></div>
            <div class="card"><h3>访问本地</h3><p style="font-size: 1rem; margin: 0;">读取文件、运行脚本、调用工具，完成真实工作。</p></div>
            <div class="card"><h3>持续运行</h3><p style="font-size: 1rem; margin: 0;">7×24 小时盯流程、接任务、做提醒。</p></div>
            <div class="card"><h3>可被编排</h3><p style="font-size: 1rem; margin: 0;">OpenClaw、Hermes 或各种变体，本质都是 Agent 外壳。</p></div>
        </div>
    </div>

    <div class="card" style="margin-top: 1rem; background: #fff7ed; border-color: #fed7aa;">
        <p style="font-size: 1.1rem; margin: 0;">
            建议独立的VM或者电脑安装，谨慎授权，不建议主力电脑安装。
        </p>
    </div>
`;
