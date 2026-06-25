'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './gsp-featured-scholars.css'

interface ScholarCardData {
  name: string;
  image: string;
  country: string;
  countryFlag: string;
  publications: number;
  credential: string;
  institution: string;
  field: string;
}

const defaultScholars: ScholarCardData[] = [
  {
    name: "Dr. Priya Nair-Kapoor",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "India",
    countryFlag: "🇮🇳",
    publications: 42,
    credential: "Hon. D.B.A. · Sustainable Finance",
    institution: "Indian Institute of Management, Ahmedabad",
    field: "ESG & Finance"
  },
  {
    name: "Dr. Ngozi Adeyemi",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    publications: 37,
    credential: "Ph.D., FAAN · Knowledge Systems",
    institution: "University of Lagos, Faculty of Arts",
    field: "Social Sciences"
  },
  {
    name: "Dr. Amira Al-Rashidi",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "UAE",
    countryFlag: "🇦🇪",
    publications: 29,
    credential: "Hon. D.Sc. · Climate Policy",
    institution: "Zayed University, School of Public Policy",
    field: "Climate & Policy"
  },
  {
    name: "Prof. Khalid Al-Mansouri",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Saudi Arabia",
    countryFlag: "🇸🇦",
    publications: 51,
    credential: "Hon. D.B.A. · Economic Diversification",
    institution: "King Saud University, College of Business",
    field: "Economics"
  },
  {
    name: "Prof. Li Wei",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "China",
    countryFlag: "🇨🇳",
    publications: 33,
    credential: "Ph.D. · AI Ethics",
    institution: "Tsinghua University, School of Computing",
    field: "AI & Ethics"
  },
  {
    name: "Dr. Carlos Mendieta",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Mexico",
    countryFlag: "🇲🇽",
    publications: 26,
    credential: "Hon. D.Litt. · Comparative Linguistics",
    institution: "UNAM, Institute of Philological Research",
    field: "Linguistics"
  },
  {
    name: "Dr. Hana Kobayashi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
    country: "Japan",
    countryFlag: "🇯🇵",
    publications: 39,
    credential: "Ph.D. · Renewable Materials",
    institution: "University of Tokyo, Dept. of Engineering",
    field: "Materials Sci."
  },
  {
    name: "Prof. Elena Marchetti",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=560&fit=crop&crop=face&auto=format&q=85",
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
  
  const displayScholars = scholars && scholars.length > 0 ? scholars.map(s => ({
    name: s.users?.raw_user_meta_data?.name || s.users?.email || 'Unknown',
    image: s.users?.raw_user_meta_data?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    country: s.country || 'Global',
    countryFlag: s.flag_emoji || '🌍',
    publications: s._count?.publications || 0,
    credential: s.professional_role || 'Scholar',
    institution: s.domain || 'Independent',
    field: s.specialization || 'Research'
  })) : defaultScholars;

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
    const gap = w <= 860 ? (w <= 600 ? 16 : 20) : 28;
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
          <p className="scholars-eyebrow"><span className="scholars-eyebrow-line"></span>{subtitle || 'Honorary Doctorates · Distinguished Faculty'}</p>
          <h2 className="scholars-h2" dangerouslySetInnerHTML={{ __html: title || 'Featured <em>Scholars</em>' }}></h2>
        </div>
        <div className="scholars-carousel-controls">
          <button 
            className={`scholars-car-btn ${index === 0 ? 'disabled' : ''}`} 
            onClick={() => setIndex(prev => Math.max(0, prev - 1))}
            aria-label="Previous scholars"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M10.5 13L6 8.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button 
            className={`scholars-car-btn ${index >= maxIndex ? 'disabled' : ''}`} 
            onClick={() => setIndex(prev => Math.min(maxIndex, prev + 1))}
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
      >
        <div className="scholars-carousel-track" id="scholars-track" ref={trackRef}>
          {displayScholars.map((scholar, i) => (
            <Link href="#" key={i} className="scholar-card" data-name={scholar.name}>
              <div className="sc-photo-wrap">
                <Image src={scholar.image} alt={scholar.name} width={480} height={560} className="object-cover w-full h-full" />
                <div className="sc-photo-gradient"></div>
                <span className="sc-country-pill"><span className="sc-flag">{scholar.countryFlag}</span> {scholar.country}</span>
                <div className="sc-pub-badge"><span className="sc-pub-n">{scholar.publications}</span><span className="sc-pub-l">Papers</span></div>
                <div className="sc-photo-info">
                  <p className="sc-name-onphoto">{scholar.name}</p>
                </div>
              </div>
              <div className="sc-body">
                <p className="sc-cred"><span className="sc-dot"></span>{scholar.credential}</p>
                <p className="sc-institution">{scholar.institution}</p>
                <div className="sc-footer">
                  <span className="sc-field-tag">{scholar.field}</span>
                  <span className="sc-view">View Profile
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Link>
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
