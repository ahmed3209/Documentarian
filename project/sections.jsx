// Public site sections — About, Services, Work, Process, Voices, Contact

const { useState: useS_sec } = React;

function SectionHead({ kicker, title, dek }) {
  return (
    <div style={{ marginBottom: 28, paddingTop: 6 }}>
      <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>{kicker.split("·").pop().trim()}</div>
      <h2 style={{
        fontFamily: "var(--serif-display)",
        fontWeight: 400,
        fontSize: "clamp(36px, 4.6vw, 60px)",
        lineHeight: 1.0,
        letterSpacing: "-0.02em",
        margin: "4px 0 8px"
      }}>{title}</h2>
      {dek && <p style={{ margin: 0, fontSize: 16, color: "var(--slate)", maxWidth: 640, lineHeight: 1.5 }}>{dek}</p>}
    </div>);

}

function HeroLead_unused({ data }) {
  const m = data.meta;
  return (
    <section className="page" style={{ paddingTop: 28, paddingBottom: 36 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr 1fr", gap: "var(--col-gap)", alignItems: "stretch" }}>
        {/* Left column: dateline + kicker */}
        <div style={{ borderRight: "1px solid var(--hair)", paddingRight: 24 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--slate)", textTransform: "uppercase", marginBottom: 10 }}>
            From the Editor's Desk
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontStyle: "italic", color: "var(--ink-2)" }}>
            "{m.motto}"
          </p>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--hair)" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase" }}>By the Numbers</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div><div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{new Date().getFullYear() - m.foundedYear}</div><div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase" }}>Years In Print</div></div>
              <div><div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{data.samples.length}</div><div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase" }}>Documents Filed</div></div>
              <div><div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{data.services.length}</div><div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase" }}>Services Offered</div></div>
              <div><div style={{ fontFamily: "var(--serif-display)", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>1</div><div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase" }}>Writer On Staff</div></div>
            </div>
          </div>
        </div>

        {/* Center column: feature article */}
        <div style={{ paddingRight: 24, borderRight: "1px solid var(--hair)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--vermillion)", textTransform: "uppercase" }}>Feature · Page 1</div>
          <h2 style={{
            fontFamily: "var(--serif-display)",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: "clamp(36px, 4.2vw, 60px)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            margin: "8px 0 14px"
          }}>
            Documentation for engineers who'd rather be shipping.
          </h2>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase", marginBottom: 12 }}>
            By {m.name} &nbsp;·&nbsp; Filed in {m.location}
          </div>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.62, columnCount: 2, columnGap: 24 }}>
            <span style={{ float: "left", fontFamily: "var(--serif-display)", fontWeight: 800, fontStyle: "italic", fontSize: 64, lineHeight: 0.85, paddingRight: 8, paddingTop: 4, color: "var(--ink)" }}>{data.bio.charAt(0)}</span>
            {data.bio.slice(1)}
          </p>
        </div>

        {/* Right column: now-bar */}
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--slate)", textTransform: "uppercase", marginBottom: 10 }}>
            Currently
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
            ["At work on", "Helios v4 reference rebuild"],
            ["Reading", "Robert Bringhurst, again"],
            ["Tooling", "Mintlify · OpenAPI · Vale"],
            ["Next available", data.contact.nextAvailable],
            ["Open to", "Retainers & 6-week projects"]].
            map((row, i) =>
            <li key={i} style={{ padding: "10px 0", borderBottom: "1px dotted var(--hair)" }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--slate)", textTransform: "uppercase" }}>{row[0]}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.35, marginTop: 2 }}>{row[1]}</div>
              </li>
            )}
          </ul>
          <a href="#contact" className="btn btn-primary" style={{ display: "inline-block", marginTop: 14, textAlign: "center" }}>Get in touch</a>
        </div>
      </div>
    </section>);

}

