/* Shared local interactions and animations. No runtime imports or remote requests.
 * References: Eldora UI FadeText / WordPullUpText; Morphicons spring behavior
 * with Heroicons menu geometry. Vanilla adaptations for this static project.
 */
(() => {
 'use strict';
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const menu = document.querySelector('.menu');
 const nav = document.querySelector('#navigation');
 const paths = menu ? [...menu.querySelectorAll('.menu-morph path')] : [];
 const closed = [[3.75,6.75,20.25,6.75],[3.75,12,20.25,12],[3.75,17.25,20.25,17.25]];
 const opened = [[5.25,5.25,18.75,18.75],[12,12,12,12],[5.25,18.75,18.75,5.25]];
 let progress=0,velocity=0,target=0,frame=0,last=0;
 function drawMorph(){paths.forEach((p,i)=>{const coords=closed[i].map((v,j)=>v+(opened[i][j]-v)*progress);p.setAttribute('d','M'+coords[0]+' '+coords[1]+'L'+coords[2]+' '+coords[3]); if(i===1)p.style.opacity=String(Math.max(0,1-progress));});}
 function tick(now){const dt=Math.min((now-(last||now-16))/1000,.032);last=now;velocity+=((target-progress)*220-velocity*24)*dt;progress+=velocity*dt;drawMorph(); if(Math.abs(target-progress)>.001||Math.abs(velocity)>.001){frame=requestAnimationFrame(tick);}else{progress=target;velocity=0;frame=0;last=0;drawMorph();}}
 function morph(open){target=open?1:0;if(reduce.matches){cancelAnimationFrame(frame);frame=0;progress=target;velocity=0;drawMorph();}else if(!frame){last=0;frame=requestAnimationFrame(tick);}}
 function setMenu(open,restore=false){if(!menu||!nav)return;nav.classList.toggle('visible',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');morph(open);if(restore)menu.focus();}
 menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')setMenu(false,true);});
 document.addEventListener('pointerdown',e=>{if(menu?.getAttribute('aria-expanded')==='true'&&!e.target.closest('header'))setMenu(false);});
 matchMedia('(min-width:1261px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});
 const page=location.pathname.split('/').pop()||'index.html';
 nav?.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')===page)a.setAttribute('aria-current','page');});
 // Square sleeves: static readable cards without JS; a manual fan when enhanced.
 document.querySelectorAll('.sleeve-deck').forEach(deck=>{
  const cards=[...deck.querySelectorAll('.sleeve-card')];if(!cards.length)return;
  const section=deck.closest('section');const status=section.querySelector('[data-deck-status]');let active=0,startX=0,startY=0;
  function show(next){active=(next+cards.length)%cards.length;cards.forEach((card,i)=>{let slot=(i-active+cards.length)%cards.length;if(slot>cards.length/2)slot-=cards.length;card.style.setProperty('--slot',String(slot));card.toggleAttribute('data-active',i===active);card.setAttribute('aria-hidden',String(i!==active));card.toggleAttribute('inert',i!==active);});status.textContent=(active+1)+' из '+cards.length+' · '+cards[active].querySelector('h3').textContent.trim();}
  deck.classList.add('deck-ready');show(0);
  section.querySelector('[data-deck-prev]')?.addEventListener('click',()=>show(active-1));
  section.querySelector('[data-deck-next]')?.addEventListener('click',()=>show(active+1));
  deck.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(active+(e.key==='ArrowRight'?1:-1));}});
  deck.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;});
  deck.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))show(active+(dx<0?1:-1));});
 });
 document.querySelectorAll('[data-folder]').forEach(folder=>{
  const toggle=folder.querySelector('.folder-front'),files=folder.querySelector('.folder-files');
  function setOpen(open,restore=false){folder.toggleAttribute('data-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть папку документов':'Открыть папку документов');files.toggleAttribute('inert',!open);if(open)files.querySelector('a')?.focus({preventScroll:true});else if(restore)toggle.focus({preventScroll:true});}
  toggle.addEventListener('click',()=>setOpen(!folder.hasAttribute('data-open')));
  folder.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false,true);}});
  document.addEventListener('pointerdown',e=>{if(folder.hasAttribute('data-open')&&!folder.contains(e.target))setOpen(false);});
 });
 // Semantic text stays in its original element; wrapping never replaces a heading.
 function splitWords(el){if(el.dataset.wordsReady)return;el.dataset.wordsReady='true';const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.nodeValue.trim()&&!node.parentElement.closest('svg,.visually-hidden,.motion-word')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);let index=0;nodes.forEach(node=>{const frag=document.createDocumentFragment();node.nodeValue.split(/(\s+)/).forEach(token=>{if(!token.trim()){frag.append(document.createTextNode(token));return;}const span=document.createElement('span');span.className='motion-word';span.textContent=token;span.style.setProperty('--word-delay',Math.min(index++*40,650)+'ms');frag.append(span);});node.replaceWith(frag);});}
 function wrapNumbers(el){const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(node){return /\d/.test(node.nodeValue)&&!node.parentElement.closest('.motion-number,svg')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const frag=document.createDocumentFragment();node.nodeValue.split(/(\d+(?:[–.,]\d+)*)/).forEach(token=>{if(/^\d/.test(token)){const span=document.createElement('span');span.className='motion-number';span.textContent=token;frag.append(span);}else frag.append(document.createTextNode(token));});node.replaceWith(frag);});}
 document.querySelectorAll('h2,h3,h4,.eyebrow,.stage-top,.index,.module-number').forEach(wrapNumbers);
 const textTargets=[...document.querySelectorAll('h1,main p:not(.caption):not(.document-fallback),.hero li,.tags span')].filter(el=>!el.closest('.merch-word-card,.folder-sheet'));
 textTargets.forEach(el=>{splitWords(el);el.classList.add('motion-text');});
 document.querySelectorAll('.button,.text-button,.nav-cta,.back-link').forEach(button=>{
  [...button.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.nodeValue.trim()).forEach(node=>{const label=document.createElement('span');label.className='button-label';label.textContent=node.nodeValue;node.replaceWith(label);splitWords(label);});button.classList.add('motion-button');
 });
 const cardTargets=[...document.querySelectorAll('.benefits > div,.stage,.result-card,.format-grid .card,.organizer-link,.equipment-tile,.future-grid > article,#modules > details,.document-folder,.sleeve-deck')];
 cardTargets.forEach((card,index)=>{card.classList.add('motion-card');card.style.setProperty('--motion-delay',(index%3)*75+'ms');});
 const targets=[...textTargets,...cardTargets,...document.querySelectorAll('.motion-number')];
 let io;
 if(!reduce.matches&&'IntersectionObserver' in window){io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-entering');io.unobserve(entry.target);}}),{threshold:0,rootMargin:'0px 0px -12px 0px'});targets.forEach(el=>io.observe(el));}
 reduce.addEventListener('change',()=>{if(reduce.matches){io?.disconnect();targets.forEach(el=>el.classList.remove('is-entering'));morph(target===1);}});
})();
