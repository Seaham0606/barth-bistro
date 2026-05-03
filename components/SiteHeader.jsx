// SiteHeader component — true 3-col grid (logo always centered)
function SiteHeader({ transparent = false, current = 'home' }) {
  return (
    <header className={`site-header ${transparent ? 'transparent' : ''}`}>
      <nav className="nav left ui">
        {current === 'menu' ? (
          <a href="index.html">{t('home')}</a>
        ) : (
          <span>家常菜館</span>
        )}
        <span>{t('reservations')}</span>
      </nav>
      <a href="index.html" className="wordmark">
        Barth<span className="d"></span>Bistro
      </a>
      <nav className="nav right ui">
        <LangSwitch />
        <span>{t('findUs')}</span>
      </nav>
    </header>
  );
}

window.SiteHeader = SiteHeader;
