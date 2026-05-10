// Admin panel — login + CRUD on samples, edit bio/services/contact

const { useState: useS_adm, useEffect: useE_adm } = React;

function AdminLogin({ onAuth, onClose }) {
  const [pw, setPw] = useS_adm("");
  const [err, setErr] = useS_adm(false);
  function submit(e) {
    e.preventDefault();
    if (pw.length >= 1) onAuth();
    else setErr(true);
  }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(20,17,13,0.92)", display: "grid", placeItems: "center" }}>
      <form onSubmit={submit} style={{
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        padding: "36px 40px",
        width: "min(440px, 92vw)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
      }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--vermillion)", textTransform: "uppercase" }}>Editor's Entrance · Restricted</div>
        <h2 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 36, margin: "8px 0 6px" }}>Press credentials</h2>
        <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--slate)" }}>This is a prototype — any password gets you in.</p>
        <label className="field"><span>Passphrase</span>
          <input type="password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }} placeholder="•••••••" />
        </label>
        {err && <div className="mono" style={{ fontSize: 10, color: "var(--vermillion)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Enter anything to continue</div>}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button type="button" className="btn" onClick={onClose}>Back to Front Page</button>
          <button type="submit" className="btn btn-primary">Enter Newsroom →</button>
        </div>
      </form>
    </div>
  );
}

function uid(prefix = "x") {
  return prefix + Math.random().toString(36).slice(2, 8);
}

function SampleEditor({ sample, onSave, onCancel }) {
  const [s, setS] = useS_adm({ ...sample });
  function set(k, v) { setS(prev => ({ ...prev, [k]: v })); }

  function addPage(type) {
    const templates = {
      title: { type: "title", title: "Untitled", subtitle: "Subtitle goes here", date: new Date().getFullYear().toString() },
      prose: { type: "prose", title: "Section heading", body: "Lorem ipsum dolor sit amet…" },
      toc: { type: "toc", title: "Contents", entries: [["I.", "First entry", "1"]] },
      checklist: { type: "checklist", title: "Checklist", items: ["Item one", "Item two"] },
      code: { type: "code", lang: "shell", lines: ["$ command --here"] },
      spec: { type: "spec", endpoint: "GET /v1/example", description: "Describe what this does.", fields: [["field","string","required","description"]] },
    };
    set("pdfPages", [...(s.pdfPages || []), templates[type]]);
  }

  function removePage(i) {
    set("pdfPages", s.pdfPages.filter((_, idx) => idx !== i));
  }

  function updatePage(i, updater) {
    set("pdfPages", s.pdfPages.map((p, idx) => idx === i ? { ...p, ...updater } : p));
  }

  function handleThumbUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("thumb", ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(20,17,13,0.94)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(242,235,221,0.2)", display: "flex", justifyContent: "space-between", color: "var(--paper)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", flexWrap: "wrap", gap: 12 }}>
        <span><span style={{ color: "var(--vermillion)" }}>● Editing</span> &nbsp; {s.title || "(untitled)"}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={onCancel} style={{ color: "var(--paper)", borderColor: "rgba(242,235,221,0.4)" }}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(s)}>Save changes</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", background: "var(--paper)", padding: 32, border: "1px solid var(--rule)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--vermillion)", textTransform: "uppercase" }}>Sample · Metadata</div>
          <h2 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontSize: 36, margin: "6px 0 24px" }}>Edit specimen</h2>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 18 }}>
            <label className="field"><span>Title</span><input value={s.title} onChange={(e) => set("title", e.target.value)} /></label>
            <label className="field"><span>Kind</span><input value={s.kind} onChange={(e) => set("kind", e.target.value)} /></label>
            <label className="field"><span>Year</span><input value={s.year} onChange={(e) => set("year", e.target.value)} /></label>
          </div>
          <label className="field"><span>Client</span><input value={s.client} onChange={(e) => set("client", e.target.value)} /></label>
          <label className="field"><span>Excerpt</span><textarea rows="3" value={s.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></label>
          <label className="field"><span>Tags (comma-separated)</span>
            <input value={(s.tags || []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} />
          </label>
          <label className="field"><span>Thumbnail (optional — leave blank for procedural document mock)</span>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <input type="file" accept="image/*" onChange={handleThumbUpload} style={{ borderBottom: "none", padding: 0 }} />
              {s.thumb && <button type="button" className="btn btn-danger" onClick={() => set("thumb", null)}>Remove</button>}
            </div>
            {s.thumb && <img src={s.thumb} alt="" style={{ marginTop: 10, maxWidth: 160, border: "1px solid var(--hair)" }} />}
          </label>

          <div className="rule" style={{ borderTop: "4px double var(--rule)", margin: "30px 0 20px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--vermillion)", textTransform: "uppercase" }}>Sample · PDF Pages</div>
              <h3 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontSize: 28, margin: "4px 0 0" }}>Document body</h3>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["title","prose","toc","checklist","code","spec"].map(t => (
                <button key={t} type="button" className="btn" onClick={() => addPage(t)}>+ {t}</button>
              ))}
            </div>
          </div>

          {(s.pdfPages || []).map((p, i) => (
            <div key={i} style={{ border: "1px solid var(--hair)", padding: 16, marginBottom: 14, background: "var(--paper-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>Page {i + 1} · {p.type}</span>
                <button type="button" className="btn btn-danger" onClick={() => removePage(i)}>Delete</button>
              </div>

              {p.type === "title" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label className="field"><span>Title</span><input value={p.title} onChange={(e) => updatePage(i, { title: e.target.value })} /></label>
                  <label className="field"><span>Subtitle</span><input value={p.subtitle || ""} onChange={(e) => updatePage(i, { subtitle: e.target.value })} /></label>
                  <label className="field"><span>Date</span><input value={p.date || ""} onChange={(e) => updatePage(i, { date: e.target.value })} /></label>
                  <label className="field"><span>Author / Byline</span><input value={p.author || ""} onChange={(e) => updatePage(i, { author: e.target.value })} /></label>
                </div>
              )}

              {p.type === "prose" && (
                <>
                  <label className="field"><span>Heading</span><input value={p.title} onChange={(e) => updatePage(i, { title: e.target.value })} /></label>
                  <label className="field"><span>Body</span><textarea rows="5" value={p.body} onChange={(e) => updatePage(i, { body: e.target.value })} /></label>
                </>
              )}

              {p.type === "toc" && (
                <>
                  <label className="field"><span>Heading</span><input value={p.title} onChange={(e) => updatePage(i, { title: e.target.value })} /></label>
                  <label className="field"><span>Entries (one per line — "label | title | page")</span>
                    <textarea rows="6" value={(p.entries || []).map(e => e.join(" | ")).join("\n")} onChange={(e) => updatePage(i, { entries: e.target.value.split("\n").map(line => line.split("|").map(x => x.trim())) })} />
                  </label>
                </>
              )}

              {p.type === "checklist" && (
                <>
                  <label className="field"><span>Heading</span><input value={p.title} onChange={(e) => updatePage(i, { title: e.target.value })} /></label>
                  <label className="field"><span>Items (one per line)</span>
                    <textarea rows="5" value={(p.items || []).join("\n")} onChange={(e) => updatePage(i, { items: e.target.value.split("\n").filter(Boolean) })} />
                  </label>
                </>
              )}

              {p.type === "code" && (
                <>
                  <label className="field"><span>Language</span><input value={p.lang} onChange={(e) => updatePage(i, { lang: e.target.value })} /></label>
                  <label className="field"><span>Lines (one per line)</span>
                    <textarea rows="6" value={(p.lines || []).join("\n")} onChange={(e) => updatePage(i, { lines: e.target.value.split("\n") })} />
                  </label>
                </>
              )}

              {p.type === "spec" && (
                <>
                  <label className="field"><span>Endpoint</span><input value={p.endpoint} onChange={(e) => updatePage(i, { endpoint: e.target.value })} /></label>
                  <label className="field"><span>Description</span><textarea rows="3" value={p.description} onChange={(e) => updatePage(i, { description: e.target.value })} /></label>
                  <label className="field"><span>Fields (one per line — "name | type | required/optional | description")</span>
                    <textarea rows="5" value={(p.fields || []).map(f => f.join(" | ")).join("\n")} onChange={(e) => updatePage(i, { fields: e.target.value.split("\n").map(line => line.split("|").map(x => x.trim())) })} />
                  </label>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ data, setData, onLogout }) {
  const [tab, setTab] = useS_adm("samples");
  const [editing, setEditing] = useS_adm(null);

  function updateSample(updated) {
    setData(prev => ({ ...prev, samples: prev.samples.map(x => x.id === updated.id ? updated : x) }));
    setEditing(null);
  }
  function addSample() {
    const draft = {
      id: uid("w"), title: "New specimen", kind: "Document", year: new Date().getFullYear().toString(),
      client: "Client name", excerpt: "Short, evocative summary of the work.",
      tags: [], thumb: null,
      pdfPages: [
        { type: "title", title: "New specimen", subtitle: "Subtitle", date: new Date().getFullYear().toString() },
      ],
    };
    setEditing(draft);
  }
  function saveDraft(draft) {
    setData(prev => {
      const exists = prev.samples.some(x => x.id === draft.id);
      return exists
        ? { ...prev, samples: prev.samples.map(x => x.id === draft.id ? draft : x) }
        : { ...prev, samples: [draft, ...prev.samples] };
    });
    setEditing(null);
  }
  function deleteSample(id) {
    if (!confirm("Pull this from the press? This cannot be undone.")) return;
    setData(prev => ({ ...prev, samples: prev.samples.filter(x => x.id !== id) }));
  }
  function reorder(id, dir) {
    setData(prev => {
      const arr = [...prev.samples];
      const i = arr.findIndex(x => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, samples: arr };
    });
  }

  function setMeta(k, v) { setData(prev => ({ ...prev, meta: { ...prev.meta, [k]: v } })); }
  function setBio(v) { setData(prev => ({ ...prev, bio: v })); }
  function setWhatIDo(v) { setData(prev => ({ ...prev, whatIDo: v })); }
  function setContact(k, v) { setData(prev => ({ ...prev, contact: { ...prev.contact, [k]: v } })); }
  function setServiceField(id, k, v) { setData(prev => ({ ...prev, services: prev.services.map(s => s.id === id ? { ...s, [k]: v } : s) })); }
  function addService() { setData(prev => ({ ...prev, services: [...prev.services, { id: uid("s"), title: "New service", description: "Describe what you offer." }] })); }
  function removeService(id) { setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) })); }

  const tabs = [
    ["samples", "Work samples"],
    ["about", "About & masthead"],
    ["services", "Services"],
    ["contact", "Contact"],
    ["danger", "Danger"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {editing && <SampleEditor sample={editing} onSave={saveDraft} onCancel={() => setEditing(null)} />}

      {/* Admin top bar */}
      <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--vermillion)", textTransform: "uppercase" }}>● Newsroom</span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.7 }}>The Documentarian · Admin</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={onLogout} style={{ color: "var(--paper)", borderColor: "rgba(242,235,221,0.4)" }}>← View site</button>
          <button className="btn btn-danger" onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="page" style={{ paddingTop: 28, paddingBottom: 18 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--rule)" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: "transparent", border: "none", padding: "12px 22px",
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              cursor: "pointer",
              borderBottom: tab === id ? "3px solid var(--vermillion)" : "3px solid transparent",
              color: tab === id ? "var(--ink)" : "var(--slate)",
              marginBottom: -1,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="page" style={{ paddingBottom: 60 }}>
        {tab === "samples" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--vermillion)", textTransform: "uppercase" }}>Section C · Manage</div>
                <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 48, margin: "4px 0 0" }}>Work samples · {data.samples.length}</h1>
              </div>
              <button className="btn btn-primary" onClick={addSample}>＋ New sample</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, border: "1px solid var(--rule)" }}>
              {data.samples.map((s, i) => (
                <div key={s.id} style={{
                  display: "grid", gridTemplateColumns: "60px 80px 1fr auto",
                  alignItems: "center", gap: 16, padding: 14,
                  borderBottom: i < data.samples.length - 1 ? "1px solid var(--hair)" : "none",
                  background: i % 2 ? "var(--paper-2)" : "transparent",
                }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase" }}>№ {String(i + 1).padStart(2, "0")}</span>
                  <div style={{ width: 60 }}>
                    <SampleThumb sample={s} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontSize: 20, margin: 0, lineHeight: 1.1 }}>{s.title}</h3>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase", marginTop: 4 }}>
                      {s.kind} · {s.client} · {s.year} · {(s.pdfPages || []).length} pages
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn" onClick={() => reorder(s.id, -1)} disabled={i === 0} style={{ opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button className="btn" onClick={() => reorder(s.id, 1)} disabled={i === data.samples.length - 1} style={{ opacity: i === data.samples.length - 1 ? 0.4 : 1 }}>↓</button>
                    <button className="btn" onClick={() => setEditing({ ...s })}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteSample(s.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "about" && (
          <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 18px" }}>Masthead</h1>
              <label className="field"><span>Name</span><input value={data.meta.name} onChange={(e) => setMeta("name", e.target.value)} /></label>
              <label className="field"><span>Tagline</span><input value={data.meta.tagline} onChange={(e) => setMeta("tagline", e.target.value)} /></label>
              <label className="field"><span>Edition string</span><input value={data.meta.edition} onChange={(e) => setMeta("edition", e.target.value)} /></label>
              <label className="field"><span>Motto</span><input value={data.meta.motto} onChange={(e) => setMeta("motto", e.target.value)} /></label>
              <label className="field"><span>Location</span><input value={data.meta.location} onChange={(e) => setMeta("location", e.target.value)} /></label>
              <label className="field"><span>Founded year</span><input type="number" value={data.meta.foundedYear} onChange={(e) => setMeta("foundedYear", parseInt(e.target.value) || 2017)} /></label>
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 18px" }}>Bio</h1>
              <label className="field"><span>Lead paragraph (about)</span><textarea rows="6" value={data.bio} onChange={(e) => setBio(e.target.value)} /></label>
              <label className="field"><span>What I do (short)</span><textarea rows="3" value={data.whatIDo} onChange={(e) => setWhatIDo(e.target.value)} /></label>
            </div>
          </div>
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--hair)" }}>
            <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 18px" }}>Portrait</h1>
            <window.PortraitEditor
              portrait={data.portrait || { src: null, filter: "none", removedBg: false }}
              onChange={(p) => setData(prev => ({ ...prev, portrait: p }))}
            />
          </div>
          </>
        )}

        {tab === "services" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
              <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 48, margin: 0 }}>Services · {data.services.length}</h1>
              <button className="btn btn-primary" onClick={addService}>＋ Add service</button>
            </div>
            {data.services.map((s, i) => (
              <div key={s.id} style={{ border: "1px solid var(--hair)", padding: 18, marginBottom: 14, background: i % 2 ? "var(--paper-2)" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--vermillion)", textTransform: "uppercase" }}>Service № {String(i + 1).padStart(2, "0")}</span>
                  <button className="btn btn-danger" onClick={() => removeService(s.id)}>Remove</button>
                </div>
                <label className="field"><span>Title</span><input value={s.title} onChange={(e) => setServiceField(s.id, "title", e.target.value)} /></label>
                <label className="field"><span>Description</span><textarea rows="2" value={s.description} onChange={(e) => setServiceField(s.id, "description", e.target.value)} /></label>
              </div>
            ))}
          </>
        )}

        {tab === "contact" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 18px" }}>Colophon</h1>
              <label className="field"><span>Email</span><input value={data.contact.email} onChange={(e) => setContact("email", e.target.value)} /></label>
              <label className="field"><span>Location</span><input value={data.contact.location} onChange={(e) => setContact("location", e.target.value)} /></label>
              <label className="field"><span>Hours</span><input value={data.contact.hours} onChange={(e) => setContact("hours", e.target.value)} /></label>
              <label className="field"><span>Rate</span><input value={data.contact.rate} onChange={(e) => setContact("rate", e.target.value)} /></label>
              <label className="field"><span>Next available</span><input value={data.contact.nextAvailable} onChange={(e) => setContact("nextAvailable", e.target.value)} /></label>
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 18px" }}>Elsewhere</h1>
              {data.contact.socials.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, marginBottom: 12, alignItems: "end" }}>
                  <label className="field" style={{ marginBottom: 0 }}><span>Label</span><input value={s.label} onChange={(e) => setData(prev => ({ ...prev, contact: { ...prev.contact, socials: prev.contact.socials.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }}))} /></label>
                  <label className="field" style={{ marginBottom: 0 }}><span>Handle</span><input value={s.handle} onChange={(e) => setData(prev => ({ ...prev, contact: { ...prev.contact, socials: prev.contact.socials.map((x, j) => j === i ? { ...x, handle: e.target.value } : x) }}))} /></label>
                  <label className="field" style={{ marginBottom: 0 }}><span>URL</span><input value={s.url} onChange={(e) => setData(prev => ({ ...prev, contact: { ...prev.contact, socials: prev.contact.socials.map((x, j) => j === i ? { ...x, url: e.target.value } : x) }}))} /></label>
                  <button className="btn btn-danger" onClick={() => setData(prev => ({ ...prev, contact: { ...prev.contact, socials: prev.contact.socials.filter((_, j) => j !== i) }}))}>×</button>
                </div>
              ))}
              <button className="btn" onClick={() => setData(prev => ({ ...prev, contact: { ...prev.contact, socials: [...prev.contact.socials, { label: "New", handle: "@you", url: "#" }] }}))}>＋ Add link</button>
            </div>
          </div>
        )}

        {tab === "danger" && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontFamily: "var(--serif-display)", fontStyle: "italic", fontWeight: 800, fontSize: 40, margin: "0 0 14px" }}>The shredder</h1>
            <p style={{ color: "var(--ink-2)" }}>Reset all portfolio content to the original seed data. This wipes everything you have edited in this browser. Use with intent.</p>
            <button className="btn btn-danger" onClick={() => {
              if (confirm("Reset everything to the seed content? This cannot be undone.")) {
                resetData();
                location.reload();
              }
            }}>Reset to seed content</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.AdminLogin = AdminLogin;
window.AdminPanel = AdminPanel;
