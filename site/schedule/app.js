// 默认初始化数据 (6/29 - 7/5日程安排)
const DEFAULT_EVENTS = [
    // 6月29日 周一 (day: 1)
    { id: 'm1', day: 1, title: '🌅 起床早餐', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 'm2', day: 1, title: '🚶 晨间活动 / 和妹妹玩', startTime: '08:00', endTime: '09:00', color: 'orange', desc: '' },
    { id: 'm3', day: 1, title: '🛏️ 整理床铺 (家务)', startTime: '09:00', endTime: '10:00', color: 'gray', desc: '' },
    { id: 'm4', day: 1, title: '🎹 钢琴上午 30m', startTime: '10:00', endTime: '10:30', color: 'green', desc: '' },
    { id: 'm5', day: 1, title: '📖 阅读 40m', startTime: '10:30', endTime: '11:10', color: 'green', desc: '' },
    { id: 'm6', day: 1, title: '🎮 自由游戏 / 和妹妹玩', startTime: '11:10', endTime: '12:00', color: 'rose', desc: '' },
    { id: 'm7', day: 1, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 'm8', day: 1, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'm9', day: 1, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'm10', day: 1, title: '📝 预习 📚 语文', startTime: '14:30', endTime: '15:30', color: 'blue', desc: '' },
    { id: 'm11', day: 1, title: '🧹 扫地擦桌 (家务)', startTime: '15:30', endTime: '16:30', color: 'gray', desc: '' },
    { id: 'm12', day: 1, title: '📺 家有儿女', startTime: '16:30', endTime: '17:00', color: 'rose', desc: '' },
    { id: 'm13', day: 1, title: '💃 广场舞 1h', startTime: '17:00', endTime: '18:00', color: 'rose', desc: '' },
    { id: 'm14', day: 1, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 'm15', day: 1, title: '📐 几何 爸爸课', startTime: '19:00', endTime: '20:00', color: 'purple', desc: '' },
    { id: 'm16', day: 1, title: '📖 阅读 40m', startTime: '20:00', endTime: '20:40', color: 'green', desc: '' },
    { id: 'm17', day: 1, title: '📝 日记+洗漱+睡觉', startTime: '20:40', endTime: '21:00', color: 'orange', desc: '' },

    // 6月30日 周二 (day: 2)
    { id: 't1', day: 2, title: '🌅 起床早餐', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 't2', day: 2, title: '🚶 晨间活动 / 和妹妹玩', startTime: '08:00', endTime: '09:00', color: 'orange', desc: '' },
    { id: 't3', day: 2, title: '🍳 帮忙洗菜 (家务)', startTime: '09:00', endTime: '10:00', color: 'gray', desc: '' },
    { id: 't4', day: 2, title: '🎹 钢琴上午 30m', startTime: '10:00', endTime: '10:30', color: 'green', desc: '' },
    { id: 't5', day: 2, title: '📖 阅读 40m', startTime: '10:30', endTime: '11:10', color: 'green', desc: '' },
    { id: 't6', day: 2, title: '🎮 自由游戏 / 和妹妹玩', startTime: '11:10', endTime: '12:00', color: 'rose', desc: '' },
    { id: 't7', day: 2, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 't8', day: 2, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 't9', day: 2, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 't10', day: 2, title: '📝 预习 📐 数学', startTime: '14:30', endTime: '15:30', color: 'blue', desc: '' },
    { id: 't11', day: 2, title: '📚 整理书桌 (家务)', startTime: '15:30', endTime: '16:30', color: 'gray', desc: '' },
    { id: 't12', day: 2, title: '📺 家有儿女', startTime: '16:30', endTime: '17:00', color: 'rose', desc: '' },
    { id: 't13', day: 2, title: '💃 广场舞 1h', startTime: '17:00', endTime: '18:00', color: 'rose', desc: '' },
    { id: 't14', day: 2, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 't15', day: 2, title: '💻 编程 爸爸课', startTime: '19:00', endTime: '20:00', color: 'purple', desc: '' },
    { id: 't16', day: 2, title: '📖 阅读 40m', startTime: '20:00', endTime: '20:40', color: 'green', desc: '' },
    { id: 't17', day: 2, title: '📝 日记+洗漱+睡觉', startTime: '20:40', endTime: '21:00', color: 'orange', desc: '' },

    // 7月1日 周三 (day: 3)
    { id: 'w1', day: 3, title: '🌅 起床早餐', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 'w2', day: 3, title: '🚶 晨间活动 / 和妹妹玩', startTime: '08:00', endTime: '09:00', color: 'orange', desc: '' },
    { id: 'w3', day: 3, title: '🌱 浇花喂鱼 (家务)', startTime: '09:00', endTime: '10:00', color: 'gray', desc: '' },
    { id: 'w4', day: 3, title: '🎹 钢琴上午 30m', startTime: '10:00', endTime: '10:30', color: 'green', desc: '' },
    { id: 'w5', day: 3, title: '📖 阅读 40m', startTime: '10:30', endTime: '11:10', color: 'green', desc: '' },
    { id: 'w6', day: 3, title: '🎮 自由游戏 / 和妹妹玩', startTime: '11:10', endTime: '12:00', color: 'rose', desc: '' },
    { id: 'w7', day: 3, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 'w8', day: 3, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'w9', day: 3, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'w10', day: 3, title: '📝 预习 🔤 英语', startTime: '14:30', endTime: '15:30', color: 'blue', desc: '' },
    { id: 'w11', day: 3, title: '🧺 收叠衣物 (家务)', startTime: '15:30', endTime: '16:30', color: 'gray', desc: '' },
    { id: 'w12', day: 3, title: '📺 家有儿女', startTime: '16:30', endTime: '17:00', color: 'rose', desc: '' },
    { id: 'w13', day: 3, title: '💃 广场舞 1h', startTime: '17:00', endTime: '18:00', color: 'rose', desc: '' },
    { id: 'w14', day: 3, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 'w15', day: 3, title: '📐 几何 爸爸课', startTime: '19:00', endTime: '20:00', color: 'purple', desc: '' },
    { id: 'w16', day: 3, title: '📖 阅读 40m', startTime: '20:00', endTime: '20:40', color: 'green', desc: '' },
    { id: 'w17', day: 3, title: '📝 日记+洗漱+睡觉', startTime: '20:40', endTime: '21:00', color: 'orange', desc: '' },

    // 7月2日 周四 (day: 4)
    { id: 'th1', day: 4, title: '🌅 起床早餐', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 'th2', day: 4, title: '🚶 晨间活动 / 和妹妹玩', startTime: '08:00', endTime: '09:00', color: 'orange', desc: '' },
    { id: 'th3', day: 4, title: '👕 叠衣服 (家务)', startTime: '09:00', endTime: '10:00', color: 'gray', desc: '' },
    { id: 'th4', day: 4, title: '🎹 钢琴上午 30m', startTime: '10:00', endTime: '10:30', color: 'green', desc: '' },
    { id: 'th5', day: 4, title: '📖 阅读 40m', startTime: '10:30', endTime: '11:10', color: 'green', desc: '' },
    { id: 'th6', day: 4, title: '🎮 自由游戏 / 和妹妹玩', startTime: '11:10', endTime: '12:00', color: 'rose', desc: '' },
    { id: 'th7', day: 4, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 'th8', day: 4, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'th9', day: 4, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'th10', day: 4, title: '📝 预习 📚 语文', startTime: '14:30', endTime: '15:30', color: 'blue', desc: '' },
    { id: 'th11', day: 4, title: '🍎 准备水果 (家务)', startTime: '15:30', endTime: '16:30', color: 'gray', desc: '' },
    { id: 'th12', day: 4, title: '🏃‍♂️ 体能课 1h', startTime: '16:30', endTime: '17:30', color: 'rose', desc: '' },
    { id: 'th13', day: 4, title: '🚿 洗澡+休息', startTime: '17:30', endTime: '18:00', color: 'orange', desc: '' },
    { id: 'th14', day: 4, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 'th15', day: 4, title: '💻 编程 爸爸课', startTime: '19:00', endTime: '20:00', color: 'purple', desc: '' },
    { id: 'th16', day: 4, title: '📖 阅读 40m / 家有儿女(补)', startTime: '20:00', endTime: '20:40', color: 'green', desc: '' },
    { id: 'th17', day: 4, title: '📝 日记+洗漱+睡觉', startTime: '20:40', endTime: '21:00', color: 'orange', desc: '' },

    // 7月3日 周五 (day: 5)
    { id: 'f1', day: 5, title: '🌅 起床早餐', startTime: '07:00', endTime: '07:30', color: 'orange', desc: '' },
    { id: 'f2', day: 5, title: '🚗 送学校', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 'f3', day: 5, title: '🏫 在校上课（半天）', startTime: '08:00', endTime: '12:00', color: 'blue', desc: '' },
    { id: 'f4', day: 5, title: '🍱 回家午饭+和妹妹聊天', startTime: '12:00', endTime: '13:00', color: 'orange', desc: '' },
    { id: 'f5', day: 5, title: '😴 短午休 / 和妹妹安静玩', startTime: '13:00', endTime: '13:45', color: 'orange', desc: '' },
    { id: 'f6', day: 5, title: '🍎 加餐+和妹妹玩', startTime: '13:45', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'f7', day: 5, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'f8', day: 5, title: '📝 预习 📐 数学', startTime: '14:30', endTime: '15:30', color: 'blue', desc: '' },
    { id: 'f9', day: 5, title: '🧽 擦地拖地 (家务)', startTime: '15:30', endTime: '16:30', color: 'gray', desc: '' },
    { id: 'f10', day: 5, title: '📺 家有儿女', startTime: '16:30', endTime: '17:00', color: 'rose', desc: '' },
    { id: 'f11', day: 5, title: '🎮 自由 / 和妹妹玩', startTime: '17:00', endTime: '17:30', color: 'rose', desc: '' },
    { id: 'f12', day: 5, title: '🎼 钢琴课 1h（外教）', startTime: '17:30', endTime: '18:30', color: 'purple', desc: '' },
    { id: 'f13', day: 5, title: '🍲 晚饭', startTime: '18:30', endTime: '19:30', color: 'orange', desc: '' },
    { id: 'f14', day: 5, title: '📐 几何 爸爸课', startTime: '19:30', endTime: '20:30', color: 'purple', desc: '' },
    { id: 'f15', day: 5, title: '📖 阅读 20m', startTime: '20:30', endTime: '20:50', color: 'green', desc: '' },
    { id: 'f16', day: 5, title: '📝 日记+睡觉', startTime: '20:50', endTime: '21:00', color: 'orange', desc: '' },

    // 7月4日 周六 (day: 6)
    { id: 'sa1', day: 6, title: '🌅 起床早餐+多吃', startTime: '07:30', endTime: '08:30', color: 'orange', desc: '' },
    { id: 'sa2', day: 6, title: '🚗 出发攀岩馆', startTime: '08:30', endTime: '09:00', color: 'orange', desc: '' },
    { id: 'sa3', day: 6, title: '🧗 攀岩 3h', startTime: '09:00', endTime: '12:00', color: 'rose', desc: '' },
    { id: 'sa4', day: 6, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 'sa5', day: 6, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'sa6', day: 6, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'sa7', day: 6, title: '📖 阅读 40m', startTime: '14:30', endTime: '15:10', color: 'green', desc: '' },
    { id: 'sa8', day: 6, title: '📺 家有儿女', startTime: '15:10', endTime: '15:40', color: 'rose', desc: '' },
    { id: 'sa9', day: 6, title: '🏃 自由休息 / 和妹妹玩', startTime: '15:40', endTime: '17:00', color: 'rose', desc: '' },
    { id: 'sa10', day: 6, title: '💃 广场舞 1h', startTime: '17:00', endTime: '18:00', color: 'rose', desc: '' },
    { id: 'sa11', day: 6, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 'sa12', day: 6, title: '📖 阅读+和妹妹散步+睡觉', startTime: '19:00', endTime: '21:00', color: 'green', desc: '' },

    // 7月5日 周日 (day: 7)
    { id: 'su1', day: 7, title: '🌅 起床早餐', startTime: '07:30', endTime: '08:00', color: 'orange', desc: '' },
    { id: 'su2', day: 7, title: '🚶 晨间活动 / 和妹妹玩', startTime: '08:00', endTime: '09:00', color: 'orange', desc: '' },
    { id: 'su3', day: 7, title: '🏃 户外晨间 / 和妹妹玩', startTime: '09:00', endTime: '10:00', color: 'rose', desc: '' },
    { id: 'su4', day: 7, title: '🎹 钢琴上午 30m', startTime: '10:00', endTime: '10:30', color: 'green', desc: '' },
    { id: 'su5', day: 7, title: '📖 阅读 40m', startTime: '10:30', endTime: '11:10', color: 'green', desc: '' },
    { id: 'su6', day: 7, title: '🎮 自由（手工/桌游 / 和妹妹玩）', startTime: '11:10', endTime: '12:00', color: 'rose', desc: '' },
    { id: 'su7', day: 7, title: '🍱 午饭+午休 / 和妹妹安静玩', startTime: '12:00', endTime: '13:30', color: 'orange', desc: '' },
    { id: 'su8', day: 7, title: '🍎 加餐+和妹妹玩', startTime: '13:30', endTime: '14:00', color: 'orange', desc: '' },
    { id: 'su9', day: 7, title: '🎹 钢琴下午 30m', startTime: '14:00', endTime: '14:30', color: 'green', desc: '' },
    { id: 'su10', day: 7, title: '🎮 家庭活动 / 和妹妹玩', startTime: '14:30', endTime: '15:30', color: 'orange', desc: '' },
    { id: 'su11', day: 7, title: '🎮 自由（与妹妹）', startTime: '15:30', endTime: '16:30', color: 'rose', desc: '' },
    { id: 'su12', day: 7, title: '📺 家有儿女', startTime: '16:30', endTime: '17:00', color: 'rose', desc: '' },
    { id: 'su13', day: 7, title: '💃 广场舞 1h', startTime: '17:00', endTime: '18:00', color: 'rose', desc: '' },
    { id: 'su14', day: 7, title: '🍲 晚饭', startTime: '18:00', endTime: '19:00', color: 'orange', desc: '' },
    { id: 'su15', day: 7, title: '🚗 出发去泳池', startTime: '19:00', endTime: '19:30', color: 'orange', desc: '' },
    { id: 'su16', day: 7, title: '🏊 游泳课 1h', startTime: '19:30', endTime: '20:30', color: 'rose', desc: '' },
    { id: 'su17', day: 7, title: '🚿 洗澡+睡觉', startTime: '20:30', endTime: '21:00', color: 'orange', desc: '' }
];

