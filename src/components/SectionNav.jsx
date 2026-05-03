import React from 'react';
import { useLang, t, LangSwitch } from '../lib/lang';

export function SectionNav({ sections, activeId }) {
  const [lang] = useLang();
  const [merged, setMerged] = React.useState(false);
  const navRef = React.useRef(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let raf = 0;
    let last = null;
    const tick = () => {
      const rect = nav.getBoundingClientRect();
      const m = rect.top <= 1;
      if (m !== last) { last = m; setMerged(m); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (id) => {
    const el = document.getElementById('section-' + id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav ref={navRef} className={`section-nav ${merged ? 'merged' : ''}`}>
      <div className="section-nav-shell">
        <span className="section-nav-side left" aria-hidden={!merged}>
          <a href="index.html" className="snav-home">
            <span className="snav-home-arrow">←</span>
            <span className="snav-home-label">{t('home')}</span>
          </a>
        </span>

        <div className="section-nav-inner">
          {sections.map(s => (
            <a
              key={s.id}
              href={'#section-' + s.id}
              onClick={(e) => { e.preventDefault(); goTo(s.id); }}
              className={`section-nav-link ${activeId === s.id ? 'active' : ''}`}
            >
              {lang === 'zh'
                ? <span className="zh">{s.title.zh}</span>
                : <span className="en">{s.title.en}</span>}
            </a>
          ))}
        </div>
        <div className="section-nav-mobile">
          <select
            value={activeId}
            onChange={(e) => goTo(e.target.value)}
            aria-label="Jump to section"
          >
            {sections.map(s => (
              <option key={s.id} value={s.id}>
                {lang === 'zh' ? s.title.zh : s.title.en}
              </option>
            ))}
          </select>
          <span className="section-nav-mobile-caret" aria-hidden="true">▾</span>
        </div>

        <span className="section-nav-side right" aria-hidden={!merged}>
          <LangSwitch />
        </span>
      </div>
    </nav>
  );
}
