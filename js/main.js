/* ══════════════════════════════════════════════════════════
   BRIO HEALTH & INFO SERVICES — Main JS
   ══════════════════════════════════════════════════════════ */

/* ── PARTICLE CANVAS ── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];
  const MAX_P = 80;
  const COLORS = ['rgba(0,212,255,', 'rgba(38,208,206,', 'rgba(26,41,128,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.3;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < MAX_P; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const op = (1 - dist / 130) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${op})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // draw dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();


/* ── NAVBAR SCROLL ── */
(function () {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── HAMBURGER MENU ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


/* ── SMOOTH ACTIVE NAV ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--cyan)'
            : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();


/* ── COUNTER ANIMATION ── */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ── SCROLL REVEAL ── */
(function () {
  // add reveal class to target elements
  const targets = [
    '.sol-card', '.why-card', '.industry-card', '.contact-item',
    '.about-grid > *', '.tech-logo', '.section-title', '.section-sub', '.section-label'
  ];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ── CONTACT FORM (mailto fallback) ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const name     = data.get('name')     || '';
    const company  = data.get('company')  || '';
    const email    = data.get('email')    || '';
    const phone    = data.get('phone')    || '';
    const interest = data.get('interest') || '';
    const message  = data.get('message')  || '';

    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nInterested In: ${interest}\n\n${message}`
    );
    const subject = encodeURIComponent(`Brio Website Inquiry — ${interest || 'General'}`);
    window.location.href = `mailto:briohealthninfo@gmail.com?subject=${subject}&body=${body}`;

    // visual feedback
    const btn = form.querySelector('.btn-primary');
    const orig = btn.querySelector('.btn-text').textContent;
    btn.querySelector('.btn-text').textContent = 'Opening Mail App…';
    btn.disabled = true;
    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = orig;
      btn.disabled = false;
    }, 3000);
  });
})();


/* ── TILT EFFECT ON CARDS ── */
(function () {
  const cards = document.querySelectorAll('.sol-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (-y / rect.height * 6).toFixed(2);
      const rotY = ( x / rect.width  * 6).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── CURSOR GLOW FOLLOWER ── */
(function () {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04), transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
