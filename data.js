/* Kinchika data — events, results, directiva */

const EVENTS = [
  { id: 'e1', disc: 'ECO', discLabel: 'Eco', day: 18, month: 'MAY', title: 'Limpieza de playa Quintay', place: 'Quintay · V Región', desc: 'Jornada de recolección de residuos costeros junto a la junta de vecinos local.', level: 'Principiante', cupos: 12, cuposMax: 25, img: 'img/eventos/limpieza-playa.svg' },
  { id: 'e2', disc: 'STA', discLabel: 'Estática', day: 24, month: 'MAY', title: 'Clínica de apnea estática', place: 'Piscina Lo Prado', desc: 'Sesión técnica con énfasis en relajación, contracciones y manejo de la respuesta diafragmática.', level: 'Intermedio', cupos: 4, cuposMax: 12, img: 'img/eventos/clinica-apnea.svg' },
  { id: 'e3', disc: 'DEPTH', discLabel: 'Profundidad', day: 7, month: 'JUN', title: 'Salida a Pichilemu', place: 'Pichilemu · VI Región', desc: 'Inmersión grupal en boya. Profundidades de 12 a 25m con seguidor por cuerda.', level: 'Competitivo', cupos: 0, cuposMax: 8, img: 'img/eventos/salida-pichilemu.svg' },
  { id: 'e4', disc: 'EDU', discLabel: 'Charla', day: 14, month: 'JUN', title: 'Historia del freediving', place: 'Centro Cultural Lo Prado', desc: 'Charla abierta sobre las raíces culturales del buceo en apnea, de Kálimnos a Molchanova.', level: 'Principiante', cupos: 28, cuposMax: 60, img: 'img/eventos/charla-historia.svg' },
  { id: 'e5', disc: 'DYN', discLabel: 'Dinámica', day: 21, month: 'JUN', title: 'Interclubes nado con aletas', place: 'Estadio Nacional', desc: 'Encuentro DYN/DNF con clubes hermanos. Modalidades 50m y 100m.', level: 'Competitivo', cupos: 6, cuposMax: 16, img: 'img/eventos/interclubes-nado.svg' },
  { id: 'e6', disc: 'ECO', discLabel: 'Eco', day: 5, month: 'JUL', title: 'Reforestación dunas Algarrobo', place: 'Algarrobo · V Región', desc: 'Plantación de especies nativas de duna en colaboración con CONAF.', level: 'Principiante', cupos: 18, cuposMax: 40, img: 'img/eventos/limpieza-playa.svg' }
];

const RESULTS = {
  'interclubes-2025': {
    name: 'Interclubes FEDESUB 2025',
    date: 'Septiembre 2025',
    location: 'Estadio Nacional',
    discipline: 'STA · Estática',
    rows: [
      { pos: 1, name: 'Valentino Molina', club: 'Kinchika', perf: '5:42', record: 'RC' },
      { pos: 2, name: 'Sebastián Aravena', club: 'Apnea Pacífico', perf: '5:18', record: '' },
      { pos: 3, name: 'Francisco Reyes', club: 'Kinchika', perf: '5:04', record: '' },
      { pos: 4, name: 'Cristóbal Vidal', club: 'Submarinos CL', perf: '4:51', record: '' },
      { pos: 5, name: 'Ignacio Pérez', club: 'Apnea Norte', perf: '4:33', record: '' },
      { pos: 6, name: 'Tomás Espinoza', club: 'Kinchika', perf: '4:12', record: '' }
    ]
  },
  'nacional-2024': {
    name: 'Nacional Apnea 2024',
    date: 'Diciembre 2024',
    location: 'Concepción',
    discipline: 'DYN · Dinámica con aletas',
    rows: [
      { pos: 1, name: 'Camila Soto', club: 'Apnea Pacífico', perf: '142m', record: 'RN' },
      { pos: 2, name: 'Valentino Molina', club: 'Kinchika', perf: '128m', record: '' },
      { pos: 3, name: 'Daniela Núñez', club: 'Submarinos CL', perf: '116m', record: '' },
      { pos: 4, name: 'Neymar Colmenares', club: 'Kinchika', perf: '108m', record: '' },
      { pos: 5, name: 'Andrés Molina', club: 'Kinchika', perf: '92m', record: '' }
    ]
  },
  'open-quintay-2025': {
    name: 'Open Quintay 2025',
    date: 'Marzo 2025',
    location: 'Quintay',
    discipline: 'CWT · Profundidad',
    rows: [
      { pos: 1, name: 'Francisco Reyes', club: 'Kinchika', perf: '32m', record: '' },
      { pos: 2, name: 'Cristóbal Vidal', club: 'Submarinos CL', perf: '30m', record: '' },
      { pos: 3, name: 'Tomás Espinoza', club: 'Kinchika', perf: '28m', record: '' },
      { pos: 4, name: 'Carla Ibáñez', club: 'Kinchika', perf: '24m', record: '' }
    ]
  }
};

