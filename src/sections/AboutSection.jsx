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
    <section id="about" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead kicker="About" title="About the writer" />

      <div className="about-grid">
        <div className="reveal reveal-delay-1">
          <PortraitDisplay portrait={data.portrait} size={280} />
        </div>

        <div className="reveal reveal-delay-2">
          <p style={{
            margin: '0 0 32px',
            fontSize: 20,
            lineHeight: 1.6,
            color: 'var(--ink-2)',
            fontWeight: 400,
          }}>
            {data.bio}
          </p>

          {data.whatIDo && (
            <div style={{
              color: 'var(--ink-2)',
              fontSize: 15,
              lineHeight: 1.7,
              background: 'var(--paper-2)',
              padding: '22px 26px',
              borderLeft: '3px solid var(--vermillion)',
            }}>
              {intro && (
                <div style={{ marginBottom: bullets.length ? 12 : 0, fontWeight: 500, color: 'var(--ink)' }}>
                  {intro}
                </div>
              )}
              {bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'disc' }}>
                  {bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: 5 }}>{b}</li>
                  ))}
                </ul>
              )}
              {tail.map((t, i) => (
                <div key={i} style={{ marginTop: 10 }}>{t}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
