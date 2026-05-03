import React from 'react';
import { useLang } from '../lib/lang';
import { DishCard } from './DishCard';

export function MenuSection({ id, title, tokens, dishesIndex, composeMode, selectedSet, onToggle }) {
  const [lang] = useLang();
  const dishes = tokens.map(t => dishesIndex[t]).filter(Boolean);
  const sid = id || (title.en || '').toLowerCase().replace(/\s+/g, '-');
  return (
    <section id={`section-${sid}`} className={`menu-section ${composeMode ? 'compose-mode' : ''}`}>
      <div className="section-head">
        <div className="chip">
          {lang === 'zh' ? (
            <>
              <div className="zh">{title.zh}</div>
              <div className="py">{title.py}</div>
            </>
          ) : (
            <>
              <div className="py">{title.py}</div>
              <div className="en larger">{title.en}</div>
            </>
          )}
        </div>
      </div>
      <div className="dishes">
        {dishes.map(d => (
          <DishCard
            key={d.tokenName}
            dish={d}
            composeMode={composeMode}
            selected={selectedSet ? selectedSet.has(d.tokenName) : false}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
