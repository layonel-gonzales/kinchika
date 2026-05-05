/* Water particles — deep underwater ambient effect */
(function () {
  const canvas = document.getElementById('water-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], time = 0;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  const rnd = (a, b) => a + Math.random() * (b - a);

  function makeParticle() {
    const roll = Math.random();
    let type;
    if      (roll < 0.52) type = 'mote';
    else if (roll < 0.76) type = 'streak';
    else if (roll < 0.91) type = 'glow';
    else                  type = 'micro';

    const depth = rnd(0.15, 1.0);
    const spd   = 0.25 + depth * 0.75;

    const r = {
      mote:   rnd(0.4, 2.0) * depth,
      streak: rnd(0.5, 1.6),
      glow:   rnd(4,  12)   * depth,
      micro:  rnd(0.6, 2.2),
    }[type];

    const baseAlpha = {
      mote:   rnd(0.18, 0.55) * depth,
      streak: rnd(0.22, 0.52),
      glow:   rnd(0.12, 0.38),
      micro:  rnd(0.28, 0.65),
    }[type];

    const vy = {
      mote:   rnd(-0.06, 0.06) * spd,
      streak: rnd(-0.10, 0.10) * spd,
      glow:   rnd(-0.04, 0.04) * spd,
      micro:  -rnd(0.22, 0.65) * spd,
    }[type];

    return {
      type, depth, r, baseAlpha,
      x:  rnd(0, w),
      y:  rnd(0, h),
      vx: rnd(-0.14, 0.14) * spd,
      vy,
      /* wave params */
      px: rnd(0, Math.PI * 2), py: rnd(0, Math.PI * 2),
      fx: rnd(0.003, 0.013),   fy: rnd(0.002, 0.010),
      ax: rnd(18, 55) * spd,   ay: rnd(8, 28)  * spd,
      /* pulse */
      pp: rnd(0, Math.PI * 2), pf: rnd(0.007, 0.022),
      /* streak */
      sLen:   rnd(9, 30),
      sAngle: rnd(-0.45, 0.45),
      sDrift: rnd(-0.0006, 0.0006),
      /* color */
      hue: rnd(186, 222),
      sat: rnd(55, 100),
    };
  }

  function draw(p) {
    const pulse = 0.62 + 0.38 * Math.sin(p.pp);
    const a     = Math.max(0, p.baseAlpha * pulse);
    const L     = 52 + p.depth * 28;
    const { hue: H, sat: S } = p;

    ctx.save();

    if (p.type === 'mote') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${H},${S}%,${L}%,${a})`;
      ctx.fill();

    } else if (p.type === 'streak') {
      const cos = Math.cos(p.sAngle);
      const sin = Math.sin(p.sAngle);
      const x2  = p.x + cos * p.sLen;
      const y2  = p.y + sin * p.sLen;
      const g   = ctx.createLinearGradient(p.x, p.y, x2, y2);
      g.addColorStop(0, `hsla(${H},${S}%,${L + 12}%,${a})`);
      g.addColorStop(1, `hsla(${H},${S}%,${L}%,0)`);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = g;
      ctx.lineWidth   = p.r;
      ctx.lineCap     = 'round';
      ctx.stroke();

    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0,    `hsla(${H},${S}%,88%,${a * 1.5})`);
      g.addColorStop(0.42, `hsla(${H},${S}%,${L}%,${a})`);
      g.addColorStop(1,    `hsla(${H},${S}%,${L}%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

    } else { /* micro bubble */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${H},22%,92%,${a * 0.9})`;
      ctx.lineWidth   = 0.5;
      ctx.stroke();
      /* inner highlight */
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.33, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a * 0.65})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function tick() {
    time += 0.016;
    ctx.clearRect(0, 0, w, h);

    /* slow oscillating global current */
    const gx = Math.sin(time * 0.068) * 0.055;

    particles.forEach(p => {
      p.px += p.fx;
      p.py += p.fy;
      p.pp += p.pf;

      p.x += p.vx + Math.sin(p.px) * (p.ax / 1900) + gx * p.depth;
      p.y += p.vy + Math.cos(p.py) * (p.ay / 1900);

      if (p.type === 'streak') p.sAngle += p.sDrift;

      /* wrap */
      const mg = p.r + 32;
      if (p.x < -mg)    p.x = w + mg;
      if (p.x > w + mg) p.x = -mg;

      if (p.type === 'micro') {
        if (p.y < -mg) { p.y = h + mg; p.x = rnd(0, w); }
      } else {
        if (p.y < -mg)    p.y = h + mg;
        if (p.y > h + mg) p.y = -mg;
      }

      draw(p);
    });

    requestAnimationFrame(tick);
  }

  function init() {
    resize();
    const count = Math.max(130, Math.min(230, Math.floor(w * h / 5200)));
    particles   = Array.from({ length: count }, makeParticle);
    tick();
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > w) p.x = rnd(0, w);
      if (p.y > h) p.y = rnd(0, h);
    });
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
