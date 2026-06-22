import SectionHead from './SectionHead';

export default function VoicesSection({ data }) {
  return (
    <section id="voices" style={{
      paddingTop: 80,
      paddingBottom: 80,
      background: 'var(--paper-2)',
      borderTop: 'var(--hairline)',
      borderBottom: 'var(--hairline)',
    }}>
      <div className="page">
        <SectionHead kicker="Voices" title="What clients say" />
        <div className="voices-grid">
          {data.testimonials.map((t, i) => (
            <figure key={t.id || i} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{ margin: 0 }}>
              {/* Decorative large opening quote */}
              <div style={{
                fontFamily: 'var(--serif-display)',
                fontSize: 88,
                lineHeight: 0.65,
                color: 'var(--vermillion)',
                marginBottom: 10,
                userSelect: 'none',
                opacity: 0.85,
              }}>
                &ldquo;
              </div>

              <blockquote style={{
                margin: 0,
                fontFamily: 'var(--serif-display)',
                fontWeight: 400,
                fontSize: 23,
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
              }}>
                {t.quote}
              </blockquote>

              <figcaption style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: 'var(--hairline)',
              }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  letterSpacing: '-0.005em',
                }}>
                  {t.author}
                </div>
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--slate)',
                  marginTop: 4,
                }}>
                  {t.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
