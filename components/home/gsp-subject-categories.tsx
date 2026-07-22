'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface SubjectCategory {
  id: string;
  name: React.ReactNode;
  slug?: string;
  image?: string;
  icon?: React.ReactNode;
}

const defaultCategories: SubjectCategory[] = [
  {
    id: "01",
    name: <>Computer Science<br/>&amp; AI</>,
    slug: "computer-science-ai",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.3"/><line x1="5.5" y1="13.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><line x1="8" y1="11" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    id: "02",
    name: <>Engineering<br/>&amp; Technology</>,
    slug: "engineering-technology",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L8 4.5M8 14L8 11.5M2 8L4.5 8M14 8L11.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    id: "03",
    name: <>Medical &amp;<br/>Health Sciences</>,
    slug: "medical-health-sciences",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  },
  {
    id: "04",
    name: <>Business &amp;<br/>Management</>,
    slug: "business-management",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="6.5" width="11" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 6.5V4.8C5.5 4 6.2 3.3 7 3.3h2c.8 0 1.5.7 1.5 1.5v1.7" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    id: "05",
    name: <>Social<br/>Sciences</>,
    slug: "social-sciences",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="7.5" r="1.6" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 13c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.8 10c1.6.1 2.7 1.4 2.7 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    id: "06",
    name: <>Education</>,
    slug: "education",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3L2 6l6 3 6-3-6-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4.5 7.5v3.2c0 .5 1.5 1.6 3.5 1.6s3.5-1.1 3.5-1.6V7.5" stroke="currentColor" strokeWidth="1.3"/></svg>
  },
  {
    id: "07",
    name: <>Humanities</>,
    slug: "humanities",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2.5" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.3"/><line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="5.5" y1="8" x2="10.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  },
  {
    id: "08",
    name: <>Law</>,
    slug: "law",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 4.5L1.5 9h5L4 4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M12 4.5L9.5 9h5L12 4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><line x1="4.5" y1="13.5" x2="11.5" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  },
  {
    id: "09",
    name: <>Agriculture</>,
    slug: "agriculture",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8 6C8 6 4.5 6 4.5 3.5C4.5 3.5 8 3.5 8 6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 6C8 6 11.5 6 11.5 3.5C11.5 3.5 8 3.5 8 6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
  },
  {
    id: "10",
    name: <>Environmental<br/>Studies</>,
    slug: "environmental-studies",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 8h11M8 2.5c1.8 1.6 1.8 9.4 0 11M8 2.5c-1.8 1.6-1.8 9.4 0 11" stroke="currentColor" strokeWidth="1.1"/></svg>
  },
  {
    id: "11",
    name: <>Other<br/>Disciplines</>,
    slug: "other",
    image: "/placeholder-user.jpg",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.3" fill="currentColor"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="12" cy="8" r="1.3" fill="currentColor"/></svg>
  }
];

interface SubjectCategoriesProps {
  title?: string;
  subtitle?: string;
  categories?: SubjectCategory[];
  autoplay?: boolean;
}

export default function GSPSubjectCategories({ title, subtitle, categories, autoplay = true }: SubjectCategoriesProps) {
  // Merge the dynamic categories from DB (name, slug) with the static icons/images from defaultCategories
  const displayCategories = categories && categories.length > 0 
    ? categories.map((cat, i) => {
        const defaultMatch = defaultCategories.find(d => d.slug === (cat as any).slug) || defaultCategories[i % defaultCategories.length];
        return {
          id: String(i + 1).padStart(2, '0'), // Presentational ID like '01', '02'
          slug: (cat as any).slug || defaultMatch.slug,
          name: typeof cat.name === 'string' ? cat.name : defaultMatch.name,
          image: (cat as any).image || defaultMatch.image,
          icon: (cat as any).icon || defaultMatch.icon
        }
      })
    : defaultCategories;
  
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [perView, setPerView] = useState(5);

  const measure = useCallback(() => {
    const w = window.innerWidth;
    let newPerView = 5;
    if (w <= 520) newPerView = 1;
    else if (w <= 760) newPerView = 2;
    else if (w <= 980) newPerView = 3;
    else if (w <= 1180) newPerView = 4;

    setPerView(newPerView);
    const newMaxIndex = Math.max(0, displayCategories.length - newPerView);
    setMaxIndex(newMaxIndex);
    
    if (index > newMaxIndex) {
      setIndex(newMaxIndex);
    }
  }, [index]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const updateCarousel = useCallback((newIndex: number) => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (!cards.length) return;
    
    const w = window.innerWidth;
    const gap = w <= 760 ? (w <= 520 ? 14 : 18) : 24;
    const cardWidth = (cards[0] as HTMLElement).getBoundingClientRect().width;
    
    const offset = newIndex * (cardWidth + gap);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, []);

  useEffect(() => {
    updateCarousel(index);
  }, [index, updateCarousel, perView]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4800);

    const handleEnter = () => clearInterval(interval);
    const handleLeave = () => {
      clearInterval(interval); 
    };

    const vp = viewportRef.current;
    if (vp) {
      vp.addEventListener('mouseenter', handleEnter);
      vp.addEventListener('mouseleave', handleLeave);
      vp.addEventListener('touchstart', handleEnter, { passive: true });
    }

    return () => {
      clearInterval(interval);
      if (vp) {
        vp.removeEventListener('mouseenter', handleEnter);
        vp.removeEventListener('mouseleave', handleLeave);
        vp.removeEventListener('touchstart', handleEnter);
      }
    };
  }, [maxIndex, autoplay]);

  // Swipe support
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
    
    const cards = trackRef.current.children;
    if (!cards.length) return;
    
    const w = window.innerWidth;
    const gap = w <= 760 ? (w <= 520 ? 14 : 18) : 24;
    const cardWidth = (cards[0] as HTMLElement).getBoundingClientRect().width;
    const baseOffset = index * (cardWidth + gap);
    
    trackRef.current.style.transform = `translateX(-${baseOffset - touchDeltaRef.current}px)`;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }
    
    if (touchDeltaRef.current > 50 && index > 0) {
      setIndex(index - 1);
    } else if (touchDeltaRef.current < -50 && index < maxIndex) {
      setIndex(index + 1);
    } else {
      updateCarousel(index); // snap back
    }
    touchDeltaRef.current = 0;
  };

  // Reveal-on-scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const cards = document.querySelectorAll('.subject-card');
    cards.forEach((c, i) => {
      (c as HTMLElement).style.animationDelay = `${(i % 5) * 0.08}s`;
      observer.observe(c);
    });

    return () => {
      cards.forEach(c => observer.unobserve(c));
    };
  }, []);

  return (
    <section className="subjects-section">
      <div className="subjects-head">
        <div>
          <p className="sub-eyebrow"><span className="sub-eyebrow-line"></span>{subtitle || 'Browse By Discipline'}</p>
          <h2 className="subjects-h2" dangerouslySetInnerHTML={{ __html: title || 'Academic <em>Categories</em>' }}></h2>
        </div>
        <div className="sub-carousel-controls">
          <button 
            className={`sub-car-btn ${index === 0 ? 'disabled' : ''}`} 
            onClick={() => setIndex(prev => Math.max(0, prev - 1))}
            aria-label="Previous categories"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M10.5 13L6 8.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button 
            className={`sub-car-btn ${index >= maxIndex ? 'disabled' : ''}`} 
            onClick={() => setIndex(prev => Math.min(maxIndex, prev + 1))}
            aria-label="Next categories"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M6.5 4L11 8.5L6.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div 
        className="sub-carousel-viewport"
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sub-carousel-track" id="subjects-track" ref={trackRef}>
          {displayCategories.map((cat, i) => {
              return (
              <Link href={`/publications?category=${cat.slug || cat.id}`} key={cat.id} className="subject-card">
              <div className="sub-photo-wrap">
                <Image src={cat.image} alt="Category" width={400} height={400} className="w-full h-full object-cover" />
                <div className="sub-photo-gradient"></div>
                <span className="sub-index">{cat.id}</span>
                <span className="sub-icon-badge">
                  {cat.icon}
                </span>
                <div className="sub-info">
                  <p className="sub-name">{cat.name}</p>
                  <span className="sub-view">View
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5h7M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>

      <div className="sub-carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button 
            key={i} 
            className={`sub-cdot ${index === i ? 'on' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
