import { useState, useEffect, useRef } from 'react';

export default function Masthead({ data, onAdminPing, theme, onToggleTheme }) {
  const m = data.meta;
  const [clicks, setClicks] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const progressRef = useRef(null);

  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 56);
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressRef.current.style.width = `${pct}%`;
      }
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle, { passive: true });
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, []);

  // Highlight the nav item for the section currently in view
  useEffect(() => {
    const els = ['about', 'work', 'services', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
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
      background: scrolled ? 'var(--paper-blur)' : 'var(--paper)',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: 'var(--hairline)',
      boxShadow: scrolled ? '0 1px 24px rgba(20,17,13,0.07)' : 'none',
      transition: 'background 0.35s ease, box-shadow 0.35s ease',
    }}>
      {/* scroll progress bar (doubles as the top accent line) */}
      <div className="progress-track">
        <div className="progress-fill" ref={progressRef} />
      </div>

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
                  transition: 'width 0.3s ease, height 0.3s ease',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <nav style={{
              display: 'flex',
              gap: 28,
              fontFamily: 'var(--mono)',
              fontSize: 10.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              {['About', 'Work', 'Services', 'Contact'].map(label => {
                const id = label.toLowerCase();
                const active = activeId === id;
                return (
                  <a
                    key={label}
                    href={`#${id}`}
                    className={active ? 'is-active' : undefined}
                    aria-current={active ? 'true' : undefined}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                /* sun */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                /* moon */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
          </div>
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
