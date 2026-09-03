/**
 * 3D Interactive Features, Labs & Coverflow for Sunil Ohdar's Portfolio
 * - Redeveloped 3D Coverflow Carousel Engine with real video assets
 * - 3D Card Parallax Tilt & Dynamic Specular Sheen
 * - Audio-Reactive 3D Visualizer (Connected to Tame Impala - Loser)
 * - WebGL Black Hole Raymarching Shader Studio
 * - Playground 3D Lab Tab Switcher
 */

(function () {
  'use strict';

  /* ========================================================================== */
  /* 1. Redeveloped 3D Coverflow Carousel Engine                                */
  /* ========================================================================== */
  const PLAYGROUND_DATA = [
    {
      src: '/assets/fireflut/mwc-hero-screen.mp4',
      poster: '/assets/fireflut/mwc-hero-screen-poster.jpg',
      type: 'video',
      title: 'AI Voice Assistant UI',
      tool: 'Figma · Flutter · 2025',
      desc: 'Adaptive conversational assistant interface with responsive speech cards and fluid micro-interactions.'
    },
    {
      src: '/assets/fireflut/voice.mp4',
      poster: '/assets/fireflut/voice-poster.jpg',
      type: 'video',
      title: '3D Audio Waveform & Speech UI',
      tool: 'Spline · 3D Interaction · 2025',
      desc: 'Interactive 3D soundwave visualizer responding dynamically to voice frequencies and speech prompts.'
    },
    {
      src: '/assets/fireflut/gauge.mp4',
      poster: '/assets/fireflut/gauge-poster.jpg',
      type: 'video',
      title: 'Radial Analytics & Telemetry Gauge',
      tool: 'Figma · Prototyping · 2025',
      desc: 'Dynamic circular gauge metrics and telemetry visualization designed for performance dashboards.'
    },
    {
      src: '/assets/fireflut/pre-prompts.mp4',
      poster: '/assets/fireflut/pre-prompts-poster.jpg',
      type: 'video',
      title: 'Smart Conversational Prompts',
      tool: 'UI/UX · Motion Design · 2025',
      desc: 'Contextual prompt suggestion cards with spring animations and user onboarding flows.'
    },
    {
      src: '/assets/genUI case study assets/cards carousel.mp4',
      poster: '/assets/genUI case study assets/cards carousel-poster.jpg',
      type: 'video',
      title: '3D Dimensional Card Carousel',
      tool: 'Three.js · Spline · 2024',
      desc: 'Perspective depth card carousel exploring material physical properties and dimensional movement.'
    },
    {
      src: '/assets/genUI case study assets/color theme.mp4',
      poster: '/assets/genUI case study assets/color theme-poster.jpg',
      type: 'video',
      title: 'Generative Color Palette Studio',
      tool: 'Creative Dev · 2024',
      desc: 'Algorithmically blended color harmony studio calculating contrast ratios and dynamic accent themes.'
    },
    {
      src: '/assets/genUI case study assets/chips animation.mp4',
      poster: '/assets/genUI case study assets/chips animation-poster.jpg',
      type: 'video',
      title: 'Fluid Filter Chips & Haptics',
      tool: 'Interaction Design · 2024',
      desc: 'Physics-driven filter chips with haptic bounce feedback and smooth layout reflow.'
    },
    {
      src: '/assets/Jumpable case study assets/onboarding-design.mp4',
      poster: '/assets/Jumpable case study assets/onboarding-design-poster.jpg',
      type: 'video',
      title: 'Smartwatch Onboarding Funnel',
      tool: 'UED · Product Design · 2025',
      desc: 'Wearable smart device onboarding funnel guiding users through activity calibration and biometric setup.'
    },
    {
      src: '/assets/Jumpable case study assets/home-screen-redesign.mp4',
      poster: '/assets/Jumpable case study assets/home-screen-redesign-poster.jpg',
      type: 'video',
      title: 'Haptic Activity Dashboard',
      tool: 'Mobile UI/UX · 2025',
      desc: 'High-density activity tracking dashboard engineered for rapid glances, touch targets, and charts.'
    },
    {
      src: '/assets/existence case study assets/existence-screens/screen-1.mp4',
      poster: '/assets/existence case study assets/existence-screens/screen-1-poster.jpg',
      type: 'video',
      title: 'Spatial Interface & Depth Navigation',
      tool: 'Blender · 3D Spatial · 2024',
      desc: 'Spatial navigation and layered depth exploration for modern immersive digital interfaces.'
    }
  ];

  function initRedevelopedCoverflow() {
    const stage = document.getElementById('pgf-stage');
    const track = document.getElementById('pgf-track');
    const prevBtn = document.getElementById('pgf-prev');
    const nextBtn = document.getElementById('pgf-next');
    const cap = document.getElementById('pgf-caption');
    const capIndex = document.getElementById('pgf-cap-index');
    const capTags = document.getElementById('pgf-cap-tags');
    const capTitle = document.getElementById('pgf-cap-title');
    const capDesc = document.getElementById('pgf-cap-desc');
    const lb = document.getElementById('pgf-lightbox');
    const lbClose = document.getElementById('pgf-lb-close');
    const lbStage = document.getElementById('pgf-lb-stage');
    const lbIndex = document.getElementById('pgf-lb-index');
    const lbTitle = document.getElementById('pgf-lb-title');
    const lbDesc = document.getElementById('pgf-lb-desc');
    const lbTags = document.getElementById('pgf-lb-tags');
    const lbPrev = document.getElementById('pgf-lb-prev');
    const lbNext = document.getElementById('pgf-lb-next');

    if (!stage || !track) return;

    const N = PLAYGROUND_DATA.length;
    let active = 0;
    const mod = (a, b) => ((a % b) + b) % b;
    const pad = n => (n < 10 ? '0' + n : '' + n);

    // Create pagination dots container if missing
    let dotsContainer = document.getElementById('pgf-dots');
    if (!dotsContainer && cap) {
      dotsContainer = document.createElement('div');
      dotsContainer.id = 'pgf-dots';
      dotsContainer.className = 'pgf-dots';
      cap.parentNode.insertBefore(dotsContainer, cap.nextSibling);
    }

    // Clean track
    track.innerHTML = '';
    const cards = PLAYGROUND_DATA.map((d, i) => {
      const card = document.createElement('div');
      card.className = 'pgf-card';
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${d.title} — open full screen`);
      card.setAttribute('tabindex', i === 0 ? '0' : '-1');

      card.innerHTML = `
        <div class="pgf-card-media">
          <video muted loop playsinline preload="metadata" poster="${d.poster}">
            <source src="${d.src}" type="video/mp4">
          </video>
        </div>
        <div class="pgf-card-vhs"></div>
        <div class="pgf-card-reflection"></div>
        <span class="pgf-card-expand" aria-hidden="true">⤢ <i>Open Full Screen</i></span>
      `;
      track.appendChild(card);
      return card;
    });

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < N; i++) {
        const dot = document.createElement('button');
        dot.className = `pgf-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => go(i));
        dotsContainer.appendChild(dot);
      }
    }

    function layout() {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      const spread = isMobile ? 62 : isTablet ? 54 : 48; // % translateX
      const depth = isMobile ? 180 : 260; // px translateZ
      const rot = isMobile ? 30 : 38; // deg rotateY
      const visible = isMobile ? 1 : 2; // neighbor cards shown

      cards.forEach((card, i) => {
        let off = i - active;
        if (off > N / 2) off -= N;
        if (off < -N / 2) off += N;

        const abs = Math.abs(off);
        const dir = off < 0 ? -1 : off > 0 ? 1 : 0;

        if (abs > visible) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = `translate3d(${dir * spread * (visible + 1)}%, 0, ${-depth * (visible + 1)}px) rotateY(${-dir * rot}deg) scale(0.6)`;
          return;
        }

        const scale = abs === 0 ? (isMobile ? 1.0 : 1.06) : 1 - abs * 0.12;
        const opacity = abs === 0 ? 1 : abs === 1 ? 0.6 : 0.25;
        const zIndex = 100 - abs;
        const zElevate = abs === 0 ? 60 : -abs * depth;

        card.style.opacity = String(opacity);
        card.style.pointerEvents = 'auto';
        card.style.zIndex = String(zIndex);
        card.style.transform = `translate3d(${off * spread}%, 0, ${zElevate}px) rotateY(${-off * rot}deg) scale(${scale})`;
        card.classList.toggle('is-active', off === 0);
        card.setAttribute('tabindex', off === 0 ? '0' : '-1');
      });

      // Update active video playback
      cards.forEach((card, i) => {
        const video = card.querySelector('video');
        if (!video) return;
        if (i === active) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });

      // Update Caption
      if (cap) {
        const d = PLAYGROUND_DATA[active];
        cap.classList.add('swap');
        setTimeout(() => {
          if (capIndex) capIndex.textContent = `${pad(active + 1)} / ${pad(N)}`;
          if (capTags) capTags.textContent = d.tool;
          if (capTitle) capTitle.textContent = d.title;
          if (capDesc) capDesc.textContent = d.desc;
          cap.classList.remove('swap');
        }, 160);
      }

      // Update Dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.pgf-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === active);
        });
      }
    }

    function go(i) {
      active = mod(i, N);
      layout();
    }

    function next() { go(active + 1); }
    function prev() { go(active - 1); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Card Click: Focus or Open
    cards.forEach((card, i) => {
      card.addEventListener('click', e => {
        if (dragMoved) return;
        if (i === active) {
          openLightbox(i);
        } else {
          go(i);
        }
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (i === active) openLightbox(i);
          else go(i);
        }
      });
    });

    // Touch & Mouse Drag Gestures
    let isDragging = false;
    let startX = 0;
    let dragMoved = false;

    stage.addEventListener('pointerdown', e => {
      if (e.target.closest('.pgf-arrow, .pgf-dot')) return;
      isDragging = true;
      startX = e.clientX;
      dragMoved = false;
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    });

    stage.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 35) {
        dragMoved = true;
        if (dx < 0) next();
        else prev();
        startX = e.clientX;
      }
    });

    const endDrag = e => {
      if (!isDragging) return;
      isDragging = false;
      try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
      setTimeout(() => { dragMoved = false; }, 60);
    };

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // Wheel Scroll
    let wheelLock = false;
    stage.addEventListener('wheel', e => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 15) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      if (delta > 0) next();
      else prev();
      setTimeout(() => { wheelLock = false; }, 360);
    }, { passive: false });

    // Keyboard navigation
    window.addEventListener('keydown', e => {
      const isPlayground = window.location.hash === '#playground' || window.location.pathname.includes('playground');
      if (!isPlayground) return;
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') renderLightbox(mod(active + 1, N));
        if (e.key === 'ArrowLeft') renderLightbox(mod(active - 1, N));
        return;
      }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    // Lightbox Handlers
    function renderLightbox(i) {
      active = i;
      layout();
      const d = PLAYGROUND_DATA[i];
      if (lbStage) {
        lbStage.innerHTML = `
          <video src="${d.src}" poster="${d.poster}" controls autoplay loop playsinline></video>
        `;
      }
      if (lbIndex) lbIndex.textContent = `${pad(i + 1)} / ${pad(N)}`;
      if (lbTitle) lbTitle.textContent = d.title;
      if (lbDesc) lbDesc.textContent = d.desc;
      if (lbTags) lbTags.textContent = d.tool;
    }

    function openLightbox(i) {
      if (!lb) return;
      renderLightbox(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      if (lbStage) lbStage.innerHTML = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => renderLightbox(mod(active - 1, N)));
    if (lbNext) lbNext.addEventListener('click', () => renderLightbox(mod(active + 1, N)));

    // Initial Layout
    layout();
    window.addEventListener('resize', layout);
  }

  /* ========================================================================== */
  /* 2. 3D Card Parallax Tilt with Dynamic Specular Glare                       */
  /* ========================================================================== */
  function init3DCardTilt() {
    const targets = document.querySelectorAll('.project-tile, .ai-polaroid, .t-card, .ff-card');
    
    targets.forEach(card => {
      let bounds = null;
      let isHovered = false;

      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }

      card.addEventListener('pointerenter', () => {
        isHovered = true;
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
      });

      card.addEventListener('pointermove', e => {
        if (!isHovered || !bounds) return;
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        const glareX = (x / bounds.width) * 100;
        const glareY = (y / bounds.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)`;
        glare.style.opacity = '1';
      });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  /* ========================================================================== */
  /* 3. Audio-Reactive 3D Particle Visualizer Engine                            */
  /* ========================================================================== */
  let audioCtx = null;
  let analyser = null;
  let audioSource = null;
  let freqData = null;

  function ensureAudioContext() {
    if (audioCtx) return;
    const audioEl = document.getElementById('audio');
    if (!audioEl) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      freqData = new Uint8Array(analyser.frequencyBinCount);

      audioSource = audioCtx.createMediaElementSource(audioEl);
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (err) {
      console.warn('AudioContext init note:', err);
    }
  }

  function initHeroAudioViz() {
    const canvas = document.getElementById('hero-audio-viz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;
    const particles = [];
    const NUM_PARTICLES = 60;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        baseAngle: (i / NUM_PARTICLES) * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.005,
        radius: 120 + Math.random() * 40,
        size: 2 + Math.random() * 2,
        color: i % 2 === 0 ? 'rgba(246, 199, 64, 0.75)' : 'rgba(255, 255, 255, 0.65)'
      });
    }

    function render() {
      requestAnimationFrame(render);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      let bass = 0;
      let mid = 0;
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        let sumBass = 0;
        for (let i = 0; i < 8; i++) sumBass += freqData[i];
        bass = sumBass / 8 / 255;

        let sumMid = 0;
        for (let i = 8; i < 32; i++) sumMid += freqData[i];
        mid = sumMid / 24 / 255;
      }

      const cx = w / 2;
      const cy = h / 2;
      angle += 0.01 + bass * 0.03;

      const pulseRadius = (130 + bass * 45) * (w / 800);
      const grad = ctx.createRadialGradient(cx, cy, pulseRadius * 0.3, cx, cy, pulseRadius * 1.4);
      grad.addColorStop(0, `rgba(246, 199, 64, ${0.12 + bass * 0.25})`);
      grad.addColorStop(0.5, `rgba(180, 110, 40, ${0.06 + bass * 0.15})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (freqData) {
        ctx.strokeStyle = `rgba(246, 199, 64, ${0.4 + bass * 0.5})`;
        ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        const steps = 36;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2 + angle;
          const binIdx = Math.floor((i % steps) * (freqData.length / steps));
          const amp = (freqData[binIdx] / 255) * 35 * (w / 800);
          const r = pulseRadius + amp;
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * (r * 0.55);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      particles.forEach(p => {
        const curAngle = p.baseAngle + angle * 1.2;
        const curR = (p.radius + mid * 30) * (w / 800);
        const px = cx + Math.cos(curAngle) * curR;
        const py = cy + Math.sin(curAngle) * (curR * 0.55);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, (p.size + bass * 3) * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    render();
  }

  function initPlaygroundAudioViz() {
    const canvas = document.getElementById('pg-audioviz-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize);

    let rotX = 0.3;
    let rotY = 0;
    let autoRot = 0;

    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener('pointerdown', e => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    const endDrag = e => {
      if (!isDragging) return;
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    const spherePoints = [];
    const SPHERE_POINTS = 280;
    for (let i = 0; i < SPHERE_POINTS; i++) {
      const phi = Math.acos(-1 + (2 * i) / SPHERE_POINTS);
      const theta = Math.sqrt(SPHERE_POINTS * Math.PI) * phi;
      spherePoints.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        bin: i % 64
      });
    }

    function render3DAudio() {
      requestAnimationFrame(render3DAudio);
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(10, 12, 18, 0.35)';
      ctx.fillRect(0, 0, w, h);

      if (!isDragging) autoRot += 0.006;
      const totalRotY = rotY + autoRot;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.32;

      let bass = 0;
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += freqData[i];
        bass = sum / 10 / 255;
      }

      const projected = [];
      spherePoints.forEach(pt => {
        const cosY = Math.cos(totalRotY);
        const sinY = Math.sin(totalRotY);
        let x1 = pt.x * cosY + pt.z * sinY;
        let y1 = pt.y;
        let z1 = -pt.x * sinY + pt.z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;
        let x2 = x1;

        const val = freqData ? (freqData[pt.bin] / 255) : (0.2 + Math.sin(autoRot * 2 + pt.bin) * 0.15);
        const rFactor = 1 + val * 0.65 + bass * 0.25;

        const dist = 3.5;
        const persp = dist / (dist + z2);
        const screenX = cx + x2 * scale * rFactor * persp;
        const screenY = cy + y2 * scale * rFactor * persp;
        const size = Math.max(1.2, (2.8 + val * 4) * persp * (window.devicePixelRatio || 1));

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          val,
          size,
          alpha: Math.min(1, Math.max(0.15, (z2 + 1.2) / 2.2))
        });
      });

      projected.sort((a, b) => a.z - b.z);

      projected.forEach(p => {
        const hue = 38 + p.val * 50 + bass * 30;
        ctx.fillStyle = `hsla(${hue}, 92%, ${55 + p.val * 25}%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = `${13 * (window.devicePixelRatio || 1)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      const audioEl = document.getElementById('audio');
      const isPlaying = audioEl && !audioEl.paused;
      ctx.fillText(
        isPlaying ? '● REAL-TIME AUDIO FREQUENCY REACTIVE (DRAG TO ROTATE 3D)' : 'CLICK PLAY ON TAPE PLAYER TO ACTIVATE LIVE FREQUENCIES',
        cx,
        h - 30 * (window.devicePixelRatio || 1)
      );
    }

    render3DAudio();
  }

  /* ========================================================================== */
  /* 4. Interactive WebGL Black Hole Shader Studio                             */
  /* ========================================================================== */
  function initBlackHoleStudio() {
    const canvas = document.getElementById('blackhole-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, depth: false });
    if (!gl) return;

    const VERT_SRC = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const FRAG_SRC = `
      precision highp float;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uDistortion;
      uniform float uSpinSpeed;
      uniform vec3 uColorHot;
      uniform vec3 uColorMid;
      uniform vec3 uColorCool;
      varying vec2 vUv;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        vec2 m = (uMouse - 0.5) * 1.4;
        vec2 p = uv - m * 0.35;
        float r = length(p);
        float a = atan(p.y, p.x);

        float horizon = 0.22 * uDistortion;
        float photonRing = horizon * 1.5;
        
        if (r < horizon) {
          gl_FragColor = vec4(0.02, 0.02, 0.03, 1.0);
          return;
        }

        float disk = 0.0;
        float spiral = a + uTime * uSpinSpeed + 1.8 / (r + 0.001);
        float noise = sin(spiral * 6.0) * 0.5 + sin(spiral * 14.0) * 0.25;
        
        float diskR = smoothstep(horizon * 0.9, horizon * 2.8, r) * smoothstep(horizon * 4.2, horizon * 1.2, r);
        disk = (diskR + noise * 0.18 * diskR);

        float doppler = 1.0 + 0.65 * cos(a - 0.4);
        disk *= doppler;

        float ring = exp(-pow((r - photonRing) / 0.015, 2.0)) * 2.2;

        vec3 col = mix(uColorCool, uColorMid, smoothstep(horizon * 3.5, horizon * 1.8, r));
        col = mix(col, uColorHot, smoothstep(horizon * 1.8, horizon * 1.05, r));
        
        vec3 finalColor = col * disk * 1.8 + uColorHot * ring * 1.4;
        
        vec2 starUv = p * (1.0 + (horizon * 0.12) / (r * r));
        float star = step(0.996, fract(sin(dot(starUv, vec2(12.9898, 78.233))) * 43758.5453));
        finalColor += vec3(star * 0.45);

        finalColor *= 1.0 - smoothstep(0.4, 1.4, length(uv));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uResolution');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uDist = gl.getUniformLocation(prog, 'uDistortion');
    const uSpin = gl.getUniformLocation(prog, 'uSpinSpeed');
    const uHot = gl.getUniformLocation(prog, 'uColorHot');
    const uMid = gl.getUniformLocation(prog, 'uColorMid');
    const uCool = gl.getUniformLocation(prog, 'uColorCool');

    let mouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];
    let distortion = 1.0;
    let spinSpeed = 1.2;
    let colors = {
      hot: [1.0, 0.92, 0.65],
      mid: [0.95, 0.52, 0.12],
      cool: [0.65, 0.18, 0.05]
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * Math.min(window.devicePixelRatio || 1, 2);
      canvas.height = rect.height * Math.min(window.devicePixelRatio || 1, 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('pointermove', e => {
      const rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    });

    const themeBtns = document.querySelectorAll('[data-bh-theme]');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.bhTheme;
        if (theme === 'amber') {
          colors = { hot: [1.0, 0.92, 0.65], mid: [0.95, 0.52, 0.12], cool: [0.65, 0.18, 0.05] };
        } else if (theme === 'violet') {
          colors = { hot: [0.95, 0.8, 1.0], mid: [0.65, 0.25, 0.95], cool: [0.2, 0.05, 0.6] };
        } else if (theme === 'cyan') {
          colors = { hot: [0.8, 1.0, 1.0], mid: [0.08, 0.72, 0.95], cool: [0.02, 0.22, 0.55] };
        } else if (theme === 'solar') {
          colors = { hot: [1.0, 0.98, 0.85], mid: [1.0, 0.35, 0.08], cool: [0.55, 0.02, 0.02] };
        }
      });
    });

    const speedSlider = document.getElementById('bh-speed-slider');
    if (speedSlider) {
      speedSlider.addEventListener('input', e => {
        spinSpeed = parseFloat(e.target.value);
      });
    }

    const distSlider = document.getElementById('bh-dist-slider');
    if (distSlider) {
      distSlider.addEventListener('input', e => {
        distortion = parseFloat(e.target.value);
      });
    }

    let start = performance.now();
    function loop() {
      requestAnimationFrame(loop);
      const t = (performance.now() - start) * 0.001;

      mouse[0] += (targetMouse[0] - mouse[0]) * 0.08;
      mouse[1] += (targetMouse[1] - mouse[1]) * 0.08;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.uniform1f(uDist, distortion);
      gl.uniform1f(uSpin, spinSpeed);
      gl.uniform3fv(uHot, colors.hot);
      gl.uniform3fv(uMid, colors.mid);
      gl.uniform3fv(uCool, colors.cool);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    loop();
  }

  /* ========================================================================== */
  /* 5. Playground Tab Switcher                                                 */
  /* ========================================================================== */
  function initPlaygroundTabs() {
    const tabs = document.querySelectorAll('.pg-tab-btn');
    const panels = document.querySelectorAll('.pg-tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          window.dispatchEvent(new Event('resize'));
        }
      });
    });
  }

  /* ========================================================================== */
  /* Initialize on DOM Ready                                                    */
  /* ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initRedevelopedCoverflow();
    init3DCardTilt();
    initHeroAudioViz();
    initPlaygroundAudioViz();
    initBlackHoleStudio();
    initPlaygroundTabs();

    const audio = document.getElementById('audio');
    if (audio) {
      audio.addEventListener('play', () => {
        ensureAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }, { once: false });
    }

    window.addEventListener('click', ensureAudioContext, { once: true });
  });

})();
