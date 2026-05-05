/* Bubbles canvas — gentle rising particles */
(function(){
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, bubbles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function rand(a,b){ return a + Math.random()*(b-a); }
  function makeBubble() {
    return {
      x: rand(0, w),
      y: rand(h, h+200),
      r: rand(1, 4),
      vy: rand(0.3, 1.0),
      vx: rand(-0.2, 0.2),
      a: rand(0.2, 0.6),
      drift: rand(0, Math.PI*2)
    };
  }
  function init() {
    resize();
    bubbles = Array.from({length: 60}, makeBubble);
  }
  function tick() {
    ctx.clearRect(0,0,w,h);
    bubbles.forEach(b => {
      b.y -= b.vy;
      b.drift += 0.02;
      b.x += b.vx + Math.sin(b.drift)*0.2;
      if (b.y < -10) Object.assign(b, makeBubble(), {y: h+10});
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(180, 220, 240, ' + b.a + ')';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x - b.r*0.3, b.y - b.r*0.3, b.r*0.4, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,' + (b.a*1.2) + ')';
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  init();
  tick();

  // Increase opacity as we descend
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = Math.min(1, Math.max(0, window.scrollY / max));
    canvas.style.opacity = (0.45 + pct * 0.4).toFixed(2);

    // Update progress bar
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = (pct * 100) + '%';

    // Adjust bg gradient intensity
    const bg = document.getElementById('deep-bg');
    if (bg) bg.style.opacity = (1 - pct * 0.3).toFixed(2);
  });
})();
