# Warm Kitty — 设置页设计文档

> 日期：2026-05-31

## 一句话

给 Warm Kitty 增加一个用户可访问、可持久保存的**设置页**，含三块：语言（整个 app 本地化，简中/繁中/English）、取暖保护（自动停止上限的步进器）、关于（版本 + 网站/GitHub/赞助链接）。严格照设计稿实现，全部在现有 WebView 内完成。

## 背景与现状

- 出货 app 是 444×626 无边框自定义窗口，UI 是 WebView 里的 React（`Resources/web/index.html`），通过 `bridge` 调用原生加热引擎。
- 代码里原有一套开发用 `TweaksPanel`（暖意计样式/背景随温度/旁白/强调色），但在出货版被注释隐藏，且其保存机制（postMessage 给设计宿主）在原生 app 里是死的。**本设计不复用、不暴露这套显示偏好**——设计稿里没有。
- 现有 `wk_target` 已用 `localStorage` 持久化，本设计沿用同一持久化方式。
- 所有可见文案当前硬编码为简体中文。

## 目标与非目标

**目标**
- 标题栏齿轮进入、同窗口整页切换的设置页，`完成` 返回。
- 整个 app 的三语本地化（简中/繁中/English），切换立即全局生效。
- 取暖保护时间可调，接管原生写死的自动停止上限。
- 关于区展示真实版本号，三个外链在默认浏览器打开。
- 所有设置用 `localStorage` 持久化，跨启动保留。

**非目标**
- 不暴露已有显示偏好（暖意计/背景/旁白/强调色），保持默认隐藏。
- 不做系统语言自动探测（首启默认简体中文）。
- 不做原生 Cmd+, 偏好窗口。
- 不引入第三方依赖。

## 导航与窗口集成

- 主界面 `App` 增加 `view` 状态：`'main' | 'settings'`。
- 主界面标题栏**右侧新增齿轮图标**，点击 `setView('settings')`。
- 设置页顶栏右侧 `完成` 按钮 `setView('main')` 返回。
- **必须的原生改动（`WarmKittyApp.swift` 的 `DragStrip`）**：当前 DragStrip 覆盖标题栏 x=72→444 并吞掉点击（左 72px 留给红绿灯才可点）。右侧齿轮 / `完成` 落在 DragStrip 下会点不到。改为**居中拖拽条**：左留 `trafficLightWidth`(72px)、右留约 64px，两侧都可点击，中间仍可拖动窗口。自适应约束保持窗口宽度变化时居中（当前窗口固定尺寸，按固定 frame 即可）。
- 设置页内容高于可视区（关于区含图标+链接），设置页容器**内部纵向滚动**（`overflow-y:auto`），主界面不滚动。

## 国际化（i18n）

- 新增字符串表常量：
  ```js
  const STRINGS = {
    'zh-Hans': { ... },
    'zh-Hant': { ... },
    'en': { ... },
  };
  ```
- 覆盖**所有可见文案**，键位至少包括：
  - 状态标签：`freezing/waking/stretching/cozy/toasty/overheat`（替换现有 `STATE_LABEL`）。
  - 旁白：上述 6 态各一条 + `idleHint`（替换现有 `NARRATION` + `IDLE_HINT`）。
  - 主界面：`targetTemp`（目标温度）、`targetHint`（默认 38° · 暖手又安全）、`start`（开始取暖）、`stop`（停止取暖）、`footerHint`（取暖时会耗电、风扇会响 · 到温度自动停 🐾）。
  - 设置页：`settings`、`done`、`language`、`heatProtection`、`protectTime`、`minutesUnit`（分钟）、`protectDesc`（保护说明）、`about`、`version`、`website`、`github`、`sponsor`、语言选项显示名。
- 品牌名 `Warm Kitty` 与英文 tagline `"Warm Kitty, warm laptop, warm you."` 在三语下均保持不变。
- 新增 `useLang` hook：读 `localStorage['wk_lang']`，默认 `'zh-Hans'`；提供 `lang` 与 `setLang`，`setLang` 写回 `localStorage` 并触发重渲染。
- 取词函数 `t(key)`：返回当前语言对应字符串，缺失时回退 `zh-Hans`。
- 三语文案翻译原则：繁中做地道用词转换（非简繁字形直转），英文为符合语气的重写（卖萌猫咪口吻），实现时逐条打磨。

## 设置页布局（照设计稿）

整页背景沿用主界面暖奶油渐变。结构自上而下：

