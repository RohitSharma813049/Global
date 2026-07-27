'use client'

import { useState, useEffect, useRef } from 'react'
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

  const defaultPublications = [
    {
      type: 'Thesis',
      subject: 'Computer Science · Ethics',
      title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments',
      author: 'Prof. Li Wei, Ph.D.',
      authorImg: '/placeholder-user.png',
      desc: 'A cross-cultural framework examining ethical accountability in AI systems deployed across divergent regulatory and academic research contexts.',
      img: '/placeholder-user.png',
      views: '2.3k reads',
      link: '/explore?type=Thesis'
    },
    {
      type: 'Article',
      subject: 'Social Sciences · Education',
      title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm',
      author: 'Dr. Ngozi Adeyemi, FAAN',
      authorImg: '/placeholder-user.png',
      desc: 'An incisive look at restructuring curricula and research methodology to center indigenous African epistemologies in higher education.',
      img: '/placeholder-user.png',
      views: '4.1k reads',
      link: '/explore?type=Article'
    },
    {
      type: 'eBook',
      subject: 'Economics · Public Policy',
      title: 'GCC Economic Diversification: Vision 2030 and Beyond',
      author: 'Prof. Khalid Al-Mansouri',
      authorImg: '/placeholder-user.png',
      desc: "A comprehensive eBook tracing the GCC's structural shift away from hydrocarbon dependency through Vision 2030's policy levers.",
      img: '/placeholder-user.png',
      views: '3.7k reads',
      link: '/explore?type=Ebook'
    },
    {
      type: 'Magazine',
      subject: 'Environmental Policy',
      title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050',
      author: 'Dr. Amira Al-Rashidi, D.Sc.',
      authorImg: '/placeholder-user.png',
      desc: "GSP's exclusive interview series feature exploring realistic decarbonisation pathways for emerging and transition economies.",
      img: '/placeholder-user.png',
      views: '1.9k reads',
      link: '/explore?type=Magazine'
    }
  ];

  const displayPublications = publications && publications.length > 0 ? publications : defaultPublications;

  const dynamicFilters = ['All', ...Array.from(new Set(displayPublications.map(p => p.subject?.split(' · ')[0] || p.subject))).filter(Boolean).slice(0, 4)] as string[];

  const filteredPublications = filter === 'All' 
    ? displayPublications 
    : displayPublications.filter(p => {
        const pSub = p.subject || '';
        return pSub.includes(filter);
      });

  return (
    <section className="gsp-section gsp-section-container" id="featured">
      <div className="gsp-section-inner">
        <div className="gsp-section-head">
          <div className="gsp-section-head-left gsp-reveal">
            <p className="gsp-eyebrow"><span className="gsp-eyebrow-line"></span>{subtitle || 'Handpicked This Month'}</p>
            <h2 className="gsp-section-h2" dangerouslySetInnerHTML={{ __html: title || 'Featured <em>Publications</em>' }} />
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

        <div className="gsp-pub-grid" ref={gridRef} onScroll={handleScroll}>
          {filteredPublications.map((pub, idx) => (
            <Link href={pub.link} prefetch={false} className="gsp-pub-card" key={idx} style={{transitionDelay: `${idx * 100}ms`}}>
              <div className="gsp-pub-card-media">
                <span className="gsp-pub-card-type">{pub.type}</span>
                { }
                <img src={pub.img} alt={pub.title} loading="lazy"/>
              </div>
              <div className="gsp-pub-card-body">
                <p className="gsp-pub-card-subject">{pub.subject}</p>
                <h3 className="gsp-pub-card-title">{pub.title}</h3>
                <div className="gsp-pub-card-author">
                  <div className="gsp-pub-card-avatar">
                    { }
                    <img src={pub.authorImg} alt={pub.author}/>
                  </div>
                  <span className="gsp-pub-card-author-name">{pub.author}</span>
                </div>
                <p className="gsp-pub-card-desc">{pub.desc}</p>
                <div className="gsp-pub-card-footer">
                  <span className="gsp-pub-card-read">
                    Read Full Publication
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#2F115D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="gsp-pub-card-views">{pub.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="gsp-carousel-dots">
          {filteredPublications.map((_, idx) => (
            <div key={idx} className={`gsp-cdot ${activeDot === idx ? 'on' : ''}`}></div>
          ))}
        </div>
      </div>
    </section>
  )
}
