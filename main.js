/* ═══════════════════════════════════════════════
   SARTHAK PORTFOLIO — main.js
   Particles · Cursor · Scroll Animations
   Typed Text · Filter · Form · Magnetic Btns
═══════════════════════════════════════════════ */

'use strict';

/* ─── DOM READY ─── */
/* ══════════════════════════════════════════════
   0. OVERRIDE SCROLL ON REFRESH
══════════════════════════════════════════════ */
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initParticles();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initFilter();
  initMagneticButtons();
  initSlideshows();
});

/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // Smooth follower with RAF
  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });
}

/* ══════════════════════════════════════════════
   2. NAVBAR SCROLL EFFECT
══════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   3. MOBILE MENU
══════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Hamburger → X
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  };
  const close = () => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  };

  toggle.addEventListener('click', () =>
    menu.classList.contains('open') ? close() : open()
  );
  links.forEach(l => l.addEventListener('click', close));
}

/* ══════════════════════════════════════════════
   4. PARTICLE CANVAS
══════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const COUNT = window.innerWidth < 768 ? 60 : 110;
  const COLORS = ['#818cf8', '#7c3aed', '#2563eb', '#22d3ee'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse parallax
  document.getElementById('hero')?.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.getElementById('hero')?.addEventListener('mouseleave', () => {
    mouse = { x: -9999, y: -9999 };
  });

  // Create particles
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1,     // initialized in reset
      y: Math.random() * 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    particles[i].x = Math.random() * window.innerWidth;
    particles[i].y = Math.random() * window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Gradient background overlay
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    grad.addColorStop(0, 'rgba(124,58,237,0.06)');
    grad.addColorStop(0.5, 'rgba(37,99,235,0.03)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;
      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;
      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x, ey = p.y - q.y;
        const ed = Math.sqrt(ex * ex + ey * ey);
        if (ed < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          const a = (1 - ed / 110) * 0.18;
          ctx.strokeStyle = `rgba(129,140,248,${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════
   5. TYPING EFFECT
══════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const lines = [
    'AI/ML Enthusiast',
    'Full Stack Developer',
    'Problem Solver',
    'Building Intelligent Systems',
  ];
  let li = 0, ci = 0, deleting = false;
  const speed = { type: 75, delete: 40, pause: 1600 };

  function tick() {
    const current = lines[li];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, speed.pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        li = (li + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }
  tick();
}

/* ══════════════════════════════════════════════
   6. SCROLL REVEAL — IntersectionObserver
══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   7. SKILL BARS ANIMATION
══════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.w;
        e.target.style.width = target + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
}

/* ══════════════════════════════════════════════
   8. PROJECT FILTER
══════════════════════════════════════════════ */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active btn
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = f === 'all' || cat === f;
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}


/* ══════════════════════════════════════════════
   10. MAGNETIC BUTTONS
══════════════════════════════════════════════ */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.magnetic');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════
   11. PROJECT SLIDESHOWS
══════════════════════════════════════════════ */
function initSlideshows() {
  const containers = document.querySelectorAll('.card-slideshow');
  containers.forEach((container, index) => {
    const slides = container.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    let current = 0;
    // Add a slight stagger so multiple slideshows don't sync perfectly
    setTimeout(() => {
      setInterval(() => {
        // Remove prev from old slides
        slides.forEach(s => s.classList.remove('prev'));
        
        // Mark current as prev (sliding out to left)
        slides[current].classList.add('prev');
        slides[current].classList.remove('active');
        
        // Mark next as active (sliding in from right)
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 4000);
    }, index * 1000);
  });
}
