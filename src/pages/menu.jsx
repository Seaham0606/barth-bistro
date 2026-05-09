import React from 'react';
import ReactDOM from 'react-dom/client';
import emailjs from '@emailjs/browser';
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
  { id: 'coldStarters', category: 'coldStarters', title: { zh: '涼菜', py: 'liáng cài', en: 'Cold Starters' } },
  { id: 'wok',          category: 'wok',          title: { zh: '熱炒', py: 'rè chǎo',   en: 'Wok & Hot Dishes' } },
  { id: 'clayPot',      category: 'clayPot',      title: { zh: '煲仔', py: 'bāo zǎi',   en: 'Clay Pot' } },
  { id: 'steamed',      category: 'steamed',      title: { zh: '蒸菜', py: 'zhēng cài', en: 'Steamed' } },
  { id: 'soup',         category: 'soup',         title: { zh: '湯品', py: 'tāng pǐn',  en: 'Soups' } },
  { id: 'riceNoodles',  category: 'riceNoodles',  title: { zh: '主食', py: 'zhǔ shí',   en: 'Rice & Noodles' } },
  { id: 'snacks',       category: 'snacks',       title: { zh: '小食', py: 'xiǎo shí',  en: 'Snacks' } },
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
  const [dishesByCategory, setDishesByCategory] = React.useState(null);
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
  }, [dishesByCategory]);

  React.useEffect(() => {
    fetch('data/dishes.json')
      .then(r => r.json())
      .then(arr => {
        const byCategory = {};
        arr.forEach(d => {
          if (!byCategory[d.category]) byCategory[d.category] = [];
          byCategory[d.category].push(d);
        });
        setDishesByCategory(byCategory);
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

  const dishesIndex = React.useMemo(() => {
    if (!dishesByCategory) return null;
    const idx = {};
    Object.values(dishesByCategory).flat().forEach(d => { idx[d.tokenName] = d; });
    return idx;
  }, [dishesByCategory]);

  const selectedDishes = dishesIndex
    ? Array.from(selected).map(tok => dishesIndex[tok]).filter(Boolean)
    : [];

  const submit = (form) => {
    const code = 'BB-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const dishes = selectedDishes.map(d => `· ${d.dishName?.zh || d.tokenName}`).join('\n');
    const allIngredients = selectedDishes.flatMap(d => d.ingredients || []);
    const shopping_list = [...new Set(allIngredients)].map(i => `· ${i}`).join('\n');

    emailjs.send(
      'service_crbnuwj',
      'template_vugqzr8',
      {
        name: form.name,
        email: form.email,
        allergies: form.allergies || '無',
        dishes,
        shopping_list,
        reference: code,
      },
      'EFctIbpL81CJtoWuJ',
    ).catch(err => console.error('EmailJS error:', err));

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
        {!dishesByCategory ? (
          <div className="empty-state"><p>{t('setting')}</p></div>
        ) : (
          TODAY_SECTIONS.map(sec => (
            <MenuSection
              key={sec.id}
              id={sec.id}
              title={sec.title}
              dishes={dishesByCategory[sec.category] || []}
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
                <img src="logo.svg" alt="" className="d-logo" style={{ width: 32, height: 32, marginBottom: 16 }} />
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
