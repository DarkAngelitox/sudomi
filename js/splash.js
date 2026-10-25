/* SUDOMI 0.3.104 (dueño) — PANTALLAS AL ABRIR LA APP (dentro de la web: así salen igual en la APK, en el iPhone y en el navegador).
 *   1. «DarkAngelitox Studio» (~1,3 s): un ángel oscuro sobre un escudo; las alas se abren, se enciende el halo y sale un destello.
 *   2. SUDOMI (~2,5 s): el tablero del logo se llena y alrededor van saliendo los juegos que hay (la lista del arcade, window.SudomiGameList,
 *      más el Sudoku, la Aventura y los Acertijos), así un juego nuevo sale solo.
 * Un toque la salta. Sale al abrir la app: no al volver a ella, ni al recargar en la misma visita (la nube a veces recarga sola), ni al
 * entrar por un enlace de sala o de regalo (para no tardar en unirse). Se apaga en Configuración → Juego. «Reducir movimiento»: un fundido.
 * Va al principio de <body> para tapar la portada desde el primer momento. El logo suelto está también en img/studio/darkangelitox.svg. */
(()=>{
 let off=false,seen=false;
 try{off=localStorage.getItem('sudomi-splash')==='off';seen=sessionStorage.getItem('sudomi-splash-seen')==='1';sessionStorage.setItem('sudomi-splash-seen','1')}catch(_){}
 if(off||seen||/[?&](room|regalo|game|action)=/.test(location.search))return;
 const calm=(()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(_){return false}})();
 const WING='M96 92C80 70 52 52 18 50c10 8 16 16 18 24-10-2-20 0-28 6 14 2 24 8 30 16-10 2-18 8-22 16 14-2 26 0 36 8-6 6-8 14-8 22 14-10 30-14 46-12z';
 const LOGO=`<svg class="spl-svg" viewBox="0 0 200 200" aria-hidden="true">
  <defs><linearGradient id="splNeon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b14cff"/><stop offset="1" stop-color="#3cc8ff"/></linearGradient>
   <radialGradient id="splGlow"><stop offset="0" stop-color="#9b5cff" stop-opacity=".55"/><stop offset="1" stop-color="#9b5cff" stop-opacity="0"/></radialGradient>
   <filter id="splBlur"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
  <circle cx="100" cy="100" r="96" fill="url(#splGlow)" class="spl-aura"/>
  <path d="M100 18l64 22v52c0 44-28 76-64 92-36-16-64-48-64-92V40z" fill="#110b22" stroke="url(#splNeon)" stroke-width="4"/>
  <g class="spl-wing l"><path d="${WING}" fill="#07050f" stroke="url(#splNeon)" stroke-width="2.500" stroke-linejoin="round"/><path d="M90 92C70 76 50 66 30 62M88 100C68 90 46 86 26 88M88 110C70 106 52 108 38 116" stroke="#3cc8ff" stroke-width="1.200" fill="none" opacity=".8"/></g>
  <g transform="translate(200 0) scale(-1 1)"><g class="spl-wing r"><path d="${WING}" fill="#07050f" stroke="url(#splNeon)" stroke-width="2.500" stroke-linejoin="round"/><path d="M90 92C70 76 50 66 30 62M88 100C68 90 46 86 26 88M88 110C70 106 52 108 38 116" stroke="#b14cff" stroke-width="1.200" fill="none" opacity=".8"/></g></g>
  <path d="M100 84c-14 0-22 10-24 26l-8 50h64l-8-50c-2-16-10-26-24-26z" fill="#1a1230" stroke="#3a2a66" stroke-width="2"/>
  <path d="M86 70c0-12 6-20 14-20s14 8 14 20c0 9-6 16-14 16s-14-7-14-16z" fill="#221838"/>
  <path d="M84 72c2-16 9-24 16-24s14 8 16 24c-4-8-10-12-16-12s-12 4-16 12z" fill="#0b0816"/>
  <path d="M92 70l5 2M108 70l-5 2" stroke="#d6a8ff" stroke-width="2.600" stroke-linecap="round" class="spl-eyes"/>
  <ellipse cx="100" cy="38" rx="20" ry="5.500" fill="none" stroke="#ffd84a" stroke-width="3" class="spl-halo"/>
  <ellipse cx="100" cy="38" rx="20" ry="5.500" fill="none" stroke="#ffd84a" stroke-width="6" filter="url(#splBlur)" class="spl-halo"/>
  <path d="M100 118l6 14h-12z" fill="url(#splNeon)" opacity=".9"/>
 </svg>`;
 const el=document.createElement('div');el.id='splash';el.className='spl'+(calm?' calm':'');el.setAttribute('role','presentation');
 el.innerHTML=`<div class="spl-studio">${LOGO}<b class="spl-name">DARKANGELITOX</b><span class="spl-sub">STUDIO</span><i class="spl-flash"></i></div>
  <div class="spl-sudomi"><div class="spl-ring"></div><div class="spl-board">${[5,3,'',6,'',9,'',1,4].map((n,i)=>`<span style="--i:${i}">${n}</span>`).join('')}</div><b class="spl-title">SUDOMI</b><small class="spl-tag">Sudoku con sabor dominicano</small></div>
  <p class="spl-skip">Toca para saltar</p>`;
 const put=()=>{(document.body||document.documentElement).appendChild(el)};
 if(document.body)put();else document.addEventListener('DOMContentLoaded',put);
 let done=false;const T=[];
 const finish=()=>{if(done)return;done=true;T.forEach(clearTimeout);el.classList.add('out');setTimeout(()=>el.remove(),calm?200:450)};
 const ring=()=>{
  // SUDOMI 1.0 (solo Sudoku): alrededor salen los modos del Sudoku, no los juegos del arcade
  const list=[{icon:'🔢',name:'Sudoku'},{icon:'📅',name:'Sudoku del día'},{icon:'👨‍🏫',name:'Modo Profesor'},{icon:'🧠',name:'Entrenamiento'},{icon:'🏁',name:'Carrera'},{icon:'🏆',name:'Logros'},{icon:'🧑‍🏫',name:'Maestro Sudomi'},{icon:'🎨',name:'Skins'}];
  const R=el.querySelector('.spl-ring'),n=list.length;
  R.innerHTML=list.map((g,i)=>{const a=i/n*Math.PI*2-Math.PI/2;return `<i style="--x:${(Math.cos(a)*42).toFixed(1)}vmin;--y:${(Math.sin(a)*42).toFixed(1)}vmin;--d:${Math.round(i*(1400/n))}ms" title="${g.name}">${g.icon}</i>`}).join('');
 };
 el.addEventListener('click',finish);
 // 0.3.104: el reloj empieza cuando la página ya cargó y se pintó. Antes contaba desde aquí, y en el iPad los ~60 scripts de
 // después tardan segundos en cargar: los tiempos se cumplían sin que se viera nada y las dos pantallas pasaban de golpe.
 // Cada paso cuenta desde el anterior, así un tirón tampoco se come una pantalla.
 const after=(ms,f)=>T.push(setTimeout(()=>{if(!done)f()},calm?ms*.6:ms));
 const go=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{if(done)return;
  el.classList.add('s1');
  after(1440,()=>{ring();el.classList.add('s2');after(2700,finish)});
 }));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go,{once:true});else go();
 after(15000,finish);   // por si algo se traba: nunca se queda tapando la app
})();
