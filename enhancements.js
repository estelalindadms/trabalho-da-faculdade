(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const accessDialog = document.getElementById('access-dialog');
  const accessOpen = document.getElementById('access-open');
  const status = document.getElementById('access-status');
  const storageKey = 'recife-access-v1';
  const defaults = {size:1,contrast:false,texture:false,motion:window.matchMedia('(prefers-reduced-motion: reduce)').matches,colors:false,font:false};
  let prefs = {...defaults};
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (saved && typeof saved === 'object') prefs = {...defaults,...saved}; } catch {}
  if (![1,1.15,1.3].includes(Number(prefs.size))) prefs.size = 1;

  const alive = document.querySelector('.movement[data-alive="true"]');
  let aliveRevealed = false;
  let aliveButton = null;
  let aliveHelp = null;
  let aliveStatus = null;
  if (alive) {
    alive.id = 'recife-vivo';
    alive.tabIndex = -1;
    alive.classList.add('movement-alive');
    const bridge = document.createElement('div');
    bridge.className = 'alive-bridge';
    bridge.innerHTML = '<img class="alive-bridge-art" src="assets/linha-matriz.svg" alt="" aria-hidden="true"><div class="alive-bridge-content"><div><p class="eyebrow">DA FERIDA AO PULSO</p><h2>O Recife resiste<br><em>em quem fica.</em></h2></div><div class="alive-bridge-copy"><p>O Recife continua nas mãos que trabalham, nas conversas de calçada e nos livros, discos e filmes que passam de uma pessoa a outra. A arte ocupa paredes e prateleiras; o encontro transforma a rua em lugar de convivência. Entre o concreto e a água, esses gestos mantêm a cidade em movimento.</p><p>Há vida junto às feridas que este percurso mostrou. Reconhecê-la também é defender o direito de morar, trabalhar, criar e permanecer no centro. As cores acompanham quem sustenta esse cotidiano: gente que merece condições para viver a cidade, além de resistir às suas dificuldades.</p></div></div>';
    const controls = document.createElement('div');
    controls.className = 'alive-controls';
    controls.innerHTML = '<button id="alive-reveal" class="alive-button" type="button" aria-pressed="false" aria-controls="recife-vivo" aria-describedby="alive-help"><span>Devolver a cor</span><span aria-hidden="true">↗</span></button><p id="alive-help" class="alive-help">Ative o botão para revelar o tratamento original das fotografias. A fachada do Trianon e a imagem histórica permanecem em preto e branco.</p><p id="alive-status" class="alive-status" role="status" aria-live="polite" aria-atomic="true"></p>';
    bridge.querySelector('.alive-bridge-copy').append(controls);
    alive.prepend(bridge);
    aliveButton = controls.querySelector('#alive-reveal');
    aliveHelp = controls.querySelector('#alive-help');
    aliveStatus = controls.querySelector('#alive-status');
    aliveButton.addEventListener('click', () => {
      if (prefs.colors) return;
      aliveRevealed = !aliveRevealed;
      renderAlive(true);
    });
  }
  function renderAlive(announce = false) {
    if (!alive || !aliveButton) return;
    const originalColors = !!prefs.colors;
    const revealed = aliveRevealed || originalColors;
    alive.classList.toggle('alive-revealed', revealed);
    aliveButton.disabled = originalColors;
    aliveButton.setAttribute('aria-pressed', String(revealed));
    aliveButton.querySelector('span').textContent = originalColors ? 'Cores originais ativadas' : revealed ? 'Rever em preto e branco' : 'Devolver a cor';
    aliveHelp.textContent = originalColors
      ? 'A preferência “Cores originais” mantém o tratamento de cada fotografia, em cor ou preto e branco. Desative essa opção em Acessibilidade para usar este botão.'
      : revealed
        ? 'As fotografias exibem seu tratamento original. O Trianon permanece em preto e branco. O botão permite rever a apresentação monocromática.'
        : 'Ative o botão para revelar o tratamento original das fotografias. A fachada do Trianon e a imagem histórica permanecem em preto e branco.';
    if (announce) {
      aliveStatus.textContent = revealed
        ? 'Recife Vivo ganhou cor. A fachada do Trianon e a imagem histórica permanecem em preto e branco, junto à vida dos sebos.'
        : 'Recife Vivo voltou à apresentação em preto e branco. O conteúdo e os arquivos originais foram preservados.';
    }
  }
  function applyPreferences(announce = false) {
    root.style.setProperty('--reading-scale', String(prefs.size));
    const classes = {contrast:'high-contrast',texture:'clean-view',motion:'reduce-motion',colors:'show-original-colors',font:'simple-type'};
    Object.entries(classes).forEach(([key,name]) => {
      body.classList.toggle(name, !!prefs[key]);
      const field = document.getElementById('access-' + key);
      if (field) field.checked = !!prefs[key];
    });
    root.style.scrollBehavior = prefs.motion ? 'auto' : '';
    document.querySelectorAll('[data-text-size]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.textSize) === Number(prefs.size))));
    try { localStorage.setItem(storageKey, JSON.stringify(prefs)); } catch {}
    renderAlive();
    if (announce) status.textContent = 'Preferências aplicadas.';
  }
  applyPreferences();
  accessOpen.addEventListener('click', () => {
    accessDialog.showModal();
    body.classList.add('dialog-open');
    document.getElementById('access-close').focus();
  });
  document.getElementById('access-close').addEventListener('click', () => accessDialog.close());
  accessDialog.addEventListener('close', () => {
    body.classList.remove('dialog-open');
    accessOpen.focus({preventScroll:true});
  });
  accessDialog.addEventListener('click', event => { if (event.target === accessDialog) accessDialog.close(); });
  document.querySelectorAll('[data-text-size]').forEach(button => button.addEventListener('click', () => { prefs.size = Number(button.dataset.textSize); applyPreferences(true); }));
  ['contrast','texture','motion','colors','font'].forEach(key => document.getElementById('access-' + key).addEventListener('change', event => { prefs[key] = event.target.checked; applyPreferences(true); }));
  document.getElementById('access-reset').addEventListener('click', () => { prefs = {...defaults}; applyPreferences(); status.textContent = 'Preferências restauradas.'; });

  let photoTrigger = null;
  const photoDialog = document.getElementById('photo-dialog');
  document.querySelectorAll('.photo-open').forEach((button,index) => {
    const card = button.closest('.photo-card');
    const description = card.querySelector('.photo-caption p');
    const describedBy = [];
    if (description) {
      description.id = 'photo-caption-' + index;
      describedBy.push(description.id);
    }
    const visualDescription = card.id && document.getElementById(card.id + '-visual-description');
    if (visualDescription) describedBy.push(visualDescription.id);
    if (describedBy.length) button.setAttribute('aria-describedby', describedBy.join(' '));
    button.addEventListener('click', () => {
      photoTrigger = button;
      body.classList.add('dialog-open');
      document.getElementById('lightbox-title').focus({preventScroll:true});
      decorateExternalLinks(photoDialog);
    });
  });
  photoDialog.addEventListener('close', () => {
    body.classList.remove('dialog-open');
    if (photoTrigger) photoTrigger.focus({preventScroll:true});
  });
  function decorateExternalLinks(container) {
    container.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (link.querySelector('.newtab-label')) return;
      link.setAttribute('title', link.textContent.trim() + ' — abre em nova aba');
      const note = document.createElement('span');
      note.className = 'sr-only newtab-label';
      note.textContent = ' (abre em nova aba)';
      link.append(note);
    });
  }
  decorateExternalLinks(document);
  ['photo-prev','photo-next'].forEach(id => document.getElementById(id).addEventListener('click', () => decorateExternalLinks(photoDialog)));
  photoDialog.addEventListener('keydown', () => decorateExternalLinks(photoDialog));
  ['ensaio','curta'].forEach(id => { document.getElementById(id).tabIndex = -1; });

  const film = window.RECIFE_DATA?.shortFilm;
  const video = document.getElementById('short-film');
  if (film?.src) {
    video.src = film.src;
    video.poster = film.poster || 'assets/curta-poster.svg';
    video.hidden = false;
    document.getElementById('film-placeholder').hidden = true;
    if (film.captionsSrc) {
      const track = document.createElement('track');
      track.kind = 'captions'; track.label = 'Português'; track.srclang = 'pt-BR'; track.src = film.captionsSrc; track.default = true;
      video.append(track);
    }
    const target = document.getElementById('film-transcript');
    if (film.transcript) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Ler a transcrição do curta';
      const text = document.createElement('p');
      text.textContent = film.transcript;
      details.append(summary,text); target.append(details); target.hidden = false;
    }
    if (film.audioDescriptionSrc) {
      const link = document.createElement('a');
      link.href = film.audioDescriptionSrc;
      link.className = 'download-link';
      link.textContent = 'Assistir à versão com audiodescrição';
      target.append(link); target.hidden = false;
    }
    if (film.signLanguageSrc) {
      const link = document.createElement('a');
      link.href = film.signLanguageSrc;
      link.className = 'download-link';
      link.textContent = 'Assistir à versão com interpretação em Libras';
      target.append(link); target.hidden = false;
    }
    const available = [];
    if (film.captionsSrc) available.push('legendas em português');
    if (film.transcript) available.push('transcrição');
    if (film.audioDescriptionSrc) available.push('versão com audiodescrição');
    if (film.signLanguageSrc) available.push('interpretação em Libras');
    document.querySelector('.film-access-note').textContent = available.length ? 'Recursos disponíveis: ' + available.join(', ') + '.' : 'Curta disponível. Os recursos de acesso serão indicados quando seus arquivos forem adicionados.';
    document.querySelector('.production-label').textContent = 'CURTA DA EQUIPE';
    video.addEventListener('play', () => {
      document.getElementById('background-music').pause();
      if (!document.getElementById('reading-stop').hidden) document.getElementById('reading-stop').click();
    });
  }
})();
