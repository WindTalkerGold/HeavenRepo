// 默认初始化数据 (防止白屏，展示示例)
const DEFAULT_EVENTS = [
    { id: '1', day: 1, title: '部门例会', startTime: '09:00', endTime: '10:30', color: 'blue', desc: '汇报上周进度，讨论本周规划' },
    { id: '2', day: 1, title: '健身房锻炼', startTime: '18:30', endTime: '20:00', color: 'orange', desc: '胸腿训练' },
    { id: '3', day: 2, title: '项目需求评审', startTime: '14:00', endTime: '15:30', color: 'purple', desc: '会议室 402 / 线上同步' },
    { id: '4', day: 3, title: '精读《AI工作法》', startTime: '10:00', endTime: '11:30', color: 'green', desc: '阅读第 3、4 章节并记录笔记' },
    { id: '5', day: 4, title: '设计稿初稿评审', startTime: '15:00', endTime: '16:00', color: 'blue', desc: 'UI/UX 团队内部评审' },
    { id: '6', day: 5, title: '周五技术分享', startTime: '16:30', endTime: '17:30', color: 'purple', desc: '主题：MCP 协议在智能体开发中的实践' },
    { id: '7', day: 5, title: '朋友聚餐', startTime: '19:00', endTime: '21:30', color: 'rose', desc: '老地方火锅店' },
    { id: '8', day: 6, title: '英语精读复盘', startTime: '09:30', endTime: '11:00', color: 'green', desc: '完成双语练习题' },
    { id: '9', day: 7, title: '整理本周复盘与计划', startTime: '16:00', endTime: '17:30', color: 'gray', desc: '沉淀至个人知识库' }
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
    const cachedTitle = localStorage.getItem('schedule_sheet_title');
    const cachedDesc = localStorage.getItem('schedule_sheet_desc');

    if (cachedTitle) sheetTitle.textContent = cachedTitle;
    if (cachedDesc) sheetDesc.textContent = cachedDesc;

    // 监听输入保存
    sheetTitle.addEventListener('blur', () => {
        localStorage.setItem('schedule_sheet_title', sheetTitle.textContent.trim());
    });
    sheetDesc.addEventListener('blur', () => {
        localStorage.setItem('schedule_sheet_desc', sheetDesc.textContent.trim());
    });
}

// 数据持久化
function loadData() {
    const localData = localStorage.getItem('schedule_events');
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
    localStorage.setItem('schedule_events', JSON.stringify(events));
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
