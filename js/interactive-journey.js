/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CASE-STUDY-AS-JOURNEY — INTERACTIVE ENGINE
 * Features:
 *  1. Web Audio UI Synthesizer (Zero-load haptic clicks & chimes)
 *  2. Context-Aware Custom Cursor (view/drag/try badges)
 *  3. Kinetic Hero Morphing & 3D Cursor Tilt
 *  4. Interactive Draggable Process Timeline
 *  5. Live Embedded Prototypes (1-Tap Request & Trust Score Simulator)
 *  6. Scroll-Driven Case Study Chapter Tracker
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── 1. WEB AUDIO UI SYNTHESIZER ─────────────────────────────────────────── */
  const SoundFX = (function () {
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('sunil_sound_enabled') === 'true';

    function getContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playClick() {
      if (!soundEnabled) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      } catch (_) {}
    }

    function playChime() {
      if (!soundEnabled) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.04);
          gain.gain.setValueAtTime(0.04, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.2);
        });
      } catch (_) {}
    }

    function playTick() {
      if (!soundEnabled) return;
      try {
        const ctx = getContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.015);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
      } catch (_) {}
    }

    function toggle() {
      soundEnabled = !soundEnabled;
      localStorage.setItem('sunil_sound_enabled', soundEnabled ? 'true' : 'false');
      if (soundEnabled) playChime();
      updateToggleUI();
      return soundEnabled;
    }

    function isEnabled() {
      return soundEnabled;
    }

    function updateToggleUI() {
      const btns = document.querySelectorAll('.sound-toggle-btn');
      btns.forEach(btn => {
        btn.classList.toggle('is-active', soundEnabled);
        btn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
        const text = btn.querySelector('.sound-toggle-label');
        if (text) text.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
      });
    }

    return { playClick, playChime, playTick, toggle, isEnabled, updateToggleUI };
  })();

  window.portfolioSound = SoundFX;

  /* ── 2. CONTEXT-AWARE CUSTOM CURSOR ─────────────────────────────────────── */
  function initCustomCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cursorEl = document.querySelector('.custom-cursor');
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.className = 'custom-cursor';
      cursorEl.innerHTML = '<span class="custom-cursor-text"></span>';
      document.body.appendChild(cursorEl);
    }
    document.body.classList.add('has-custom-cursor');

    const textEl = cursorEl.querySelector('.custom-cursor-text');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isHovering = false;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isHovering) {
        cursorEl.classList.add('is-visible');
        isHovering = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorEl.classList.remove('is-visible');
      isHovering = false;
    });

    // Smooth Lerp animation loop
    function loop() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Event delegation for contextual states
    document.addEventListener('mouseover', e => {
      const target = e.target;
      if (!target || !target.closest) return;

      const tryEl = target.closest('[data-cursor="try"], .live-proto-showcase, .bento-interactive-tile');
      const dragEl = target.closest('[data-cursor="drag"], .process-drag-container');
      const viewEl = target.closest('[data-cursor="view"], .bento-borrow-primary, a.project-tile');
      const linkEl = target.closest('a, button, .sound-toggle-btn, .theme-toggle, input, select');

      if (tryEl) {
        cursorEl.setAttribute('data-state', 'try');
        if (textEl) textEl.textContent = 'TRY IT ✨';
      } else if (dragEl) {
        cursorEl.setAttribute('data-state', 'drag');
        if (textEl) textEl.textContent = 'DRAG ↔';
      } else if (viewEl) {
        cursorEl.setAttribute('data-state', 'view');
        if (textEl) textEl.textContent = 'VIEW ↗';
      } else if (linkEl) {
        cursorEl.setAttribute('data-state', 'hover-link');
        if (textEl) textEl.textContent = '';
      } else {
        cursorEl.removeAttribute('data-state');
        if (textEl) textEl.textContent = '';
      }
    });
  }

  /* ── 3. KINETIC HERO CURSOR 3D TILT ─────────────────────────────────────── */
  function initHeroKinetic() {
    const heroContent = document.getElementById('hero-content');
    if (!heroContent) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetRotX = 0, targetRotY = 0;
    let currRotX = 0, currRotY = 0;

    heroContent.addEventListener('mousemove', e => {
      const rect = heroContent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 8; // Max 4 deg tilt
      targetRotX = -y * 8;
    });

    heroContent.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    function tiltLoop() {
      currRotX += (targetRotX - currRotX) * 0.1;
      currRotY += (targetRotY - currRotY) * 0.1;
      const h1 = heroContent.querySelector('h1');
      if (h1) {
        h1.style.transform = `perspective(1000px) rotateX(${currRotX.toFixed(2)}deg) rotateY(${currRotY.toFixed(2)}deg)`;
      }
      requestAnimationFrame(tiltLoop);
    }
    requestAnimationFrame(tiltLoop);
  }

  /* ── 4. INTERACTIVE DRAGGABLE PROCESS TIMELINE ──────────────────────────── */
  function initDraggableProcess() {
    const slider = document.querySelector('.process-drag-container');
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let momentumID = null;

    slider.addEventListener('mousedown', e => {
      isDown = true;
      slider.classList.add('is-dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      lastX = e.pageX;
      cancelAnimationFrame(momentumID);
      SoundFX.playClick();
    });

    slider.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
      applyMomentum();
    });

    slider.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
      applyMomentum();
    });

    slider.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
      velocity = e.pageX - lastX;
      lastX = e.pageX;
    });

    function applyMomentum() {
      if (Math.abs(velocity) > 0.5) {
        slider.scrollLeft -= velocity;
        velocity *= 0.92;
        momentumID = requestAnimationFrame(applyMomentum);
      }
    }
  }

  /* ── 5. LIVE EMBEDDED PROTOTYPES ────────────────────────────────────────── */
  function initLivePrototypes() {
    // 5A. 1-Tap Request Card
    document.querySelectorAll('.proto-choice-chip').forEach(chip => {
      chip.addEventListener('click', e => {
        const row = chip.closest('.proto-chip-row');
        if (row) {
          row.querySelectorAll('.proto-choice-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          SoundFX.playTick();
        }
      });
    });

    const sendBtn = document.querySelector('.proto-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        SoundFX.playClick();
        sendBtn.textContent = 'Request Sent to Flat 402 ✓';
        sendBtn.style.background = '#008378';
        sendBtn.disabled = true;

        const successNotice = document.querySelector('.proto-success-notice');
        if (successNotice) {
          successNotice.style.display = 'block';
        }

        setTimeout(() => {
          sendBtn.textContent = 'Send 1-Tap Request →';
          sendBtn.style.background = '#00685F';
          sendBtn.disabled = false;
          if (successNotice) successNotice.style.display = 'none';
        }, 3200);
      });
    }

    // 5B. Trust Score Simulator
    const trustSlider = document.querySelector('#proto-trust-range');
    const scoreVal = document.querySelector('.proto-score-val');
    const scoreStatus = document.querySelector('.proto-score-status');
    const scoreLoans = document.querySelector('.proto-score-loans');

    if (trustSlider && scoreVal) {
      trustSlider.addEventListener('input', () => {
        const val = parseFloat(trustSlider.value);
        scoreVal.textContent = val.toFixed(1);
        SoundFX.playTick();

        if (val >= 4.8) {
          if (scoreStatus) scoreStatus.textContent = '★ Verified Trusted Resident';
          if (scoreLoans) scoreLoans.textContent = '32 successful loans · 100% on-time';
        } else if (val >= 4.0) {
          if (scoreStatus) scoreStatus.textContent = '★ Active Community Member';
          if (scoreLoans) scoreLoans.textContent = '14 successful loans · 94% on-time';
        } else {
          if (scoreStatus) scoreStatus.textContent = '○ New Resident / Building Approval';
          if (scoreLoans) scoreLoans.textContent = '2 successful loans · 85% on-time';
        }
      });
    }

    // 5C. Bento Live Sandbox Toggle
    const bentoToggle = document.querySelector('#bento-mini-toggle');
    if (bentoToggle) {
      bentoToggle.addEventListener('change', () => {
        SoundFX.playTick();
        const statusEl = document.querySelector('.bento-toggle-status');
        if (statusEl) {
          statusEl.textContent = bentoToggle.checked ? 'Available for pickup' : 'Currently loaned out';
        }
      });
    }
  }

  /* ── 6. SCROLL-DRIVEN CHAPTER RAIL ──────────────────────────────────────── */
  function initChapterRail() {
    const railLinks = document.querySelectorAll('.bw-chapter-item');
    if (!railLinks.length) return;

    railLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        SoundFX.playClick();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const navOffset = 130;
          const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });

    const chapterSections = Array.from(railLinks).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return { id, link, el: document.getElementById(id) };
    }).filter(c => c.el);

    function updateChapterActive() {
      if (!document.body.classList.contains('route-borrow')) return;
      const scrollPos = window.pageYOffset + 180;
      let activeChapter = null;

      chapterSections.forEach(c => {
        if (c.el.offsetTop <= scrollPos) {
          activeChapter = c;
        }
      });

      chapterSections.forEach(c => {
        c.link.classList.toggle('active', c === activeChapter);
      });
    }

    window.addEventListener('scroll', updateChapterActive, { passive: true });
    updateChapterActive();
  }

  /* ── 7. SOUND TOGGLE BUTTONS INITIALIZATION ──────────────────────────────── */
  function initSoundButtons() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.sound-toggle-btn');
      if (!btn) return;
      e.preventDefault();
      SoundFX.toggle();
    });
    SoundFX.updateToggleUI();

    // Hook general button clicks for haptic sound feedback
    document.addEventListener('click', e => {
      if (!SoundFX.isEnabled()) return;
      const target = e.target;
      if (!target || !target.closest) return;

      const isButton = target.closest('button, .bw-decision-btn, .theme-toggle, .proto-choice-chip');
      if (isButton && !target.closest('.sound-toggle-btn')) {
        SoundFX.playClick();
      }
    });
  }

  /* ── INITIALIZATION ─────────────────────────────────────────────────────── */
  /* ── 7. INTERACTIVE CREATIVE CANVAS & MACOS DOCK ─────────────────────────── */
  function initCanvasHero() {
    const hero = document.getElementById('hero');
    const board = document.getElementById('canvas-board');
    const cloud = document.getElementById('canvas-mind-cloud');
    const dock = document.getElementById('macos-dock');
    if (!hero || !cloud) return;

    const cards = Array.from(cloud.querySelectorAll('.canvas-item'));
    const notesWin = document.getElementById('canvas-notes-window');
    const notesCloseBtn = document.getElementById('notes-close-btn');
    const itemModal = document.getElementById('canvas-item-modal');
    const itemModalScrim = document.getElementById('item-modal-scrim');
    const itemModalClose = document.getElementById('item-modal-close');
    const modalCardImg = document.getElementById('modal-card-img');
    const modalCardTitle = document.getElementById('modal-card-title');
    const modalCardDesc = document.getElementById('modal-card-desc');

    /* ── Draggable Cards Engine ── */
    cards.forEach(card => {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialLeft = 0;
      let initialTop = 0;
      let hasMoved = false;

      card.addEventListener('pointerdown', e => {
        // Only primary mouse button or touch
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;

        const rect = card.getBoundingClientRect();
        const parentRect = cloud.getBoundingClientRect();
        initialLeft = rect.left + rect.width / 2 - parentRect.left;
        initialTop = rect.top + rect.height / 2 - parentRect.top;

        card.setPointerCapture(e.pointerId);
        card.classList.add('is-dragging');
        SoundFX.playTick();
      });

      card.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.hypot(dx, dy) > 5) {
          hasMoved = true;
        }

        const parentRect = cloud.getBoundingClientRect();
        let newX = initialLeft + dx;
        let newY = initialTop + dy;

        // Keep inside bounds
        newX = Math.max(20, Math.min(parentRect.width - 20, newX));
        newY = Math.max(20, Math.min(parentRect.height - 20, newY));

        const pctX = (newX / parentRect.width) * 100;
        const pctY = (newY / parentRect.height) * 100;
        card.style.left = pctX.toFixed(2) + '%';
        card.style.top = pctY.toFixed(2) + '%';
      });

      function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('is-dragging');
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}

        if (!hasMoved) {
          // Card was tapped/clicked: open preview modal
          openCardModal(card);
        }
      }

      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);
    });

    /* ── Card Modal Open / Close ── */
    function openCardModal(card) {
      if (!itemModal) return;
      const label = card.getAttribute('data-label') || 'Project Artwork';
      const subtitle = card.getAttribute('data-subtitle') || 'UI/UX & Brand Creative Direction';
      const img = card.querySelector('img');

      if (modalCardTitle) modalCardTitle.textContent = label;
      if (modalCardDesc) modalCardDesc.textContent = subtitle + '. Crafted by Sunil Ohdar exploring high-craft visual identity, structured Figma component tokens, and tactile digital interactions.';
      if (modalCardImg && img) {
        modalCardImg.src = img.src;
        modalCardImg.alt = label;
      }

      itemModal.style.display = 'flex';
      SoundFX.playChime();
    }

    function closeCardModal() {
      if (itemModal) itemModal.style.display = 'none';
    }

    if (itemModalScrim) itemModalScrim.addEventListener('click', closeCardModal);
    if (itemModalClose) itemModalClose.addEventListener('click', closeCardModal);

    /* ── macOS Parabolic Dock Magnification ── */
    if (dock) {
      const dockItems = Array.from(dock.querySelectorAll('.dock-item'));
      const maxDist = 95;
      const maxScale = 0.42;

      dock.addEventListener('mousemove', e => {
        const mouseX = e.clientX;
        dockItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const dist = Math.abs(mouseX - centerX);
          if (dist < maxDist) {
            const factor = Math.cos((dist / maxDist) * (Math.PI / 2));
            const scale = 1 + maxScale * factor;
            item.style.transform = 'scale(' + scale.toFixed(3) + ')';
          } else {
            item.style.transform = 'scale(1)';
          }
        });
      });

      dock.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
          item.style.transform = 'scale(1)';
        });
      });

      /* ── Dock Click Actions ── */
      dockItems.forEach(item => {
        item.addEventListener('click', e => {
          const app = item.getAttribute('data-app');
          item.classList.remove('dock-bounce-anim');
          void item.offsetWidth; // trigger reflow
          item.classList.add('dock-bounce-anim');
          SoundFX.playClick();

          if (app === 'trash') {
            // Reset all cards back to original positions with spring stagger
            cards.forEach((card, idx) => {
              const homeLeft = card.getAttribute('data-home-left');
              const homeTop = card.getAttribute('data-home-top');
              setTimeout(() => {
                card.style.transition = 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.left = homeLeft;
                card.style.top = homeTop;
                setTimeout(() => {
                  card.style.transition = '';
                }, 460);
              }, idx * 12);
            });
            SoundFX.playChime();
          } else if (app === 'notes') {
            if (notesWin) {
              notesWin.style.display = notesWin.style.display === 'none' ? 'block' : 'none';
              if (notesWin.style.display === 'block') SoundFX.playChime();
            }
          } else if (app === 'alert') {
            const bento = document.getElementById('bento');
            if (bento) bento.scrollIntoView({ behavior: 'smooth' });
          } else if (app === 'photos') {
            if (cards.length > 0) openCardModal(cards[0]);
          } else if (app === 'mail') {
            window.location.href = 'mailto:sunilohdar.design@gmail.com?subject=Design%20Inquiry%20from%20Portfolio';
          } else if (app === 'instagram') {
            window.open('https://instagram.com', '_blank', 'noopener');
          } else if (app === 'ae' || app === 'ps' || app === 'ai') {
            const toolCards = {
              'ae': 'stage-visuals',
              'ps': 'collage-animations',
              'ai': 'wine-bottle'
            };
            const targetCard = cards.find(c => c.getAttribute('data-id') === toolCards[app]);
            if (targetCard) openCardModal(targetCard);
          }
        });
      });
    }

    /* ── Notes Window Controls ── */
    if (notesCloseBtn && notesWin) {
      notesCloseBtn.addEventListener('click', () => {
        notesWin.style.display = 'none';
        SoundFX.playClick();
      });
    }

    // Escape key closes modals
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (notesWin) notesWin.style.display = 'none';
        if (itemModal) itemModal.style.display = 'none';
      }
    });
  }

  function initAll() {
    initCustomCursor();
    initHeroKinetic();
    initCanvasHero();
    initDraggableProcess();
    initLivePrototypes();
    initChapterRail();
    initSoundButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
