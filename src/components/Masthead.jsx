import { useState, useEffect } from 'react';

export default function Masthead({ data, onAdminPing }) {
  const m = data.meta;
  const [clicks, setClicks] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  function handleTitleClick() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) { setClicks(0); onAdminPing?.(); }
  }

  const parts = m.name.split(' ');
  const renderName = () => {
    if (parts.length === 3) return (
      <>{parts[0].toLowerCase()}
        <span style={{ fontStyle: 'italic', padding: '0 0.04em' }}>{parts[1].toLowerCase().replace(/\.$/, '')}</span>
        {parts[2].toLowerCase()}</>
    );
    if (parts.length === 2) return (
      <>{parts[0].toLowerCase()}
        <span style={{ fontStyle: 'italic' }}> </span>
        {parts[1].toLowerCase()}</>
    );
    return m.name.toLowerCase();
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(242,235,221,0.93)' : 'var(--paper)',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: 'var(--hairline)',
      boxShadow: scrolled ? '0 1px 24px rgba(20,17,13,0.07)' : 'none',
      transition: 'background 0.35s ease, box-shadow 0.35s ease',
    }}>
      {/* vermillion accent line at very top */}
      <div style={{ height: 3, background: 'var(--vermillion)', width: '100%' }} />

      <div className="page" style={{
        paddingTop: scrolled ? 10 : 26,
        paddingBottom: scrolled ? 10 : 20,
        transition: 'padding 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Logo + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {m.logo && (
              <img
                src={m.logo}
                alt=""
                style={{
                  width: scrolled ? 32 : 44,
                  height: scrolled ? 32 : 44,
                  objectFit: 'contain',
                  transition: 'all 0.3s ease',
                }}
              />
            )}
            <h1
              onClick={handleTitleClick}
              style={{
                fontFamily: 'var(--serif-display)',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                margin: 0,
                cursor: 'default',
                userSelect: 'none',
                fontSize: scrolled
                  ? 'clamp(26px, 3.5vw, 34px)'
                  : 'clamp(38px, 5vw, 60px)',
                transition: 'font-size 0.3s ease',
              }}
            >
              {renderName()}
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{
            display: 'flex',
            gap: 28,
            fontFamily: 'var(--mono)',
            fontSize: 10.5,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {['About', 'Work', 'Services', 'Contact'].map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                style={{ color: 'var(--slate)', transition: 'color 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--vermillion)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate)'; }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tagline — hidden when scrolled */}
        {!scrolled && m.tagline && (
          <div style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: 'var(--hairline)',
            fontSize: 15,
            color: 'var(--slate)',
            maxWidth: 680,
            lineHeight: 1.5,
          }}>
            {m.tagline}.
          </div>
        )}
      </div>
    </header>
  );
}
