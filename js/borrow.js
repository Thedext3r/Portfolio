/**
 * Borrow App Case Study Interactive Logic
 * - Sticky sub-nav scroll spy & smooth jump
 * - Interactive Decision Cards accordion
 */

(function () {
  'use strict';

  function initBorrowInteractions() {
    // 1. Accordion for Decision Cards
    const decisionCards = document.querySelectorAll('.bw-decision-card');
    decisionCards.forEach(card => {
      const btn = card.querySelector('.bw-decision-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        decisionCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    });

    // Open the first decision card by default
    if (decisionCards.length > 0) {
      decisionCards[0].classList.add('open');
    }

    // 2. Sub-Nav Scroll Spy & Jump (Delegated for top navbar integration)
    document.addEventListener('click', e => {
      const link = e.target.closest('.bw-subnav-link');
      if (!link) return;
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navOffset = 92;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });

    const sections = ['bw-overview', 'bw-problem', 'bw-research', 'bw-personas', 'bw-decisions', 'bw-flow', 'bw-design', 'bw-reflection']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    function updateActiveSubnav() {
      if (document.body.classList.contains('route-borrow')) {
        const scrollPos = window.pageYOffset + 140;
        let currentSection = '';
        sections.forEach(sec => {
          if (sec.offsetTop <= scrollPos) {
            currentSection = sec.id;
          }
        });

        const subnavLinks = document.querySelectorAll('.bw-subnav-link');
        subnavLinks.forEach(link => {
          const isActive = link.getAttribute('data-target') === currentSection;
          link.classList.toggle('active', isActive);
        });
      }
    }

    window.addEventListener('scroll', updateActiveSubnav, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBorrowInteractions);
  } else {
    initBorrowInteractions();
  }
})();
