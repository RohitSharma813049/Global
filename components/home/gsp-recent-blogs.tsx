'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface ContentItem {
  id: string
  title: string
  slug: string
  cover_image: string | null
  created_at: Date | null
  type: 'blog' | 'news' | 'magazine'
  excerpt?: string
  author_name?: string
  author_image?: string
}

export default function GspRecentBlogs({ items, autoplay = true }: { items: ContentItem[], autoplay?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [gap, setGap] = useState(28);

  const getPerView = () => {
    if (typeof window === 'undefined') return 3;
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 1024) return 2;
    return 3;
  };

  const getGap = () => {
    if (typeof window === 'undefined') return 28;
    const w = window.innerWidth;
    if (w <= 560) return 16;
    if (w <= 760) return 18;
    if (w <= 1024) return 24;
    return 28;
  };

  const measure = () => {
    if (!trackRef.current || items.length === 0) return;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;
    
    const perView = getPerView();
    const newGap = getGap();
    setGap(newGap);
    
    const cw = cards[0].getBoundingClientRect().width;
    setCardWidth(cw);
    
    const newMaxIndex = Math.max(0, items.length - perView);
    setMaxIndex(newMaxIndex);
    if (index > newMaxIndex) setIndex(newMaxIndex);
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    let auto: NodeJS.Timeout;
    if (autoplay && maxIndex > 0) {
      auto = setInterval(() => {
        setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(auto);
  }, [autoplay, maxIndex]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch and Mouse handlers
  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    setDeltaX(e.touches[0].clientX - startX);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (deltaX > 40) {
      setIndex(index === 0 ? maxIndex : index - 1);
    } else if (deltaX < -40) {
      setIndex(index >= maxIndex ? 0 : index + 1);
    }
    setDeltaX(0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDeltaX(e.clientX - startX);
  };

  const onMouseUpOrLeave = () => {
    if (!dragging) return;
    setDragging(false);
    if (deltaX > 40) {
      setIndex(index === 0 ? maxIndex : index - 1);
    } else if (deltaX < -40) {
      setIndex(index >= maxIndex ? 0 : index + 1);
    }
    setDeltaX(0);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="gsp-blog-section">
      <div className="gsp-blog-head">
        <div>
          <p className="gsp-eyebrow"><span className="gsp-eyebrow-line"></span>Insights · Interviews · Commentary</p>
          <h2 className="gsp-blog-h2 text-[#1E3A8A]">Latest Insights & <em>Academic News</em></h2>
          <p className="gsp-blog-sub">
            Perspectives from scholars, editors, and researchers on the ideas shaping academia today.
          </p>
        </div>
        <div className="gsp-blog-head-right">
          <Link href="/blog" className="gsp-view-all-btn">
            View All Blogs
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <div className="gsp-carousel-controls">
            <button className="gsp-car-btn" onClick={handlePrev} aria-label="Previous posts">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M10.5 13L6 8.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="gsp-car-btn" onClick={handleNext} aria-label="Next posts">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M6.5 4L11 8.5L6.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div 
        className="gsp-carousel-viewport select-none cursor-grab active:cursor-grabbing" 
        onTouchStart={onTouchStart} 
        onTouchMove={onTouchMove} 
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >
        <div 
          className="gsp-carousel-track" 
          ref={trackRef}
          style={{
            transform: 'translateX(calc(-' + (index * (cardWidth + gap)) + 'px + ' + (dragging ? deltaX : 0) + 'px))',
            transition: dragging ? 'none' : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
            gap: gap + 'px'
          }}
        >
          {items.map((item, i) => (
            <Link key={`${item.type}-${item.id}`} href={`/${item.type}/${item.slug}`} className="gsp-blog-card in-view" style={{ animationDelay: ((i % 3) * 0.09) + 's' }}>
              <div className="gsp-bc-photo-wrap">
                {item.cover_image ? (
                  <Image src={item.cover_image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-violet-100 flex items-center justify-center">
                    <span className="text-violet-500 font-bold text-4xl">{item.title.charAt(0)}</span>
                  </div>
                )}
                <div className="gsp-bc-photo-gradient"></div>
                <span className="gsp-bc-cat-pill">{item.type}</span>
                <span className="gsp-bc-time-badge">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.3" stroke="currentColor" strokeWidth="1.1"/><path d="M5.5 3v2.5l1.7 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  5 min
                </span>
              </div>
              <div className="gsp-bc-body">
                <div className="gsp-bc-meta-row">
                  <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent'}</span>
                  <span className="gsp-bc-meta-dot"></span>
                  <span className="capitalize">{item.type}</span>
                </div>
                <p className="gsp-bc-title">{item.title}</p>
                <p className="gsp-bc-excerpt">{item.excerpt || "Explore the latest insights and updates from Global Scholar Publications in this informative piece."}</p>
                <div className="gsp-bc-footer">
                  <div className="gsp-bc-author">
                    <div className="gsp-bc-avatar">
                      {item.author_image ? (
                        <Image src={item.author_image} alt={item.author_name || "Author"} fill className="object-cover" />
                      ) : (
                         <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <span className="gsp-bc-author-name">{item.author_name || "GSP Editorial"}</span>
                  </div>
                  <span className="gsp-bc-readmore">Read
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="gsp-carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button 
            key={i} 
            className={`gsp-cdot ${i === index ? 'on' : ''}`} 
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
