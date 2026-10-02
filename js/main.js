/* ============================================
   Portfolio — Shared Interactions
   ============================================ */

// ---------- Loader ----------
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;

  const text = loader.querySelector('.loader-text');
  if (text) {
    const str = text.textContent;
    text.textContent = '';
    str.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${0.05 * i}s`;
      text.appendChild(span);
    });
  }

  const bar = loader.querySelector('.loader-bar');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30 + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        initReveal();
      }, 300);
    }
    if (bar) bar.style.width = `${progress}%`;
  }, 120);

  document.body.style.overflow = 'hidden';
}

// ---------- Navbar ----------
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ---------- Custom cursor ----------
function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .chip, .stat-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ---------- Scroll reveal ----------
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Split words
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    const line = document.createElement('span');
    line.className = 'split-line';
    text.split(' ').forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'split-word';
      w.textContent = word;
      w.style.transitionDelay = `${i * 0.06}s`;
      line.appendChild(w);
      line.appendChild(document.createTextNode('\u00A0'));
    });
    el.appendChild(line);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });
}

// ---------- Animated counters ----------
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = (target >= 10 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ---------- Skill bars ----------
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const pct = el.dataset.pct;
      requestAnimationFrame(() => { el.style.width = pct + '%'; });
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
}

// ---------- Magnetic buttons ----------
function initMagnetic() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.btn, .nav-cta, .logo').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ---------- 3D tilt cards ----------
function initTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const rx = ((cy / rect.height) - 0.5) * -10;
      const ry = ((cx / rect.width) - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---------- Parallax on scroll ----------
function initParallax() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// ---------- Page transitions ----------
function initPageTransitions() {
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) {
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(8px)';
    wrapper.style.transition = 'opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
      });
    });
  }

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (wrapper) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(-12px)';
      }
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
}

// ---------- Contact form ----------
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.querySelectorAll('input, textarea').forEach(f => f.value = '');
      btn.innerHTML = original;
      btn.disabled = false;

      let success = form.querySelector('.form-success');
      if (!success) {
        success = document.createElement('div');
        success.className = 'form-success';
        form.prepend(success);
      }
      success.innerHTML = '✓ Thanks! Your message has been sent. I\'ll get back to you soon.';
      setTimeout(() => { if (success) success.remove(); }, 5000);
    }, 1200);
  });
}

// ---------- Smooth anchor scroll ----------
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---------- Init everything ----------
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initCursor();
  initCounters();
  initSkillBars();
  initMagnetic();
  initTilt();
  initParallax();
  initPageTransitions();
  initContactForm();
  initSmoothAnchors();
});
