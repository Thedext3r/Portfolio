/**
 * Smooth Scroll Engine for Sunil Ohdar Portfolio
 * Combines Lenis smooth inertia scrolling with native smooth anchor glides.
 * Responsive: Targets .right-scroll on desktop and window on mobile/tablet.
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

    var lenisOptions = {
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false
    };

    if (targetMode === 'container' && container) {
      // Avoid CSS scroll-behavior conflict with Lenis RAF updates
      container.style.scrollBehavior = 'auto';
      lenisOptions.wrapper = container;

      // Hook container.scrollTo so programmatic smooth scrolling (like ticket stamp) uses Lenis
      if (!origContainerScrollTo) {
        origContainerScrollTo = container.scrollTo;
        container.scrollTo = function (options) {
          if (lenis && typeof options === 'object' && options.behavior === 'smooth') {
            lenis.scrollTo(options.top !== undefined ? options.top : 0, { duration: 1.2 });
          } else if (origContainerScrollTo) {
            origContainerScrollTo.apply(container, arguments);
          }
        };
      }
    } else {
      document.documentElement.style.scrollBehavior = 'auto';
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

  // Smooth Anchor Navigation Handler
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('a[href*="#"], button.work-back-top, button.footer-top-btn');
    if (!trigger) return;

    var href = trigger.getAttribute('href');
    var targetSelector = null;

    if (trigger.classList.contains('work-back-top') || trigger.classList.contains('footer-top-btn')) {
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
        duration: 1.2,
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
