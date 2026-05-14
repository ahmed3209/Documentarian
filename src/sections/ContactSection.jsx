import { useState } from 'react';
import { supabase } from '../lib/supabase';
import SectionHead from './SectionHead';

export default function ContactSection({ data }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const c = data.contact;

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.target);
    try {
      await supabase.from('contact_submissions').insert({
        name: fd.get('name'),
        email: fd.get('email'),
        company: fd.get('company'),
        service_interest: fd.get('service'),
        message: fd.get('message'),
      });
      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 5000);
    } catch {
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead
        kicker="Contact"
        title="Get in touch"
        dek="Drop a note. I read everything; I reply within two working days."
      />

      <div className="contact-grid">
        {/* ── Contact form ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="contact-name-email">
            <label className="field"><span>Your name</span><input name="name" required /></label>
            <label className="field"><span>Email address</span><input name="email" type="email" required /></label>
          </div>
          <label className="field"><span>Company / Project</span><input name="company" /></label>
          <label className="field">
            <span>Engagement type</span>
            <select name="service" defaultValue="">
              <option value="">Choose one…</option>
              {data.services.map(s => <option key={s.id}>{s.title}</option>)}
              <option>Something else</option>
            </select>
          </label>
          <label className="field"><span>Tell me about it</span><textarea name="message" rows="5" /></label>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginTop: 8,
          }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--slate)',
              textTransform: 'uppercase',
            }}>
              Or write directly:{' '}
              <a
                href={`mailto:${c.email}`}
                style={{ color: 'var(--vermillion)', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {c.email}
              </a>
            </span>
            <button className="btn btn-primary" type="submit" disabled={sending}>
              {sent ? 'Sent ✓' : sending ? 'Sending…' : 'Send message →'}
            </button>
          </div>
        </form>

        {/* ── Colophon sidebar ── */}
        <aside style={{
          borderLeft: 'var(--hairline)',
          paddingLeft: 40,
        }}>
          <div className="kicker" style={{ marginBottom: 20 }}>The Colophon</div>

          <dl style={{ margin: '0 0 28px' }}>
            {[
              ['Studio', c.location],
              ['Hours', c.hours],
              ['Rate', c.rate],
              ['Next opening', c.nextAvailable],
            ].map(([k, v]) => v ? (
              <div key={k} style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                padding: '10px 0',
                borderBottom: '1px dotted var(--hair)',
                gap: 8,
              }}>
                <dt style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  color: 'var(--slate)',
                  textTransform: 'uppercase',
                  paddingTop: 1,
                }}>
                  {k}
                </dt>
                <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{v}</dd>
              </div>
            ) : null)}
          </dl>

          {c.socials.length > 0 && (
            <div>
              <div className="kicker" style={{ marginBottom: 14 }}>Elsewhere</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {c.socials.map((s, i) => (
                  <li key={s.id || i} style={{
                    padding: '8px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px dotted var(--hair)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      color: 'var(--slate)',
                      textTransform: 'uppercase',
                    }}>
                      {s.label}
                    </span>
                    <a
                      href={s.url}
                      style={{ fontSize: 13, transition: 'color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--vermillion)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                    >
                      {s.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
