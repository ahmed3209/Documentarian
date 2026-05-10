// Sample work cards + PDF preview modal

const { useState: useS_samp, useEffect: useE_samp, useRef: useR_samp } = React;

// Stylized PDF page renderer — mocks document pages from structured data
function PDFPage({ page, pageNum, total, docTitle }) {
  const baseStyle = {
    width: "100%",
    aspectRatio: "8.5 / 11",
    background: "#fdfaf2",
    color: "#1a1611",
    boxShadow: "0 2px 0 rgba(0,0,0,0.06), 0 24px 60px -20px rgba(0,0,0,0.45)",
    padding: "56px 56px 44px",
    position: "relative",
    fontFamily: "var(--serif-body)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };
  const folio = (
    <div style={{ position: "absolute", left: 56, right: 56, bottom: 22, display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", color: "#7a6f57", textTransform: "uppercase" }}>
      <span>{docTitle}</span>
      <span>{pageNum} / {total}</span>
    </div>
  );

  if (page.type === "title") {
    return (
      <div style={baseStyle}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>{page.date}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontStyle: "italic", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}>{page.title}</div>
          <div style={{ borderTop: "1px solid #1a1611", margin: "20px 0", width: "60%" }}/>
          <div style={{ fontSize: 18, fontStyle: "italic" }}>{page.subtitle}</div>
        </div>
        {page.author && <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a6f57" }}>{page.author}</div>}
        {folio}
      </div>
    );
  }

  if (page.type === "toc") {
    return (
      <div style={baseStyle}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>{docTitle} · Contents</div>
        <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 44, margin: "16px 0 28px" }}>{page.title}</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {page.entries.map((e, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", alignItems: "baseline", padding: "10px 0", borderBottom: "1px dotted #c8b78c", gap: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#7a6f57" }}>{e[0]}</span>
              <span style={{ fontSize: 17 }}>{e[1]}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#7a6f57" }}>{e[2]}</span>
            </li>
          ))}
        </ul>
        {folio}
      </div>
    );
  }

  if (page.type === "spec") {
    return (
      <div style={baseStyle}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>API Reference</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 18, marginTop: 18, padding: "12px 14px", background: "#efe4c5", borderLeft: "3px solid #b8341c" }}>{page.endpoint}</div>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 18 }}>{page.description}</p>
        <h3 style={{ fontFamily: "var(--mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#7a6f57", marginTop: 18, marginBottom: 8 }}>Parameters</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1611" }}>
              {["Field","Type","","Description"].map((h,i) => (
                <th key={i} style={{ textAlign: "left", padding: "6px 8px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.fields.map((f, i) => (
              <tr key={i} style={{ borderBottom: "1px dotted #c8b78c" }}>
                <td style={{ padding: "8px", fontFamily: "var(--mono)", fontSize: 12 }}>{f[0]}</td>
                <td style={{ padding: "8px", fontFamily: "var(--mono)", fontSize: 12, color: "#7a6f57" }}>{f[1]}</td>
                <td style={{ padding: "8px", fontFamily: "var(--mono)", fontSize: 10, color: f[2] === "required" ? "#b8341c" : "#7a6f57", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f[2]}</td>
                <td style={{ padding: "8px" }}>{f[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {folio}
      </div>
    );
  }

  if (page.type === "code") {
    return (
      <div style={baseStyle}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>Listing · {page.lang}</div>
        <pre style={{ marginTop: 18, padding: 24, background: "#1a1611", color: "#f2ebdd", fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", flex: 1 }}>
          {page.lines.join("\n")}
        </pre>
        {folio}
      </div>
    );
  }

  if (page.type === "checklist") {
    return (
      <div style={baseStyle}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>Operational</div>
        <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 36, margin: "12px 0 24px" }}>{page.title}</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {page.items.map((it, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: "1px dotted #c8b78c" }}>
              <span style={{ width: 16, height: 16, border: "1.5px solid #1a1611", flexShrink: 0, marginTop: 4 }}/>
              <span style={{ fontSize: 16 }}>{it}</span>
            </li>
          ))}
        </ul>
        {folio}
      </div>
    );
  }

  // prose / default
  return (
    <div style={baseStyle}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "#7a6f57", textTransform: "uppercase" }}>{docTitle}</div>
      <h2 style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 36, margin: "16px 0 18px", lineHeight: 1.05 }}>{page.title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, fontSize: 15, lineHeight: 1.65, columnRule: "1px solid transparent" }}>
        <p style={{ margin: 0 }}>
          <span style={{ float: "left", fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 56, lineHeight: 0.85, paddingRight: 8, paddingTop: 4 }}>{page.body.charAt(0)}</span>
          {page.body.slice(1)}
        </p>
        <p style={{ margin: 0, color: "#3d352a" }}>
          {page.body}
        </p>
      </div>
      {folio}
    </div>
  );
}

