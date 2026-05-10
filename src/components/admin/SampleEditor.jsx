import { useState } from 'react';
import { supabase, uploadFile, deleteFile } from '../../lib/supabase';

export default function SampleEditor({ sample, onSave, onCancel }) {
  const isNew = !sample.id;
  const [form, setForm] = useState({
    title: sample.title || '',
    kind: sample.kind || '',
    year: sample.year || new Date().getFullYear().toString(),
    client: sample.client || '',
    excerpt: sample.excerpt || '',
    tags: (sample.tags || []).join(', '),
    thumb: sample.thumb || null,
    pdf_url: sample.pdf_url || null,
  });
  const [uploading, setUploading] = useState({ pdf: false, thumb: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function uploadPdf(file) {
    setUploading(u => ({ ...u, pdf: true }));
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${file.name}`;
      const url = await uploadFile('pdfs', path, file, 'application/pdf');
      set('pdf_url', url);
    } catch (err) {
      setError('PDF upload failed: ' + err.message);
    } finally {
      setUploading(u => ({ ...u, pdf: false }));
    }
  }

  async function uploadThumb(file) {
    setUploading(u => ({ ...u, thumb: true }));
    try {
      const path = `${Date.now()}-${file.name}`;
      const url = await uploadFile('thumbnails', path, file, file.type);
      set('thumb', url);
    } catch (err) {
      setError('Thumbnail upload failed: ' + err.message);
    } finally {
      setUploading(u => ({ ...u, thumb: false }));
    }
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');
    const payload = {
      title: form.title.trim(),
      kind: form.kind,
      year: form.year,
      client: form.client,
      excerpt: form.excerpt,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      thumb_url: form.thumb,
      pdf_url: form.pdf_url,
    };
    try {
      if (isNew) {
        const maxOrder = await supabase.from('samples').select('display_order').order('display_order', { ascending: false }).limit(1);
        const next = ((maxOrder.data?.[0]?.display_order) ?? -1) + 1;
        const { data, error } = await supabase.from('samples').insert({ ...payload, display_order: next }).select().single();
        if (error) throw error;
        onSave(data);
      } else {
        const { data, error } = await supabase.from('samples').update(payload).eq('id', sample.id).select().single();
        if (error) throw error;
        onSave(data);
      }
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(20,17,13,0.94)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(242,235,221,0.2)', display: 'flex', justifyContent: 'space-between', color: 'var(--paper)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', flexWrap: 'wrap', gap: 12 }}>
        <span><span style={{ color: 'var(--vermillion)' }}>● {isNew ? 'New' : 'Editing'}</span>  {form.title || '(untitled)'}</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" onClick={onCancel} style={{ color: 'var(--paper)', borderColor: 'rgba(242,235,221,0.4)' }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--paper)', padding: 32, border: '1px solid var(--rule)' }}>
          {error && <div style={{ background: '#fff0ee', border: '1px solid var(--vermillion)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--vermillion)' }}>{error}</div>}

          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--vermillion)', textTransform: 'uppercase' }}>Work Sample</div>
          <h2 style={{ fontFamily: 'var(--serif-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 36, margin: '6px 0 24px' }}>
            {isNew ? 'New specimen' : 'Edit specimen'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 18 }}>
            <label className="field"><span>Title</span><input value={form.title} onChange={e => set('title', e.target.value)} /></label>
            <label className="field"><span>Kind / Type</span><input value={form.kind} onChange={e => set('kind', e.target.value)} placeholder="API Reference" /></label>
            <label className="field"><span>Year</span><input value={form.year} onChange={e => set('year', e.target.value)} /></label>
          </div>
          <label className="field"><span>Client</span><input value={form.client} onChange={e => set('client', e.target.value)} /></label>
          <label className="field"><span>Excerpt / Summary</span><textarea rows="3" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} /></label>
          <label className="field"><span>Tags (comma-separated)</span><input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="api, docs, fintech" /></label>

          {/* PDF upload */}
          <div style={{ borderTop: '4px double var(--rule)', margin: '28px 0 20px' }} />
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--vermillion)', textTransform: 'uppercase', marginBottom: 8 }}>PDF Document</div>

          {form.pdf_url ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '12px 14px', background: 'var(--paper-2)', border: '1px solid var(--hair)' }}>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)', wordBreak: 'break-all' }}>✓ PDF uploaded</span>
              <a href={form.pdf_url} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 10, padding: '6px 10px' }}>Preview</a>
              <button className="btn btn-danger" style={{ fontSize: 10, padding: '6px 10px' }} onClick={() => set('pdf_url', null)}>Remove</button>
            </div>
          ) : (
            <label className="field">
              <span>Upload PDF {uploading.pdf ? '— uploading…' : ''}</span>
              <input type="file" accept="application/pdf" disabled={uploading.pdf}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadPdf(f); }}
                style={{ borderBottom: 'none', padding: 0 }} />
            </label>
          )}

          {/* Thumbnail upload */}
          <div style={{ borderTop: '1px solid var(--hair)', margin: '20px 0 16px' }} />
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: 8 }}>Thumbnail (optional — leave blank for auto-generated)</div>

          {form.thumb ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <img src={form.thumb} alt="" style={{ width: 80, height: 100, objectFit: 'cover', border: '1px solid var(--hair)' }} />
              <button className="btn btn-danger" onClick={() => set('thumb', null)}>Remove thumbnail</button>
            </div>
          ) : (
            <label className="field">
              <span>Upload thumbnail image {uploading.thumb ? '— uploading…' : ''}</span>
              <input type="file" accept="image/*" disabled={uploading.thumb}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumb(f); }}
                style={{ borderBottom: 'none', padding: 0 }} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
