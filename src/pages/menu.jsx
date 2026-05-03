import React from 'react';
import ReactDOM from 'react-dom/client';
import { useLang, t, tFn, Legend } from '../lib/lang';
import { MuseumChromeTop, MuseumChromeBottom } from '../components/MuseumChrome';
import { MenuSection } from '../components/MenuSection';
import { SectionNav } from '../components/SectionNav';
import { ChefForm } from '../components/ChefForm';
import { BBButton } from '../components/BBButton';
import { usePageCurtain } from '../hooks/usePageCurtain';
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakButton,
} from '../components/TweaksPanel';
import '../styles.css';

const TODAY_SECTIONS = [
  {
    id: 'appetizers',
    title: { zh: '前菜', py: 'qián cài', en: 'Appetizers' },
    tokens: ['app001','app002','app003','app004','app005','app006','app007','app008'],
  },
  {
    id: 'soups',
    title: { zh: '燉湯', py: 'dùn tāng', en: 'Stews & Soups' },
    tokens: ['sup001','sup002','sup003','sup004','sup005','sup006','sup007','sup008','sup009','sup010','sup011','sup012','sup013','sup014','sup015','sup016','sup017'],
  },
  {
    id: 'wok',
    title: { zh: '炒菜', py: 'chǎo cài', en: 'From the Wok' },
    tokens: ['wok001','wok002','wok003','wok004','wok005','wok006','wok007','wok008','wok009','wok010','wok011','wok012','wok013','wok014','wok016','wok017','wok018','wok019','wok020','wok021','wok022'],
  },
  {
    id: 'steamed',
    title: { zh: '蒸菜', py: 'zhēng cài', en: 'From the Steamer' },
    tokens: ['stm001','stm002','stm003','stm004','stm005','stm006','stm007','stm008','stm009','stm010'],
  },
  {
    id: 'claypot',
    title: { zh: '煲', py: 'bāo', en: 'Clay Pot' },
    tokens: ['stm011','stm012','stm013','wok015'],
  },
  {
    id: 'noodles',
    title: { zh: '麵飯', py: 'miàn fàn', en: 'Noodles & Rice' },
    tokens: ['nrc001','nrc002','nrc003','nrc004','nrc005','nrc006','nrc007','nrc008','nrc009','nrc010'],
  },
];

