import { html } from '../app.js';

export default html`
    <h2>7. Vibe Coding：AI时代的编程语言就是自然语言</h2>
    <div class="card" style="width: 100%; background: linear-gradient(135deg, #eff6ff, #f0fdf4); border-color: #bfdbfe; margin-bottom: 1rem;">
        <p style="font-size: 1.55rem; line-height: 1.6; font-weight: 700; margin: 0; color: #0f172a; max-width: none;">AI 擅长编写代码，也擅长完成流程性的工作。未来很多“写程序”的动作，会变成“用自然语言描述目标、约束和验收标准”。</p>
    </div>
    <p>不再手写代码，用需求、样例、反馈和验收来指挥 AI 完成工具。</p>

    <h3>适合场景</h3>
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; width: 100%; margin-top: 0.6rem;">
        <div class="card" style="padding: 0.9rem;">
            <h3 style="font-size: 1.15rem;">资源大多在本地</h3>
            <p style="font-size: 0.92rem; margin: 0;">文件、数据、脚本、上下文都能被 Agent 读取和验证。</p>
        </div>
        <div class="card" style="padding: 0.9rem;">
            <h3 style="font-size: 1.15rem;">用户聪明且有探索精神</h3>
            <p style="font-size: 0.92rem; margin: 0;">能提出清楚目标，也愿意试错、验收和迭代。</p>
        </div>
        <div class="card" style="padding: 0.9rem;">
            <h3 style="font-size: 1.15rem;">任务有固定重复模式</h3>
            <p style="font-size: 0.92rem; margin: 0;">报表、审核、转换、生成、检查等流程越稳定，越容易沉淀成工具或 Skill。</p>
        </div>
        <div class="card" style="padding: 0.9rem; background: #eff6ff; border-color: #bfdbfe;">
            <h3 style="font-size: 1.15rem;">总代码量 5000 行以内</h3>
            <p style="font-size: 0.92rem; margin: 0;">规模足够小，AI 大模型可以“一口吃下”，理解全局上下文。</p>
        </div>
        <div class="card" style="padding: 0.9rem; background: #f0fdf4; border-color: #bbf7d0;">
            <h3 style="font-size: 1.15rem;">内部工具类应用</h3>
            <p style="font-size: 0.92rem; margin: 0;">面向自己或小团队提效，容错空间更大，反馈链路更短。</p>
        </div>
    </div>

    <div class="card" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #fff7ed, #fef2f2); border-color: #fed7aa;">
        <p style="font-size: 1.08rem; margin: 0; color: #9a3412; max-width: none;">复杂系统、生产级应用、客户交付项目，仍然需要专业人员和团队来操刀。Vibe Coding 更适合做内部效率工具和可控范围内的流程自动化。</p>
    </div>
`;
