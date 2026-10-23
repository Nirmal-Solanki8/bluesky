// Init UI
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  document.documentElement.setAttribute('data-theme', 'light');

  // Hero typing (Optimized for instant mobile LCP: starts with full text visible)
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const words = ['Bespoke Pools', 'Infinity Horizons', 'Luxury Rooftop Pools', 'Commercial Resorts', 'Wellness Jacuzzis'];
    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = true;
    let typingSpeed = 70;

    function typeEffect() {
      if (document.hidden) {
        setTimeout(typeEffect, 600);
        return;
      }
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 450;
      }

      setTimeout(typeEffect, typingSpeed);
    }
    // Start typing after user interaction (scroll/touch) or after 12s idle delay
    let started = false;
    const startTyping = () => {
      if (started) return;
      started = true;
      window.removeEventListener('scroll', startTyping);
      window.removeEventListener('touchstart', startTyping);
      setTimeout(typeEffect, 1200);
    };

    window.addEventListener('scroll', startTyping, { passive: true, once: true });
    window.addEventListener('touchstart', startTyping, { passive: true, once: true });
    setTimeout(startTyping, 12000);
  }

  // Rock-Solid Fixed Floating Pill Navbar (Always visible, zero jitter)
  const navPill = document.querySelector('.floating-nav-pill');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

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
    handleNavScroll();

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
  const navHeader = document.querySelector('.floating-nav-pill');

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

  window.openMobileDrawer = function(e) {
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

  window.closeMobileDrawer = function() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  window.toggleMobileDrawer = function(e) {
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

  // Mobile accordion
  document.querySelectorAll('.drawer-accordion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.drawer-dropdown-item');
      if (parent) parent.classList.toggle('open');
    });
  });

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
        applePills.forEach(item => item.classList.remove('active'));
        targetItem.classList.add('active');

        if (typeof targetItem.scrollIntoView === 'function') {
          try {
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (_) {}
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

          // Google Official Core Web Vitals (LCP, CLS, FCP)
          try {
            if ('PerformanceObserver' in window) {
              const poLCP = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                  const last = entries[entries.length - 1];
                  console.log(`%c📊 [Google Web Vitals] LCP: ${Math.round(last.startTime)}ms`, 'color: #0284c7; font-weight: bold;');
                }
              });
              poLCP.observe({ type: 'largest-contentful-paint', buffered: true });

              const poCLS = new PerformanceObserver((list) => {
                let cls = 0;
                for (const e of list.getEntries()) {
                  if (!e.hadRecentInput) cls += e.value;
                }
                console.log(`%c📊 [Google Web Vitals] CLS: ${cls.toFixed(3)}`, 'color: #0284c7; font-weight: bold;');
              });
              poCLS.observe({ type: 'layout-shift', buffered: true });

              const poFCP = new PerformanceObserver((list) => {
                for (const e of list.getEntries()) {
                  if (e.name === 'first-contentful-paint') {
                    console.log(`%c📊 [Google Web Vitals] FCP: ${Math.round(e.startTime)}ms`, 'color: #0284c7; font-weight: bold;');
                  }
                }
              });
              poFCP.observe({ type: 'paint', buffered: true });
            }
          } catch (_) {}
        } catch (_) {}
      }, 50);
    });
  });
});
