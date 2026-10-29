import React, { useState, useEffect, useCallback, useRef } from 'react';
import './HeroSection.css';

/**
 * Existing Luxury Pool Images from public/images
 */
const DEFAULT_POOL_IMAGES = [
  {
    id: 1,
    url: '/images/private-pool-hero.webp',
    title: 'Private Villa Oasis',
    alt: 'Luxury RCC Private Swimming Pool'
  },
  {
    id: 2,
    url: '/images/infinity-pool.webp',
    title: 'Infinity Horizon Sanctuary',
    alt: 'Vanishing Edge Architectural Infinity Pool'
  },
  {
    id: 3,
    url: '/images/resort-pool.webp',
    title: 'Turnkey Resort Lagoon',
    alt: '5-Star Turnkey Resort Lagoon & Oasis'
  },
  {
    id: 4,
    url: '/images/rooftop-pool.webp',
    title: 'Architectural Rooftop Pool',
    alt: 'Luxury Rooftop Swimming Pool Engineering'
  },
  {
    id: 5,
    url: '/images/jacuzzi-spa.webp',
    title: 'Hydrotherapy Wellness Spa',
    alt: 'Hydrotherapy Spa & Vitality Pool'
  }
];

const STAT_BADGES = [
  { count: '16+', label: 'Years of Excellence' },
  { count: '720+', label: 'Luxury Pools Built' },
  { count: '100%', label: 'Leakproof Guarantee' },
  { count: 'SURAT', label: 'Gujarat Studio & HQ', isGold: true }
];