1. **顶栏**：左 `设置`（粗体深棕 `#6E4A33` 一族）、右 `完成`（橙色 `t.accent`/`#E8824B`），下方 0.5px 分隔线，风格与主标题栏一致。
2. **语言**：小节标题 `语言` + 白色圆角下拉框（`<select>`，自定义箭头），选项：`简体中文 / 繁體中文 / English`。选中即调用 `setLang`，全局立即切换。
3. **取暖保护**：小节标题 `取暖保护` + 白卡：
   - 一行：左 `保护时间`，右步进器 `[−]  N 分钟  [+]`。
   - 卡内说明文字（`protectDesc`）。
   - 取值：范围 **1–15 分钟，步长 1，默认 5**；`−`/`+` 到边界禁用。存 `localStorage['wk_maxMinutes']`。
4. **关于**：小节标题 `关于` + 居中 app 图标 + `Warm Kitty`（Baloo 字体）+ 斜体 tagline；下方白卡列表：
   - `版本` … 右侧版本号（来自原生回传，见下）。
   - 🌐 `网站` →（占位 URL），尾部 chevron。
   - GitHub 图标 `GitHub` →（占位 URL），尾部 chevron。
   - ❤️ `赞助我们` → `https://sponsor.barrybarrywu.com`，尾部 chevron。
   - 三行点击都 `post({type:'openURL', url})`，在默认浏览器打开。

占位 URL 用明确的常量（如 `WEBSITE_URL`、`GITHUB_URL`），便于后续替换；待仓库推送/网站上线后由用户提供真实地址。

## 原生 bridge 改动

**`SessionController.swift`**
- 将 `private let maxDuration: TimeInterval = 30 * 60` 改为可配置 `private var maxDuration: TimeInterval = 5 * 60`（默认 5 分钟）。
- 新增 `func setMaxMinutes(_ minutes: Double)`：`maxDuration = minutes * 60`。

**`Bridge.swift`**
- `userContentController` 新增分支：
  - `setMaxMinutes`：取 `body["value"]` 调 `session.setMaxMinutes(_)`。
  - `openURL`：取 `body["url"] as? String`，`NSWorkspace.shared.open(url)` 在默认浏览器打开。
- 版本回传：在收到 `ready` 时，读取 `Bundle.main` 的 `CFBundleShortVersionString`，`eval("window.warmkitty && warmkitty.onVersion('\(v)')")`，页面据此显示版本号（避免与 `project.yml` 双份硬编码漂移）。

**页面侧（index.html）**
- `window.warmkitty` 增加 `onVersion(v)` 回调，设到 `version` 状态，关于区展示。
- `ready` 后上报当前保护时间：`post({type:'setMaxMinutes', value: maxMinutes})`，使原生与持久化值同步。
- 保护时间步进器变更时 `post({type:'setMaxMinutes', value})`。

## 持久化与默认值

| 键 | 默认 | 范围/取值 |
|---|---|---|
| `wk_lang` | `'zh-Hans'` | `zh-Hans` / `zh-Hant` / `en` |
| `wk_maxMinutes` | `5` | 整数 1–15 |
| `wk_target` | （现有，38） | TMIN–TMAX |

全部经 `localStorage`，WKWebView 默认持久化数据存储跨启动保留。

## 资源

- 将 app 图标 PNG（来源 `Assets.xcassets` / 设计导出 `exports/warm-kitty-1024.png`）放入 `Resources/web/images/`（如 `app-icon.png`），关于区 `<img>` 引用。

## 测试与验收

success criteria（手动验证为主，无单测框架）：
1. 主界面标题栏齿轮可点 → 进入设置页；`完成` 返回；窗口中段仍可拖动。
2. 语言切到 繁體中文 / English：主界面旁白、状态、按钮、滑块、底部提示及设置页全部文案切换；重启后保留所选语言。
3. 保护时间用 `−/+` 调到如 3 分钟并重启仍为 3；开始取暖后到该时长自动停止（即使未达目标温度）。
4. 关于区版本号显示为真实 bundle 版本；点 `赞助我们` 在默认浏览器打开 sponsor 站点。
5. `xcodebuild` Release 构建通过，装到 /Applications 运行无回归（主取暖流程不受影响）。

## 影响的文件

- `Resources/web/index.html`（i18n 字符串表 + `useLang` + 设置页视图 + 齿轮入口 + bridge 调用）。
- `Sources/Bridge.swift`（`setMaxMinutes`、`openURL`、`onVersion`）。
- `Sources/SessionController.swift`（`maxDuration` 改可配置 + `setMaxMinutes`）。
- `Sources/WarmKittyApp.swift`（DragStrip 改居中拖拽条）。
- `Resources/web/images/app-icon.png`（新增图标资源）。
