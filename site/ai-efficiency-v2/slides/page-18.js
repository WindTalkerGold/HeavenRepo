import { html } from '../app.js';

export default html`
    <style>
        .recap-list {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .recap-list li {
            padding: 0.7rem 1rem 0.7rem 2.8rem !important;
            position: relative;
            font-size: 1.2rem !important;
            margin-bottom: 0 !important;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            line-height: 1.5;
        }
        .recap-list li::before {
            content: "✓" !important;
            position: absolute;
            left: 0.9rem;
            top: 0.7rem;
            color: #22c55e !important;
            font-weight: 700;
            font-size: 1.2rem !important;
        }
        .action-card {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: #fff;
        }
        .action-num {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
        }
        .action-text { flex: 1; }
        .action-text strong { color: #1e293b; font-size: 1.05rem; }
        .action-text p { margin: 4px 0 0 0; font-size: 0.95rem; color: #64748b; }
    </style>

    <h2 style="background: linear-gradient(90deg, #1e40af, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.2rem; margin-bottom: 1rem;">15. 总结与行动</h2>
    
    <div class="grid-2" style="gap: 2rem; align-items: start;">
        <!-- 左列：今天学到了什么 -->
        <div>
            <h3 style="margin-top: 0; margin-bottom: 0.8rem; font-size: 1.6rem;">📖 今天你学到了什么</h3>
            <ul class="recap-list">
                <li>自然语言就是新的编程语言，技术门槛正在消失</li>
                <li>"龙虾"的本质 = 7×24 服务器 + Coding Agent + IM 通道</li>
                <li>SKILL 让 AI 能力模块化、可复用，避免重复造轮子</li>
                <li>你是项目经理，AI 是那个干活的优秀的应届毕业生</li>
            </ul>
        </div>

        <!-- 右列：今天回去就能做的 3 件事 -->
        <div>
            <h3 style="margin-top: 0; margin-bottom: 0.8rem; font-size: 1.6rem;">🚀 今天回去就能做的 4 件事</h3>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                <div class="action-card" style="border-left: 3px solid #3b82f6;">
                    <div class="action-num">1</div>
                    <div class="action-text">
                        <strong>与 Gemini 深度对话</strong>
                        <p>试试它的 Canvas 协作写作、NotebookLM 文档问答功能，体验"AI 第二大脑"</p>
                    </div>
                </div>
                <div class="action-card" style="border-left: 3px solid #8b5cf6;">
                    <div class="action-num">2</div>
                    <div class="action-text">
                        <strong>用飞书妙记记录一次会议</strong>
                        <p>记录一段会议或讨论，让 AI 自动总结要点和待办清单，感受即时提效</p>
                    </div>
                </div>
                <div class="action-card" style="border-left: 3px solid #059669;">
                    <div class="action-num">3</div>
                    <div class="action-text">
                        <strong>安装 Claude Code 体验编程</strong>
                        <p>如果你有兴趣，按照配置指南搭建环境，用自然语言让 AI 帮你写第一个脚本</p>
                    </div>
                </div>
                <div class="action-card" style="border-left: 3px solid #e67e22ff;">
                    <div class="action-num">4</div>
                    <div class="action-text">
                        <strong>云端领养一条龙虾</strong>
                        <p>阿里、字节等平台都可以云端养虾，尝试用龙虾订制一个你专属的知识库和问答机器人。</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 1.5rem; text-align: center; background: linear-gradient(135deg, #eff6ff, #f0fdf4); border: 1px solid #bae6fd; border-radius: 10px; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: center; gap: 2rem;">
        <div style="text-align: left;">
            <p style="margin: 0 0 0.3rem 0; font-size: 1.3rem; color: #0f172a; font-weight: 600;">
                💡 打破边界，让技术真正为你的业务创意服务！
            </p>
            <p style="margin: 0; font-size: 1rem; color: #64748b;">
                欢迎关注、留言、提问，我会尽可能回答 👉
            </p>
        </div>
        <img src="./assets/wechat.jpg" alt="WeChat" style="width: 100px; height: 100px; border-radius: 8px; border: 2px solid #e2e8f0; flex-shrink: 0;">
    </div>
`;