const DIRECTIVAS = {
  '2026': {
    inicio: 'Ene 2026',
    fin: 'Dic 2026',
    estado: 'Vigente',
    cargos: [
      { cargo: 'Presidente', name: 'Francisco Reyes', img: 'img/directiva/francisco-reyes.svg', main: true },
      { cargo: 'Vicepresidenta', name: 'Marcela Torres', img: 'img/directiva/marcela-torres.svg' },
      { cargo: 'Tesorero', name: 'Andrés Molina', img: 'img/directiva/andres-molina.svg' },
      { cargo: 'Secretaria', name: 'Carla Ibáñez', img: 'img/directiva/carla-ibanez.svg' },
      { cargo: 'Director Técnico', name: 'Valentino Molina', img: 'img/directiva/valentino-molina.svg' },
      { cargo: 'Director de Eventos', name: 'Tomás Espinoza', img: 'img/directiva/tomas-espinoza.svg' },
      { cargo: 'Comunicaciones', name: 'Daniela Soto', img: 'img/directiva/daniela-soto.svg' },
      { cargo: 'Director Ecológico', name: 'Rodrigo Castro', img: 'img/directiva/rodrigo-castro.svg' }
    ]
  },
  '2025': {
    inicio: 'Ene 2025',
    fin: 'Dic 2025',
    estado: 'Concluido',
    cargos: [
      { cargo: 'Presidenta', name: 'Marcela Torres', img: 'img/directiva/marcela-torres.svg', main: true },
      { cargo: 'Vicepresidente', name: 'Francisco Reyes', img: 'img/directiva/francisco-reyes.svg' },
      { cargo: 'Tesorera', name: 'Verónica Leal', img: 'img/directiva/veronica-leal.svg' },
      { cargo: 'Secretario', name: 'Luis Contreras', img: 'img/directiva/luis-contreras.svg' },
      { cargo: 'Director Técnico', name: 'Neymar Colmenares', img: 'img/directiva/neymar-colmenares.svg' },
      { cargo: 'Director de Eventos', name: 'Pilar Núñez', img: 'img/directiva/pilar-nunez.svg' },
      { cargo: 'Comunicaciones', name: 'Fernanda Opazo', img: 'img/directiva/fernanda-opazo.svg' },
      { cargo: 'Directora Ecológica', name: 'Natalia Vargas', img: 'img/directiva/natalia-vargas.svg' }
    ]
  },
  '2024': {
    inicio: 'May 2024',
    fin: 'Dic 2024',
    estado: 'Concluido',
    cargos: [
      { cargo: 'Presidente', name: 'Luis Contreras', img: 'img/directiva/luis-contreras.svg', main: true },
      { cargo: 'Vicepresidenta', name: 'Verónica Leal', img: 'img/directiva/veronica-leal.svg' },
      { cargo: 'Tesorero', name: 'Rodrigo Castro', img: 'img/directiva/rodrigo-castro.svg' },
      { cargo: 'Secretaria', name: 'Pilar Núñez', img: 'img/directiva/pilar-nunez.svg' },
      { cargo: 'Director Técnico', name: 'Andrés Molina', img: 'img/directiva/andres-molina.svg' },
      { cargo: 'Comunicaciones', name: 'Natalia Vargas', img: 'img/directiva/natalia-vargas.svg' }
    ]
  }
};

