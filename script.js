const preguntas = [
  "¿Qué energía, espacio, conciencia y elección puedo ser para recibir más dinero de lo que jamás imaginé, con total facilidad?",
  "¿Qué tomaría para que el dinero me busque a mí como yo busco el café en las mañanas?",
  "Si no tuviera ningún punto de vista sobre el dinero, ¿cuánto podría recibir hoy?",
  "¿Y si el dinero fuera mi amante, cómo le estaría tratando?",
  "¿Qué está creando escasez en mi vida que podría soltar ahora mismo?",
  "¿Qué es el dinero para mí... y de quién aprendí eso?",
  "¿Qué juicios estoy usando para limitar el dinero que puedo elegir?",
  "¿Qué me impide reconocer que ya soy una energía de riqueza?",
  "¿Cuánto más dinero podría tener si me atreviera a disfrutar sin culpa?",
  "¿Qué posibilidades infinitas con el dinero están disponibles hoy que aún no he reconocido?",
  "¿Qué debo dejar de controlar para que el dinero fluya con más gozo?",
  "¿Estoy dispuesta a recibir dinero de formas inesperadas y sin esfuerzo?",
  "¿Qué estoy evitando o defendiendo que me impide ser millonaria?",
  "¿Qué más es posible con el dinero que nunca nadie me enseñó?",
  "¿Qué pasaría si dejara de rechazar ser rica?",
  "¿Y si el dinero no fuera un problema… qué elegiría hoy?",
  "¿Qué estoy copiando de mi familia sobre el dinero que ya no me sirve?",
  "¿Qué tomaría para que el dinero se muestre hoy con facilidad, alegría y gloria?",
  "¿Qué nivel de gratitud y gozo puedo ser hoy para duplicar mis ingresos?",
  "¿Cuánto dinero estoy dispuesto(a) a tener sin perder mi esencia?",
  "¿Qué conciencia del dinero estoy listo(a) para recibir hoy?",
  "¿Qué energía puedo ser para atraer clientes que me paguen con gozo?",
  "¿Qué más puedo vender, crear o elegir que sea una contribución financiera para mí y para el mundo?",
  "¿Qué estoy haciendo más difícil de lo que realmente es con el dinero?",
  "¿Qué parte de mi magia estoy ignorando que crearía más dinero de inmediato?",
  "¿Qué me impide ser el imán que realmente soy para el dinero?",
  "¿Qué tomaría para elegir más dinero sin tener que justificarlo?",
  "¿Y si el dinero no fuera serio ni pesado, cómo sería?",
  "¿Qué riqueza energética está disponible para mí ahora mismo?",
  "¿Qué puedo ser o hacer hoy que cree más dinero ahora y para toda la eternidad?"
];

let nombreUsuario = '';
let diaActual = 0;

function obtenerFechaActual() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

function guardarNombre() {
  const nombre = document.getElementById('user-name').value.trim();
  if (!nombre) return alert("¡Escribe tu nombre!");

  nombreUsuario = nombre;
  localStorage.setItem('nombreUsuario', nombre);

  const progreso = parseInt(localStorage.getItem(`${nombre}_dia`) || 0);
  diaActual = progreso < preguntas.length ? progreso : preguntas.length - 1;

  mostrarPregunta();
}

// 🆕 NUEVO: Obtener una pregunta aleatoria sin repetir
function obtenerPreguntaAleatoria() {
  const usadas = JSON.parse(localStorage.getItem(`${nombreUsuario}_preguntasUsadas`)) || [];

  if (usadas.length >= preguntas.length) {
    return { indice: -1, texto: "🎉 ¡Completaste todas las preguntas del reto!" };
  }

  let indice;
  do {
    indice = Math.floor(Math.random() * preguntas.length);
  } while (usadas.includes(indice));

  usadas.push(indice);
  localStorage.setItem(`${nombreUsuario}_preguntasUsadas`, JSON.stringify(usadas));
  localStorage.setItem(`${nombreUsuario}_preguntaIndice_${diaActual}`, indice);

  return { indice, texto: preguntas[indice] };
}

function mostrarPregunta() {
  cambiarPantalla('welcome-screen', 'daily-question-screen');

  const hoy = obtenerFechaActual();
  const ultimaFecha = localStorage.getItem(`${nombreUsuario}_ultimaFecha`);
  const yaRespondioHoy = ultimaFecha === hoy;

  document.getElementById('greeting').textContent = `🌟 ${nombreUsuario}, esta es tu pregunta del día 🌟`;

  let indicePregunta = localStorage.getItem(`${nombreUsuario}_preguntaIndice_${diaActual}`);
  let preguntaTexto = "";

  if (indicePregunta === null) {
    const resultado = obtenerPreguntaAleatoria();
    indicePregunta = resultado.indice;
    preguntaTexto = resultado.texto;
  } else {
    preguntaTexto = preguntas[indicePregunta];
  }

  document.getElementById('daily-question').textContent = preguntaTexto;
  document.getElementById('user-answer').value =
    localStorage.getItem(`${nombreUsuario}_respuesta_${diaActual}`) || '';

  const diasRestantes = preguntas.length - diaActual;
  document.getElementById('contador-dias').textContent = `✨ Te faltan ${diasRestantes} día(s) para completar el reto ✨`;

  const mensajeEsperaEl = document.getElementById('mensaje-espera');
  if (yaRespondioHoy) {
    mensajeEsperaEl.textContent = "🌙 Ya respondiste hoy. Vuelve mañana a las 12:00 a.m. para tu nueva pregunta.";
    mensajeEsperaEl.classList.remove('hidden');
  } else {
    mensajeEsperaEl.classList.add('hidden');
  }

  marcarDiaCompletado(diaActual);
}

