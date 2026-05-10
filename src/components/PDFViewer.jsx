import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const NAV_BTN = (disabled) => ({
  background: 'transparent', color: 'var(--paper)',
  border: '1px solid rgba(242,235,221,0.3)', padding: '6px 10px',
  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
  textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
});

export default function PDFViewer({ sample, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pdfWidth, setPdfWidth] = useState(760);

  useEffect(() => {
    const update = () => setPdfWidth(Math.min(760, window.innerWidth - 48));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPageNum(n => Math.min(numPages || 1, n + 1));
      if (e.key === 'ArrowLeft') setPageNum(n => Math.max(1, n - 1));
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [numPages, onClose]);

  const hasPdf = Boolean(sample.pdf_url);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,17,13,0.92)', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(2px)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(242,235,221,0.15)', color: 'var(--paper)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
          <span style={{ color: 'var(--vermillion)' }}>● PDF Preview</span>
          <span style={{ opacity: 0.8 }}>{sample.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {hasPdf && numPages && (
            <>
              <button onClick={() => setPageNum(n => Math.max(1, n - 1))} disabled={pageNum === 1} style={NAV_BTN(pageNum === 1)}>← Prev</button>
              <span>{pageNum} / {numPages}</span>
              <button onClick={() => setPageNum(n => Math.min(numPages, n + 1))} disabled={pageNum === numPages} style={NAV_BTN(pageNum === numPages)}>Next →</button>
            </>
          )}
          <button onClick={onClose} style={{ background: 'var(--vermillion)', color: 'var(--paper)', border: 'none', padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Close ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
        {!hasPdf ? (
          <div style={{ textAlign: 'center', color: 'rgba(242,235,221,0.5)', paddingTop: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>No PDF uploaded yet</div>
            <div style={{ marginTop: 10, fontSize: 14, textTransform: 'none', letterSpacing: 0 }}>
              Upload a PDF in the admin panel to view it here.
            </div>
          </div>
        ) : (
          <Document
            file={sample.pdf_url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div style={{ color: 'rgba(242,235,221,0.5)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', paddingTop: 80 }}>
                Loading PDF…
              </div>
            }
            error={
              <div style={{ color: 'var(--vermillion)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', paddingTop: 80, textAlign: 'center' }}>
                <div>Failed to load PDF.</div>
                <div style={{ marginTop: 8, opacity: 0.6, textTransform: 'none', letterSpacing: 0 }}>The file may be unavailable or the URL is incorrect.</div>
              </div>
            }
          >
            <div style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}>
              <Page
                pageNumber={pageNum}
                width={pdfWidth}
                renderAnnotationLayer
                renderTextLayer
              />
            </div>
          </Document>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderTop: '1px solid rgba(242,235,221,0.15)', color: 'rgba(242,235,221,0.6)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        <span>{sample.client} · {sample.year} · {sample.kind}</span>
        <span>← → to navigate · Esc to close</span>
      </div>
    </div>
  );
}
