import React from 'react';

export function usePageCurtain() {
  React.useEffect(() => {
    const el = document.getElementById('pageCurtain');
    if (!el) return;
    const t = setTimeout(() => el.classList.add('lifted'), 30);
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || a.target === '_blank') return;
      if (!/\.html?$/i.test(href)) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      el.classList.remove('lifted');
      setTimeout(() => { window.location.href = href; }, 700);
    };
    document.addEventListener('click', onClick);
    return () => { clearTimeout(t); document.removeEventListener('click', onClick); };
  }, []);
}
