import React from 'react';
import { useLang } from '../lib/lang';

export function DishCard({ dish, composeMode, selected, onToggle }) {
  const [lang] = useLang();
  if (!dish) return null;

  const tags = [];
  if (dish.isSpicy) tags.push({ en: 'S', zh: '辣', cls: 'hot' });
  if (dish.isVegan) tags.push({ en: 'V', zh: '素', cls: 'plant' });

  const handleClick = () => {
    if (composeMode && onToggle) onToggle(dish);
  };

  const TagPills = tags.length > 0 && (
    <span className="tags">
      {tags.map(tg => (
        <span key={tg.cls} className={`tag-mark ${lang === 'zh' ? 'zh' : 'en'} ${tg.cls}`}>
          {lang === 'zh' ? tg.zh : tg.en}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`dish ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      role={composeMode ? 'button' : undefined}
    >
      {lang === 'zh' ? (
        <>
          <div className="row1">
            <span className="zh-name zh">{dish.dishName.zh}</span>
            {TagPills}
          </div>
          <span className="desc zh">{dish.description.zh}</span>
        </>
      ) : (
        <>
          <div className="row1">
            <span className="en-name only">{dish.dishName.en}</span>
            {TagPills}
          </div>
          <span className="desc">{dish.description.en}</span>
        </>
      )}
      {composeMode && (
        <button
          className="add"
          onClick={(e) => { e.stopPropagation(); onToggle && onToggle(dish); }}
          aria-label={selected ? 'Remove from selection' : 'Add to selection'}
        ></button>
      )}
    </div>
  );
}
