const scenarios = [
    {
        category: '审核类', domain: '法务', title: 'PPT 和 checklist 内容核对', fit: 'high', fitLabel: '高适配', phase: '优先试点',
        summary: '适合先落地。材料和标准相对明确，AI 可以快速找遗漏、冲突、表述不一致。',
        recommended: ['把 checklist 拆成可判断的问题，例如是否包含估值、交割条件、退出条款、保密要求。', '让 AI 输出“通过、疑似缺失、需人工确认”三类结果，并引用对应页码或段落。', '建立常见问题库，把历史核对意见沉淀为复核规则。'],
        deliverables: ['核对表', '疑似遗漏清单', '需要人工确认的问题列表'],
        risks: ['PPT 表述可能过于概括，AI 不能替代法务判断。', '扫描版或图片版材料会降低识别准确率。']
    },
    {
        category: '分析类', domain: '法务', title: '分析各种协议风险点', fit: 'medium', fitLabel: '中高适配', phase: '人审必需',
        summary: '适合作为风险初筛和条款摘要，不适合直接生成最终法律意见。',
        recommended: ['按协议类型建立风险维度，例如权利义务、违约责任、排他性、信息披露、争议解决。', '要求 AI 输出风险等级、原文依据、影响解释和建议修改方向。', '高风险条款进入法务复核队列，低风险条款用于提高阅读效率。'],
        deliverables: ['风险热力图', '重点条款摘要', '修改建议初稿'],
        risks: ['模型可能误解法律语境或忽略司法管辖差异。', '协议风险需要结合交易背景，不能只看文本。']
    },
    {
        category: '审核类', domain: '法务', title: '投资协议与模板重点条款覆盖核对', fit: 'high', fitLabel: '高适配', phase: '重点建设',
        summary: '非常适合做智能对比。关键不是逐字比对，而是判断模板要求是否被实质覆盖。',
        recommended: ['把模板条款拆成“要求、判断标准、可接受替代表述、不可接受缺口”。', '使用语义匹配判断覆盖程度，输出已覆盖、部分覆盖、未覆盖、表述冲突。', '对部分覆盖项解释差异，例如触发条件不同、责任主体不同、时间窗口不同。'],
        deliverables: ['模板覆盖率报告', '未覆盖风险清单', '逐条差异解释'],
        risks: ['条款语义细微差异可能影响重大，需要律师确认。', '模板本身需要版本管理，否则对比基准会混乱。']
    },
    {
        category: '审核类', domain: '人事', title: '按岗位画像匹配简历库候选人', fit: 'medium', fitLabel: '中等适配', phase: '谨慎试点',
        summary: '适合辅助召回和排序，但不能把 AI 排名作为淘汰候选人的唯一依据。',
        recommended: ['把岗位画像拆为硬性条件、加分项、风险项和不可使用因素。', '输出匹配理由和证据片段，而不是只给分数。', '保留 HR 人工复核，定期抽查是否存在偏见。'],
        deliverables: ['候选人长名单', '匹配理由', '信息缺口提示'],
        risks: ['简历信息可能夸大或不完整。', '自动化筛选存在歧视和合规风险。']
    },
    {
        category: '审核类', domain: '人事', title: '根据简历输出评价、关注问题和面试提问清单', fit: 'high', fitLabel: '高适配', phase: '优先试点',
        summary: '适合快速准备面试，尤其能帮助面试官围绕经历真实性和岗位匹配度提问。',
        recommended: ['按能力模型输出经验亮点、疑点、追问问题和验证方法。', '区分事实摘要和推测判断，避免把猜测写成结论。', '为不同面试轮次生成不同问题，例如业务、管理、文化和压力场景。'],
        deliverables: ['候选人摘要', '面试问题清单', '风险追问建议'],
        risks: ['AI 对候选人的评价可能带有偏见。', '面试问题应避免触及隐私和不合规内容。']
    },
    {
        category: '审核类', domain: '人事', title: '根据绩效要求和达成情况形成评价结果、排名', fit: 'medium', fitLabel: '中等适配', phase: '辅助分析',
        summary: '适合整理事实、生成评价初稿和解释差异，不适合直接决定排名与奖惩。',
        recommended: ['先固化定量口径，例如目标权重、达成率、例外规则和数据来源。', 'AI 负责解释波动、生成评价草稿、识别数据缺失。', '排名逻辑应透明，最终结果由管理者校准。'],
        deliverables: ['绩效评价初稿', '达成率分析', '异常数据提示'],
        risks: ['指标口径不清会导致输出看似客观但实际失真。', '绩效排名影响员工权益，需要保留申诉和复核机制。']
    },
    {
        category: 'AI助手类', domain: '投资', title: '基于资料和公开信息进行项目判断', fit: 'medium', fitLabel: '中高适配', phase: '研究助手',
        summary: '适合作为信息搜集、结构化分析和风险提示助手，不能替代投资判断。',
        recommended: ['把输入分为公司提供资料、公开信息、内部判断和待验证假设。', '要求 AI 输出观点、证据、反证、关键风险和下一步 DD 问题。', '对外部信息保留来源和时间，避免过期信息影响判断。'],
        deliverables: ['项目初筛 memo', '风险点列表', '待验证问题清单'],
        risks: ['公开信息可能过期或不准确。', 'AI 容易把缺乏证据的推断包装成确定观点。']
    },
    {
        category: '分析类', domain: '投资', title: '给定行业和本地资料生成行业研究报告', fit: 'high', fitLabel: '高适配', phase: '重点建设',
        summary: '适合生成初稿、框架和资料整合，尤其适合把散落材料变成可读报告。',
        recommended: ['先定义报告模板，包括产业链、市场规模、竞争格局、商业模式、投资机会和风险。', '本地资料优先，公开资料补充，并要求重要结论附来源。', '用投资人视角重写结论，避免产出泛泛的咨询报告。'],
        deliverables: ['行业研究报告初稿', '资料索引', '投资机会地图'],
        risks: ['行业数据口径差异大，需要标注来源和假设。', '报告容易同质化，需要加入内部观点。']
    },
    {
        category: '分析类', domain: '投资', title: '根据资料自动生成 DD、立项和投决报告', fit: 'high', fitLabel: '高适配', phase: '模板化落地',
        summary: '适合生成结构化初稿和缺口清单，但关键判断、估值和决策建议需要投资团队负责。',
        recommended: ['把 DD、立项、投决报告模板拆成固定章节和证据要求。', 'AI 根据资料填充已知内容，同时标注缺失材料和无法判断项。', '保留版本记录，明确哪些内容来自原始资料、哪些是分析推论。'],
        deliverables: ['DD 报告初稿', '立项报告初稿', '投决报告初稿', '资料缺口清单'],
        risks: ['资料不完整时，AI 可能过度补全。', '报告看起来完整不等于结论可靠。']
    },
    {
        category: 'AI助手类', domain: '投资', title: '公开信息搜索与监控助手', fit: 'medium', fitLabel: '中高适配', phase: '谨慎试点',
        summary: '可以养一个龙虾或类似 AI Agent，持续搜索网上公开信息、竞品动态、融资新闻和政策变化。',
        recommended: ['限定只处理公开网页、公开报告、新闻和公告，不接触账号内私有数据。', '把搜索任务拆成固定主题、关键词、来源白名单和更新频率。', '输出必须保留链接、时间、原文片段和不确定性说明。'],
        deliverables: ['公开信息监控简报', '来源链接清单', '待人工核查线索'],
        risks: ['爬虫可能违反网站 ToS、robots 规则或触发反爬机制。', '不能抓取需要登录、付费、绕过访问控制或包含个人敏感信息的数据。']
    }
];

