'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface GspExploreCategoriesProps {
  title?: string;
  subtitle?: string;
}

export default function GspExploreCategories({ title, subtitle }: GspExploreCategoriesProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const reveals = document.querySelectorAll('.gsp-reveal');
    reveals.forEach(el => observer.observe(el));

    return () => {
      reveals.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleScroll = () => {
    if (!gridRef.current) return;
    const scrollLeft = gridRef.current.scrollLeft;
    const cards = gridRef.current.children;
    if (cards.length === 0) return;
    
    // Fallback to gap calculation if necessary
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 14; 
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveDot(Math.min(idx, 3)); // 4 dots
  };

  return (
    <section className="gsp-section gsp-section-container" id="categories">
      <div className="gsp-section-inner">
        <div className="gsp-section-head">
          <div className="gsp-section-head-left gsp-reveal">
            <p className="gsp-eyebrow"><span className="gsp-eyebrow-line"></span>{subtitle || 'Browse By Format'}</p>
            <h2 className="gsp-section-h2" dangerouslySetInnerHTML={{ __html: title || 'Publication <em>Categories</em>' }} />
            <p className="gsp-section-sub">Explore scholarly work across theses, research articles, eBooks and magazines — curated from 350+ peer-reviewed journals.</p>
          </div>
          <Link href="/publications" className="gsp-section-link gsp-reveal">
            View All Categories
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#2F115D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="gsp-cat-grid" ref={gridRef} onScroll={handleScroll}>
          <Link href="/publications?category=theses" className="gsp-cat-card gsp-reveal">
            <div className="gsp-cat-card-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1532012197267-da84d127e765?w=700&h=800&fit=crop&auto=format&q=80')"}}></div>
            <div className="gsp-cat-card-overlay"></div>
            <div className="gsp-cat-card-content">
              <p className="gsp-cat-card-count">1,240+ Theses</p>
              <h3 className="gsp-cat-card-title">Featured<br/>Thesis</h3>
              <div className="gsp-cat-card-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M5 3h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </Link>

          <Link href="/publications?category=articles" className="gsp-cat-card gsp-reveal" style={{transitionDelay: '100ms'}}>
            <div className="gsp-cat-card-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1455894127589-22f75500213a?w=700&h=800&fit=crop&auto=format&q=80')"}}></div>
            <div className="gsp-cat-card-overlay"></div>
            <div className="gsp-cat-card-content">
              <p className="gsp-cat-card-count">3,860+ Articles</p>
              <h3 className="gsp-cat-card-title">Trending<br/>Articles</h3>
              <div className="gsp-cat-card-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M5 3h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </Link>

          <Link href="/publications?category=ebooks" className="gsp-cat-card gsp-reveal" style={{transitionDelay: '200ms'}}>
            <div className="gsp-cat-card-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&h=800&fit=crop&auto=format&q=80')"}}></div>
            <div className="gsp-cat-card-overlay"></div>
            <div className="gsp-cat-card-content">
              <p className="gsp-cat-card-count">980+ eBooks</p>
              <h3 className="gsp-cat-card-title">Latest<br/>eBooks</h3>
              <div className="gsp-cat-card-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M5 3h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </Link>

          <Link href="/publications?category=magazine" className="gsp-cat-card gsp-reveal" style={{transitionDelay: '300ms'}}>
            <div className="gsp-cat-card-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=700&h=800&fit=crop&auto=format&q=80')"}}></div>
            <div className="gsp-cat-card-overlay"></div>
            <div className="gsp-cat-card-content">
              <p className="gsp-cat-card-count">410+ Issues</p>
              <h3 className="gsp-cat-card-title">Latest<br/>Magazine</h3>
              <div className="gsp-cat-card-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M5 3h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </Link>

        </div>

        <div className="gsp-carousel-dots">
          {[0, 1, 2, 3].map(idx => (
            <div key={idx} className={`gsp-cdot ${activeDot === idx ? 'on' : ''}`}></div>
          ))}
        </div>
      </div>
    </section>
  )
}
