/* SUDOMI 0.2.25 — player profile (window.SudomiProfile): a name and an avatar, saved on this device.
 * Used by the sudoku (greeting + win message), DOS and the two-player online games (the other player sees your name).
 * Opened from "Menú → Perfil", from the avatar button in the top bars, or by itself the first time you play online.
 */
(()=>{
 const KEY='sudomi-profile',OLD_NAME='sudomi-player-name';
 /* 0.3.69 (dueño): más fotos de perfil, CARAS de animales y de personas (en la Mesa 3D del dominó el avatar es la cabeza del muñeco, y una cara queda mejor).
  * Son emojis de un solo símbolo: las salas recortan el avatar a 4 caracteres, así que no valen los compuestos (tonos de piel, familias…).
  * El primero de ANIMALS sigue siendo el zorro: es el avatar por defecto. */
 const ANIMALS=['🦊','🐼','🦉','🐯','🐸','🐵','🦄','🐙','🐶','🐱','🐰','🐨','🦁','🐧','🐢','🦜','🐻','🐷','🐮','🐭','🐹','🐺','🐴','🐔'];
 const PEOPLE=['👦','👧','👨','👩','🧑','🧔','👱','👴','👵','👶','🤠','😎','🤓','🥳','😇','🤡'];
 const AVATARS=ANIMALS.concat(PEOPLE);
 const esc=t=>String(t).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const clean=n=>String(n||'').replace(/\s+/g,' ').trim().slice(0,14);
 // avatares especiales: los dragones. Solo se pueden elegir si el nombre es Madeline (los dibujos los pone js/avatar-art.js)
 const DRAGONS=()=>window.SudomiAvatarArt&&SudomiAvatarArt.list?SudomiAvatarArt.list:[{id:'🐲👑',name:'Dragón con corona'}];
 const isDragon=a=>window.SudomiAvatarArt&&SudomiAvatarArt.has?SudomiAvatarArt.has(a):DRAGONS().some(d=>d.id===a);
 const isMadeline=n=>/^madel(ine|in)$/i.test(clean(n).normalize('NFD').replace(/[\u0300-\u036f]/g,''));
 // 0.2.82: iconos de Yukiri, solo si el nombre es Yukiri o Yukiry (mayúsculas o minúsculas)
 // 0.2.84: lo mismo para Maicolino / Maicolinno (logo SUDOMI). Para otro nombre: una línea más aquí y su conjunto en js/avatar-art.js
 const SPECIAL=[{set:'yuki',rx:/^yukir[iy]$/i},{set:'maico',rx:/^maicolinn?o$/i},{set:'pollo',rx:/^pollo[ -]?chan$/i}];   // 0.2.88: Pollo Chan / Pollo-Chan
 const plain=n=>clean(n).normalize('NFD').replace(/[̀-ͯ]/g,'');
 const setList=s=>(window.SudomiAvatarArt&&SudomiAvatarArt.sets&&SudomiAvatarArt.sets[s])||[];
 const inSet=(s,a)=>setList(s).some(d=>d.id===a);
 // 0.3.105: personajes 3D (js/avatar-art.js): los dos gratis y los comprados en la tienda
 const CHARS=()=>(window.SudomiAvatarArt&&SudomiAvatarArt.chars)||[];
 const ownChar=a=>!!(window.SudomiAvatarArt&&SudomiAvatarArt.charOwned&&SudomiAvatarArt.charOwned(a));
 const okAvatar=(a,name)=>AVATARS.includes(a)||ownChar(a)||(isDragon(a)&&isMadeline(name))||SPECIAL.some(s=>s.rx.test(plain(name))&&inSet(s.set,a));
 function read(){
  try{
   const p=JSON.parse(localStorage.getItem(KEY));
   if(p&&clean(p.name))return {name:clean(p.name),avatar:okAvatar(p.avatar,p.name)?p.avatar:AVATARS[0]};
   const old=clean(localStorage.getItem(OLD_NAME));                 // name typed in DOS before profiles existed
   if(old)return {name:old,avatar:AVATARS[0],guess:true};
  }catch(_){}
  return null;
 }
 let profile=read();
 function save(name,avatar){
  profile={name:clean(name),avatar:okAvatar(avatar,name)?avatar:AVATARS[0]};
  try{localStorage.setItem(KEY,JSON.stringify(profile));localStorage.setItem(OLD_NAME,profile.name)}catch(_){}
  paint();window.dispatchEvent(new CustomEvent('sudomi-profile',{detail:profile}));
 }

 /* ----- editor ----- */
 let box=null;
 function closeEditor(){if(box){box.remove();box=null}}
 // opts.then: called after a successful save · opts.reason: short line shown on top (e.g. why it is being asked)
 function edit(opts={}){
  // 0.3.103 (dueño): con el servidor a la vista, el perfil ES la cuenta (registro completo, js/account.js). Sin servidor, este editor de siempre.
  if(!opts.local&&window.SudomiAccount&&SudomiAccount.enabled())return SudomiAccount.open(opts);
  closeEditor();
  let chosen=(profile&&profile.avatar)||AVATARS[Math.floor(Math.random()*AVATARS.length)];
  // 0.3.102 (dueño): UNA sola pantalla «Tu cuenta»: nombre y avatar arriba, y debajo la cuenta del servidor (js/cloud.js, panel()).
  // Cuando se abre solo para pedir un nombre antes de jugar online (opts.then), la cuenta no sale, para no liar.
  const withCloud=false;   // 0.3.103: la cuenta ya no va aquí (js/account.js); este editor queda solo para cuando no hay servidor
  box=document.createElement('div');box.className='prof-over';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Tu cuenta');
  box.innerHTML=`<div class="prof-card"><button class="prof-x" type="button" aria-label="Cerrar">✕</button><p class="prof-kicker">${withCloud?'TU CUENTA':'TU PERFIL'}</p><h2>${profile&&!profile.guess?'Edita tu perfil':'Crea tu perfil'}</h2>${opts.reason?`<p class="prof-reason">${esc(opts.reason)}</p>`:''}
   <div class="prof-preview"><span class="prof-big">${chosen}</span><b>${esc((profile&&profile.name)||'Tu nombre')}</b></div>
   <label class="prof-label" for="profName">Nombre <small>(así te verán los demás jugadores)</small></label>
   <input id="profName" maxlength="14" autocomplete="nickname" spellcheck="false" placeholder="Escribe tu nombre" value="${esc((profile&&profile.name)||(withCloud&&SudomiCloud.account&&SudomiCloud.account())||'')}">
   <p class="prof-label">Elige tu avatar</p>
   <div class="prof-avatars" id="profAvatars">${[['Personajes',CHARS().filter(c=>ownChar(c.id)).map(c=>c.id)],['Animales',ANIMALS],['Personas',PEOPLE]].map(([t,l])=>`<p class="prof-sub">${t}</p>`+l.map(a=>`<button type="button" data-av="${a}" class="${a===chosen?'on':''}" aria-label="Avatar ${a}">${a}</button>`).join('')).join('')}</div>
   <p class="prof-err" id="profErr"></p>
   <div class="prof-actions"><button class="prof-save" type="button">Guardar</button><button class="prof-cancel" type="button">Cancelar</button></div>
   ${withCloud?'<div class="prof-cloud"><p class="prof-label">Cuenta y nube</p><div id="profCloud"></div></div>':''}</div>`;
  document.body.appendChild(box);
  const input=box.querySelector('#profName'),big=box.querySelector('.prof-big'),label=box.querySelector('.prof-preview b');
  const grid=box.querySelector('#profAvatars');
  const bindAv=b=>b.onclick=()=>{chosen=b.dataset.av;big.textContent=chosen;box.querySelectorAll('[data-av]').forEach(x=>x.classList.toggle('on',x===b))};
  const syncSpecial=()=>{   // los dragones aparecen solo si el nombre es Madeline
   const has=grid.querySelector('.prof-dragons:not(.prof-yuki)'),want=isMadeline(input.value);
   if(want&&!has){
    const row=document.createElement('div');row.className='prof-dragons';row.innerHTML='<p>Solo para ti</p>'+DRAGONS().map(d=>`<button type="button" data-av="${d.id}" class="${d.id===chosen?'on':''}" aria-label="${esc(d.name)}" title="${esc(d.name)}">${d.id}</button>`).join('');
    grid.insertBefore(row,grid.firstChild);row.querySelectorAll('[data-av]').forEach(bindAv)}
   else if(!want&&has){has.remove();if(isDragon(chosen)){chosen=AVATARS[0];big.textContent=chosen;const f=grid.querySelector('[data-av]');if(f)f.classList.add('on')}}
   SPECIAL.forEach(s=>{   // 0.2.82 / 0.2.84: lo mismo para Yukiri y para Maicolino
    const cls='prof-set-'+s.set,hasY=grid.querySelector('.'+cls),wantY=s.rx.test(plain(input.value))&&setList(s.set).length>0;
    if(wantY&&!hasY){
     const row=document.createElement('div');row.className='prof-dragons prof-yuki '+cls;row.innerHTML='<p>Solo para ti</p>'+setList(s.set).map(d=>`<button type="button" data-av="${d.id}" class="${d.id===chosen?'on':''}" aria-label="${esc(d.name)}" title="${esc(d.name)}">${d.id}</button>`).join('');
     grid.insertBefore(row,grid.firstChild);row.querySelectorAll('[data-av]').forEach(bindAv)}
    else if(!wantY&&hasY){hasY.remove();if(inSet(s.set,chosen)){chosen=AVATARS[0];big.textContent=chosen;const f=grid.querySelector('[data-av]');if(f)f.classList.add('on')}}
   });
  };
  input.oninput=()=>{label.textContent=clean(input.value)||'Tu nombre';syncSpecial()};
  box.querySelectorAll('[data-av]').forEach(bindAv);syncSpecial();
  const done=()=>{
   const n=clean(input.value);
   if(n.length<2){box.querySelector('#profErr').textContent='Escribe un nombre de al menos 2 letras.';input.focus();return}
   save(n,chosen);closeEditor();if(opts.then)opts.then(profile);
  };
  box.querySelector('.prof-save').onclick=done;
  if(withCloud)SudomiCloud.panel(box.querySelector('#profCloud'),{
   name:()=>clean(input.value),
   onName:n=>{input.value=clean(n);label.textContent=clean(n);syncSpecial();save(clean(n),chosen)}   // el nombre del perfil pasa a ser el de la cuenta
  });
  input.onkeydown=e=>{if(e.key==='Enter')done()};
  box.querySelector('.prof-x').onclick=box.querySelector('.prof-cancel').onclick=closeEditor;
  box.onclick=e=>{if(e.target===box)closeEditor()};
  setTimeout(()=>input.focus(),50);
 }
 // run fn with a real profile; ask for one first if this device has none yet
 function ensure(fn,reason){
  // 0.3.103 (dueño): para jugar en línea hace falta la cuenta (el mismo formulario de registro). Sin servidor, basta el perfil de este teléfono.
  if(window.SudomiAccount&&SudomiAccount.enabled()){if(SudomiAccount.signedIn()&&profile&&!profile.guess)return fn(profile);return SudomiAccount.open({then:()=>fn(profile),reason:'Para jugar en línea, crea tu cuenta o entra con la tuya.'})}
  if(profile&&!profile.guess)fn(profile);else edit({then:fn,reason:reason||'Antes de jugar con otras personas, elige cómo te van a ver.'})}

 /* ----- what is shown on the pages ----- */
 function chip(extra){const b=document.createElement('button');b.type='button';b.className='prof-chip '+(extra||'');b.onclick=e=>{e.stopPropagation();edit()};return b}
 function paint(){
  document.querySelectorAll('.prof-chip').forEach(b=>{
   b.innerHTML=profile?`<span>${profile.avatar}</span><b>${esc(profile.name)}</b>`:'<span>👤</span><b>Crear perfil</b>';
   b.title=profile?'Editar tu perfil':'Crea tu perfil';b.setAttribute('aria-label',b.title);
  });
  const hello=document.getElementById('profHello');
  if(hello)hello.innerHTML=profile?`¡Hola, <b>${esc(profile.name)}</b>! ${profile.avatar}`:'';
  // the Perfil item of the home menu stops being "En desarrollo"
  document.querySelectorAll('.feature-option[data-feature="Perfil"] small').forEach(s=>{s.textContent=profile?esc(profile.name):'Crear'});
 }
 function mount(){
  const home=document.querySelector('.home-topbar .theme-toggle')||document.querySelector('.home-topbar .dom-chip');
  if(home)home.parentNode.insertBefore(chip(),home);
  const games=document.querySelector('.mini-games-header .theme-toggle')||document.querySelector('.mini-games-header .games-brand-mark');
  if(games)games.parentNode.insertBefore(chip(),games);
  const copy=document.querySelector('.hero-copy');
  if(copy&&!document.getElementById('profHello')){const p=document.createElement('p');p.id='profHello';p.className='prof-hello';copy.insertBefore(p,copy.querySelector('h1'))}
  const item=document.querySelector('.feature-option[data-feature="Perfil"]');
  if(item)item.onclick=e=>{e.stopPropagation();const m=document.getElementById('homeDropdown');if(m)m.classList.add('hidden');edit()};   // replaces "Función en desarrollo"
  paint();
 }
 // theme.js adds its buttons on DOMContentLoaded too; wait one tick so the profile button sits next to it
 const start=()=>setTimeout(mount,0);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();

 window.SudomiProfile={
  get:()=>profile&&!profile.guess?{...profile}:null,
  name:()=>profile?profile.name:'',
  safeName:()=>profile?esc(profile.name):'',
  avatar:()=>profile?profile.avatar:'',
  avatars:AVATARS.slice(),
  validAvatar:a=>AVATARS.includes(a)||isDragon(a),
  edit,ensure,
  // 0.3.103: para la pantalla de la cuenta (js/account.js)
  set:(n,a)=>save(n,a),
  avatarsFor:n=>({chars:CHARS().filter(c=>ownChar(c.id)),locked:CHARS().filter(c=>!ownChar(c.id)).length,animals:ANIMALS,people:PEOPLE,special:(isMadeline(n)?DRAGONS():[]).concat(...SPECIAL.filter(s=>s.rx.test(plain(n))).map(s=>setList(s.set)))}),
  ok:(a,n)=>okAvatar(a,n)
 };
})();
