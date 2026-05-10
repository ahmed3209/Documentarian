// Portrait helpers — bg removal, filters, editor

// Simple background remover: assumes background is the dominant edge color.
// Samples 4 corners, averages, then makes pixels within tolerance transparent.
async function removeBackground(dataUrl, tolerance = 32) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;

      // Sample edges (top + bottom + sides) for bg color
      const samples = [];
      const w = canvas.width,h = canvas.height;
      const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
      for (let x = 0; x < w; x += step) {
        for (let yEdge of [0, h - 1]) {
          const i = (yEdge * w + x) * 4;
          samples.push([px[i], px[i + 1], px[i + 2]]);
        }
      }
      for (let y = 0; y < h; y += step) {
        for (let xEdge of [0, w - 1]) {
          const i = (y * w + xEdge) * 4;
          samples.push([px[i], px[i + 1], px[i + 2]]);
        }
      }
      // Median per channel
      const med = (arr) => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
      const bg = [med(samples.map((s) => s[0])), med(samples.map((s) => s[1])), med(samples.map((s) => s[2]))];

      // Make matching pixels transparent with soft falloff
      for (let i = 0; i < px.length; i += 4) {
        const dr = px[i] - bg[0];
        const dg = px[i + 1] - bg[1];
        const db = px[i + 2] - bg[2];
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < tolerance) {
          px[i + 3] = 0; // hard remove
        } else if (dist < tolerance * 1.8) {
          // Soft edge
          px[i + 3] = Math.floor((dist - tolerance) / (tolerance * 0.8) * 255);
        }
      }
      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = dataUrl;
  });
}

// Get CSS filter string for a named filter preset
function getFilterCSS(filter) {
  switch (filter) {
    case "grayscale":return "grayscale(1) contrast(1.05)";
    case "duotone-vermillion":return "grayscale(1) contrast(1.1) sepia(0.6) hue-rotate(-30deg) saturate(2.4)";
    case "high-contrast":return "grayscale(1) contrast(1.6) brightness(0.95)";
    case "halftone":return "grayscale(1) contrast(1.4) brightness(1.05)";
    case "sepia":return "sepia(0.7) contrast(1.05) brightness(1.02)";
    case "blueprint":return "grayscale(1) contrast(1.2) sepia(0.4) hue-rotate(170deg) saturate(2)";
    case "soft":return "grayscale(0.4) contrast(0.95) brightness(1.05)";
    default:return "none";
  }
}

const FILTER_OPTIONS = [
{ id: "none", label: "Original" },
{ id: "grayscale", label: "Grayscale" },
{ id: "high-contrast", label: "High contrast" },
{ id: "duotone-vermillion", label: "Duotone (red)" },
{ id: "blueprint", label: "Blueprint" },
{ id: "sepia", label: "Sepia" },
{ id: "halftone", label: "Halftone" },
{ id: "soft", label: "Soft" }];


function PortraitDisplay({ portrait, size = 260, label = "Portrait" }) {
  const filter = getFilterCSS(portrait?.filter || "none");
  const isHalftone = portrait?.filter === "halftone";
  return (
    <div style={{
      width: size, maxWidth: "100%", aspectRatio: "4/5",
      background: portrait?.removedBg ? "var(--paper-2)" : "transparent",
      border: "1px solid var(--hair)",
      position: "relative", overflow: "hidden", borderRadius: "11px"
    }}>
      {portrait && portrait.src ?
      <>
          <img src={portrait.src} alt={label} style={{

          filter, display: "block", padding: "3px", objectFit: "cover", borderRadius: "13px", opacity: "1", borderWidth: "2px", borderColor: "rgb(91, 91, 91)", height: "323.4px", width: "259px"
        }} />
          {isHalftone &&
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(20,17,13,0.55) 1px, transparent 1.5px)",
          backgroundSize: "4px 4px",
          mixBlendMode: "multiply"
        }} />
        }
        </> :

      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--slate)", fontSize: 13 }}>
          {label}
        </div>
      }
    </div>);

}

const { useState: useS_pe, useRef: useR_pe } = React;

function PortraitEditor({ portrait, onChange }) {
  const [working, setWorking] = useS_pe(false);
  const [tolerance, setTolerance] = useS_pe(36);
  const inputRef = useR_pe(null);

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ src: ev.target.result, filter: portrait?.filter || "none", removedBg: false, original: ev.target.result });
    };
    reader.readAsDataURL(file);
  }

  async function doRemoveBg() {
    if (!portrait?.src) return;
    setWorking(true);
    try {
      const original = portrait.original || portrait.src;
      const out = await removeBackground(original, tolerance);
      onChange({ ...portrait, src: out, removedBg: true, original });
    } finally {
      setWorking(false);
    }
  }
  function restoreOriginal() {
    if (!portrait?.original) return;
    onChange({ ...portrait, src: portrait.original, removedBg: false });
  }
  function clearPortrait() {
    onChange({ src: null, filter: "none", removedBg: false });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
      <PortraitDisplay portrait={portrait} size={240} />
      <div>
        <label className="field"><span>Upload portrait</span>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ borderBottom: "none", padding: 0 }} />
        </label>

        {portrait?.src &&
        <>
            <label className="field"><span>Filter</span>
              <select value={portrait.filter || "none"} onChange={(e) => onChange({ ...portrait, filter: e.target.value })}>
                {FILTER_OPTIONS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>

            <div style={{ marginTop: 6, marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 4 }}>
                Background tolerance — {tolerance}
              </div>
              <input type="range" min="10" max="80" value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value))} style={{ width: "100%", borderBottom: "none" }} />
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                Higher = more aggressive removal. Run again after changing.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" className="btn btn-primary" onClick={doRemoveBg} disabled={working}>
                {working ? "Removing…" : portrait.removedBg ? "Re-run bg removal" : "Auto-remove background"}
              </button>
              {portrait.removedBg &&
            <button type="button" className="btn" onClick={restoreOriginal}>Restore original</button>
            }
              <button type="button" className="btn btn-danger" onClick={clearPortrait}>Remove portrait</button>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 8 }}>
                Filter preview
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {FILTER_OPTIONS.map((f) =>
              <div key={f.id} onClick={() => onChange({ ...portrait, filter: f.id })} style={{
                cursor: "pointer",
                border: portrait.filter === f.id ? "2px solid var(--vermillion)" : "1px solid var(--hair)",
                padding: 4,
                background: "var(--paper-2)"
              }}>
                    <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--paper)", overflow: "hidden", position: "relative" }}>
                      <img src={portrait.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: getFilterCSS(f.id) }} />
                      {f.id === "halftone" && <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(20,17,13,0.55) 1px, transparent 1.5px)", backgroundSize: "3px 3px", mixBlendMode: "multiply" }} />}
                    </div>
                    <div style={{ fontSize: 10, marginTop: 4, color: portrait.filter === f.id ? "var(--vermillion)" : "var(--slate)", textAlign: "center" }}>
                      {f.label}
                    </div>
                  </div>
              )}
              </div>
            </div>
          </>
        }
      </div>
    </div>);

}

window.PortraitDisplay = PortraitDisplay;
window.PortraitEditor = PortraitEditor;
window.getFilterCSS = getFilterCSS;