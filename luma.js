/* LUMA Heritage — luma.js v4 */
(function(){
  'use strict';

  /* ── PAGE TRANSITION ── */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location = href; }, 300);
    });
  });

  /* ── HEADER SCROLL ── */
  const hdr = document.getElementById('header');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HERO PARALLAX (desktop only) ── */
  const heroImg = document.querySelector('.hero__img');
  const heroContent = document.querySelector('.hero__content');
  if (heroImg && window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.1}px)`;
    }, { passive: true });
  }

  /* ── MOBILE DRAWER ── */
  const btn = document.getElementById('hamburger');
  const drw = document.getElementById('drawer');
  const cls = document.getElementById('drawerClose');
  function openDrawer() { btn.classList.add('open'); drw.classList.add('open'); drw.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { btn.classList.remove('open'); drw.classList.remove('open'); drw.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
  if (btn && drw) {
    btn.addEventListener('click', () => drw.classList.contains('open') ? closeDrawer() : openDrawer());
    if (cls) cls.addEventListener('click', closeDrawer);
    drw.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ── ACTIVE NAV ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ── SCROLL REVEAL ── */
  const srObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      srObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

  /* ── COUNTER ANIMATION ── */
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const sfx = el.dataset.suffix || '';
      if (isNaN(end)) return;
      let cur = 0;
      const inc = end / (1600 / 16);
      const tick = () => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.ceil(cur) + sfx;
        if (cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

  /* ── SECTION TITLE UNDERLINE ANIMATION ── */
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); titleObs.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section-hd').forEach(el => titleObs.observe(el));

  /* ── CATALOGUE MODAL ── */
  const modal = document.getElementById('catalogueModal');
  const openBtns = document.querySelectorAll('[data-catalogue]');
  const closeBtnM = document.getElementById('modalClose');
  const catForm = document.getElementById('catalogueForm');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('input')?.focus(), 100);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(); }));
  if (closeBtnM) closeBtnM.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  if (catForm) {
    catForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = catForm.querySelector('button');
      btn.textContent = 'Sending…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      catForm.style.display = 'none';
      document.getElementById('catSuccess').style.display = 'block';
      // Auto-close after 3s
      setTimeout(closeModal, 3000);
    });
  }

  /* ── CONTACT FORMS ── */
  document.querySelectorAll('form:not(#catalogueForm):not(#devisForm)').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      await new Promise(r => setTimeout(r, 1000));
      const success = form.querySelector('.form-success');
      if (success) {
        form.querySelectorAll('input,textarea,select,.form-row,.btn').forEach(el => el.style.display = 'none');
        success.style.display = 'block';
      } else if (btn) {
        btn.textContent = '✓ Message sent';
        btn.style.background = '#2d6a4f';
      }
    });
  });

  /* ── SMOOTH NUMBER TICKER ── */
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    // Pause on hover
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ── DEVIS FORM ── */
  const devisForm = document.getElementById('devisForm');
  if (devisForm) {
    function updateCheck(cb) { cb.closest('label').classList.toggle('checked', cb.checked); updateSummary(); }
    function updateVol(v) { const el = document.getElementById('volVal'); if(el) el.textContent = parseInt(v).toLocaleString(); updateSummary(); }
    function updateSummary() {
      const type = devisForm.querySelector('[name="type"]')?.value;
      const vol  = devisForm.querySelector('#volSlider')?.value;
      const prods = [...devisForm.querySelectorAll('[name="products"]:checked')].map(c => c.value);
      const box = document.getElementById('devisSummary');
      if (!box) return;
      let html = '';
      if (type) html += `<p>Establishment: <strong>${type}</strong></p>`;
      if (prods.length) html += `<p>Products: <strong>${prods.join(', ')}</strong></p>`;
      if (vol) html += `<p>Volume: <strong>${parseInt(vol).toLocaleString()} units / month</strong></p>`;
      box.innerHTML = html || '<p>Fill in the form to see your summary.</p>';
    }
    window.updateCheck = updateCheck;
    window.updateVol = updateVol;
    devisForm.querySelectorAll('select').forEach(s => s.addEventListener('change', updateSummary));
    devisForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = devisForm.querySelector('.devis-submit');
      btn.textContent = 'Sending…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      devisForm.querySelectorAll('.devis-block,.devis-summary,.devis-submit').forEach(el => el.style.display = 'none');
      const success = document.getElementById('devisSuccess');
      if (success) success.style.display = 'block';
    });
  }

})();