// PDF preview modal
function PDFPreview({ sample, onClose }) {
  const [pageIdx, setPageIdx] = useS_samp(0);
  const total = sample.pdfPages.length;

  useE_samp(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPageIdx(i => Math.min(total - 1, i + 1));
      if (e.key === "ArrowLeft") setPageIdx(i => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [total, onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(20,17,13,0.88)",
      display: "flex", flexDirection: "column",
      backdropFilter: "blur(2px)",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 24px", borderBottom: "1px solid rgba(242,235,221,0.15)",
        color: "var(--paper)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
          <span style={{ color: "var(--vermillion)" }}>● PDF Preview</span>
          <span style={{ opacity: 0.8 }}>{sample.title}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={() => setPageIdx(i => Math.max(0, i - 1))}
            disabled={pageIdx === 0}
            style={{ background: "transparent", color: "var(--paper)", border: "1px solid rgba(242,235,221,0.3)", padding: "6px 10px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: pageIdx === 0 ? "not-allowed" : "pointer", opacity: pageIdx === 0 ? 0.4 : 1 }}
          >← Prev</button>
          <span>{pageIdx + 1} / {total}</span>
          <button
            onClick={() => setPageIdx(i => Math.min(total - 1, i + 1))}
            disabled={pageIdx === total - 1}
            style={{ background: "transparent", color: "var(--paper)", border: "1px solid rgba(242,235,221,0.3)", padding: "6px 10px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: pageIdx === total - 1 ? "not-allowed" : "pointer", opacity: pageIdx === total - 1 ? 0.4 : 1 }}
          >Next →</button>
          <button onClick={onClose} style={{ background: "var(--vermillion)", color: "var(--paper)", border: "none", padding: "8px 14px", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>Close ✕</button>
        </div>
      </div>

      {/* Pages scroll area */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {sample.pdfPages.map((p, i) => (
            <div key={i} id={`pdf-page-${i}`} style={{
              outline: i === pageIdx ? "3px solid var(--vermillion)" : "none",
              outlineOffset: 6,
              transition: "outline 0.2s",
            }}>
              <PDFPage page={p} pageNum={i + 1} total={total} docTitle={sample.title} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom meta */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        padding: "12px 24px", borderTop: "1px solid rgba(242,235,221,0.15)",
        color: "rgba(242,235,221,0.6)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        <span>{sample.client} · {sample.year} · {sample.kind}</span>
        <span>Use ← → or scroll · Esc to close</span>
      </div>
    </div>
  );
}

// Thumbnail renderer — uses sample.thumb if provided, else procedural document mockup
function SampleThumb({ sample, variant = "doc" }) {
  if (sample.thumb) {
    return <img src={sample.thumb} alt="" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />;
  }
  // Procedural mock — looks like a document page
  const colors = {
    "API Reference": "var(--vermillion)",
    "Developer Guide": "var(--ochre)",
    "Runbook": "var(--ink)",
    "Conceptual": "var(--vermillion)",
    "Style Guide": "var(--ochre)",
    "Wiki / IA": "var(--ink)",
  };
  const accent = colors[sample.kind] || "var(--vermillion)";

  return (
    <div style={{
      width: "100%",
      aspectRatio: "4/5",
      background: "linear-gradient(180deg, #fdfaf2 0%, #f6efde 100%)",
      padding: "18px 20px 14px",
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid var(--hair)",
      display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    }}>
      {/* Top label */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.18em", color: "#7a6f57", textTransform: "uppercase" }}>
        <span>{sample.kind}</span>
        <span>{sample.year}</span>
      </div>
      {/* Mock title */}
      <div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontStyle: "italic", fontSize: 22, lineHeight: 1, color: "#1a1611", letterSpacing: "-0.01em", marginTop: 6 }}>
        {sample.title.split(" — ")[0]}
      </div>
      <div style={{ height: 2, background: accent, width: "40%" }}/>
      {/* Mock text lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
        {[100, 90, 96, 70, 88, 92, 60].map((w, i) => (
          <div key={i} style={{ height: 4, background: "rgba(26,22,17,0.18)", width: `${w}%` }}/>
        ))}
      </div>
      <div style={{ height: 8 }}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[100, 84, 92, 76].map((w, i) => (
          <div key={i} style={{ height: 4, background: "rgba(26,22,17,0.14)", width: `${w}%` }}/>
        ))}
      </div>
      {/* Folio */}
      <div style={{ position: "absolute", bottom: 12, left: 20, right: 20, display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 7, letterSpacing: "0.16em", color: "#7a6f57", textTransform: "uppercase" }}>
        <span>{sample.client}</span>
        <span>p. 01</span>
      </div>
      {/* Stamp */}
      <div style={{
        position: "absolute", top: 14, right: -8, transform: "rotate(8deg)",
        border: `1.5px solid ${accent}`, padding: "3px 8px",
        fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase",
        color: accent, opacity: 0.85, background: "rgba(253,250,242,0.6)",
      }}>
        Specimen
      </div>
    </div>
  );
}

function SampleCard({ sample, onOpen, cardStyle = "broadsheet" }) {
  if (cardStyle === "minimal") {
    return (
      <article
        onClick={() => onOpen(sample)}
        style={{
          cursor: "pointer", paddingBottom: 18, borderBottom: "1px solid var(--hair)",
          display: "grid", gridTemplateColumns: "120px 1fr", gap: 18,
        }}
      >
        <div><SampleThumb sample={sample} /></div>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--slate)", textTransform: "uppercase" }}>{sample.kind} · {sample.year}</div>
          <h3 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontSize: 24, lineHeight: 1.05, margin: "6px 0 8px" }}>{sample.title}</h3>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>{sample.excerpt}</p>
        </div>
      </article>
    );
  }

  if (cardStyle === "ticket") {
    return (
      <article
        onClick={() => onOpen(sample)}
        style={{
          cursor: "pointer", border: "1px solid var(--rule)",
          background: "var(--paper-2)",
          padding: 0, display: "flex", flexDirection: "column",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px -12px rgba(20,17,13,0.4)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px dashed var(--hair)", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>№ {sample.id.toUpperCase()}</span>
          <span style={{ color: "var(--vermillion)" }}>{sample.kind}</span>
        </div>
        <SampleThumb sample={sample} />
        <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.05, margin: 0 }}>{sample.title}</h3>
          <p style={{ margin: "10px 0 12px", fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)", flex: 1 }}>{sample.excerpt}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase" }}>{sample.client} · {sample.year}</span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--vermillion)", textTransform: "uppercase" }}>Read →</span>
          </div>
        </div>
      </article>
    );
  }

  // broadsheet (default)
  return (
    <article
      onClick={() => onOpen(sample)}
      style={{
        cursor: "pointer",
        display: "flex", flexDirection: "column",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
    >
      <SampleThumb sample={sample} />
      <div style={{ paddingTop: 14 }}>
        <div style={{ fontSize: 13, color: "var(--slate)" }}>
          {sample.kind} · {sample.year}
        </div>
        <h3 style={{ fontFamily: "var(--serif-display)", fontWeight: 400, fontSize: 24, lineHeight: 1.1, margin: "6px 0 8px", letterSpacing: "-0.01em" }}>
          {sample.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{sample.excerpt}</p>
      </div>
    </article>
  );
}

window.PDFPreview = PDFPreview;
window.SampleCard = SampleCard;
window.SampleThumb = SampleThumb;
window.PDFPage = PDFPage;
