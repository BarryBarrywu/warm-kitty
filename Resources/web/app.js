const post = (msg) => {
  try {
    window.webkit.messageHandlers.bridge.postMessage(msg);
  } catch (e) {
  }
};
const WK_LANGS = [
  ["auto", "\u81EA\u52A8"],
  ["zh", "\u4E2D"],
  ["en", "EN"],
  ["ja", "\u65E5"],
  ["zh-Hant", "\u7E41"]
];
function resolveLang() {
  const l = (navigator.language || "en").toLowerCase();
  if (l.startsWith("zh")) return /hant|tw|hk|mo/.test(l) ? "zh-Hant" : "zh";
  if (l.startsWith("ja")) return "ja";
  return "en";
}
const WK_I18N = {
  zh: {
    title: "Warm Kitty",
    slogan: "\u4F60\u7684 MacBook\uFF0C\u6BD4\u4F60\u7537\u670B\u53CB\u7684\u624B\u8FD8\u6696\u3002",
    duration: "\u6696\u624B\u65F6\u957F",
    minuteUnit: "\u5206\u949F",
    standbyPrompt: "\u60F3\u6696\u591A\u4E45\uFF1F",
    start: "\u5F00\u59CB\u6696\u624B",
    stop: "\u505C\u6B62",
    remaining: "\u5269\u4F59\u65F6\u95F4",
    endingTitle: "\u6696\u597D\u5566",
    endingSub: "\u624B\u662F\u4E0D\u662F\u70ED\u4E4E\u4E4E\u7684\u5566\uFF5E",
    restart: "\u518D\u6696\u4E00\u6B21",
    footnote: "\u6696\u624B\u65F6\u7535\u8111\u4F1A\u53D1\u70ED\u3001\u98CE\u6247\u4F1A\u8F6C \xB7 \u5230\u70B9\u81EA\u52A8\u505C \u{1F43E}",
    settings: "\u8BBE\u7F6E",
    language: "\u8BED\u8A00",
    autoLang: "\u81EA\u52A8",
    about: "\u5173\u4E8E",
    version: "\u7248\u672C",
    website: "\u7F51\u7AD9",
    github: "GitHub",
    donate: "\u8D5E\u52A9\u6211\u4EEC",
    done: "\u5B8C\u6210",
    sound: "\u58F0\u97F3",
    chimeOption: "\u5B8C\u6210\u63D0\u793A\u97F3",
    ambientOption: "\u6696\u624B\u73AF\u5883\u97F3",
    general: "\u901A\u7528",
    launchAtLogin: "\u5F00\u673A\u81EA\u52A8\u542F\u52A8",
    autoUpdate: "\u81EA\u52A8\u68C0\u67E5\u66F4\u65B0",
    checkNow: "\u68C0\u67E5\u66F4\u65B0",
    firstTitle: "\u6B22\u8FCE\u6765\u5230 Warm Kitty",
    firstBody: "\u6211\u4F1A\u8BA9\u7535\u8111\u8F7B\u8F7B\u53D1\u70B9\u70ED\uFF0C\u5E2E\u4F60\u7110\u6696\u4E00\u53CC\u5C0F\u624B\u3002\u9009\u4E2A\u65F6\u957F\u5C31\u5F00\u59CB\uFF0C\u65F6\u95F4\u4E00\u5230\u81EA\u52A8\u505C\u4E0B\u3002",
    firstBtn: "\u597D\u7684\uFF0C\u5F00\u59CB\u5427",
    narration: {
      standby: "\u9009\u4E2A\u65F6\u957F\uFF0C\u6211\u6765\u5E2E\u4F60\u7110\u6696\u5C0F\u624B\uFF5E",
      ending: "\u547C\uFF5E\u6696\u597D\u5566\uFF0C\u624B\u662F\u4E0D\u662F\u70ED\u4E4E\u4E4E\u7684\uFF1F",
      warming: [
        "\u547C\u565C\u547C\u565C\u2026\u6B63\u5728\u5E2E\u4F60\u628A\u624B\u7110\u70ED\uFF5E",
        "\u6696\u6696\u7684\uFF0C\u518D\u575A\u6301\u4E00\u4E0B\u4E0B\u5C31\u597D\u5566\u3002",
        "\u50CF\u6367\u7740\u4E00\u676F\u521A\u6CE1\u597D\u7684\u70ED\u53EF\u53EF\u4E00\u6837\uFF5E",
        "\u70ED\u4E4E\u4E4E\u7684\uFF0C\u662F\u4E0D\u662F\u8212\u670D\u591A\u4E86\uFF1F"
      ]
    }
  },
  en: {
    title: "Warm Kitty",
    slogan: "Your MacBook, warmer than your boyfriend's hands.",
    duration: "Warming time",
    minuteUnit: "min",
    standbyPrompt: "How long?",
    start: "Start warming",
    stop: "Stop",
    remaining: "Time left",
    endingTitle: "All warm!",
    endingSub: "Toasty little hands now~",
    restart: "Warm again",
    footnote: "Warms the laptop & spins the fan \xB7 auto-stops at zero \u{1F43E}",
    settings: "Settings",
    language: "Language",
    autoLang: "Auto",
    about: "About",
    version: "Version",
    website: "Website",
    github: "GitHub",
    donate: "Donate",
    done: "Done",
    sound: "Sound",
    chimeOption: "Completion chime",
    ambientOption: "Warming ambience",
    general: "General",
    launchAtLogin: "Launch at login",
    autoUpdate: "Check for updates automatically",
    checkNow: "Check now",
    firstTitle: "Welcome to Warm Kitty",
    firstBody: "I gently warm your laptop to toast your hands. Pick a time, tap start, and I stop on my own when it runs out.",
    firstBtn: "Got it, let\u2019s go",
    narration: {
      standby: "Pick a time and I\u2019ll warm your hands~",
      ending: "Phew~ all warm. Toasty hands?",
      warming: [
        "Purr purr\u2026 warming your hands up~",
        "Nice and cozy, just a little longer.",
        "Like cupping a fresh mug of hot cocoa~",
        "Toasty all over. Feeling better?"
      ]
    }
  },
  ja: {
    title: "Warm Kitty",
    slogan: "\u3042\u306A\u305F\u306EMacBook\u3001\u5F7C\u6C0F\u306E\u624B\u3088\u308A\u3042\u3063\u305F\u304B\u3044\u3002",
    duration: "\u6696\u3081\u6642\u9593",
    minuteUnit: "\u5206",
    standbyPrompt: "\u3069\u306E\u304F\u3089\u3044\u6696\u3081\u308B\uFF1F",
    start: "\u6696\u3081\u958B\u59CB",
    stop: "\u505C\u6B62",
    remaining: "\u6B8B\u308A\u6642\u9593",
    endingTitle: "\u6696\u307E\u3063\u305F\u3088",
    endingSub: "\u624B\u304C\u307D\u304B\u307D\u304B\u3067\u3057\u3087\uFF5E",
    restart: "\u3082\u3046\u4E00\u5EA6",
    footnote: "PC\u304C\u767A\u71B1\u3057\u30D5\u30A1\u30F3\u304C\u56DE\u308A\u307E\u3059 \xB7 0\u306B\u306A\u308B\u3068\u81EA\u52D5\u505C\u6B62 \u{1F43E}",
    settings: "\u8A2D\u5B9A",
    language: "\u8A00\u8A9E",
    autoLang: "\u81EA\u52D5",
    about: "\u30A2\u30D7\u30EA\u306B\u3064\u3044\u3066",
    version: "\u30D0\u30FC\u30B8\u30E7\u30F3",
    website: "\u30A6\u30A7\u30D6\u30B5\u30A4\u30C8",
    github: "GitHub",
    donate: "\u5BC4\u4ED8",
    done: "\u5B8C\u4E86",
    sound: "\u30B5\u30A6\u30F3\u30C9",
    chimeOption: "\u5B8C\u4E86\u306E\u97F3",
    ambientOption: "\u6696\u3081\u306E\u74B0\u5883\u97F3",
    general: "\u4E00\u822C",
    launchAtLogin: "\u30ED\u30B0\u30A4\u30F3\u6642\u306B\u8D77\u52D5",
    autoUpdate: "\u81EA\u52D5\u7684\u306B\u66F4\u65B0\u3092\u78BA\u8A8D",
    checkNow: "\u4ECA\u3059\u3050\u78BA\u8A8D",
    firstTitle: "Warm Kitty \u3078\u3088\u3046\u3053\u305D",
    firstBody: "PC\u3092\u307B\u3093\u306E\u308A\u767A\u71B1\u3055\u305B\u3066\u3001\u624B\u3092\u306C\u304F\u306C\u304F\u306B\u3057\u307E\u3059\u3002\u6642\u9593\u3092\u9078\u3093\u3067\u958B\u59CB\u30010\u306B\u306A\u3063\u305F\u3089\u81EA\u52D5\u3067\u6B62\u307E\u308A\u307E\u3059\u3002",
    firstBtn: "\u306F\u3058\u3081\u308B",
    narration: {
      standby: "\u6642\u9593\u3092\u9078\u3093\u3067\u306D\u3001\u624B\u3092\u6696\u3081\u3066\u3042\u3052\u308B\uFF5E",
      ending: "\u3075\u3045\u301C\u6696\u307E\u3063\u305F\u3088\u3002\u307D\u304B\u307D\u304B\u3067\u3057\u3087\uFF1F",
      warming: [
        "\u30B4\u30ED\u30B4\u30ED\u2026\u624B\u3092\u6696\u3081\u3066\u308B\u3088\uFF5E",
        "\u306C\u304F\u306C\u304F\u3001\u3082\u3046\u5C11\u3057\u3060\u3051\u306D\u3002",
        "\u6DF9\u308C\u305F\u3066\u306E\u30DB\u30C3\u30C8\u30B3\u30B3\u30A2\u307F\u305F\u3044\u306B\uFF5E",
        "\u307D\u304B\u307D\u304B\u3002\u697D\u306B\u306A\u3063\u305F\u304B\u306A\uFF1F"
      ]
    }
  },
  "zh-Hant": {
    title: "Warm Kitty",
    slogan: "\u4F60\u7684 MacBook\uFF0C\u6BD4\u4F60\u7537\u670B\u53CB\u7684\u624B\u9084\u6696\u3002",
    duration: "\u6696\u624B\u6642\u9577",
    minuteUnit: "\u5206\u9418",
    standbyPrompt: "\u60F3\u6696\u591A\u4E45\uFF1F",
    start: "\u958B\u59CB\u53D6\u6696",
    stop: "\u505C\u6B62",
    remaining: "\u5269\u9918\u6642\u9593",
    endingTitle: "\u6696\u597D\u5566",
    endingSub: "\u624B\u662F\u4E0D\u662F\u71B1\u4E4E\u4E4E\u7684\u5566\uFF5E",
    restart: "\u518D\u6696\u4E00\u6B21",
    footnote: "\u53D6\u6696\u6642\u96FB\u8166\u6703\u767C\u71B1\u3001\u98A8\u6247\u6703\u8F49 \xB7 \u5230\u9EDE\u81EA\u52D5\u505C \u{1F43E}",
    settings: "\u8A2D\u5B9A",
    language: "\u8A9E\u8A00",
    autoLang: "\u81EA\u52D5",
    about: "\u95DC\u65BC",
    version: "\u7248\u672C",
    website: "\u7DB2\u7AD9",
    github: "GitHub",
    donate: "\u8D0A\u52A9\u6211\u5011",
    done: "\u5B8C\u6210",
    sound: "\u8072\u97F3",
    chimeOption: "\u5B8C\u6210\u63D0\u793A\u97F3",
    ambientOption: "\u6696\u624B\u74B0\u5883\u97F3",
    general: "\u4E00\u822C",
    launchAtLogin: "\u958B\u6A5F\u81EA\u52D5\u555F\u52D5",
    autoUpdate: "\u81EA\u52D5\u6AA2\u67E5\u66F4\u65B0",
    checkNow: "\u6AA2\u67E5\u66F4\u65B0",
    firstTitle: "\u6B61\u8FCE\u4F86\u5230 Warm Kitty",
    firstBody: "\u6211\u6703\u8B93\u96FB\u8166\u8F15\u8F15\u767C\u9EDE\u71B1\uFF0C\u5E6B\u4F60\u7110\u6696\u4E00\u96D9\u5C0F\u624B\u3002\u9078\u500B\u6642\u9577\u5C31\u958B\u59CB\uFF0C\u6642\u9593\u4E00\u5230\u81EA\u52D5\u505C\u4E0B\u3002",
    firstBtn: "\u597D\u7684\uFF0C\u958B\u59CB\u5427",
    narration: {
      standby: "\u9078\u500B\u6642\u9577\uFF0C\u6211\u4F86\u5E6B\u4F60\u7110\u6696\u5C0F\u624B\uFF5E",
      ending: "\u547C\uFF5E\u6696\u597D\u5566\uFF0C\u624B\u662F\u4E0D\u662F\u71B1\u4E4E\u4E4E\u7684\uFF1F",
      warming: [
        "\u547C\u5695\u547C\u5695\u2026\u6B63\u5728\u5E6B\u4F60\u628A\u624B\u7110\u71B1\uFF5E",
        "\u6696\u6696\u7684\uFF0C\u518D\u5805\u6301\u4E00\u4E0B\u4E0B\u5C31\u597D\u5566\u3002",
        "\u50CF\u6367\u8457\u4E00\u676F\u525B\u6CE1\u597D\u7684\u71B1\u53EF\u53EF\u4E00\u6A23\uFF5E",
        "\u71B1\u4E4E\u4E4E\u7684\uFF0C\u662F\u4E0D\u662F\u8212\u670D\u591A\u4E86\uFF1F"
      ]
    }
  }
};
const WK_WARM_POSES = [
  "warm-01",
  "warm-02",
  "warm-03",
  "warm-04",
  "warm-05",
  "warm-06",
  "warm-07",
  "warm-08",
  "warm-09",
  "warm-10",
  "warm-11",
  "warm-12",
  "warm-13",
  "warm-14"
];
const WK_ALL_POSES = ["idle", ...WK_WARM_POSES, "ending"];
function wkShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function CatStage({ phase, holdMs = 8e3, onPoseChange }) {
  const [active, setActive] = React.useState("idle");
  const playlist = React.useRef([]);
  const cursor = React.useRef(0);
  React.useEffect(() => {
    if (phase === "standby") {
      setActive("idle");
      return;
    }
    if (phase === "ending") {
      setActive("ending");
      return;
    }
    playlist.current = wkShuffle(WK_WARM_POSES);
    cursor.current = 0;
    const first = playlist.current[0];
    setActive(first);
    onPoseChange && onPoseChange(0);
    const advance = () => {
      cursor.current += 1;
      if (cursor.current >= playlist.current.length) {
        playlist.current = wkShuffle(WK_WARM_POSES);
        cursor.current = 0;
      }
      setActive(playlist.current[cursor.current]);
      onPoseChange && onPoseChange(cursor.current);
    };
    const id = setInterval(advance, holdMs);
    return () => clearInterval(id);
  }, [phase, holdMs]);
  return /* @__PURE__ */ React.createElement("div", { className: "cat-stage", style: { position: "relative", width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("div", { className: phase === "warming" ? "cat-sway" : "", style: { position: "absolute", inset: 0 } }, WK_ALL_POSES.map((p) => /* @__PURE__ */ React.createElement(
    "img",
    {
      key: p,
      src: `cat/${p}.png`,
      alt: "",
      draggable: "false",
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: p === active ? 1 : 0,
        transition: "opacity 1.1s ease",
        filter: "drop-shadow(0 10px 16px rgba(120,78,40,0.18))",
        pointerEvents: "none"
      }
    }
  ))));
}
let wkCtx = null;
function wkAudioUnlock() {
  if (!wkCtx) wkCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (wkCtx.state === "suspended") wkCtx.resume();
  return wkCtx;
}
function wkChimePlay() {
  const ctx = wkAudioUnlock(), now = ctx.currentTime;
  [784, 1175].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = f;
    const t0 = now + i * 0.11;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-4, t0 + 0.55);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + 0.6);
  });
}
let wkAmb = null;
function wkAmbientStart() {
  if (wkAmb) return;
  const ctx = wkAudioUnlock();
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.2;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 480;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lg = ctx.createGain();
  lg.gain.value = 0.018;
  src.connect(lp).connect(g).connect(ctx.destination);
  lfo.connect(lg).connect(g.gain);
  src.start();
  lfo.start();
  wkAmb = { src, lfo, g, ctx };
}
function wkAmbientStop() {
  if (!wkAmb) return;
  const { src, lfo, g, ctx } = wkAmb;
  wkAmb = null;
  const t = ctx.currentTime;
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(g.gain.value, t);
  g.gain.linearRampToValueAtTime(0, t + 0.6);
  src.stop(t + 0.65);
  lfo.stop(t + 0.65);
}
function Toggle({ on, onChange }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: () => onChange(!on), style: {
    width: 44,
    height: 26,
    borderRadius: 13,
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    background: on ? "#E08A4B" : "rgba(120,78,40,0.22)",
    transition: "background .2s ease",
    padding: 0
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    display: "block",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#fff",
    margin: 2,
    transform: on ? "translateX(18px)" : "none",
    transition: "transform .2s cubic-bezier(.34,1.1,.4,1)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
  } }));
}
function SoundRow({ label, on, onChange, last }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    padding: "13px 15px",
    borderBottom: last ? "none" : "0.5px solid rgba(120,78,40,0.08)"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: "#5E4630" } }, label), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Toggle, { on, onChange })));
}
function ButtonRow({ label, buttonLabel, onClick, last }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    padding: "13px 15px",
    borderBottom: last ? "none" : "0.5px solid rgba(120,78,40,0.08)"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: "#5E4630" } }, label), /* @__PURE__ */ React.createElement("button", { onClick, style: {
    marginLeft: "auto",
    border: "0.5px solid rgba(120,78,40,0.18)",
    background: "#fff",
    borderRadius: 9,
    cursor: "pointer",
    padding: "6px 12px",
    fontFamily: "'PingFang SC', system-ui",
    fontSize: 13,
    fontWeight: 600,
    color: "#C2703C"
  } }, buttonLabel));
}
const WK_VERSION = "1.1.0";
const WK_SITE = "warmkitty.barrybarrywu.com";
const WK_GITHUB = "https://github.com/barrybarrywu/warm-kitty";
const WK_DONATE = "https://sponsor.barrybarrywu.com/";
const WK_LINK_ICONS = {
  website: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "1.7" }), /* @__PURE__ */ React.createElement("path", { d: "M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18", stroke: "currentColor", strokeWidth: "1.7" })),
  github: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.34 6.84 9.69.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0022 12.23C22 6.58 17.52 2 12 2z" })),
  donate: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M12 20.5l-1.3-1.16C6.1 15.24 3 12.45 3 9.02 3 6.3 5.14 4.2 7.8 4.2c1.5 0 2.95.7 3.9 1.8.95-1.1 2.4-1.8 3.9-1.8 2.66 0 4.8 2.1 4.8 4.82 0 3.43-3.1 6.22-7.7 10.32L12 20.5z", fill: "currentColor" }))
};
function LinkRow({ label, href, icon, accent, last }) {
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: (e) => {
        e.preventDefault();
        post({ type: "openURL", url: href });
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "13px 15px",
        textDecoration: "none",
        borderBottom: last ? "none" : "0.5px solid rgba(120,78,40,0.08)",
        transition: "background .15s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "rgba(224,138,75,0.06)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: accent ? "rgba(224,138,75,0.12)" : "rgba(120,78,40,0.07)",
      color: accent ? "#E08A4B" : "#8A6446"
    } }, icon),
    /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: "#5E4630" } }, label),
    /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", style: { marginLeft: "auto", flexShrink: 0, color: "#C9AE92" } }, /* @__PURE__ */ React.createElement("path", { d: "M9 6l6 6-6 6", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }))
  );
}
function GearButton({ onClick, title }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      "aria-label": title,
      title,
      style: {
        position: "relative",
        zIndex: 3,
        marginLeft: "auto",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "rgba(255,255,255,0.5)",
        borderRadius: 9,
        cursor: "pointer",
        color: "#8A6446",
        boxShadow: "0 1px 2px rgba(120,78,40,0.12)",
        transition: "transform .25s ease, background .2s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.85)";
        e.currentTarget.firstChild.style.transform = "rotate(45deg)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.5)";
        e.currentTarget.firstChild.style.transform = "none";
      }
    },
    /* @__PURE__ */ React.createElement("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", style: { transition: "transform .4s ease" } }, /* @__PURE__ */ React.createElement("path", { d: "M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z", stroke: "currentColor", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M19.4 13.6a1.5 1.5 0 00.3 1.65l.05.05a1.8 1.8 0 11-2.55 2.55l-.05-.05a1.5 1.5 0 00-1.65-.3 1.5 1.5 0 00-.9 1.37V19a1.8 1.8 0 11-3.6 0v-.1a1.5 1.5 0 00-1-1.37 1.5 1.5 0 00-1.65.3l-.05.05a1.8 1.8 0 11-2.55-2.55l.05-.05a1.5 1.5 0 00.3-1.65 1.5 1.5 0 00-1.37-.9H5a1.8 1.8 0 110-3.6h.1a1.5 1.5 0 001.37-1 1.5 1.5 0 00-.3-1.65l-.05-.05A1.8 1.8 0 117.67 4.6l.05.05a1.5 1.5 0 001.65.3H9.4a1.5 1.5 0 00.9-1.37V5a1.8 1.8 0 113.6 0v.1a1.5 1.5 0 00.9 1.37 1.5 1.5 0 001.65-.3l.05-.05a1.8 1.8 0 112.55 2.55l-.05.05a1.5 1.5 0 00-.3 1.65V13.6z", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }))
  );
}
function AppIcon({ size = 88 }) {
  return /* @__PURE__ */ React.createElement("img", { src: "images/app-icon.png", alt: "Warm Kitty", draggable: "false", style: {
    width: size,
    height: size,
    display: "block",
    flexShrink: 0,
    filter: "drop-shadow(0 8px 20px -6px rgba(224,138,75,0.6))"
  } });
}
function SettingsPage({
  open,
  onClose,
  lang,
  effLang,
  setLang,
  T,
  version,
  chime,
  setChime,
  ambient,
  setAmbient,
  launchAtLogin,
  setLaunchAtLogin,
  autoUpdate,
  setAutoUpdate,
  checkUpdates
}) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 20, pointerEvents: open ? "auto" : "none" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: {
    position: "absolute",
    inset: 0,
    background: "rgba(70,46,22,0.18)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    opacity: open ? 1 : 0,
    transition: "opacity .3s ease"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "86%",
    maxWidth: 380,
    background: "linear-gradient(180deg, #FFF9F0 0%, #FBEFDD 100%)",
    boxShadow: "-18px 0 50px -16px rgba(70,46,22,0.4)",
    transform: open ? "translateX(0)" : "translateX(104%)",
    transition: "transform .42s cubic-bezier(.34,1.1,.4,1)",
    display: "flex",
    flexDirection: "column"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    height: 46,
    display: "flex",
    alignItems: "center",
    padding: "0 14px 0 18px",
    borderBottom: "0.5px solid rgba(120,78,40,0.12)",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 16, color: "#5E4630", whiteSpace: "nowrap" } }, T.settings), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "'Baloo 2', 'PingFang SC', system-ui",
    fontSize: 14,
    fontWeight: 600,
    color: "#E08A4B",
    padding: "6px 8px"
  } }, T.done)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "20px 18px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: "#B08A60", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 } }, T.language), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 28 } }, /* @__PURE__ */ React.createElement("select", { value: lang, onChange: (e) => setLang(e.target.value), style: {
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    padding: "13px 40px 13px 15px",
    borderRadius: 13,
    cursor: "pointer",
    border: "0.5px solid rgba(120,78,40,0.18)",
    background: "#fff",
    fontFamily: "'PingFang SC', system-ui",
    fontSize: 14,
    fontWeight: 600,
    color: "#5E4630",
    outline: "none"
  } }, WK_LANGS.map(([code]) => {
    const full = code === "auto" ? T.autoLang : { zh: "\u7B80\u4F53\u4E2D\u6587", en: "English", ja: "\u65E5\u672C\u8A9E", "zh-Hant": "\u7E41\u9AD4\u4E2D\u6587" }[code];
    return /* @__PURE__ */ React.createElement("option", { key: code, value: code }, full);
  })), /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", style: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6", stroke: "#B08A60", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }))), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: "#B08A60", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 } }, T.sound), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28, borderRadius: 14, background: "#fff", border: "0.5px solid rgba(120,78,40,0.1)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(SoundRow, { label: T.chimeOption, on: chime, onChange: setChime }), /* @__PURE__ */ React.createElement(SoundRow, { label: T.ambientOption, on: ambient, onChange: setAmbient, last: true })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: "#B08A60", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 } }, T.general), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28, borderRadius: 14, background: "#fff", border: "0.5px solid rgba(120,78,40,0.1)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(SoundRow, { label: T.launchAtLogin, on: launchAtLogin, onChange: setLaunchAtLogin }), /* @__PURE__ */ React.createElement(SoundRow, { label: T.autoUpdate, on: autoUpdate, onChange: setAutoUpdate }), /* @__PURE__ */ React.createElement(ButtonRow, { label: `${T.version} ${version}`, buttonLabel: T.checkNow, onClick: checkUpdates, last: true })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: "#B08A60", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 } }, T.about), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "4px 0 8px" } }, /* @__PURE__ */ React.createElement(AppIcon, { size: 88 }), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 22, color: "#5E4630", marginTop: 12 } }, "Warm Kitty"), /* @__PURE__ */ React.createElement("p", { style: {
    margin: "8px 0 0",
    fontFamily: "'Baloo 2', system-ui",
    fontStyle: effLang === "en" ? "italic" : "normal",
    fontSize: 15,
    fontWeight: 500,
    color: "#C2703C",
    lineHeight: 1.4,
    maxWidth: 240,
    textWrap: "balance"
  } }, '"', T.slogan, '"')), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, borderRadius: 14, background: "#fff", border: "0.5px solid rgba(120,78,40,0.1)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", padding: "12px 15px", borderBottom: "0.5px solid rgba(120,78,40,0.08)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'PingFang SC', system-ui", fontSize: 14, color: "#8A6446" } }, T.version), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontFamily: "'Baloo 2', system-ui", fontSize: 14, fontWeight: 600, color: "#5E4630" } }, version)), /* @__PURE__ */ React.createElement(LinkRow, { label: T.website, href: `https://${WK_SITE}`, icon: WK_LINK_ICONS.website }), /* @__PURE__ */ React.createElement(LinkRow, { label: T.github, href: WK_GITHUB, icon: WK_LINK_ICONS.github }), /* @__PURE__ */ React.createElement(LinkRow, { label: T.donate, href: WK_DONATE, icon: WK_LINK_ICONS.donate, accent: true, last: true })))));
}
const MIN_MIN = 1, MAX_MIN = 15, DEFAULT_MIN = 5;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const fmtTime = (s) => {
  s = Math.max(0, Math.ceil(s));
  const m = s / 60 | 0, ss = s % 60;
  return m + ":" + String(ss).padStart(2, "0");
};
function App() {
  const t = { accent: "#E08A4B", poseHold: 8, narration: true };
  const [phase, setPhase] = React.useState("standby");
  const [minutes, setMinutes] = React.useState(() => {
    const v = parseInt(localStorage.getItem("wk_minutes") || String(DEFAULT_MIN), 10);
    return isNaN(v) ? DEFAULT_MIN : Math.max(MIN_MIN, Math.min(MAX_MIN, v));
  });
  const [rem, setRem] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [narrIdx, setNarrIdx] = React.useState(0);
  const [lang, setLangState] = React.useState(() => {
    const v = localStorage.getItem("wk_lang");
    return v === "auto" || WK_I18N[v] ? v : "auto";
  });
  const setLang = (v) => {
    setLangState(v);
    localStorage.setItem("wk_lang", v);
  };
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(() => !localStorage.getItem("wk_seen_v2"));
  const [version, setVersion] = React.useState(WK_VERSION);
  const [chime, setChimeState] = React.useState(() => localStorage.getItem("wk_chime") !== "0");
  const [ambient, setAmbState] = React.useState(() => localStorage.getItem("wk_ambient") === "1");
  const setChime = (v) => {
    setChimeState(v);
    localStorage.setItem("wk_chime", v ? "1" : "0");
  };
  const setAmbient = (v) => {
    setAmbState(v);
    localStorage.setItem("wk_ambient", v ? "1" : "0");
  };
  const [launchAtLogin, setLaunchAtLoginState] = React.useState(false);
  const [autoUpdate, setAutoUpdateState] = React.useState(true);
  const setLaunchAtLogin = (v) => {
    setLaunchAtLoginState(v);
    post({ type: "setLaunchAtLogin", enabled: v });
  };
  const setAutoUpdate = (v) => {
    setAutoUpdateState(v);
    post({ type: "setAutoUpdate", enabled: v });
  };
  const checkUpdates = () => post({ type: "checkForUpdates" });
  const chimeRef = React.useRef(chime);
  chimeRef.current = chime;
  const effLang = lang === "auto" ? resolveLang() : lang;
  const T = WK_I18N[effLang] || WK_I18N.zh;
  React.useEffect(() => {
    localStorage.setItem("wk_minutes", String(minutes));
  }, [minutes]);
  React.useEffect(() => {
    if (phase === "ending" && chimeRef.current) wkChimePlay();
  }, [phase]);
  React.useEffect(() => {
    if (phase === "warming" && ambient) wkAmbientStart();
    else wkAmbientStop();
  }, [phase, ambient]);
  React.useEffect(() => {
    window.warmkitty = window.warmkitty || {};
    window.warmkitty.onTick = (r, tot) => {
      setRem(r);
      setTotal(tot);
    };
    window.warmkitty.onRunning = () => {
    };
    window.warmkitty.onDone = () => setPhase("ending");
    window.warmkitty.onVersion = (v) => setVersion(v);
    window.warmkitty.onLaunchAtLogin = (v) => setLaunchAtLoginState(v);
    window.warmkitty.onAutoUpdate = (v) => setAutoUpdateState(v);
    post({ type: "ready" });
  }, []);
  const begin = () => {
    wkAudioUnlock();
    setPhase("warming");
    setNarrIdx(0);
    post({ type: "start", minutes });
  };
  const halt = () => {
    post({ type: "stop" });
    setPhase("standby");
  };
  const restart = () => {
    setPhase("standby");
  };
  const accent = t.accent;
  const frac = total > 0 ? rem / total : 1;
  const stepMs = 1e3;
  const warmLines = T.narration.warming;
  const narr = phase === "warming" ? warmLines[narrIdx % warmLines.length] : phase === "ending" ? T.narration.ending : T.narration.standby;
  return /* @__PURE__ */ React.createElement("div", { style: {
    width: "100%",
    height: "100vh",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    background: "#fff"
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFF7EC 0%, #FCEBD3 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: "50%",
    top: 96,
    width: 380,
    height: 380,
    transform: "translateX(-50%)",
    background: `radial-gradient(circle, ${hexA(accent, phase === "standby" ? 0.12 : 0.24)} 0%, transparent 66%)`,
    transition: "background .8s ease",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    height: 46,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    background: "rgba(255,255,255,0.42)",
    backdropFilter: "blur(18px) saturate(150%)",
    WebkitBackdropFilter: "blur(18px) saturate(150%)",
    borderBottom: "0.5px solid rgba(120,78,40,0.12)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [["#ff5f57", "close"], ["#febc2e", "minimize"], ["#28c840", "zoom"]].map(([c, action]) => /* @__PURE__ */ React.createElement("div", { key: c, onClick: () => post({ type: "window", action }), style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "0.5px solid rgba(0,0,0,0.12)", cursor: "pointer" } }))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
    fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui",
    fontSize: 16,
    color: "#5E4630",
    letterSpacing: "0.02em"
  } }, /* @__PURE__ */ React.createElement("span", { style: { marginRight: 6 } }, "\u{1F43E}"), "Warm Kitty"), /* @__PURE__ */ React.createElement(GearButton, { onClick: () => setSettingsOpen(true), title: T.settings })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "calc(100vh - 46px)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 30px 32px", boxSizing: "border-box" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 256, height: 256, marginTop: 0, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { key: phase, className: phase === "ending" ? "wk-pop" : "", style: { width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement(CatStage, { phase, holdMs: (t.poseHold || 8) * 1e3, onPoseChange: (i) => setNarrIdx(i) }))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Readout, { phase, minutes, rem, accent, T })), t.narration && /* @__PURE__ */ React.createElement("div", { style: { minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", margin: "4px 0 0", padding: "0 4px", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("p", { key: narr, style: {
    margin: 0,
    fontFamily: "'ZCOOL KuaiLe', 'PingFang SC', system-ui",
    fontSize: 16,
    color: "#7A5230",
    lineHeight: 1.4,
    textWrap: "pretty",
    animation: "wk-narr .45s ease"
  } }, narr)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minHeight: 2 } }), phase !== "ending" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(WarmSlider, { phase, minutes, setMinutes, frac, accent, stepMs, T }), phase === "standby" ? /* @__PURE__ */ React.createElement("button", { onClick: begin, className: "wk-btn", style: { "--accent": accent, background: accent, color: "#fff", borderColor: "transparent", marginTop: 18 } }, /* @__PURE__ */ React.createElement(FlameIcon, null), T.start) : /* @__PURE__ */ React.createElement("button", { onClick: halt, className: "wk-btn", style: { "--accent": accent, background: "transparent", color: "#9A6A45", borderColor: "rgba(154,106,69,0.4)", marginTop: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "wk-pulse", style: { background: accent } }), T.stop), /* @__PURE__ */ React.createElement("div", { style: { minHeight: 30, marginTop: 11, flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: "#B08A60", textAlign: "center", textWrap: "pretty" } }, phase === "standby" ? T.footnote : "")), phase === "ending" && /* @__PURE__ */ React.createElement("button", { onClick: restart, className: "wk-btn", style: { "--accent": accent, background: accent, color: "#fff", borderColor: "transparent" } }, /* @__PURE__ */ React.createElement(PawIcon, null), T.restart)), /* @__PURE__ */ React.createElement(
    SettingsPage,
    {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      lang,
      effLang,
      setLang,
      T,
      version,
      chime,
      setChime,
      ambient,
      setAmbient,
      launchAtLogin,
      setLaunchAtLogin,
      autoUpdate,
      setAutoUpdate,
      checkUpdates
    }
  ), firstRun && /* @__PURE__ */ React.createElement(FirstRun, { T, onClose: () => {
    setFirstRun(false);
    localStorage.setItem("wk_seen_v2", "1");
  }, accent }));
}
function WarmSlider({ phase, minutes, setMinutes, frac, accent, stepMs, T }) {
  const warming = phase === "warming";
  const trackRef = React.useRef(null);
  const dragging = React.useRef(false);
  const heaterAspect = 692 / 1156;
  const heaterW = 38, heaterH = Math.round(heaterW / heaterAspect);
  const padTop = heaterH - 12;
  const p0 = (minutes - MIN_MIN) / (MAX_MIN - MIN_MIN);
  const pos = warming ? p0 * clamp(frac) : p0;
  const posPct = pos * 100 + "%";
  const fillTrans = warming ? `width ${stepMs}ms linear` : "none";
  const moveTrans = warming ? `left ${stepMs}ms linear` : "none";
  const setFromX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const f = clamp((clientX - r.left) / r.width);
    setMinutes(Math.round(MIN_MIN + f * (MAX_MIN - MIN_MIN)));
  };
  const onPointerDown = (e) => {
    if (warming) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!warming && dragging.current) setFromX(e.clientX);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {
    }
  };
  const onKeyDown = (e) => {
    if (warming) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setMinutes(Math.max(MIN_MIN, minutes - 1));
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setMinutes(Math.min(MAX_MIN, minutes + 1));
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { width: "100%", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "wk-dur-label" }, T.duration), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "wk-slot" + (warming ? "" : " draggable"),
      style: { paddingTop: padTop },
      role: warming ? void 0 : "slider",
      tabIndex: warming ? void 0 : 0,
      "aria-valuemin": warming ? void 0 : MIN_MIN,
      "aria-valuemax": warming ? void 0 : MAX_MIN,
      "aria-valuenow": warming ? void 0 : minutes,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown
    },
    /* @__PURE__ */ React.createElement("div", { className: "wk-track", ref: trackRef }, /* @__PURE__ */ React.createElement("div", { className: "wk-track-fill", style: { width: posPct, background: accent, transition: fillTrans } }), warming && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: posPct,
      top: "50%",
      width: 50,
      height: 50,
      borderRadius: "50%",
      transform: "translate(-50%,-50%)",
      background: `radial-gradient(circle, ${hexA(accent, 0.85)} 0%, transparent 70%)`,
      animation: "wk-glow 1.5s ease-in-out infinite",
      transition: moveTrans,
      pointerEvents: "none"
    } }), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "images/heater.png",
        alt: "",
        className: "wk-heater",
        draggable: "false",
        style: {
          left: posPct,
          width: heaterW,
          height: heaterH,
          transition: moveTrans,
          animation: warming ? "wk-bob 2.2s ease-in-out infinite" : "none",
          filter: "drop-shadow(0 3px 6px rgba(110,74,51,0.4))"
        }
      }
    ))
  ), /* @__PURE__ */ React.createElement("div", { className: "wk-scale" }, /* @__PURE__ */ React.createElement("span", null, warming ? 0 : MIN_MIN, " ", T.minuteUnit), /* @__PURE__ */ React.createElement("span", null, warming ? minutes : MAX_MIN, " ", T.minuteUnit)));
}
function Readout({ phase, minutes, rem, accent, T }) {
  if (phase === "ending") {
    return /* @__PURE__ */ React.createElement("div", { style: { height: 72, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'ZCOOL KuaiLe', system-ui", fontSize: 38, lineHeight: 1.05, color: accent } }, T.endingTitle));
  }
  const isWarm = phase === "warming";
  return /* @__PURE__ */ React.createElement("div", { style: { height: 72 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Baloo 2', system-ui", fontWeight: 700, fontSize: 52, lineHeight: 1, color: isWarm ? "#5E4630" : "#C9A982", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", textShadow: isWarm ? "0 1px 0 rgba(255,255,255,0.6)" : "none" } }, fmtTime(isWarm ? rem : minutes * 60)), /* @__PURE__ */ React.createElement("div", { style: { height: 16, marginTop: 5, fontFamily: "'ZCOOL KuaiLe', system-ui", fontSize: 12.5, color: "#A07E58" } }, isWarm ? T.remaining : ""));
}
function FirstRun({ T, onClose, accent }) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(70,46,22,0.28)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", animation: "wk-fade .3s ease" } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: 296,
    borderRadius: 22,
    padding: "26px 24px 22px",
    textAlign: "center",
    background: "linear-gradient(180deg, #FFFBF4 0%, #FDF0DD 100%)",
    boxShadow: "0 24px 50px -16px rgba(70,46,22,0.45)",
    animation: "wk-rise .4s cubic-bezier(.34,1.3,.4,1)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96, height: 96, margin: "0 auto 8px" } }, /* @__PURE__ */ React.createElement("img", { src: "cat/idle.png", alt: "", style: { width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 6px 10px rgba(120,78,40,0.2))" } })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 21, color: "#5E4630", marginBottom: 8 } }, T.firstTitle), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 18px", fontFamily: "'PingFang SC', system-ui", fontSize: 13.5, lineHeight: 1.6, color: "#8A6446", textWrap: "pretty" } }, T.firstBody), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "wk-btn", style: { "--accent": accent, background: accent, color: "#fff", borderColor: "transparent", height: 48 } }, T.firstBtn)));
}
function FlameIcon() {
  return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", style: { marginRight: 2 } }, /* @__PURE__ */ React.createElement("path", { d: "M12 3c1 3-1.5 4-1.5 6.5C10.5 11 11 12 12 12s2-1 1.8-3C16 11 17 13 17 15.5 17 19 14.5 21 12 21s-5-2-5-5.5c0-3 2-4.5 2-7C9 6 11 5 12 3z", fill: "#fff" }));
}
function PawIcon() {
  return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "#fff", style: { marginRight: 2 } }, /* @__PURE__ */ React.createElement("ellipse", { cx: "12", cy: "15", rx: "5", ry: "4.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "6.5", cy: "10", r: "2.1" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "7", r: "2.1" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "7", r: "2.1" }), /* @__PURE__ */ React.createElement("circle", { cx: "17.5", cy: "10", r: "2.1" }));
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