// 核心状态数据
let events = [];

// DOM 元素引用
const scheduleSheet = document.getElementById('schedule-sheet');
const layoutSelect = document.getElementById('print-layout-select');
const btnClear = document.getElementById('btn-clear');
const btnPrint = document.getElementById('btn-print');
const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const btnCancel = document.getElementById('btn-cancel');
const btnDeleteEvent = document.getElementById('btn-delete-event');
const modalHeading = document.getElementById('modal-heading');

// 表单输入元素
const inputId = document.getElementById('event-id');
const inputDay = document.getElementById('event-day');
const inputTitle = document.getElementById('event-title');
const inputStart = document.getElementById('event-start');
const inputEnd = document.getElementById('event-end');
const inputDesc = document.getElementById('event-desc');

// 注入打印页面大小和方向样式的助手函数
function injectPrintStyle(orientation) {
    let styleTag = document.getElementById('print-orientation-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'print-orientation-style';
        document.head.appendChild(styleTag);
    }
    // 注入 A4 尺寸及方向设定
    styleTag.textContent = `@media print { @page { size: A4 ${orientation}; margin: 8mm 6mm; } }`;
}

// 保存标题和备注到 LocalStorage 的逻辑
function setupEditableSheetMeta() {
    const sheetTitle = document.getElementById('sheet-title');
    const sheetDesc = document.getElementById('sheet-desc');

    // 加载缓存
    const cachedTitle = localStorage.getItem('schedule_sheet_title_629');

    if (cachedTitle && sheetTitle) sheetTitle.textContent = cachedTitle;

    // 监听输入保存
    if (sheetTitle) {
        sheetTitle.addEventListener('blur', () => {
            localStorage.setItem('schedule_sheet_title_629', sheetTitle.textContent.trim());
        });
    }

    if (sheetDesc) {
        const cachedDesc = localStorage.getItem('schedule_sheet_desc_629');
        if (cachedDesc) sheetDesc.textContent = cachedDesc;
        sheetDesc.addEventListener('blur', () => {
            localStorage.setItem('schedule_sheet_desc_629', sheetDesc.textContent.trim());
        });
    }
}

