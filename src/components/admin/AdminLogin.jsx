import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin({ session, onAuth, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, skip straight through
  useEffect(() => {
    if (session) onAuth();
  }, [session, onAuth]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); }
    else onAuth();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(20,17,13,0.92)', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={submit} style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '36px 40px', width: 'min(440px, 92vw)', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>
          Editor's Entrance · Restricted
        </div>
        <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 36, margin: '8px 0 6px' }}>
          Press credentials
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--slate)' }}>
          Sign in with your Supabase admin account.
        </p>
        <label className="field"><span>Email</span>
          <input type="email" autoFocus value={email} onChange={e => { setEmail(e.target.value); setError(''); }} required />
        </label>
        <label className="field"><span>Password</span>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required />
        </label>
        {error && (
          <div className="mono" style={{ fontSize: 10, color: 'var(--vermillion)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button type="button" className="btn" onClick={onClose}>← Back to site</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Enter Newsroom →'}
          </button>
        </div>
      </form>
    </div>
  );
}
