/* Continuous local carousel: no registry, CDN or runtime requests. */
(() => {
 'use strict';
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const cards=document.querySelectorAll('.bento-goal,.project-xp');const enter=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-card','is-entering');enter.unobserve(e.target);}}));cards.forEach(el=>enter.observe(el));}
 const root=document.querySelector('[data-support-carousel]');if(!root)return;
 const viewport=root.querySelector('.carousel-window'),track=root.querySelector('.support-track'),group=root.querySelector('.support-group');
 const pause=root.querySelector('[data-carousel-pause]'),prev=root.querySelector('[data-carousel-prev]'),next=root.querySelector('[data-carousel-next]');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let anim,clone,paused=false,hovered=false,focused=false,visible=true,span=0,startX=0,startTime=0;
 function sync(){if(!anim)return;if(paused||hovered||focused||!visible||document.hidden)anim.pause();else anim.play();}
 function configure(){
  const oldTime=anim?.currentTime||0;anim?.cancel();clone?.remove();
  root.classList.toggle('carousel-ready',!reduce.matches);pause.disabled=reduce.matches;
  if(reduce.matches){anim=null;pause.textContent='Без анимации';return;}
  pause.textContent=paused?'Продолжить':'Пауза';
  clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.setAttribute('inert','');clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));track.append(clone);
  span=group.getBoundingClientRect().width;
  anim=track.animate([{transform:'translateX(0)'},{transform:`translateX(-${span}px)`}],{duration:span/30*1000,iterations:Infinity,easing:'linear'});
  anim.currentTime=oldTime%(span/30*1000);sync();
 }
 function move(direction){
  const step=group.querySelector('article').getBoundingClientRect().width+16;
  if(reduce.matches){viewport.scrollBy({left:direction*step,behavior:'instant'});return;}
  const duration=span/30*1000;anim.currentTime=((anim.currentTime||0)+direction*step/30*1000+duration)%duration;sync();
 }
 pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Продолжить':'Пауза';sync();});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;sync();}});root.addEventListener('pointerleave',()=>{hovered=false;sync();});
 root.addEventListener('focusin',()=>{focused=true;sync();});root.addEventListener('focusout',()=>requestAnimationFrame(()=>{focused=root.contains(document.activeElement);sync();}));
 viewport.addEventListener('pointerdown',e=>{if(reduce.matches)return;startX=e.clientX;startTime=anim.currentTime||0;hovered=true;sync();});
 viewport.addEventListener('pointerup',e=>{if(reduce.matches)return;const dx=e.clientX-startX;if(Math.abs(dx)>25){const duration=span/30*1000;anim.currentTime=(startTime-dx/30*1000+duration)%duration;paused=true;pause.setAttribute('aria-pressed','true');pause.textContent='Продолжить';}hovered=e.pointerType==='mouse';sync();});
 viewport.addEventListener('pointercancel',()=>{hovered=false;sync();});
 document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',configure);
 const observer=new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();});observer.observe(root);
 let lastWidth=0;new ResizeObserver(es=>{const width=es[0].contentRect.width;if(Math.abs(width-lastWidth)>1){lastWidth=width;configure();}}).observe(viewport);
 configure();
})();