function AboutSection({ data }) {
  return (
    <section id="about" className="page" style={{ paddingTop: 60, paddingBottom: 60, height: "620px", padding: "0px 28px 50px" }}>
      <SectionHead kicker="About" title="About the writer" />
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }}>
        <window.PortraitDisplay portrait={data.portrait} size={260} />
        <div>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)" }}>
            {data.bio}
          </p>
          <div style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: "1.6", fontWeight: "500", borderStyle: "solid", borderRadius: "9px", padding: "16px 20px", borderWidth: "0.8px", margin: "16px 16px 0 0", borderColor: "rgb(91, 91, 91)" }}>
            {(() => {
              const raw = (data.whatIDo || "").trim();
              // Split on " - " or " — " or " – " or newlines starting with -/—/–
              const parts = raw.split(/\s+[-—–]\s+/);
              const intro = parts.shift();
              const tail = [];
              const bullets = [];
              for (const p of parts) {
                const t = p.trim();
                if (!t) continue;
                // Heuristic: if a "bullet" looks like a long sentence (>14 words or contains a period mid‑text), treat the rest as trailing prose
                const wordCount = t.split(/\s+/).length;
                if (bullets.length > 0 && (wordCount > 14 || /[.!?]\s/.test(t))) {
                  tail.push(t);
                } else {
                  bullets.push(t);
                }
              }
              return (
                <>
                  {intro && <div style={{ marginBottom: bullets.length ? 10 : 0 }}>{intro}</div>}
                  {bullets.length > 0 &&
                  <ul style={{ margin: "0 0 0 4px", paddingLeft: 18, listStyle: "disc" }}>
                      {bullets.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  }
                  {tail.map((t, i) => <div key={i} style={{ marginTop: 10 }}>{t}</div>)}
                </>);

            })()}
          </div>
        </div>
      </div>
    </section>);

}

function ServicesSection({ data }) {
  return (
    <section id="services" className="page" style={{ paddingTop: 60, paddingBottom: 60, padding: "20px 28px 60px" }}>
      <SectionHead kicker="Services" title="What I do" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0, borderTop: "1px solid var(--hair)" }}>
        {data.services.map((s, i) =>
        <div key={s.id} style={{
          padding: "24px 24px 24px 0",
          paddingRight: 24,
          borderBottom: "1px solid var(--hair)",
          display: "flex", flexDirection: "column", gap: 8
        }}>
            <div style={{ fontSize: 13, color: "var(--slate)" }}>{String(i + 1).padStart(2, "0")}</div>
            <h3 style={{
            fontFamily: "var(--serif-display)", fontWeight: 400,
            fontSize: 24, lineHeight: 1.1, margin: 0
          }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{s.description}</p>
          </div>
        )}
      </div>
    </section>);

}

function WorkSection({ data, onOpenSample, cardStyle }) {
  return (
    <section id="work" className="page" style={{ paddingTop: 60, paddingBottom: 60, padding: "19px 28px 60px", height: "1330px" }}>
      <SectionHead kicker="Work" title="Selected work" dek="Click any sample to read the document." />
      <div style={{
        display: "grid",
        gridTemplateColumns: cardStyle === "minimal" ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
        gap: cardStyle === "minimal" ? 20 : 36
      }}>
        {data.samples.map((s) =>
        <SampleCard key={s.id} sample={s} onOpen={onOpenSample} cardStyle={cardStyle} />
        )}
      </div>
    </section>);

}

function ProcessSection({ data }) {
  return (
    <section id="process" className="page" style={{ paddingTop: 60, paddingBottom: 60, padding: "50px 28px 60px", height: "350px" }}>
      <SectionHead kicker="Method" title="How a document gets made" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
        {data.process.map((p, i) =>
        <div key={i}>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 8 }}>{p.step}</div>
            <h3 style={{ fontFamily: "var(--serif-display)", fontWeight: 400, fontSize: 22, margin: "0 0 8px", lineHeight: 1.15 }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>{p.body}</p>
          </div>
        )}
      </div>
    </section>);

}