const scenarioList = document.querySelector('#scenarioList');
const scenarioDetail = document.querySelector('#scenarioDetail');
const filterButtons = document.querySelectorAll('.filter');
let activeFilter = 'all';
let activeScenario = scenarios[0];

function fitClass(fit) {
    return fit === 'high' ? 'high' : fit === 'medium' ? 'medium' : 'low';
}

function renderScenarios() {
    const filtered = activeFilter === 'all' ? scenarios : scenarios.filter((scenario) => scenario.category === activeFilter);
    if (!filtered.includes(activeScenario)) activeScenario = filtered[0] || scenarios[0];

    scenarioList.innerHTML = filtered.map((scenario) => `
        <button class="scenario-card ${scenario === activeScenario ? 'active' : ''}" data-title="${scenario.title}">
            <div class="card-top">
                <span class="dept-tag">${scenario.category}</span>
                <span class="domain-tag">${scenario.domain}</span>
                <span class="fit-tag ${fitClass(scenario.fit)}">${scenario.fitLabel}</span>
            </div>
            <h3>${scenario.title}</h3>
            <p>${scenario.summary}</p>
        </button>
    `).join('');

    document.querySelectorAll('.scenario-card').forEach((card) => {
        card.addEventListener('click', () => {
            activeScenario = scenarios.find((scenario) => scenario.title === card.dataset.title);
            renderScenarios();
            renderDetail();
        });
    });
}

function listItems(items) {
    return items.map((item) => `<li>${item}</li>`).join('');
}

function renderDetail() {
    const scenario = activeScenario;
    scenarioDetail.innerHTML = `
        <div class="detail-header">
            <span class="dept-tag">${scenario.category}</span>
                <span class="domain-tag">${scenario.domain}</span>
            <span class="fit-tag ${fitClass(scenario.fit)}">${scenario.fitLabel}</span>
            <span class="phase-tag">${scenario.phase}</span>
        </div>
        <h3 class="detail-title">${scenario.title}</h3>
        <p class="detail-summary">${scenario.summary}</p>
        <div class="detail-block"><h4>推荐怎么做</h4><ul>${listItems(scenario.recommended)}</ul></div>
        <div class="detail-block"><h4>建议交付物</h4><ul>${listItems(scenario.deliverables)}</ul></div>
        <div class="detail-block"><h4>可能风险点</h4><ul>${listItems(scenario.risks)}</ul></div>
    `;
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        renderScenarios();
        renderDetail();
    });
});

renderScenarios();
renderDetail();