export default function HeroSection({
  poolImages = DEFAULT_POOL_IMAGES,
  onRequestConsultation,
  onExploreMasterpieces
}) {
  const images = (poolImages && poolImages.length > 0) ? poolImages : DEFAULT_POOL_IMAGES;
  const totalSlides = images.length;

  // Cloned first slide appended to end for an infinite seamless right-to-left slide
  const slides = totalSlides > 1 ? [...images, images[0]] : images;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const timerRef = useRef(null);
  const heroRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Navigate directly to a specific slide (from dots)
  const goToSlide = useCallback((index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, []);

  // Advance to next slide
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Previous slide (for touch swipe)
  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev <= 0) return totalSlides - 1;
      return prev - 1;
    });
  }, [totalSlides]);

  // Mobile Touch Gestures (Swipe left/right)
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setIsPaused(false);
  };

  // IntersectionObserver to pause when hero is scrolled out of view
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-slide timer: pauses on user hover, touch, background tab, or when scrolled out of view
  useEffect(() => {
    if (isPaused || !isInView || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [nextSlide, isPaused, isInView, totalSlides, currentIndex]);

  // Handle seamless infinite loop when transition ends on cloned first slide
  const handleTransitionEnd = () => {
    if (currentIndex >= totalSlides) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  const activeDotIndex = currentIndex % totalSlides;

  return (
    <>
      <section
        ref={heroRef}
        className="luxury-hero-container position-relative overflow-hidden"
        aria-label="Luxury Pool Engineering Hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===================================================================
            BACKGROUND SLIDER TRACK (Hardware-Accelerated Left Sliding via translate3d)
            =================================================================== */}
        <div className="hero-slider-container" aria-hidden="true">
          <div
            className="hero-slider-track"
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
              transition: isTransitioning
                ? 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none'
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((slide, index) => {
              const bgUrl = slide.url || slide.image || slide;
              return (
                <div
                  key={`${slide.id || index}-${index}`}
                  className="hero-slider-slide"
                  role="img"
                  aria-label={slide.alt || `Luxury Pool View ${index + 1}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 11, 16, 0.55) 0%, rgba(8, 11, 16, 0.3) 45%, rgba(8, 11, 16, 0.92) 100%), url(${bgUrl})`
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Ambient Light Caustic Overlay */}
        <div className="luxury-hero-caustics" />

        {/* ===================================================================
            STATIC FOREGROUND CONTENT (Bootstrap 5 Grid + Normal CSS, Responsive 100vh)
            =================================================================== */}
        <div className="container position-relative h-100 d-flex flex-column justify-content-center" style={{ zIndex: 10 }}>
          <div className="row align-items-center">
            <div className="col-lg-10 col-xl-9">

              {/* Bespoke Architectural Engineering Tag */}
              <div className="section-tag-luxury mb-3">
                <i className="bi bi-gem me-1"></i> Bespoke Architectural Pool Engineering
              </div>

              {/* Static Luxury Editorial Heading */}
              <h1 className="luxury-heading mb-3">
                Architects of<br />
                <span className="hero-animated-word">Turnkey Resort Lagoons</span>
              </h1>

              {/* Static Paragraph Text */}
              <p
                className="luxury-subtext mb-3"
                style={{ color: '#E2E8F0', maxWidth: '720px' }}
              >
                Monolithic leakproof RCC swimming pools, vanishing edge horizons, and bio-filtration engineering. Engineered for high-net-worth private villa estates, penthouses, and 5-star international resorts across India and worldwide.
              </p>

              {/* Static Luxury Action Buttons */}
              <div className="d-flex flex-wrap gap-2 gap-md-3 pt-1 mb-3">
                <button
                  type="button"
                  className="luxury-cta-btn d-inline-flex align-items-center gap-2"
                  onClick={onRequestConsultation || (() => alert('Request Consultation Clicked'))}
                >
                  <i className="bi bi-calendar2-check"></i>
                  <span>Request Consultation</span>
                </button>

                <a
                  href="#portfolio-showcase"
                  className="btn btn-outline-light d-inline-flex align-items-center gap-2"
                  style={{
                    borderRadius: '9999px',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.25)',
                    background: 'rgba(15,23,42,0.5)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF'
                  }}
                  onClick={onExploreMasterpieces}
                >
                  <span>Explore Masterpieces</span>
                  <i className="bi bi-arrow-down-right"></i>
                </a>
              </div>

              {/* Static Trust Badges Strip */}
              <div
                className="d-flex flex-wrap align-items-center gap-2 gap-md-4 pt-2 small"
                style={{ borderTop: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-gold fs-5"></i>
                  <span className="fw-semibold" style={{ color: '#F8FAFC' }}>
                    100% Leakproof Monolithic RCC
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check text-gold fs-5"></i>
                  <span className="fw-semibold" style={{ color: '#F8FAFC' }}>
                    ISO 9001:2015 Certified
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-gold fs-5"></i>
                  <span className="fw-semibold" style={{ color: '#F8FAFC' }}>
                    16+ Years Turnkey Mastery
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ===================================================================
            SUBTLE, ELEGANT NAVIGATION DOTS (z-index: 15)
            =================================================================== */}
        <div className="luxury-slider-nav" role="tablist" aria-label="Hero slider pagination">
          {images.map((slide, idx) => (
            <button
              key={slide.id || idx}
              type="button"
              className={`luxury-slider-dot ${idx === activeDotIndex ? 'active' : ''}`}
              role="tab"
              aria-selected={idx === activeDotIndex}
              aria-label={`Slide ${idx + 1}: ${slide.title || 'Pool Image'}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>

        {/* Bottom Scroll Indicator (Desktop only) */}
        <a href="#stats-strip" className="hero-scroll-indicator d-none d-md-flex" aria-label="Scroll down">
          <span style={{ color: '#CBD5E1' }}>SCROLL</span>
          <div className="scroll-line"></div>
        </a>
      </section>

      {/* ===================================================================
          BOTTOM STAT BADGES STRIP (Bootstrap 5 Grid + Normal CSS)
          =================================================================== */}
      <section className="luxury-stats-strip" id="stats-strip">
        <div className="container">
          <div className="row g-3 g-md-4 justify-content-center">
            {STAT_BADGES.map((stat, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="luxury-stat-card text-center">
                  <div className={`stat-number-glow ${stat.isGold ? 'text-gradient-gold' : ''}`}>
                    {stat.count}
                  </div>
                  <div className="stat-label-subtle">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
