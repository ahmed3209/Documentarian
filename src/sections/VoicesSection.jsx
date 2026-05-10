import SectionHead from './SectionHead';

export default function VoicesSection({ data }) {
  return (
    <section id="voices" className="page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <SectionHead kicker="Voices" title="What clients say" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36 }}>
        {data.testimonials.map((t, i) => (
          <figure key={t.id || i} style={{ margin: 0 }}>
            <blockquote style={{ margin: 0, fontFamily: 'var(--serif-display)', fontWeight: 400, fontSize: 22, lineHeight: 1.3 }}>
              "{t.quote}"
            </blockquote>
            <figcaption style={{ marginTop: 14, fontSize: 13, color: 'var(--slate)' }}>
              {t.author} — {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
