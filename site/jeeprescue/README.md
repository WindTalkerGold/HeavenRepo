# Jeep Rescue · 赤色要塞

赤色要塞（Jackal）风格的原创俯视角吉普救援小游戏，无需安装或账号。

## 来源与整合

从现有 Azure Static Web App `jeeprescue` 的公开部署
<https://lemon-island-076ebc700.4.azurestaticapps.net/> 导入完整静态程序。
原部署保留，不依赖其资源或跳转。HeavenRepo 发布后入口为 `/jeeprescue/`。

- `engine.js`：游戏模拟、碰撞、敌人和任务规则。
- `renderer.js`：Canvas 战场与战术地图。
- `main.js`：输入、界面、合成音效和游戏循环。
- `index.html`、`style.css`、`icon.svg`：页面及本地资源。

所有模块均使用相对路径，随 HeavenRepo 的 `site/` 一起部署，无需构建或后端。
音效由 Web Audio 合成，不加载外部音频。最高分和声音开关保存在当前域名的
localStorage 中；旧站成绩不会自动迁移。

## 任务与操作

营救 6 名士兵（每次最多搭载 3 人），摧毁北方指挥坦克，再返回撤离基地。
基地可卸载乘员、修复装甲和补充手雷。

| 操作 | 按键 |
| --- | --- |
| 移动 | WASD / 方向键 |
| 射击 | Space / Z / 鼠标左键 |
| 手雷 | X / E / 鼠标右键 |
| 瞄准 | 行驶方向，或按住鼠标指向 |
| 开始 | Enter / START MISSION |
| 暂停或继续 | P / Escape |
| 重新开始 | R（先显示确认界面） |
| 声音开关 | M |

本作主要面向电脑键盘和鼠标，没有触屏移动摇杆。

## 本地预览与检查

从仓库根目录运行：

```bash
python -m http.server -d site 8000
# http://localhost:8000/jeeprescue/
npm run test:jeeprescue
```

ES Modules 必须通过 HTTP 加载，不能直接用 `file://` 打开。
浏览器回归检查覆盖首页入口、子目录资源加载、开始、移动、射击、手雷、暂停、
失焦暂停、重开确认、声音设置与窄屏布局，并验证运行期间没有外站请求。
