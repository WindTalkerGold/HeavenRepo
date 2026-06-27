import { html } from '../app.js';

export default html`
    <h2>6. 嵌入原有工作流</h2>
    <p>这类做法是在原系统里加一个 AI 节点：用户仍然在熟悉的系统里工作，只是某个环节由 AI 自动补全、判断、提取或生成。</p>

    <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0.8rem; align-items: center; width: 100%; margin: 1.2rem 0;">
        <div class="card" style="min-height: 150px;">
            <h3>原业务系统</h3>
            <p style="font-size: 1rem; margin: 0;">CRM、OA、工单、审批、客服后台。</p>
        </div>
        <div style="font-size: 2rem; color: #64748b; font-weight: 800;">→</div>
        <div class="card" style="min-height: 150px; background: linear-gradient(135deg, #eff6ff, #f5f3ff); border-color: #93c5fd;">
            <h3>AI 节点</h3>
            <p style="font-size: 1rem; margin: 0;">分类、总结、生成回复、审核材料、抽取字段。</p>
        </div>
        <div style="font-size: 2rem; color: #64748b; font-weight: 800;">→</div>
        <div class="card" style="min-height: 150px;">
            <h3>继续原流程</h3>
            <p style="font-size: 1rem; margin: 0;">人确认、系统流转、形成记录。</p>
        </div>
    </div>

    <div class="card" style="width: 100%; margin-bottom: 1rem; background: linear-gradient(135deg, #ecfeff, #eff6ff); border-color: #bae6fd;">
        <h3 style="margin-top: 0; color: #0f766e;">例子：审单 / 审合同流程里的 AI 总结机器人</h3>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0.7rem; align-items: stretch;">
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.7rem;">
                <strong style="color:#0f172a;">员工提交审批</strong>
                <p style="font-size: 0.9rem; margin: 0.25rem 0 0;">合同、采购单、付款申请、报销单。</p>
            </div>
            <div style="display:flex; align-items:center; color:#64748b; font-weight:800;">→</div>
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 0.7rem;">
                <strong style="color:#0369a1;">界面旁加 AI 按钮</strong>
                <p style="font-size: 0.9rem; margin: 0.25rem 0 0;">审批页右侧出现 AI 标志，点击后弹出总结对话框。</p>
            </div>
            <div style="display:flex; align-items:center; color:#64748b; font-weight:800;">→</div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.7rem;">
                <strong style="color:#0f172a;">审批人按需查看</strong>
                <p style="font-size: 0.9rem; margin: 0.25rem 0 0;">弹窗里展示摘要、风险点、缺失材料，帮助决定同意、驳回或转法务。</p>
            </div>
        </div>
    </div>

    <div class="grid-2" style="gap: 1rem;">
        <div class="card">
            <h3>好处</h3>
            <p style="margin-bottom: 0;">不用改变入口和流程，用户接受度最高。</p>
        </div>
        <div class="card" style="background: #eff6ff; border-color: #bfdbfe;">
            <h3>我的判断</h3>
            <p style="margin-bottom: 0;">只是一个过渡阶段。长期看，工作流会被重构，自然语言与 AI 对话会成为新的工作范式。</p>
        </div>
    </div>
`;
