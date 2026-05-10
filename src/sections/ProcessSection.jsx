import SectionHead from './SectionHead';

export default function ProcessSection({ data }) {
  return (
    <section id="process" className="page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <SectionHead kicker="Method" title="How a document gets made" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
        {data.process.map((p, i) => (
          <div key={p.id || i}>
            <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>{p.step}</div>
            <h3 style={{ fontFamily: 'var(--serif-display)', fontWeight: 400, fontSize: 22, margin: '0 0 8px', lineHeight: 1.15 }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
