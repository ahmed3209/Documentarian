import SectionHead from './SectionHead';
import SampleCard from '../components/SampleCard';

export default function WorkSection({ data, onOpenSample }) {
  return (
    <section id="work" className="page" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <SectionHead kicker="Work" title="Selected work" dek="Click any sample to read the document." />
      <div className="work-grid">
        {data.samples.map(s => (
          <SampleCard key={s.id} sample={s} onOpen={onOpenSample} />
        ))}
      </div>
    </section>
  );
}
