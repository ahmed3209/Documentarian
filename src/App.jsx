import { useState, useEffect, Suspense, lazy } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { usePortfolioData } from './hooks/useData';
import { useScrollReveal } from './hooks/useScrollReveal';
import Masthead from './components/Masthead';
import Footer from './components/Footer';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import WorkSection from './sections/WorkSection';
import ProcessSection from './sections/ProcessSection';
import VoicesSection from './sections/VoicesSection';
import ContactSection from './sections/ContactSection';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';

const PDFViewer = lazy(() => import('./components/PDFViewer'));

export default function App() {
  const { data, loading, error, reload } = usePortfolioData();
  const [route, setRoute] = useState(() => location.hash === '#admin' ? 'admin-login' : 'public');
  const [openSample, setOpenSample] = useState(null);
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.dataset.typeface = 'modern';
    document.body.dataset.density = 'comfortable';
  }, []);

  useEffect(() => {
    document.body.dataset.palette = theme === 'dark' ? 'charcoal' : 'cream';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Reveal-on-scroll once the public content is mounted
  useScrollReveal(route === 'public' && !!data);

  if (!isConfigured) {
    return (
      <div className="boot" style={{ gap: 16, textAlign: 'center', padding: '0 24px' }}>
        <img src="/logo.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', opacity: 0.85 }} />
        <div>Supabase not configured</div>
        <div style={{ fontSize: 12, letterSpacing: '0.05em', textTransform: 'none', maxWidth: 420, lineHeight: 1.7, opacity: 0.7 }}>
          Copy <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px' }}>.env.example</code> to{' '}
          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px' }}>.env</code> and fill in your Supabase URL and anon key,
          then restart the dev server.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="boot">
        <img src="/logo.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', marginBottom: 14, opacity: 0.85 }} />
        <div>Loading the press …</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="boot" style={{ gap: 12, textAlign: 'center', padding: '0 24px' }}>
        <div>Failed to load portfolio data.</div>
        <div style={{ fontSize: 12, opacity: 0.6, textTransform: 'none', letterSpacing: '0.05em' }}>
          {error?.message || 'Check your Supabase credentials and run the schema SQL.'}
        </div>
      </div>
    );
  }

  function gotoAdmin() { location.hash = '#admin'; setRoute('admin-login'); }
  function leaveAdmin() { location.hash = ''; setRoute('public'); }

  if (route === 'admin-login') {
    return <AdminLogin session={session} onAuth={() => setRoute('admin')} onClose={leaveAdmin} />;
  }
  if (route === 'admin') {
    if (!session) return <AdminLogin session={session} onAuth={() => setRoute('admin')} onClose={leaveAdmin} />;
    return <AdminPanel data={data} onLogout={leaveAdmin} reload={reload} />;
  }

  return (
    <>
      <Masthead
        data={data}
        onAdminPing={gotoAdmin}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <WorkSection data={data} onOpenSample={setOpenSample} />
      <ProcessSection data={data} />
      <VoicesSection data={data} />
      <ContactSection data={data} />
      <Footer data={data} onAdminPing={gotoAdmin} />
      {openSample && (
        <Suspense fallback={null}>
          <PDFViewer sample={openSample} onClose={() => setOpenSample(null)} />
        </Suspense>
      )}
    </>
  );
}
