/* Kinchika — bottom sections (Schedule, Events, Results, Directiva, Location, Contact, Footer) */

const { useState: _useState, useEffect: _useEffect } = React;

// === SCHEDULE + TABLES ===
function Schedule() {
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
          <div className="table-card">
            <div className="formula">O<sub>2</sub></div>
            <h3>Tabla de Oxígeno</h3>
            <p>Se enfocan en la resistencia a la falta de oxígeno. Para funcionar con <strong>hipoxia</strong> (bajo nivel de oxígeno), mejorar la capacidad pulmonar, la tolerancia y aumentar la duración de las apneas.</p>
            <div className="open-sim">Abrir simulador →</div>
          </div>
          <div className="table-card">
            <div className="formula">CO<sub>2</sub></div>
            <h3>Tabla de CO₂</h3>
            <p>Se centran en la tolerancia a la <strong>hipercapnia</strong> (exceso de dióxido de carbono), entrenando al cuerpo para resistir la acidosis sin llegar a niveles críticos de hipoxia.</p>
            <div className="open-sim">Abrir simulador →</div>
          </div>
        </div>
      </div>
    </section>
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

  const tabs = [['ALL','Todas'],['ECO','Eco'],['STA','Estática'],['DYN','Dinámica'],['DEPTH','Profundidad'],['EDU','Charlas']];

  return (
    <section id="eventos" className="section section--wide" data-screen-label="07 Eventos">
      <div className="container">
        <div className="section__head">
          <div className="eyebrow">Calendario</div>
          <h2 className="heading">Próximos eventos</h2>
          <p className="lead">Limpiezas de playa, clínicas, salidas grupales y encuentros del club. Inscripciones abiertas y próximas actividades.</p>
        </div>

        <div className="filters">
          <div className="filter-tabs">
            {tabs.map(([k,l]) => (
              <button key={k} className={disc === k ? 'active' : ''} onClick={() => setDisc(k)}>{l}</button>
            ))}
          </div>
          <div className="filter-row">
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option value="ALL">Todos los niveles</option>
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Competitivo</option>
            </select>
            <label><input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)}/> Solo disponibles</label>
            <span style={{marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--ink-3)', textTransform: 'uppercase'}}>{filtered.length} eventos</span>
          </div>
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
          <p className="lead">Registro permanente de quienes han liderado el Club Kinchika año a año, velando por el crecimiento y la transparencia de nuestra organización.</p>
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
            <p>Espacio que hemos transformado en nuestro centro de entrenamiento gracias al apoyo de la municipalidad. Aquí desarrollamos las sesiones de nado, acondicionamiento y técnica de apnea.</p>
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
