/**
 * Borrow App Case Study Interactive Logic
 * - Sticky sub-nav scroll spy & smooth jump
 * - Interactive Decision Cards accordion (aria-synced, animated)
 * - Scroll-reveal for card sections + stat count-ups (route-gated)
 */

(function () {
  'use strict';

  function initBorrowInteractions() {
    /* ── 1. Accordion for Decision Cards ────────────────────────────────────
       One panel open at a time. `open` on the card drives layout; the button's
       aria-expanded always mirrors it, so screen readers track the real state. */
    const decisionCards = Array.prototype.slice.call(document.querySelectorAll('.bw-decision-card'));

    function setCardOpen(card, open) {
      card.classList.toggle('open', open);
      const btn = card.querySelector('.bw-decision-btn');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    decisionCards.forEach(card => {
      const btn = card.querySelector('.bw-decision-btn');
      if (!btn) return;
      // keep the first (markup-open) card's aria in sync on init
      setCardOpen(card, card.classList.contains('open'));

      btn.addEventListener('click', () => {
        const wasOpen = card.classList.contains('open');
        decisionCards.forEach(c => setCardOpen(c, false));
        setCardOpen(card, !wasOpen);
      });
    });

    /* ── 2. Sub-Nav Scroll Spy & Jump ────────────────────────────────────── */
    document.addEventListener('click', e => {
      const link = e.target.closest('.bw-subnav-link');
      if (!link) return;
      e.preventDefault();
      const targetEl = document.getElementById(link.getAttribute('data-target'));
      if (targetEl) {
        const navOffset = 92;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });

    const sections = ['bw-overview', 'bw-problem', 'bw-research', 'bw-personas',
                      'bw-decisions', 'bw-flow', 'bw-design', 'bw-reflection']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const subnavLinks = Array.prototype.slice.call(document.querySelectorAll('.bw-subnav-link'));

    function updateActiveSubnav() {
      if (!document.body.classList.contains('route-borrow')) return;
      const scrollPos = window.pageYOffset + 140;
      let currentSection = '';
      sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) currentSection = sec.id;
      });
      subnavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === currentSection);
      });
    }

    // rAF-gated: many scroll listeners already exist on this page, so batch the
    // offsetTop reads (they force layout) into one pass per frame.
    let spyQueued = false;
    function queueSpy() {
      if (spyQueued) return;
      spyQueued = true;
      requestAnimationFrame(() => {
        spyQueued = false;
        updateActiveSubnav();
      });
    }
    window.addEventListener('scroll', queueSpy, { passive: true });
    window.addEventListener('resize', queueSpy, { passive: true });
    addEventListener('load', queueSpy);
    updateActiveSubnav();

    /* ── 3. Scroll Reveal + Stat Count-up (route-gated) ────────────────────
       Elements ease up once as they enter the viewport. Only armed when:
       · IntersectionObserver exists,
       · the user hasn't asked for reduced motion, and
       · the Borrow route is live (its view is actually on screen).
       Everything stays fully visible otherwise — no-JS and fallback-safe. */
    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !reduceMotion) {
      const REVEAL_SELECTOR = '.bw-stat-card, .bw-workaround-item, .bw-finding-row, ' +
        '.bw-persona-card, .bw-decision-card, .bw-flow-phase, .bw-screen-card, ' +
        '.bw-quote-card, .bw-wireframe-banner, .bw-ds-showcase, .bw-asset-card, .bw-swatch';

      let observer = null;
      let armed = false;
      const countedNums = new Set();

      function countUp(num) {
        const raw = (num.textContent || '').replace(/[^0-9.]+/g, '');
        const target = parseFloat(raw);
        if (!isFinite(target) || target <= 0) return;
        const isDecimal = raw.indexOf('.') !== -1;
        const start = performance.now();
        const duration = 900;
        function frame(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
          const value = target * eased;
          num.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toString();
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }

      function reveal(el) {
        if (el.classList.contains('bw-in')) return;
        // stagger siblings within the same row/grid so a group eases in together
        const parent = el.parentElement;
        let index = 0;
        if (parent) {
          const siblings = Array.prototype.slice.call(parent.children)
            .filter(child => child.matches && child.matches(REVEAL_SELECTOR));
          index = siblings.indexOf(el);
        }
        const delayMs = Math.min(index, 7) * 60;
        if (delayMs) el.style.transitionDelay = delayMs + 'ms';
        el.classList.add('bw-in');
        observer.unobserve(el);
        // once the reveal settles, clear inline delay and mark settled
        // so normal interactive transitions (hover lift, etc.) function smoothly
        setTimeout(() => {
          el.style.transitionDelay = '';
          el.classList.add('bw-settled');
        }, 650 + delayMs);
        // count-up the stat numerals inside revealed stat cards (once)
        if (el.classList.contains('bw-stat-card')) {
          const num = el.querySelector('.bw-stat-num');
          if (num && !countedNums.has(num)) {
            countedNums.add(num);
            countUp(num);
          }
        }
      }

      function armReveal() {
        if (armed) return;
        armed = true;
        document.body.classList.add('bw-anim');
        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
        Array.prototype.forEach.call(document.querySelectorAll(REVEAL_SELECTOR), el => observer.observe(el));
      }

      function disarmReveal() {
        if (!armed) return;
        armed = false;
        document.body.classList.remove('bw-anim');
        if (observer) { observer.disconnect(); observer = null; }
      }

      // arm/disarm as the router toggles the Borrow route
      const routeWatch = new MutationObserver(() => {
        if (document.body.classList.contains('route-borrow')) armReveal();
        else disarmReveal();
      });
      routeWatch.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      if (document.body.classList.contains('route-borrow')) armReveal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBorrowInteractions);
  } else {
    initBorrowInteractions();
  }
})();
