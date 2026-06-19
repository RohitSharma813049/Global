"use client";
import { useState } from "react";
import Link from "next/link";

export interface Scholar {
  id: string;
  name: string;
  initials: string;
  professional_role: string;
  country: string;
  country_code: string;
  flag_emoji: string;
  domain: string;
  description: string;
  is_honorary: boolean;
  is_verified: boolean;
  is_featured: boolean;
  total_views?: number;
  total_downloads?: number;
  avatar_url?: string;
  banner_url?: string;
}

export interface ScholarVideo {
  id: string;
  scholar_id: string;
  title: string;
  metadata: string;
  video_url: string;
  is_main_video: boolean;
}

export interface ScholarPublication {
  id: string;
  scholar_id: string;
  title: string;
  metadata: string;
  tag: string;
  url: string;
}

interface Props {
  scholar?: Scholar;
  videos?: ScholarVideo[];
  publications?: ScholarPublication[];
  allScholars?: Scholar[];
  isOwner?: boolean;
}

// ── THEME COLORS ──────────────────────────────────────────────
const theme = {
  bgWhite: "#FFFFFF",
  bgLightPurple: "#EDE9FA",       
  bgLightPurple2: "#F5F3FD",     
  bgLightPurple3: "#DDD8F7",     
  darkPurple: "#4A2D8F",          
  darkPurpleHover: "#3A2070",
  textBlack: "#111111",
  textGray: "#555555",
  textMuted: "#888888",
  border: "#D9D3F0",
  borderLight: "#EDE9FA",
};

// ── BADGE VARIANTS ────────────────────────────────────────────
const badgeStyles = {
  honorary: { background: "#EDE9FA", color: "#4A2D8F" },
  verified: { background: "#E1F5EE", color: "#085041" },
  featured: { background: "#DDD8F7", color: "#4A2D8F" },
  country: { background: "#EDE9FA", color: "#4A2D8F" },
  domain: { background: "#F1EFE8", color: "#444441" },
};

