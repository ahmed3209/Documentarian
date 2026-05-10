export default function SectionHead({ kicker, title, dek }) {
  return (
    <div style={{ marginBottom: 28, paddingTop: 6 }}>
      <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 6 }}>
        {kicker.split('·').pop().trim()}
      </div>
      <h2 style={{ fontFamily: 'var(--serif-display)', fontWeight: 400, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.0, letterSpacing: '-0.02em', margin: '4px 0 8px' }}>
        {title}
      </h2>
      {dek && (
        <p style={{ margin: 0, fontSize: 16, color: 'var(--slate)', maxWidth: 640, lineHeight: 1.5 }}>{dek}</p>
      )}
    </div>
  );
}
