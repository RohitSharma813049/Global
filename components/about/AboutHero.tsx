import { aboutHeroData } from "@/data/aboutData";

export default function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero-inner">
        <div>
          <p className="eyebrow"><span className="eyebrow-line"></span>About Global Scholar Publishing</p>
          <h1 className="about-h1">{aboutHeroData.titleStart} <em>{aboutHeroData.titleHighlight}</em>{aboutHeroData.titleEnd}</h1>
          
          {aboutHeroData.paragraphs.map((text, i) => (
            <p key={i} className="about-hero-text">{text}</p>
          ))}

          <div className="about-stats-row">
            {aboutHeroData.stats.map((stat, i) => (
              <div key={i}>
                <p className="about-stat-num">{stat.num}</p>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-hero-visual">
          <img src={aboutHeroData.image} alt="GSP academic community" loading="lazy" />
          <div className="visual-badge">
            <span className="visual-badge-text"><strong>{aboutHeroData.badgeTitle}</strong>{aboutHeroData.badgeText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
