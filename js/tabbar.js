/* SUDOMI 1.0 — TabBar Navigation
 * Clean 4-tab bar: Sudoku · Entrenar · Tienda · Perfil
 */
(()=>{
  'use strict';
  const $ = s => document.querySelector(s);
  const ICON = {
    sudoku: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>',
    train: '<path d="M12 3a9 9 0 0 0-9 9c0 3.6 2.1 6.7 5.2 8.1.4.2.8 0 .8-.5v-1.8c-2.5.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.3-2-.2-4.1-1-4.1-4.5 0-1 .4-1.8 1-2.4-.1-.2-.4-1.1.1-2.4 0 0 .8-.3 2.5.9.7-.2 1.5-.3 2.3-.3.8 0 1.6.1 2.3.3 1.7-1.2 2.5-.9 2.5-.9.5 1.3.2 2.2.1 2.4.6.6 1 1.4 1 2.4 0 3.5-2.1 4.3-4.1 4.5.3.3.6.8.6 1.7v2.5c0 .5.4.7.8.5 3.1-1.4 5.2-4.5 5.2-8.1a9 9 0 0 0-9-9Z"/>',
    shop: '<path d="M5 8.500h14l-1 11.500H6z"/><path d="M8.500 8.500V7a3.500 3.500 0 0 1 7 0v1.500"/>',
    profile: '<circle cx="12" cy="8.500" r="3.800"/><path d="M4.500 20c.7-4 3.700-6.300 7.500-6.300s6.800 2.300 7.500 6.300"/>'
  };

  const TABS = [
    ['sudoku', 'Sudoku'],
    ['train', 'Entrenar'],
    ['shop', 'Tienda'],
    ['profile', 'Perfil']
  ];

  let bar = null, timer = 0;
  const shown = el => !!el && !el.classList.contains('hidden');

  const PAGES = {
    profile: ['profileScreen', 'friendsScreen'],
    shop: ['shopScreen'],
    train: ['trainingScreen', 'teachScreen']
  };

  function base() {
    if (shown($('#gameScreen'))) return ''; // inside game board: hide tabbar
    if (shown($('#homeScreen'))) return 'home';
    return '';
  }

  function where() {
    const b = base();
    if (!b) return '';
    for (const k in PAGES) {
      if (PAGES[k].some(id => shown(document.getElementById(id)))) return k;
    }
    return b;
  }

  function closePages(except) {
    const S = window.SudomiScreen;
    if (!S) return;
    for (const k in PAGES) {
      if (k !== except) {
        PAGES[k].forEach(id => {
          if (shown(document.getElementById(id))) S.close(id);
        });
      }
    }
  }

  function update() {
    if (!bar) return;
    const w = where(), vis = !!w;
    bar.classList.toggle('hidden', !vis);
    document.body.classList.toggle('has-tabbar', vis);
    const page = w === 'profile' || w === 'shop' || w === 'train';
    document.body.classList.toggle('tab-page', page);

    bar.querySelectorAll('[data-tab]').forEach(b => {
      const t = b.dataset.tab;
      const on = (w === 'home' && t === 'sudoku') || (w === t);
      b.classList.toggle('on', on);
    });
  }

  const later = () => { clearTimeout(timer); timer = setTimeout(update, 50); };

  function goHome() {
    closePages();
    const g = $('#gameScreen'), h = $('#homeScreen');
    if (g) g.classList.add('hidden');
    if (h) h.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function go(tab) {
    if (where() === tab && (tab === 'profile' || tab === 'shop' || tab === 'train')) return;
    closePages(tab);
    if (tab === 'sudoku') {
      goHome();
    } else if (tab === 'train') {
      if (window.SudomiTraining) SudomiTraining.open();
    } else if (tab === 'shop') {
      if (window.SudomiShop) SudomiShop.open();
    } else if (tab === 'profile') {
      if (window.SudomiProfileScreen) SudomiProfileScreen.open();
    }
    later();
  }

  function boot() {
    if (bar) return;
    bar = document.createElement('nav');
    bar.id = 'tabBar';
    bar.className = 'tab-bar hidden';
    bar.setAttribute('aria-label', 'Secciones principales');
    bar.innerHTML = '<div class="tb-in">' + TABS.map(([k, n]) =>
      `<button type="button" data-tab="${k}"><span class="tb-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg></span><b>${n}</b></button>`
    ).join('') + '</div>';
    document.body.appendChild(bar);

    bar.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => go(b.dataset.tab));

    const mo = new MutationObserver(later);
    ['#homeScreen', '#gameScreen'].forEach(s => {
      const e = $(s);
      if (e) mo.observe(e, { attributes: true, attributeFilter: ['class'] });
    });

    const S = window.SudomiScreen;
    if (S && !S._tb) {
      S._tb = true;
      const o = S.open, c = S.close;
      S.open = function() { const r = o.apply(this, arguments); update(); return r; };
      S.close = function() { const r = c.apply(this, arguments); update(); return r; };
    }
    setInterval(update, 2000);
    window.addEventListener('storage', later);
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.SudomiTabBar = { update, go };
})();
