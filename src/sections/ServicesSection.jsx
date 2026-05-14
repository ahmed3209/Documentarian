import SectionHead from './SectionHead';

export default function ServicesSection({ data }) {
  return (
    <section id="services" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead kicker="Services" title="What I do" />
      <div className="services-grid">
        {data.services.map((s, i) => (
          <div key={s.id} className="service-card">
            <div className="sc-num">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="sc-title">{s.title}</h3>
            <p className="sc-desc">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
