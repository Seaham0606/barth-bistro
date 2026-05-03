// CourseRibbon — live ribbon at top showing the meal being composed
// Props:
//  - courses: [{ id, label, hanzi, picks: [dish] }]
//  - onRemove: (dish) => void
function CourseRibbon({ courses, onRemove }) {
  const total = courses.reduce((n, c) => n + c.picks.length, 0);
  return (
    <div className="ribbon">
      <div className="ribbon-inner">
        <div className="ribbon-label">
          <span className="zh">您的菜單</span>
          <span className="en">Your meal</span>
        </div>
        <div className="ribbon-courses">
          {courses.map(c => (
            <div key={c.id} className="ribbon-course">
              <div className="ribbon-course-mark">
                <span className="zh">{c.hanzi}</span>
              </div>
              <div className="ribbon-course-picks">
                {c.picks.length === 0 ? (
                  <span className="ribbon-empty">{c.label}</span>
                ) : c.picks.map(p => (
                  <button key={p.tokenName} className="ribbon-pill" onClick={() => onRemove(p)}>
                    <span className="zh">{p.dishName.zh}</span>
                    <span className="x">×</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="ribbon-total">
          <span className="num">{total}</span>
          <span className="word">{total === 1 ? 'dish' : 'dishes'}</span>
        </div>
      </div>
    </div>
  );
}

// CourseCarousel — horizontal scrolling row of dish tiles for one course
// Props:
//  - course: { id, label, hanzi, py, en, suggested, max }
//  - dishes: array of dish objects
//  - selected: Set of tokenNames (only for this course)
//  - onToggle: (dish) => void
function CourseCarousel({ course, dishes, selected, onToggle }) {
  return (
    <section className="course">
      <header className="course-head">
        <div className="course-mark">
          <div className="hanzi">{course.hanzi}</div>
          <div className="ord">{course.ord}</div>
        </div>
        <div className="course-meta">
          <h2>{course.en}</h2>
          <div className="course-sub">
            <span className="zh">{course.zh}</span>
            <span className="dot">·</span>
            <span className="hint">Choose {course.suggested}</span>
          </div>
        </div>
      </header>

      <div className="tiles" role="list">
        {dishes.map(d => {
          const isOn = selected.has(d.tokenName);
          return (
            <button
              key={d.tokenName}
              className={`tile ${isOn ? 'on' : ''}`}
              onClick={() => onToggle(d)}
              role="listitem"
            >
              <div className="tile-head">
                <div className="zh">{d.dishName.zh}</div>
                <div className="mark">{isOn ? '✓' : '+'}</div>
              </div>
              <div className="tile-en">{d.dishName.en}</div>
              <div className="tile-desc">{d.description.en}</div>
              <div className="tile-foot">
                {d.isSpicy && <span className="t hot">辣</span>}
                {d.isVegan && <span className="t">素</span>}
                {!d.isVegan && d.meat && d.meat !== 'other' && (
                  <span className="t meat">{d.meat}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

window.CourseRibbon = CourseRibbon;
window.CourseCarousel = CourseCarousel;
