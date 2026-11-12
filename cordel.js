
(() => {
  'use strict';
  const data = window.RECIFE_DATA;
  const entry = document.getElementById('cordel-entry');
  if (!data || !entry) return;

  const requestedPhotos = data.coverPhotos || [];
  const candidates = requestedPhotos
    .map(file => data.photos.find(photo => photo.originalFile === file))
    .filter(Boolean);
  if (!candidates.length) return;

  const storageKey = 'recife-last-cover-v1';
  let previousFile = '';
  try {
    previousFile = localStorage.getItem(storageKey) || '';
  } catch {}
  const alternatives = candidates.filter(photo => photo.originalFile !== previousFile);
  const pool = alternatives.length ? alternatives : candidates;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  try {
    localStorage.setItem(storageKey, selected.originalFile);
  } catch {}

  const coverImage = document.getElementById('cordel-cover-image');
  coverImage.src = selected.src;
  coverImage.alt = selected.alt;
  coverImage.width = selected.width || 1200;
  coverImage.height = selected.height || 1600;
  document.getElementById('cordel-cover-caption').textContent = selected.title;
  document.getElementById('cordel-cover-author').textContent = selected.author;
  document.getElementById('hero-photo-author').textContent = selected.author;
  document.getElementById('cordel-cover-status').textContent =
    'Capa desta visita — ' + selected.title + '. Fotografia de ' + selected.author + '.';

  const heroImage = document.querySelector('.hero-image img');
  if (heroImage) {
    heroImage.src = selected.src;
    heroImage.alt = selected.alt;
  }
  document.getElementById('hero-photo-title').textContent = selected.title;
  document.getElementById('hero-location').textContent =
    selected.location + ' · ' + selected.date.split('-').reverse().join('/');
  const frameNumber = document.querySelector('.hero-frame-number');
  if (frameNumber) frameNumber.textContent = String(candidates.indexOf(selected) + 1).padStart(2, '0');

  const openButton = document.getElementById('cordel-open');
  const skipButton = document.getElementById('cordel-skip');
  const coverButton = document.getElementById('cordel-cover-open');
  let openingTimer;

  function finishOpening() {
    clearTimeout(openingTimer);
    if (entry.open) entry.close();
  }
  function openCordel(animate) {
    const reducedMotion = document.body.classList.contains('reduce-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reducedMotion) {
      finishOpening();
      return;
    }
    if (openButton.disabled) return;
    openButton.disabled = true;
    coverButton.disabled = true;
    entry.classList.add('is-opening');
    document.getElementById('cordel-cover-status').textContent = 'O cordel está abrindo.';
    openingTimer = setTimeout(finishOpening, 900);
  }
  openButton.addEventListener('click', () => openCordel(true));
  coverButton.addEventListener('click', () => openCordel(true));
  skipButton.addEventListener('click', () => openCordel(false));
  entry.addEventListener('cancel', event => {
    event.preventDefault();
    finishOpening();
  });
  entry.addEventListener('close', () => {
    clearTimeout(openingTimer);
    document.body.classList.remove('cordel-lock');
    entry.classList.remove('is-opening');
    openButton.disabled = false;
    coverButton.disabled = false;
    document.getElementById('essay-start').focus({preventScroll:true});
  });

  // A link to a section opens directly at its destination.
  if ((!location.hash || location.hash === '#inicio') && typeof entry.showModal === 'function') {
    entry.showModal();
    entry.scrollTop = 0;
    coverButton.focus({preventScroll:true});
    document.body.classList.add('cordel-lock');
  }
})();

