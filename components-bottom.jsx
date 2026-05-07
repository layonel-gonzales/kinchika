/* Kinchika — bottom sections (Schedule, Events, Results, Directiva, Location, Contact, Footer) */

const { useState: _useState, useEffect: _useEffect } = React;

// === SIMULATOR HELPERS ===
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function genTable(type, pbSecs, reps) {
  if (type === 'O2') {
    // Apnea constante ~80% PB · Descanso decrece desde hold hasta ~35% hold
    const hold = Math.max(30, Math.round(pbSecs * 0.8));
    const restMin = Math.max(30, Math.round(hold * 0.35));
    const step = Math.round((hold - restMin) / Math.max(1, reps - 1));
    return Array.from({ length: reps }, (_, i) => ({
      hold,
      rest: i < reps - 1 ? Math.max(restMin, hold - i * step) : 0
    }));
  }
  // CO2: Descanso fijo 2 min · Apnea crece de 50% a 90% PB
  const holdStart = Math.max(20, Math.round(pbSecs * 0.5));
  const holdEnd   = Math.round(pbSecs * 0.9);
  const step      = reps > 1 ? Math.round((holdEnd - holdStart) / (reps - 1)) : 0;
  return Array.from({ length: reps }, (_, i) => ({
    hold: holdStart + i * step,
    rest: i < reps - 1 ? 120 : 0
  }));
}

function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const h = () => setMob(window.innerWidth <= 900);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mob;
}

