/* SUDOMI 0.2.53 — "Configuración": one place for every setting, plus the information screens that a published app needs
 * (Privacidad, Términos, Acerca de) and a way to erase everything. Most rows only call things that already exist (theme, styles, sound,
 * level lock, backup, tutorial, sync). Optional contact data can be set in window.SUDOMI_CONFIG = {supportUrl, contactEmail}
 * (js/online-config.js is a good place); with no values the "Apoyar" and "Contacto" lines are hidden. */
(()=>{
 const S=window.SudomiScreen;if(!S)return;
 const CFG=Object.assign({supportUrl:'',contactEmail:''},window.SUDOMI_CONFIG||{});
 const $=(b,s)=>b.querySelector(s);
 const version=()=>(document.title.match(/[\d.]+/)||['?'])[0];
 const seg=(name,items,cur)=>`<div class="cust-seg" role="group" data-seg="${name}">${items.map(([v,l])=>`<button type="button" data-v="${v}" class="${v===cur?'on':''}" aria-pressed="${v===cur}">${l}</button>`).join('')}</div>`;
 /* SUDOMI 1.0 (solo Sudoku, sin internet): textos legales. No hay cuentas, servidor, salas ni cámara: todo se queda en el teléfono.
    Pensados para la Ley 172-13 (RD), el RGPD y la COPPA. No son asesoría legal: que los revise un abogado antes de las tiendas.
    La misma versión está publicada en privacidad.html (la pide Google Play): si cambias uno, cambia el otro. */
 const PRIVACY=`<p class="st-note"><b>Versión del 25 de octubre de 2026.</b> Aquí contamos qué datos usa SUDOMI, para qué y qué puedes hacer con ellos.</p>
 <h3 class="ach-group">Todo se queda en tu teléfono</h3><p class="st-note">SUDOMI no tiene cuentas ni servidor. Tu progreso (nombre y foto de perfil, nivel, logros, estadísticas, partidas, compras de la tienda y ajustes) se guarda <b>solo en tu dispositivo</b>. No lo recibimos, no lo vendemos y no lo compartimos con nadie.</p>
 <h3 class="ach-group">Sin publicidad ni rastreo</h3><p class="st-note">No hay anuncios, ni rastreadores, ni cookies de seguimiento, ni estadísticas de uso. No pedimos nombre real, correo, teléfono, ubicación ni fecha de nacimiento.</p>
 <h3 class="ach-group">Internet</h3><p class="st-note">El juego funciona sin internet. Solo se conecta para descargar el propio juego, sus actualizaciones y el idioma que elijas. Como en cualquier página web, el sitio donde está alojado el juego puede ver la dirección de internet del teléfono al descargarlo.</p>
 <h3 class="ach-group">Niños</h3><p class="st-note">Como no se recoge ningún dato personal, SUDOMI se puede usar a cualquier edad. Tu nombre de perfil es un apodo que no sale de tu teléfono.</p>
 <h3 class="ach-group">Copias de seguridad</h3><p class="st-note">Si exportas una copia, el archivo es tuyo: SUDOMI no lo recibe. Quien tenga el archivo puede ver tu progreso, así que guárdalo con cuidado.</p>
 <h3 class="ach-group">Borrar tus datos</h3><p class="st-note">Puedes borrarlo todo cuando quieras desde Configuración → «Borrar mi progreso», o desinstalando la app.</p>
 <h3 class="ach-group">Contacto</h3><p class="st-note">Para cualquier duda${CFG.contactEmail?', escríbenos a '+CFG.contactEmail:', escríbele al responsable de SUDOMI desde la página donde descargaste el juego'}.</p>`;
 const TERMS=`<p class="st-note"><b>Versión del 25 de octubre de 2026.</b> SUDOMI es un juego de Sudoku para entretenerte y practicar lógica. Se ofrece «tal cual», sin garantías. Puedes usarlo e instalarlo libremente para uso personal.</p>
 <h3 class="ach-group">Monedas y tienda</h3><p class="st-note">Las monedas del juego se ganan jugando. No tienen valor fuera de SUDOMI, no se cambian por dinero ni por nada, y si borras tus datos o desinstalas la app se pierden.</p>
 <h3 class="ach-group">Juego limpio</h3><p class="st-note">No intentes modificar el juego para hacer trampas ni lo copies para distribuirlo como tuyo.</p>
 <p class="st-note">Los textos, dibujos y personajes del juego son originales de DarkAngelitox Studio; el Sudoku es un juego de dominio público. Podemos cambiar o quitar funciones en futuras versiones y te avisaremos si cambian estos textos. Si tienes dudas, escríbenos${CFG.contactEmail?': '+CFG.contactEmail:''}.</p>`;
function textScreen(id,title,html){S.open(id,title,body=>{body.innerHTML=html})}
 function open(){
  S.open('settingsScreen','⚙️ Configuración',(body,api)=>{
   const dark=window.SudomiTheme&&SudomiTheme.current==='dark',snd=window.SudomiSound?SudomiSound.cfg:{sound:true,vibe:true,vol:.6},lock=window.SudomiXP?SudomiXP.lock:true,info=window.SudomiBackup?SudomiBackup.info():{version:version(),offline:false};
   const I=window.SudomiI18n,cur=I?I.lang():'es';
   const langGroup=I?`<h3 class="ach-group">Idioma</h3><div class="cust-group" data-no-i18n><div class="cust-seg lang-seg" role="group" data-seg="lang">${Object.keys(I.names).map(k=>`<button type="button" data-v="${k}" class="${k===cur?'on':''}" aria-pressed="${k===cur}">${I.names[k]}</button>`).join('')}</div></div>`:'';
   body.innerHTML=`${langGroup}<h3 class="ach-group">Apariencia</h3>
   <div class="cust-group">${seg('theme',[['light','☀️ Claro'],['dark','🌙 Oscuro']],dark?'dark':'light')}<button type="button" class="set-row" id="setStyle"><span>🎨</span><div><b>Estilo y colores</b><small>Navidad, Anime, Galaxia, tamaño de números…</small></div><i>›</i></button></div>
   <h3 class="ach-group">Sonido y vibración</h3>
   <div class="cust-group">${seg('sound',[['on','🔊 Sonido'],['off','🔇 Silencio']],snd.sound?'on':'off')}<div style="height:6px"></div>${seg('vibe',[['on','📳 Vibración'],['off','▫️ Sin vibrar']],snd.vibe?'on':'off')}<div style="height:6px"></div><b class="set-l">Sonidos del estilo (cada estilo del juego suena distinto)</b>${seg('themed',[['on','🎶 Del estilo'],['off','🎵 Clásicos']],snd.themed!==false?'on':'off')}<div style="height:6px"></div><b class="set-l">Efectos especiales (confeti y destellos al completar)</b>${seg('fx',[['on','✨ Activados'],['off','▫️ Apagados']],window.SudomiFX&&!SudomiFX.on?'off':'on')}<label class="cust-vol"><span>Volumen</span><input type="range" id="setVol" min="0" max="100" value="${Math.round(snd.vol*100)}"><button type="button" id="setTest">Probar</button></label></div>
   <h3 class="ach-group">Juego</h3>
   <div class="cust-group"><b class="set-l">Pantallas al abrir la app (logo y animación de SUDOMI)</b>${seg('splash',[['on','✨ Con intro'],['off','⏩ Sin intro']],(()=>{try{return localStorage.getItem('sudomi-splash')==='off'?'off':'on'}catch(_){return 'on'}})())}<div style="height:6px"></div><b class="set-l">Dificultades por nivel</b>${seg('lock',[['on','🔒 Se desbloquean'],['off','🔓 Todas abiertas']],lock?'on':'off')}
    <button type="button" class="set-row" id="setTut"><span>📘</span><div><b>Tutorial</b><small>Aprende a jugar paso a paso</small></div><i>›</i></button>
    <button type="button" class="set-row" id="setCoach"><span>🧑‍🏫</span><div><b>Maestro Sudomi</b><small>Consejos según cómo juegas</small></div><i>›</i></button></div>
   <h3 class="ach-group">Mis datos</h3>
   <div class="cust-group">
    <button type="button" class="set-row" id="setExport"><span>📤</span><div><b>Exportar copia de seguridad</b><small>Guarda tu progreso en un archivo</small></div><i>›</i></button>
    <button type="button" class="set-row" id="setImport"><span>📥</span><div><b>Importar copia</b><small>Recupera tu progreso desde un archivo</small></div><i>›</i></button><input type="file" id="setFile" accept=".json,application/json" hidden>
    <button type="button" class="set-row" id="setUpdate"><span>🔄</span><div><b>Buscar actualización</b><small>${info.offline?'Listo para jugar sin internet ✓':'Preparando el modo sin internet…'}</small></div><i>›</i></button></div>
   <h3 class="ach-group">Información</h3>
   <div class="cust-group"><button type="button" class="set-row" id="setPriv"><span>🔒</span><div><b>Privacidad</b><small>Qué guarda SUDOMI y qué no</small></div><i>›</i></button>
    <button type="button" class="set-row" id="setTerms"><span>📄</span><div><b>Términos de uso</b></div><i>›</i></button>
    <button type="button" class="set-row" id="setAbout"><span>🇩🇴</span><div><b>Acerca de SUDOMI</b><small>Versión ${version()}</small></div><i>›</i></button>
    ${CFG.supportUrl?'<a class="set-row" id="setSupport" href="'+CFG.supportUrl+'" target="_blank" rel="noopener"><span>💙</span><div><b>Apoyar a SUDOMI</b><small>Ayúdanos a seguir creciendo</small></div><i>›</i></a>':''}</div>
   <h3 class="ach-group">Zona delicada</h3>
   <div class="cust-group"><button type="button" class="set-row danger" id="setWipe"><span>🗑️</span><div><b>Borrar mi progreso</b><small>Elimina todo lo guardado en este dispositivo</small></div></button><p class="cust-sub" id="setMsg"></p></div>`;
   const say=t=>{const e=$(body,'#setMsg');if(e)e.textContent=t};
   body.querySelectorAll('[data-seg] button').forEach(b=>b.onclick=()=>{
    const k=b.parentNode.dataset.seg,v=b.dataset.v;
    if(k==='lang'){if(window.SudomiI18n&&v!==SudomiI18n.lang())SudomiI18n.setLang(v);return}
    if(k==='theme'){if((v==='dark')!==(window.SudomiTheme&&SudomiTheme.current==='dark'))SudomiTheme.toggle()}
    else if(k==='sound'){if(window.SudomiSound){SudomiSound.set({sound:v==='on'});if(v==='on')SudomiSound.test()}}
    else if(k==='themed'){if(window.SudomiSound){SudomiSound.set({themed:v==='on'});SudomiSound.test()}}
    else if(k==='vibe'){if(window.SudomiSound){SudomiSound.set({vibe:v==='on'});if(v==='on'&&navigator.vibrate)navigator.vibrate(40)}}
    else if(k==='fx'){if(window.SudomiFX){SudomiFX.set(v==='on');if(v==='on')SudomiFX.demo()}}
    else if(k==='lock'){if(window.SudomiXP)SudomiXP.setLock(v==='on')}
     else if(k==='splash'){try{localStorage.setItem('sudomi-splash',v)}catch(_){}}   // 0.3.102: pantallas al abrir (js/splash.js)
    b.parentNode.querySelectorAll('button').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
   });
   const vol=$(body,'#setVol');if(vol){vol.oninput=()=>SudomiSound.set({vol:vol.value/100});vol.onchange=()=>SudomiSound.test();$(body,'#setTest').onclick=()=>SudomiSound.test()}
   $(body,'#setStyle').onclick=()=>{S.close('settingsScreen');if(window.SudomiCustomize)SudomiCustomize.open()};
   $(body,'#setTut').onclick=()=>{S.close('settingsScreen');if(window.SudomiTutorial)SudomiTutorial.open()};
   $(body,'#setCoach').onclick=()=>{S.close('settingsScreen');if(window.SudomiCoach)SudomiCoach.open()};
   
   $(body,'#setExport').onclick=async()=>{const r=await SudomiBackup.export();say(r==='shared'?'Copia compartida. Guárdala en Archivos o envíatela.':r==='downloaded'?'Copia descargada (revisa tus descargas).':r==='copied'?'La copia se copió al portapapeles.':r==='cancel'?'':'No se pudo exportar la copia.')};
   const f=$(body,'#setFile');$(body,'#setImport').onclick=()=>f.click();f.onchange=async()=>{const file=f.files&&f.files[0];if(!file)return;const r=await SudomiBackup.import(file);if(r&&r.message)say(r.message);f.value=''};
   $(body,'#setUpdate').onclick=async()=>{say('Buscando…');const r=await SudomiBackup.checkUpdate();say(r==='waiting'?'Hay una versión nueva: toca «Actualizar» en el aviso.':r==='latest'?'Ya tienes la última versión.':'No se pudo comprobar (¿sin internet?).')};
   $(body,'#setPriv').onclick=()=>textScreen('privScreen','🔒 Privacidad',PRIVACY);
   $(body,'#setTerms').onclick=()=>textScreen('termsScreen','📄 Términos de uso',TERMS);
   $(body,'#setAbout').onclick=()=>textScreen('aboutScreen','🇩🇴 Acerca de SUDOMI',`<div class="ab-card"><div class="ab-logo">SUDOMI</div><p>Sudoku con sabor dominicano.<br><em>Hecho con lógica. Jugado con amor.</em></p><small>Versión ${version()}</small></div><p class="st-note">SUDOMI reúne el sudoku, 19 juegos de mesa y de cartas, retos diarios, logros, multijugador online y sin internet, y un maestro que te ayuda a mejorar.</p>${CFG.contactEmail?'<p class="st-note">Contacto: '+CFG.contactEmail+'</p>':''}`);
   let armed=false;const wipe=$(body,'#setWipe');
   wipe.onclick=()=>{
    if(!armed){armed=true;wipe.classList.add('armed');$(wipe,'b').textContent='¿Seguro? Toca otra vez para borrar todo';setTimeout(()=>{armed=false;if(wipe.isConnected){wipe.classList.remove('armed');$(wipe,'b').textContent='Borrar mi progreso'}},4000);return}
    try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('sudomi-'))ks.push(k)}ks.forEach(k=>localStorage.removeItem(k))}catch(_){}
    location.href=location.pathname;
   };
  });
 }
 function boot(){const b=document.getElementById('openSettings'),dd=document.getElementById('homeDropdown');if(b)b.onclick=()=>{dd.classList.add('hidden');const t=document.getElementById('homeMenuBtn');if(t)t.setAttribute('aria-expanded','false');open()}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 window.SudomiSettings={open,privacy:()=>textScreen('privScreen','🔒 Privacidad',PRIVACY),terms:()=>textScreen('termsScreen','📄 Términos de uso',TERMS)};   // 0.3.103: los abre el registro
})();
