export default function Footer({ data, onAdminPing }) {
  const m = data.meta;
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '2px solid var(--ink)',
      marginTop: 0,
    }}>
      <div className="page" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          {/* Left — name + tagline */}
          <div>
            <div style={{
              fontFamily: 'var(--serif-display)',
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}>
              {m.name}
            </div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--slate)',
            }}>
              Software Requirements Engineer · Technical Writer
            </div>
          </div>

          {/* Right — nav + copyright */}
          <div style={{ textAlign: 'right' }}>
            <nav style={{
              display: 'flex',
              gap: 20,
              justifyContent: 'flex-end',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--slate)',
              marginBottom: 10,
            }}>
              {['About', 'Work', 'Services', 'Contact'].map(label => (
                <a key={label} href={`#${label.toLowerCase()}`}>
                  {label}
                </a>
              ))}
            </nav>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--slate-2)',
              textTransform: 'uppercase',
            }}>
              © {year} {m.name} ·{' '}
              <span
                style={{ cursor: 'pointer' }}
                onClick={onAdminPing}
                title="Editor's entrance"
              >
                Editor
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
