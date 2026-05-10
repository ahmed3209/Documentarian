import { useState } from 'react';

export default function Masthead({ data, onAdminPing }) {
  const m = data.meta;
  const [clicks, setClicks] = useState(0);

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
        <span style={{ fontStyle: 'italic', padding: '0 0.04em' }}> </span>
        {parts[1].toLowerCase()}</>
    );
    return m.name.toLowerCase();
  };

  return (
    <header className="page" style={{ paddingTop: 36, paddingBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {m.logo && <img src={m.logo} alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} />}
          <h1
            onClick={handleTitleClick}
            style={{ fontFamily: 'var(--serif-display)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, cursor: 'default', userSelect: 'none', fontSize: 'clamp(40px, 6vw, 70px)' }}
          >
            {renderName()}
          </h1>
        </div>
        <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--serif-body)', fontSize: 14, color: 'var(--slate)' }}>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div style={{ marginTop: 14, fontSize: 15, color: 'var(--slate)', maxWidth: 720 }}>
        {m.tagline}.
      </div>
    </header>
  );
}
