const music = document.getElementById('music');
const musicButton = document.querySelector('.music-toggle');
const musicLabel = document.querySelector('.music-label');
const musicError = document.querySelector('.music-error');

function updateMusicButton() {
  const playing = !music.paused;
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicLabel.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
}

musicButton.addEventListener('click', async () => {
  musicError.hidden = true;
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch (error) {
    console.error('Unable to play background music:', error);
    musicError.textContent = 'Could not play music. Please try again.';
    musicError.hidden = false;
  }
});

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
music.addEventListener('error', () => {
  console.error('Unable to load background music:', music.error);
  musicError.textContent = 'Could not load music. Please try again later.';
  musicError.hidden = false;
});
