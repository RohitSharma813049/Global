'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'

interface GspFeaturedContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  autoplay?: boolean;
  publications?: any[];
}

export default function GspFeaturedContent({ title, subtitle, description, autoplay = true, publications = [] }: GspFeaturedContentProps) {
  const [filter, setFilter] = useState('All')
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

  const handleScroll = () => {
    if (!gridRef.current) return;
    const scrollLeft = gridRef.current.scrollLeft;
    const cards = gridRef.current.children;
    if (cards.length === 0) return;
    
    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 14; 
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveDot(Math.min(idx, cards.length - 1));
  };

  const defaultPublications = useMemo(() => [
    {
      type: 'Thesis',
      subject: 'Computer Science · Ethics',
      title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments',
      author: 'Prof. Li Wei, Ph.D.',
      authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
      desc: 'A cross-cultural framework examining ethical accountability in AI systems deployed across divergent regulatory and academic research contexts.',
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&auto=format&q=80',
      views: '2.3k reads',
      link: '/explore?type=Thesis'
    },
    {
      type: 'Article',
      subject: 'Social Sciences · Education',
      title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm',
      author: 'Dr. Ngozi Adeyemi, FAAN',
      authorImg: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
      desc: 'An incisive look at restructuring curricula and research methodology to center indigenous African epistemologies in higher education.',
      img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop&auto=format&q=80',
      views: '4.1k reads',
      link: '/explore?type=Article'
    },
    {
      type: 'eBook',
      subject: 'Economics · Public Policy',
      title: 'GCC Economic Diversification: Vision 2030 and Beyond',
      author: 'Prof. Khalid Al-Mansouri',
      authorImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
      desc: "A comprehensive eBook tracing the GCC's structural shift away from hydrocarbon dependency through Vision 2030's policy levers.",
      img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop&auto=format&q=80',
      views: '3.7k reads',
      link: '/explore?type=Ebook'
    },
    {
      type: 'Magazine',
      subject: 'Environmental Policy',
      title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050',
      author: 'Dr. Amira Al-Rashidi, D.Sc.',
      authorImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
      desc: "GSP's exclusive interview series feature exploring realistic decarbonisation pathways for emerging and transition economies.",
      img: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=500&fit=crop&auto=format&q=80',
      views: '1.9k reads',
      link: '/explore?type=Magazine'
    }
  ], []);

  const cleanSub = (subtitle || 'Curated Content').replace(/^[\s—\-\_]+/, '').trim();

  const academicFallbackCovers = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop&auto=format&q=80'
  ];

  const getSanitizedAcademicImage = (url: string | undefined | null, type: string | undefined, idx: number) => {
    if (!url || typeof url !== 'string') return academicFallbackCovers[idx % academicFallbackCovers.length];
    const lower = url.toLowerCase();
    if (
      lower.includes('placeholder') || 
      lower.includes('sahab') || 
      lower.includes('luffy') || 
      lower.includes('anime') || 
      lower.includes('logo') || 
      lower.includes('3d') || 
      lower.includes('antigravity') || 
      url.length < 5
    ) {
      return academicFallbackCovers[idx % academicFallbackCovers.length];
    }
    return url;
  };

  const authorFallbackAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face&auto=format&q=80'
  ];

  const getSanitizedAuthorImage = (url: string | undefined | null, idx: number) => {
    if (!url || typeof url !== 'string') return authorFallbackAvatars[idx % authorFallbackAvatars.length];
    const lower = url.toLowerCase();
    if (
      lower.includes('placeholder') || 
      lower.includes('user') || 
      lower.includes('sahab') || 
      lower.includes('luffy') || 
      url.length < 5
    ) {
      return authorFallbackAvatars[idx % authorFallbackAvatars.length];
    }
    return url;
  };

  const displayPublications = useMemo(() => {
    const raw = publications && publications.length > 0 ? publications : defaultPublications;
    return raw.map((p, idx) => {
      const type = p.type || p.content_type || 'Article';
      const cleanImg = getSanitizedAcademicImage(p.img || p.cover_image, type, idx);
      const cleanAuthorImg = getSanitizedAuthorImage(p.authorImg || p.author_image || p.author_avatar, idx);
      const cleanLink = p.link && !p.link.toLowerCase().includes('.url') && !p.link.toLowerCase().includes('.docx') && p.link !== '#'
        ? p.link
        : `/publications/${p.id || ''}`;

      return {
        ...p,
        img: cleanImg,
        authorImg: cleanAuthorImg,
        link: cleanLink,
        type: type,
        title: p.title || 'Scholarly Publication',
        subject: p.subject || p.journal_name || 'Academic Research',
        author: p.author || p.author_name || 'GSP Editorial Board',
        desc: p.desc || p.abstract || p.description || 'Explore groundbreaking academic research and peer-reviewed scholarly insights in this publication.',
        views: p.views || '1.5k reads'
      };
    });
  }, [publications, defaultPublications]);

  const dynamicFilters = useMemo(() => {
    return ['All', ...Array.from(new Set(displayPublications.map(p => p.subject?.split(' · ')[0] || p.subject))).filter(Boolean).slice(0, 4)] as string[];
  }, [displayPublications]);

  const filteredPublications = useMemo(() => {
    return filter === 'All' 
      ? displayPublications 
      : displayPublications.filter(p => {
          const pSub = p.subject || '';
          return pSub.includes(filter);
        });
  }, [filter, displayPublications]);

  useEffect(() => {
    if (!autoplay || !filteredPublications || filteredPublications.length === 0) return;
    const interval = setInterval(() => {
      if (gridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 35) {
          gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const prevScroll = gridRef.current.scrollLeft;
          gridRef.current.scrollBy({ left: 320, behavior: 'smooth' });
          setTimeout(() => {
            if (gridRef.current && gridRef.current.scrollLeft === prevScroll && gridRef.current.scrollLeft > 0) {
              gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            }
          }, 400);
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [autoplay, filteredPublications]);

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
    <section className="gsp-section gsp-section-container" id="featured">
      <div className="gsp-section-inner">
        <div className="gsp-section-head">
          <div className="gsp-section-head-left gsp-reveal">
            <p className="gsp-eyebrow">{cleanSub}</p>
            <h2 className="gsp-section-h2" dangerouslySetInnerHTML={{ __html: title || 'Featured <em>Research & Articles</em>' }} />
            <p className="gsp-section-sub">{description || 'A curated selection of distinguished research, eBooks and editorial work from scholars across 80 countries.'}</p>
          </div>
          <Link href="/publications" className="gsp-section-link gsp-reveal">
            View All Publications
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#2F115D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="gsp-pub-filter-row gsp-reveal">
          {dynamicFilters.map(f => (
            <button 
              key={f} 
              className={`gsp-pfpill ${filter === f ? 'on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div 
          className="gsp-pub-grid cursor-grab active:cursor-grabbing select-none" 
          ref={gridRef} 
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          {filteredPublications.map((pub, idx) => {
            const cleanLink = pub.link && !pub.link.toLowerCase().includes('.url') && !pub.link.toLowerCase().includes('.docx') && pub.link !== '#'
              ? pub.link
              : `/publications/${pub.id || ''}`;

            return (
              <Link href={cleanLink} prefetch={false} className="gsp-pub-card" key={idx} style={{transitionDelay: `${idx * 100}ms`}}>
                <div className="gsp-pub-card-media">
                  <span className="gsp-pub-card-type">{pub.type}</span>
                  <img src={pub.img || '/placeholder-user.png'} alt={pub.title} loading="lazy"/>
                </div>
              <div className="gsp-pub-card-body">
                <p className="gsp-pub-card-subject">{pub.subject}</p>
                <h3 className="gsp-pub-card-title">{pub.title}</h3>
                <div className="gsp-pub-card-author">
                  <div className="gsp-pub-card-avatar">
                    <img src={pub.authorImg} alt={pub.author}/>
                  </div>
                  <span className="gsp-pub-card-author-name">{pub.author}</span>
                </div>
                <div 
                  className="gsp-pub-card-desc [&_p]:mb-1 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: pub.desc || '' }}
                />
                <div className="gsp-pub-card-footer">
                  <span className="gsp-pub-card-read">
                    Read Full Publication
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#2F115D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="gsp-pub-card-views">{pub.views}</span>
                </div>
              </div>
              </Link>
            );
          })}
        </div>

        <div className="gsp-carousel-dots">
          {filteredPublications.map((_, idx) => (
            <div 
              key={idx} 
              className={`gsp-cdot ${activeDot === idx ? 'on' : ''}`}
              onClick={() => {
                if (gridRef.current && gridRef.current.children[idx]) {
                  const card = gridRef.current.children[idx] as HTMLElement;
                  gridRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
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
