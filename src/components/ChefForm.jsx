import React from 'react';
import { BBButton } from './BBButton';

export function ChefForm({ onBack, onSubmit, dishCount }) {
  const [form, setForm] = React.useState({
    name: '',
    allergies: '',
    email: '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const canSubmit = form.name.trim() && form.email.trim();

  return (
    <div className="chef-form">
      <button type="button" className="form-back" onClick={onBack}>
        ← Back to selection
      </button>

      <div className="form-section">
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

        <div className="field">
          <label>Dietary needs <span className="optional">— optional</span></label>
          <input type="text" value={form.allergies} onChange={e => set('allergies', e.target.value)}
            placeholder="Vegetarian, gluten-free, peanuts, shellfish, etc." />
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
            : 'Please share your name and email.'}
        </div>
      </div>
    </div>
  );
}
