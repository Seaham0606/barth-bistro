// MuseumChrome — top + bottom thin strips around any page (menu uses it).
// Top: ← Home   |   Barth ◆ Bistro   |   EN · 中文
// Bottom: Richmond Hill   |   — Quietly, since 2016 —   |   Hillsview

function MuseumChromeTop() {
  return (
    <header className="museum-top">
      <span className="left">
        <a href="index.html" className="m-home">
          <span className="m-home-arrow">←</span>
          <span className="m-home-label">{t('home')}</span>
        </a>
      </span>
      <span className="center">
        <a href="index.html">
          <span className="word-l">Barth</span>
          <img src="logo.svg" alt="" className="d-logo" />
          <span className="word-r">Bistro</span>
        </a>
      </span>
      <span className="right">
        <LangSwitch />
      </span>
    </header>);

}

function MuseumChromeBottom() {
  return (
    <footer className="museum-bottom">
      <span className="left">Richmond Hill</span>
      <span className="center">— Quietly, since 2016 —</span>
      <span className="right">Hillsview</span>
    </footer>);

}

window.MuseumChromeTop = MuseumChromeTop;
window.MuseumChromeBottom = MuseumChromeBottom;