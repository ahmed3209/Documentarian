// Procedural document thumbnail — shown when no real thumbnail is uploaded
function SampleThumb({ sample }) {
  if (sample.thumb) {
    return (
      <img
        src={sample.thumb}
        alt=""
        style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
      />
    );
  }

  const colors = {
    'API Reference': 'var(--vermillion)',
    'Developer Guide': 'var(--ochre)',
    'Runbook': 'var(--ink)',
    'Conceptual': 'var(--vermillion)',
    'Style Guide': 'var(--ochre)',
    'Wiki / IA': 'var(--ink)',
  };
  const accent = colors[sample.kind] || 'var(--vermillion)';

  return (
    <div style={{
      width: '100%',
      aspectRatio: '4/5',
      background: 'linear-gradient(175deg,#fdfaf2 0%,#f2eadb 100%)',
      padding: '18px 20px 14px',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid var(--hair)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 8,
        letterSpacing: '0.18em',
        color: '#7a6f57',
        textTransform: 'uppercase',
      }}>
        <span>{sample.kind}</span>
        <span>{sample.year}</span>
      </div>

      <div style={{
        fontFamily: 'var(--serif-display)',
        fontWeight: 400,
        fontStyle: 'italic',
        fontSize: 22,
        lineHeight: 1.05,
        color: '#1a1611',
        marginTop: 4,
      }}>
        {(sample.title || '').split(' — ')[0]}
      </div>

      <div style={{ height: 2, background: accent, width: '38%' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
        {[100, 90, 96, 70, 88, 92, 60].map((w, i) => (
          <div key={i} style={{ height: 3.5, background: 'rgba(26,22,17,0.14)', width: `${w}%`, borderRadius: 1 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
        {[100, 84, 92, 76].map((w, i) => (
          <div key={i} style={{ height: 3.5, background: 'rgba(26,22,17,0.09)', width: `${w}%`, borderRadius: 1 }} />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 7,
        letterSpacing: '0.16em',
        color: '#7a6f57',
        textTransform: 'uppercase',
      }}>
        <span>{sample.client}</span>
        <span>p. 01</span>
      </div>

      {sample.pdf_url && (
        <div style={{
          position: 'absolute',
          top: 14,
          right: -8,
          transform: 'rotate(8deg)',
          border: `1.5px solid ${accent}`,
          padding: '3px 8px',
          fontFamily: 'var(--mono)',
          fontSize: 8,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
          opacity: 0.85,
          background: 'rgba(253,250,242,0.75)',
        }}>
          PDF
        </div>
      )}
    </div>
  );
}

export default function SampleCard({ sample, onOpen }) {
  return (
    <article className="sample-card" onClick={() => onOpen(sample)}>
      <div className="sc-thumb-wrap">
        <SampleThumb sample={sample} />
      </div>

      <div style={{ paddingTop: 16 }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--slate)',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span>{sample.kind}</span>
          <span style={{ color: 'var(--hair)', userSelect: 'none' }}>·</span>
          <span>{sample.year}</span>
          {sample.pdf_url && (
            <span style={{ color: 'var(--vermillion)', marginLeft: 4 }}>PDF ↗</span>
          )}
        </div>

        <h3 style={{
          fontFamily: 'var(--serif-display)',
          fontWeight: 400,
          fontSize: 25,
          lineHeight: 1.08,
          margin: '0 0 10px',
          letterSpacing: '-0.015em',
          color: 'var(--ink)',
        }}>
          {sample.title}
        </h3>

        <p style={{
          margin: 0,
          fontSize: 14.5,
          lineHeight: 1.6,
          color: 'var(--ink-2)',
        }}>
          {sample.excerpt}
        </p>
      </div>
    </article>
  );
}