function todayString() {
  const d = new Date();
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function MenuPage() {
  usePageCurtain();
  const [tw, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "selectedBg": "#f1eee4",
    "markStyle": "square",
    "theme": "light"
  }/*EDITMODE-END*/);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--selected-bg', tw.selectedBg);
  }, [tw.selectedBg]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-mark', tw.markStyle);
  }, [tw.markStyle]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tw.theme || 'light');
  }, [tw.theme]);

  const [lang] = useLang();
  const [dishesIndex, setDishesIndex] = React.useState(null);
  const [composeMode, setComposeMode] = React.useState(false);
  const [selected, setSelected] = React.useState(new Set());
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelStep, setPanelStep] = React.useState('review');
  const [submitted, setSubmitted] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState(TODAY_SECTIONS[0].id);

  React.useEffect(() => {
    const onScroll = () => {
      const offset = 140;
      let current = TODAY_SECTIONS[0].id;
      for (const sec of TODAY_SECTIONS) {
        const el = document.getElementById('section-' + sec.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = sec.id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dishesIndex]);

  React.useEffect(() => {
    fetch('data/dishes.json')
      .then(r => r.json())
      .then(arr => {
        const idx = {};
        arr.forEach(d => { idx[d.tokenName] = d; });
        setDishesIndex(idx);
      })
      .catch(err => console.error('Failed to load dishes', err));
  }, []);

  const toggle = (dish) => {
    setSubmitted(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(dish.tokenName)) next.delete(dish.tokenName);
      else next.add(dish.tokenName);
      return next;
    });
  };

  React.useEffect(() => {
    const tray = document.querySelector('.tray');
    const footer = document.querySelector('.museum-bottom');
    if (!tray || !footer) return;
    const margin = 24;
    const tick = () => {
      const fr = footer.getBoundingClientRect();
      const vh = window.innerHeight;
      const overlap = Math.max(0, vh - fr.top);
      tray.style.setProperty('--tray-lift', overlap > 0 ? `${-(overlap + margin - 24)}px` : '0px');
    };
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const enableCompose = () => { setComposeMode(true); };
  const disableCompose = () => {
    setComposeMode(false);
    setSelected(new Set());
    setPanelOpen(false);
    setPanelStep('review');
  };

  const selectedDishes = dishesIndex
    ? Array.from(selected).map(tok => dishesIndex[tok]).filter(Boolean)
    : [];

  const submit = () => {
    const code = 'BB-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4);
    setSubmitted(code);
  };

  return (
    <>
      <MuseumChromeTop />

      <section className="menu-hero">
        <div className="reveal d1 eyebrow ui">A private kitchen by the Observatory</div>
        <div className="reveal d2 rule rule-top"></div>
        <div className="reveal d2 hanzi-top zh">今 日 菜 單</div>
        <h1 className="reveal d3">{t('todaysMenu')}</h1>
        <div className="reveal d4 hanzi-bot zh">巴 塞 餐 廳</div>
        <div className="reveal d5 rule"></div>
        <div className="reveal d6 date">{todayString()}</div>
      </section>

      <SectionNav sections={TODAY_SECTIONS} activeId={activeSection} />

      <div className="menu">
        {!dishesIndex ? (
          <div className="empty-state"><p>{t('setting')}</p></div>
        ) : (
          TODAY_SECTIONS.map(sec => (
            <MenuSection
              key={sec.id}
              id={sec.id}
              title={sec.title}
              tokens={sec.tokens}
              dishesIndex={dishesIndex}
              composeMode={composeMode}
              selectedSet={selected}
              onToggle={toggle}
            />
          ))
        )}
      </div>

      <MuseumChromeBottom />

      <div className="tray">
        {!composeMode ? (
          <button className="tray-fab empty" onClick={enableCompose}>
            <span>{t('composeOwn')}</span>
            <span className="count" aria-hidden="true">＋</span>
          </button>
        ) : selected.size === 0 ? (
          <button className="tray-fab empty" onClick={disableCompose}>
            <span>{t('exitCompose')}</span>
            <span className="count" aria-hidden="true">×</span>
          </button>
        ) : (
          <button
            className="tray-fab"
            onClick={() => { setPanelStep('review'); setPanelOpen(true); }}
          >
            <span>
              {selected.size === 1 ? t('reviewOne') : tFn('reviewN', selected.size)}
            </span>
            <span className="count">{selected.size}</span>
          </button>
        )}
      </div>

      <div className={`panel ${panelOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('panel')) setPanelOpen(false); }}>
        <div className="panel-card">
          {submitted ? (
            <>
              <div className="panel-head">
                <div>
                  <div className="title">{t('receivedTitle')}</div>
                  <div className="sub">{t('receivedSub')}</div>
                </div>
                <button className="close" onClick={() => setPanelOpen(false)}>×</button>
              </div>
              <div className="panel-body">
                <div className="empty-state" style={{ padding: '60px 20px' }}>
                  <div className="glyph">◇</div>
                  <p>{t('receivedBody')}</p>
                  <p style={{ marginTop: 14, fontFamily: 'Inter,sans-serif', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{t('reference')} · {submitted}</p>
                </div>
              </div>
            </>
          ) : panelStep === 'form' ? (
            <>
              <div className="panel-head">
                <div>
                  <div className="title">{t('noteTitle')}</div>
                  <div className="sub">{t('noteSub')}</div>
                </div>
                <button className="close" onClick={() => setPanelOpen(false)}>×</button>
              </div>
              <div className="panel-body">
                <ChefForm
                  dishCount={selectedDishes.length}
                  onBack={() => setPanelStep('review')}
                  onSubmit={submit}
                />
              </div>
            </>
          ) : (
            <>
              <div className="panel-head">
                <div>
                  <div className="title">{t('yourSelection')}</div>
                  <div className="sub">{selectedDishes.length === 0 ? t('noDishes') : selectedDishes.length === 1 ? t('oneDish') : tFn('nDishes', selectedDishes.length)}</div>
                </div>
                <button className="close" onClick={() => setPanelOpen(false)}>×</button>
              </div>
              <div className="panel-body">
                {selectedDishes.length === 0 ? (
                  <div className="empty-state">
                    <div className="glyph">◇</div>
                    <p>{t('tapToBegin')}</p>
                  </div>
                ) : (
                  selectedDishes.map(d => (
                    <div key={d.tokenName} className="tray-item">
                      <div>
                        {lang === 'zh'
                          ? <div className="zh">{d.dishName.zh}</div>
                          : <span className="en">{d.dishName.en}</span>}
                      </div>
                      <button className="remove" onClick={() => toggle(d)}>{t('remove')}</button>
                    </div>
                  ))
                )}
              </div>
              {selectedDishes.length > 0 && (
                <div className="panel-foot">
                  <BBButton onClick={() => setPanelStep('form')} showArrow={true}>
                    {t('continueLabel')}
                  </BBButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={tw.theme}
          options={['light', 'dark']}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakSection label="Compose mode" />
        <TweakColor
          label="Selected dish background"
          value={tw.selectedBg}
          onChange={(v) => setTweak('selectedBg', v)}
        />
        <TweakRadio
          label="Selection mark"
          value={tw.markStyle}
          options={['circle', 'square', 'hairline', 'bracket']}
          onChange={(v) => setTweak('markStyle', v)}
        />
        <TweakButton
          label="Reset to default"
          onClick={() => { setTweak('selectedBg', '#f1eee4'); setTweak('markStyle', 'square'); setTweak('theme', 'light'); }}
        />
      </TweaksPanel>

    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MenuPage />);
