// TastingCard — split-pane two-column "chef's tasting card" view
// Props:
//  - dishes: array of dish objects (full menu, flat)
//  - activeId: tokenName of the focused dish
//  - onFocus: (dish) => void
//  - selected: Set of tokenNames
//  - onToggle: (dish) => void
function TastingCard({ groups, dishesIndex, activeId, onFocus, selected, onToggle }) {
  const active = activeId && dishesIndex ? dishesIndex[activeId] : null;
  return (
    <div className="tasting">
      <aside className="tasting-list">
        {groups.map(g => (
          <div key={g.id} className="tasting-group">
            <div className="tasting-group-head">
              <span className="zh">{g.title.zh}</span>
              <span className="en">{g.title.en}</span>
            </div>
            <ul>
              {g.tokens.map(t => {
                const d = dishesIndex && dishesIndex[t];
                if (!d) return null;
                const isActive = activeId === t;
                const isOn = selected.has(t);
                return (
                  <li
                    key={t}
                    className={`tasting-row ${isActive ? 'active' : ''} ${isOn ? 'picked' : ''}`}
                    onMouseEnter={() => onFocus(d)}
                    onClick={() => onFocus(d)}
                  >
                    <span className="num">{isOn ? '◆' : '◇'}</span>
                    <span className="zh">{d.dishName.zh}</span>
                    <span className="en">{d.dishName.en}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      <article className="tasting-detail">
        {active ? (
          <div key={active.tokenName} className="tasting-card-inner">
            <div className="image-frame">
              <div className="image-glyph zh">{active.dishName.zh.slice(0,1)}</div>
              <div className="image-caption ui">illustration to follow</div>
            </div>
            <div className="tasting-meta">
              <div className="hanzi-large zh">{active.dishName.zh}</div>
              <h2 className="en-large">{active.dishName.en}</h2>
              <p className="desc">{active.description.en}</p>
              <div className="tags-row">
                {active.isSpicy && <span className="t hot">辣 spicy</span>}
                {active.isVegan && <span className="t">素 plant-based</span>}
                {!active.isVegan && active.meat && active.meat !== 'other' && (
                  <span className="t meat">{active.meat}</span>
                )}
              </div>
              <button
                className={`add-btn ${selected.has(active.tokenName) ? 'on' : ''}`}
                onClick={() => onToggle(active)}
              >
                <span>{selected.has(active.tokenName) ? 'Remove from selection' : 'Add to selection'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="tasting-empty">
            <div className="glyph">◇</div>
            <p>Hover or tap a dish to read more.</p>
          </div>
        )}
      </article>
    </div>
  );
}

window.TastingCard = TastingCard;
