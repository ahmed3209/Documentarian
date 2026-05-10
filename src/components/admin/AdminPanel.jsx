import { useState } from 'react';
import { supabase, uploadFile } from '../../lib/supabase';
import SampleEditor from './SampleEditor';
import PortraitDisplay, { getFilterCSS, FILTER_OPTIONS } from '../PortraitDisplay';

const TABS = [
  ['samples', 'Work Samples'],
  ['about', 'About & Bio'],
  ['services', 'Services'],
  ['methods', 'Methods'],
  ['testimonials', 'Testimonials'],
  ['contact', 'Contact'],
  ['messages', 'Messages'],
  ['danger', 'Danger'],
];

// ── Background removal (client-side canvas) ──────────────────────────────────
async function removeBg(src, tolerance = 36) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height);
      const px = d.data;
      const w = c.width, h = c.height;
      const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
      const samples = [];
      for (let x = 0; x < w; x += step) for (const yE of [0, h - 1]) { const i = (yE * w + x) * 4; samples.push([px[i], px[i+1], px[i+2]]); }
      for (let y = 0; y < h; y += step) for (const xE of [0, w - 1]) { const i = (y * w + xE) * 4; samples.push([px[i], px[i+1], px[i+2]]); }
      const med = arr => arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];
      const bg = [med(samples.map(s => s[0])), med(samples.map(s => s[1])), med(samples.map(s => s[2]))];
      for (let i = 0; i < px.length; i += 4) {
        const dist = Math.sqrt((px[i]-bg[0])**2 + (px[i+1]-bg[1])**2 + (px[i+2]-bg[2])**2);
        if (dist < tolerance) px[i+3] = 0;
        else if (dist < tolerance * 1.8) px[i+3] = Math.floor((dist - tolerance) / (tolerance * 0.8) * 255);
      }
      ctx.putImageData(d, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.src = src;
  });
}

// ── Samples tab ───────────────────────────────────────────────────────────────
function SamplesTab({ data, reload }) {
  const [editing, setEditing] = useState(null);

  async function deleteSample(s) {
    if (!confirm(`Remove "${s.title}"? This cannot be undone.`)) return;
    await supabase.from('samples').delete().eq('id', s.id);
    reload();
  }

  async function reorder(id, dir) {
    const arr = [...data.samples];
    const i = arr.findIndex(s => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    await Promise.all([
      supabase.from('samples').update({ display_order: arr[j].display_order }).eq('id', arr[i].id),
      supabase.from('samples').update({ display_order: arr[i].display_order }).eq('id', arr[j].id),
    ]);
    reload();
  }

  return (
    <>
      {editing && (
        <SampleEditor
          sample={editing}
          onSave={() => { setEditing(null); reload(); }}
          onCancel={() => setEditing(null)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 48, margin: 0 }}>
          Work samples · {data.samples.length}
        </h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}>＋ New sample</button>
      </div>

      <div style={{ border: '1px solid var(--rule)' }}>
        {data.samples.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '40px 70px 1fr auto', alignItems: 'center', gap: 14, padding: 14, borderBottom: i < data.samples.length - 1 ? '1px solid var(--hair)' : 'none', background: i % 2 ? 'var(--paper-2)' : 'transparent' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--slate)', textTransform: 'uppercase' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {s.thumb ? (
              <img src={s.thumb} alt="" style={{ width: 60, height: 75, objectFit: 'cover', border: '1px solid var(--hair)' }} />
            ) : (
              <div style={{ width: 60, height: 75, background: 'var(--paper-2)', border: '1px solid var(--hair)', display: 'grid', placeItems: 'center' }}>
                <span className="mono" style={{ fontSize: 8, color: 'var(--slate)', textTransform: 'uppercase' }}>No img</span>
              </div>
            )}
            <div>
              <h3 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 20, margin: '0 0 4px', lineHeight: 1.1 }}>{s.title}</h3>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--slate)', textTransform: 'uppercase' }}>
                {s.kind} · {s.client} · {s.year}
                {s.pdf_url && <span style={{ marginLeft: 8, color: 'var(--vermillion)' }}>● PDF</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => reorder(s.id, -1)} disabled={i === 0}>↑</button>
              <button className="btn" onClick={() => reorder(s.id, 1)} disabled={i === data.samples.length - 1}>↓</button>
              <button className="btn" onClick={() => setEditing(s)}>Edit</button>
              <button className="btn btn-danger" onClick={() => deleteSample(s)}>Delete</button>
            </div>
          </div>
        ))}
        {data.samples.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--slate)', fontSize: 14 }}>No samples yet. Add your first one.</div>
        )}
      </div>
    </>
  );
}

