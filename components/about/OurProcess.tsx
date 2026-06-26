import { processData } from "@/data/aboutData";

export default function OurProcess() {
  return (
    <section className="process-section">
      <div className="process-head reveal">
        <p className="eyebrow"><span className="eyebrow-line"></span>How it Works</p>
        <h2 className="process-h2">The Path to <em>Publication</em></h2>
        <p className="process-sub">A streamlined, transparent journey from submission to global distribution.</p>
      </div>

      <div className="process-track">
        {processData.map((step, i) => (
          <div key={step.id} className="process-step reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="process-photo">
              <img src={step.image} alt={step.title} loading="lazy" />
            </div>
            <div className="process-step-body">
              <div className="process-step-num">{step.num}</div>
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-text">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
