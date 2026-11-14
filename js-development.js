/* Local continuous carousel; no pause control or hover/focus interruption. */
(() => {
 'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(!reduce.matches){const enter=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-card','is-entering');enter.unobserve(e.target);}}));document.querySelectorAll('.bento-goal,.project-xp').forEach(el=>enter.observe(el));}
 const root=document.querySelector('[data-support-carousel]');if(!root)return;
 const viewport=root.querySelector('.carousel-window'),track=root.querySelector('.support-track'),group=root.querySelector('.support-group');
 let anim,clone,span=0,startX=0,startTime=0,lastWidth=0;
 function configure(){
  const fraction=anim&&span?Number(anim.currentTime||0)/(span/30*1000):0;
  anim?.cancel();clone?.remove();anim=null;
  root.classList.toggle('carousel-ready',!reduce.matches);
  if(reduce.matches)return;
  clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.setAttribute('inert','');clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));track.append(clone);
  span=group.getBoundingClientRect().width;
  anim=track.animate([{transform:'translateX(0)'},{transform:`translateX(-${span}px)`}],{duration:span/30*1000,iterations:Infinity,easing:'linear'});
  anim.currentTime=(fraction%1)*(span/30*1000);
 }
 function seek(delta){if(!anim)return;const duration=span/30*1000;anim.currentTime=((Number(anim.currentTime)||0)+delta/30*1000+duration)%duration;}
 function move(dir){const step=group.querySelector('article').getBoundingClientRect().width+16;if(reduce.matches)viewport.scrollBy({left:dir*step,behavior:'instant'});else seek(dir*step);}
 root.querySelector('[data-carousel-prev]').addEventListener('click',()=>move(-1));root.querySelector('[data-carousel-next]').addEventListener('click',()=>move(1));
 viewport.addEventListener('pointerdown',e=>{startX=e.clientX;startTime=Number(anim?.currentTime||0);});
 viewport.addEventListener('pointerup',e=>{if(reduce.matches||!anim)return;const dx=e.clientX-startX;if(Math.abs(dx)>25){const duration=span/30*1000;anim.currentTime=(startTime-dx/30*1000+duration)%duration;}});
 reduce.addEventListener('change',configure);
 new ResizeObserver(es=>{const width=es[0].contentRect.width;if(Math.abs(width-lastWidth)>1){lastWidth=width;configure();}}).observe(viewport);
 configure();
})();
