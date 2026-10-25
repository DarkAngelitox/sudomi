/* SUDOMI 0.2.78 — avatares especiales: DRAGONES (solo para el nombre «Madeline» / «Madelin»).
 * El perfil guarda el avatar como un texto corto (por ejemplo '🐲👑'; así funciona en todos los juegos y salas, aunque no esté este archivo).
 * Aquí, cada vez que uno de esos textos aparece en pantalla, se cambia por la imagen del dragón (carpeta img/dragones/, 7 siluetas en azul).
 * Los textos son de 4 caracteres o menos para que las salas y la lista de amigos no los recorten.
 * Solo se pueden ELEGIR en el editor de perfil cuando el nombre es Madeline (ver js/profile.js).
 * Para cambiar o agregar un dragón: poner el PNG en img/dragones/, agregarlo a LIST aquí y a SHELL en sw.js. */
(() => {
  const FILE = n => 'img/dragones/dragon' + n + '.png';
  const LIST = [
    { id: '🐲👑', name: 'Dragón de perfil', img: FILE(1) },
    { id: '🐉⚡', name: 'Dragón de melena', img: FILE(2) },
    { id: '🐉🌑', name: 'Dragón alado', img: FILE(3) },
    { id: '🐉🪶', name: 'Dragón de contorno', img: FILE(4) },
    { id: '🐉🔥', name: 'Dragón de contorno con melena', img: FILE(5) },
    { id: '🐉🗡', name: 'Dragón de frente', img: FILE(6) },
    { id: '🐉🛡', name: 'Dragón en pie', img: FILE(7) }
  ];
  // 0.2.82: iconos solo para el nombre «Yukiri» / «Yukiry» (carpeta img/yukiri/). No salen en la fila de dragones.
  // 0.3.98 (Fase 9.2): eran imágenes de un personaje de anime con derechos de autor; ahora son dibujos propios (yukiri1-3.svg), mismo estilo y mismas ideas
  const YUKI = [
    { id: '🌸🗡', name: 'Yukiri: espadachina', img: 'img/yukiri/yukiri1.svg', pic: 1 },
    { id: '🌸🌈', name: 'Yukiri: espada en alto', img: 'img/yukiri/yukiri2.svg', pic: 1 },
    { id: '🌸🌿', name: 'Yukiri: pradera', img: 'img/yukiri/yukiri3.svg', pic: 1 }
  ];
  // 0.2.84: logo SUDOMI solo para el nombre «Maicolino» / «Maicolinno» (carpeta img/maicolino/)
  // 0.2.89: el logo se rehízo redondo, dibujado en SVG (logo.svg), y se agregó la cara con rizos (cara.png, recorte redondo)
  const MAICO = [
    { id: '🎩🎲', name: 'Logo SUDOMI', img: 'img/maicolino/logo.svg', pic: 1 },
    { id: '🎩💎', name: 'Maicolino', img: 'img/maicolino/cara.png', pic: 1 }
  ];
  // 0.2.88: fotos solo para el nombre «Pollo Chan» / «Pollo-Chan» (carpeta img/pollo/)
  const POLLO = [
    { id: '🐔✏', name: 'Pollo Chan: dibujo', img: 'img/pollo/pollo1.png', pic: 1 },
    { id: '🐔🔥', name: 'Pollo Chan: gallo', img: 'img/pollo/pollo2.png', pic: 1 }
  ];
  const SETS = { yuki: YUKI, maico: MAICO, pollo: POLLO };   // conjuntos con nombre propio; js/profile.js decide qué nombre abre cada uno
  const DRAGON_LIST = LIST.slice(); Object.values(SETS).forEach(set => set.forEach(y => LIST.push(y)));
  /* 0.3.105 (dueño) — PERSONAJES 3D (hechos con Gemini; Personajes/procesar.py los recorta). Cada uno es una foto de perfil como las demás
   * (código corto 🎮 + un emoji: cabe en los 4 caracteres de las salas) y en la sala de espera sale de cuerpo entero (js/lobby.js).
   * img/personajes/<key>-cara.webp = retrato redondo · <key>.webp = cuerpo entero sin fondo.
   * FREE: los que tiene todo el mundo; los demás se compran en la Tienda (js/shop.js, objeto 'pj-<key>'). Para uno nuevo: una línea aquí y sus dos archivos en SHELL de sw.js. */
  const CHARS = [
    ['explorador', '🧭', 'Explorador'], ['guerrera', '🥋', 'Guerrera mística'], ['robot', '🤖', 'Robot'], ['hechicera', '🔮', 'Hechicera'],
    ['cibernetico', '👾', 'Chico cibernético'], ['cyberchica', '🦾', 'Chica cibernética'], ['pirata', '🏴', 'Pirata'], ['vikingo', '🪓', 'Vikingo'],
    ['aviadora', '🪂', 'Aviadora'], ['elfo', '🌿', 'Elfo del bosque'], ['cientifica', '🧪', 'Científica'], ['pelotero', '⚾', 'Pelotero'],
    ['bachatero', '🎶', 'Bachatero'], ['mecanico', '🔧', 'Mecánico'], ['boxeador', '🥊', 'Boxeador'], ['vaquero', '🤠', 'Vaquero'],
    ['arquera', '🏹', 'Arquera'], ['caballero', '🏰', 'Caballero'], ['inventora', '🔩', 'Inventora'], ['monje', '🧘', 'Monje'], ['bardo', '🎻', 'Bardo']
  ].map(([key, e, name]) => ({ id: '🎮' + e, key, name, img: 'img/personajes/' + key + '-cara.webp', full: 'img/personajes/' + key + '.webp', pic: 1 }));
  const FREE = ['explorador', 'guerrera'];
  CHARS.forEach(c => LIST.push(c));
  const charOf = id => CHARS.find(c => c.id === id) || null;
  // si este teléfono lo tiene: gratis o comprado (se lee lo guardado por la tienda; profile.js carga antes que shop.js)
  const charOwned = id => { const c = charOf(id); if (!c) return false; if (FREE.includes(c.key)) return true; try { const v = JSON.parse(localStorage.getItem('sudomi-shop-skins')); return !!(v && Array.isArray(v.own) && v.own.includes('pj-' + c.key)) } catch (_) { return false } };
  const inSet = id => Object.values(SETS).some(set => set.some(y => y.id === id)) || !!charOf(id);   // los personajes tampoco son dragones
  // nombres antiguos (0.2.72–0.2.77): se siguen reconociendo y muestran el dragón más parecido, pero ya no se ofrecen
  const LEGACY = { '🐉🔩': FILE(3) };
  const BY_ID = Object.fromEntries(LIST.map(d => [d.id, d]));
  const IDS = LIST.map(d => d.id).concat(Object.keys(LEGACY));
  const imgOf = id => (BY_ID[id] ? BY_ID[id].img : LEGACY[id]) || LIST[0].img;
  const nameOf = id => (BY_ID[id] ? BY_ID[id].name : 'Dragón');
  const html = id => '<img src="' + imgOf(id) + '" alt="" draggable="false" decoding="async">';
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, TITLE: 1 };
  // un solo patrón que reconoce cualquiera de los dragones
  const RX = new RegExp('(' + IDS.join('|') + ')', 'g');

  function swapText(node) {
    const v = node.nodeValue; if (!v) return; RX.lastIndex = 0; if (!RX.test(v)) return;
    const p = node.parentNode; if (!p || SKIP[p.nodeName] || (p.closest && p.closest('[contenteditable="true"],input,textarea'))) return;
    const frag = document.createDocumentFragment(), parts = v.split(RX);   // con grupo de captura: los textos y los dragones se alternan
    parts.forEach(txt => {
      if (!txt) return;
      if (IDS.includes(txt)) { const s = document.createElement('span'); s.className = 'av-dragon' + (BY_ID[txt] && BY_ID[txt].pic ? ' av-pic' : ''); s.setAttribute('role', 'img'); s.setAttribute('aria-label', nameOf(txt)); s.innerHTML = html(txt); frag.appendChild(s) }
      else frag.appendChild(document.createTextNode(txt));
    });
    p.replaceChild(frag, node);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) return swapText(root);
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [];
    while (tw.nextNode()) { RX.lastIndex = 0; if (RX.test(tw.currentNode.nodeValue)) list.push(tw.currentNode) }
    list.forEach(swapText);
  }
  function start() {
    walk(document.body);
    new MutationObserver(ms => { for (const m of ms) { if (m.type === 'childList') m.addedNodes.forEach(walk); else if (m.type === 'characterData') swapText(m.target) } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  window.SudomiAvatarArt = { DRAGON: IDS[0], ids: IDS, list: DRAGON_LIST.map(d => ({ id: d.id, name: d.name })), yuki: YUKI.map(d => ({ id: d.id, name: d.name })), html, sets: Object.fromEntries(Object.entries(SETS).map(([k, v]) => [k, v.map(d => ({ id: d.id, name: d.name }))])), has: id => IDS.includes(id) && !inSet(id), hasYuki: id => YUKI.some(y => y.id === id),
    chars: CHARS.map(c => ({ id: c.id, key: c.key, name: c.name, img: c.img, full: c.full, free: FREE.includes(c.key) })), char: charOf, charOwned };
})();
