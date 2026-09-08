import PhotoSwipeLightbox from './vendor/photoswipe-lightbox.esm.js';
import PhotoSwipe from './vendor/photoswipe.esm.js';

for (const grid of document.querySelectorAll('[data-gallery]')) {
  const links = [...grid.querySelectorAll('a[data-photo-id]')];
  if (!links.length) continue;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lightbox = new PhotoSwipeLightbox({
    gallery: grid,
    children: 'a[data-photo-id]',
    pswpModule: PhotoSwipe,
    showHideAnimationType: reducedMotion ? 'none' : 'zoom',
    zoomAnimationDuration: reducedMotion ? 0 : 333,
    trapFocus: true,
    returnFocus: true,
  });
  let previousHash = '';
  const readHash = () => {
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.get('gid') !== grid.dataset.gallery) return -1;
    const photo = hash.get('photo');
    if (photo !== null) return links.findIndex(link => link.dataset.photoId === photo);
    // PhotoSwipe 4's legacy numeric links were one-based.
    const pid = hash.get('pid');
    return /^[1-9][0-9]*$/.test(pid || '') && Number(pid) <= links.length ? Number(pid) - 1 : -1;
  };
  const openFromHash = () => {
    const index = readHash();
    if (index < 0) return;
    if (lightbox.pswp) lightbox.pswp.goTo(index);
    else lightbox.loadAndOpen(index, { gallery: grid });
  };
  lightbox.on('beforeOpen', () => {
    previousHash = readHash() < 0 ? location.hash : '';
    document.documentElement.classList.add('sam-gallery-open');
  });
  lightbox.on('destroy', () => document.documentElement.classList.remove('sam-gallery-open'));
  lightbox.on('afterInit', () => {
    lightbox.pswp.element.setAttribute('aria-modal', 'true');
    lightbox.pswp.element.setAttribute('aria-label', grid.dataset.galleryTitle || 'Photo gallery');
  });
  // Wrap Tab explicitly so focus cannot move into browser chrome at either end.
  lightbox.on('keydown', event => {
    const key = event.originalEvent;
    if (key.key !== 'Tab') return;
    const dialog = lightbox.pswp.element;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0);
    key.preventDefault();
    event.preventDefault();
    if (!controls.length) { dialog.focus(); return; }
    const current = controls.indexOf(document.activeElement);
    const next = current < 0 ? (key.shiftKey ? controls.length - 1 : 0)
      : (current + (key.shiftKey ? -1 : 1) + controls.length) % controls.length;
    controls[next].focus();
  });
  lightbox.on('change', () => {
    const photo = links[lightbox.pswp.currIndex].dataset.photoId;
    const hash = new URLSearchParams({ gid: grid.dataset.gallery, photo });
    history.replaceState(null, '', `${location.pathname}${location.search}#${hash}`);
  });
  lightbox.on('close', () => {
    history.replaceState(null, '', `${location.pathname}${location.search}${previousHash}`);
  });
  lightbox.init();
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
