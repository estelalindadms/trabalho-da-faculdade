(() => {
  'use strict';
  const data = window.RECIFE_DATA;
  if (!data || !data.photos.length) {
    document.getElementById('movements').textContent = 'O ensaio está sendo preparado. Atualize a página em instantes.';
    return;
  }
  const photos = data.photos;
  const movements = data.movements;
  const poemMovements = movements.filter(movement => movement.stanza?.length);
  const pad = n => String(n).padStart(2, '0');
  const escape = text => String(text || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel = p => p.date ? String(p.date).slice(0, 10).split('-').reverse().join('/') : 'data a confirmar';
  const locationLabel = photo => photo.location || '';
  const movementId = (movement, index) => movement.id || (index === movements.length - 1 ? 'recife-vivo' : 'capitulo-' + index);
  function photoCredit(photo) {
    const source = photo.sourceUrl ? '<a href="' + escape(photo.sourceUrl) + '" target="_blank" rel="noopener">Fonte original ↗</a>' : escape(photo.originalFile || 'Acervo autoral');
    const rights = photo.licenseUrl ? '<a href="' + escape(photo.licenseUrl) + '" target="_blank" rel="noopener">' + escape(photo.license) + '</a>' : escape(photo.license);
    const locationSource = photo.locationSourceUrl ? '<br><a href="' + escape(photo.locationSourceUrl) + '" target="_blank" rel="noopener">Referência para a localização ↗</a>' : '';
    return escape(photo.author) + ' · ' + escape(dateLabel(photo)) + '<br>' + escape(locationLabel(photo)) + locationSource + '<br>' + source + ' · ' + rights;
  }
  const chapterNav = document.getElementById('essay-chapters');
  if (chapterNav) {
    chapterNav.innerHTML = movements.map((movement, index) => {
      if (movement.photoCount === 0) return '';
      const label = movement.number ? movement.number + ' · ' + movement.title : movement.title;
      return '<a href="#' + escape(movementId(movement, index)) + '">' + escape(label) + '</a>';
    }).join('');
  }
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
        '<small>' + escape(photo.author) + ' · ' + escape(dateLabel(photo)) + '<br>' + escape(locationLabel(photo)) + '</small>' +
        '<details class="photo-visual-description"><summary>Descrição visual</summary><p id="' + figureId + '-visual-description">' + escape(photo.alt) + '</p></details>' + placeReading +
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
      '<header class="cinema-memory-heading"><p class="eyebrow">RECIFE VIVO · CINEMA E MEMÓRIA</p><h3 id="cinema-memory-title">A sessão continua<br><em>na calçada.</em></h3><p>' + escape(memory.intro) + '</p></header>' +
      comparisonHtml +
      '<div class="cinema-diptych"><article class="cinema-era"><span>01 / A SALA</span><h4>Uma cidade diante da tela</h4><p>' + escape(memory.past) + '</p>' + externalLink(memory.pastSource) + '</article>' +
      '<article class="cinema-era"><span>02 / A RUA</span><h4>O filme encontra outros caminhos</h4><p>' + escape(memory.present) + '</p><a href="' + currentLink + '">Ver os filmes nas fotografias <span aria-hidden="true">↓</span></a></article></div>' +
      '<details class="cinema-research"><summary>Da sala às bancas · ler a pesquisa</summary><ol class="cinema-timeline" role="list">' + timeline + '</ol><p class="cinema-location-note">' + escape(memory.locationNote) + '</p>' + externalLink(memory.archive) + '</details>' +
      '<p class="cinema-sequence-note">' + escape(memory.sequenceNote) + '</p></section>';
  }
  let photoOffset = 0;
  document.getElementById('movements').innerHTML = movements.map((movement, groupIndex) => {
    if (movement.photoCount === 0) return '';
    const firstPhoto = photoOffset;
    const movementPhotos = photos.slice(firstPhoto, firstPhoto + (movement.photoCount ?? 4));
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
    const closingLink = movement.alive
      ? '<a href="#barreiras-acesso">O direito de permanecer no Recife <span aria-hidden="true">↗</span></a>'
      : '<a href="#recife-vivo">Continuar para o Recife Vivo <span aria-hidden="true">↓</span></a>';
    const closing = movement.closing
      ? '<div class="alive-ending"><p>' + escape(movement.closing) + '</p>' + closingLink + '</div>'
      : '';
    const number = movement.number ? '<span class="movement-number">' + escape(movement.number) + '</span>' : '';
    return '<section class="movement" id="' + escape(movementId(movement, groupIndex)) + '" data-alive="' + (movement.alive || groupIndex === movements.length - 1) + '" aria-labelledby="movement-' + groupIndex + '">' +
      '<div class="movement-header">' + number + '<h2 id="movement-' + groupIndex + '">' + escape(movement.title) + '</h2><p>' + escape(movement.intro) + '</p></div>' +
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
  document.getElementById('poem').innerHTML = poemMovements.map(movement => '<article class="poem-part"><span>' + escape(movement.number) + ' / ' + escape(movement.title) + '</span><div class="stanza">' + movement.stanza.map(line => '<p>' + escape(line) + '</p>').join('') + '</div></article>').join('');
  document.getElementById('credits-list').innerHTML = photos.map(photo => '<li><strong>' + escape(photo.title) + '</strong><br>' + photoCredit(photo) + '<small>' + escape(photo.modifications) + '</small></li>').join('');
  const dialog = document.getElementById('photo-dialog');
  let currentPhoto = 0;
  function showPhoto(index) {
    stopPhotoReading();
    stopReading();
    pauseMusic();
    photoSpeechStatus.textContent = '';
    currentPhoto = (index + photos.length) % photos.length;
    const photo = photos[currentPhoto];
    const image = document.getElementById('lightbox-image');
    image.src = photo.src;
    image.alt = photo.alt;
    document.getElementById('photo-counter').textContent = pad(currentPhoto + 1) + ' / ' + photos.length;
    document.getElementById('lightbox-title').textContent = photo.title;
    document.getElementById('lightbox-description').textContent = photo.alt;
    document.getElementById('lightbox-caption').textContent = photo.caption;
    document.getElementById('lightbox-credit').innerHTML = photoCredit(photo);
    document.getElementById('photo-date-label').textContent = 'FOTOGRAFIA AUTORAL / ' + dateLabel(photo);
    document.getElementById('photo-announcement').textContent = 'Fotografia ' + (currentPhoto + 1) + ' de ' + photos.length + ': ' + photo.title + '.';
  }
  document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); dialog.showModal(); dialog.scrollTop = 0; }));
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
  const musicChapter = document.getElementById('music-chapter');
  const musicState = document.getElementById('sound-state');
  const musicTime = document.getElementById('music-time');
  const volume = document.getElementById('volume');
  const tracks = [
    { src:'assets/audio/recife-sujo.mp3', title:'A Cidade · Chico Science & Nação Zumbi', loop:true },
    { src:'assets/audio/recife-esquecido.mp3?v=20261125-2', title:'As Quatro Estações · Reginaldo Rossi' },
    { src:'assets/audio/recife-vivo.mp3?v=20261125-2', title:'Coco Dub (Afrociberdelia) · Chico Science & Nação Zumbi' }
  ];
  const forgotten = document.getElementById('recife-esquecido');
  const aliveSection = document.getElementById('recife-vivo');
  const alive = aliveSection.querySelector('.movement-header');
  let track;
  let musicMode = 'off';
  let routeMusicMode = 'off';
  let playingMusic = false;
  let musicEnded = false;
  let enteringAlive = false;
  let musicFrame;
  let musicRequest = 0;
  const stopButton = document.getElementById('reading-stop');
  const readingMusic = document.getElementById('reading-with-music');
  const toast = document.getElementById('toast');
  const synth = window.speechSynthesis;
  const canSpeak = !!synth && typeof SpeechSynthesisUtterance !== 'undefined';
  let reading = false;
  let readingPaused = false;
  let utterance = null;
  let readingTrigger = null;
  let readingRequest = 0;
  let photoReading = false;
  let photoReadingPaused = false;
  let photoUtterance = null;
  let photoRequest = 0;
  const photoSpeech = document.getElementById('photo-speech');
  const photoSpeechPause = document.getElementById('photo-speech-pause');
  const photoSpeechStop = document.getElementById('photo-speech-stop');
  const photoSpeechStatus = document.getElementById('photo-speech-status');
  let timer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('visible'), 6000);
  }
  function wantsMusic() {
    return musicMode === 'manual' || (musicMode === 'reading' && reading && !readingPaused);
  }
  function musicUI(message) {
    const requested = wantsMusic() && !musicEnded;
    document.body.classList.toggle('is-playing', playingMusic);
    musicToggle.setAttribute('aria-pressed', String(requested));
    musicToggle.querySelector('span').textContent = requested ? 'Ⅱ' : '▶';
    musicToggle.setAttribute('aria-label', requested ? 'Pausar a trilha' : musicEnded ? 'Repetir o trecho' : 'Tocar a trilha');
    const status = playingMusic ? 'Trilha tocando' : requested ? 'Carregando trilha' : 'Trilha pausada';
    musicState.textContent = message || (musicEnded ? 'Trecho concluído' : status);
  }
  function updateMusicVolume() {
    const readingGain = reading && !readingPaused ? .25 : 1;
    audio.volume = Number(volume.value) / 100 * readingGain;
  }
  function updateMusicTime() {
    const seconds = Math.floor(audio.currentTime || 0);
    musicTime.textContent = Math.floor(seconds / 60) + ':' + pad(seconds % 60);
  }
  function pausePlayback() {
    musicRequest++;
    playingMusic = false;
    audio.pause();
    musicUI();
  }
  function pauseMusic() {
    routeMusicMode = 'off';
    musicMode = 'off';
    pausePlayback();
  }
  function playbackError(message) {
    if (!wantsMusic()) return;
    pauseMusic();
    musicUI(message);
  }
  async function startMusicPlayback() {
    if (musicEnded) return;
    const request = ++musicRequest;
    if (audio.error) audio.load();
    musicUI();
    try {
      await audio.play();
    } catch (error) {
      if (request !== musicRequest) return;
      playbackError(error.name === 'NotAllowedError'
        ? 'Toque no botão de música para ouvir.'
        : 'Não foi possível tocar esta faixa.');
    }
  }
  function changeTrack(nextTrack) {
    if (track === nextTrack) return;
    track = nextTrack;
    musicRequest++;
    playingMusic = false;
    musicEnded = false;
    audio.loop = track.loop === true;
    audio.src = track.src;
    musicTime.textContent = '0:00';
    musicChapter.textContent = track.title;
    if (wantsMusic()) startMusicPlayback();
    else musicUI();
  }
  function syncTrack() {
    const boundary = innerHeight * .33;
    const atAlive = alive.getBoundingClientRect().top <= boundary;
    if (atAlive || aliveSection.getBoundingClientRect().top > innerHeight) enteringAlive = false;
    changeTrack(atAlive || enteringAlive ? tracks[2] : forgotten.getBoundingClientRect().top <= boundary ? tracks[1] : tracks[0]);
  }
  function playMusic(mode = 'manual') {
    routeMusicMode = 'off';
    syncTrack();
    musicMode = mode;
    musicEnded = false;
    updateMusicVolume();
    startMusicPlayback();
  }
  musicToggle.addEventListener('click', () => { if (wantsMusic() && !musicEnded) pauseMusic(); else playMusic(); });
  volume.addEventListener('input', updateMusicVolume);
  audio.addEventListener('playing', () => {
    if (!wantsMusic() || audio.paused) return;
    playingMusic = true;
    musicUI();
  });
  audio.addEventListener('pause', () => {
    if (audio.paused && !audio.ended && playingMusic) pauseMusic();
  });
  audio.addEventListener('ended', () => {
    if (!audio.ended) return;
    musicEnded = true;
    playingMusic = false;
    musicUI();
  });
  audio.addEventListener('error', () => playbackError('Não foi possível carregar esta faixa.'));
  audio.addEventListener('timeupdate', updateMusicTime);
  document.getElementById('essay-start').addEventListener('click', event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) playMusic();
  });
  document.addEventListener('recife:enter-vivo', () => {
    enteringAlive = true;
    changeTrack(tracks[2]);
  });
  document.addEventListener('recife:pause-music', pauseMusic);
  document.addEventListener('recife:pause-route', () => {
    const previousMode = musicMode;
    pauseMusic();
    routeMusicMode = previousMode;
  });
  document.addEventListener('recife:resume-route', () => {
    const previousMode = routeMusicMode;
    routeMusicMode = 'off';
    if (previousMode === 'off' || (previousMode === 'reading' && !reading)) return;
    syncTrack();
    musicMode = previousMode;
    updateMusicVolume();
    if (wantsMusic()) startMusicPlayback();
  });
  function scheduleTrackUpdate() {
    if (musicFrame) return;
    musicFrame = requestAnimationFrame(() => {
      musicFrame = null;
      syncTrack();
    });
  }
  window.addEventListener('scroll', scheduleTrackUpdate, {passive:true});
  window.addEventListener('resize', scheduleTrackUpdate);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseMusic(); });
  syncTrack();
  updateMusicVolume();
  function readingUI() {
    const returnFocus = document.activeElement === stopButton || document.activeElement === document.getElementById('reading-pause');
    document.querySelectorAll('.narration-label').forEach(label => { label.textContent = reading ? 'Parar a leitura' : 'Ouvir o cordel'; });
    document.querySelectorAll('.narration-trigger').forEach(button => button.setAttribute('aria-pressed', String(reading)));
    stopButton.hidden = !reading;
    document.getElementById('reading-pause').hidden = !reading;
    document.querySelector('.sound-player').classList.toggle('is-reading', reading);
    if (!reading && returnFocus && readingTrigger) readingTrigger.focus({preventScroll:true});
  }
  function finishReading() {
    readingRequest++;
    reading = false;
    readingPaused = false;
    utterance = null;
    if (musicMode === 'reading') pauseMusic();
    updateMusicVolume();
    readingUI();
  }
  function stopReading() {
    finishReading();
    if (synth) synth.cancel();
  }
  function startReadingMusic() {
    if (musicMode === 'manual') updateMusicVolume();
    else playMusic('reading');
  }
  document.querySelectorAll('.narration-trigger').forEach(button => button.addEventListener('click', () => {
    if (reading) { stopReading(); return; }
    if (!canSpeak) { notify('A leitura em voz não está disponível neste navegador. O poema integral está na seção O cordel e na versão em texto.'); return; }
    stopPhotoReading();
    readingTrigger = button;
    const request = ++readingRequest;
    reading = true;
    readingPaused = false;
    readingUI();
    if (readingMusic.checked) startReadingMusic();
    else pauseMusic();
    synth.cancel();
    const text = poemMovements.map(movement => movement.stanza.join('. ')).join('. ');
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.83;
    utterance.pitch = 0.95;
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().replace('_','-') === 'pt-br') || voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (voice) utterance.voice = voice;
    document.getElementById('reading-pause').setAttribute('aria-label', 'Pausar leitura do cordel');
    document.getElementById('reading-pause').setAttribute('aria-pressed', 'false');
    document.getElementById('reading-pause').querySelector('span').textContent = 'Ⅱ';
    readingUI();
    utterance.onend = () => {
      if (request !== readingRequest) return;
      finishReading();
      notify('A leitura terminou. O poema continua disponível em texto.');
    };
    utterance.onerror = event => {
      if (request !== readingRequest || !reading || event.error === 'canceled' || event.error === 'interrupted') return;
      finishReading();
      notify('A voz de demonstração não está disponível neste navegador. A trilha e o poema continuam acessíveis.');
    };
    synth.resume();
    synth.speak(utterance);
    notify(readingMusic.checked ? 'Leitura automática do cordel com música de fundo. O texto integral está na página.' : 'Leitura automática do cordel sem música de fundo. O texto integral está na página.');
  }));
  document.getElementById('reading-pause').addEventListener('click', () => {
    if (!reading || !synth) return;
    readingPaused = !readingPaused;
    updateMusicVolume();
    if (readingPaused) {
      synth.pause();
      if (musicMode === 'reading') pausePlayback();
    } else {
      synth.resume();
      if (musicMode === 'reading') startMusicPlayback();
    }
    const button = document.getElementById('reading-pause');
    button.setAttribute('aria-label', readingPaused ? 'Continuar leitura do cordel' : 'Pausar leitura do cordel');
    button.setAttribute('aria-pressed', String(readingPaused));
    button.querySelector('span').textContent = readingPaused ? '▶' : 'Ⅱ';
  });
  stopButton.addEventListener('click', stopReading);
  readingMusic.addEventListener('change', () => {
    if (!reading) return;
    if (!readingMusic.checked) pauseMusic();
    else if (!readingPaused) startReadingMusic();
  });
  function photoReadingUI() {
    const returnFocus = document.activeElement === photoSpeechPause || document.activeElement === photoSpeechStop;
    photoSpeech.textContent = photoReading ? 'Parar descrição em voz' : 'Ouvir descrição e leitura';
    photoSpeech.setAttribute('aria-pressed', String(photoReading));
    photoSpeechPause.hidden = !photoReading;
    photoSpeechStop.hidden = !photoReading;
    photoSpeechPause.textContent = photoReadingPaused ? 'Continuar descrição' : 'Pausar descrição';
    photoSpeechPause.setAttribute('aria-pressed', String(photoReadingPaused));
    if (!photoReading && returnFocus) photoSpeech.focus({preventScroll:true});
  }
  function stopPhotoReading() {
    const hadReading = photoReading;
    photoRequest++;
    photoReading = false;
    photoReadingPaused = false;
    if (hadReading && synth) synth.cancel();
    photoUtterance = null;
    photoReadingUI();
    if (hadReading) photoSpeechStatus.textContent = 'Leitura da fotografia interrompida. A descrição continua disponível em texto.';
  }
  photoSpeech.addEventListener('click', () => {
    if (photoReading) { stopPhotoReading(); return; }
    if (!canSpeak) return;
    stopReading();
    pauseMusic();
    const photo = photos[currentPhoto];
    const text = photo.title + '. Descrição visual: ' + photo.alt + '. Leitura do projeto: ' + photo.caption + ' Fotografia de ' + photo.author + ', ' + dateLabel(photo) + '. ' + locationLabel(photo) + '.';
    const request = ++photoRequest;
    photoUtterance = new SpeechSynthesisUtterance(text);
    photoUtterance.lang = 'pt-BR';
    photoUtterance.rate = .9;
    const voice = synth.getVoices().find(voice => voice.lang.toLowerCase().replace('_','-') === 'pt-br');
    if (voice) photoUtterance.voice = voice;
    photoReading = true;
    photoReadingPaused = false;
    photoReadingUI();
    photoSpeechStatus.textContent = 'Lendo a descrição e a leitura da fotografia, sem música de fundo.';
    photoUtterance.onend = () => {
      if (request !== photoRequest) return;
      photoReading = false; photoReadingPaused = false; photoReadingUI();
      photoSpeechStatus.textContent = 'Leitura da fotografia concluída.';
    };
    photoUtterance.onerror = event => {
      if (request !== photoRequest || event.error === 'canceled' || event.error === 'interrupted') return;
      photoReading = false; photoReadingPaused = false; photoReadingUI();
      photoSpeechStatus.textContent = 'A voz não está disponível. A descrição visual e a leitura do projeto continuam em texto nesta janela.';
    };
    synth.resume();
    synth.speak(photoUtterance);
  });
  photoSpeechPause.addEventListener('click', () => {
    if (!photoReading || !synth) return;
    photoReadingPaused = !photoReadingPaused;
    if (photoReadingPaused) synth.pause(); else synth.resume();
    photoReadingUI();
    photoSpeechStatus.textContent = photoReadingPaused ? 'Leitura da fotografia pausada.' : 'Leitura da fotografia retomada.';
  });
  photoSpeechStop.addEventListener('click', () => { stopPhotoReading(); photoSpeech.focus(); });
  dialog.addEventListener('close', () => { stopPhotoReading(); pauseMusic(); });
  if (!canSpeak) {
    photoSpeech.disabled = true;
    document.getElementById('photo-speech-note').textContent = 'A leitura em voz não está disponível neste navegador. A descrição visual e a leitura do projeto estão em texto, disponíveis ao leitor de tela.';
    document.querySelectorAll('.narration-trigger').forEach(button => { button.disabled = true; button.setAttribute('aria-describedby','speech-support'); });
    document.getElementById('speech-support').textContent = 'A leitura automática não está disponível neste navegador. Acesse o poema integral e o percurso em texto.';
  }
  photoReadingUI();
  readingUI();
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = () => synth.getVoices();
  window.addEventListener('pagehide', () => { stopPhotoReading(); stopReading(); pauseMusic(); });
})();
