const music = document.getElementById('music');
const musicButton = document.querySelector('.music-toggle');
const musicError = document.querySelector('.music-error');
const discordName = document.getElementById('discord-name');
const discordIcon = document.getElementById('discord-icon');
const discordCounts = document.getElementById('discord-counts');

async function loadDiscordInvite() {
  try {
    const response = await fetch('https://discord.com/api/v10/invites/harukilol?with_counts=true');
    if (!response.ok) throw new Error(`Discord invite request failed: ${response.status}`);
    const invite = await response.json();
    if (!invite.guild || typeof invite.guild.name !== 'string') throw new Error('Discord invite has no server details');

    discordName.textContent = invite.guild.name;
    if (invite.guild.id && invite.guild.icon) {
      discordIcon.addEventListener('error', () => {
        discordIcon.hidden = true;
        console.error('Unable to load Discord server icon');
      }, { once: true });
      discordIcon.src = `https://cdn.discordapp.com/icons/${encodeURIComponent(invite.guild.id)}/${encodeURIComponent(invite.guild.icon)}.png?size=128`;
      discordIcon.hidden = false;
    }

    if (Number.isInteger(invite.approximate_presence_count) && Number.isInteger(invite.approximate_member_count)) {
      const dot = document.createElement('span');
      dot.className = 'discord-count-dot';
      dot.setAttribute('aria-hidden', 'true');
      discordCounts.replaceChildren(dot, `${invite.approximate_presence_count.toLocaleString()} online · ${invite.approximate_member_count.toLocaleString()} members`);
    } else {
      discordCounts.textContent = 'Member counts unavailable';
    }
  } catch (error) {
    console.error('Unable to load Discord server details:', error);
    discordCounts.textContent = 'Server details unavailable';
  }
}

loadDiscordInvite();

function updateMusicButton() {
  const playing = !music.paused;
  musicButton.setAttribute('aria-pressed', String(playing));
  const label = playing ? 'Pause music' : 'Play music';
  musicButton.setAttribute('aria-label', label);
  musicButton.title = label;
}

let playbackAttempt = 0;

async function startMusic() {
  const attempt = ++playbackAttempt;
  musicError.hidden = true;
  try {
    await music.play();
  } catch (error) {
    if (attempt !== playbackAttempt) return;
    console.error('Unable to play background music:', error);
    musicError.textContent = 'Could not play music. Please try again.';
    musicError.hidden = false;
  }
}

musicButton.addEventListener('click', () => {
  if (!music.paused) {
    playbackAttempt++;
    music.pause();
    musicError.hidden = true;
  } else {
    startMusic();
  }
});

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
music.addEventListener('error', () => {
  console.error('Unable to load background music:', music.error);
  musicError.textContent = 'Could not load music. Please try again later.';
  musicError.hidden = false;
});