// 数据持久化
function loadData() {
    const localData = localStorage.getItem('schedule_events_v3');
    if (localData) {
        try {
            events = JSON.parse(localData);
        } catch (e) {
            console.error('加载本地数据出错，应用默认值', e);
            events = [...DEFAULT_EVENTS];
        }
    } else {
        events = [...DEFAULT_EVENTS];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('schedule_events_v3', JSON.stringify(events));
}

// 格式化时间显示
function formatTimeRange(start, end) {
    if (!start && !end) return '';
    if (start && !end) return `${start}`;
    if (!start && end) return `${end}`;
    return `${start} - ${end}`;
}

// 排序日程 (优先按时间，空时间排在最前)
function sortEvents(a, b) {
    if (!a.startTime) return -1;
    if (!b.startTime) return 1;
    return a.startTime.localeCompare(b.startTime);
}

// 渲染日程网格
function renderCalendar() {
    // 获取所有的天数栏位容器
    const columns = document.querySelectorAll('.day-column');
    
    columns.forEach(col => {
        const dayNum = parseInt(col.getAttribute('data-day'), 10);
        const listContainer = col.querySelector('.events-list');
        listContainer.innerHTML = ''; // 清空列表

        // 筛选该天的日程
        const dayEvents = events.filter(e => e.day === dayNum).sort(sortEvents);

        dayEvents.forEach(evt => {
            const card = document.createElement('div');
            card.className = `event-card tag-${evt.color || 'blue'}`;
            card.setAttribute('data-id', evt.id);
            
            // 构建卡片内部 HTML
            let timeHtml = '';
            const timeStr = formatTimeRange(evt.startTime, evt.endTime);
            if (timeStr) {
                timeHtml = `<span class="event-time">${timeStr}</span>`;
            }

            let descHtml = '';
            if (evt.desc) {
                descHtml = `<div class="event-desc">${evt.desc}</div>`;
            }

            card.innerHTML = `
                ${timeHtml}
                <div class="event-title">${evt.title}</div>
                ${descHtml}
            `;

            // 双击/单击进入编辑状态
            card.addEventListener('click', () => openModalForEdit(evt));

            listContainer.appendChild(card);
        });
    });
}

// 打开弹窗：新增模式
function openModalForAdd(dayNum) {
    modalHeading.textContent = '添加日程安排';
    eventForm.reset();
    
    inputId.value = '';
    inputDay.value = dayNum;
    
    // 隐藏删除按钮
    btnDeleteEvent.classList.add('hidden');
    
    // 默认选中第一个颜色
    document.querySelector('input[name="event-color"][value="blue"]').checked = true;
    
    eventModal.classList.add('active');
    inputTitle.focus();
}

// 打开弹窗：编辑模式
function openModalForEdit(evt) {
    modalHeading.textContent = '编辑日程安排';
    
    inputId.value = evt.id;
    inputDay.value = evt.day;
    inputTitle.value = evt.title;
    inputStart.value = evt.startTime || '';
    inputEnd.value = evt.endTime || '';
    inputDesc.value = evt.desc || '';
    
    // 显示删除按钮
    btnDeleteEvent.classList.remove('hidden');
    
    // 选中对应颜色标签
    const radio = document.querySelector(`input[name="event-color"][value="${evt.color || 'blue'}"]`);
    if (radio) radio.checked = true;
    
    eventModal.classList.add('active');
    inputTitle.focus();
}

// 关闭弹窗
function closeModal() {
    eventModal.classList.remove('active');
}

// 表单提交保存
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = inputId.value;
    const day = parseInt(inputDay.value, 10);
    const title = inputTitle.value.trim();
    const startTime = inputStart.value;
    const endTime = inputEnd.value;
    const desc = inputDesc.value.trim();
    const color = document.querySelector('input[name="event-color"]:checked').value;
    
    if (id) {
        // 更新现有日程
        const idx = events.findIndex(evt => evt.id === id);
        if (idx !== -1) {
            events[idx] = { ...events[idx], title, startTime, endTime, color, desc };
        }
    } else {
        // 新建日程
        const newEvent = {
            id: Date.now().toString(),
            day,
            title,
            startTime,
            endTime,
            color,
            desc
        };
        events.push(newEvent);
    }
    
    saveData();
    renderCalendar();
    closeModal();
});

