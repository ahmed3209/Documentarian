export function getFilterCSS(filter) {
  switch (filter) {
    case 'grayscale':           return 'grayscale(1) contrast(1.05)';
    case 'duotone-vermillion':  return 'grayscale(1) contrast(1.1) sepia(0.6) hue-rotate(-30deg) saturate(2.4)';
    case 'high-contrast':       return 'grayscale(1) contrast(1.6) brightness(0.95)';
    case 'halftone':            return 'grayscale(1) contrast(1.4) brightness(1.05)';
    case 'sepia':               return 'sepia(0.7) contrast(1.05) brightness(1.02)';
    case 'blueprint':           return 'grayscale(1) contrast(1.2) sepia(0.4) hue-rotate(170deg) saturate(2)';
    case 'soft':                return 'grayscale(0.4) contrast(0.95) brightness(1.05)';
    default:                    return 'none';
  }
}

export const FILTER_OPTIONS = [
  { id: 'none', label: 'Original' },
  { id: 'grayscale', label: 'Grayscale' },
  { id: 'high-contrast', label: 'High contrast' },
  { id: 'duotone-vermillion', label: 'Duotone (red)' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'halftone', label: 'Halftone' },
  { id: 'soft', label: 'Soft' },
];

export default function PortraitDisplay({ portrait, size = 260 }) {
  const filter = getFilterCSS(portrait?.filter || 'none');
  const isHalftone = portrait?.filter === 'halftone';

  return (
    <div style={{ width: size, maxWidth: '100%', aspectRatio: '4/5', background: 'var(--paper-2)', border: '1px solid var(--hair)', position: 'relative', overflow: 'hidden', borderRadius: 11 }}>
      {portrait?.src ? (
        <>
          <img
            src={portrait.src}
            alt="Portrait"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter }}
          />
          {isHalftone && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(20,17,13,0.55) 1px, transparent 1.5px)', backgroundSize: '4px 4px', mixBlendMode: 'multiply' }} />
          )}
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--slate)', fontSize: 13 }}>
          Portrait
        </div>
      )}
    </div>
  );
}
