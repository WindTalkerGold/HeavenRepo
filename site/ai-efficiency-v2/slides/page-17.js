import { html } from '../app.js';

export default html`
    <style>
        .story-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 0.5rem 0.8rem;
            border-left: 4px solid #f59e0b;
        }
        .story-card h4 { margin: 0 0 0.15rem 0; font-size: 0.95rem; color: #92400e; }
        .story-card p { margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.4; }
        .snowball-line {
            display: flex;
            gap: 0.3rem;
            align-items: flex-start;
            margin-bottom: 0.25rem;
        }
        .snowball-line .line-num {
            flex-shrink: 0;
            width: 22px;
            height: 22px;
            background: #3b82f6;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            margin-top: 2px;
        }
        .snowball-line .line-text { font-size: 0.88rem; color: #334155; line-height: 1.35; }
        .cache-card {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 0.4rem 0.7rem;
            display: flex;
            gap: 0.5rem;
            align-items: flex-start;
        }
        .cache-card .icon { font-size: 1.3rem; flex-shrink: 0; }
        .cache-card .body { flex: 1; }
        .cache-card .body strong { color: #166534; font-size: 0.92rem; }
        .cache-card .body p { margin: 0; font-size: 0.88rem; color: #14532d; line-height: 1.35; }
        .skill-tip {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 0.45rem 0.8rem;
            border-left: 3px solid #2563eb;
        }
        .skill-tip code {
            background: #dbeafe;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #1e40af;
            font-family: 'Consolas', monospace;
        }
    </style>
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly; padding-bottom: 0.5rem;">

    <h2 style="font-size: 1.7rem; margin-bottom: 0.15rem; background: linear-gradient(90deg, #d97706, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        14.3 理解 Agent 的 Token 消耗
    </h2>

    <!-- Token 基础 -->
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.35rem 0.8rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.1rem; flex-shrink: 0;">🧮</span>
        <div style="font-size: 1.1rem; color: #1e3a5f; line-height: 1.35;">
            1 个英文字符 ≈ <strong>0.3 Token</strong>，1 个中文字符 ≈ <strong>0.6 Token</strong>。
            输入（你发的）和输出（AI 回的）都要算钱。
        </div>
    </div>

    <!-- 一句"谢谢"的雪球效应 -->
    <div class="story-card" style="margin-bottom: 0.35rem;">
        <h4>❄️ 一句"谢谢"的雪球效应</h4>
        <p style="margin-bottom: 0.3rem;">
            LLM <strong>天生无状态</strong>——每次对话都是独立的，它不认识你，也不记得之前说过什么。
        </p>
        <p style="margin-bottom: 0.3rem;">
            所谓<strong>上下文</strong>，就是每次请求都要把全部聊天记录、System Prompt、文件内容一起发给模型。Agent 也不例外。
        </p>

        <br />
        <div class="snowball-line">
            <div class="line-num">1</div>
            <div class="line-text">你输入"谢谢"（2 个字 ≈ 1.2 Token）</div>
        </div>
        <div class="snowball-line">
            <div class="line-num">2</div>
            <div class="line-text">客户端把<strong>整个对话历史</strong>一起打包：几十轮会话+系统提示词+MCP 工具描述+代码文件等</div>
        </div>
        <div class="snowball-line">
            <div class="line-num">3</div>
            <div class="line-text">实际发出去的可能高达 <strong>几十万 Token</strong>——其中新增的只有 1.2</div>
        </div>
        <div class="snowball-line">
            <div class="line-num">4</div>
            <div class="line-text">LLM处理完之后回复一个“不客气”。</div>
        </div>
    </div>

    <!-- 提示词缓存 -->
    <div class="cache-card" style="margin-bottom: 0.35rem;">
        <div class="icon">💾</div>
        <div class="body">
            <strong>Prompt Caching（提示词缓存）—— 省钱英雄</strong>
            <p>前几十万 Token 和上一轮几乎一样，通常会直接命中缓存（常规输入的 <strong>1/10</strong>）。</p>
            <p>注意缓存失效问题（通常几分钟）。失效后按常规输入计费。</p>
        </div>
    </div>

    <!-- Skill -->
    <div style="display: flex; gap: 0.5rem;">
        <div class="skill-tip" style="flex: 1; margin-bottom: 0;">
            <div style="font-weight: 700; color: #1d4ed8; font-size: 0.92rem; margin-bottom: 0.15rem;">📦 提炼 Skill 的两个意义</div>
            <div style="font-size: 0.88rem; color: #1e3a5f; line-height: 1.4;">
                与其说"谢谢"让几十万 Token 的上下文白白浪费，不如趁模型还记得完整上下文时让它把经验固化为 Skill：
                <div style="margin: 0.3rem 0;">
                    <code>"复盘刚才解决这个 Bug 的核心思路，提炼为 debug-xxx skill"</code>
                </div>
                <strong>① 稳定</strong>——下次同类任务无需重新描述，执行路径完全一致<br>
                <strong>② 省 Token</strong>——调用 Skill 只需极短的 Prompt，不再需要重复加载全部上下文
            </div>
        </div>
    </div>

    </div>
`;
