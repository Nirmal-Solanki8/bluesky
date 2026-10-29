// Init UI
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  document.documentElement.setAttribute('data-theme', 'dark');

  // ===================================================================
  // 0. LUXURY HERO AUTOMATIC BACKGROUND IMAGE SLIDER (Sliding Left)
  // - Hardware-accelerated 3D transform (translate3d)
  // - Mobile Touch Swipe Support (passive touchstart/touchend)
  // - IntersectionObserver (0 CPU / 0 GPU cost when offscreen)
  // - Page Visibility API (saves mobile battery when tab/phone is sleep)
  // ===================================================================
  const trackEl = document.getElementById('luxuryHeroTrack');
  const heroContainer = document.getElementById('luxuryHeroSection');
  const navEl = document.getElementById('luxurySliderNav');

  if (trackEl) {
    const dots = navEl ? Array.from(navEl.querySelectorAll('.luxury-slider-dot')) : [];
    const totalUniqueSlides = 5;
    let currentSlide = 0;
    let sliderTimer = null;
    let isTransitioning = false;
    let isHeroInView = true;

    const updateDots = (index) => {
      const activeIdx = index % totalUniqueSlides;
      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    };

    // Deferred background loading for subsequent slides (prevents mobile bandwidth contention on LCP/FCP)
    const loadDeferredSlides = () => {
      if (!trackEl) return;
      const deferredSlides = trackEl.querySelectorAll('.luxury-hero-slide[data-bg]');
      deferredSlides.forEach(slide => {
        const bgUrl = slide.getAttribute('data-bg');
        if (bgUrl) {
          slide.style.backgroundImage = `linear-gradient(180deg, rgba(8, 11, 16, 0.55) 0%, rgba(8, 11, 16, 0.3) 45%, rgba(8, 11, 16, 0.92) 100%), url('${bgUrl}')`;
          slide.removeAttribute('data-bg');
        }
      });
    };

    const moveToSlide = (index, animated = true) => {
      loadDeferredSlides();
      currentSlide = index;
      if (animated) {
        trackEl.style.transition = 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1)';
        isTransitioning = true;
      } else {
        trackEl.style.transition = 'none';
        isTransitioning = false;
      }
      trackEl.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
      updateDots(currentSlide);
    };

    const nextSlide = () => {
      if (isTransitioning || !isHeroInView) return;
      moveToSlide(currentSlide + 1, true);
    };

    const prevSlide = () => {
      if (isTransitioning || !isHeroInView) return;
      if (currentSlide <= 0) {
        moveToSlide(totalUniqueSlides, false);
        trackEl.offsetHeight; // force reflow
        moveToSlide(totalUniqueSlides - 1, true);
      } else {
        moveToSlide(currentSlide - 1, true);
      }
    };

    trackEl.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (currentSlide >= totalUniqueSlides) {
        moveToSlide(0, false);
      }
    });

    const startAutoPlay = () => {
      stopAutoPlay();
      if (!isHeroInView) return;
      sliderTimer = setInterval(nextSlide, 4500);
    };

    const stopAutoPlay = () => {
      if (sliderTimer) {
        clearInterval(sliderTimer);
        sliderTimer = null;
      }
    };

    // Click on dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        moveToSlide(idx, true);
        startAutoPlay();
      });
    });

    // Mobile Touch Gesture Support (Swipe left/right)
    let touchStartX = 0;
    let touchStartY = 0;

    if (heroContainer) {
      heroContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        stopAutoPlay();
      }, { passive: true });

      heroContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoPlay();
      }, { passive: true });

      // Pause on mouse hover (desktop)
      heroContainer.addEventListener('mouseenter', stopAutoPlay);
      heroContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Optimization: Pause when off-screen using IntersectionObserver
    if ('IntersectionObserver' in window && heroContainer) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroInView = entry.isIntersecting;
          if (isHeroInView) {
            startAutoPlay();
          } else {
            stopAutoPlay();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(heroContainer);
    }

    // Optimization: Pause when browser tab/app is in background
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else if (isHeroInView) {
        startAutoPlay();
      }
    });

    startAutoPlay();

    // Idle hydration for subsequent hero slides (does not block mobile initial paint)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadDeferredSlides, { timeout: 2000 });
    } else {
      setTimeout(loadDeferredSlides, 1200);
    }
  }

  // ===================================================================
  // 1. GSAP WORD-FADING & SLIDING HEADLINE ANIMATION
  // Luxury headlines: "Luxury Rooftop Pools", "Infinity Sanctuaries", "Monolithic RCC Oasis", "Turnkey Resort Lagoons"
  // ===================================================================
  const headlineEl = document.getElementById('heroAnimatedHeadline');
  if (headlineEl) {
    const luxuryWords = [
      'Luxury Rooftop Pools',
      'Infinity Sanctuaries',
      'Monolithic RCC Oasis',
      'Turnkey Resort Lagoons'
    ];
    let wordIndex = 0;

    headlineEl.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    const cycleHeadline = () => {
      wordIndex = (wordIndex + 1) % luxuryWords.length;
      const nextWord = luxuryWords[wordIndex];

      headlineEl.style.opacity = '0';
      headlineEl.style.transform = 'translate3d(0, -14px, 0)';
      setTimeout(() => {
        headlineEl.textContent = nextWord;
        headlineEl.style.transform = 'translate3d(0, 14px, 0)';
        requestAnimationFrame(() => {
          headlineEl.style.opacity = '1';
          headlineEl.style.transform = 'translate3d(0, 0, 0)';
        });
      }, 350);
    };

    // Start cycling with graceful delay to keep initial load main thread 100% quiet
    setTimeout(() => {
      setInterval(cycleHeadline, 4800);
    }, 2500);
  }

  // Fallback for typing text if present on other pages
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const words = ['Bespoke Pools', 'Infinity Horizons', 'Luxury Rooftop Pools', 'Commercial Resorts', 'Wellness Jacuzzis'];
    let wIdx = 0;
    let cIdx = words[0].length;
    let isDeleting = true;

    function typeEffect() {
      if (document.hidden) { setTimeout(typeEffect, 600); return; }
      const currentWord = words[wIdx];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, cIdx - 1);
        cIdx--;
      } else {
        typingElement.textContent = currentWord.substring(0, cIdx + 1);
        cIdx++;
      }
      if (!isDeleting && cIdx === currentWord.length) {
        setTimeout(typeEffect, 2400);
        isDeleting = true;
      } else if (isDeleting && cIdx === 0) {
        isDeleting = false;
        wIdx = (wIdx + 1) % words.length;
        setTimeout(typeEffect, 450);
      } else {
        setTimeout(typeEffect, isDeleting ? 45 : 100);
      }
    }
    setTimeout(typeEffect, 1200);
  }

  // ===================================================================
  // 2. INTERACTIVE BEFORE / AFTER SLIDER (RCC CONSTRUCTION VS FINISHED POOL)
  // Plain HTML5/CSS3 + Vanilla JS with touch and mouse drag support
  // ===================================================================
  const baContainer = document.querySelector('.before-after-container');
  if (baContainer) {
    const baAfter = baContainer.querySelector('.ba-after');
    const baHandle = baContainer.querySelector('.ba-handle');
    let isDragging = false;

    const setSliderPosition = (xPos) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      let percent = (offsetX / rect.width) * 100;
      percent = Math.max(3, Math.min(97, percent));

      if (baAfter) {
        baAfter.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
      }
      if (baHandle) {
        baHandle.style.left = `${percent}%`;
      }
    };

    let rafPending = false;
    const scheduleUpdate = (clientX) => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          setSliderPosition(clientX);
          rafPending = false;
        });
      }
    };

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      scheduleUpdate(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      scheduleUpdate(e.clientX);
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support with smooth 120Hz rAF
    baContainer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        isDragging = true;
        scheduleUpdate(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches || !e.touches[0]) return;
      scheduleUpdate(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ===================================================================
  // 3. 3D TILT EFFECT FOR FEATURED POOL CARDS (DESKTOP ONLY FOR 120HZ MOBILE FPS)
  // ===================================================================
  const tiltCards = document.querySelectorAll('.tilt-card-3d');
  if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg
        const rotateY = ((x - centerX) / centerX) * 8;  // max 8 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // ===================================================================
  // 4. STATS COUNTER ANIMATION ON SCROLL
  // ===================================================================
  const counterElements = document.querySelectorAll('.counter-animate');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-count'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          if (!isNaN(endValue)) {
            let start = 0;
            const duration = 1600;
            const stepTime = 20;
            const totalSteps = duration / stepTime;
            const increment = endValue / totalSteps;
            const timer = setInterval(() => {
              start += increment;
              if (start >= endValue) {
                target.textContent = endValue + suffix;
                clearInterval(timer);
              } else {
                target.textContent = Math.floor(start) + suffix;
              }
            }, stepTime);
          }
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }

  const navPill = document.querySelector('.luxury-nav-pill') || document.querySelector('.floating-nav-pill');
  if (navPill) {
    let isScrolled = false;
    let ticking = false;

    const handleNavScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 20;
          if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            navPill.classList.toggle('scrolled', isScrolled);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Smooth scroll with offset for floating navbar
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          const elTop = el.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top: Math.max(0, elTop), behavior: 'smooth' });
        }
      }
    });
  }

  // Dropdown menu
  const navHeader = document.querySelector('.floating-nav-pill') || document.querySelector('.luxury-nav-pill');
  const dropdownItems = document.querySelectorAll('.luxury-dropdown, .has-dropdown');

  dropdownItems.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
      dropdownItems.forEach(other => {
        if (other !== dropdown) other.classList.remove('open');
      });
    });

    const link = dropdown.querySelector(':scope > a');
    if (link) {
      link.addEventListener('click', (e) => {
        if ('ontouchstart' in window && window.innerWidth <= 1024) {
          const isOpen = dropdown.classList.contains('open');
          dropdownItems.forEach(d => d.classList.remove('open'));
          if (!isOpen) {
            e.preventDefault();
            dropdown.classList.add('open');
          }
        }
      });
    }
  });

  if (navHeader) {
    navHeader.addEventListener('mouseleave', () => {
      dropdownItems.forEach(d => d.classList.remove('open'));
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(d => d.classList.remove('open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(d => d.classList.remove('open'));
    }
  });

  // Mobile drawer & Backdrop - Global and instance handlers
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  window.openMobileDrawer = function (e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  window.closeMobileDrawer = function (e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  window.toggleMobileDrawer = function (e) {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
      window.closeMobileDrawer();
    } else {
      window.openMobileDrawer(e);
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', window.openMobileDrawer);
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', window.closeMobileDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', window.closeMobileDrawer);
  }

  // Drawer accordions are handled cleanly by window.toggleDrawerAccordion in header.ejs

  // For on-page anchor links in drawer, close drawer after scroll
  document.querySelectorAll('.drawer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('#') || href.startsWith(window.location.pathname + '#'))) {
        window.closeMobileDrawer();
      }
    });
  });

  // Touch swipe to close mobile drawer (Natural mobile gesture)
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileDrawer) {
    let touchStartX = 0;
    let touchStartY = 0;
    mobileDrawer.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }
    }, { passive: true });

    mobileDrawer.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Swipe right to dismiss drawer
        if (diffX > 45 && Math.abs(diffX) > Math.abs(diffY)) {
          window.closeMobileDrawer();
        }
      }
    }, { passive: true });
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMobileDrawer();
    }
  });

  // Silent Admin Access Shortcut for Owner (Ctrl + Alt + A or Ctrl + Shift + A)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.altKey || e.shiftKey) && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      window.location.href = '/admin/login';
    }
  });

  // Auto-close drawer if resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      window.closeMobileDrawer();
    }
  }, { passive: true });

  // Deferred initialization of below-the-fold widgets (zero main thread blocking during mobile initial paint)
  const initInteractiveWidgets = () => {
    // Card jump switcher (120Hz ProMotion silky-smooth, zero layout thrashing)
    const applePills = document.querySelectorAll('.apple-pill-btn');
    const jumpCard = document.getElementById('jumpImageCard');
    const jumpCardImg = document.getElementById('jumpCardImg');
    const jumpCaptionTitle = document.getElementById('jumpCaptionTitle');
    const jumpCaptionTag = document.getElementById('jumpCaptionTag');

    if (applePills.length > 0 && jumpCard) {
      let currentActiveIndex = 0;
      let isJumping = false;

      function executeCardJump(index) {
        if (isJumping || index === currentActiveIndex) return;
        const targetItem = applePills[index];
        if (!targetItem) return;

        isJumping = true;
        applePills.forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });
        targetItem.classList.add('active');
        targetItem.setAttribute('aria-selected', 'true');

        if (typeof targetItem.scrollIntoView === 'function') {
          try {
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (_) { }
        }

        jumpCard.classList.remove('jumping-now');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            jumpCard.classList.add('jumping-now');
          });
        });

        setTimeout(() => {
          const newImg = targetItem.getAttribute('data-img');
          const newTitle = targetItem.getAttribute('data-title');
          const newTag = targetItem.getAttribute('data-tag');

          if (jumpCardImg && newImg) {
            jumpCardImg.src = newImg;
            jumpCardImg.alt = newTitle || 'Swimming Pool';
          }
          if (jumpCaptionTitle && newTitle) jumpCaptionTitle.textContent = newTitle;
          if (jumpCaptionTag && newTag) jumpCaptionTag.textContent = newTag;

          currentActiveIndex = index;
        }, 220);

        setTimeout(() => {
          jumpCard.classList.remove('jumping-now');
          isJumping = false;
        }, 650);
      }

      applePills.forEach((pill, index) => {
        pill.addEventListener('click', () => executeCardJump(index));
        pill.addEventListener('mouseenter', () => executeCardJump(index));
      });
    }

    // Dismiss alerts
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
      setTimeout(() => {
        alerts.forEach(alert => {
          alert.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          alert.style.opacity = '0';
          alert.style.transform = 'translate3d(0, -10px, 0)';
          setTimeout(() => alert.remove(), 400);
        });
      }, 4500);
    }

    // 120HZ INTERACTIVE TURNKEY POOL ESTIMATOR & CALCULATOR ENGINE
    const calcLength = document.getElementById('calcLength');
    const calcWidth = document.getElementById('calcWidth');
    const calcDepth = document.getElementById('calcDepth');

    if (calcLength && calcWidth && calcDepth) {
      const lenDisp = document.getElementById('calcLengthDisp');
      const widDisp = document.getElementById('calcWidthDisp');
      const depDisp = document.getElementById('calcDepthDisp');

      const areaVal = document.getElementById('calcAreaVal');
      const volVal = document.getElementById('calcVolumeVal');
      const costVal = document.getElementById('calcCostVal');
      const dimInput = document.getElementById('pt-dimensions') || document.querySelector('input[name="poolDimensions"]');

      function updatePoolCalculation() {
        const L = parseFloat(calcLength.value) || 24;
        const W = parseFloat(calcWidth.value) || 12;
        const D = parseFloat(calcDepth.value) || 4.5;

        if (lenDisp) lenDisp.textContent = `${L} ft`;
        if (widDisp) widDisp.textContent = `${W} ft`;
        if (depDisp) depDisp.textContent = `${D} ft`;

        const sqFt = Math.round(L * W);
        const cuFt = sqFt * D;
        const gallons = Math.round(cuFt * 7.48052);
        const liters = Math.round(gallons * 3.78541);

        let minLakh = (sqFt * 1700) / 100000;
        let maxLakh = (sqFt * 2400) / 100000;

        const minFormatted = minLakh < 10 ? minLakh.toFixed(1) : Math.round(minLakh);
        const maxFormatted = maxLakh < 10 ? maxLakh.toFixed(1) : Math.round(maxLakh);

        if (areaVal) areaVal.textContent = `${sqFt.toLocaleString()} sq.ft`;
        if (volVal) volVal.textContent = `${(liters / 1000).toFixed(1)}k L`;
        if (costVal) costVal.textContent = `₹${minFormatted}L - ₹${maxFormatted}L`;

        if (dimInput && !dimInput.getAttribute('data-user-customized')) {
          dimInput.value = `${L}ft x ${W}ft (${sqFt} sq.ft, ~${liters.toLocaleString()} L)`;
        }
      }

      [calcLength, calcWidth, calcDepth].forEach(input => {
        input.addEventListener('input', updatePoolCalculation, { passive: true });
      });

      if (dimInput) {
        dimInput.addEventListener('input', () => {
          dimInput.setAttribute('data-user-customized', 'true');
        });
      }

      updatePoolCalculation();
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initInteractiveWidgets, { timeout: 1500 });
  } else {
    setTimeout(initInteractiveWidgets, 150);
  }

  // ===================================================================
  // 120HZ PROMOTION & PAGE PERFORMANCE CALCULATOR & AUDIT LOGGER
  // ===================================================================
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const perfEntries = performance.getEntriesByType('navigation');
          let loadTime = 0;
          let domReady = 0;
          if (perfEntries && perfEntries.length > 0) {
            const nav = perfEntries[0];
            loadTime = Math.round(nav.loadEventEnd - nav.startTime);
            domReady = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
          } else if (performance.timing) {
            loadTime = Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart);
            domReady = Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart);
          }
          if (loadTime > 0) {
            console.log(`%c⚡ Bluesky Engine: Page Load ${loadTime}ms | DOM Ready ${domReady}ms | 120Hz Fluid Scroller Active`,
              'background: #0284c7; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
          }
        } catch (_) { }
      }, 50);
    });
  });
});
