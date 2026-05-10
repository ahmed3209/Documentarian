import PortraitDisplay from '../components/PortraitDisplay';
import SectionHead from './SectionHead';

function parseWhatIDo(raw) {
  const text = (raw || '').trim();
  const parts = text.split(/\s+[-—–]\s+/);
  const intro = parts.shift();
  const bullets = [], tail = [];
  for (const p of parts) {
    const t = p.trim();
    if (!t) continue;
    const wordCount = t.split(/\s+/).length;
    if (bullets.length > 0 && (wordCount > 14 || /[.!?]\s/.test(t))) tail.push(t);
    else bullets.push(t);
  }
  return { intro, bullets, tail };
}

export default function AboutSection({ data }) {
  const { intro, bullets, tail } = parseWhatIDo(data.whatIDo);

  return (
    <section id="about" className="page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <SectionHead kicker="About" title="About the writer" />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'start' }}>
        <PortraitDisplay portrait={data.portrait} size={260} />
        <div>
          <p style={{ margin: '0 0 24px', fontSize: 19, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            {data.bio}
          </p>
          {data.whatIDo && (
            <div style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, fontWeight: 500, border: '0.8px solid rgb(91,91,91)', borderRadius: 9, padding: '16px 20px' }}>
              {intro && <div style={{ marginBottom: bullets.length ? 10 : 0 }}>{intro}</div>}
              {bullets.length > 0 && (
                <ul style={{ margin: '0 0 0 4px', paddingLeft: 18, listStyle: 'disc' }}>
                  {bullets.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
              {tail.map((t, i) => <div key={i} style={{ marginTop: 10 }}>{t}</div>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
