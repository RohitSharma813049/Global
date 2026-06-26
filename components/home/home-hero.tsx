"use client"

import React, { useState, useEffect } from 'react'


export default function HomeHero() {
  const [cur, setCur] = useState(0)

  const slides = [
    {
      label: 'Featured Article',
      title: 'ESG Integration in GCC Markets: A Framework for Sustainable Finance',
      author: 'Dr. Priya Nair-Kapoor',
      cred: 'Hon. D.B.A.',
      badge: 'eBook',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&crop=face&auto=format&q=80',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=900&fit=crop&auto=format&q=85'
    },
    {
      label: 'Research Paper',
      title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm',
      author: 'Dr. Ngozi Adeyemi',
      cred: 'Ph.D., FAAN',
      badge: 'Article',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&face&auto=format&q=80',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=900&fit=crop&auto=format&q=85'
    },
    {
      label: 'GSP Interview Series',
      title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050',
      author: 'Dr. Amira Al-Rashidi',
      cred: 'Hon. D.Sc.',
      badge: 'Magazine',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&h=60&fit=crop&crop=face&auto=format&q=80',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=900&fit=crop&auto=format&q=85'
    },
    {
      label: 'Featured eBook',
      title: 'GCC Economic Diversification: Vision 2030 and Beyond',
      author: 'Prof. Khalid Al-Mansouri',
      cred: 'Hon. D.B.A.',
      badge: 'eBook',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format&q=80',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=900&fit=crop&auto=format&q=85'
    },
    {
      label: 'Doctoral Thesis',
      title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments',
      author: 'Prof. Li Wei',
      cred: 'Ph.D.',
      badge: 'Thesis',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format&q=80',
      image: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=1200&h=900&fit=crop&auto=format&q=85'
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCur((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Articles', 'eBooks', 'Theses', 'Magazines', 'Scholars']

  const d = slides[cur]

  return (
    <div className="home-hero-container">
      <div className="ticker">
        <span className="ticker-label">Latest</span>
        <div className="ticker-track-wrap">
          <div className="ticker-track" id="ticker">
            <span className="ticker-item"><strong>New:</strong> ESG & Sustainable Finance — Dr. Priya Nair-Kapoor</span>
            <span className="ticker-item"><strong>Featured:</strong> GCC Economic Diversification — Prof. Khalid Al-Mansouri</span>
            <span className="ticker-item"><strong>Open Access:</strong> Decolonising Knowledge Systems — Dr. Ngozi Adeyemi</span>
            <span className="ticker-item"><strong>eBook:</strong> AI Ethics in Global Research — Prof. Li Wei</span>
            <span className="ticker-item"><strong>Interview:</strong> GSP Series — Dr. Amira Al-Rashidi on Climate Policy</span>
            <span className="ticker-item"><strong>New:</strong> ESG & Sustainable Finance — Dr. Priya Nair-Kapoor</span>
            <span className="ticker-item"><strong>Featured:</strong> GCC Economic Diversification — Prof. Khalid Al-Mansouri</span>
            <span className="ticker-item"><strong>Open Access:</strong> Decolonising Knowledge Systems — Dr. Ngozi Adeyemi</span>
            <span className="ticker-item"><strong>eBook:</strong> AI Ethics in Global Research — Prof. Li Wei</span>
            <span className="ticker-item"><strong>Interview:</strong> GSP Series — Dr. Amira Al-Rashidi on Climate Policy</span>
          </div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow"><span className="eyebrow-line"></span>Peer-Reviewed · Open Access · Global Impact</p>

          <h1 className="hero-h1">
            Advancing Global<br />
            <em>Scholarly Excellence</em>
          </h1>

          <p className="hero-sub">
            A home for distinguished scholars, honorary doctorate holders,
            and original research voices — connecting ideas across 80 nations
            and 350+ peer-reviewed journals.
          </p>

          <div className="search-wrap">
            <span className="search-ico">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input className="search-input" type="text"
              placeholder="Search journals, papers, authors, books…"
              aria-label="Search publications" />
            <button className="search-btn-inline">Search</button>
          </div>

          <div className="filter-pills">
            {filters.map(f => (
              <button 
                key={f} 
                className={`fpill ${filter === f ? 'on' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="ctas">
            <button className="btn-p">
              Explore Publications
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-s">Meet Our Scholars</button>
          </div>

          <div className="trust-row">
            <div className="trust-avatars">
              <div className="trust-avatar">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face&auto=format&q=80" alt="Scholar" loading="lazy" />
              </div>
              <div className="trust-avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=80" alt="Scholar" loading="lazy" />
              </div>
              <div className="trust-avatar">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=80" alt="Scholar" loading="lazy" />
              </div>
              <div className="trust-avatar">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=80" alt="Scholar" loading="lazy" />
              </div>
            </div>
            <p className="trust-text"><strong>25,000+ researchers</strong> published<br />across 80 countries this year</p>
          </div>
        </div>

        <div className="hero-right">
          <div className="photo-carousel">
            {slides.map((s, i) => (
              <div 
                key={i} 
                className={`photo-slide ${i === cur ? 'active' : ''}`} 
                style={{ backgroundImage: `url('${s.image}')` }}
              ></div>
            ))}
          </div>

          <div className="photo-overlay"></div>

          <div className="photo-top">
            <div className="top-pill">
              <div className="top-pill-dot"></div>
              Open Access 2026
            </div>
          </div>

          <div className="photo-content">
            <div className="featured-card">
              <p className="feat-label">{d.label}</p>
              <p className="feat-title">{d.title}</p>
              <div className="feat-meta">
                <div className="feat-avatar">
                  <img src={d.avatar} alt="Author" />
                </div>
                <span className="feat-author"><strong>{d.author}</strong> · {d.cred}</span>
                <span className="feat-badge">{d.badge}</span>
              </div>
            </div>

            <div className="slide-nav">
              <div className="slide-dots">
                {slides.map((_, i) => (
                  <button 
                    key={i} 
                    className={`sdot ${i === cur ? 'on' : ''}`} 
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setCur(i)}
                  ></button>
                ))}
              </div>
              <span className="slide-counter">0{cur + 1} / 0{slides.length}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="sc"><div className="sc-n">12K+</div><div className="sc-l">Publications</div></div>
        <div className="sc"><div className="sc-n">350+</div><div className="sc-l">Journals</div></div>
        <div className="sc"><div className="sc-n">25K+</div><div className="sc-l">Researchers</div></div>
        <div className="sc"><div className="sc-n">80+</div><div className="sc-l">Countries</div></div>
      </div>
    </div>
  )
}
