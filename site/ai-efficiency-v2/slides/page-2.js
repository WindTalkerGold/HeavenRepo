import { html } from '../app.js';

export default html`
    <h2>2. 先理解边界：AI 像智能驾驶</h2>
    <p>不能看到智能驾驶在高速上表现不错，就默认它能处理所有路况。</p>
    <p>不能因为智能驾驶处理不好复杂城市路况，就全盘否认其价值。</p>

    <div class="grid-2" style="gap: 1.2rem; margin-top: 0.8rem;">
        <div class="card" style="background: linear-gradient(135deg, #ecfdf5, #eff6ff); border-color: #86efac; min-height: 300px;">
            <h3 style="color: #166534;">它能开得不错的路况</h3>
            <ul>
                <li>高速、高架、封闭道路</li>
                <li>晴好天气、标线清楚</li>
                <li>目标明确，判断空间小</li>
            </ul>
            <p style="font-size: 1rem; margin-bottom: 0; color: #475569;">对应到 AI：格式转换、代码生成、批量整理、按规则检查、结构化输出。</p>
        </div>

        <div class="card" style="background: linear-gradient(135deg, #fff7ed, #fef2f2); border-color: #fed7aa; min-height: 300px;">
            <h3 style="color: #9a3412;">各家表现不一的路况</h3>
            <ul>
                <li>极端天气、城市道路</li>
                <li>乡村道路、人车混杂</li>
                <li>规则冲突，需要现场判断</li>
            </ul>
            <p style="font-size: 1rem; margin-bottom: 0; color: #475569;">对应到 AI：价值判断、复杂博弈、缺少数据的决策、需要最终责任的场景。</p>
        </div>
    </div>

    <div class="card" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #eff6ff, #f0fdf4); border-color: #bfdbfe;">
        <p style="font-size: 1.45rem; font-weight: 700; margin: 0; color: #0f172a; max-width: none;">真正的提效方式：把 AI 放到它擅长的路段上，并保留人的判断与验收。</p>
    </div>
`;
