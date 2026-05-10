// Procedural document thumbnail — shown when no real thumbnail is uploaded
function SampleThumb({ sample }) {
  if (sample.thumb) {
    return <img src={sample.thumb} alt="" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />;
  }

  const colors = {
    'API Reference': 'var(--vermillion)', 'Developer Guide': 'var(--ochre)',
    'Runbook': 'var(--ink)', 'Conceptual': 'var(--vermillion)',
    'Style Guide': 'var(--ochre)', 'Wiki / IA': 'var(--ink)',
  };
  const accent = colors[sample.kind] || 'var(--vermillion)';

  return (
    <div style={{ width: '100%', aspectRatio: '4/5', background: 'linear-gradient(180deg,#fdfaf2 0%,#f6efde 100%)', padding: '18px 20px 14px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', color: '#7a6f57', textTransform: 'uppercase' }}>
        <span>{sample.kind}</span><span>{sample.year}</span>
      </div>
      <div style={{ fontFamily: 'var(--serif-display)', fontWeight: 800, fontStyle: 'italic', fontSize: 22, lineHeight: 1, color: '#1a1611', marginTop: 6 }}>
        {(sample.title || '').split(' — ')[0]}
      </div>
      <div style={{ height: 2, background: accent, width: '40%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
        {[100, 90, 96, 70, 88, 92, 60].map((w, i) => <div key={i} style={{ height: 4, background: 'rgba(26,22,17,0.18)', width: `${w}%` }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
        {[100, 84, 92, 76].map((w, i) => <div key={i} style={{ height: 4, background: 'rgba(26,22,17,0.14)', width: `${w}%` }} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.16em', color: '#7a6f57', textTransform: 'uppercase' }}>
        <span>{sample.client}</span><span>p. 01</span>
      </div>
      {sample.pdf_url && (
        <div style={{ position: 'absolute', top: 14, right: -8, transform: 'rotate(8deg)', border: `1.5px solid ${accent}`, padding: '3px 8px', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, opacity: 0.85, background: 'rgba(253,250,242,0.6)' }}>PDF</div>
      )}
    </div>
  );
}

export default function SampleCard({ sample, onOpen }) {
  return (
    <article
      onClick={() => onOpen(sample)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
    >
      <SampleThumb sample={sample} />
      <div style={{ paddingTop: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--slate)' }}>
          {sample.kind} · {sample.year}
          {sample.pdf_url && <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--vermillion)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PDF ↗</span>}
        </div>
        <h3 style={{ fontFamily: 'var(--serif-display)', fontWeight: 400, fontSize: 24, lineHeight: 1.1, margin: '6px 0 8px', letterSpacing: '-0.01em' }}>
          {sample.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>{sample.excerpt}</p>
      </div>
    </article>
  );
}
