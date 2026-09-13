document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  if (header){
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links){
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (isFinePointer){
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring){
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      });
      (function loop(){
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a, button, .process-step, .why-item, .service-row, .service-card, .impact-card, .portfolio-card, .contact-method, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('grow'));
        el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
      });
    }

    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });

    document.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'click-ring';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 900);
    });
  }

  const revealEls = document.querySelectorAll('.section-head, .hero-inner, .page-hero .wrap');
  revealEls.forEach(el => {
    el.style.opacity = 0; el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));

  /* ---- interactive scattered dot field (home hero only) ---- */
  const heroCanvas = document.getElementById('dotCanvas');
  if (heroCanvas){
    const hero = document.querySelector('.hero');
    const ctx = heroCanvas.getContext('2d');
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [], edges = [];
    let mouse = { x: -9999, y: -9999, active: false };
    const RADIUS = 190;

    function gaussian(){
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) / 2.6;
    }

    function build(){
      const rect = hero.getBoundingClientRect();
      w = rect.width; h = rect.height;
      heroCanvas.width = w * dpr; heroCanvas.height = h * dpr;
      heroCanvas.style.width = w + 'px'; heroCanvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const count = Math.round((w * h) / 9000);
      const clusters = [
        { x: w * 0.78, y: h * 0.30, spread: Math.min(w, h) * 0.30 },
        { x: w * 0.90, y: h * 0.62, spread: Math.min(w, h) * 0.22 },
        { x: w * 0.60, y: h * 0.78, spread: Math.min(w, h) * 0.20 }
      ];
      for (let i = 0; i < count; i++){
        const c = clusters[i % clusters.length];
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.abs(gaussian()) * c.spread;
        let x = c.x + Math.cos(ang) * dist;
        let y = c.y + Math.sin(ang) * dist;
        x = Math.max(4, Math.min(w - 4, x));
        y = Math.max(4, Math.min(h - 4, y));
        dots.push({ ox: x, oy: y, r: 1 + Math.random() * 1.6, phase: Math.random() * Math.PI * 2 });
      }

      edges = [];
      for (let i = 0; i < dots.length; i++){
        const dists = [];
        for (let j = 0; j < dots.length; j++){
          if (i === j) continue;
          const dx = dots[i].ox - dots[j].ox, dy = dots[i].oy - dots[j].oy;
          dists.push({ j, d: dx*dx + dy*dy });
        }
        dists.sort((a,b) => a.d - b.d);
        const linkCount = Math.random() < 0.4 ? 2 : 1;
        for (let k = 0; k < linkCount && k < dists.length; k++){
          if (Math.sqrt(dists[k].d) < 130) edges.push([i, dists[k].j]);
        }
      }
    }

    function pos(d, t){
      const drift = Math.sin(t * 0.0005 + d.phase) * 1.6;
      let x = d.ox, y = d.oy + drift, boost = 0;
      if (mouse.active){
        const dx = x - mouse.x, dy = y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < RADIUS){
          boost = 1 - dist / RADIUS;
          x += dx * boost * 0.16;
          y += dy * boost * 0.16;
        }
      }
      return { x, y, boost };
    }

    function frame(t){
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const [i, j] of edges){
        const a = pos(dots[i], t), b = pos(dots[j], t);
        const boost = Math.max(a.boost, b.boost);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(205,195,180,${0.06 + boost * 0.5})`;
        ctx.stroke();
      }
      for (const d of dots){
        const p = pos(d, t);
        const radius = d.r + p.boost * 2.6;
        const alpha = 0.28 + p.boost * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(205,195,180,${alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
    });
    hero.addEventListener('mouseleave', () => { mouse.active = false; });
    hero.addEventListener('touchmove', e => {
      if (!e.touches.length) return;
      const rect = hero.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left; mouse.y = e.touches[0].clientY - rect.top; mouse.active = true;
    }, { passive:true });
    hero.addEventListener('touchend', () => { mouse.active = false; });

    window.addEventListener('resize', build);
    build();
    requestAnimationFrame(frame);
  }

  /* ---- contact form (front-end only — wire to a backend/Formspree later) ---- */
  const form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 2600);
    });
  }
});
