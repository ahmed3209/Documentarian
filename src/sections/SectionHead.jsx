export default function SectionHead({ kicker, title, dek }) {
  const label = kicker.split('·').pop().trim();
  return (
    <div className="reveal" style={{ marginBottom: 52 }}>
      {/* Bold top rule + kicker */}
      <div style={{
        borderTop: '2px solid var(--ink)',
        paddingTop: 16,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span className="kicker">{label}</span>
      </div>

      {/* Section title */}
      <h2 style={{
        fontFamily: 'var(--serif-display)',
        fontWeight: 400,
        fontSize: 'clamp(42px, 5.8vw, 76px)',
        lineHeight: 0.96,
        letterSpacing: '-0.028em',
        margin: '0 0 20px',
        color: 'var(--ink)',
      }}>
        {title}
      </h2>

      {dek && (
        <p style={{
          margin: 0,
          fontSize: 17,
          color: 'var(--slate)',
          maxWidth: 560,
          lineHeight: 1.6,
          fontWeight: 400,
        }}>
          {dek}
        </p>
      )}
    </div>
  );
}
