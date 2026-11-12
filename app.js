(() => {
  'use strict';
  const data = window.RECIFE_DATA;
  if (!data || !data.photos.length) {
    document.getElementById('movements').textContent = 'O ensaio está sendo preparado. Atualize a página em instantes.';
    return;
  }
  const photos = data.photos;
  const movements = data.movements;
  const pad = n => String(n).padStart(2, '0');
  const escape = text => String(text || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel = p => p.date ? String(p.date).slice(0, 10).split('-').reverse().join('/') : 'data a confirmar';
  const locationLabel = photo => (photo.locationConfidence ? photo.locationConfidence + ' · ' : '') + photo.location;
  const movementId = index => index === movements.length - 1 ? 'recife-vivo' : 'capitulo-' + index;
  function photoCredit(photo) {
    const source = photo.sourceUrl ? '<a href="' + escape(photo.sourceUrl) + '" target="_blank" rel="noopener">Fonte original ↗</a>' : escape(photo.originalFile || 'Acervo autoral');
    const rights = photo.licenseUrl ? '<a href="' + escape(photo.licenseUrl) + '" target="_blank" rel="noopener">' + escape(photo.license) + '</a>' : escape(photo.license);
    const locationSource = photo.locationSourceUrl ? '<br><a href="' + escape(photo.locationSourceUrl) + '" target="_blank" rel="noopener">Referência para a localização ↗</a>' : '';
    return escape(photo.author) + ' · ' + escape(dateLabel(photo)) + '<br>' + escape(locationLabel(photo)) + locationSource + '<br>' + source + ' · ' + rights;
  }
  const chapterNav = document.getElementById('essay-chapters');
  if (chapterNav) chapterNav.innerHTML = movements.map((movement, index) => '<a href="#' + movementId(index) + '">' + escape(movement.number) + ' · ' + escape(movement.title) + '</a>').join('');
  function renderPhoto(photo, index, figureId) {
    const contextLink = photo.contextLink
      ? '<a class="photo-study-link" href="' + escape(photo.contextLink) + '">' + escape(photo.contextLabel) + ' <span aria-hidden="true">↗</span></a>'
      : '';
    const placeReading = photo.placeReading
      ? '<details class="photo-place-reading"><summary>Leitura do lugar</summary><p>' + escape(photo.placeReading) + '</p>' +
        (photo.locationSourceUrl ? '<a href="' + escape(photo.locationSourceUrl) + '" target="_blank" rel="noopener">Consultar a referência do lugar <span aria-hidden="true">↗</span></a>' : '') + '</details>'
      : '';
    const classes = 'photo-card' + (photo.featured ? ' photo-card-featured' : '');
    return '<figure class="' + classes + '" style="--photo-ratio:' + (photo.width || 1600) + '/' + (photo.height || 1200) + '" id="' + figureId + '" tabindex="-1">' +
      '<button class="photo-open" type="button" data-photo="' + index + '" aria-label="Abrir fotografia ' + pad(index + 1) + ': ' + escape(photo.title) + '">' +
        '<img src="' + escape(photo.src) + '" alt="' + escape(photo.alt) + '" width="' + (photo.width || 1600) + '" height="' + (photo.height || 1200) + '" loading="lazy" decoding="async">' +
        '<span class="expand" aria-hidden="true">↗</span>' +
      '</button>' +
      '<figcaption class="photo-caption"><span>' + pad(index + 1) + '</span><div>' +
        '<h3>' + escape(photo.title) + '</h3><p>' + escape(photo.caption) + '</p>' + contextLink +
        '<small>' + escape(photo.author) + ' · ' + escape(dateLabel(photo)) + '<br>' + escape(locationLabel(photo)) + '</small>' + placeReading +
      '</div></figcaption></figure>';
  }
  function renderCinemaMemory(photo, photoIndex) {
    const memory = data.cinemaMemory;
    if (!memory) return '';
    const externalLink = source => '<a href="' + escape(source.url) + '" target="_blank" rel="noopener">' + escape(source.label) + ' <span aria-hidden="true">↗</span></a>';
    const currentIndex = photos.findIndex(photo => photo.originalFile === 'DSC05752.jpg');
    const currentLink = currentIndex < 0 ? '#recife-vivo' : '#foto-' + pad(currentIndex + 1);
    const comparison = memory.comparison;
    let comparisonHtml = '';
    if (comparison && photo.originalFile === comparison.currentFile) {
      const archive = comparison.historical;
      comparisonHtml = '<div class="cinema-comparison" role="group" aria-label="Comparação do Trianon em 1961 e no percurso de ' + escape(photo.author) + ' em 2026">' +
        '<figure class="cinema-comparison-photo" id="trianon-1961"><p class="cinema-comparison-date">1961 / MEMÓRIA DO CINEMA</p>' +
        '<a class="cinema-archive-open" href="' + escape(archive.src) + '" target="_blank" rel="noopener" aria-label="Ampliar fotografia de 1961, de Mário de Carvalho, em nova aba" aria-describedby="trianon-1961-description"><img src="' + escape(archive.src) + '" width="' + archive.width + '" height="' + archive.height + '" alt="' + escape(archive.alt) + '" loading="lazy" decoding="async"><span class="expand" aria-hidden="true">↗</span></a>' +
        '<figcaption class="cinema-comparison-caption"><h4>' + escape(archive.title) + '</h4><p id="trianon-1961-description">' + escape(archive.caption) + '</p><small>' + escape(archive.author) + ' · ' + escape(archive.dateLabel) + '<br>Acervo ' + escape(archive.collection) + '</small>' + externalLink({url:archive.sourceUrl,label:archive.sourceLabel}) + '</figcaption></figure>' +
        '<div class="cinema-comparison-current"><p class="cinema-comparison-date">2026 / O PERCURSO DE ' + escape(photo.author.toUpperCase()) + '</p>' + renderPhoto(photo, photoIndex, 'foto-' + pad(photoIndex + 1)) + '</div></div>' +
        '<p class="cinema-comparison-note">' + escape(comparison.note) + '</p>';
    }
    const timeline = memory.timeline.map(entry => '<li><span>' + escape(entry.date) + '</span><div><h4>' + escape(entry.title) + '</h4><p>' + escape(entry.text) + '</p>' + entry.sources.map(externalLink).join('') + '</div></li>').join('');
    return '<section class="cinema-memory" id="cinema-na-calcada" tabindex="-1" aria-labelledby="cinema-memory-title">' +
      '<header class="cinema-memory-heading"><p class="eyebrow">RECIFE VIVO · CADERNO DE MEMÓRIA</p><h3 id="cinema-memory-title">A sessão continua<br><em>na calçada.</em></h3><p>' + escape(memory.intro) + '</p></header>' +
      comparisonHtml +
      '<div class="cinema-diptych"><article class="cinema-era"><span>01 / A SALA</span><h4>Uma cidade diante da tela</h4><p>' + escape(memory.past) + '</p>' + externalLink(memory.pastSource) + '</article>' +
      '<article class="cinema-era"><span>02 / A RUA</span><h4>O filme encontra outros caminhos</h4><p>' + escape(memory.present) + '</p><a href="' + currentLink + '">Ver os filmes nas fotografias <span aria-hidden="true">↓</span></a></article></div>' +
      '<details class="cinema-research"><summary>Da sala às bancas · ler a pesquisa</summary><ol class="cinema-timeline" role="list">' + timeline + '</ol><p class="cinema-location-note">' + escape(memory.locationNote) + '</p>' + externalLink(memory.archive) + '</details>' +
      '<p class="cinema-sequence-note">' + escape(memory.sequenceNote) + '</p></section>';
  }
  let photoOffset = 0;
  document.getElementById('movements').innerHTML = movements.map((movement, groupIndex) => {
    const firstPhoto = photoOffset;
    const movementPhotos = photos.slice(firstPhoto, firstPhoto + (movement.photoCount || 4));
    photoOffset += movementPhotos.length;
    const cards = movementPhotos.map((photo, j) => {
      const index = firstPhoto + j;
      const part = movement.sections && movement.sections[j];
      const partHeading = part
        ? '<div class="alive-part"><p class="eyebrow">' + escape(part.number) + ' / ' + escape(movement.partLabel || 'RECIFE VIVO') + '</p><h3>' + escape(part.title) + '</h3><p>' + escape(part.intro) + '</p></div>'
        : '';
      const photoContent = data.cinemaMemory?.comparison?.currentFile === photo.originalFile
        ? renderCinemaMemory(photo, index)
        : renderPhoto(photo, index, 'foto-' + pad(index + 1));
      return partHeading + photoContent;
    }).join('');
    const closing = movement.closing
      ? '<div class="alive-ending"><p>' + escape(movement.closing) + '</p><a href="#barreiras-acesso">O direito de permanecer no Recife <span aria-hidden="true">↗</span></a></div>'
      : '';
    return '<section class="movement" id="' + movementId(groupIndex) + '" data-alive="' + (movement.alive || groupIndex === movements.length - 1) + '" aria-labelledby="movement-' + groupIndex + '">' +
      '<div class="movement-header"><span class="movement-number">' + escape(movement.number) + '</span><h2 id="movement-' + groupIndex + '">' + escape(movement.title) + '</h2><p>' + escape(movement.intro) + '</p></div>' +
      '<div class="photo-grid">' + cards + '</div>' + closing + '</section>';
  }).join('');
  const urbanGallery = document.getElementById('urban-photo-gallery');
  if (urbanGallery) {
    urbanGallery.innerHTML = (data.urbanReadings || []).map((reading, index) => {
      const photoIndex = photos.findIndex(photo => photo.originalFile === reading.file);
      if (photoIndex < 0) return '';
      const photo = {...photos[photoIndex], caption:reading.caption, contextLink:reading.contextLink, contextLabel:reading.contextLabel};
      return renderPhoto(photo, photoIndex, 'leitura-urbana-' + (index + 1));
    }).join('');
  }
  document.getElementById('poem').innerHTML = movements.map(movement => '<article class="poem-part"><span>' + escape(movement.number) + ' / ' + escape(movement.title) + '</span><div class="stanza">' + movement.stanza.map(line => '<p>' + escape(line) + '</p>').join('') + '</div></article>').join('');
  document.getElementById('credits-list').innerHTML = photos.map(photo => '<li><strong>' + escape(photo.title) + '</strong><br>' + photoCredit(photo) + '<small>' + escape(photo.modifications) + '</small></li>').join('');
  const dialog = document.getElementById('photo-dialog');
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + photos.length) % photos.length;
    const photo = photos[currentPhoto];
    const image = document.getElementById('lightbox-image');
    image.src = photo.src;
    image.alt = photo.alt;
    document.getElementById('photo-counter').textContent = pad(currentPhoto + 1) + ' / ' + photos.length;
    document.getElementById('lightbox-title').textContent = photo.title;
    document.getElementById('lightbox-description').textContent = photo.alt;
    document.getElementById('lightbox-credit').innerHTML = photoCredit(photo);
    document.getElementById('photo-date-label').textContent = 'FOTOGRAFIA AUTORAL / ' + dateLabel(photo);
  }
  document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); dialog.showModal(); }));
  document.getElementById('photo-close').addEventListener('click', () => dialog.close());
  document.getElementById('photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.getElementById('photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  const audio = document.getElementById('background-music');
  const musicToggle = document.getElementById('music-toggle');
  const volume = document.getElementById('volume');
  const stopButton = document.getElementById('reading-stop');
  const toast = document.getElementById('toast');
  const synth = window.speechSynthesis;
  let reading = false;
  let readingPaused = false;
  let utterance = null;
  let timer;
  audio.volume = Number(volume.value) / 100;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('visible'), 6000);
  }
  function musicUI() {
    const playing = !audio.paused;
    document.body.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    musicToggle.setAttribute('aria-label', playing ? 'Pausar música de fundo' : 'Tocar música de fundo');
  }
  async function playMusic() {
    try { await audio.play(); } catch { notify('Toque no botão de música para iniciar a trilha.'); }
  }
  musicToggle.addEventListener('click', () => { if (audio.paused) playMusic(); else audio.pause(); });
  audio.addEventListener('play', musicUI);
  audio.addEventListener('pause', musicUI);
  audio.addEventListener('error', () => notify('A trilha não carregou. Tente atualizar a página.'));
  audio.addEventListener('timeupdate', () => {
    const seconds = Math.floor(audio.currentTime || 0);
    document.getElementById('music-time').textContent = Math.floor(seconds / 60) + ':' + pad(seconds % 60);
  });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  function readingUI() {
    document.querySelectorAll('.narration-label').forEach(label => { label.textContent = reading ? 'Parar a leitura' : 'Ouvir o cordel'; });
    stopButton.hidden = !reading;
    document.getElementById('reading-pause').hidden = !reading;
    document.querySelector('.sound-player').classList.toggle('is-reading', reading);
  }
  function stopReading() {
    reading = false;
    readingPaused = false;
    if (synth) synth.cancel();
    utterance = null;
    audio.pause();
    readingUI();
  }
  document.querySelectorAll('.narration-trigger').forEach(button => button.addEventListener('click', async () => {
    if (reading) { stopReading(); return; }
    await playMusic();
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { notify('A leitura automática não está disponível neste navegador. O poema está na seção O cordel.'); return; }
    synth.cancel();
    const text = movements.map(movement => movement.stanza.join('. ')).join('. ');
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.83;
    utterance.pitch = 0.95;
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().replace('_','-') === 'pt-br') || voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (voice) utterance.voice = voice;
    reading = true;
    readingPaused = false;
    document.getElementById('reading-pause').setAttribute('aria-label', 'Pausar leitura do cordel');
    document.getElementById('reading-pause').setAttribute('aria-pressed', 'false');
    document.getElementById('reading-pause').querySelector('span').textContent = 'Ⅱ';
    readingUI();
    utterance.onend = () => { reading = false; readingUI(); notify('A leitura terminou. A música continua para acompanhar as fotografias.'); };
    utterance.onerror = event => {
      if (!reading || event.error === 'canceled' || event.error === 'interrupted') return;
      reading = false;
      readingUI();
      notify('A voz de demonstração não está disponível neste navegador. A trilha e o poema continuam acessíveis.');
    };
    synth.speak(utterance);
    notify('Leitura automática de demonstração, com música instrumental de fundo.');
  }));
  document.getElementById('reading-pause').addEventListener('click', () => {
    if (!reading || !synth) return;
    readingPaused = !readingPaused;
    if (readingPaused) { synth.pause(); audio.pause(); } else { synth.resume(); playMusic(); }
    const button = document.getElementById('reading-pause');
    button.setAttribute('aria-label', readingPaused ? 'Continuar leitura do cordel' : 'Pausar leitura do cordel');
    button.setAttribute('aria-pressed', String(readingPaused));
    button.querySelector('span').textContent = readingPaused ? '▶' : 'Ⅱ';
  });
  stopButton.addEventListener('click', stopReading);
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = () => synth.getVoices();
  window.addEventListener('pagehide', () => { if (synth) synth.cancel(); audio.pause(); });
})();
