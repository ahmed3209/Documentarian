// Main app — routes between public site, admin login, admin panel
// + Tweaks panel for variations

const { useState: useS_app, useEffect: useE_app } = React;

function App() {
  const [data, setData] = useS_app(() => loadData());
  const [route, setRoute] = useS_app(() => location.hash === "#admin" ? "admin-login" : "public");
  const [openSample, setOpenSample] = useS_app(null);

  useE_app(() => { saveData(data); }, [data]);

  // Tweaks
  const [t, setT] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "cream",
    "typeface": "modern",
    "density": "comfortable",
    "cardStyle": "broadsheet"
  }/*EDITMODE-END*/);

  useE_app(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.typeface = t.typeface;
    document.body.dataset.density = t.density;
  }, [t.palette, t.typeface, t.density]);

  function gotoAdmin() { location.hash = "#admin"; setRoute("admin-login"); }
  function leaveAdmin() { location.hash = ""; setRoute("public"); }
  function resetContent() { resetData(); setData(loadData()); }

  const Tweaks = (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label="Palette">
        <window.TweakSelect label="Color scheme" value={t.palette} onChange={v => setT("palette", v)} options={[
          { value: "cream", label: "Cream paper (default)" },
          { value: "ink", label: "Cream + ink-blue accent" },
          { value: "sepia", label: "Sepia broadsheet" },
          { value: "charcoal", label: "Charcoal night edition" },
        ]} />
      </window.TweakSection>
      <window.TweakSection label="Typography">
        <window.TweakRadio label="Pairing" value={t.typeface} onChange={v => setT("typeface", v)} options={[
          { value: "modern", label: "Modern" },
          { value: "classic", label: "Classic" },
          { value: "technical", label: "Technical" },
        ]} />
      </window.TweakSection>
      <window.TweakSection label="Layout">
        <window.TweakRadio label="Density" value={t.density} onChange={v => setT("density", v)} options={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfort" },
          { value: "loose", label: "Loose" },
        ]} />
        <window.TweakRadio label="Sample card" value={t.cardStyle} onChange={v => setT("cardStyle", v)} options={[
          { value: "broadsheet", label: "Broadsheet" },
          { value: "ticket", label: "Ticket" },
          { value: "minimal", label: "Index" },
        ]} />
      </window.TweakSection>
      <window.TweakSection label="Editor's entrance">
        <window.TweakButton label="Open admin panel →" onClick={() => { location.hash = "#admin"; location.reload(); }} />
        <window.TweakButton label="Reset content to seed" secondary onClick={() => { if (confirm("Wipe all edits?")) resetContent(); }} />
      </window.TweakSection>
    </window.TweaksPanel>
  );

  if (route === "admin-login") {
    return (<>{Tweaks}<AdminLogin onAuth={() => setRoute("admin")} onClose={leaveAdmin} /></>);
  }
  if (route === "admin") {
    return (<>{Tweaks}<AdminPanel data={data} setData={setData} onLogout={leaveAdmin} /></>);
  }
  return (
    <>
      {Tweaks}
      <Masthead data={data} onAdminPing={gotoAdmin} />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <WorkSection data={data} onOpenSample={setOpenSample} cardStyle={t.cardStyle} />
      <ProcessSection data={data} />
      <VoicesSection data={data} />
      <ContactSection data={data} />
      <Footer data={data} onAdminPing={gotoAdmin} />
      {openSample && <PDFPreview sample={openSample} onClose={() => setOpenSample(null)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