export default function GSPDistinguishedScholars({ scholar, videos = [], publications = [], allScholars = [], isOwner = false }: Props) {
  const [activeSection] = useState("profile");

  if (!scholar) return null;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: theme.bgWhite, minHeight: "100vh", color: theme.textBlack }}>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .scholar-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .video-thumb-row { grid-template-columns: 1fr !important; }
          .step-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .prof-top { flex-direction: column !important; align-items: center !important; text-align: center; }
          .action-row { justify-content: center !important; }
          .badge-row { justify-content: center !important; }
          .country-row { justify-content: center !important; }
          .pub-item { flex-direction: column !important; gap: 6px !important; }
        }
        @media (max-width: 480px) {
          .scholar-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .step-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
        .btn-primary:hover { background: #3A2070 !important; }
        .btn-video:hover { background: #3A2070 !important; border-color: #3A2070 !important; }
        .btn-outline:hover { background: #EDE9FA !important; }
        .pub-title-link:hover { text-decoration: underline; }
        .scholar-card:hover { border-color: #4A2D8F !important; box-shadow: 0 2px 12px rgba(74,45,143,0.10); transform: translateY(-2px); transition: all 0.2s; }
        .c-pill:hover { border-color: #4A2D8F !important; }
      `}</style>

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
        
        <Link href="/" style={{ display: "inline-block", marginBottom: 20, fontSize: 13, color: theme.darkPurple, textDecoration: "none", fontWeight: 600 }}>&larr; Back to Home</Link>

        {/* ── PROFILE CARD ── */}
        <Card style={{ marginBottom: 12 }}>
          <div className="prof-top" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {scholar.avatar_url ? (
                <div style={{ width: 84, height: 84, borderRadius: "50%", border: `2px solid ${theme.border}`, overflow: "hidden" }}>
                  <img src={scholar.avatar_url} alt={scholar.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: theme.bgLightPurple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: theme.darkPurple, border: `2px solid ${theme.border}` }}>
                  {scholar.initials}
                </div>
              )}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#FAEEDA", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{scholar.flag_emoji}</div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 19, fontWeight: 700, color: theme.textBlack, marginBottom: 3 }}>{scholar.name}</h1>
              <p style={{ fontSize: 13, color: theme.textGray, marginBottom: 10 }}>{scholar.professional_role} · {scholar.country}</p>

              <div className="badge-row" style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {scholar.is_honorary && <Badge style={badgeStyles.honorary}>Honorary</Badge>}
                {scholar.is_verified && <Badge style={badgeStyles.verified}>✓ Verified</Badge>}
                {scholar.is_featured && <Badge style={badgeStyles.featured}>Featured</Badge>}
                <Badge style={badgeStyles.country}>{scholar.flag_emoji} {scholar.country}</Badge>
                <Badge style={badgeStyles.domain}>{scholar.domain}</Badge>
              </div>

              <div className="action-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "none", background: theme.darkPurple, color: "white", fontWeight: 600 }}>+ Add to LinkedIn</button>
                {videos.length > 0 && (
                  <button className="btn-video" style={{ fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "none", background: theme.darkPurple, color: "white", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="11" height="11" viewBox="0 0 12 12"><polygon points="3,1 11,6 3,11" fill="white"/></svg>
                    Watch video
                  </button>
                )}
                {isOwner && (
                  <Link href="/dashboard/settings" style={{ textDecoration: "none" }}>
                    <button className="btn-outline" style={{ fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid ${theme.border}`, background: "white", color: theme.textGray }}>Edit Profile</button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: theme.textGray, lineHeight: 1.7, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.borderLight}` }}>
            {scholar.description}
          </p>
        </Card>

        {/* ── DISTINCTION NOTICE ── */}
        {scholar.is_honorary && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: theme.bgLightPurple, borderRadius: 10, padding: "12px 16px", marginBottom: 12, borderLeft: `3px solid ${theme.darkPurple}` }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="8" cy="8" r="7" stroke={theme.darkPurple} strokeWidth="1.3"/>
              <text x="8" y="12" textAnchor="middle" fontSize="10" fill={theme.darkPurple} fontFamily="Georgia">★</text>
            </svg>
            <p style={{ fontSize: 12.5, color: "#2E1A60", lineHeight: 1.6 }}>
              <strong>Honorary Doctorate — Professional Excellence Recognition.</strong> This profile recognises a distinguished professional awarded an honorary doctorate for exceptional real-world contribution to their field. This is an honorary award distinct from a research qualification, conferred in recognition of professional achievement and industry leadership.
            </p>
          </div>
        )}

        {/* ── STATS GRID ── */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { n: (scholar.total_views || 0).toLocaleString(), l: "Profile views" },
            { n: publications.length.toString(), l: "Publications" },
            { n: (scholar.total_downloads || 0).toLocaleString(), l: "Downloads" },
          ].map((s) => (
            <div key={s.l} style={{ background: theme.bgLightPurple, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.darkPurple }}>{s.n}</div>
              <div style={{ fontSize: 11, color: theme.textGray, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── VIDEO SECTION ── */}
        {videos.length > 0 && (
          <Card style={{ marginBottom: 12 }}>
            <SectionTitle>Scholar video — experience & insights</SectionTitle>
            <div style={{ background: "#0D1117", borderRadius: 10, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.3)", marginBottom: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="5,3 22,12 5,21" fill="rgba(255,255,255,0.9)"/></svg>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{videos[0].title}</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{videos[0].metadata}</div>
              </div>
            </div>
          </Card>
        )}

        {/* ── CREDENTIAL & LOCATION ── */}
        <Card style={{ marginBottom: 12 }}>
          <SectionTitle>Credential & location</SectionTitle>
          {[
            { k: "Domain", v: scholar.domain },
            { k: "Country", v: `${scholar.flag_emoji} ${scholar.country}` },
            { k: "Profile verified", v: scholar.is_verified ? "Verified by Global Scholar Publications" : "Unverified", highlight: scholar.is_verified },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${theme.borderLight}` : "none", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: theme.textGray, flexShrink: 0 }}>{row.k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: row.highlight ? "#085041" : theme.textBlack, textAlign: "right" }}>{row.v}</span>
            </div>
          ))}
        </Card>

        {/* ── PUBLICATIONS ── */}
        {publications.length > 0 && (
          <Card style={{ marginBottom: 12 }}>
            <SectionTitle>Published works on Global Scholar Publications</SectionTitle>
            {publications.map((p, i) => (
              <div key={i} className="pub-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < publications.length - 1 ? `1px solid ${theme.borderLight}` : "none", gap: 12 }}>
                <div>
                  <Link href={`/publications/${p.id}`} style={{ textDecoration: "none" }}>
                    <p className="pub-title-link" style={{ fontSize: 13, fontWeight: 600, color: theme.darkPurple, marginBottom: 3, cursor: "pointer" }}>{p.title}</p>
                  </Link>
                  <p style={{ fontSize: 11.5, color: theme.textMuted }} dangerouslySetInnerHTML={{ __html: p.metadata }} />
                </div>
                <span style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 12, background: "#E1F5EE", color: "#085041", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}>{p.tag}</span>
              </div>
            ))}
          </Card>
        )}

      </div>
    </div>
  );
}

// ── REUSABLE COMPONENTS ────────────────────────────────────────

function SectionLabel({ children, style }: any) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7, ...style }}>{children}</p>
  );
}

function Card({ children, style }: any) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #D9D3F0", borderRadius: 14, padding: "1.25rem", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: any) {
  return (
    <p style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12, paddingBottom: 9, borderBottom: "1px solid #EDE9FA" }}>{children}</p>
  );
}

function Badge({ children, style }: any) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, ...style }}>{children}</span>
  );
}