// 删除日程动作
btnDeleteEvent.addEventListener('click', () => {
    const id = inputId.value;
    if (id && confirm('确定要删除这项日程安排吗？')) {
        events = events.filter(evt => evt.id !== id);
        saveData();
        renderCalendar();
        closeModal();
    }
});

// 清空所有日程
btnClear.addEventListener('click', () => {
    if (confirm('警告：这将会清空所有的日程安排！此操作无法撤销。确定要清空吗？')) {
        events = [];
        saveData();
        renderCalendar();
    }
});

// 打印和布局适配
layoutSelect.addEventListener('change', () => {
    const layout = layoutSelect.value;
    if (layout === 'portrait') {
        scheduleSheet.className = 'schedule-sheet layout-portrait';
        injectPrintStyle('portrait');
    } else {
        scheduleSheet.className = 'schedule-sheet layout-landscape';
        injectPrintStyle('landscape');
    }
});

btnPrint.addEventListener('click', () => {
    window.print();
});

// 基础取消按钮与模态背景点击隐藏
btnCancel.addEventListener('click', closeModal);
eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) closeModal();
});

// 初始化监听器和首次渲染
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCalendar();
    setupEditableSheetMeta();
    
    // 初始化时注入默认横向打印设置
    injectPrintStyle('landscape');

    // 绑定“+”号按钮
    document.querySelectorAll('.day-column').forEach(col => {
        const dayNum = parseInt(col.getAttribute('data-day'), 10);
        const addBtn = col.querySelector('.add-event-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModalForAdd(dayNum);
        });
    });
});
