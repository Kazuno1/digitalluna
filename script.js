// Year stamp
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile drawer
const mobToggle = document.getElementById('mobToggle');
const drawer = document.getElementById('drawer');
if (mobToggle && drawer) {
  mobToggle.addEventListener('click', () => {
    drawer.style.display = drawer.style.display === 'block' ? 'none' : 'block';
  });
}

// Smooth internal link scroll (same-page only)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (drawer) drawer.style.display = 'none';
    }
  });
});

// Fake lead form submit (contact.html)
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thanks! We'll be in touch shortly with a tailored plan.");
  });
}

// ACTIVE NAV helper (marks link active if it matches current page)
(function setActiveNav(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.endsWith(here)) a.classList.add('active');
  });
})();

// Moving background (constellation/particles)
(function starfield(){
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const stars = [];
  const STAR_COUNT = 120; // tweak for density
  const MAX_SPEED = 0.25;

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function init(){
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.5, 1.8) * dpr,
        vx: rand(-MAX_SPEED, MAX_SPEED),
        vy: rand(-MAX_SPEED, MAX_SPEED),
        a: rand(0.4, 0.9)
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    // stars
    for (const s of stars){
      ctx.beginPath();
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3);
      grad.addColorStop(0, `rgba(31,111,255,${0.85*s.a})`);
      grad.addColorStop(1, 'rgba(31,111,255,0)');
      ctx.fillStyle = grad;
      ctx.arc(s.x, s.y, s.r*3, 0, Math.PI*2);
      ctx.fill();
    }

    // connecting lines
    for (let i=0;i<stars.length;i++){
      for (let j=i+1;j<stars.length;j++){
        const a = stars[i], b = stars[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 * dpr){
          const alpha = (1 - dist / (120 * dpr)) * 0.25;
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // move
    for (const s of stars){
      s.x += s.vx * dpr; s.y += s.vy * dpr;
      if (s.x < 0 || s.x > w) s.vx *= -1;
      if (s.y < 0 || s.y > h) s.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  addEventListener('resize', () => { resize(); init(); });
})();