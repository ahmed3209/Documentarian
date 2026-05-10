import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function transform(raw) {
  return {
    meta: {
      name: raw.meta?.name || 'Your Name',
      tagline: raw.meta?.tagline || 'Your Title',
      location: raw.meta?.location || '',
      logo: raw.meta?.logo_url || '/logo.png',
    },
    bio: raw.meta?.bio || '',
    whatIDo: raw.meta?.what_i_do || '',
    portrait: {
      src: raw.meta?.portrait_url || null,
      filter: raw.meta?.portrait_filter || 'none',
    },
    samples: (raw.samples || []).map(s => ({
      id: s.id,
      title: s.title,
      kind: s.kind,
      year: s.year,
      client: s.client,
      excerpt: s.excerpt,
      tags: s.tags || [],
      thumb: s.thumb_url,
      pdf_url: s.pdf_url,
      display_order: s.display_order,
    })),
    services: raw.services || [],
    process: (raw.process || []).map(p => ({
      id: p.id,
      step: p.step_number,
      title: p.title,
      body: p.body,
      display_order: p.display_order,
    })),
    testimonials: raw.testimonials || [],
    contact: {
      email: raw.contact?.email || '',
      location: raw.contact?.studio || '',
      hours: raw.contact?.hours || '',
      rate: raw.contact?.rate || '',
      nextAvailable: raw.contact?.next_available || '',
      socials: raw.socials || [],
    },
  };
}

export function usePortfolioData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meta, samples, services, process, testimonials, socials, contact] = await Promise.all([
        supabase.from('site_meta').select('*').single(),
        supabase.from('samples').select('*').order('display_order', { ascending: true }),
        supabase.from('services').select('*').order('display_order', { ascending: true }),
        supabase.from('process_steps').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
        supabase.from('socials').select('*').order('display_order', { ascending: true }),
        supabase.from('contact_info').select('*').single(),
      ]);

      const anyError = [meta, samples, services, process, testimonials, socials, contact].find(r => r.error);
      if (anyError?.error) throw anyError.error;

      setData(transform({
        meta: meta.data,
        samples: samples.data,
        services: services.data,
        process: process.data,
        testimonials: testimonials.data,
        socials: socials.data,
        contact: contact.data,
      }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