function guardarRespuesta() {
  const hoy = obtenerFechaActual();
  const ultimaFecha = localStorage.getItem(`${nombreUsuario}_ultimaFecha`);

  if (ultimaFecha === hoy) {
    mostrarNotificacion("⚠️ Ya respondiste la pregunta de hoy. Espera hasta mañana.");
    return;
  }

  const respuesta = document.getElementById('user-answer').value;
  localStorage.setItem(`${nombreUsuario}_respuesta_${diaActual}`, respuesta);
  localStorage.setItem(`${nombreUsuario}_completado_${diaActual}`, 'true');

  diaActual++;
  localStorage.setItem(`${nombreUsuario}_dia`, diaActual);
  localStorage.setItem(`${nombreUsuario}_ultimaFecha`, hoy);

  mostrarNotificacion("✅ ¡Respuesta guardada!");
  mostrarPregunta();
}

function verTarjetero() {
  cambiarPantalla('daily-question-screen', 'tarjetero-screen');

  const contenedor = document.getElementById('tarjetero');
  contenedor.innerHTML = '';

  for (let i = 0; i < diaActual; i++) {
    const indiceStr = localStorage.getItem(`${nombreUsuario}_preguntaIndice_${i}`);
    const indice = indiceStr !== null ? parseInt(indiceStr) : null;
    const preguntaTexto = (indice !== null && preguntas[indice]) ? preguntas[indice] : '📌 Pregunta no registrada en este día (versión anterior)';
    const respuesta = localStorage.getItem(`${nombreUsuario}_respuesta_${i}`) || '';

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<strong>Día ${i + 1}</strong><p>${preguntaTexto}</p><p><em>Respuesta:</em> ${respuesta || 'No respondida'}</p>`;
    contenedor.appendChild(card);
  }
}

function verCalendario() {
  cambiarPantalla('daily-question-screen', 'calendario-screen');

  const contenedor = document.getElementById('calendario');
  contenedor.innerHTML = '';
  for (let i = 0; i < preguntas.length; i++) {
    const dia = document.createElement('div');
    dia.classList.add('dia');
    if (localStorage.getItem(`${nombreUsuario}_completado_${i}`)) {
      dia.classList.add('completado');
    }
    dia.textContent = `Día ${i + 1}`;
    contenedor.appendChild(dia);
  }
}

function marcarDiaCompletado(dia) {
  localStorage.setItem(`${nombreUsuario}_completado_${dia}`, 'true');
}

function cambiarPantalla(actual, nueva) {
  document.getElementById(actual).classList.remove('active');
  document.getElementById(actual).classList.add('hidden');
  document.getElementById(nueva).classList.add('active');
  document.getElementById(nueva).classList.remove('hidden');
}

function mostrarNotificacion(mensaje) {
  const div = document.createElement('div');
  div.textContent = mensaje;
  div.style.position = 'fixed';
  div.style.bottom = '20px';
  div.style.left = '50%';
  div.style.transform = 'translateX(-50%)';
  div.style.background = '#fff';
  div.style.color = '#000';
  div.style.padding = '10px 20px';
  div.style.borderRadius = '15px';
  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  div.style.fontWeight = 'bold';
  div.style.zIndex = '999';
  div.style.opacity = '0';
  div.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(div);
  setTimeout(() => (div.style.opacity = '1'), 100);
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 1000);
  }, 3000);
}

window.onload = () => {
  const nombreGuardado = localStorage.getItem('nombreUsuario');
  if (nombreGuardado) {
    nombreUsuario = nombreGuardado;

    const hoy = obtenerFechaActual();
    const ultimaFecha = localStorage.getItem(`${nombreUsuario}_ultimaFecha`);
    diaActual = parseInt(localStorage.getItem(`${nombreUsuario}_dia`) || 0);

    if (ultimaFecha !== hoy) {
      localStorage.setItem(`${nombreUsuario}_ultimaFecha`, hoy);
    }

    mostrarPregunta();
  } else {
    const bienvenida = document.getElementById('welcome-screen');
    bienvenida.classList.add('active');
    bienvenida.classList.remove('hidden');
  }
};

function volver() {
  cambiarPantalla('tarjetero-screen', 'daily-question-screen');
  cambiarPantalla('calendario-screen', 'daily-question-screen');
}

function mostrarPantallaInicio() {
  nombreUsuario = '';
  document.getElementById('user-name').value = '';
  cambiarPantalla('daily-question-screen', 'welcome-screen');
}