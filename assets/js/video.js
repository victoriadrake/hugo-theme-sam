(() => {
  const video = document.querySelector('#background-video');
  const button = document.querySelector('.video-toggle');
  if (!video || !button) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => { button.textContent = video.paused ? 'Play background video' : 'Pause background video'; };
  button.hidden = false;
  button.addEventListener('click', () => {
    if (video.paused) video.play().catch(update);
    else video.pause();
  });
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  motion.addEventListener('change', () => { if (motion.matches) video.pause(); });
  if (!motion.matches) video.play().catch(update);
  update();
})();