// ── About tab ─────────────────────────────────────────────────────────────────
function AboutTab({ data, reload }) {
  const [meta, setMeta] = useState({ name: data.meta.name, tagline: data.meta.tagline, location: data.meta.location });
  const [bio, setBio] = useState(data.bio || '');
  const [whatIDo, setWhatIDo] = useState(data.whatIDo || '');
  const [portrait, setPortrait] = useState(data.portrait || { src: null, filter: 'none' });
  const [portraitOriginal, setPortraitOriginal] = useState(null);
  const [tolerance, setTolerance] = useState(36);
  const [removing, setRemoving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);

  async function uploadPortraitFile(file) {
    setUploadingPortrait(true);
    try {
      const path = `portrait-${Date.now()}.${file.name.split('.').pop()}`;
      const url = await uploadFile('portraits', path, file, file.type);
      const orig = URL.createObjectURL(file);
      setPortrait(p => ({ ...p, src: url, filter: p.filter || 'none' }));
      setPortraitOriginal(url);
    } catch (err) {
      alert('Portrait upload failed: ' + err.message);
    } finally {
      setUploadingPortrait(false);
    }
  }

  async function handleRemoveBg() {
    if (!portrait.src) return;
    setRemoving(true);
    try {
      const processed = await removeBg(portraitOriginal || portrait.src, tolerance);
      // Upload processed version
      const blob = await (await fetch(processed)).blob();
      const path = `portrait-processed-${Date.now()}.png`;
      const url = await uploadFile('portraits', path, blob, 'image/png');
      setPortrait(p => ({ ...p, src: url }));
    } catch (err) {
      alert('Background removal failed: ' + err.message);
    } finally {
      setRemoving(false);
    }
  }

  async function saveAll() {
    setSaving(true);
    try {
      await supabase.from('site_meta').update({
        name: meta.name, tagline: meta.tagline, location: meta.location,
        bio, what_i_do: whatIDo,
        portrait_url: portrait.src,
        portrait_filter: portrait.filter,
      }).eq('id', 1);
      reload();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, margin: '0 0 16px' }}>Masthead</h2>
          <label className="field"><span>Name</span><input value={meta.name} onChange={e => setMeta(m => ({ ...m, name: e.target.value }))} /></label>
          <label className="field"><span>Tagline</span><input value={meta.tagline} onChange={e => setMeta(m => ({ ...m, tagline: e.target.value }))} /></label>
          <label className="field"><span>Location</span><input value={meta.location} onChange={e => setMeta(m => ({ ...m, location: e.target.value }))} /></label>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, margin: '0 0 16px' }}>Bio</h2>
          <label className="field"><span>Lead paragraph</span><textarea rows="5" value={bio} onChange={e => setBio(e.target.value)} /></label>
          <label className="field"><span>What I do (use — bullet points)</span><textarea rows="8" value={whatIDo} onChange={e => setWhatIDo(e.target.value)} /></label>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 28 }}>
        <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, margin: '0 0 16px' }}>Portrait</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>
          <PortraitDisplay portrait={portrait} size={220} />
          <div>
            <label className="field">
              <span>Upload portrait {uploadingPortrait ? '— uploading…' : ''}</span>
              <input type="file" accept="image/*" disabled={uploadingPortrait}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadPortraitFile(f); }}
                style={{ borderBottom: 'none', padding: 0 }} />
            </label>
            {portrait.src && (
              <>
                <label className="field">
                  <span>Filter</span>
                  <select value={portrait.filter || 'none'} onChange={e => setPortrait(p => ({ ...p, filter: e.target.value }))}>
                    {FILTER_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                </label>
                <div style={{ marginBottom: 14 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>
                    Background tolerance — {tolerance}
                  </div>
                  <input type="range" min="10" max="80" value={tolerance} onChange={e => setTolerance(+e.target.value)} style={{ width: '100%', borderBottom: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-primary" onClick={handleRemoveBg} disabled={removing}>
                    {removing ? 'Removing…' : 'Auto-remove background'}
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setPortrait({ src: null, filter: 'none' })}>Remove portrait</button>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>Filter preview</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {FILTER_OPTIONS.map(f => (
                      <div key={f.id} onClick={() => setPortrait(p => ({ ...p, filter: f.id }))} style={{ cursor: 'pointer', border: portrait.filter === f.id ? '2px solid var(--vermillion)' : '1px solid var(--hair)', padding: 3, background: 'var(--paper-2)', width: 64 }}>
                        <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                          <img src={portrait.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: getFilterCSS(f.id) }} />
                        </div>
                        <div style={{ fontSize: 9, marginTop: 3, color: portrait.filter === f.id ? 'var(--vermillion)' : 'var(--slate)', textAlign: 'center', fontFamily: 'var(--mono)' }}>{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <button className="btn btn-primary" onClick={saveAll} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ── Services tab ──────────────────────────────────────────────────────────────
function ServicesTab({ data, reload }) {
  const [services, setServices] = useState(data.services);
  const [saving, setSaving] = useState(false);

  function update(id, k, v) { setServices(ss => ss.map(s => s.id === id ? { ...s, [k]: v } : s)); }

  async function saveAll() {
    setSaving(true);
    try {
      await Promise.all(services.map(s => supabase.from('services').update({ title: s.title, description: s.description }).eq('id', s.id)));
      reload();
    } finally { setSaving(false); }
  }

  async function addService() {
    const maxOrder = Math.max(0, ...services.map(s => s.display_order || 0)) + 1;
    const { data: row } = await supabase.from('services').insert({ title: 'New service', description: '', display_order: maxOrder }).select().single();
    setServices(ss => [...ss, row]);
  }

  async function removeService(id) {
    if (!confirm('Remove this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    setServices(ss => ss.filter(s => s.id !== id));
    reload();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 48, margin: 0 }}>Services · {services.length}</h1>
        <button className="btn btn-primary" onClick={addService}>＋ Add service</button>
      </div>
      {services.map((s, i) => (
        <div key={s.id} style={{ border: '1px solid var(--hair)', padding: 18, marginBottom: 14, background: i % 2 ? 'var(--paper-2)' : 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>Service #{String(i + 1).padStart(2, '0')}</span>
            <button className="btn btn-danger" onClick={() => removeService(s.id)}>Remove</button>
          </div>
          <label className="field"><span>Title</span><input value={s.title} onChange={e => update(s.id, 'title', e.target.value)} /></label>
          <label className="field"><span>Description</span><textarea rows="2" value={s.description || ''} onChange={e => update(s.id, 'description', e.target.value)} /></label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={saveAll} disabled={saving}>{saving ? 'Saving…' : 'Save all services'}</button>
    </>
  );
}

// ── Methods tab ────────────────────────────────────────────────────────────────
function MethodsTab({ data, reload }) {
  const [methods, setMethods] = useState(data.process);
  const [saving, setSaving] = useState(false);

  function update(id, k, v) { setMethods(ms => ms.map(m => m.id === id ? { ...m, [k]: v } : m)); }

  async function saveAll() {
    setSaving(true);
    try {
      await Promise.all(methods.map(m => supabase.from('process_steps').update({ step_number: m.step, title: m.title, body: m.body }).eq('id', m.id)));
      reload();
    } finally { setSaving(false); }
  }

  async function addMethod() {
    const maxOrder = Math.max(0, ...methods.map(m => m.display_order || 0)) + 1;
    const { data: row } = await supabase.from('process_steps').insert({ step_number: '', title: 'New step', body: '', display_order: maxOrder }).select().single();
    setMethods(ms => [...ms, { id: row.id, step: row.step_number, title: row.title, body: row.body, display_order: row.display_order }]);
  }

  async function removeMethod(id) {
    if (!confirm('Remove this method step?')) return;
    await supabase.from('process_steps').delete().eq('id', id);
    setMethods(ms => ms.filter(m => m.id !== id));
    reload();
  }

  async function reorder(id, dir) {
    const arr = [...methods];
    const i = arr.findIndex(m => m.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    await Promise.all([
      supabase.from('process_steps').update({ display_order: arr[j].display_order }).eq('id', arr[i].id),
      supabase.from('process_steps').update({ display_order: arr[i].display_order }).eq('id', arr[j].id),
    ]);
    reload();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 48, margin: 0 }}>Methods · {methods.length}</h1>
        <button className="btn btn-primary" onClick={addMethod}>＋ Add method</button>
      </div>
      {methods.map((m, i) => (
        <div key={m.id} style={{ border: '1px solid var(--hair)', padding: 18, marginBottom: 14, background: i % 2 ? 'var(--paper-2)' : 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>Step #{String(i + 1).padStart(2, '0')}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn" onClick={() => reorder(m.id, -1)} disabled={i === 0}>↑</button>
              <button className="btn" onClick={() => reorder(m.id, 1)} disabled={i === methods.length - 1}>↓</button>
              <button className="btn btn-danger" onClick={() => removeMethod(m.id)}>Remove</button>
            </div>
          </div>
          <label className="field"><span>Step number</span><input value={m.step || ''} onChange={e => update(m.id, 'step', e.target.value)} /></label>
          <label className="field"><span>Title</span><input value={m.title} onChange={e => update(m.id, 'title', e.target.value)} /></label>
          <label className="field"><span>Description</span><textarea rows="3" value={m.body || ''} onChange={e => update(m.id, 'body', e.target.value)} /></label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={saveAll} disabled={saving}>{saving ? 'Saving…' : 'Save all methods'}</button>
    </>
  );
}

// ── Testimonials tab ───────────────────────────────────────────────────────────
function TestimonialsTab({ data, reload }) {
  const [testimonials, setTestimonials] = useState(data.testimonials);
  const [saving, setSaving] = useState(false);

  function update(id, k, v) { setTestimonials(ts => ts.map(t => t.id === id ? { ...t, [k]: v } : t)); }

  async function saveAll() {
    setSaving(true);
    try {
      await Promise.all(testimonials.map(t => supabase.from('testimonials').update({ quote: t.quote, author: t.author, role: t.role }).eq('id', t.id)));
      reload();
    } finally { setSaving(false); }
  }

  async function addTestimonial() {
    const maxOrder = Math.max(0, ...testimonials.map(t => t.display_order || 0)) + 1;
    const { data: row } = await supabase.from('testimonials').insert({ quote: 'New testimonial…', author: '', role: '', display_order: maxOrder }).select().single();
    setTestimonials(ts => [...ts, row]);
  }

  async function removeTestimonial(id) {
    if (!confirm('Remove this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(ts => ts.filter(t => t.id !== id));
    reload();
  }

  async function reorder(id, dir) {
    const arr = [...testimonials];
    const i = arr.findIndex(t => t.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    await Promise.all([
      supabase.from('testimonials').update({ display_order: arr[j].display_order }).eq('id', arr[i].id),
      supabase.from('testimonials').update({ display_order: arr[i].display_order }).eq('id', arr[j].id),
    ]);
    reload();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 48, margin: 0 }}>Testimonials · {testimonials.length}</h1>
        <button className="btn btn-primary" onClick={addTestimonial}>＋ Add testimonial</button>
      </div>
      {testimonials.map((t, i) => (
        <div key={t.id} style={{ border: '1px solid var(--hair)', padding: 18, marginBottom: 14, background: i % 2 ? 'var(--paper-2)' : 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>Testimonial #{String(i + 1).padStart(2, '0')}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn" onClick={() => reorder(t.id, -1)} disabled={i === 0}>↑</button>
              <button className="btn" onClick={() => reorder(t.id, 1)} disabled={i === testimonials.length - 1}>↓</button>
              <button className="btn btn-danger" onClick={() => removeTestimonial(t.id)}>Remove</button>
            </div>
          </div>
          <label className="field"><span>Quote</span><textarea rows="3" value={t.quote || ''} onChange={e => update(t.id, 'quote', e.target.value)} /></label>
          <label className="field"><span>Author</span><input value={t.author || ''} onChange={e => update(t.id, 'author', e.target.value)} /></label>
          <label className="field"><span>Role / Company</span><input value={t.role || ''} onChange={e => update(t.id, 'role', e.target.value)} /></label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={saveAll} disabled={saving}>{saving ? 'Saving…' : 'Save all testimonials'}</button>
    </>
  );
}

// ── Contact tab ───────────────────────────────────────────────────────────────
function ContactTab({ data, reload }) {
  const c = data.contact;
  const [form, setForm] = useState({ email: c.email, studio: c.location, hours: c.hours, rate: c.rate, next_available: c.nextAvailable });
  const [socials, setSocials] = useState(c.socials);
  const [saving, setSaving] = useState(false);

  function updateSocial(id, k, v) { setSocials(ss => ss.map(s => s.id === id ? { ...s, [k]: v } : s)); }

  async function saveAll() {
    setSaving(true);
    try {
      await supabase.from('contact_info').update(form).eq('id', 1);
      await Promise.all(socials.map(s => supabase.from('socials').update({ label: s.label, handle: s.handle, url: s.url }).eq('id', s.id)));
      reload();
    } finally { setSaving(false); }
  }

  async function addSocial() {
    const { data: row } = await supabase.from('socials').insert({ label: 'Link', handle: '@you', url: '#', display_order: socials.length }).select().single();
    setSocials(ss => [...ss, row]);
  }

  async function removeSocial(id) {
    await supabase.from('socials').delete().eq('id', id);
    setSocials(ss => ss.filter(s => s.id !== id));
  }

  const F = (label, key) => (
    <label className="field"><span>{label}</span><input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></label>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div>
        <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, margin: '0 0 16px' }}>Colophon</h2>
        {F('Email', 'email')} {F('Studio / Location', 'studio')} {F('Hours', 'hours')} {F('Rate', 'rate')} {F('Next available', 'next_available')}
      </div>
      <div>
        <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, margin: '0 0 16px' }}>Social links</h2>
        {socials.map(s => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 12, alignItems: 'end' }}>
            <label className="field" style={{ marginBottom: 0 }}><span>Label</span><input value={s.label} onChange={e => updateSocial(s.id, 'label', e.target.value)} /></label>
            <label className="field" style={{ marginBottom: 0 }}><span>Handle</span><input value={s.handle} onChange={e => updateSocial(s.id, 'handle', e.target.value)} /></label>
            <label className="field" style={{ marginBottom: 0 }}><span>URL</span><input value={s.url} onChange={e => updateSocial(s.id, 'url', e.target.value)} /></label>
            <button className="btn btn-danger" onClick={() => removeSocial(s.id)}>×</button>
          </div>
        ))}
        <button className="btn" onClick={addSocial}>＋ Add link</button>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button className="btn btn-primary" onClick={saveAll} disabled={saving}>{saving ? 'Saving…' : 'Save contact info'}</button>
      </div>
    </div>
  );
}

// ── Messages tab ──────────────────────────────────────────────────────────────
function MessagesTab() {
  const [msgs, setMsgs] = useState(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setMsgs(data || []);
      setLoading(false);
    });
  });

  async function markRead(id) {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setMsgs(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
  }

  if (loading) return <div style={{ color: 'var(--slate)', fontSize: 14 }}>Loading…</div>;
  if (!msgs?.length) return <div style={{ color: 'var(--slate)', fontSize: 14, padding: '40px 0' }}>No messages yet.</div>;

  return (
    <>
      <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 48, margin: '0 0 22px' }}>Messages · {msgs.length}</h1>
      {msgs.map(m => (
        <div key={m.id} style={{ border: '1px solid var(--hair)', padding: 20, marginBottom: 14, background: m.read ? 'transparent' : 'var(--paper-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <strong style={{ fontSize: 16 }}>{m.name}</strong>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--slate)', textTransform: 'uppercase', marginLeft: 12 }}>
                <a href={`mailto:${m.email}`} style={{ color: 'var(--vermillion)' }}>{m.email}</a>
              </span>
              {m.company && <span style={{ fontSize: 13, color: 'var(--slate)', marginLeft: 12 }}>· {m.company}</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {new Date(m.created_at).toLocaleDateString()}
              </span>
              {!m.read && <button className="btn" onClick={() => markRead(m.id)} style={{ fontSize: 9, padding: '4px 8px' }}>Mark read</button>}
              {!m.read && <span className="mono" style={{ fontSize: 9, color: 'var(--vermillion)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>● Unread</span>}
            </div>
          </div>
          {m.service_interest && <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Re: {m.service_interest}</div>}
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)', whiteSpace: 'pre-wrap' }}>{m.message}</p>
        </div>
      ))}
    </>
  );
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ data, onLogout, reload }) {
  const [tab, setTab] = useState('samples');

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>● Newsroom</span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>The Documentarian · Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={onLogout} style={{ color: 'var(--paper)', borderColor: 'rgba(242,235,221,0.4)' }}>← View site</button>
          <button className="btn btn-danger" onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="page" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', gap: 0 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: 'transparent', border: 'none', padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', borderBottom: tab === id ? '3px solid var(--vermillion)' : '3px solid transparent', color: tab === id ? 'var(--ink)' : 'var(--slate)', marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="page" style={{ paddingTop: 28, paddingBottom: 60 }}>
        {tab === 'samples'       && <SamplesTab       data={data} reload={reload} />}
        {tab === 'about'         && <AboutTab         data={data} reload={reload} />}
        {tab === 'services'      && <ServicesTab      data={data} reload={reload} />}
        {tab === 'methods'       && <MethodsTab       data={data} reload={reload} />}
        {tab === 'testimonials'  && <TestimonialsTab  data={data} reload={reload} />}
        {tab === 'contact'       && <ContactTab       data={data} reload={reload} />}
        {tab === 'messages'      && <MessagesTab />}
        {tab === 'danger'   && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 40, margin: '0 0 14px' }}>The shredder</h1>
            <p style={{ color: 'var(--ink-2)' }}>This will delete all samples and reset site content to the seed defaults. Cannot be undone.</p>
            <button className="btn btn-danger" onClick={async () => {
              if (!confirm('Reset all content to seed defaults? This cannot be undone.')) return;
              await Promise.all([
                supabase.from('samples').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
              ]);
              reload();
            }}>Delete all samples</button>
          </div>
        )}
      </div>
    </div>
  );
}
