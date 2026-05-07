import React from 'react';
import ReactDOM from 'react-dom/client';
import { usePageCurtain } from '../hooks/usePageCurtain';
import '../styles.css';
import '../home.css';

function HomePage() {
  usePageCurtain();

  const enter = (href) => (e) => {
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 520);
  };

  return (
    <main className="museum">
      <header className="museum-top">
        <span className="left">Est. 二〇一六</span>
        <span className="center">
          <span className="word-l">Barth</span>
          <img src="logo.svg" alt="" className="d-logo" />
          <span className="word-r">Bistro</span>
        </span>
        <span className="right">Catalogue №&nbsp;167</span>
      </header>

      <section className="placard">
        <span className="corner-tl"></span>
        <span className="corner-tr"></span>
        <article className="card">
          <span className="eyebrow">A private kitchen by the Observatory</span>
          <span className="rule rule-top"></span>
          <span className="hanzi-top zh">家 常 菜 館</span>
          <h1 className="wordmark-xl" style={{ margin: '40px 0px 24px' }}>
            <span>Barth</span>
            <img src="logo.svg" alt="" className="d-logo" />
            <span>Bistro</span>
          </h1>
          <span className="hanzi-bot zh">巴 塞 餐 廳</span>
          <span className="rule"></span>
          <span className="value" style={{ margin: '24px 0px 0px', display: 'block', textAlign: 'center', fontFamily: "'Cormorant Garamond', 'KuMincho', 'Noto Serif SC', serif", fontSize: '15px', fontStyle: 'italic', color: 'var(--ink)' }}>By invitation only</span>
          <a href="menu.html" className="enter" onClick={enter('menu.html')}>
            <span>View today's menu</span>
            <span className="arrow"></span>
          </a>
        </article>
      </section>

      <footer className="museum-bottom">
        <span className="left">Richmond Hill</span>
        <span className="center">— Quietly, since 2016 —</span>
        <span className="right">Hillsview</span>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HomePage />);
