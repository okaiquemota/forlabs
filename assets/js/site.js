/* Site do ForLabs: links para o sistema e para o WhatsApp, planos, menu e animações de entrada */
(function () {
  'use strict';
  const CFG = window.FORLABS_SITE;
  const app = CFG.appUrl.replace(/\/?$/, '/');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const wa = (msg) => `https://wa.me/${CFG.salesWhatsapp}?text=${encodeURIComponent(msg)}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const MSG = {
    trial: 'Olá! Quero testar o ForLabs grátis no meu laboratório.',
    sales: 'Olá! Quero saber mais sobre o ForLabs.',
    quote: (plan) => `Olá! Quero uma proposta do ForLabs${CFG.plans.length > 1 ? ` (plano ${plan.name})` : ''}.`,
  };

  if (location.pathname.endsWith('/index.html')) {
    history.replaceState(null, '', location.href.replace(/index\.html(?=$|[?#])/, ''));
  }

  /* ---------- Links ---------- */
  $$('[data-app]').forEach((a) => { a.href = app + a.dataset.app; });
  $$('[data-trial]').forEach((a) => { a.href = wa(MSG.trial); });
  $$('[data-sales]').forEach((a) => { a.href = wa(MSG.sales); });
  $$('[data-trial], [data-sales]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Planos ---------- */
  const plans = document.getElementById('plans');
  if (plans) {
    plans.style.setProperty('--n', CFG.plans.length);
    plans.innerHTML = CFG.plans.map((p) => {
      const featured = p.featured || CFG.plans.length === 1;
      const hasPrice = typeof p.price === 'number';
      const price = hasPrice
        ? `<div class="plan-price" aria-label="${esc(money(p.price))} por mês"><span class="cur" aria-hidden="true">R$</span><strong aria-hidden="true">${Math.floor(p.price).toLocaleString('pt-BR')}</strong><span class="cents" aria-hidden="true">,${String(Math.round((p.price % 1) * 100)).padStart(2, '0')}<small>/mês</small></span></div>`
        : '<div class="plan-price is-quote"><strong>Sob consulta</strong></div>';
      const per = hasPrice ? 'Por mês, com todos os módulos.' : 'Montamos a proposta com você, de acordo com a rotina do laboratório.';
      return `<article class="plan-card${featured ? ' is-featured' : ''}" data-reveal>
        <div class="plan-head"><h3 class="plan-name">${esc(p.name)}</h3>${p.tag ? `<span class="plan-tag">${esc(p.tag)}</span>` : ''}</div>
        ${price}
        <p class="plan-per">${per}</p>
        <div class="plan-actions">
          <a class="btn btn-primary btn-lg btn-block" href="${wa(MSG.quote(p))}" target="_blank" rel="noopener">${hasPrice ? 'Assinar' : 'Pedir proposta'}</a>
          <a class="btn btn-outline btn-block" href="${wa(MSG.trial)}" target="_blank" rel="noopener">Testar grátis</a>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------- Cabeçalho: estado ao rolar, progresso e menu ---------- */
  const header = $('[data-header]');
  const progress = $('[data-progress]');
  const menuBtn = $('[data-menu-toggle]');
  const sheet = $('[data-menu]');
  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.sr-only', menuBtn).textContent = open ? 'Fechar menu' : 'Abrir menu';
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    matchMedia('(min-width: 1000px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* Links internos rolam até a seção sem colocar "#" no endereço */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link') || a.getAttribute('href') === '#') return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- Revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  $$('[data-reveal]').forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 90}ms`);
    io.observe(el);
  });

  /* ---------- Capítulos: o palco troca de tela conforme o texto ---------- */
  const chapters = $$('[data-chapter]');
  const frames = $$('[data-frame]');
  const dots = $$('.p-stage-dots span');
  const stageEl = $('[data-stage]');
  const setChapter = (i) => {
    if (stageEl) { stageEl.dataset.active = i; stageEl.dataset.n = `0${i + 1}`; }
    chapters.forEach((c, k) => c.classList.toggle('is-active', k === i));
    frames.forEach((f, k) => { f.classList.toggle('is-active', k === i); f.classList.toggle('is-past', k < i); });
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  if (chapters.length) {
    setChapter(0);
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setChapter(Number(e.target.dataset.chapter)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    chapters.forEach((c) => cio.observe(c));
  }

  /* ---------- Cabeçalho e progresso ao rolar ---------- */
  const onScroll = () => {
    if (!header.classList.contains('is-solid')) header.classList.toggle('is-scrolled', scrollY > 8);
    const max = root.scrollHeight - innerHeight;
    if (progress) progress.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : 0);
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
