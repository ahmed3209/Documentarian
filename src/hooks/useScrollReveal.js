import { useEffect } from 'react';

/**
 * Single IntersectionObserver that reveals any element carrying the
 * `.reveal` class as it scrolls into view. Respects prefers-reduced-motion.
 * Call once content is mounted (pass the data-ready flag as `active`).
 */
export function useScrollReveal(active) {
  useEffect(() => {
    if (!active) return;

    const els = Array.from(document.querySelectorAll('.reveal:not(.visible)'));
    if (!els.length) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [active]);
}
