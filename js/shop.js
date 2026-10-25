/* SUDOMI 1.0 — Tienda de Skins y Coleccionables
 * Exclusiva para Sudoku y Perfil:
 * - Skins de Números y Teclado: Neón, A lápiz, Oro, Caoba.
 * - Animaciones finales de Victoria: Bandera dominicana, Derrumbe, Fuegos artificiales.
 * - Personajes y Avatares 3D coleccionables para perfil y multijugador.
 */
(()=>{
  'use strict';
  const CKEY = 'sudomi-coins', SKEY = 'sudomi-shop-skins', DAILY_COINS = 50;
  const num = v => Number.isFinite(+v) && +v > 0 ? Math.floor(+v) : 0;

  const Coins = {
    get() { try { return num(localStorage.getItem(CKEY)); } catch (_) { return 0; } },
    set(n) {
      try { localStorage.setItem(CKEY, String(num(n))); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent('sudomi-coins', { detail: { coins: num(n) } })); } catch (_) {}
    },
    add(n, why) {
      n = num(n); if (!n) return this.get();
      this.set(this.get() + n);
      toast(`+${n} monedas`, why || '');
      return this.get();
    },
    spend(n) {
      n = num(n); if (this.get() < n) return false;
      this.set(this.get() - n);
      return true;
    },
    DAILY: DAILY_COINS
  };

  function toast(title, sub) {
    const t = document.createElement('div');
    t.className = 'coin-toast';
    t.innerHTML = `${coinSvg()}<div><b></b><small></small></div>`;
    t.querySelector('b').textContent = title;
    t.querySelector('small').textContent = sub;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  const coinSvg = () =>
    '<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#f4b400" stroke="#8a5a00" stroke-width="1.8"/><circle cx="12" cy="12" r="6.5" fill="#ffd95a" stroke="#b07a00" stroke-width="1.2"/><path d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.6 3-2.7-1.5-2.7 1.5.6-3-2.2-2.1 3-.4z" fill="#b07a00"/></svg>';

  const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  // Number preview SVG generator
  const numThumb = (bg, stroke, n, attrs, extra) =>
    uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${extra || ''}<rect x="6" y="6" width="88" height="88" rx="18" fill="${bg}" stroke="${stroke}" stroke-width="4"/><text x="50" y="71" text-anchor="middle" font-size="62" font-weight="900" ${attrs}>${n}</text></svg>`);

  const GLOW = '<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  const neonThumb = (n, c) => numThumb('#0d1030', c, n, `fill="none" stroke="${c}" stroke-width="3.5" stroke-linejoin="round" filter="url(#g)" font-family="Arial Rounded MT Bold,Arial,sans-serif"`, GLOW);

  const SD_NEON = [neonThumb(2, '#29a8ff'), neonThumb(3, '#ff9a1f')];
  const FONT_NEON = '"Arial Rounded MT Bold","Nunito","Varela Round","Segoe UI",system-ui,sans-serif';
  const FONT_LAPIZ = '"Segoe Print","Bradley Hand","Chalkboard SE","Marker Felt","Comic Sans MS",cursive';
  const FONT_ORO = 'Georgia,"Times New Roman",serif';
  const FONT_CAOBA = '"Palatino Linotype","Book Antiqua",Palatino,serif';

  const SD_LAPIZ = [
    numThumb('#fff8c9', '#e2cf6a', 4, `fill="#3d4350" font-family='${FONT_LAPIZ.replace(/"/g, '')}'`),
    numThumb('#ffffff', '#c9d3e2', 8, `fill="#3d4350" font-family='${FONT_LAPIZ.replace(/"/g, '')}'`)
  ];

  const SD_ORO = [
    numThumb('#16120a', '#c79a1e', 9, 'fill="#f6d36b" stroke="#7a5200" stroke-width="1.5" font-family="Georgia,serif"'),
    numThumb('#16120a', '#c79a1e', 1, 'fill="#f6d36b" stroke="#7a5200" stroke-width="1.5" font-family="Georgia,serif"')
  ];

  const SD_CAOBA = [
    numThumb('#3a1f14', '#8a4b2a', 5, 'fill="#e8b88a" stroke="#221109" stroke-width="1.5" font-family="serif"'),
    numThumb('#3a1f14', '#8a4b2a', 7, 'fill="#e8b88a" stroke="#221109" stroke-width="1.5" font-family="serif"')
  ];

  const WIN_FLAG = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="14" fill="#fff"/><rect x="6" y="6" width="36" height="36" rx="10" fill="#002d62"/><rect x="58" y="6" width="36" height="36" rx="10" fill="#ce1126"/><rect x="6" y="58" width="36" height="36" rx="10" fill="#ce1126"/><rect x="58" y="58" width="36" height="36" rx="10" fill="#002d62"/><rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke="#10213b" stroke-width="4"/></svg>');
  const WIN_FALL = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="14" fill="#10213b"/><g fill="#fff" stroke="#c9d3e2" stroke-width="2"><rect x="12" y="12" width="22" height="22" rx="4"/><rect x="66" y="12" width="22" height="22" rx="4"/><rect x="38" y="30" width="22" height="22" rx="4" transform="rotate(18 49 41)"/><rect x="14" y="52" width="22" height="22" rx="4" transform="rotate(-24 25 63)"/><rect x="62" y="62" width="22" height="22" rx="4" transform="rotate(35 73 73)"/></g></svg>');
  const WIN_FIRE = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="14" fill="#0d1030"/><g stroke-width="4" stroke-linecap="round"><g stroke="#ffd54a"><path d="M36 38v-14M36 38v14M36 38h-14M36 38h14M36 38l-10-10M36 38l10 10M36 38l-10 10M36 38l10-10"/></g><g stroke="#ff4f8b"><path d="M68 64v-11M68 64v11M68 64h-11M68 64h11M68 64l-8-8M68 64l8 8M68 64l-8 8M68 64l8-8"/></g><g stroke="#29a8ff"><path d="M72 26v-7M72 26v7M72 26h-7M72 26h7"/></g></g></svg>');

  const NEON_S = ['body.skin-sudoku-neon #gameScreen', '#shopScreen .pv-sk-neon'];
  const NEON_CSS = ['255,61,242','41,168,255','255,154,31','53,224,74','255,79,139','255,167,38','47,224,106','255,92,154','47,180,255']
    .map((c, k) => NEON_S.map(S => `\n${S} .cell[data-n="${k+1}"],${S} .num-btn:nth-child(${k+1}),${S} .notes .note:nth-child(${k+1}){--nc:${c}}`).join('')).join('')
    + NEON_S.map(S => `
${S} .num-btn{color:rgba(var(--nc),.14);-webkit-text-stroke:1.4px rgb(var(--nc));text-shadow:none;border-color:rgb(var(--nc));box-shadow:0 0 0 1px rgb(var(--nc)),0 0 10px rgba(var(--nc),.5),inset 0 0 8px rgba(var(--nc),.2);font-family:${FONT_NEON}}
${S} .num-btn small{-webkit-text-stroke:0;color:rgb(var(--nc));text-shadow:none}`).join('');

  const SD_SKIN_RULES = {
    neon: {
      num: `color:transparent!important;font-family:${FONT_NEON};font-weight:800;-webkit-text-stroke:1.6px rgb(var(--nc,#29a8ff));text-shadow:0 0 8px rgba(var(--nc,#29a8ff),.6)`,
      sel: 'border-color:#29a8ff!important;box-shadow:0 0 10px rgba(41,168,255,.5)'
    },
    lapiz: {
      num: `color:#3d4350!important;font-family:${FONT_LAPIZ};font-weight:700;font-size:1.15em`,
      sel: 'border-color:#7a5200!important;background:#fff8c9!important'
    },
    oro: {
      num: `color:#f6d36b!important;font-family:${FONT_ORO};font-weight:900;-webkit-text-stroke:0.5px #7a5200;text-shadow:0 1px 2px #0008`,
      sel: 'border-color:#c79a1e!important;box-shadow:0 0 8px rgba(199,154,30,.4)'
    },
    caoba: {
      num: `color:#e8b88a!important;font-family:${FONT_CAOBA};font-weight:800;-webkit-text-stroke:0.5px #221109;text-shadow:0 1px 1px #0007`,
      sel: 'border-color:#8a4b2a!important;box-shadow:0 0 8px rgba(138,75,42,.4)'
    }
  };

  const sdCss = (id, r) => [`body.skin-sudoku-${id} #gameScreen`, `#shopScreen .pv-sk-${id}`].map(S => `
${S} .cell:not(.given):not(.wrong):not(.sk-bad){${r.num}}
${S} .cell.selected{${r.sel}}`).join('');

  const SD_CSS = Object.entries(SD_SKIN_RULES).map(([id, r]) => sdCss(id, r)).join('') + NEON_CSS;

  const SD_SND = { neon: 'neon', lapiz: 'pencil', oro: 'gold', caoba: 'caoba' };

  function watchBoard() {
    const b = document.getElementById('board'); if (!b) return;
    let prev = [];
    new MutationObserver(() => {
      const cur = [...b.children].map(c => c.textContent.trim() || (c.classList.contains('given') ? 'g' : ''));
      const cells = [...b.children];
      cells.forEach(c => {
        const v = c.textContent.trim();
        if (v && /^[1-9]$/.test(v)) c.dataset.n = v; else delete c.dataset.n;
      });
      const id = Skins.active('sudoku');
      if (id && SD_SND[id] && prev.length) {
        const ch = [];
        for (let i = 0; i < 81; i++) if (cur[i] && cur[i] !== 'g' && cur[i] !== prev[i]) ch.push(i);
        if (ch.length === 1) {
          try { window.SudomiSound && SudomiSound.play(SD_SND[id]); } catch (_) {}
        }
      }
      prev = cur;
    }).observe(b, { childList: true });
  }

  const SKINS = [
    { id: 'neon', cat: 'sudoku', pv: 'sudoku', game: 'sudoku', gameName: 'Números', name: 'Neón', price: 150, desc: 'Tus números brillan en azul neón y el teclado se vuelve oscuro con luces.', preview: SD_NEON },
    { id: 'lapiz', cat: 'sudoku', pv: 'sudoku', game: 'sudoku', gameName: 'Números', name: 'A lápiz', price: 120, desc: 'Tus números salen escritos a mano, como en el periódico, y el teclado son papelitos amarillos.', preview: SD_LAPIZ },
    { id: 'oro', cat: 'sudoku', pv: 'sudoku', game: 'sudoku', gameName: 'Números', name: 'Oro', price: 200, desc: 'Tus números van en dorado con letra elegante y el teclado es negro con oro.', preview: SD_ORO },
    { id: 'caoba', cat: 'sudoku', pv: 'sudoku', game: 'sudoku', gameName: 'Números', name: 'Caoba', price: 180, desc: 'Madera fina y artesanal. Números cálidos y teclado tallado en madera noble.', preview: SD_CAOBA },
    // Win animations
    { id: 'flag', cat: 'win', pv: 'win', game: 'sudokuwin', gameName: 'Victoria', name: 'Bandera Dominicana', price: 200, desc: 'Al completar el sudoku, el tablero se pinta como la bandera dominicana, casilla por casilla.', preview: [WIN_FLAG] },
    { id: 'fall', cat: 'win', pv: 'win', game: 'sudokuwin', gameName: 'Victoria', name: 'Derrumbe', price: 150, desc: 'Al completar el sudoku, las casillas se sueltan y caen del tablero con física relajante.', preview: [WIN_FALL] },
    { id: 'fireworks', cat: 'win', pv: 'win', game: 'sudokuwin', gameName: 'Victoria', name: 'Fuegos artificiales', price: 250, desc: 'Al completar el sudoku, el tablero brilla en dorado y estallan fuegos artificiales.', preview: [WIN_FIRE] }
  ];

  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(SKEY));
      return { own: Array.isArray(v && v.own) ? v.own : [], on: (v && v.on && typeof v.on === 'object') ? v.on : {} };
    } catch (_) { return { own: [], on: {} }; }
  };

  const write = v => {
    try { localStorage.setItem(SKEY, JSON.stringify(v)); } catch (_) {}
    apply();
    try { window.dispatchEvent(new CustomEvent('sudomi-shop-skins')); } catch (_) {}
  };

  const onList = (v, game) => {
    const x = v.on[game];
    return (Array.isArray(x) ? x : x ? [x] : []).filter(id => v.own.includes(id));
  };

  let roll = {};
  const Skins = {
    list: () => SKINS.slice(),
    owns: id => read().own.includes(id),
    mix: game => onList(read(), game),
    active: game => {
      const L = onList(read(), game);
      if (L.length < 2) return L[0] || '';
      if (!L.includes(roll[game])) roll[game] = L[Math.random() * L.length | 0];
      return roll[game];
    },
    pick: game => {
      const L = onList(read(), game);
      roll[game] = L[Math.random() * L.length | 0] || '';
      return roll[game];
    },
    reroll() { roll = {}; apply(); },
    buy(id) {
      const s = SKINS.find(x => x.id === id), v = read();
      if (!s || v.own.includes(id)) return false;
      if (!Coins.spend(s.price)) return false;
      v.own.push(id);
      v.on[s.game] = [id];
      write(v);
      return true;
    },
    equip(id, on) {
      const s = SKINS.find(x => x.id === id), v = read();
      if (!s || !v.own.includes(id)) return false;
      const L = onList(v, s.game).filter(x => x !== id);
      v.on[s.game] = on ? [id] : L;
      if (!v.on[s.game].length) delete v.on[s.game];
      delete roll[s.game];
      write(v);
      return true;
    },
    add(id) {
      const s = SKINS.find(x => x.id === id), v = read();
      if (!s || !v.own.includes(id)) return false;
      const L = onList(v, s.game);
      if (!L.includes(id)) L.push(id);
      v.on[s.game] = L;
      delete roll[s.game];
      write(v);
      return true;
    }
  };

  window.addEventListener('sudomi-win', () => setTimeout(() => Skins.reroll(), 4500));

  function apply() {
    let st = document.getElementById('sudomiSkinCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'sudomiSkinCss';
      st.textContent = SD_CSS;
      document.head.appendChild(st);
    }
    SKINS.forEach(s => document.body.classList.toggle(`skin-${s.game}-${s.id}`, Skins.active(s.game) === s.id));
  }

  // Categories: Sudoku-focused
  const CATS = [
    ['all', 'Todo'],
    ['sudoku', 'Números y Tablero'],
    ['win', 'Animaciones de Victoria'],
    ['chars', 'Personajes y Avatares']
  ];
  let cat = 'all', pvId = '';

  const bgi = u => `style="background-image:${u.replace(/"/g, '&quot;')}"`;

  function pvHTML(s) {
    const P = s.preview;
    if (s.pv === 'sudoku') {
      const box = [[5, 1], [7, 0], [3, 0], [4, 0], [8, 1], [6, 0], [9, 0], [2, 1], [0, 2]];
      return `<div class="shop-stage pv-sudoku pv-sk-${s.id}">
        <div class="pv-sbox">${box.map(([n, k]) => k === 2 ? `<span class="cell"><span class="notes">${[1,2,3,4,5,6,7,8,9].map(m => `<span class="note${m===4||m===7?' on':''}">${m===4||m===7?m:''}</span>`).join('')}</span></span>` : `<span class="cell${k ? ' given' : ''}"${k ? '' : ` data-n="${n}"`}>${n}</span>`).join('')}</div>
        <div class="pv-spad">${[1, 2, 3, 4, 5].map(n => `<span class="num-btn${n===5?' exhausted':''}">${n}<small>${n===5?9:n+2}/9</small></span>`).join('')}</div>
        <div class="pv-stools"><span class="tool active">✎ Notas</span><span class="tool">⌫ Borrar</span><span class="tool">💡 Pista</span></div>
        <em class="pv-snote">Los números negros son los fijos: esos no cambian.</em>
      </div>`;
    }
    if (s.pv === 'win') return `<div class="shop-stage pv-win" data-win="${s.id}"></div>`;
    if (s.pv === 'char') return `<div class="shop-stage pv-char"><i ${bgi(s.full)}></i></div>`;
    return `<div class="shop-stage pv-img"><i ${bgi(P[0])}></i></div>`;
  }

  function open(c) {
    if (c && CATS.some(x => x[0] === c)) cat = c;
    const S = window.SudomiScreen; if (!S) return;
    S.open('shopScreen', 'Tienda SUDOMI', (body, api) => {
      const coins = Coins.get();
      const charItem = s => {
        const own = s.free || Skins.owns(s.id), on = window.SudomiProfile && SudomiProfile.avatar() === s.av, can = coins >= s.price;
        const btns = !own ? `<button type="button" class="shop-btn buy" data-buy="${s.id}" ${can ? '' : 'disabled'}>${coinSvg()} ${s.price}</button>` : on ? '' : `<button type="button" class="shop-btn" data-use="${s.av}">Usar</button>`;
        return `<div class="shop-item pj${on ? ' on' : ''}">
          <button type="button" class="shop-prev g-avatar" data-pv="${s.id}" aria-label="Ver ${s.name}"><i ${bgi(s.preview[0])}></i><em>👁 Ver</em></button>
          <div class="shop-txt"><small>${s.gameName}</small><b>${s.name}</b><p>${s.desc}</p></div>${btns}
          ${own ? `<em class="shop-tag">${on ? 'Puesto' : s.free ? 'Gratis' : 'Comprado'}</em>` : can ? '' : `<em class="shop-tag miss">Te faltan ${s.price - coins}</em>`}
        </div>`;
      };
      const item = s => {
        if (s.cat === 'chars') return charItem(s);
        const own = Skins.owns(s.id), mix = Skins.mix(s.game), on = mix.includes(s.id), can = coins >= s.price;
        const btns = !own ? `<button type="button" class="shop-btn buy" data-buy="${s.id}" ${can ? '' : 'disabled'}>${coinSvg()} ${s.price}</button>`
          : on ? `<button type="button" class="shop-btn alt" data-eq="${s.id}" data-on="0">Quitar</button>`
          : `<span class="shop-btns"><button type="button" class="shop-btn" data-eq="${s.id}" data-on="1">${mix.length ? 'Cambiar' : 'Usar'}</button>${mix.length ? `<button type="button" class="shop-btn mixb" data-add="${s.id}" title="Se suma a las que tienes puestas y sale al azar">🎲 Al azar</button>` : ''}</span>`;
        return `<div class="shop-item${on ? ' on' : ''}">
          <button type="button" class="shop-prev g-${s.game}" data-pv="${s.id}" aria-label="Ver ${s.name}">${s.preview.map(u => `<i ${bgi(u)}></i>`).join('')}<em>👁 Ver</em></button>
          <div class="shop-txt"><small>${s.gameName}</small><b>${s.name}</b><p>${s.desc}</p></div>
          ${btns}
          ${own ? `<em class="shop-tag">${on ? 'Puesta' : 'Comprada'}</em>` : can ? '' : `<em class="shop-tag miss">Te faltan ${s.price - coins}</em>`}
        </div>`;
      };

      const groups = CATS.slice(1).filter(c => cat === 'all' || c[0] === cat).map(c => {
        const L = SKINS.filter(s => s.cat === c[0]);
        return L.length ? `<h3 class="shop-h">${c[1]} <small>${L.filter(s => s.free || Skins.owns(s.id)).length}/${L.length}</small></h3><div class="shop-list">${L.map(item).join('')}</div>` : '';
      }).join('');

      const pv = SKINS.find(s => s.id === pvId);
      body.innerHTML = `<div class="shop-bank">${coinSvg()}<div><b>${coins.toLocaleString('es')}</b><small>monedas</small></div>${window.SudomiAdmin ? '<button type="button" class="shop-btn gift-btn" data-redeem>🎁 Canjear código</button>' : ''}</div>
        <p class="shop-how">Ganas <b>${DAILY_COINS} monedas</b> al completar el <b>Sudoku del día</b> y cumpliendo logros.</p>
        <div class="shop-cats" role="tablist">${CATS.map(c => `<button type="button" role="tab" aria-selected="${cat === c[0]}" class="shop-cat${cat === c[0] ? ' on' : ''}" data-cat="${c[0]}">${c[1]}</button>`).join('')}</div>
        ${groups}
        <p class="shop-how small">Tus monedas y compras se guardan seguras en tu perfil.</p>
        ${pv ? `<div class="shop-pv" role="dialog" aria-label="Vista previa de ${pv.name}"><div class="shop-pvcard"><small>${[(CATS.find(c => c[0] === pv.cat) || [0, ''])[1], pv.gameName].filter((x, k, a) => x && a.indexOf(x) === k).join(' · ')}</small><b>${pv.name}</b>${pvHTML(pv)}<p>${pv.desc}</p><button type="button" class="shop-btn alt" data-pvx>Cerrar</button></div></div>` : ''}`;

      body.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
        const s = SKINS.find(x => x.id === b.dataset.buy);
        if (Skins.buy(b.dataset.buy)) {
          if (s && s.av) useChar(s.av);
          api.redraw();
        }
      });
      body.querySelectorAll('[data-use]').forEach(b => b.onclick = () => { useChar(b.dataset.use); api.redraw(); });
      body.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { Skins.equip(b.dataset.eq, b.dataset.on === '1'); api.redraw(); });
      body.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { Skins.add(b.dataset.add); api.redraw(); });
      body.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { cat = b.dataset.cat; api.redraw(); });
      const rd = body.querySelector('[data-redeem]'); if (rd) rd.onclick = () => SudomiAdmin.redeem();
      body.querySelectorAll('[data-pv]').forEach(b => b.onclick = () => { pvId = b.dataset.pv; api.redraw(); });
      const ov = body.querySelector('.shop-pv');
      if (ov) {
        ov.onclick = ev => { if (ev.target === ov || ev.target.closest('[data-pvx]')) { pvId = ''; api.redraw(); } };
        const wb = ov.querySelector('[data-win]'); if (wb) demoWin(wb, wb.dataset.win);
      }
    });
  }

  // Win animation on completion
  const WIN_HOLD = 2400, WIN_HOLD_SKIN = 3800, WIN_FX = { flag: 1, fall: 1, fireworks: 1 };
  function winAnim(id, cells, side, rect) {
    const mid = (side - 1) / 2, FX = window.SudomiFX;
    try { window.SudomiSound && SudomiSound.play('w' + id); } catch (_) {}
    cells.forEach((c, i) => {
      const r = Math.floor(i / side), k = i % side;
      c.classList.remove('wfx-flag', 'wfx-fall', 'wfx-gold');
      void c.offsetWidth;
      if (id === 'flag') {
        const cross = r === mid || k === mid;
        c.style.setProperty('--wc', cross ? '#ffffff' : (r < mid) === (k < mid) ? '#002d62' : '#ce1126');
        c.style.setProperty('--wt', cross ? '#10213b' : '#ffffff');
        c.style.setProperty('--wd', (r + k) * 55 + 'ms');
        c.classList.add('wfx-flag');
        const wt = cross ? '#10213b' : '#ffffff', d = (r + k) * 55;
        setTimeout(() => c.style.setProperty('color', wt, 'important'), d + 420);
        setTimeout(() => c.style.removeProperty('color'), d + 2900);
      } else if (id === 'fall') {
        c.style.setProperty('--wd', Math.round(k * 45 + Math.random() * 400) + 'ms');
        c.style.setProperty('--wr', Math.round(Math.random() * 120 - 60) + 'deg');
        c.style.setProperty('--wy', Math.round(rect.height * (1.05 - r / side) + 35) + 'px');
        c.classList.add('wfx-fall');
      } else {
        c.style.setProperty('--wd', Math.round(Math.hypot(r - mid, k - mid) * 110) + 'ms');
        c.classList.add('wfx-gold');
      }
    });
    if (id === 'fireworks' && FX && FX.sparks) {
      const C = ['#ffd54a', '#ff4f8b', '#29a8ff', '#35e04a', '#ffffff', '#ff9a1f'];
      for (let n = 0; n < 8; n++) {
        const x = rect.left + rect.width * (0.12 + Math.random() * 0.76),
          y = rect.top + rect.height * (0.1 + Math.random() * 0.6);
        try { FX.sparks(x, y, 24, [C[n % C.length], '#ffffff', C[(n + 2) % C.length]], 200 + n * 350, 1.5); } catch (_) {}
      }
    }
    setTimeout(() => cells.forEach(c => c.classList.remove('wfx-flag', 'wfx-fall', 'wfx-gold')), 3800);
  }

  function winHold() {
    const m = document.getElementById('modal'), b = document.getElementById('board'); if (!m) return;
    const id = Skins.pick('sudokuwin'), on = !!WIN_FX[id];
    if (on && b && b.children.length === 81) {
      setTimeout(() => { if (b.children.length === 81) winAnim(id, [...b.children], 9, b.getBoundingClientRect()); }, 200);
    }
    m.classList.add('win-wait');
    const show = () => { m.classList.remove('win-wait'); document.removeEventListener('pointerdown', skip, true); };
    const skip = () => setTimeout(show, 0);
    setTimeout(() => document.addEventListener('pointerdown', skip, true), 350);
    setTimeout(show, on ? WIN_HOLD_SKIN : WIN_HOLD);
  }

  window.addEventListener('sudomi-win', winHold);

  function demoWin(box, id) {
    if (!box) return; const side = 5;
    box.innerHTML = Array.from({ length: side * side }, (_, i) => `<span class="cell${i % 3 ? '' : ' given'}">${(i * 7 + 3) % 9 + 1}</span>`).join('');
    const loop = () => {
      if (!box.isConnected) return;
      winAnim(id, [...box.children], side, box.getBoundingClientRect());
      setTimeout(loop, 4600);
    };
    setTimeout(loop, 400);
  }

  const CHAR_PRICE = 300;
  function charItems() {
    try {
      ((window.SudomiAvatarArt && SudomiAvatarArt.chars) || []).filter(c => !SKINS.some(x => x.id === 'pj-' + c.key)).forEach(c => {
        SKINS.push({
          id: 'pj-' + c.key, av: c.id, cat: 'chars', pv: 'char', game: 'avatar', gameName: 'Personaje',
          name: c.name, price: CHAR_PRICE, free: c.free,
          desc: 'Tu foto de perfil y avatar de carrera multijugador.',
          preview: [`url("${c.img}")`], full: `url("${c.full}")`
        });
      });
    } catch (_) {}
  }

  function useChar(av) {
    const P = window.SudomiProfile; if (!P) return;
    if (!P.get()) { P.edit(); return; }
    P.set(P.name(), av);
    try {
      if (window.SudomiAccount && SudomiAccount.signedIn() && window.SudomiCloud) {
        SudomiCloud.api('POST', 'account', { avatar: av }).catch(() => {});
      }
    } catch (_) {}
  }

  const boot = () => {
    charItems(); apply(); watchBoard();
    const sm = document.getElementById('openShopMenu'), hs = document.getElementById('homeShop');
    if (sm) sm.onclick = () => open();
    if (hs) hs.onclick = () => open();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.SudomiCoins = Coins;
  window.SudomiShopSkins = Skins;
  window.SudomiShop = { open };
})();
