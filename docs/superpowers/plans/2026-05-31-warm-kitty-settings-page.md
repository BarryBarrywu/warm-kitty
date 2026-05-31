# Warm Kitty Settings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a user-facing, persistent settings page (Language / Heating-protection / About) to Warm Kitty, with full zh-Hans / zh-Hant / English localization, reached via a gear in the title bar.

**Architecture:** Everything user-facing lives in the single bundled `Resources/web/index.html` React app. A `view` state switches the window between the main heater UI and a settings page. An i18n string table + `useLang` hook drives all visible text. Three native bridge additions wire the heating-protection cap, external-link opening, and the real bundle version. Settings persist in `localStorage`.

**Tech Stack:** AppKit + WKWebView (Swift), React 18 + Babel (in-page, via `<script type="text/babel">`), `xcodebuild`. No unit-test framework exists; verification is a successful Release build plus manual run checks.

**Build/verify command used throughout:**
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected on success: a line containing `** BUILD SUCCEEDED **`.

---

## File Structure

- `Resources/web/index.html` — the whole web UI. Add: i18n `STRINGS` + `useLang`, `view`/`maxMinutes`/`version` state, gear entry, `SettingsView` component, bridge calls. (Single monolithic file — follow the existing inline style; do not restructure it.)
- `Resources/web/images/app-icon.png` — new icon asset for the About section.
- `Sources/SessionController.swift` — make `maxDuration` configurable; add `setMaxMinutes`.
- `Sources/Bridge.swift` — add `setMaxMinutes` + `openURL` message cases; push real version on `ready`.
- `Sources/WarmKittyApp.swift` — shrink the native `DragStrip` so the right-side gear / `完成` button is clickable.

URL constants (placeholders, per spec — user supplies real Website/GitHub later):
- `SPONSOR_URL = 'https://sponsor.barrybarrywu.com'` (live)
- `WEBSITE_URL = 'https://barrybarrywu.com'` (placeholder)
- `GITHUB_URL = 'https://github.com/BarryBarrywu'` (placeholder)

---

### Task 1: Add the About-section app icon asset

**Files:**
- Create: `Resources/web/images/app-icon.png`

- [ ] **Step 1: Copy the 512px app icon into the web images folder**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && cp Assets.xcassets/AppIcon.appiconset/icon_512.png Resources/web/images/app-icon.png && ls -l Resources/web/images/app-icon.png
```
Expected: lists `Resources/web/images/app-icon.png` with non-zero size.

- [ ] **Step 2: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Resources/web/images/app-icon.png && git commit -m "add app icon asset for settings about section"
```

---

### Task 2: Add the i18n string table and `useLang` hook

**Files:**
- Modify: `Resources/web/index.html` — replace the `STATE_LABEL` / `NARRATION` / `IDLE_HINT` block (currently lines ~947–959) with the localized `STRINGS` table; add `useLang` right after.

- [ ] **Step 1: Replace the hardcoded label/narration constants with the `STRINGS` table**

Find this block (just below `tempToState`):

```javascript
const STATE_LABEL = {
  freezing: '瑟瑟发抖', waking: '慢慢苏醒', stretching: '舒展身体',
  cozy: '满足惬意', toasty: '热乎乎', overheat: '太烫啦',
};
const NARRATION = {
  freezing: '呜…好冷，再暖一点点嘛…',
  waking: '唔…有点暖了，慢慢睁开眼睛…',
  stretching: '嗯～伸个懒腰，舒服多了～',
  cozy: '呼噜呼噜…现在像捧着一杯刚泡好的热可可。',
  toasty: '好暖和！热乎乎的，像晒着大太阳～',
  overheat: '啊——太烫啦！让我扇扇风！',
};
const IDLE_HINT = '（点下面的按钮，帮我暖起来好不好～）';
```

Replace it entirely with:

```javascript
// ── i18n: every visible string keyed by language ─────────
const STRINGS = {
  'zh-Hans': {
    label: '简体中文',
    state: { freezing: '瑟瑟发抖', waking: '慢慢苏醒', stretching: '舒展身体', cozy: '满足惬意', toasty: '热乎乎', overheat: '太烫啦' },
    narr: {
      freezing: '呜…好冷，再暖一点点嘛…',
      waking: '唔…有点暖了，慢慢睁开眼睛…',
      stretching: '嗯～伸个懒腰，舒服多了～',
      cozy: '呼噜呼噜…现在像捧着一杯刚泡好的热可可。',
      toasty: '好暖和！热乎乎的，像晒着大太阳～',
      overheat: '啊——太烫啦！让我扇扇风！',
    },
    idleHint: '（点下面的按钮，帮我暖起来好不好～）',
    targetTemp: '目标温度', targetHint: '默认 38° · 暖手又安全',
    start: '开始取暖', stop: '停止取暖',
    footerHint: '取暖时会耗电、风扇会响 · 到温度自动停 🐾',
    settings: '设置', done: '完成', language: '语言',
    heatProtection: '取暖保护', protectTime: '保护时间', minutesUnit: '分钟',
    protectDesc: '开始取暖后，最多运行此时长即自动停止。即使未达到目标温度，也不会持续发热，保护电脑。',
    about: '关于', version: '版本', website: '网站', github: 'GitHub', sponsor: '赞助我们',
  },
  'zh-Hant': {
    label: '繁體中文',
    state: { freezing: '瑟瑟發抖', waking: '慢慢甦醒', stretching: '舒展身體', cozy: '滿足愜意', toasty: '暖呼呼', overheat: '太燙啦' },
    narr: {
      freezing: '嗚…好冷，再暖一點點嘛…',
      waking: '唔…有點暖了，慢慢睜開眼睛…',
      stretching: '嗯～伸個懶腰，舒服多了～',
      cozy: '呼嚕呼嚕…現在像捧著一杯剛泡好的熱可可。',
      toasty: '好暖和！暖呼呼的，像曬著大太陽～',
      overheat: '啊——太燙啦！讓我搧搧風！',
    },
    idleHint: '（點下面的按鈕，幫我暖起來好不好～）',
    targetTemp: '目標溫度', targetHint: '預設 38° · 暖手又安全',
    start: '開始取暖', stop: '停止取暖',
    footerHint: '取暖時會耗電、風扇會響 · 到溫度自動停 🐾',
    settings: '設定', done: '完成', language: '語言',
    heatProtection: '取暖保護', protectTime: '保護時間', minutesUnit: '分鐘',
    protectDesc: '開始取暖後，最多運行此時長即自動停止。即使未達到目標溫度，也不會持續發熱，保護電腦。',
    about: '關於', version: '版本', website: '網站', github: 'GitHub', sponsor: '贊助我們',
  },
  'en': {
    label: 'English',
    state: { freezing: 'Shivering', waking: 'Waking up', stretching: 'Stretching', cozy: 'Cozy', toasty: 'Toasty', overheat: 'Too hot!' },
    narr: {
      freezing: 'Brrr… so cold, warm me up just a little more…',
      waking: 'Mmm… getting warmer, slowly opening my eyes…',
      stretching: 'Ahh~ a good stretch, that feels much better~',
      cozy: 'Purr purr… cozy as a fresh-poured mug of hot cocoa.',
      toasty: 'So warm! Toasty all over, like basking in the sun~',
      overheat: 'Ahh—too hot! Let me fan myself!',
    },
    idleHint: '(Tap the button below and help me warm up, please~)',
    targetTemp: 'Target temp', targetHint: 'Default 38° · warm yet safe',
    start: 'Start warming', stop: 'Stop warming',
    footerHint: 'Warming uses power, the fan spins · auto-stops at target 🐾',
    settings: 'Settings', done: 'Done', language: 'Language',
    heatProtection: 'Heat protection', protectTime: 'Max runtime', minutesUnit: 'min',
    protectDesc: 'After you start warming, it auto-stops once this runtime is reached. Even below the target temperature it won’t keep heating, to protect your Mac.',
    about: 'About', version: 'Version', website: 'Website', github: 'GitHub', sponsor: 'Sponsor us',
  },
};
const LANGS = ['zh-Hans', 'zh-Hant', 'en'];

// ── language persistence ─────────────────────────────────
function useLang() {
  const [lang, setLangState] = React.useState(() => {
    const v = localStorage.getItem('wk_lang');
    return STRINGS[v] ? v : 'zh-Hans';
  });
  const setLang = (v) => { localStorage.setItem('wk_lang', v); setLangState(v); };
  return [lang, setLang];
}

// ── external-link + version constants ────────────────────
const SPONSOR_URL = 'https://sponsor.barrybarrywu.com';
const WEBSITE_URL = 'https://barrybarrywu.com';
const GITHUB_URL = 'https://github.com/BarryBarrywu';
```

