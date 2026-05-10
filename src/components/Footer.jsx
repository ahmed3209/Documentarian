export default function Footer({ data, onAdminPing }) {
  const m = data.meta;
  return (
    <footer className="page" style={{ paddingTop: 36, paddingBottom: 36, borderTop: '1px solid var(--hair)', marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--slate)' }}>
        <span>© {new Date().getFullYear()} {m.name}</span>
        <span style={{ cursor: 'pointer' }} onClick={onAdminPing} title="Editor's entrance">Editor</span>
      </div>
    </footer>
  );
}
