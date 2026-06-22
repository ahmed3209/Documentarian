import SectionHead from './SectionHead';
import SampleCard from '../components/SampleCard';

export default function WorkSection({ data, onOpenSample }) {
  return (
    <section id="work" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead kicker="Work" title="Selected work" dek="Click any sample to read the document." />
      {data.samples.length === 0 ? (
        <div className="empty-state reveal">
          <div className="es-title">No samples yet</div>
          <div className="es-body">Selected work will appear here once it's published.</div>
        </div>
      ) : (
        <div className="work-grid">
          {data.samples.map((s, i) => (
            <SampleCard key={s.id} sample={s} onOpen={onOpenSample} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
