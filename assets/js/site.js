/* Site do ForLabs: links para o sistema e para o WhatsApp, planos e as interações da página */
(function () {
  'use strict';
  const CFG = window.FORLABS_SITE;
  const app = CFG.appUrl.replace(/\/?$/, '/');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const wa = (msg) => `https://wa.me/${CFG.salesWhatsapp}?text=${encodeURIComponent(msg)}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
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
          <a class="btn btn-primary btn-lg btn-block" href="${wa(MSG.quote(p))}" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i>${hasPrice ? 'Assinar' : 'Pedir proposta'}</a>
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

  /* ---------- Avisos ao vivo sobre as telas ---------- */
  const toasts = $('[data-toasts]');
  if (toasts) {
    const items = [
      { i: 'file-earmark-check', tone: '#176bd0', t: 'Laudo pronto', s: 'T-00142 · Resina Acrílica Estirenada' },
      { i: 'check-circle', tone: '#059669', t: 'Análise aprovada', s: 'Dióxido de Titânio · ΔE 0,45' },
      { i: 'x-circle', tone: '#dc2626', t: 'Lote reprovado', s: 'Amarelo Óxido de Ferro · ΔE 1,82' },
      { i: 'paperclip', tone: '#7c5cf6', t: 'Foto anexada à ficha', s: 'Aplicação em Leneta · T-00142' },
      { i: 'file-earmark-pdf', tone: '#d97706', t: 'PDF emitido', s: 'Síntese de produção · Resinas' },
    ];
    let k = 0;
    let visible = true;
    const push = () => {
      const it = items[k++ % items.length];
      const el = document.createElement('div');
      el.className = 'p-toast';
      el.style.setProperty('--tone', it.tone);
      el.innerHTML = `<i class="bi bi-${it.i}"></i><div><b>${it.t}</b><small>${it.s}</small></div>`;
      toasts.appendChild(el);
      const all = $$('.p-toast:not(.is-out)', toasts);
      all.forEach((t, n) => t.classList.toggle('is-old', n < all.length - 1));
      if (all.length > 3) {
        all[0].classList.add('is-out');
        setTimeout(() => all[0].remove(), 500);
      }
    };
    push();
    setTimeout(push, 900);
    if (!reduced) {
      setInterval(() => { if (visible && !document.hidden) push(); }, 2800);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(toasts);
    }
  }

  /* ---------- Faixas: repete o conteúdo até cobrir a tela ---------- */
  $$('[data-marquee]').forEach((track) => {
    const items = Array.from(track.children);
    const setW = track.scrollWidth;
    const bandW = track.parentElement.offsetWidth;
    const n = Math.max(1, Math.ceil(bandW / Math.max(setW, 1)));
    for (let c = 1; c < n * 2; c++) {
      items.forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
    track.style.setProperty('--dur', `${Math.round((track.scrollWidth / 2) / (track.closest('.is-back') ? 55 : 75))}s`);
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

  /* ---------- Assinatura do rodapé: ocupa a largura toda da tela ---------- */
  const wordmark = $('.p-wordmark');
  const fitWordmark = () => {
    if (!wordmark) return;
    wordmark.style.fontSize = '100px';
    const range = document.createRange();
    range.selectNodeContents(wordmark);
    const w = range.getBoundingClientRect().width;
    wordmark.style.fontSize = `${(100 * (root.clientWidth * 0.96)) / w}px`;
  };
  fitWordmark();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
  addEventListener('resize', fitWordmark);

  /* ---------- Movimento ligado à rolagem ---------- */
  const stage = $('[data-tilt]');
  const how = $('[data-how]');
  const steps = $$('.p-step');
  const onScroll = () => {
    const y = scrollY;
    const vh = innerHeight;
    if (!header.classList.contains('is-solid')) header.classList.toggle('is-scrolled', y > 8);
    const max = root.scrollHeight - vh;
    if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    if (reduced) return;

    if (stage) {
      const r = stage.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp((vh - r.top) / (vh * 0.8), 0, 1);
        const e = 1 - (1 - p) * (1 - p);
        stage.style.setProperty('--rx', `${((1 - e) * 22).toFixed(2)}deg`);
        stage.style.setProperty('--sc', (0.9 + 0.1 * e).toFixed(4));
      }
    }
    if (how) {
      const r = how.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp((vh * 0.7 - r.top) / (r.height * 0.75), 0, 1);
        how.style.setProperty('--p', p.toFixed(4));
        steps.forEach((s, i) => s.classList.toggle('is-lit', p > (i + 0.6) / steps.length));
      }
    }
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Toques finos para mouse: paralaxe e botões magnéticos ---------- */
  if (finePointer && !reduced) {
    const showcase = $('.p-showcase');
    if (showcase && stage) {
      showcase.addEventListener('pointermove', (e) => {
        stage.style.setProperty('--mx', ((e.clientX / innerWidth) - 0.5).toFixed(3) * 2);
        stage.style.setProperty('--my', ((e.clientY / innerHeight) - 0.5).toFixed(3) * 2);
      });
    }
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const yy = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = `translate(${(x * 12).toFixed(1)}px, ${(yy * 10).toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }
})();
