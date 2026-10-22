const page = document.body;
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');
const dialog = document.querySelector('.contact-dialog');
const form = document.querySelector('.project-form');
const draftResult = document.querySelector('.draft-result');
const draftText = document.querySelector('#draft-text');
const draftStatus = document.querySelector('.status-message');
const serviceSelect = document.querySelector('#project-type');
const progress = document.querySelector('.scroll-progress');
const motionButton = document.querySelector('.motion-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastTrigger;

page.classList.add('js');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.hidden = true;
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mobileMenu.hidden = isOpen;
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

document.querySelectorAll('[data-contact]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    closeMenu();
    form.hidden = false;
    draftResult.hidden = true;
    draftStatus.textContent = '';
    if (trigger.dataset.service) serviceSelect.value = trigger.dataset.service;
    dialog.showModal();
    page.classList.add('dialog-open');
  });
});

document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  page.classList.remove('dialog-open');
  if (lastTrigger && lastTrigger.offsetParent !== null) lastTrigger.focus();
  else menuButton.focus();
});
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const location = String(data.get('location')).trim();
  if (!location) {
    document.querySelector('#project-location').setCustomValidity('Escribe la ciudad o municipio del proyecto.');
    form.reportValidity();
    return;
  }
  const lines = ['Hola, Ingenieros AB. Me gustaría conversar sobre un proyecto.', '', `Servicio: ${data.get('service')}`, `Etapa: ${data.get('stage')}`, `Ubicación: ${location}`];
  const description = String(data.get('description')).trim();
  if (description) lines.push('', description);
  draftText.value = lines.join('\n');
  document.querySelector('#whatsapp-draft').href = `https://wa.me/573102918515?text=${encodeURIComponent(draftText.value)}`;
  document.querySelector('#email-draft').href = `mailto:ingenierosabsas@gmail.com?subject=${encodeURIComponent(`Consulta: ${data.get('service')}`)}&body=${encodeURIComponent(draftText.value)}`;
  form.hidden = true;
  draftResult.hidden = false;
  draftText.focus();
});

document.querySelector('#project-location').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#edit-draft').addEventListener('click', () => {
  draftResult.hidden = true;
  form.hidden = false;
  draftStatus.textContent = '';
  serviceSelect.focus();
});
document.querySelector('#copy-draft').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draftText.value);
    draftStatus.textContent = 'Mensaje copiado. Puedes pegarlo donde prefieras.';
  } catch {
    draftText.focus();
    draftText.select();
    draftStatus.textContent = 'Seleccionamos el mensaje. Usa Ctrl+C o la opción Copiar de tu dispositivo.';
  }
});

function updateProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', () => {
  updateProgress();
  if (window.innerWidth > 820) closeMenu();
});
updateProgress();

function setMotion(paused) {
  page.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Activar movimiento de la ilustración' : 'Pausar movimiento de la ilustración');
  motionButton.textContent = paused ? '▷' : 'Ⅱ';
}
if (motionButton) {
  setMotion(motionPreference.matches);
  motionButton.addEventListener('click', () => setMotion(!page.classList.contains('motion-paused')));
  motionPreference.addEventListener('change', event => setMotion(event.matches));
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}

const comparison = document.querySelector('.comparison');
const comparisonRange = document.querySelector('#comparison-range');
if (comparison && comparisonRange) {
  let comparisonPointer = null;

  function updateComparison() {
    const value = Number(comparisonRange.value);
    comparison.querySelector('.comparison-before').style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    comparison.style.setProperty('--comparison-position', `${value}%`);
    comparison.querySelector('.compare-label-before').hidden = value === 0;
    comparison.querySelector('.compare-label-after').hidden = value === 100;
    comparisonRange.setAttribute('aria-valuetext', `${value}% antes y ${100 - value}% propuesta`);
  }

  function moveComparison(event) {
    const bounds = comparison.getBoundingClientRect();
    comparisonRange.value = String(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))));
    updateComparison();
  }

  function endComparisonDrag() {
    comparisonPointer = null;
    comparison.classList.remove('is-dragging');
  }

  comparisonRange.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    comparisonPointer = event.pointerId;
    comparisonRange.focus({ preventScroll: true });
    comparisonRange.setPointerCapture(event.pointerId);
    comparison.classList.add('is-dragging');
    moveComparison(event);
  });
  comparisonRange.addEventListener('pointermove', event => {
    if (event.pointerId === comparisonPointer) moveComparison(event);
  });
  comparisonRange.addEventListener('pointerup', event => {
    if (event.pointerId !== comparisonPointer) return;
    moveComparison(event);
    comparisonRange.releasePointerCapture(event.pointerId);
    endComparisonDrag();
  });
  comparisonRange.addEventListener('pointercancel', endComparisonDrag);
  comparisonRange.addEventListener('lostpointercapture', endComparisonDrag);
  comparisonRange.addEventListener('input', updateComparison);
  updateComparison();
}
