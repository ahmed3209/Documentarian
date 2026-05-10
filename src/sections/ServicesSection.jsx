import SectionHead from './SectionHead';

export default function ServicesSection({ data }) {
  return (
    <section id="services" className="page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <SectionHead kicker="Services" title="What I do" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, borderTop: '1px solid var(--hair)' }}>
        {data.services.map((s, i) => (
          <div key={s.id} style={{ padding: '24px 24px 24px 0', borderBottom: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--slate)' }}>{String(i + 1).padStart(2, '0')}</div>
            <h3 style={{ fontFamily: 'var(--serif-display)', fontWeight: 400, fontSize: 24, lineHeight: 1.1, margin: 0 }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