- [ ] **Step 2: Verify the build still succeeds**

Run:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`. (At this point `STATE_LABEL`/`NARRATION`/`IDLE_HINT` are gone but not yet referenced — Task 3 swaps the references. The build bundles the web folder regardless of JS runtime errors, so also confirm via grep that the old names are absent.)

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && grep -n "STATE_LABEL\|NARRATION\|IDLE_HINT" Resources/web/index.html
```
Expected: no matches (old constants fully removed; references are replaced in Task 3).

- [ ] **Step 3: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Resources/web/index.html && git commit -m "add i18n string table and useLang hook"
```

---

### Task 3: Wire the main UI to the language strings

**Files:**
- Modify: `Resources/web/index.html` — in `App`, add `useLang`, derive `L`, and replace the five inline-string / `STATE_LABEL` / `NARRATION` / `IDLE_HINT` references.

- [ ] **Step 1: Add the language hook inside `App`**

Find, near the top of `function App() {`:

```javascript
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
```

Replace with:

```javascript
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useLang();
  const L = STRINGS[lang];
  const [view, setView] = React.useState('main');
```

(`view` is added here too; it is consumed in Task 6.)

- [ ] **Step 2: Replace the narration source line**

Find:
```javascript
  const narr = !heating && state === 'freezing' ? IDLE_HINT : NARRATION[state];
```
Replace with:
```javascript
  const narr = !heating && state === 'freezing' ? L.idleHint : L.narr[state];
```

- [ ] **Step 3: Replace the state label**

Find:
```javascript
              }}>{STATE_LABEL[state]}</div>
```
Replace with:
```javascript
              }}>{L.state[state]}</div>
```

- [ ] **Step 4: Replace the target-slider label and hint**

Find:
```javascript
              <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 13, fontWeight: 600, color: '#8A6446' }}>目标温度</span>
```
Replace `目标温度` with `{L.targetTemp}`:
```javascript
              <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 13, fontWeight: 600, color: '#8A6446' }}>{L.targetTemp}</span>
```

Find:
```javascript
              <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: '#A98763' }}>默认 38° · 暖手又安全</span>
```
Replace with:
```javascript
              <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: '#A98763' }}>{L.targetHint}</span>
```

- [ ] **Step 5: Replace the start/stop button text**

Find:
```javascript
            {heating ? (
              <><span className="wk-pulse" style={{ background: '#E8824B' }} />停止取暖</>
            ) : (
              <><FlameIcon />开始取暖</>
            )}
```
Replace with:
```javascript
            {heating ? (
              <><span className="wk-pulse" style={{ background: '#E8824B' }} />{L.stop}</>
            ) : (
              <><FlameIcon />{L.start}</>
            )}