function VoicesSection({ data }) {
  return (
    <section id="voices" className="page" style={{ paddingTop: 60, paddingBottom: 60, padding: "40px 28px 60px", height: "340px" }}>
      <SectionHead kicker="Voices" title="What clients say" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36 }}>
        {data.testimonials.map((t, i) =>
        <figure key={i} style={{ margin: 0 }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--serif-display)", fontWeight: 400, fontSize: 22, lineHeight: 1.3 }}>
              “{t.quote}”
            </blockquote>
            <figcaption style={{ marginTop: 14, fontSize: 13, color: "var(--slate)" }}>
              {t.author} — {t.role}
            </figcaption>
          </figure>
        )}
      </div>
    </section>);

}

function ContactSection({ data }) {
  const [sent, setSent] = useS_sec(false);
  const c = data.contact;
  return (
    <section id="contact" className="page" style={{ paddingTop: 36, paddingBottom: 36, padding: "3px 28px 36px" }}>
      <SectionHead kicker="Contact" title="Get in touch" dek="Drop a note. I read everything; I reply within two working days." />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48 }}>
        <form
          onSubmit={(e) => {e.preventDefault();setSent(true);setTimeout(() => setSent(false), 4000);}}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <label className="field"><span>Your name</span><input required defaultValue="" /></label>
            <label className="field"><span>Email address</span><input type="email" required defaultValue="" /></label>
          </div>
          <label className="field"><span>Company / Project</span><input defaultValue="" /></label>
          <label className="field"><span>Engagement type</span>
            <select defaultValue="">
              <option value="">Choose one…</option>
              {data.services.map((s) => <option key={s.id}>{s.title}</option>)}
              <option>Something else</option>
            </select>
          </label>
          <label className="field"><span>Tell me about it</span><textarea rows="5" defaultValue="" /></label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase" }}>
              Or write directly: <a href={`mailto:${c.email}`} style={{ color: "var(--vermillion)", textDecoration: "underline", textUnderlineOffset: 3 }}>{c.email}</a>
            </span>
            <button className="btn btn-primary" type="submit">{sent ? "Sent ✓" : "Send message →"}</button>
          </div>
        </form>

        <aside style={{ borderLeft: "1px solid var(--hair)", paddingLeft: 32 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--vermillion)", textTransform: "uppercase", marginBottom: 12 }}>The Colophon</div>
          <dl style={{ margin: 0 }}>
            {[
            ["Studio", c.location],
            ["Hours", c.hours],
            ["Rate", c.rate],
            ["Next opening", c.nextAvailable]].
            map((row, i) =>
            <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", padding: "8px 0", borderBottom: "1px dotted var(--hair)" }}>
                <dt className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--slate)", textTransform: "uppercase" }}>{row[0]}</dt>
                <dd style={{ margin: 0, fontSize: 14 }}>{row[1]}</dd>
              </div>
            )}
          </dl>
          <div style={{ marginTop: 22 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--slate)", textTransform: "uppercase", marginBottom: 8 }}>Elsewhere</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.socials.map((s, i) =>
              <li key={i} style={{ padding: "6px 0", display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--hair)" }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--slate)", textTransform: "uppercase" }}>{s.label}</span>
                  <a href={s.url} style={{ fontSize: 13 }}>{s.handle}</a>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </section>);

}

function Footer({ data, onAdminPing }) {
  const m = data.meta;
  return (
    <footer className="page" style={{ paddingTop: 36, paddingBottom: 36, borderTop: "1px solid var(--hair)", marginTop: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, fontSize: 13, color: "var(--slate)" }}>
        <span>© {new Date().getFullYear()} {m.name}</span>
        <span style={{ cursor: "pointer" }} onClick={onAdminPing} title="Editor's entrance">Editor</span>
      </div>
    </footer>);

}

window.HeroLead = HeroLead;
window.AboutSection = AboutSection;
window.ServicesSection = ServicesSection;
window.WorkSection = WorkSection;
window.ProcessSection = ProcessSection;
window.VoicesSection = VoicesSection;
window.ContactSection = ContactSection;
window.Footer = Footer;