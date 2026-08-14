'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScholarCard from '@/components/scholars/scholar-card'

interface ScholarCardData {
  username?: string;
  id?: string;
  name: string;
  image: string;
  country: string;
  countryFlag: string;
  publications: number;
  credential?: string;
  institution?: string;
  field?: string;
}

const defaultScholars: ScholarCardData[] = [
  {
    name: "Dr. Priya Nair-Kapoor",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=480&h=560",
    country: "India",
    countryFlag: "🇮🇳",
    publications: 42,
    credential: "Hon. D.B.A. · Sustainable Finance",
    institution: "Indian Institute of Management, Ahmedabad",
    field: "ESG & Finance"
  },
  {
    name: "Dr. Ngozi Adeyemi",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=480&h=560",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    publications: 37,
    credential: "Ph.D., FAAN · Knowledge Systems",
    institution: "University of Lagos, Faculty of Arts",
    field: "Social Sciences"
  },
  {
    name: "Dr. Amira Al-Rashidi",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=480&h=560",
    country: "UAE",
    countryFlag: "🇦🇪",
    publications: 29,
    credential: "Hon. D.Sc. · Climate Policy",
    institution: "Zayed University, School of Public Policy",
    field: "Climate & Policy"
  },
  {
    name: "Prof. Khalid Al-Mansouri",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=480&h=560",
    country: "Saudi Arabia",
    countryFlag: "🇸🇦",
    publications: 51,
    credential: "Hon. D.B.A. · Economic Diversification",
    institution: "King Saud University, College of Business",
    field: "Economics"
  },
  {
    name: "Prof. Li Wei",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=480&h=560",
    country: "China",
    countryFlag: "🇨🇳",
    publications: 33,
    credential: "Ph.D. · AI Ethics",
    institution: "Tsinghua University, School of Computing",
    field: "AI & Ethics"
  },
  {
    name: "Dr. Carlos Mendieta",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=480&h=560",
    country: "Mexico",
    countryFlag: "🇲🇽",
    publications: 26,
    credential: "Hon. D.Litt. · Comparative Linguistics",
    institution: "UNAM, Institute of Philological Research",
    field: "Linguistics"
  },
  {
    name: "Dr. Hana Kobayashi",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=480&h=560",
    country: "Japan",
    countryFlag: "🇯🇵",
    publications: 39,
    credential: "Ph.D. · Renewable Materials",
    institution: "University of Tokyo, Dept. of Engineering",
    field: "Materials Sci."
  },
  {
    name: "Prof. Elena Marchetti",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=480&h=560",
    country: "Italy",
    countryFlag: "🇮🇹",
    publications: 44,
    credential: "Hon. D.Sc. · Public Health Policy",
    institution: "Bocconi University, School of Government",
    field: "Public Health"
  }
];

interface FeaturedScholarsProps {
  title?: string;
  subtitle?: string;
  scholars?: any[];
  autoplay?: boolean;
}

