import React from 'react';
import { BBButton } from './BBButton';

export function ChefForm({ onBack, onSubmit, dishCount }) {
  const [form, setForm] = React.useState({
    name: '',
    date: '',
    seating: '',
    guests: 2,
    occasion: '',
    diets: [],
    allergies: '',
    note: '',
    email: '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleDiet = (d) => setForm(prev => ({
    ...prev,
    diets: prev.diets.includes(d) ? prev.diets.filter(x => x !== d) : [...prev.diets, d],
  }));

  const SEATINGS = ['6:00 pm', '8:30 pm', 'No preference'];
  const OCCASIONS = ['Dinner', 'Birthday', 'Anniversary', 'Friends', 'Just because'];
  const DIETS = ['Vegetarian', 'Pescatarian', 'Gluten-free', 'Dairy-free', 'Pork-free', 'Alcohol-free'];

  const canSubmit = form.name.trim() && form.date && form.email.trim();

  return (
    <div className="chef-form">
      <button type="button" className="form-back" onClick={onBack}>
        ← Back to selection
      </button>

      <div className="form-section">
        <div className="form-section-label">About your evening</div>

        <div className="field">
          <label>Your name</label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="So we know who's joining us" />
        </div>

        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="Where we'll send the confirmation" />
        </div>

        <div className="seatrow">
          <div className="field">
            <label>Preferred date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            <div className="hint">Thursday through Sunday</div>
          </div>
          <div className="field">
            <label>Guests</label>
            <div className="stepper">
              <button type="button" onClick={() => set('guests', Math.max(1, form.guests - 1))}>−</button>
              <span className="stepper-val">{form.guests}</span>
              <button type="button" onClick={() => set('guests', Math.min(10, form.guests + 1))}>+</button>
            </div>
            <div className="hint">Ten covers maximum</div>
          </div>
        </div>

        <div className="field">
          <label>Seating</label>
          <div className="chip-row">
            {SEATINGS.map(s => (
              <button key={s} type="button"
                className={`chip-sel ${form.seating === s ? 'active' : ''}`}
                onClick={() => set('seating', form.seating === s ? '' : s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Occasion <span className="optional">— optional</span></label>
          <div className="chip-row">
            {OCCASIONS.map(o => (
              <button key={o} type="button"
                className={`chip-sel ${form.occasion === o ? 'active' : ''}`}
                onClick={() => set('occasion', form.occasion === o ? '' : o)}>{o}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-label">So we cook with care</div>

        <div className="field">
          <label>Dietary considerations <span className="optional">— optional</span></label>
          <div className="chip-row">
            {DIETS.map(d => (
              <button key={d} type="button"
                className={`chip-sel ${form.diets.includes(d) ? 'active' : ''}`}
                onClick={() => toggleDiet(d)}>{d}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Allergies &amp; sensitivities <span className="optional">— optional</span></label>
          <input type="text" value={form.allergies} onChange={e => set('allergies', e.target.value)}
            placeholder="Anything we should know — peanuts, shellfish, etc." />
        </div>

        <div className="field">
          <label>A note for the chef <span className="optional">— optional</span></label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Cravings, things to avoid, how you'd like to be fed"></textarea>
        </div>
      </div>

      <div className="panel-foot-inner">
        <BBButton onClick={() => canSubmit && onSubmit(form)} showArrow={false}
          className={canSubmit ? '' : 'disabled'}>
          Send {dishCount} {dishCount === 1 ? 'dish' : 'dishes'} to the chef
        </BBButton>
        <div className="foot-note">
          {canSubmit
            ? 'The chef will reply within the hour to confirm your evening and suggest pairings.'
            : 'Please share your name, email, and a preferred date.'}
        </div>
      </div>
    </div>
  );
}
