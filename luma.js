/* LUMA Heritage — luma.js v3 */
(function(){
  'use strict';

  /* Header scroll */
  const hdr = document.getElementById('header');
  if(hdr){
    const tick = () => hdr.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', tick, {passive:true});
    tick();
  }

  /* Mobile drawer */
  const btn = document.getElementById('hamburger');
  const drw = document.getElementById('drawer');
  const cls = document.getElementById('drawerClose');
  function openDrawer(){ btn.classList.add('open'); drw.classList.add('open'); drw.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function closeDrawer(){ btn.classList.remove('open'); drw.classList.remove('open'); drw.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  if(btn && drw){
    btn.addEventListener('click', () => drw.classList.contains('open') ? closeDrawer() : openDrawer());
    if(cls) cls.addEventListener('click', closeDrawer);
    drw.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeDrawer(); });
  }

  /* Active nav link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href')||'').split('#')[0].split('/').pop();
    if(href === page || (page==='' && href==='index.html')) a.classList.add('active');
  });

  /* Scroll reveal */
  const srObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); srObs.unobserve(e.target); }});
  }, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

  /* Counter animation */
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const sfx = el.dataset.suffix || '';
      if(isNaN(end)) return;
      let cur = 0;
      const inc = end / (1600 / 16);
      const tick = () => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.ceil(cur) + sfx;
        if(cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  }, {threshold:0.5});
  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

  /* Contact form */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if(submitBtn){ submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }
      await new Promise(r => setTimeout(r, 1000));
      const success = form.querySelector('.form-success');
      if(success){
        form.querySelectorAll('input,textarea,select,.form-row,.btn').forEach(el => el.style.display='none');
        success.style.display = 'block';
      } else if(submitBtn){
        submitBtn.textContent = '✓ Message sent';
        submitBtn.style.background = '#2d6a4f';
      }
    });
  });

})();