const TIMELINE = [
  { id: 'grecia', era: 'S. VIII a.C.', icon: '🏛️', title: 'Antigua Grecia · Kálimnos', img: 'img/timeline/grecia.png', text: 'Los griegos se sumergían desnudos arrastrando una <em>skandalopetra</em> — piedra pesada — para llegar al fondo. Llenaban su boca con aceite de oliva y lo escupían en profundidad: rompía la refracción de la luz y mejoraba la visibilidad. Aristóteles y Homero ya escribían sobre ellos.', textMobile: 'Buzos griegos usaban una <em>skandalopetra</em> y aceite de oliva para ver bajo el agua. Citados por Aristóteles y Homero.'},
  { id: 'japon', era: 'S. III a.C.', icon: '🌸', title: 'Japón · Las Ama', img: 'img/timeline/japon-ama.png', text: 'Casi 2.000 años de tradición milenaria de buceo en apnea protagonizada exclusivamente por mujeres. Conocidas como las <em>Mujeres del Mar</em>, recolectaban perlas naturales y mariscos sumergiéndose a grandes profundidades.', textMobile: 'Casi 2.000 años de tradición: las <em>Mujeres del Mar</em> recolectando perlas en apnea.'},
  { id: 'corea', era: 'S. XVII', icon: '🌊', title: 'Corea · Las Haenyeo', img: 'img/timeline/corea-haenyeo.png', text: 'Originarias de la isla de Jeju. Con frecuencia superando los 60 e incluso los 80 años, mantienen viva la tradición de recolectar a mano algas y mariscos, una cultura matriarcal de resistencia y autonomía económica.', textMobile: 'Las <em>Haenyeo</em> de Jeju, cultura matriarcal de buceo en apnea con más de 80 años activas.'},
  { id: 'pelizzari', era: '1990', icon: '🇮🇹', title: 'Umberto Pelizzari', img: 'img/timeline/pelizzari.png', text: 'El italiano que estableció nuevos límites para el buceo en apnea moderno, basados en la <strong>relajación y la técnica mental</strong>. Reescribió las posibilidades del cuerpo humano bajo el agua.', textMobile: 'Redefinió el apnea moderno con <strong>relajación y técnica mental</strong>.'},
  { id: 'molchanova', era: '2005', icon: '⭐', title: 'Natalia Molchanova', img: 'img/timeline/molchanova.png', text: 'La rusa que en el siglo XXI consolidó el deporte con un dominio absoluto, estableciendo múltiples récords mundiales e integrando la ciencia y el yoga a la disciplina, dejando un legado educativo único.', textMobile: 'Múltiples récords mundiales integrando ciencia y yoga al freediving, legado educativo único.'}
];

const SCHEDULE = [
  { day: 'Martes', tag: 'Día 01', title: 'Nado y acondicionamiento', hour: '21:00 — 22:00', desc: 'Entrenamiento guiado por profesores, centrado en el desarrollo de la natación y capacidades aeróbicas.' },
  { day: 'Miércoles', tag: 'Día 02', title: 'Nado libre', hour: '21:00 — 22:00', desc: 'Cada persona coordina su propio plan de trabajo, promoviendo la crítica constructiva entre compañeros.' },
  { day: 'Jueves', tag: 'Día 03', title: 'Apnea técnica', hour: '21:00 — 22:00', desc: 'Sesión técnica de apnea bajo la supervisión y dirección de nuestros profesores especializados.' }
];

const DISCIPLINAS = [
  'Buceo', 'Apnea', 'Nado con aletas', 'Rugby subacuático',
  'Rescatismo', 'Limpieza de playas', 'Educación medioambiental', 'Sensibilización marina'
];

const ALLIES = [
  { name: 'Molchanovs', url: 'https://molchanovs.com/', logo: 'img/logos/molchanovs.png' },
  { name: 'IND · Instituto Nacional del Deporte', url: 'https://ind.cl/', logo: 'img/logos/ind.png' },
  { name: 'Lo Prado Deportes', url: 'https://lopradodeportes.cl/', logo: 'img/logos/loprado.png' },
  { name: 'Asosub Santiago', url: 'https://www.instagram.com/asosub.santiago/', logo: 'img/logos/asosub.png' },
  { name: 'FEDESUB Chile', url: 'https://www.fedesub.cl/index.html', logo: 'img/logos/fedesub.png' }
];

window.KINCHIKA = { EVENTS, RESULTS, DIRECTIVAS, TIMELINE, SCHEDULE, DISCIPLINAS, ALLIES };
