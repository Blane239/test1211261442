export function attachMascotEyes(svg) {
 const ns='http://www.w3.org/2000/svg';
 const eyes=[['глаз левый двигать тут','белый фон глаза не трогать'],['глаз правый двигать тут','белый фон не трогать']].map(([moving,fixed],i)=>{
 const pupil=svg.querySelector('[id="'+moving+'"]'),white=svg.querySelector('[id="'+fixed+'"]');
 const clip=document.createElementNS(ns,'clipPath'); clip.id='eye-clip-'+i+'-'+Math.random().toString(36).slice(2); clip.append(white.cloneNode()); clip.firstChild.removeAttribute('id'); svg.querySelector('defs').append(clip);
 const wrapper=document.createElementNS(ns,'g');pupil.before(wrapper);wrapper.append(pupil);wrapper.setAttribute('clip-path','url(#'+clip.id+')');
 return {pupil,cx:+white.getAttribute('cx'),cy:+white.getAttribute('cy'),x:0,y:0,tx:0,ty:0};
 });
 let frame=0,last=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 function tick(time){const a=reduce.matches?1:1-Math.exp(-Math.min(time-last||16,50)/110);last=time;let active=false;for(const e of eyes){e.x+=(e.tx-e.x)*a;e.y+=(e.ty-e.y)*a;e.pupil.setAttribute('transform','translate('+e.x.toFixed(3)+' '+e.y.toFixed(3)+')');active ||= Math.abs(e.tx-e.x)+Math.abs(e.ty-e.y)>.015;}frame=active?requestAnimationFrame(tick):0;}
 function start(){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
 // Both pupils share one gaze target; a virtual depth prevents near-cursor overreaction.
 const gazeCenter={x:eyes.reduce((sum,e)=>sum+e.cx,0)/eyes.length,y:eyes.reduce((sum,e)=>sum+e.cy,0)/eyes.length};
 function move(event){
  if(event.pointerType==='touch')return;
  const m=svg.getScreenCTM();if(!m)return;
  const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());
  const dx=p.x-gazeCenter.x,dy=p.y-gazeCenter.y;
  const depth=320;
  const projection=Math.hypot(dx,dy,depth);
  const tx=17.824+15*dx/projection,ty=-2+3*dy/projection;
  for(const e of eyes){e.tx=tx;e.ty=ty;}
  start();
 }
 function reset(){for(const e of eyes){e.tx=0;e.ty=0;}start();}
 window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);
 return ()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('blur',reset);};
}