export default function GSPFeaturedScholars({ title, subtitle, scholars = [], autoplay = true }: FeaturedScholarsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const displayScholars = useMemo(() => {
    const getSanitizedImage = (url: string | undefined | null, fallbackIdx: number) => {
      if (!url || typeof url !== 'string') return defaultScholars[fallbackIdx % defaultScholars.length].image;
      const lower = url.toLowerCase();
      if (
        lower.includes('placeholder') || 
        lower.includes('smartwatch') || 
        lower.includes('alexa') || 
        lower.includes('gadget') || 
        lower.includes('sahab') || 
        lower.includes('logo') || 
        lower.includes('3d') || 
        lower.includes('antigravity') || 
        lower.includes('luffy') || 
        lower.includes('anime') || 
        url.length < 5
      ) {
        return defaultScholars[fallbackIdx % defaultScholars.length].image;
      }
      return url;
    };

    let mappedDB: ScholarCardData[] = [];
    if (scholars && scholars.length > 0) {
      mappedDB = scholars.map((s, idx) => {
        if (s.name && !s.users) {
          return {
            username: '',
            id: '',
            name: s.name,
            image: getSanitizedImage(s.image, idx),
            country: 'Global',
            countryFlag: '🌍',
            publications: Number(s.papers_count) || 0,
            credential: s.credentials || 'Distinguished Scholar',
            institution: s.university || 'Global Academic Network',
            field: 'Research'
          };
        }
        return {
          username: s.username,
          id: s.id,
          name: s.users?.raw_user_meta_data?.name || s.users?.email || 'Unknown Scholar',
          image: getSanitizedImage(s.profile_photo_url || s.users?.raw_user_meta_data?.avatar_url || s.users?.raw_user_meta_data?.picture || s.users?.raw_user_meta_data?.image, idx),
          country: s.users?.raw_user_meta_data?.country || 'Global',
          countryFlag: s.users?.raw_user_meta_data?.countryFlag || '🌍',
          publications: s._count?.publications || 0,
          credential: s.qualification || 'Distinguished Scholar',
          institution: s.institution || 'Global Institute of Research',
          field: s.specialization || 'Academic Research'
        };
      });
    }

    if (mappedDB.length >= 8) {
      return mappedDB;
    }

    // Combine mappedDB with defaultScholars to guarantee at least 8 scholars
    const existingNames = new Set(mappedDB.map(s => s.name.toLowerCase()));
    const remaining = defaultScholars.filter(s => !existingNames.has(s.name.toLowerCase()));
    return [...mappedDB, ...remaining].slice(0, 12);
  }, [scholars]);

  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  // Measure carousel dimensions
  const measure = useCallback(() => {
    const w = window.innerWidth;
    let newPerView = 4;
    if (w <= 600) newPerView = 1;
    else if (w <= 860) newPerView = 2;
    else if (w <= 1180) newPerView = 3;

    setPerView(newPerView);
    const newMaxIndex = Math.max(0, displayScholars.length - newPerView);
    setMaxIndex(newMaxIndex);
    
    if (index > newMaxIndex) {
      setIndex(newMaxIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const gap = w <= 860 ? (w <= 600 ? 16 : 20) : 28;
    const cardWidth = (cards[0] as HTMLElement).getBoundingClientRect().width;
    
    const offset = newIndex * (cardWidth + gap);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, []);

  // Update when index changes
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
      clearInterval(interval); // clear first to avoid duplicates if any
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
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchDeltaRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      touchDeltaRef.current = deltaX;
      
      const cards = trackRef.current.children;
      if (!cards.length) return;
      
      const w = window.innerWidth;
      const gap = w <= 860 ? (w <= 600 ? 16 : 20) : 28;
      const cardWidth = (cards[0] as HTMLElement).getBoundingClientRect().width;
      const baseOffset = index * (cardWidth + gap);
      
      trackRef.current.style.transform = `translateX(-${baseOffset - touchDeltaRef.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }
    
    if (touchDeltaRef.current > 40) {
      setIndex(index === 0 ? maxIndex : index - 1);
    } else if (touchDeltaRef.current < -40) {
      setIndex(index >= maxIndex ? 0 : index + 1);
    } else {
      updateCarousel(index); // snap back
    }
    touchDeltaRef.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartXRef.current = e.clientX;
    isDraggingRef.current = true;
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    touchDeltaRef.current = e.clientX - touchStartXRef.current;

    const cards = trackRef.current.children;
    if (!cards.length) return;

    const w = window.innerWidth;
    const gap = w <= 860 ? (w <= 600 ? 16 : 20) : 28;
    const cardWidth = (cards[0] as HTMLElement).getBoundingClientRect().width;
    const baseOffset = index * (cardWidth + gap);

    trackRef.current.style.transform = `translateX(-${baseOffset - touchDeltaRef.current}px)`;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }

    if (touchDeltaRef.current > 40) {
      setIndex(index === 0 ? maxIndex : index - 1);
    } else if (touchDeltaRef.current < -40) {
      setIndex(index >= maxIndex ? 0 : index + 1);
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

    const cards = document.querySelectorAll('.scholar-card');
    cards.forEach((c, i) => {
      (c as HTMLElement).style.animationDelay = `${(i % 4) * 0.08}s`;
      observer.observe(c);
    });

    return () => {
      cards.forEach(c => observer.unobserve(c));
    };
  }, []);

  return (
    <section className="scholars-section">
      <div className="scholars-head">
        <div>
          <p className="scholars-eyebrow">{(subtitle || 'Honorary Doctorates · Distinguished Faculty').replace(/^[\s—\-\_]+/, '').trim()}</p>
          <h2 className="scholars-h2 text-[#1E3A8A]" dangerouslySetInnerHTML={{ __html: title || 'Distinguished Global <em>Scholars</em>' }}></h2>
        </div>
        <div className="scholars-carousel-controls">
          <button 
            className="scholars-car-btn" 
            onClick={() => setIndex(prev => (prev === 0 ? maxIndex : prev - 1))}
            aria-label="Previous scholars"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M10.5 13L6 8.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button 
            className="scholars-car-btn" 
            onClick={() => setIndex(prev => (prev >= maxIndex ? 0 : prev + 1))}
            aria-label="Next scholars"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M6.5 4L11 8.5L6.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div 
        className="scholars-carousel-viewport" 
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="scholars-carousel-track" id="scholars-track" ref={trackRef}>
          {displayScholars.map((scholar, i) => (
            <ScholarCard key={i} scholar={scholar} variant="gsp" />
          ))}
        </div>
      </div>

      <div className="scholars-carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button 
            key={i} 
            className={`scholars-cdot ${index === i ? 'on' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