// === APNEA TABLE SIMULATOR ===
function ApneaTable({ type }) {
  const [pbMin, setPbMin] = useState(2);
  const [pbSec, setPbSec] = useState(0);
  const [reps,  setReps]  = useState(8);
  // s = { phase: 'idle'|'hold'|'rest'|'done', rep, secs }
  const [s, setS] = useState({ phase: 'idle', rep: 0, secs: 0 });

  const pbSecs = pbMin * 60 + Math.min(59, pbSec);
  const table  = React.useMemo(() => genTable(type, pbSecs, reps), [type, pbSecs, reps]);

  // Reset cuando cambia la configuración
  useEffect(() => {
    setS({ phase: 'idle', rep: 0, secs: 0 });
  }, [table]);

  // Un tick por segundo mientras está corriendo.
  // useEffect([s, table]) garantiza que cada closure ve la tabla y el estado actuales.
  // setS con función updater evita closures obsoletos.
  useEffect(() => {
    if (s.phase === 'idle' || s.phase === 'done') return;
    const id = setTimeout(() => {
      setS(c => {
        if (c.secs > 1) return { ...c, secs: c.secs - 1 };
        if (c.phase === 'hold') {
          if (c.rep < table.length - 1 && table[c.rep].rest > 0)
            return { phase: 'rest', rep: c.rep, secs: table[c.rep].rest };
          return { phase: 'done', rep: c.rep, secs: 0 };
        }
        const next = c.rep + 1;
        return { phase: 'hold', rep: next, secs: table[next].hold };
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [s, table]);

  const { phase, rep, secs } = s;
  const isIdle  = phase === 'idle';
  const isDone  = phase === 'done';
  const active  = phase === 'hold' || phase === 'rest';

  const doStart = () => setS({ phase: 'hold', rep: 0, secs: table[0].hold });
  const doStop  = () => setS({ phase: 'idle', rep: 0, secs: 0 });

  const isO2 = type === 'O2';
  const holdPreview = isO2
    ? fmt(Math.max(30, Math.round(pbSecs * 0.8)))
    : fmt(Math.max(20, Math.round(pbSecs * 0.5)));

  return (
    <div className="sim">
      {/* Header */}
      <div className="sim__head">
        <span className={'sim__badge' + (isO2 ? ' o2' : ' co2')}>{isO2 ? 'O₂' : 'CO₂'}</span>
        <div>
          <div className="sim__title">{isO2 ? 'Tabla de Oxígeno' : 'Tabla de CO₂'}</div>
          <div className="sim__desc">
            {isO2
              ? 'Apnea constante · descanso decreciente — tolerancia a la hipoxia progresiva'
              : 'Apnea creciente · descanso constante — tolerancia a la hipercapnia'}
          </div>
        </div>
      </div>

      {/* Config — only when idle */}
      {isIdle && (
        <div className="sim__config">
          <div className="sim__config-field">
            <label>Marca personal</label>
            <div className="sim__time-input">
              <input type="number" min="0" max="10" value={pbMin}
                onChange={e => setPbMin(Math.max(0, Math.min(10, +e.target.value || 0)))} />
              <span>:</span>
              <input type="number" min="0" max="59" value={String(pbSec).padStart(2,'0')}
                onChange={e => setPbSec(Math.max(0, Math.min(59, +e.target.value || 0)))} />
            </div>
          </div>
          <div className="sim__config-field">
            <label>Series</label>
            <select value={reps} onChange={e => setReps(+e.target.value)}>
              {[4,6,8,10,12].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="sim__config-field">
            <label>{isO2 ? 'Apnea objetivo' : 'Descanso fijo'}</label>
            <span className="sim__config-preview">{isO2 ? holdPreview : '02:00'}</span>
          </div>
        </div>
      )}

      {/* Timer — when running or done */}
      {(active || isDone) && (
        <div className={'sim__timer' + (phase === 'hold' ? ' hold' : phase === 'rest' ? ' rest' : ' done')}>
          <div className="sim__timer-label">
            {isDone ? 'Sesión completada' : phase === 'hold' ? `Serie ${rep + 1} · Apnea` : `Serie ${rep + 1} · Descanso`}
          </div>
          <div className="sim__timer-count">{isDone ? '✓' : fmt(secs)}</div>
          {!isDone && (
            <div className="sim__timer-next">
              {phase === 'hold' && rep < table.length - 1 && table[rep].rest > 0
                && `próx. descanso · ${fmt(table[rep].rest)}`}
              {phase === 'rest' && rep < table.length - 1
                && `próx. apnea serie ${rep + 2} · ${fmt(table[rep + 1].hold)}`}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="sim__table">
        <div className="sim__row sim__row--head">
          <span>#</span><span>Apnea</span><span>Descanso</span>
        </div>
        {table.map((row, i) => (
          <div key={i} className={
            'sim__row'
            + (active && phase === 'hold' && rep === i ? ' is-hold' : '')
            + (active && phase === 'rest' && rep === i ? ' is-rest' : '')
            + (isDone ? ' is-done-row' : '')
            + (active && rep > i ? ' is-past' : '')
          }>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <span>{fmt(row.hold)}</span>
            <span>{row.rest ? fmt(row.rest) : '—'}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="sim__controls">
        {isIdle  && <button className="sim__btn sim__btn--start" onClick={doStart}>▶ Iniciar sesión</button>}
        {active  && <button className="sim__btn sim__btn--stop"  onClick={doStop}>◼ Detener</button>}
        {isDone  && <button className="sim__btn sim__btn--reset" onClick={doStop}>↺ Nueva sesión</button>}
      </div>
    </div>
  );
}

// === SCHEDULE + TABLES ===
function Schedule() {
  const [activeSim, setActiveSim] = useState(null);
  const isMobile = useIsMobile();
  const toggle = (type) => setActiveSim(v => v === type ? null : type);

  return (
    <section id="horarios" className="section section--wide" data-screen-label="06 Horarios">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Entrenamientos</div>
          <h2 className="heading">Horarios</h2>
          <p className="lead">Piscina municipal de Lo Prado · 21:00 a 22:00 hrs. Tres sesiones semanales bajo supervisión profesional.</p>
        </div>
        <div className="schedule-grid">
          {window.KINCHIKA.SCHEDULE.map(s => (
            <div key={s.day} className="schedule-card">
              <div className="card-tag">{s.tag}</div>
              <div className="day">{s.day}</div>
              <div className="hour">{s.hour}</div>
              <div className="title">{s.title}</div>
              <div className="desc">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="section__head" style={{marginTop: 80}}>
          <div className="eyebrow">Tablas de entrenamiento</div>
          <h2 className="heading" style={{fontSize: 'clamp(28px, 4vw, 48px)'}}>Hipoxia & Hipercapnia</h2>
        </div>

        <div className="tables-grid">
          {/* O2 */}
          <div className="table-card-wrap">
            <div className={'table-card' + (activeSim === 'O2' ? ' is-open' : '')} onClick={() => toggle('O2')}>
              <div className="formula">O<sub>2</sub></div>
              <h3>Tabla de Oxígeno</h3>
              <p className="text--desktop">Se enfocan en la resistencia a la falta de oxígeno. Para funcionar con <strong>hipoxia</strong> (bajo nivel de oxígeno), mejorar la capacidad pulmonar, la tolerancia y aumentar la duración de las apneas.</p>
              <p className="text--mobile">Mejoran la resistencia a la <strong>hipoxia</strong> y aumentan la duración de las apneas.</p>
              <div className="open-sim">
                {activeSim === 'O2' ? 'Cerrar simulador ✕' : 'Abrir simulador →'}
              </div>
            </div>
            {isMobile && activeSim === 'O2' && (
              <div className="sim-inline"><ApneaTable type="O2" /></div>
            )}
          </div>

          {/* CO2 */}
          <div className="table-card-wrap">
            <div className={'table-card' + (activeSim === 'CO2' ? ' is-open' : '')} onClick={() => toggle('CO2')}>
              <div className="formula">CO<sub>2</sub></div>
              <h3>Tabla de CO₂</h3>
              <p className="text--desktop">Se centran en la tolerancia a la <strong>hipercapnia</strong> (exceso de dióxido de carbono), entrenando al cuerpo para resistir la acidosis sin llegar a niveles críticos de hipoxia.</p>
              <p className="text--mobile">Entrenan la tolerancia al CO₂ (<strong>hipercapnia</strong>) para resistir la acidosis.</p>
              <div className="open-sim">
                {activeSim === 'CO2' ? 'Cerrar simulador ✕' : 'Abrir simulador →'}
              </div>
            </div>
            {isMobile && activeSim === 'CO2' && (
              <div className="sim-inline"><ApneaTable type="CO2" /></div>
            )}
          </div>
        </div>
      </div>

      {/* Modal — desktop only, rendered via portal to escape stacking contexts */}
      {!isMobile && activeSim && ReactDOM.createPortal(
        <div className="sim-backdrop" onClick={() => setActiveSim(null)}>
          <div className="sim-modal" onClick={e => e.stopPropagation()}>
            <button className="sim-close" onClick={() => setActiveSim(null)}>✕</button>
            <ApneaTable key={activeSim} type={activeSim} />
          </div>
        </div>,
        document.getElementById('overlay-root')
      )}
    </section>
  );
}

// === FILTER SELECT (custom dropdown) ===
function FilterSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const label = (options.find(([k]) => k === value) || [])[1] || placeholder;

  return (
    <div className={'filter-select' + (open ? ' is-open' : '')} ref={ref}>
      <button className="filter-select__btn" onClick={() => setOpen(o => !o)}>
        <span>{label}</span>
        <svg className="filter-select__arrow" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="filter-select__panel">
          {options.map(([k, l]) => (
            <button
              key={k}
              className={'filter-select__option' + (value === k ? ' is-active' : '')}
              onClick={() => { onChange(k); setOpen(false); }}
            >
              {value === k && <span className="filter-select__dot"/>}
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// === EVENTS ===
function Events() {
  const [disc, setDisc] = useState('ALL');
  const [level, setLevel] = useState('ALL');
  const [onlyAvail, setOnlyAvail] = useState(false);

  const filtered = window.KINCHIKA.EVENTS.filter(e =>
    (disc === 'ALL' || e.disc === disc) &&
    (level === 'ALL' || e.level === level) &&
    (!onlyAvail || e.cupos > 0)
  );

  const discOpts = [['ALL','Todas'],['ECO','Eco'],['STA','Estática'],['DYN','Dinámica'],['DEPTH','Profundidad'],['EDU','Charlas']];
  const levelOpts = [['ALL','Todos los niveles'],['Principiante','Principiante'],['Intermedio','Intermedio'],['Competitivo','Competitivo']];

  return (
    <section id="eventos" className="section section--wide" data-screen-label="07 Eventos">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Calendario</div>
          <h2 className="heading">Próximos eventos</h2>
          <p className="lead">Limpiezas de playa, clínicas, salidas grupales y encuentros del club. Inscripciones abiertas y próximas actividades.</p>
        </div>

        <div className="filter-bar">
          <FilterSelect value={disc} onChange={setDisc} options={discOpts} placeholder="Disciplina"/>
          <FilterSelect value={level} onChange={setLevel} options={levelOpts} placeholder="Nivel"/>
          <button
            className={'filter-toggle' + (onlyAvail ? ' is-on' : '')}
            onClick={() => setOnlyAvail(v => !v)}
          >
            <span className="filter-toggle__track"><span className="filter-toggle__thumb"/></span>
            Solo disponibles
          </button>
          <span className="filter-count">{filtered.length} evento{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="events-grid">
          {filtered.map(e => (
            <div key={e.id} className="event-card">
              <div className="event-image">
                <img src={e.img} alt={e.title}/>
                <span className="event-disc-tag">{e.discLabel}</span>
                <div className="event-date">
                  <div className="day">{e.day}</div>
                  <div className="month">{e.month}</div>
                </div>
              </div>
              <div className="event-body">
                <h3>{e.title}</h3>
                <div className="place">◇ {e.place}</div>
                <div className="desc">{e.desc}</div>
                <div className="event-meta">
                  <span className="level">{e.level}</span>
                  <span className={'cupos' + (e.cupos === 0 ? ' full' : '')}>
                    <span className="dot"/>
                    {e.cupos === 0 ? 'Sin cupos' : `${e.cupos}/${e.cuposMax} cupos`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === RESULTS ===
function Results() {
  const keys = Object.keys(window.KINCHIKA.RESULTS);
  const [sel, setSel] = useState(keys[0]);
  const r = window.KINCHIKA.RESULTS[sel];
  const podiumClass = (pos) => pos === 1 ? 'gold' : pos === 2 ? 'silver' : pos === 3 ? 'bronze' : '';

  return (
    <section id="resultados" className="section section--wide" data-screen-label="08 Resultados">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Marcador oficial</div>
          <h2 className="heading">Resultados de eventos</h2>
          <p className="lead">Registro histórico de competencias y encuentros del club Kinchika en colaboración con la federación FEDESUB.</p>
        </div>

        <div className="results-selector">
          <select value={sel} onChange={e => setSel(e.target.value)}>
            {keys.map(k => <option key={k} value={k}>{window.KINCHIKA.RESULTS[k].name}</option>)}
          </select>
        </div>

        <div className="results-table">
          <div className="results-header">
            <div>
              <h3>{r.name}</h3>
              <div className="meta">{r.discipline}</div>
            </div>
            <div className="stat-row">
              <span className="stat-label">Fecha</span>
              <span className="stat-val">{r.date}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Sede</span>
              <span className="stat-val">{r.location}</span>
            </div>
          </div>
          <div className="results-list">
            {r.rows.map(row => (
              <div key={row.pos} className={'result-row ' + podiumClass(row.pos)}>
                <div className="pos">{String(row.pos).padStart(2, '0')}</div>
                <div>
                  <div className="name">{row.name}</div>
                </div>
                <div className="club">{row.club}</div>
                <div className="perf">{row.perf}</div>
                <div className={'badge-record' + (!row.record ? ' empty' : '')}>{row.record || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// === DIRECTIVA ===
function Directiva() {
  const years = Object.keys(window.KINCHIKA.DIRECTIVAS).sort().reverse();
  const [year, setYear] = useState(years[0]);
  const d = window.KINCHIKA.DIRECTIVAS[year];

  return (
    <section id="directiva" className="section section--wide" data-screen-label="09 Directiva">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Historia institucional</div>
          <h2 className="heading">Directiva del club</h2>
          <p className="lead text--desktop">Registro permanente de quienes han liderado el Club Kinchika año a año, velando por el crecimiento y la transparencia de nuestra organización.</p>
          <p className="lead text--mobile">Registro histórico de directivas del Club Kinchika.</p>
        </div>

        <div className="year-tabs">
          {years.map(y => (
            <button key={y} className={year === y ? 'active' : ''} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>

        <div className="directiva-info">
          <span><strong>Período</strong> · {d.inicio} → {d.fin}</span>
          <span><strong>Estado</strong> · {d.estado}</span>
          <span><strong>Cargos</strong> · {d.cargos.length}</span>
        </div>

        <div className="org-chart">
          {d.cargos.map((c, i) => (
            <div key={i} className={'directiva-card' + (c.main ? ' is-presidente' : '')}>
              <div className="directiva-avatar"><img src={c.img} alt={c.name}/></div>
              <div className="directiva-cargo">{c.cargo}</div>
              <div className="directiva-name">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === LOCATION ===
function Location() {
  return (
    <section id="lugar" className="section section--wide" data-screen-label="10 Lugar">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Dónde entrenamos</div>
          <h2 className="heading">Nuestro lugar</h2>
          <p className="lead">Piscina municipal de Lo Prado — nuestro centro de entrenamiento.</p>
        </div>
        <div className="location-card">
          <div className="location-info">
            <h3>Piscina Municipal de Lo Prado</h3>
            <div className="address">Los Copihues 5797</div>
            <div className="city">Lo Prado · Región Metropolitana · Chile</div>
            <p className="text--desktop">Espacio que hemos transformado en nuestro centro de entrenamiento gracias al apoyo de la municipalidad. Aquí desarrollamos las sesiones de nado, acondicionamiento y técnica de apnea.</p>
            <p className="text--mobile">Nuestro centro de entrenamiento para nado, acondicionamiento y técnica de apnea.</p>
            <a href="https://maps.google.com/?q=Los+Copihues+5797,+Lo+Prado" target="_blank" rel="noopener" className="btn btn--outline">Ver en Google Maps →</a>
          </div>
          <div className="location-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2921497651396!2d-70.72124791200032!3d-33.44169432844727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c476226cdf89%3A0x35845e136ef8434c!2sLos%20Copihues%205797%2C%20Lo%20Prado%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1778029852080!5m2!1ses-419!2scl"
              width="100%"
              height="100%"
              style={{border: 0, display: 'block'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Kinchika — Los Copihues 5797, Lo Prado"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// === CONTACT + ALLIES ===
function Contact() {
  return (
    <section id="contacto" className="section section--wide" data-screen-label="11 Contacto">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Contacto</div>
          <h2 className="heading">Sumérgete con nosotros</h2>
          <p className="lead">Nuevos integrantes son bienvenidos. Escríbenos o pásate por la piscina un martes, miércoles o jueves.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon"><IconWhatsApp/></div>
            <div className="label">WhatsApp</div>
            <div className="value"><a href="https://wa.me/56967508503" target="_blank" rel="noopener">+56 9 6750 8503</a></div>
            <div className="sub">Francisco Reyes · Presidente</div>
          </div>
          <div className="contact-card">
            <div className="contact-icon"><IconPin/></div>
            <div className="label">Ubicación</div>
            <div className="value">Los Copihues 5797</div>
            <div className="sub">Lo Prado · Región Metropolitana</div>
          </div>
          <div className="contact-card">
            <div className="contact-icon"><IconCamera/></div>
            <div className="label">Instagram</div>
            <div className="value"><a href="https://www.instagram.com/clubdebuceo.kinchika/" target="_blank" rel="noopener">@clubdebuceo.kinchika</a></div>
            <div className="sub">Síguenos para novedades</div>
          </div>
        </div>

        <div className="section__head" style={{marginTop: 100, marginBottom: 32}}>
          <div className="eyebrow">Aliados</div>
          <h2 className="heading" style={{fontSize: 'clamp(28px, 4vw, 44px)'}}>Nos apoyan</h2>
        </div>
        <div className="allies-carousel">
          <div className="allies-track">
            {[...window.KINCHIKA.ALLIES, ...window.KINCHIKA.ALLIES].map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener" className="ally-item" title={a.name}>
                <img src={a.logo} alt={a.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// === FOOTER ===
function Footer() {
  return (
    <footer data-screen-label="12 Footer">
      <div className="footer-inner">
        <div className="footer-brand-row">
          <div className="footer-brand">KINCHIKA</div>
          <div className="footer-tagline">Club de Buceo y Apnea<br/>Lo Prado · RM · Chile</div>
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Sobre el club</h4>
            <p style={{marginBottom: 16}}>Buceo · Apnea · Nado con aletas · Rescatismo · Educación ambiental.</p>
            <p>Esta web es una experiencia inmersiva. Practica apnea siempre acompañado y bajo supervisión profesional.</p>
          </div>
          <div className="footer-col">
            <h4>Navegación</h4>
            <a href="#mision">Misión</a>
            <a href="#historia">Historia</a>
            <a href="#eventos">Eventos</a>
            <a href="#contacto">Contacto</a>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <a href="https://wa.me/56967508503">+56 9 6750 8503</a>
            <a href="mailto:hola@kinchika.cl">hola@kinchika.cl</a>
            <a href="https://www.instagram.com/clubdebuceo.kinchika/">Instagram</a>
          </div>
          <div className="footer-col">
            <h4>Sede</h4>
            <p>Piscina Municipal de Lo Prado<br/>Los Copihues 5797<br/>Lo Prado · RM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Club de Buceo Kinchika</span>
          <span>· — Todos los derechos reservados</span>
          <span>33°26′S · 70°43′W · −100M</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Schedule, Events, Results, Directiva, Location, Contact, Footer });
