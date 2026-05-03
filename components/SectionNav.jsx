// SectionNav — sticky secondary nav for menu sections.
// When the museum-top strip scrolls out of view, this nav "merges" with the
// disappeared chrome by revealing a Home link on its left and a Lang switch
// on its right — making the two navs feel like one continuous header.
//
// On narrow viewports the section list collapses to a <select> dropdown.

function SectionNav({ sections, activeId }) {
  const [lang] = useLang();
  const [merged, setMerged] = React.useState(false);
  const navRef = React.useRef(null);

  // Merge only once the nav itself is stuck against the top of the viewport.
  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let raf = 0;
    let last = null;
    const tick = () => {
      const rect = nav.getBoundingClientRect();
      // sticky top is 0; allow 1px tolerance for sub-pixel rounding
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
        {/* Left slot — Home link, fades in when merged */}
        <span className="section-nav-side left" aria-hidden={!merged}>
          <a href="index.html" className="snav-home">
            <span className="snav-home-arrow">←</span>
            <span className="snav-home-label">{t('home')}</span>
          </a>
        </span>

        {/* Center — section links (desktop) + dropdown (mobile) */}
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

        {/* Right slot — Lang switch, fades in when merged */}
        <span className="section-nav-side right" aria-hidden={!merged}>
          <LangSwitch />
        </span>
      </div>
    </nav>
  );
}

window.SectionNav = SectionNav;