```

- [ ] **Step 6: Replace the footer hint**

Find:
```javascript
          <div style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: '#A98763', marginTop: 11, textAlign: 'center' }}>
            取暖时会耗电、风扇会响 · 到温度自动停 🐾
          </div>
```
Replace the inner text with `{L.footerHint}`:
```javascript
          <div style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: '#A98763', marginTop: 11, textAlign: 'center' }}>
            {L.footerHint}
          </div>
```

- [ ] **Step 7: Build, then run and verify language switching is wired**

Run the build:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`.

Temporary manual check (no settings UI yet): run the app, open the Web Inspector console (or temporarily set `localStorage.setItem('wk_lang','en')` then reload) and confirm the main UI text (button, state label, narration, footer) renders from `L`. This is a smoke check; full verification happens in Task 9.

- [ ] **Step 8: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Resources/web/index.html && git commit -m "localize main interface strings"
```

---

### Task 4: Make the native heating cap configurable

**Files:**
- Modify: `Sources/SessionController.swift`

- [ ] **Step 1: Change `maxDuration` from a constant to a configurable var with a 5-minute default**

Find:
```swift
    private let maxDuration: TimeInterval = 30 * 60
```
Replace with:
```swift
    private var maxDuration: TimeInterval = 5 * 60
```

- [ ] **Step 2: Add a setter clamped to the UI range (1–15 minutes)**

Find:
```swift
    func setTarget(_ value: Double) {
        target = value
    }
```
Insert immediately after it:
```swift
    func setMaxMinutes(_ minutes: Double) {
        maxDuration = max(1, min(15, minutes)) * 60
    }
```

- [ ] **Step 3: Verify the build succeeds**

Run:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`.

