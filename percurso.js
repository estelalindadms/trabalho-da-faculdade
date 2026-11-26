(() => {
  'use strict';
  const start = document.getElementById('essay-start');
  const essay = document.getElementById('ensaio');
  const alive = document.getElementById('recife-vivo');
  const reveal = document.getElementById('alive-reveal');
  const alternate = document.getElementById('alive-continue');
  const toggle = document.getElementById('route-toggle');
  const status = document.getElementById('route-status');
  const aliveHeading = alive?.querySelector('.movement-header h2');
  const ending = alive?.querySelector('.alive-ending');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reveal || !alternate || !aliveHeading || !ending) return;

  let stage = 'before';
  let state = 'idle';
  let frame = 0;
  let lastTime = 0;
  let position = 0;

  function routeState(next) {
    state = next;
    toggle.hidden = next !== 'running' && next !== 'paused';
    toggle.textContent = next === 'running' ? 'Pausar percurso' : 'Retomar percurso';
  }

  function goTo(element, offset) {
    window.scrollTo({top: window.scrollY + element.getBoundingClientRect().top - offset, behavior: 'instant'});
  }

  function jumpTo(element) {
    goTo(element, 24);
    element.focus({preventScroll: true});
  }

  function pause() {
    if (state !== 'running') return;
    cancelAnimationFrame(frame);
    routeState('paused');
    status.textContent = 'Percurso pausado. Você pode navegar à mão ou retomar a rolagem.';
  }

  function stopAtDestination(target) {
    if (stage === 'after') {
      routeState('done');
      ending.focus({preventScroll: true});
      status.textContent = 'Fim do percurso fotográfico.';
      return;
    }
    routeState('waiting');
    target.focus({preventScroll: true});
    status.textContent = 'Percurso pausado na entrada do Recife Vivo. Ative o botão para continuar.';
  }

  function scrollFrame(time) {
    if (stage === 'before' && reveal.getAttribute('aria-pressed') === 'true') alternate.hidden = false;
    const useAlternate = reveal.disabled || reveal.getAttribute('aria-pressed') === 'true';
    const target = stage === 'before' ? (useAlternate ? alternate : reveal) : ending;
    const offset = Math.min(180, window.innerHeight * 0.25);
    const destination = window.scrollY + target.getBoundingClientRect().top - offset;
    const step = 0.16 * Math.min(40, lastTime ? time - lastTime : 0);
    lastTime = time;
    if (destination <= position + step) {
      goTo(target, offset);
      stopAtDestination(target);
      return;
    }
    position += step;
    window.scrollTo({top: position, behavior: 'instant'});
    frame = requestAnimationFrame(scrollFrame);
  }

  function resume() {
    if (motion.matches || document.body.classList.contains('reduce-motion')) {
      routeState(stage === 'before' ? 'manual' : 'done');
      jumpTo(stage === 'before' ? essay : aliveHeading);
      return;
    }
    routeState('running');
    status.textContent = 'Rolagem do ensaio em andamento.';
    position = window.scrollY;
    lastTime = 0;
    frame = requestAnimationFrame(scrollFrame);
  }

  function enterAlive() {
    if (stage !== 'before' || state === 'idle' || state === 'done') return;
    cancelAnimationFrame(frame);
    stage = 'after';
    alternate.hidden = !reveal.disabled;
    document.dispatchEvent(new Event('recife:enter-vivo'));
    resume();
  }

  aliveHeading.tabIndex = -1;
  ending.tabIndex = -1;
  start.addEventListener('click', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    cancelAnimationFrame(frame);
    stage = 'before';
    jumpTo(essay);
    resume();
  });
  reveal.addEventListener('click', enterAlive);
  alternate.addEventListener('click', () => {
    if (state === 'idle' || state === 'done') jumpTo(aliveHeading);
    else enterAlive();
  });
  toggle.addEventListener('click', () => {
    if (state === 'running') {
      pause();
      document.dispatchEvent(new Event('recife:pause-route'));
    } else {
      resume();
      document.dispatchEvent(new Event('recife:resume-route'));
    }
  });
  ['wheel', 'touchstart', 'pointerdown'].forEach(type => {
    window.addEventListener(type, event => {
      if (event.target instanceof Element && event.target.closest('#route-toggle, #alive-reveal, #alive-continue, .sound-player')) return;
      pause();
    }, {passive: true});
  });
  window.addEventListener('keydown', event => {
    if (event.target === toggle && event.key === ' ') return;
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Escape', 'Tab', ' '].includes(event.key)) pause();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) pause();
  });
})();
