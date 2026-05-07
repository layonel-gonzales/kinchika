/* Kinchika — top sections (Hero, Editorial, Mission, History, Timeline) */

const { useState, useEffect, useRef } = React;

// === ICONS ===
const IconHeadphones = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-2a9 9 0 0 1 18 0v2"/>
    <path d="M3 14a2 2 0 0 1 2-2h1v6H5a2 2 0 0 1-2-2v-2zM21 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

// === AUDIO ENGINE ===
const AudioEngine = (() => {
  let audio = null;
  return {
    start() {
      if (audio) return;
      audio = new Audio('sonido/profundidad.mp3');
      audio.loop = true;
      audio.volume = 0.45;
      audio.play().catch(() => {});
      window._kinchikaAudio = audio;
    },
    toggle() {
      if (!audio) return false;
      if (audio.paused) { audio.play().catch(() => {}); return true; }
      audio.pause();
      return false;
    },
    isPlaying() { return audio ? !audio.paused : false; },
  };
})();

// === AUDIO OVERLAY ===
function AudioOverlay({ onContinue }) {
  const [hidden, setHidden] = useState(false);

  const dismiss = (withSound) => {
    if (withSound) AudioEngine.start();
    setHidden(true);
    setTimeout(onContinue, 1200);
  };

  return (
    <div id="audio-overlay" className={hidden ? 'hidden' : ''}>
      <div className="overlay-ticks">
        <div className="tick major">0M</div>
        <div className="tick">10</div>
        <div className="tick">20</div>
        <div className="tick major">30M</div>
        <div className="tick">40</div>
        <div className="tick">50</div>
        <div className="tick major">60M</div>
        <div className="tick">70</div>
        <div className="tick">80</div>
        <div className="tick major">90M</div>
        <div className="tick">100</div>
      </div>

      <div className="overlay-icon-wrap"><IconHeadphones/></div>
      <h2>Activa el sonido para vivir la experiencia completa</h2>
      <p className="overlay-desc">El descenso ha sido compuesto con capas de audio que reaccionan a tu profundidad. Recomendamos el uso de auriculares para una inmersión total.</p>
      <div className="modal__buttons">
        <button className="btn btn--primary" onClick={() => dismiss(true)}>Activar sonido y descender →</button>
        <button className="btn btn--ghost" onClick={() => dismiss(false)}>Continuar sin sonido</button>
      </div>
    </div>
  );
}

// === TOP NAV ===
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav id="topnav" className={scrolled ? 'is-scrolled' : ''}>
      <span className="nav__brand">Kinchika</span>
      <div className="nav__links">
        <a href="#mision">Misión</a>
        <a href="#historia">Historia</a>
        <a href="#horarios">Horarios</a>
        <a href="#eventos">Eventos</a>
        <a href="#directiva">Directiva</a>
        <a href="#contacto">Contacto</a>
      </div>
    </nav>
  );
}

// === HUD (Dive Computer) ===
function HUD() {
  const [depth, setDepth] = useState(0);
  const [time, setTime] = useState('00:00');
  const [temp, setTemp] = useState(18);
  const [spo2, setSpo2] = useState(98);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, window.scrollY / max));
      setDepth(Math.round(pct * 100));
      setTemp(Math.round(18 - pct * 10));
      setSpo2(Math.round(98 - pct * 16));
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      setTime(`${m}:${s}`);
    }, 1000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); };
  }, []);

  const isWarning = spo2 < 90;
  const isDeep = depth > 50;
  const cls = [
    visible ? 'is-visible' : '',
    isDeep ? 'is-deep' : '',
    isWarning ? 'is-warning' : '',
    open ? 'is-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div id="hud" className={cls}>
      <button className="hud__title" onClick={() => setOpen(o => !o)} title={open ? 'Cerrar' : 'Abrir Dive Computer'}>
        <span>Dive Computer</span>
        <span style={{display:'flex',alignItems:'center',gap:6}}>
          <span className="hud__chevron">{open ? '▲' : '▼'}</span>
          <span className="led"/>
        </span>
      </button>
      {open && (
        <div className="hud__body">
          <div className="hud__row"><span className="hud__label">Depth</span><span className="hud__value">−{depth}m</span></div>
          <div className="hud__row"><span className="hud__label">Time</span><span className="hud__value">{time}</span></div>
          <div className="hud__row"><span className="hud__label">Temp</span><span className="hud__value">{temp}°C</span></div>
          <div className={'hud__row' + (isWarning ? ' warning' : '')} id="hud-spo2-row">
            <span className="hud__label">SpO₂</span><span className="hud__value">{spo2}%</span>
          </div>
          <div className="hud__progress"><div className="hud__progress-fill" style={{width: depth + '%'}}/></div>
        </div>
      )}
    </div>
  );
}

