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
 function setMenu(open,restore=false){if(!menu||!nav)return;nav.classList.toggle('visible',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');morph(open);if(!open)document.querySelectorAll('.nav-dropdown').forEach(d=>d.open=false);if(restore)menu.focus();}
 menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')setMenu(false,true);});
 document.addEventListener('pointerdown',e=>{if(menu?.getAttribute('aria-expanded')==='true'&&!e.target.closest('header'))setMenu(false);});
 matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});
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
 const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
 dropdowns.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)dropdowns.forEach(other=>{if(other!==d)other.open=false;});}));
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.glass-nav'))dropdowns.forEach(d=>d.open=false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(d=>{if(d.open){d.open=false;d.querySelector('summary').focus();}});});
 document.querySelectorAll('[data-support-feature]').forEach(root=>{
  const tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
  function select(i,focus=false){tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===i));tab.tabIndex=n===i?0:-1;panels[n].hidden=n!==i;});if(focus)tabs[i].focus();}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();select(n,true);});});root.classList.add('tabs-ready');select(0);
 });
 // Wrap direct text only: preserve native form values, SVG geometry and semantic elements.
 const skip='script,style,svg,progress,textarea,select,option,input,code,pre,template,[aria-hidden="true"],.visually-hidden,.section-title,.motion-word,.merch-word,.brand,.mockup,.idea-art,.sketches';
 document.querySelectorAll('button,a,summary,label,legend,.benefits>div').forEach(el=>{if(el.closest(skip))return;[...el.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim()).forEach(n=>{const span=document.createElement('span');span.className='text-label';span.textContent=n.nodeValue;n.replaceWith(span);});});
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.nodeValue.trim()&&!n.parentElement.closest(skip)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);const owners=new Set();
 nodes.forEach(n=>{const el=n.parentElement,frag=document.createDocumentFragment();let i=0;n.nodeValue.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(document.createTextNode(word));return;}const span=document.createElement('span');span.className='motion-word';span.textContent=word;span.style.setProperty('--word-delay',Math.min(i++*35,420)+'ms');frag.append(span);});n.replaceWith(frag);owners.add(el);});
 owners.forEach(el=>el.classList.add('motion-text'));
 document.querySelectorAll('button,.button,.nav-cta,.back-link').forEach(el=>el.classList.add('motion-button'));
 const cards=[...document.querySelectorAll('.benefits>div,.stage,.result-card,.format-grid .card,.organizer-link,.goal-card,.progress-card,.support-facts>div,.partner-invitation,#modules>details,.document-folder,.sleeve-deck')];cards.forEach((el,i)=>{el.classList.add('motion-card');el.style.setProperty('--motion-delay',(i%3)*60+'ms');});
 const labels=[...document.querySelectorAll('.brand,.section-title')];labels.forEach(el=>el.classList.add('motion-label'));
 const targets=[...owners,...cards,...labels];let io;
 if(!reduce.matches&&'IntersectionObserver' in window){io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-entering');io.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -8px 0px'});targets.forEach(el=>io.observe(el));}
 reduce.addEventListener('change',()=>{if(reduce.matches){io?.disconnect();targets.forEach(el=>el.classList.remove('is-entering'));morph(target===1);}});
})();

