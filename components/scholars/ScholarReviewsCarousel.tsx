"use client";

import React, { useEffect, useRef } from "react";

export default function ScholarReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    const dotsWrap = dotsRef.current;

    if (!track || !viewport || !prevBtn || !nextBtn || !dotsWrap) return;

    const cards = Array.from(track.children) as HTMLElement[];
    let index = 0;
    let gap = 26;
    let cardWidth = 0;
    let maxIndex = 0;

    function getPerView() {
      const w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function getGap() {
      const w = window.innerWidth;
      if (w <= 560) return 16;
      if (w <= 760) return 18;
      if (w <= 1024) return 22;
      return 26;
    }

    function measure() {
      const perView = getPerView();
      gap = getGap();
      if (cards.length > 0) {
        cardWidth = cards[0].getBoundingClientRect().width;
      }
      maxIndex = Math.max(0, cards.length - perView);
      if (index > maxIndex) index = maxIndex;
      update(false);
      buildDots();
    }

    function update(animate = true) {
      track!.style.transition = animate === false ? 'none' : '';
      const offset = index * (cardWidth + gap);
      track!.style.transform = `translateX(-${offset}px)`;
      prevBtn!.classList.toggle('disabled', index === 0);
      nextBtn!.classList.toggle('disabled', index >= maxIndex);
      if (animate === false) {
        requestAnimationFrame(() => { track!.style.transition = ''; });
      }
      refreshDots();
    }

    function buildDots() {
      dotsWrap!.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const d = document.createElement('button');
        d.className = 'cdot' + (i === index ? ' on' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => { index = i; update(); });
        dotsWrap!.appendChild(d);
      }
    }

    function refreshDots() {
      Array.from(dotsWrap!.children).forEach((d, i) => d.classList.toggle('on', i === index));
    }

    const onPrev = () => { if (index > 0) { index--; update(); } };
    const onNext = () => { if (index < maxIndex) { index++; update(); } };

    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);

    // Swipe support
    let startX = 0, deltaX = 0, dragging = false;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX; dragging = true;
      track.style.transition = 'none';
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
      const offset = index * (cardWidth + gap) - deltaX;
      track.style.transform = `translateX(-${offset}px)`;
    };
    const onTouchEnd = () => {
      dragging = false;
      track.style.transition = '';
      if (deltaX > 50 && index > 0) index--;
      else if (deltaX < -50 && index < maxIndex) index++;
      deltaX = 0;
      update();
    };

    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchmove', onTouchMove, { passive: true });
    track.addEventListener('touchend', onTouchEnd);

    // Reveal-on-scroll
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach((c, i) => {
      c.style.animationDelay = (i % 3) * 0.09 + 's';
      io.observe(c);
    });

    window.addEventListener('resize', measure);
    measure();

    // Auto-advance
    let auto: any;
    function startAuto() {
      auto = setInterval(() => {
        index = index >= maxIndex ? 0 : index + 1;
        update();
      }, 5200);
    }
    function stopAuto() { clearInterval(auto); }
    startAuto();
    
    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);
    viewport.addEventListener('touchstart', stopAuto, { passive: true });

    return () => {
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchmove', onTouchMove);
      track.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', measure);
      viewport.removeEventListener('mouseenter', stopAuto);
      viewport.removeEventListener('mouseleave', startAuto);
      viewport.removeEventListener('touchstart', stopAuto);
      stopAuto();
      io.disconnect();
    };
  }, []);

  return (
    <section className="review-section">
      <div className="review-head">
        <p className="eyebrow"><span className="eyebrow-line"></span>Trusted Worldwide</p>
        <h2 className="review-h2">What Our <em>Scholars Say</em></h2>
        <p className="review-sub">
          Honest reflections from researchers and honorary doctorate holders
          on their experience publishing with GSP.
        </p>

        <div className="review-aggregate">
          <span className="agg-score">4.9</span>
          <span className="agg-stars">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
          </span>
          <span className="agg-divider"></span>
          <span className="agg-text"><strong>2,400+</strong> verified scholar reviews</span>
        </div>
      </div>

      <div className="carousel-viewport" ref={viewportRef}>
        <div className="carousel-track" id="track" ref={trackRef}>

          {/* Review 1 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Dr. Priya Nair-Kapoor" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇮🇳</span>
              <div className="rv-photo-info">
                <p className="rv-name">Dr. Priya Nair-Kapoor</p>
                <p className="rv-role">Hon. D.B.A. · India</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">GSP's editorial team treated my manuscript with a rigor I hadn't experienced elsewhere. The peer-review turnaround was fast, and the feedback genuinely sharpened my argument before publication.</p>
            </div>
          </div>

          {/* Review 2 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Dr. Ngozi Adeyemi" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇳🇬</span>
              <div className="rv-photo-info">
                <p className="rv-name">Dr. Ngozi Adeyemi</p>
                <p className="rv-role">Ph.D., FAAN · Nigeria</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">What stood out was how seriously GSP engaged with indigenous research frameworks. They didn't try to fit my work into a Western academic mould — they let the scholarship speak on its own terms.</p>
            </div>
          </div>

          {/* Review 3 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Dr. Amira Al-Rashidi" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#B8924A" strokeWidth="1"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇦🇪</span>
              <div className="rv-photo-info">
                <p className="rv-name">Dr. Amira Al-Rashidi</p>
                <p className="rv-role">Hon. D.Sc. · UAE</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">The interview series GSP runs gave my climate policy research visibility I couldn't have reached through a journal alone. Their team is responsive, professional, and genuinely invested in global research.</p>
            </div>
          </div>

          {/* Review 4 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Prof. Khalid Al-Mansouri" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇸🇦</span>
              <div className="rv-photo-info">
                <p className="rv-name">Prof. Khalid Al-Mansouri</p>
                <p className="rv-role">Hon. D.B.A. · Saudi Arabia</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">As someone publishing my second eBook with GSP, I can say their production quality and global distribution network are genuinely a cut above. My reach across the GCC tripled after this release.</p>
            </div>
          </div>

          {/* Review 5 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Prof. Li Wei" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇨🇳</span>
              <div className="rv-photo-info">
                <p className="rv-name">Prof. Li Wei</p>
                <p className="rv-role">Ph.D. · China</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">Publishing my doctoral thesis through GSP connected me with researchers across three continents within weeks. The platform's discoverability is unmatched for emerging AI ethics scholarship.</p>
            </div>
          </div>

          {/* Review 6 */}
          <div className="review-card">
            <div className="rv-photo-wrap">
              <img src="/placeholder-user.png" alt="Prof. Elena Marchetti" loading="lazy"/>
              <div className="rv-photo-gradient"></div>
              <span className="rv-stars">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="#B8924A"><path d="M8 1.2l1.9 4.2 4.5.5-3.4 3.1.9 4.5L8 11.3l-4 2.2.9-4.5-3.4-3.1 4.5-.5L8 1.2z"/></svg>
              </span>
              <span className="rv-flag-pill">🇮🇹</span>
              <div className="rv-photo-info">
                <p className="rv-name">Prof. Elena Marchetti</p>
                <p className="rv-role">Hon. D.Sc. · Italy</p>
              </div>
            </div>
            <div className="rv-body">
              <span className="rv-quote-mark">
                <svg width="28" height="22" viewBox="0 0 34 26" fill="none"><path d="M0 14.5C0 6 5.5 0.8 13 0v4.8C8.5 5.7 6.2 8.6 6 12.4h7v13.2H0V14.5zM18.5 14.5C18.5 6 24 0.8 31.5 0v4.8C27 5.7 24.7 8.6 24.5 12.4h7v13.2h-13V14.5z" fill="#B8924A" fillOpacity="0.55"/></svg>
              </span>
              <p className="rv-text">From submission to print, GSP's editorial board treated my work on public health policy with the kind of academic seriousness I'd expect from a far older institution. Highly recommended for first-time authors.</p>
            </div>
          </div>

        </div>
      </div>

      <div className="review-controls-row">
        <button className="car-btn" id="prevBtn" ref={prevBtnRef} aria-label="Previous reviews">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M10.5 13L6 8.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="carousel-dots" id="dots" ref={dotsRef}></div>
        <button className="car-btn" id="nextBtn" ref={nextBtnRef} aria-label="Next reviews">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M6.5 4L11 8.5L6.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}
