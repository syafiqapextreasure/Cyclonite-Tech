(() => {
  'use strict';
  const isMalay = document.documentElement.lang.startsWith('ms');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width:961px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // Essential content remains visible without JavaScript or if motion is reduced.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('is-pending'); observer.observe(el); }
    });
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.photo-card[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) card.classList.remove('is-pending');
    });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('.results-count').textContent = isMalay ? `${count} foto` : `${count} ${count === 1 ? 'photograph' : 'photographs'}`;
  }));

  const dialog = document.querySelector('#photo-dialog');
  const links = [...document.querySelectorAll('[data-lightbox]')];
  let activeLink = null;
  function visibleLinks() { return links.filter(link => !link.closest('.photo-card').hidden); }
  function showPhoto(link) {
    activeLink = link;
    const image = document.querySelector('#photo-image');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    document.querySelector('#photo-title').textContent = link.dataset.title;
    document.querySelector('#photo-caption').textContent = link.dataset.caption;
    const visible = visibleLinks();
    document.querySelector('#photo-prev').disabled = visible.indexOf(link) <= 0;
    document.querySelector('#photo-next').disabled = visible.indexOf(link) >= visible.length - 1;
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault(); showPhoto(link); dialog.showModal();
    document.querySelector('.dialog-close').focus();
  }));
  function movePhoto(direction) {
    const visible = visibleLinks();
    const next = visible[visible.indexOf(activeLink) + direction];
    if (next) showPhoto(next);
  }
  document.querySelector('#photo-prev').addEventListener('click', () => movePhoto(-1));
  document.querySelector('#photo-next').addEventListener('click', () => movePhoto(1));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => { if(event.key === 'ArrowLeft') movePhoto(-1); if(event.key === 'ArrowRight') movePhoto(1); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => activeLink?.focus());

  const form = document.querySelector('#enquiry-form');
  if (form) form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelectorAll('[required]').forEach(field => {
      field.setCustomValidity(field.value.trim() ? '' : (isMalay ? 'Sila lengkapkan ruangan ini.' : 'Please complete this field.'));
    });
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const val = name => String(fields.get(name) || '').trim();
    const message = (isMalay ? ['Salam Cyclonite Tech, saya ingin bertanya tentang perkhidmatan anda.', '', `Nama: ${val('name')}`, ...(val('company') ? [`Syarikat: ${val('company')}`] : []), `Perkhidmatan: ${val('service')}`, `Lokasi projek: ${val('location')}`, `Butiran projek: ${val('details')}`] : ['Hello Cyclonite Tech, I would like to enquire about your services.', '', `Name: ${val('name')}`, ...(val('company') ? [`Company: ${val('company')}`] : []), `Service: ${val('service')}`, `Project location: ${val('location')}`, `Project details: ${val('details')}`]).join('\n');
    const url = `https://wa.me/60122929224?text=${encodeURIComponent(message)}`;
    const status = document.querySelector('#form-status');
    status.replaceChildren(document.createTextNode(isMalay ? 'Draf WhatsApp anda sudah tersedia. Semak dahulu sebelum hantar. ' : 'Your WhatsApp draft is ready. Review it before sending. '));
    const fallback = document.createElement('a'); fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = isMalay ? 'Buka draf WhatsApp' : 'Open WhatsApp draft'; status.append(fallback);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