// === SOUND BUTTON ===
function SoundBtn() {
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    // Sync with actual audio state after overlay resolves
    const id = setTimeout(() => setMuted(!AudioEngine.isPlaying()), 1600);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(id); };
  }, []);

  const toggle = () => {
    if (!window._kinchikaAudio) {
      AudioEngine.start();
      setMuted(false);
    } else {
      const playing = AudioEngine.toggle();
      setMuted(!playing);
    }
  };

  return (
    <button id="sound-btn" className={visible ? 'is-visible' : ''} onClick={toggle} title={muted ? 'Activar sonido' : 'Silenciar'}>
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

// === HERO ===
function Hero({ heroVariant }) {
  return (
    <section className="hero" id="home" data-screen-label="01 Hero" data-hero={heroVariant}>
      <div className="video-background">
        <div className="video-bg-placeholder"/>
      </div>
      <div className="hero-caustics-bg"/>
      <div className="hero-type-bg"><div className="big-word">KINCHIKA</div></div>
      <div className="god-rays"/>
      <div className="water-shimmer">
        <video autoPlay muted loop playsInline src="video/mar-final.mp4" />
      </div>
      <div className="video-overlay-gradient"/>

      <div className="hero-content">
        <div>
          <div className="hero-tag">Establecido en 2023 · Lo Prado</div>
          <h1 className="hero-title">
            {'KINCHIKA'.split('').map((c,i) => <span key={i} className="char">{c}</span>)}
          </h1>
          <p className="hero-subtitle">Club de buceo y apnea sin fines de lucro de Lo Prado, dedicados a la formación de deportistas y la protección de nuestro ecosistema marino.</p>
          <div className="hero-buttons">
            <a href="#mision" className="btn btn--primary">Explorar disciplinas <span className="arrow">→</span></a>
            <a href="#contacto" className="btn btn--ghost">Unirse al club</a>
          </div>
        </div>
      </div>

      <div className="hero-meta">
        <div>SUP · 33°26′S 70°43′W</div>
        <div className="scroll-cue">SCROLL · DESCENDER</div>
        <div className="coords"><strong>00M / SUPERFICIE</strong><span>18°C · SpO₂ 98%</span></div>
      </div>
    </section>
  );
}

// === EDITORIAL DIVIDER ===
function EditorialDivider() {
  return (
    <section className="editorial-divider section" data-screen-label="02 Editorial">
      <div className="container">
        <h2>Club de Buceo<br/>Kinchika</h2>
        <p className="lead text--desktop">Somos un club de buceo compuesto por vecinos de la comuna de Lo Prado. Funcionamos sin fines de lucro, comprometidos profundamente con la ecología marina, la cultura submarina y el desarrollo del deporte local.</p>
        <p className="lead text--mobile">Club sin fines de lucro de Lo Prado, comprometido con la ecología marina y el deporte subacuático.</p>
      </div>
    </section>
  );
}

// === MISSION ===
function Mission() {
  return (
    <section id="mision" className="section section--wide" data-screen-label="03 Misión">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Quiénes somos</div>
          <h2 className="heading">Nuestra misión</h2>
        </div>
        <div className="mission-card">
          <div className="quote text--desktop">Fomentar el desarrollo integral de la comunidad a través de la práctica de deportes subacuáticos y la educación ambiental. Como organización sin fines de lucro, nos dedicamos a la preservación del patrimonio marino y el rescate de la cultura submarina, promoviendo la equidad social y el acceso inclusivo al deporte bajo un modelo de gestión transparente y colaborativo.</div>
          <div className="quote text--mobile">Fomentar la comunidad a través del deporte subacuático y la educación ambiental, con acceso inclusivo y transparencia.</div>
        </div>
        <div className="disciplines-grid">
          {window.KINCHIKA.DISCIPLINAS.map(d => <span key={d} className="badge">{d}</span>)}
        </div>
      </div>
    </section>
  );
}

// === HISTORY ===
function History() {
  return (
    <section id="historia" className="section section--wide" data-screen-label="04 Historia">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Nuestra historia</div>
          <h2 className="heading">Kinchika, palabra de mar</h2>
        </div>
        <div className="history-grid">
          <div className="history-text">
            <p className="history-lead text--desktop">Somos un grupo de vecinos, pobladores de <strong>Barrancas</strong>, que movidos por la pasión por el mar nos hemos consolidado como un club deportivo, social y cultural dedicado a las actividades subacuáticas. Aunque nuestra identidad está arraigada en una zona interior, mantenemos un vínculo vital con el océano a través de campañas ecológicas de limpieza y el apoyo constante a proyectos de cultura marina.</p>
            <p className="text--desktop">Nuestra historia dio un paso decisivo con la apertura de la <strong>piscina municipal de Lo Prado</strong>, espacio que hemos transformado en nuestro centro de entrenamiento. Hemos hecho fuerza con compras al por mayor para adquirir equipamiento especializado y buscando convenios para la obtención de licencias de buceo inicial. Así también nos adjudicamos nuestra propia <strong>boya grupal para prácticas de profundidad</strong>.</p>
            <p className="history-lead text--mobile">Vecinos de <strong>Barrancas</strong> unidos por el mar. Entrenamos en la <strong>piscina de Lo Prado</strong> con equipamiento propio y boya grupal para profundidad.</p>
            <p>Somos una comunidad que derriba distancias geográficas para sumergirse en el deporte y el cuidado del medio ambiente marino.</p>
          </div>
          <div className="instructors">
            <h3>Nuestros profesores</h3>
            <div className="instructor-card">
              <div className="instructor-avatar"><img src="img/historia/neymar.svg" alt="Neymar"/></div>
              <div>
                <div className="instructor-name">Neymar Colmenares</div>
                <div className="instructor-role">Perfeccionamiento de nado</div>
              </div>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar"><img src="img/historia/valentino.svg" alt="Valentino"/></div>
              <div>
                <div className="instructor-name">Valentino Molina</div>
                <div className="instructor-role">Apnea y nado con aletas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === TIMELINE (Apnea history) ===
function TimelineCard({ t, onEnter, onLeave, onToggle, isSelected }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(t.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={'timeline-node' + (isSelected ? ' is-selected' : '')}
      onMouseEnter={() => onEnter(t)}
      onMouseLeave={onLeave}
      onClick={onToggle}
    >
      <div className="timeline-card">
        <span className="era">{t.era}</span>
        <span className="icon">{t.icon}</span>
        <h3>{t.title}</h3>
        <p className="text--desktop" dangerouslySetInnerHTML={{__html: t.text}}/>
        <p className="text--mobile" dangerouslySetInnerHTML={{__html: t.textMobile}}/>
      </div>
      {isSelected && (
        <div className="timeline-inline-img">
          <img src={t.img} alt={t.title}/>
        </div>
      )}
    </div>
  );
}

function Timeline() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleToggle = (t) => {
    setSelected(prev => prev?.id === t.id ? null : t);
  };

  return (
    <section id="apnea-historia" className="section section--wide" data-screen-label="05 Historia del apnea">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Historia del buceo en apnea</div>
          <h2 className="heading">Freediving · Buceo libre</h2>
          <p className="lead">Una de las disciplinas más fascinantes y antiguas de la interacción humana con el mar.</p>
        </div>
        <div className="timeline">
          <div className="timeline-track">
            {window.KINCHIKA.TIMELINE.map(t => (
              <TimelineCard
                key={t.id}
                t={t}
                onEnter={setHovered}
                onLeave={() => setHovered(null)}
                onToggle={() => handleToggle(t)}
                isSelected={selected?.id === t.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={'timeline-image-panel' + (hovered ? ' is-active' : '')}>
        {hovered && <>
          <img src={hovered.img} alt={hovered.title}/>
          <div className="panel-label">{hovered.id}</div>
        </>}
      </div>
    </section>
  );
}

Object.assign(window, { AudioOverlay, TopNav, HUD, SoundBtn, Hero, EditorialDivider, Mission, History, Timeline, IconWhatsApp, IconPin, IconCamera });
