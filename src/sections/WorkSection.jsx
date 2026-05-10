import SectionHead from './SectionHead';
import SampleCard from '../components/SampleCard';

export default function WorkSection({ data, onOpenSample }) {
  return (
    <section id="work" className="page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <SectionHead kicker="Work" title="Selected work" dek="Click any sample to read the document." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 36 }}>
        {data.samples.map(s => (
          <SampleCard key={s.id} sample={s} onOpen={onOpenSample} />
        ))}
      </div>
    </section>
  );
}
