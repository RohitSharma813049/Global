import { visionMissionData } from "@/data/aboutData";

export default function VisionMission() {
  const { vision, mission } = visionMissionData;
  return (
    <section className="vm-section">
      <div className="vm-head reveal">
        <p className="eyebrow"><span className="eyebrow-line"></span>Purpose</p>
        <h2 className="vm-h2">Redefining the <em>Future</em> of Research</h2>
      </div>

      <div className="vm-grid">
        <div className="vm-card violet-accent reveal" id="visionCard">
          <div className="vm-card-photo">
            <img src={vision.image} alt={vision.title} loading="lazy" />
          </div>
          <h3 className="vm-card-title">{vision.title}</h3>
          <p className="vm-card-text">{vision.text}</p>
        </div>

        <div className="vm-card gold-accent reveal" id="missionCard">
          <div className="vm-card-photo">
            <img src={mission.image} alt={mission.title} loading="lazy" />
          </div>
          <h3 className="vm-card-title">{mission.title}</h3>
          <p className="vm-card-text">{mission.text}</p>
        </div>
      </div>
    </section>
  );
}
