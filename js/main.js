/* ==========================================================
   batsistemas — interacciones
   Editá CONTACTO con tus datos reales.
   ========================================================== */

const CONTACTO = {
  whatsapp: '5492324640639', // solo números, con código de país (en Argentina va un 9 después del 54)
  whatsappVisible: '+54 9 2324 64-0639',
  email: 'mbattoia.cnsc@gmail.com',
  instagram: 'batsistemas',
};

document.documentElement.classList.remove('no-js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Año del footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Enlaces de contacto ---------- */
const links = {
  whatsapp: CONTACTO.whatsapp ? `https://wa.me/${CONTACTO.whatsapp}` : '#contacto',
  email: CONTACTO.email ? `mailto:${CONTACTO.email}` : '#contacto',
  instagram: `https://instagram.com/${CONTACTO.instagram}`,
};
document.querySelectorAll('[data-link]').forEach((a) => {
  a.href = links[a.dataset.link];
  if (a.href.endsWith('#contacto')) a.removeAttribute('target');
});
const visibles = {
  whatsapp: CONTACTO.whatsappVisible,
  email: CONTACTO.email || '[TU EMAIL]',
  instagram: `@${CONTACTO.instagram}`,
};
document.querySelectorAll('[data-text]').forEach((el) => { el.textContent = visibles[el.dataset.text]; });

/* ---------- Navegación ---------- */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');

const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.classList.toggle('is-open', open);
  nav.classList.toggle('menu-open', open);
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
});

const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Resalta la sección visible en el menú */
const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['servicios', 'sobre-mi', 'portfolio', 'contacto'].forEach((id) => sectionObserver.observe(document.getElementById(id)));

/* ---------- Aparición al hacer scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => {
  // escalonado entre hermanos
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el) * 80, 400)}ms`;
  revealObserver.observe(el);
});

/* ---------- Contador "15+" ---------- */
const counter = document.querySelector('[data-count]');
if (counter && !reduceMotion) {
  const target = Number(counter.dataset.count);
  counter.textContent = '0';
  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 }).observe(counter);
}

/* ---------- Titular que se escribe solo ---------- */
const typed = document.getElementById('typed');
const frases = ['como nueva.', 'más rápida.', 'actualizada.', 'en buenas manos.'];

if (typed && !reduceMotion) {
  let i = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    await wait(2600);
    for (;;) {
      const actual = frases[i];
      for (let n = actual.length; n >= 0; n--) { typed.textContent = actual.slice(0, n); await wait(40); }
      i = (i + 1) % frases.length;
      const sig = frases[i];
      await wait(250);
      for (let n = 1; n <= sig.length; n++) { typed.textContent = sig.slice(0, n); await wait(75); }
      await wait(2600);
    }
  })();
}

/* ---------- Terminal del hero ---------- */
const terminal = document.getElementById('terminal');
const lineas = [
  ['$ ', 'dim', 'diagnóstico --equipo tu_pc'],
  ['', 'dim', 'analizando hardware...'],
  ['✓ ', 'ok', 'temperatura: controlada'],
  ['✓ ', 'ok', 'disco: migrado a SSD'],
  ['✓ ', 'ok', 'sistema: actualizado'],
  ['', 'ok', '> tu PC, como nueva_'],
];

const pintar = (n) => lineas.slice(0, n)
  .map(([pre, cls, txt]) => `<span class="${cls}">${pre}</span>${cls === 'ok' && !pre ? `<span class="ok">${txt}</span>` : txt}`)
  .join('\n');

if (terminal) {
  if (reduceMotion) {
    terminal.innerHTML = pintar(lineas.length);
  } else {
    let n = 0;
    const paso = () => {
      n = n >= lineas.length ? 0 : n + 1;
      terminal.innerHTML = pintar(n);
      setTimeout(paso, n === lineas.length ? 3200 : n === 0 ? 500 : 650);
    };
    setTimeout(paso, 900);
  }
}

/* ---------- Formulario de contacto ---------- */
const form = document.getElementById('contactForm');
const error = document.getElementById('formError');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const via = e.submitter?.dataset.via || 'whatsapp';
  const nombre = form.nombre.value.trim();
  const servicio = form.servicio.value;
  const mensaje = form.mensaje.value.trim();

  if (!nombre || !mensaje) {
    error.hidden = false;
    (nombre ? form.mensaje : form.nombre).focus();
    return;
  }
  error.hidden = true;

  const texto = `Hola Manuel, soy ${nombre}.\nConsulta: ${servicio}\n\n${mensaje}`;

  if (via === 'email') {
    if (!CONTACTO.email) { alert('Falta configurar el email en js/main.js'); return; }
    window.location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(`Consulta: ${servicio}`)}&body=${encodeURIComponent(texto)}`;
  } else {
    if (!CONTACTO.whatsapp) { alert('Falta configurar el número de WhatsApp en js/main.js'); return; }
    window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  }
});
