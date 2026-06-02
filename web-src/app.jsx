// ─────────────────────────────────────────────────────────────────────────────
// native bridge
const post = (msg) => { try { window.webkit.messageHandlers.bridge.postMessage(msg); } catch (e) {} };

// ─────────────────────────────────────────────────────────────────────────────
// i18n2 — Warm Kitty (timer pivot) translations: 简体 / English / 日本語 / 繁體
const WK_LANGS = [
  ['zh', '中'],
  ['en', 'EN'],
  ['ja', '日'],
  ['zh-Hant', '繁'],
];

const WK_I18N = {
  zh: {
    title: 'Warm Kitty',
    slogan: '你的 MacBook，比你男朋友的手还暖。',
    duration: '暖手时长',
    minuteUnit: '分钟',
    standbyPrompt: '想暖多久？',
    start: '开始暖手',
    stop: '停止',
    remaining: '剩余时间',
    endingTitle: '暖好啦',
    endingSub: '手是不是热乎乎的啦～',
    restart: '再暖一次',
    footnote: '暖手时电脑会发热、风扇会转 · 到点自动停 🐾',
    settings: '设置',
    language: '语言',
    about: '关于',
    version: '版本',
    website: '网站',
    github: 'GitHub',
    donate: '赞助我们',
    done: '完成',
    sound: '声音',
    chimeOption: '完成提示音',
    ambientOption: '暖手环境音',
    firstTitle: '欢迎来到 Warm Kitty',
    firstBody: '我会让电脑轻轻发点热，帮你焐暖一双小手。选个时长就开始，时间一到自动停下。',
    firstBtn: '好的，开始吧',
    narration: {
      standby: '选个时长，我来帮你焐暖小手～',
      ending: '呼～暖好啦，手是不是热乎乎的？',
      warming: [
        '呼噜呼噜…正在帮你把手焐热～',
        '暖暖的，再坚持一下下就好啦。',
        '像捧着一杯刚泡好的热可可一样～',
        '热乎乎的，是不是舒服多了？',
      ],
    },
  },
  en: {
    title: 'Warm Kitty',
    slogan: "Your MacBook, warmer than your boyfriend's hands.",
    duration: 'Warming time',
    minuteUnit: 'min',
    standbyPrompt: 'How long?',
    start: 'Start warming',
    stop: 'Stop',
    remaining: 'Time left',
    endingTitle: 'All warm!',
    endingSub: 'Toasty little hands now~',
    restart: 'Warm again',
    footnote: 'Warms the laptop & spins the fan · auto-stops at zero 🐾',
    settings: 'Settings',
    language: 'Language',
    about: 'About',
    version: 'Version',
    website: 'Website',
    github: 'GitHub',
    donate: 'Donate',
    done: 'Done',
    sound: 'Sound',
    chimeOption: 'Completion chime',
    ambientOption: 'Warming ambience',
    firstTitle: 'Welcome to Warm Kitty',
    firstBody: 'I gently warm your laptop to toast your hands. Pick a time, tap start, and I stop on my own when it runs out.',
    firstBtn: 'Got it, let’s go',
    narration: {
      standby: 'Pick a time and I’ll warm your hands~',
      ending: 'Phew~ all warm. Toasty hands?',
      warming: [
        'Purr purr… warming your hands up~',
        'Nice and cozy, just a little longer.',
        'Like cupping a fresh mug of hot cocoa~',
        'Toasty all over. Feeling better?',
      ],
    },
  },
  ja: {
    title: 'Warm Kitty',
    slogan: 'あなたのMacBook、彼氏の手よりあったかい。',
    duration: '暖め時間',
    minuteUnit: '分',
    standbyPrompt: 'どのくらい暖める？',
    start: '暖め開始',
    stop: '停止',
    remaining: '残り時間',
    endingTitle: '暖まったよ',
    endingSub: '手がぽかぽかでしょ～',
    restart: 'もう一度',
    footnote: 'PCが発熱しファンが回ります · 0になると自動停止 🐾',
    settings: '設定',
    language: '言語',
    about: 'アプリについて',
    version: 'バージョン',
    website: 'ウェブサイト',
    github: 'GitHub',
    donate: '寄付',
    done: '完了',
    sound: 'サウンド',
    chimeOption: '完了の音',
    ambientOption: '暖めの環境音',
    firstTitle: 'Warm Kitty へようこそ',
    firstBody: 'PCをほんのり発熱させて、手をぬくぬくにします。時間を選んで開始、0になったら自動で止まります。',
    firstBtn: 'はじめる',
    narration: {
      standby: '時間を選んでね、手を暖めてあげる～',
      ending: 'ふぅ〜暖まったよ。ぽかぽかでしょ？',
      warming: [
        'ゴロゴロ…手を暖めてるよ～',
        'ぬくぬく、もう少しだけね。',
        '淹れたてのホットココアみたいに～',
        'ぽかぽか。楽になったかな？',
      ],
    },
  },
  'zh-Hant': {
    title: 'Warm Kitty',
    slogan: '你的 MacBook，比你男朋友的手還暖。',
    duration: '暖手時長',
    minuteUnit: '分鐘',
    standbyPrompt: '想暖多久？',
    start: '開始取暖',
    stop: '停止',
    remaining: '剩餘時間',
    endingTitle: '暖好啦',
    endingSub: '手是不是熱乎乎的啦～',
    restart: '再暖一次',
    footnote: '取暖時電腦會發熱、風扇會轉 · 到點自動停 🐾',
    settings: '設定',
    language: '語言',
    about: '關於',
    version: '版本',
    website: '網站',
    github: 'GitHub',
    donate: '贊助我們',
    done: '完成',
    sound: '聲音',
    chimeOption: '完成提示音',
    ambientOption: '暖手環境音',
    firstTitle: '歡迎來到 Warm Kitty',
    firstBody: '我會讓電腦輕輕發點熱，幫你焐暖一雙小手。選個時長就開始，時間一到自動停下。',
    firstBtn: '好的，開始吧',
    narration: {
      standby: '選個時長，我來幫你焐暖小手～',
      ending: '呼～暖好啦，手是不是熱乎乎的？',
      warming: [
        '呼嚕呼嚕…正在幫你把手焐熱～',
        '暖暖的，再堅持一下下就好啦。',
        '像捧著一杯剛泡好的熱可可一樣～',
        '熱乎乎的，是不是舒服多了？',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// cat2 — Warm Kitty pose stage.
const WK_WARM_POSES = [
  'warm-01','warm-02','warm-03','warm-04','warm-05','warm-06','warm-07',
  'warm-08','warm-09','warm-10','warm-11','warm-12','warm-13','warm-14',
];
const WK_ALL_POSES = ['idle', ...WK_WARM_POSES, 'ending'];

function wkShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CatStage({ phase, holdMs = 8000, onPoseChange }) {
  const [active, setActive] = React.useState('idle');
  const playlist = React.useRef([]);
  const cursor = React.useRef(0);

  React.useEffect(() => {
    if (phase === 'standby') { setActive('idle'); return; }
    if (phase === 'ending') { setActive('ending'); return; }
    // warming: kick off the shuffled crossfade loop
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

  return (
    <div className="cat-stage" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className={phase === 'warming' ? 'cat-sway' : ''} style={{ position: 'absolute', inset: 0 }}>
        {WK_ALL_POSES.map((p) => (
          <img
            key={p}
            src={`cat/${p}.png`}
            alt=""
            draggable="false"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain', opacity: p === active ? 1 : 0,
              transition: 'opacity 1.1s ease',
              filter: 'drop-shadow(0 10px 16px rgba(120,78,40,0.18))',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// audio — Web Audio API, no asset files. Unlocked by the Start button gesture.
let wkCtx = null;
function wkAudioUnlock() {
  if (!wkCtx) wkCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (wkCtx.state === 'suspended') wkCtx.resume();
  return wkCtx;
}
function wkChimePlay() {
  const ctx = wkAudioUnlock(), now = ctx.currentTime;
  [784, 1175].forEach((f, i) => {                 // G5→D6 soft rise
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    const t0 = now + i * 0.11;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + 0.6);
  });
}
let wkAmb = null;
function wkAmbientStart() {
  if (wkAmb) return;
  const ctx = wkAudioUnlock();
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0); let last = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 480;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);   // fade in
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.15; // slow breathing
  const lg = ctx.createGain(); lg.gain.value = 0.018;
  src.connect(lp).connect(g).connect(ctx.destination);
  lfo.connect(lg).connect(g.gain);
  src.start(); lfo.start();
  wkAmb = { src, lfo, g, ctx };
}
function wkAmbientStop() {
  if (!wkAmb) return; const { src, lfo, g, ctx } = wkAmb; wkAmb = null;
  const t = ctx.currentTime;
  g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t);
  g.gain.linearRampToValueAtTime(0, t + 0.6);                    // fade out
  src.stop(t + 0.65); lfo.stop(t + 0.65);
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle — iOS-style switch for the settings sound section.
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? '#E08A4B' : 'rgba(120,78,40,0.22)', transition: 'background .2s ease', padding: 0,
    }}>
      <span style={{ display: 'block', width: 22, height: 22, borderRadius: '50%', background: '#fff', margin: 2,
        transform: on ? 'translateX(18px)' : 'none', transition: 'transform .2s cubic-bezier(.34,1.1,.4,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}
function SoundRow({ label, on, onChange, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 15px',
      borderBottom: last ? 'none' : '0.5px solid rgba(120,78,40,0.08)' }}>
      <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: '#5E4630' }}>{label}</span>
      <span style={{ marginLeft: 'auto' }}><Toggle on={on} onChange={onChange} /></span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// settings2 — gear button + sliding settings page (language + about).
const WK_VERSION = '1.1.0';
const WK_SITE = 'warmkitty.barrybarrywu.com';
const WK_GITHUB = 'https://github.com/barrybarrywu/warm-kitty';
const WK_DONATE = 'https://sponsor.barrybarrywu.com/';

const WK_LINK_ICONS = {
  website: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="1.7" /></svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.34 6.84 9.69.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0022 12.23C22 6.58 17.52 2 12 2z" /></svg>
  ),
  donate: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 20.5l-1.3-1.16C6.1 15.24 3 12.45 3 9.02 3 6.3 5.14 4.2 7.8 4.2c1.5 0 2.95.7 3.9 1.8.95-1.1 2.4-1.8 3.9-1.8 2.66 0 4.8 2.1 4.8 4.82 0 3.43-3.1 6.22-7.7 10.32L12 20.5z" fill="currentColor" /></svg>
  ),
};

function LinkRow({ label, href, icon, accent, last }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onClick={(e) => { e.preventDefault(); post({ type: 'openURL', url: href }); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px', textDecoration: 'none',
        borderBottom: last ? 'none' : '0.5px solid rgba(120,78,40,0.08)',
        transition: 'background .15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(224,138,75,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent ? 'rgba(224,138,75,0.12)' : 'rgba(120,78,40,0.07)', color: accent ? '#E08A4B' : '#8A6446',
      }}>{icon}</span>
      <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: '#5E4630' }}>{label}</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto', flexShrink: 0, color: '#C9AE92' }}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </a>
  );
}

function GearButton({ onClick, title }) {
  return (
    <button onClick={onClick} aria-label={title} title={title} style={{
      position: 'relative', zIndex: 3, marginLeft: 'auto', width: 28, height: 28,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: 'none', background: 'rgba(255,255,255,0.5)', borderRadius: 9,
      cursor: 'pointer', color: '#8A6446', boxShadow: '0 1px 2px rgba(120,78,40,0.12)',
      transition: 'transform .25s ease, background .2s ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.firstChild.style.transform = 'rotate(45deg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.firstChild.style.transform = 'none'; }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform .4s ease' }}>
        <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19.4 13.6a1.5 1.5 0 00.3 1.65l.05.05a1.8 1.8 0 11-2.55 2.55l-.05-.05a1.5 1.5 0 00-1.65-.3 1.5 1.5 0 00-.9 1.37V19a1.8 1.8 0 11-3.6 0v-.1a1.5 1.5 0 00-1-1.37 1.5 1.5 0 00-1.65.3l-.05.05a1.8 1.8 0 11-2.55-2.55l.05-.05a1.5 1.5 0 00.3-1.65 1.5 1.5 0 00-1.37-.9H5a1.8 1.8 0 110-3.6h.1a1.5 1.5 0 001.37-1 1.5 1.5 0 00-.3-1.65l-.05-.05A1.8 1.8 0 117.67 4.6l.05.05a1.5 1.5 0 001.65.3H9.4a1.5 1.5 0 00.9-1.37V5a1.8 1.8 0 113.6 0v.1a1.5 1.5 0 00.9 1.37 1.5 1.5 0 001.65-.3l.05-.05a1.8 1.8 0 112.55 2.55l-.05.05a1.5 1.5 0 00-.3 1.65V13.6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function AppIcon({ size = 88 }) {
  return (
    <img src="images/app-icon.png" alt="Warm Kitty" draggable="false" style={{
      width: size, height: size, display: 'block', flexShrink: 0,
      filter: 'drop-shadow(0 8px 20px -6px rgba(224,138,75,0.6))',
    }} />
  );
}

function SettingsPage({ open, onClose, lang, setLang, T, version, chime, setChime, ambient, setAmbient }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(70,46,22,0.18)',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        opacity: open ? 1 : 0, transition: 'opacity .3s ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '86%', maxWidth: 380,
        background: 'linear-gradient(180deg, #FFF9F0 0%, #FBEFDD 100%)',
        boxShadow: '-18px 0 50px -16px rgba(70,46,22,0.4)',
        transform: open ? 'translateX(0)' : 'translateX(104%)',
        transition: 'transform .42s cubic-bezier(.34,1.1,.4,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          height: 46, display: 'flex', alignItems: 'center', padding: '0 14px 0 18px',
          borderBottom: '0.5px solid rgba(120,78,40,0.12)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 16, color: '#5E4630', whiteSpace: 'nowrap' }}>{T.settings}</span>
          <button onClick={onClose} style={{
            marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: "'Baloo 2', 'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: '#E08A4B', padding: '6px 8px',
          }}>{T.done}</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 24px' }}>
          <div style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: '#B08A60', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{T.language}</div>
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
              width: '100%', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
              padding: '13px 40px 13px 15px', borderRadius: 13, cursor: 'pointer',
              border: '0.5px solid rgba(120,78,40,0.18)', background: '#fff',
              fontFamily: "'PingFang SC', system-ui", fontSize: 14, fontWeight: 600, color: '#5E4630', outline: 'none',
            }}>
              {WK_LANGS.map(([code]) => {
                const full = { zh: '简体中文', en: 'English', ja: '日本語', 'zh-Hant': '繁體中文' }[code];
                return <option key={code} value={code}>{full}</option>;
              })}
            </select>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path d="M6 9l6 6 6-6" stroke="#B08A60" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: '#B08A60', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{T.sound}</div>
          <div style={{ marginBottom: 28, borderRadius: 14, background: '#fff', border: '0.5px solid rgba(120,78,40,0.1)', overflow: 'hidden' }}>
            <SoundRow label={T.chimeOption} on={chime} onChange={setChime} />
            <SoundRow label={T.ambientOption} on={ambient} onChange={setAmbient} last />
          </div>

          <div style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 12, fontWeight: 700, color: '#B08A60', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>{T.about}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 0 8px' }}>
            <AppIcon size={88} />
            <div style={{ fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 22, color: '#5E4630', marginTop: 12 }}>Warm Kitty</div>
            <p style={{
              margin: '8px 0 0', fontFamily: "'Baloo 2', system-ui", fontStyle: lang === 'en' ? 'italic' : 'normal', fontSize: 15, fontWeight: 500,
              color: '#C2703C', lineHeight: 1.4, maxWidth: 240, textWrap: 'balance',
            }}>"{T.slogan}"</p>
          </div>

          <div style={{ marginTop: 18, borderRadius: 14, background: '#fff', border: '0.5px solid rgba(120,78,40,0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', borderBottom: '0.5px solid rgba(120,78,40,0.08)' }}>
              <span style={{ fontFamily: "'PingFang SC', system-ui", fontSize: 14, color: '#8A6446' }}>{T.version}</span>
              <span style={{ marginLeft: 'auto', fontFamily: "'Baloo 2', system-ui", fontSize: 14, fontWeight: 600, color: '#5E4630' }}>{version}</span>
            </div>
            <LinkRow label={T.website} href={`https://${WK_SITE}`} icon={WK_LINK_ICONS.website} />
            <LinkRow label={T.github} href={WK_GITHUB} icon={WK_LINK_ICONS.github} />
            <LinkRow label={T.donate} href={WK_DONATE} icon={WK_LINK_ICONS.donate} accent last />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// app2 — Warm Kitty (timer pivot). Three phases: standby → warming → ending.
const MIN_MIN = 1, MAX_MIN = 15, DEFAULT_MIN = 5;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const fmtTime = (s) => { s = Math.max(0, Math.ceil(s)); const m = (s / 60) | 0, ss = s % 60; return m + ':' + String(ss).padStart(2, '0'); };

function App() {
  const t = { accent: '#E08A4B', poseHold: 8, narration: true };
  const [phase, setPhase] = React.useState('standby'); // standby | warming | ending
  const [minutes, setMinutes] = React.useState(() => { const v = parseInt(localStorage.getItem('wk_minutes') || String(DEFAULT_MIN), 10); return isNaN(v) ? DEFAULT_MIN : Math.max(MIN_MIN, Math.min(MAX_MIN, v)); });
  const [rem, setRem] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [narrIdx, setNarrIdx] = React.useState(0);
  const [lang, setLangState] = React.useState(() => { const v = localStorage.getItem('wk_lang'); return WK_I18N[v] ? v : 'zh'; });
  const setLang = (v) => { setLangState(v); localStorage.setItem('wk_lang', v); };
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(() => !localStorage.getItem('wk_seen_v2'));
  const [version, setVersion] = React.useState(WK_VERSION);
  const [chime, setChimeState] = React.useState(() => localStorage.getItem('wk_chime') !== '0');   // default on
  const [ambient, setAmbState] = React.useState(() => localStorage.getItem('wk_ambient') === '1'); // default off
  const setChime = (v) => { setChimeState(v); localStorage.setItem('wk_chime', v ? '1' : '0'); };
  const setAmbient = (v) => { setAmbState(v); localStorage.setItem('wk_ambient', v ? '1' : '0'); };
  const chimeRef = React.useRef(chime); chimeRef.current = chime;
  const T = WK_I18N[lang] || WK_I18N.zh;

  React.useEffect(() => { localStorage.setItem('wk_minutes', String(minutes)); }, [minutes]);

  React.useEffect(() => {                              // chime: natural completion only
    if (phase === 'ending' && chimeRef.current) wkChimePlay();
  }, [phase]);
  React.useEffect(() => {                              // ambient: warming + enabled
    if (phase === 'warming' && ambient) wkAmbientStart();
    else wkAmbientStop();
  }, [phase, ambient]);

  // wire native callbacks + announce ready (once)
  React.useEffect(() => {
    window.warmkitty = window.warmkitty || {};
    window.warmkitty.onTick = (r, tot) => { setRem(r); setTotal(tot); };
    window.warmkitty.onRunning = () => {};
    window.warmkitty.onDone = () => setPhase('ending');
    window.warmkitty.onVersion = (v) => setVersion(v);
    post({ type: 'ready' });
  }, []);

  const begin = () => { wkAudioUnlock(); setPhase('warming'); setNarrIdx(0); post({ type: 'start', minutes }); };
  const halt = () => { post({ type: 'stop' }); setPhase('standby'); };
  const restart = () => { setPhase('standby'); };

  const accent = t.accent;
  const frac = total > 0 ? rem / total : 1;
  const stepMs = 1000; // one tick = 1s
  const warmLines = T.narration.warming;
  const narr = phase === 'warming' ? warmLines[narrIdx % warmLines.length]
    : phase === 'ending' ? T.narration.ending : T.narration.standby;

  return (
    <div style={{
      width: '100%', height: '100vh', borderRadius: 18, overflow: 'hidden', position: 'relative', background: '#fff',
    }}>
      {/* cozy content background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #FFF7EC 0%, #FCEBD3 100%)' }} />
      <div style={{
        position: 'absolute', left: '50%', top: 96, width: 380, height: 380, transform: 'translateX(-50%)',
        background: `radial-gradient(circle, ${hexA(accent, phase === 'standby' ? 0.12 : 0.24)} 0%, transparent 66%)`,
        transition: 'background .8s ease', pointerEvents: 'none',
      }} />

      {/* title bar */}
      <div style={{
        position: 'relative', height: 46, display: 'flex', alignItems: 'center', padding: '0 16px',
        background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px) saturate(150%)',
        borderBottom: '0.5px solid rgba(120,78,40,0.12)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['#ff5f57', 'close'], ['#febc2e', 'minimize'], ['#28c840', 'zoom']].map(([c, action]) => (
            <div key={c} onClick={() => post({ type: 'window', action })} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '0.5px solid rgba(0,0,0,0.12)', cursor: 'pointer' }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
          fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 16, color: '#5E4630', letterSpacing: '0.02em',
        }}><span style={{ marginRight: 6 }}>🐾</span>Warm Kitty</div>
        <GearButton onClick={() => setSettingsOpen(true)} title={T.settings} />
      </div>

      {/* main */}
      <div style={{ position: 'relative', height: 'calc(100vh - 46px)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 30px 32px', boxSizing: 'border-box' }}>
        {/* hero: just the cat — big & front-and-center */}
        <div style={{ position: 'relative', width: 256, height: 256, marginTop: 0, flexShrink: 0 }}>
          <div key={phase} className={phase === 'ending' ? 'wk-pop' : ''} style={{ width: '100%', height: '100%' }}>
            <CatStage phase={phase} holdMs={(t.poseHold || 8) * 1000} onPoseChange={(i) => setNarrIdx(i)} />
          </div>
        </div>

        {/* readout */}
        <div style={{ textAlign: 'center', marginTop: 4, flexShrink: 0 }}>
          <Readout phase={phase} minutes={minutes} rem={rem} accent={accent} T={T} />
        </div>

        {/* narration */}
        {t.narration && (
          <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: '4px 0 0', padding: '0 4px', flexShrink: 0 }}>
            <p key={narr} style={{
              margin: 0, fontFamily: "'ZCOOL KuaiLe', 'PingFang SC', system-ui", fontSize: 16,
              color: '#7A5230', lineHeight: 1.4, textWrap: 'pretty', animation: 'wk-narr .45s ease',
            }}>{narr}</p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 2 }} />

        {/* controls — slider + button keep identical size/position across standby↔warming */}
        {phase !== 'ending' && (
          <React.Fragment>
            <WarmSlider phase={phase} minutes={minutes} setMinutes={setMinutes} frac={frac} accent={accent} stepMs={stepMs} T={T} />
            {phase === 'standby' ? (
              <button onClick={begin} className="wk-btn" style={{ '--accent': accent, background: accent, color: '#fff', borderColor: 'transparent', marginTop: 18 }}>
                <FlameIcon />{T.start}
              </button>
            ) : (
              <button onClick={halt} className="wk-btn" style={{ '--accent': accent, background: 'transparent', color: '#9A6A45', borderColor: 'rgba(154,106,69,0.4)', marginTop: 18 }}>
                <span className="wk-pulse" style={{ background: accent }} />{T.stop}
              </button>
            )}
            {/* footnote slot — reserved in both phases so the button never shifts */}
            <div style={{ minHeight: 30, marginTop: 11, flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', fontFamily: "'PingFang SC', system-ui", fontSize: 11, color: '#B08A60', textAlign: 'center', textWrap: 'pretty' }}>
              {phase === 'standby' ? T.footnote : ''}
            </div>
          </React.Fragment>
        )}

        {phase === 'ending' && (
          <button onClick={restart} className="wk-btn" style={{ '--accent': accent, background: accent, color: '#fff', borderColor: 'transparent' }}>
            <PawIcon />{T.restart}
          </button>
        )}
      </div>

      <SettingsPage open={settingsOpen} onClose={() => setSettingsOpen(false)} lang={lang} setLang={setLang} T={T} version={version} chime={chime} setChime={setChime} ambient={ambient} setAmbient={setAmbient} />
      {firstRun && <FirstRun T={T} onClose={() => { setFirstRun(false); localStorage.setItem('wk_seen_v2', '1'); }} accent={accent} />}
    </div>
  );
}

// ── unified slider: heater thumb in both phases ─────────
//   standby  → draggable; heater sits at the chosen value
//   warming  → non-interactive; heater drains from the chosen value to 0
// Identical markup/size in both phases so nothing shifts on start.
function WarmSlider({ phase, minutes, setMinutes, frac, accent, stepMs, T }) {
  const warming = phase === 'warming';
  const trackRef = React.useRef(null);
  const dragging = React.useRef(false);

  const heaterAspect = 692 / 1156;
  const heaterW = 38, heaterH = Math.round(heaterW / heaterAspect); // ≈ 63
  const padTop = heaterH - 12;

  const p0 = (minutes - MIN_MIN) / (MAX_MIN - MIN_MIN);
  const pos = warming ? p0 * clamp(frac) : p0; // 0..1 along the track
  const posPct = (pos * 100) + '%';
  const fillTrans = warming ? `width ${stepMs}ms linear` : 'none';
  const moveTrans = warming ? `left ${stepMs}ms linear` : 'none';

  const setFromX = (clientX) => {
    const el = trackRef.current; if (!el) return;
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
  const onPointerMove = (e) => { if (!warming && dragging.current) setFromX(e.clientX); };
  const onPointerUp = (e) => { dragging.current = false; try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {} };
  const onKeyDown = (e) => {
    if (warming) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setMinutes(Math.max(MIN_MIN, minutes - 1)); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setMinutes(Math.min(MAX_MIN, minutes + 1)); }
  };

  return (
    <div style={{ width: '100%', flexShrink: 0 }}>
      <div className="wk-dur-label">{T.duration}</div>
      <div
        className={'wk-slot' + (warming ? '' : ' draggable')}
        style={{ paddingTop: padTop }}
        role={warming ? undefined : 'slider'}
        tabIndex={warming ? undefined : 0}
        aria-valuemin={warming ? undefined : MIN_MIN}
        aria-valuemax={warming ? undefined : MAX_MIN}
        aria-valuenow={warming ? undefined : minutes}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="wk-track" ref={trackRef}>
          <div className="wk-track-fill" style={{ width: posPct, background: accent, transition: fillTrans }} />
          {warming && (
            <div style={{
              position: 'absolute', left: posPct, top: '50%', width: 50, height: 50, borderRadius: '50%',
              transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${hexA(accent, 0.85)} 0%, transparent 70%)`,
              animation: 'wk-glow 1.5s ease-in-out infinite', transition: moveTrans, pointerEvents: 'none',
            }} />
          )}
          <img
            src="images/heater.png" alt="" className="wk-heater" draggable="false"
            style={{
              left: posPct, width: heaterW, height: heaterH,
              transition: moveTrans,
              animation: warming ? 'wk-bob 2.2s ease-in-out infinite' : 'none',
              filter: 'drop-shadow(0 3px 6px rgba(110,74,51,0.4))',
            }}
          />
        </div>
      </div>
      <div className="wk-scale">
        <span>{warming ? 0 : MIN_MIN} {T.minuteUnit}</span>
        <span>{warming ? minutes : MAX_MIN} {T.minuteUnit}</span>
      </div>
    </div>
  );
}

function Readout({ phase, minutes, rem, accent, T }) {
  if (phase === 'ending') {
    return (
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'ZCOOL KuaiLe', system-ui", fontSize: 38, lineHeight: 1.05, color: accent }}>{T.endingTitle}</div>
      </div>
    );
  }
  const isWarm = phase === 'warming';
  return (
    <div style={{ height: 72 }}>
      <div style={{ fontFamily: "'Baloo 2', system-ui", fontWeight: 700, fontSize: 52, lineHeight: 1, color: isWarm ? '#5E4630' : '#C9A982', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', textShadow: isWarm ? '0 1px 0 rgba(255,255,255,0.6)' : 'none' }}>{fmtTime(isWarm ? rem : minutes * 60)}</div>
      <div style={{ height: 16, marginTop: 5, fontFamily: "'ZCOOL KuaiLe', system-ui", fontSize: 12.5, color: '#A07E58' }}>{isWarm ? T.remaining : ''}</div>
    </div>
  );
}

function FirstRun({ T, onClose, accent }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(70,46,22,0.28)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', animation: 'wk-fade .3s ease' }} />
      <div style={{
        position: 'relative', width: 296, borderRadius: 22, padding: '26px 24px 22px', textAlign: 'center',
        background: 'linear-gradient(180deg, #FFFBF4 0%, #FDF0DD 100%)', boxShadow: '0 24px 50px -16px rgba(70,46,22,0.45)',
        animation: 'wk-rise .4s cubic-bezier(.34,1.3,.4,1)',
      }}>
        <div style={{ width: 96, height: 96, margin: '0 auto 8px' }}>
          <img src="cat/idle.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 10px rgba(120,78,40,0.2))' }} />
        </div>
        <div style={{ fontFamily: "'ZCOOL KuaiLe', 'Baloo 2', system-ui", fontSize: 21, color: '#5E4630', marginBottom: 8 }}>{T.firstTitle}</div>
        <p style={{ margin: '0 0 18px', fontFamily: "'PingFang SC', system-ui", fontSize: 13.5, lineHeight: 1.6, color: '#8A6446', textWrap: 'pretty' }}>{T.firstBody}</p>
        <button onClick={onClose} className="wk-btn" style={{ '--accent': accent, background: accent, color: '#fff', borderColor: 'transparent', height: 48 }}>{T.firstBtn}</button>
      </div>
    </div>
  );
}

function FlameIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 2 }}><path d="M12 3c1 3-1.5 4-1.5 6.5C10.5 11 11 12 12 12s2-1 1.8-3C16 11 17 13 17 15.5 17 19 14.5 21 12 21s-5-2-5-5.5c0-3 2-4.5 2-7C9 6 11 5 12 3z" fill="#fff" /></svg>);
}
function PawIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: 2 }}><ellipse cx="12" cy="15" rx="5" ry="4.2" /><circle cx="6.5" cy="10" r="2.1" /><circle cx="10" cy="7" r="2.1" /><circle cx="14" cy="7" r="2.1" /><circle cx="17.5" cy="10" r="2.1" /></svg>);
}
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
