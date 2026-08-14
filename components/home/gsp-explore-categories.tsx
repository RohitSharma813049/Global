'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface GspExploreCategoriesProps {
  title?: string;
  subtitle?: string;
  categories?: { title: string; count: string; image: string; link: string }[];
}

export default function GspExploreCategories({ title, subtitle, categories }: GspExploreCategoriesProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)

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

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const interval = setInterval(() => {
      if (gridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
        // Check if reached or close to end (within 35px padding offset)
        if (scrollLeft + clientWidth >= scrollWidth - 35) {
          gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const prevScroll = gridRef.current.scrollLeft;
          gridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
          setTimeout(() => {
            if (gridRef.current && gridRef.current.scrollLeft === prevScroll && gridRef.current.scrollLeft > 0) {
              gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            }
          }, 400);
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [categories]);

  const handleScroll = () => {
    if (!gridRef.current) return;
    const scrollLeft = gridRef.current.scrollLeft;
    const cards = gridRef.current.children;
    if (cards.length === 0) return;
    
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 14; 
    const idx = Math.round(scrollLeft / cardWidth);
    const maxIdx = Math.max(0, (categories?.length || 1) - 1);
    setActiveDot(Math.min(idx, maxIdx));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - gridRef.current.offsetLeft;
    scrollLeftStart.current = gridRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !gridRef.current) return;
    e.preventDefault();
    const x = e.pageX - gridRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    gridRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <section className="gsp-section gsp-section-container" id="categories">
      <div className="gsp-section-inner">
        <div className="gsp-section-head">
          <div className="gsp-section-head-left gsp-reveal">
            <p className="gsp-eyebrow"><span className="gsp-eyebrow-line"></span>{subtitle || 'Browse By Format'}</p>
            <h2 className="gsp-section-h2" dangerouslySetInnerHTML={{ __html: title || 'Explore Publication <em>Categories</em>' }} />
            <p className="gsp-section-sub">Explore scholarly work across theses, research articles, eBooks and magazines — curated from 350+ peer-reviewed journals.</p>
          </div>
          <Link href="/explore" className="gsp-section-link gsp-reveal">
            View All Categories
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#2F115D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div 
          className="gsp-cat-grid cursor-grab active:cursor-grabbing select-none" 
          ref={gridRef} 
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          {(categories || []).map((cat, index) => (
            <Link key={index} href={cat.link} className="gsp-cat-card gsp-reveal" style={{transitionDelay: `${index * 100}ms`}}>
              <div className="gsp-cat-card-img" style={{backgroundImage: `url('${cat.image}')`}}></div>
              <div className="gsp-cat-card-overlay"></div>
              <div className="gsp-cat-card-content">
                <p className="gsp-cat-card-count">{cat.count}</p>
                <h3 className="gsp-cat-card-title" dangerouslySetInnerHTML={{ __html: cat.title }}></h3>
                <div className="gsp-cat-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M5 3h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="gsp-carousel-dots">
          {Array.from({ length: categories?.length || 0 }).map((_, idx) => (
            <div 
              key={idx} 
              className={`gsp-cdot ${activeDot === idx ? 'on' : ''}`}
              onClick={() => {
                if (gridRef.current && gridRef.current.children[idx]) {
                  gridRef.current.children[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
              }}
              style={{ cursor: 'pointer' }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}
