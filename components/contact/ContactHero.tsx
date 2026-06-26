import { contactHeroData } from "@/data/contactData";

const icons = {
  editorial: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  general: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hq: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
};

export default function ContactHero() {
  return (
    <section className="ct-hero">
      <div className="ct-hero-inner">
        <p className="eyebrow"><span className="eyebrow-line"></span>We're Here for You</p>
        <h1 className="ct-h1">{contactHeroData.titleStart} <em>{contactHeroData.titleHighlight}</em></h1>
        <p className="ct-hero-text">
          {contactHeroData.text}
        </p>

        <div className="ct-info-grid">
          {contactHeroData.cards.map((card, index) => (
            <div key={index} className="ct-info-card reveal">
              <div className="ct-icon-wrap">
                {icons[card.icon as keyof typeof icons]}
              </div>
              <h3 className="ct-info-title">{card.title}</h3>
              <p className="ct-info-text">{card.text}</p>
              {card.linkHref && (
                <a href={card.linkHref} className="ct-info-link">{card.linkText}</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
