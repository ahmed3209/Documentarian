import SectionHead from './SectionHead';

export default function ProcessSection({ data }) {
  return (
    <section id="process" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead kicker="Method" title="How a document gets made" />
      <div className="process-grid">
        {data.process.map((p, i) => (
          <div key={p.id || i} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
            paddingRight: 40,
            paddingBottom: 48,
            borderRight: 'var(--hairline)',
            marginRight: -1,
          }}>
            {/* Large ghost number */}
            <div className="process-num">
              {String(i + 1).padStart(2, '0')}
            </div>

            <h3 style={{
              fontFamily: 'var(--serif-display)',
              fontWeight: 400,
              fontSize: 26,
              margin: '0 0 12px',
              lineHeight: 1.1,
              letterSpacing: '-0.015em',
              color: 'var(--ink)',
            }}>
              {p.title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: 'var(--ink-2)',
            }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