- [ ] **Step 4: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Sources/SessionController.swift && git commit -m "make heating max duration configurable"
```

---

### Task 5: Add native bridge cases (`setMaxMinutes`, `openURL`) and version push

**Files:**
- Modify: `Sources/Bridge.swift`

- [ ] **Step 1: Push the real bundle version to the page when it signals `ready`**

Find:
```swift
        switch type {
        case "ready":
            session.begin()
```
Replace with:
```swift
        switch type {
        case "ready":
            let v = (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String) ?? ""
            eval("window.warmkitty && warmkitty.onVersion('\(v)')")
            session.begin()
```

- [ ] **Step 2: Add the `setMaxMinutes` and `openURL` cases**

Find:
```swift
        case "setTarget":
            if let v = (body["value"] as? NSNumber)?.doubleValue { session.setTarget(v) }
        case "window":
            handleWindow(body["action"] as? String)
```
Replace with:
```swift
        case "setTarget":
            if let v = (body["value"] as? NSNumber)?.doubleValue { session.setTarget(v) }
        case "setMaxMinutes":
            if let v = (body["value"] as? NSNumber)?.doubleValue { session.setMaxMinutes(v) }
        case "openURL":
            if let s = body["url"] as? String, let url = URL(string: s) { NSWorkspace.shared.open(url) }
        case "window":
            handleWindow(body["action"] as? String)
```

- [ ] **Step 3: Verify the build succeeds**

Run:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`. (`NSWorkspace` is already available via the existing `import AppKit` in this file.)

- [ ] **Step 4: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Sources/Bridge.swift && git commit -m "add setMaxMinutes and openURL bridge cases and version push"
```

---

### Task 6: Add settings state, gear entry, and the `SettingsView` component (page side)

**Files:**
- Modify: `Resources/web/index.html` — add `maxMinutes`/`version` state + bridge sync in `App`; add the gear button to the title bar; wrap the main window body and mount `SettingsView`; define `SettingsView` + `GearIcon`.

- [ ] **Step 1: Add `maxMinutes` and `version` state plus their bridge sync**

Find (the bridge effect in `App`):
```javascript
  const [ding, setDing] = React.useState(0);
  const [known, setKnown] = React.useState(true);
  const post = (msg) => { try { window.webkit.messageHandlers.bridge.postMessage(msg); } catch (e) {} };
  React.useEffect(() => {
    window.warmkitty = {
      onTemp(c) {
        if (c === null || c === undefined) { setKnown(false); return; }
        setKnown(true); tempRef.current = c; setTemp(c);
      },
      onRunning(b) { setHeating(b); },
      onDing() { setDing((d) => d + 1); },
    };
    post({ type: 'ready' });
    return () => { window.warmkitty = null; };
  }, []);
```
Replace with:
```javascript
  const [ding, setDing] = React.useState(0);
  const [known, setKnown] = React.useState(true);
  const [version, setVersion] = React.useState('');
  const [maxMinutes, setMaxMinutesState] = React.useState(() => {
    const v = parseInt(localStorage.getItem('wk_maxMinutes') || '5', 10);
    return isNaN(v) ? 5 : Math.max(1, Math.min(15, v));
  });
  const post = (msg) => { try { window.webkit.messageHandlers.bridge.postMessage(msg); } catch (e) {} };
  const setMaxMinutes = (v) => {
    const n = Math.max(1, Math.min(15, v));
    localStorage.setItem('wk_maxMinutes', String(n));
    setMaxMinutesState(n);
    post({ type: 'setMaxMinutes', value: n });
  };
  React.useEffect(() => {
    window.warmkitty = {
      onTemp(c) {
        if (c === null || c === undefined) { setKnown(false); return; }
        setKnown(true); tempRef.current = c; setTemp(c);
      },
      onRunning(b) { setHeating(b); },
      onDing() { setDing((d) => d + 1); },
      onVersion(v) { setVersion(v); },
    };
    post({ type: 'ready' });
    post({ type: 'setMaxMinutes', value: maxMinutes });
    return () => { window.warmkitty = null; };
  }, []);
```

- [ ] **Step 2: Add the gear button to the title bar (main view only)**

Find the title-bar block's centered-title div and the closing of the title bar:
```javascript
          <div style={{
            position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
            fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 16, color: '#6E4A33', letterSpacing: '0.02em',
          }}>
            <span style={{ marginRight: 6 }}>🐾</span>Warm Kitty
          </div>
        </div>
```
Replace with (adds a right-aligned gear button after the title):
```javascript
          <div style={{
            position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
            fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 16, color: '#6E4A33', letterSpacing: '0.02em',
          }}>
            <span style={{ marginRight: 6 }}>🐾</span>Warm Kitty
          </div>
          <button onClick={() => setView('settings')} aria-label={L.settings} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            width: 26, height: 26, padding: 0, border: 0, background: 'transparent',
            cursor: 'pointer', color: '#8A6446', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GearIcon />
          </button>
        </div>
```

- [ ] **Step 3: Mount `SettingsView` as an overlay over the window when `view === 'settings'`**

Find the end of the main content block followed by the hidden-tweaks comment and the window's closing tags:
```javascript
        {/* tweaks panel hidden in the shipped app */}
    </div>
  );
}
```
Replace with:
```javascript
        {view === 'settings' && (
          <SettingsView L={L} lang={lang} setLang={setLang}
            maxMinutes={maxMinutes} setMaxMinutes={setMaxMinutes}
            version={version} accent={t.accent} post={post}
            onDone={() => setView('main')} />
        )}
    </div>
  );
}
```

(The settings page is absolutely positioned to fill the window, so it visually replaces the main content while it is open.)

- [ ] **Step 4: Define `GearIcon` and `SettingsView` before the final `ReactDOM.createRoot` call**

Find:
```javascript
function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 2 }}>
      <path d="M12 3c1 3-1.5 4-1.5 6.5C10.5 11 11 12 12 12s2-1 1.8-3C16 11 17 13 17 15.5 17 19 14.5 21 12 21s-5-2-5-5.5c0-3 2-4.5 2-7C9 6 11 5 12 3z" fill="#fff" />
    </svg>
  );
}
```
Insert immediately after it:
```javascript
function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="#B59A7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsView({ L, lang, setLang, maxMinutes, setMaxMinutes, version, accent, post, onDone }) {
  const sectionLabel = { fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 600, color: '#A98763', margin: '0 0 8px 4px' };
  const card = { background: 'rgba(255,255,255,0.66)', borderRadius: 14, border: '0.5px solid rgba(255,255,255,0.7)', boxShadow: '0 1px 3px rgba(110,74,51,0.08)' };
  const links = [
    { key: 'website', label: L.website, url: WEBSITE_URL, icon: '🌐' },
    { key: 'github', label: L.github, url: GITHUB_URL, icon: '🐙' },
    { key: 'sponsor', label: L.sponsor, url: SPONSOR_URL, icon: '❤️' },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #FBF1E2 0%, #F6E7D2 100%)',
    }}>
      {/* header */}
      <div style={{
        position: 'relative', height: 46, flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 18px',
        borderBottom: '0.5px solid rgba(110,74,51,0.12)',
        background: 'rgba(255,255,255,0.42)',
        backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px) saturate(150%)',
      }}>
        <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 18, fontWeight: 700, color: '#5A3D29' }}>{L.settings}</span>
        <button onClick={onDone} style={{
          border: 0, background: 'transparent', cursor: 'pointer', padding: 0,
          fontFamily: "'PingFang SC', system-ui", fontSize: 16, fontWeight: 600, color: accent,
        }}>{L.done}</button>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 28px' }}>
        {/* language */}
        <div style={sectionLabel}>{L.language}</div>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
          appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 52, padding: '0 16px',
          ...card, fontFamily: "'PingFang SC', system-ui", fontSize: 16, color: '#5A3D29', cursor: 'pointer',
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%23A98763' d='M0 0h12L6 8z'/></svg>\")",
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center',
        }}>
          {LANGS.map((code) => <option key={code} value={code}>{STRINGS[code].label}</option>)}
        </select>

        {/* heat protection */}
        <div style={{ ...sectionLabel, marginTop: 22 }}>{L.heatProtection}</div>
        <div style={{ ...card, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 16, color: '#5A3D29' }}>{L.protectTime}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(110,74,51,0.06)', borderRadius: 12, padding: 4 }}>
              <button onClick={() => setMaxMinutes(maxMinutes - 1)} disabled={maxMinutes <= 1} aria-label="−" style={{
                width: 40, height: 36, border: 0, borderRadius: 9, cursor: maxMinutes <= 1 ? 'default' : 'pointer',
                background: maxMinutes <= 1 ? 'transparent' : 'rgba(232,130,75,0.16)', color: '#C56A3A',
                fontSize: 22, lineHeight: 1, opacity: maxMinutes <= 1 ? 0.4 : 1,
              }}>−</button>
              <span style={{ minWidth: 64, textAlign: 'center', fontFamily: "'Baloo 2', system-ui", fontSize: 15, fontWeight: 700, color: '#5A3D29' }}>
                {maxMinutes} <span style={{ fontSize: 12, fontWeight: 600, color: '#A98763' }}>{L.minutesUnit}</span>
              </span>
              <button onClick={() => setMaxMinutes(maxMinutes + 1)} disabled={maxMinutes >= 15} aria-label="+" style={{
                width: 40, height: 36, border: 0, borderRadius: 9, cursor: maxMinutes >= 15 ? 'default' : 'pointer',
                background: maxMinutes >= 15 ? 'transparent' : 'rgba(110,74,51,0.08)', color: '#8A6446',
                fontSize: 20, lineHeight: 1, opacity: maxMinutes >= 15 ? 0.4 : 1,
              }}>+</button>
            </div>
          </div>
          <p style={{ margin: '12px 0 0', fontFamily: "'PingFang SC', system-ui", fontSize: 13, lineHeight: 1.55, color: '#9A7A5C' }}>
            {L.protectDesc}
          </p>
        </div>

        {/* about */}
        <div style={{ ...sectionLabel, marginTop: 22 }}>{L.about}</div>
        <div style={{ textAlign: 'center', padding: '4px 0 14px' }}>
          <img src="images/app-icon.png" alt="" style={{ width: 88, height: 88, borderRadius: 20, boxShadow: '0 6px 16px rgba(110,74,51,0.22)' }} />
          <div style={{ fontFamily: "'Baloo 2', system-ui", fontSize: 26, fontWeight: 700, color: '#5A3D29', marginTop: 10 }}>Warm Kitty</div>
          <div style={{ fontFamily: "'Baloo 2', system-ui", fontStyle: 'italic', fontSize: 14, color: '#C07A52', marginTop: 2 }}>
            "Warm Kitty, warm laptop, warm you."
          </div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 50, padding: '0 16px', borderBottom: '0.5px solid rgba(110,74,51,0.1)' }}>
            <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 16, color: '#5A3D29' }}>{L.version}</span>
            <span style={{ fontFamily: "'Baloo 2', system-ui", fontSize: 15, fontWeight: 700, color: '#8A6446' }}>{version || '—'}</span>
          </div>
          {links.map((row, i) => (
            <button key={row.key} onClick={() => post({ type: 'openURL', url: row.url })} style={{
              display: 'flex', alignItems: 'center', width: '100%', height: 50, padding: '0 16px',
              border: 0, background: 'transparent', cursor: 'pointer',
              borderBottom: i < links.length - 1 ? '0.5px solid rgba(110,74,51,0.1)' : '0',
            }}>
              <span style={{ fontSize: 18, marginRight: 12 }}>{row.icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontFamily: "'PingFang SC', system-ui", fontSize: 16, color: '#5A3D29' }}>{row.label}</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify the build succeeds**

Run:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`.

- [ ] **Step 6: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Resources/web/index.html && git commit -m "add settings page with language, heat protection, and about"
```

---

### Task 7: Make the title-bar gear / Done button clickable (native drag strip)

**Files:**
- Modify: `Sources/WarmKittyApp.swift`

The native `DragStrip` currently spans from `trafficLightWidth` (72px) to the right edge, swallowing clicks over the entire right side of the title bar. The gear (main view) and `完成` (settings view) sit top-right and would be unclickable. Leave a right-side gap, mirroring the left traffic-light gap; the window stays draggable by the center of the title bar.

- [ ] **Step 1: Add a right-inset constant**

Find:
```swift
    private let trafficLightWidth: CGFloat = 72  // leave the HTML traffic lights clickable
```
Replace with:
```swift
    private let trafficLightWidth: CGFloat = 72  // leave the HTML traffic lights clickable
    private let rightControlWidth: CGFloat = 64  // leave the HTML gear / Done button clickable
```

- [ ] **Step 2: Shrink the drag strip to exclude the right control zone**

Find:
```swift
        let drag = DragStrip(frame: NSRect(
            x: trafficLightWidth,
            y: winSize.height - titleBarHeight,
            width: winSize.width - trafficLightWidth,
            height: titleBarHeight))
        drag.autoresizingMask = [.width, .minYMargin]
```
Replace with:
```swift
        let drag = DragStrip(frame: NSRect(
            x: trafficLightWidth,
            y: winSize.height - titleBarHeight,
            width: winSize.width - trafficLightWidth - rightControlWidth,
            height: titleBarHeight))
        drag.autoresizingMask = [.width, .minYMargin]
```

- [ ] **Step 3: Verify the build succeeds**

Run:
```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release build 2>&1 | tail -3
```
Expected: `** BUILD SUCCEEDED **`.

- [ ] **Step 4: Commit**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && git add Sources/WarmKittyApp.swift && git commit -m "shrink drag strip so title-bar controls stay clickable"
```

---

### Task 8: Install the built app and run end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Locate and install the freshly built app**

```bash
cd "/Volumes/990 EP/Dev/warm-kitty" && APP=$(xcodebuild -project WarmKitty.xcodeproj -scheme WarmKitty -configuration Release -showBuildSettings 2>/dev/null | awk '/ BUILT_PRODUCTS_DIR =/{d=$3} / FULL_PRODUCT_NAME =/{n=substr($0,index($0,"= ")+2)} END{print d"/"n}') && echo "$APP" && rm -rf "/Applications/Warm Kitty.app" && cp -R "$APP" "/Applications/" && open "/Applications/Warm Kitty.app"
```
Expected: prints the built `.app` path, then the app launches.

- [ ] **Step 2: Manually verify each acceptance criterion**

Confirm, in the running app:
1. Title-bar gear is clickable → settings page opens; `完成` returns to main; the middle of the title bar still drags the window.
2. Language → switch to `繁體中文` then `English`: main-screen narration, state label, button, slider label/hint, footer, and the whole settings page all switch. Quit and relaunch → the chosen language persists.
3. Heat protection → tap `−`/`+` to set e.g. 3 分钟; relaunch → still 3. Start warming and confirm it auto-stops once the runtime is reached even before the target temperature.
4. About → version shows the real bundle version (currently `0.1.0`); tapping `赞助我们` opens `https://sponsor.barrybarrywu.com` in the default browser; `网站`/`GitHub` open the placeholder URLs.
5. Main warming flow (start/stop, gauge, temperature read-out) is unchanged.

- [ ] **Step 3: Note the version-display caveat**

The About version reflects `MARKETING_VERSION` in `project.yml` (currently `0.1.0`). The design mockup shows `1.0.0`; if a `1.0.0` display is desired, bump `MARKETING_VERSION` (and `CURRENT_PROJECT_VERSION`) in `project.yml`, regenerate the project (`xcodegen`), and rebuild. This is intentionally left to a release decision and is out of scope for this plan.

---

## Self-Review

**Spec coverage:**
- Navigation (gear → in-window settings, Done back): Task 6 (gear + view switch) + Task 7 (native drag strip). ✅
- Internal scroll on settings page: Task 6 `SettingsView` body `overflowY:auto`. ✅
- i18n table + `useLang` + all visible strings: Task 2 (table/hook) + Task 3 (main UI) + Task 6 (settings UI). ✅
- Default language zh-Hans, no system auto-detect: Task 2 `useLang`. ✅
- Settings layout — language select / protection stepper (1–15, default 5) / about (version + 3 links): Task 6. ✅
- Native `setMaxMinutes` (replaces hardcoded 30 min, default 5): Task 4 + Task 5. ✅
- Native `openURL` via NSWorkspace: Task 5. ✅
- Version pushed from native bundle: Task 5 + Task 6 (`onVersion`). ✅
- Persistence keys `wk_lang` / `wk_maxMinutes` in localStorage: Tasks 2 and 6. ✅
- App icon asset: Task 1. ✅
- Display tweaks NOT exposed: untouched (no task adds them). ✅
- Acceptance/verification: Task 8. ✅

**Placeholder scan:** Website/GitHub URLs are concrete placeholder constants per the spec's documented decision (not unresolved TBDs); all code steps show full code. No "TODO/implement later" left.

**Type consistency:** `setMaxMinutes(v)` (page) and `session.setMaxMinutes(_)` (native) consistent; `warmkitty.onVersion(v)` defined in Task 6 matches `eval` call in Task 5; `view`/`setView` introduced in Task 3 and consumed in Task 6; `STRINGS`/`LANGS`/`L`/`useLang` names consistent across Tasks 2/3/6; URL constants `SPONSOR_URL`/`WEBSITE_URL`/`GITHUB_URL` defined in Task 2, used in Task 6.
