// Global language state.
// LANG is 'en' | 'zh'. Stored in localStorage. Components subscribe via useLang().
(function () {
  const KEY = 'bb_lang';
  let current = 'en';
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'zh' || stored === 'en') current = stored;
  } catch (e) {}
  document.documentElement.setAttribute('data-lang', current);

  window.__bbLang = {
    get: () => current,
    set: (l) => {
      if (l !== 'en' && l !== 'zh') return;
      current = l;
      try { localStorage.setItem(KEY, l); } catch (e) {}
      document.documentElement.setAttribute('data-lang', l);
      window.dispatchEvent(new CustomEvent('bb:langchange', { detail: l }));
    }
  };
})();

function useLang() {
  const [lang, setLang] = React.useState(() => window.__bbLang.get());
  React.useEffect(() => {
    const onChange = (e) => setLang(e.detail);
    window.addEventListener('bb:langchange', onChange);
    return () => window.removeEventListener('bb:langchange', onChange);
  }, []);
  return [lang, (l) => window.__bbLang.set(l)];
}

// Tiny i18n helper for static strings used across the site.
const BB_STRINGS = {
  home:           { en: 'Home',                      zh: '首頁' },
  reservations:   { en: 'Reservations',              zh: '訂位' },
  findUs:         { en: 'Find us',                   zh: '位置' },
  todaysMenu:     { en: "Menu of the day",          zh: '當日甄選' },
  composeOwn:     { en: 'Compose your own selection',zh: '自選菜式' },
  exitCompose:    { en: 'Exit selection mode',       zh: '退出自選' },
  composeFab:     { en: 'Compose your selection',    zh: '開始自選' },
  reviewOne:      { en: 'Review · 1 dish',           zh: '查看 · 1 道菜' },
  reviewN:        { en: (n) => `Review · ${n} dishes`,zh: (n) => `查看 · ${n} 道菜` },
  yourSelection:  { en: 'Your selection',            zh: '您的選擇' },
  noDishes:       { en: 'No dishes yet',             zh: '尚未選菜' },
  oneDish:        { en: 'One dish',                  zh: '一道菜' },
  nDishes:        { en: (n) => `${n} dishes`,        zh: (n) => `${n} 道菜` },
  tapToBegin:     { en: 'Tap any dish on the menu to begin composing your selection.',
                    zh: '輕點任意菜式開始自選。' },
  remove:         { en: 'Remove',                    zh: '移除' },
  continueLabel:  { en: 'Continue',                  zh: '繼續' },
  noteTitle:      { en: 'A note to the kitchen',     zh: '寫予廚房的話' },
  noteSub:        { en: 'Tell us a little about your evening', zh: '告訴我們您的用餐安排' },
  receivedTitle:  { en: 'Received with thanks',      zh: '已收到，謝謝' },
  receivedSub:    { en: "We'll be in touch shortly", zh: '將儘快與您聯繫' },
  receivedBody:   { en: 'The chef will reply within the hour to confirm your evening and suggest pairings.',
                    zh: '主廚將在一小時內回覆，確認您的安排並建議搭配。' },
  reference:      { en: 'Reference',                 zh: '單號' },
  setting:        { en: 'Setting the table…',        zh: '正在備席…' },
  byInvitation:   { en: 'by invitation · Thursday through Sunday',
                    zh: '受邀制 · 週四至週日' },
  legendTitle:    { en: 'Legend',                    zh: '圖例' },
  legendSpicy:    { en: 'spicy',                     zh: '辣' },
  legendPlant:    { en: 'plant-based',               zh: '素食' },
};
function t(key) {
  const v = BB_STRINGS[key];
  if (!v) return key;
  return v[window.__bbLang.get()] || v.en;
}
function tFn(key, ...args) {
  const v = BB_STRINGS[key];
  if (!v) return key;
  const fn = v[window.__bbLang.get()] || v.en;
  return typeof fn === 'function' ? fn(...args) : fn;
}

window.useLang = useLang;
window.BB_STRINGS = BB_STRINGS;
window.t = t;
window.tFn = tFn;

// Lang switcher — desktop shows EN · 中文, mobile (≤520px) shows only the
// active language and tapping toggles to the other.
function LangSwitch() {
  const [lang, setLang] = useLang();
  const other = lang === 'en' ? 'zh' : 'en';
  return (
    <span className="lang-switch ui">
      <button
        className={lang === 'en' ? 'on' : ''}
        onClick={() => setLang('en')}
        aria-label="English"
      >EN</button>
      <span className="dot">·</span>
      <button
        className={lang === 'zh' ? 'on' : ''}
        onClick={() => setLang('zh')}
        aria-label="中文"
      >中文</button>
      {/* Compact toggle visible only on mobile via CSS — flips to the other lang */}
      <button
        className="compact-toggle"
        onClick={() => setLang(other)}
        aria-label={`Switch to ${other === 'en' ? 'English' : '中文'}`}
      >{lang === 'en' ? 'EN' : '中文'}</button>
    </span>
  );
}
window.LangSwitch = LangSwitch;

// Legend (fixed bottom-right). Persistable dismiss not needed.
function Legend() {
  const [lang] = useLang();
  return (
    <aside className="legend ui" aria-label="Legend">
      <span className="lg-row"><span className="zh hot">辣</span> <span className={`lg-en ${lang === 'zh' ? 'zh' : ''}`}>{BB_STRINGS.legendSpicy[lang]}</span></span>
      <span className="lg-row"><span className="zh plant">素</span> <span className={`lg-en ${lang === 'zh' ? 'zh' : ''}`}>{BB_STRINGS.legendPlant[lang]}</span></span>
    </aside>
  );
}
window.Legend = Legend;
