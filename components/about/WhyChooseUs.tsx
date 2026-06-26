import { whyChooseUsData } from "@/data/aboutData";

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-head reveal">
        <p className="eyebrow"><span className="eyebrow-line"></span>The GSP Difference</p>
        <h2 className="why-h2">Why Scholars <em>Choose Us</em></h2>
      </div>

      <div className="why-grid">
        {whyChooseUsData.map((item, i) => (
          <div key={item.id} className="why-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <p className="why-num">{item.num}</p>
            <div className="why-photo">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <h3 className="why-card-title">{item.title}</h3>
            <p className="why-card-text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
