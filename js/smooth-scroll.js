/**
 * Smooth Scroll Engine for Sunil Ohdar Portfolio
 * Combines Lenis smooth inertia scrolling with native smooth anchor glides.
 * Responsive: Targets .right-scroll on desktop and window on mobile/tablet.
 * Tuned for fast, responsive, snappy scrolling without sluggish lag.
 * Respects prefers-reduced-motion automatically.
 */
(function () {
  'use strict';

  // Honor system accessibility preferences
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var lenis = null;
  var currentMode = null; // 'container' | 'window'
  var rafId = null;
  var origContainerScrollTo = null;

  function getScrollTarget() {
    var isMobile = window.innerWidth <= 900;
    var container = document.querySelector('.right-scroll');
    return (!isMobile && container) ? container : null;
  }

  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    var container = getScrollTarget();
    var targetMode = container ? 'container' : 'window';

    // If mode hasn't changed and lenis is running, keep instance
    if (lenis && currentMode === targetMode) return;

    if (lenis) {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenis = null;
    }

    currentMode = targetMode;

    // Fast, responsive momentum scrolling configuration
    // Using lerp (0.14) instead of long duration gives immediate frame-1 reaction,
    // natural velocity scaling, and eliminates sluggish drag.
    // wheelMultiplier (1.85) covers ~90% more distance per wheel notch.
    var lenisOptions = {
      lerp: 0.14,
      wheelMultiplier: 1.85,
      touchMultiplier: 1.5,
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      infinite: false,
      eventsTarget: window
    };

    // Ensure CSS scroll-behavior does not conflict with Lenis RAF updates
    document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';

    if (targetMode === 'container' && container) {
      container.style.scrollBehavior = 'auto';
      lenisOptions.wrapper = container;

      // Hook container.scrollTo so programmatic smooth scrolling (like ticket stamp) uses Lenis
      if (!origContainerScrollTo) {
        origContainerScrollTo = container.scrollTo;
        container.scrollTo = function (options) {
          if (lenis && typeof options === 'object' && options.behavior === 'smooth') {
            lenis.scrollTo(options.top !== undefined ? options.top : 0, {
              duration: 0.6,
              easing: function (t) {
                return Math.min(1, 1.001 - Math.pow(2, -10 * t));
              }
            });
          } else if (origContainerScrollTo) {
            origContainerScrollTo.apply(container, arguments);
          }
        };
      }
    }

    try {
      lenis = new Lenis(lenisOptions);
      window.siteLenis = lenis;

      function rafLoop(time) {
        if (lenis) {
          lenis.raf(time);
          rafId = requestAnimationFrame(rafLoop);
        }
      }
      rafId = requestAnimationFrame(rafLoop);

      // Handle direct page load with hash anchor (e.g. /#work)
      if (window.location.hash) {
        setTimeout(function () {
          try {
            var hashTarget = document.querySelector(window.location.hash);
            if (hashTarget && lenis) {
              lenis.scrollTo(hashTarget, {
                offset: 0,
                duration: 0.6,
                easing: function (t) {
                  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
                }
              });
            }
          } catch (e) {}
        }, 120);
      }
    } catch (err) {
      console.warn('Lenis smooth scroll initialization skipped:', err);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
  } else {
    initSmoothScroll();
  }

  // Handle responsive layout threshold transitions
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSmoothScroll, 150);
  });

  // Smooth Anchor Navigation Handler - Fast & snappy 0.6s glides
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('a[href*="#"], button.work-back-top, button.footer-top-btn, #scroll-up');
    if (!trigger) return;

    var href = trigger.getAttribute('href');
    var targetSelector = null;

    if (trigger.classList.contains('work-back-top') || trigger.classList.contains('footer-top-btn') || trigger.id === 'scroll-up') {
      targetSelector = '#home';
    } else if (href) {
      var isSamePage = false;
      var path = window.location.pathname;

      if (href.startsWith('#')) {
        targetSelector = href;
        isSamePage = true;
      } else if (href.startsWith('/#') || href.startsWith('/index#') || href.startsWith('index.html#')) {
        if (path === '/' || path === '' || path.endsWith('/index.html') || path.endsWith('/index')) {
          targetSelector = '#' + href.split('#')[1];
          isSamePage = true;
        }
      }

      if (!isSamePage || !targetSelector || targetSelector === '#') return;
    }

    var targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(targetEl, {
        offset: 0,
        duration: 0.6,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        immediate: false
      });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }

    if (history.pushState) {
      history.pushState(null, null, targetSelector);
    }
  });

})();
