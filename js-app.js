'use strict';
// Поведение страницы. Тексты занятий находятся в ../content/lessons.js.

// СОЗДАНИЕ КАРТОЧЕК ПРОГРАММЫ из content/lessons.js
const modules=document.querySelector('#modules');
lessons.forEach((lesson,index)=>{
 const detail=document.createElement('details');detail.className='module';detail.open=index===0;
 const summary=document.createElement('summary');
 const number=document.createElement('span');number.className='module-number';number.textContent=String(index+1).padStart(2,'0');
 const name=document.createElement('span');name.className='module-name';name.textContent=lesson[0];
 const pill=document.createElement('span');pill.className='pill';pill.textContent=lesson[1]+' · 2 ч';
 summary.append(number,name,pill);
 const content=document.createElement('div');content.className='module-content';
 const body=document.createElement('div');const p=document.createElement('p');p.textContent=lesson[2];const ul=document.createElement('ul');lesson[4].forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li)});body.append(p,ul);
 const task=document.createElement('div');task.className='module-task';const label=document.createElement('span');label.className='label';label.textContent='ЗАКРЕПЛЕНИЕ В КОНСТРУКТОРЕ';const taskText=document.createElement('p');taskText.textContent=lesson[3];task.append(label,taskText);content.append(body,task);detail.append(summary,content);modules.append(detail);
});

// МОБИЛЬНОЕ МЕНЮ
const menu=document.querySelector('.menu');const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('visible');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню')}
menu.addEventListener('click',()=>{const open=navigation.classList.toggle('visible');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// СКАЧИВАНИЕ ТЕКСТОВОГО ФАЙЛА
function downloadText(name,content){const blob=new Blob(['\ufeff'+content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}

// СКАЧИВАЕМАЯ ПРОГРАММА: часы, возраст и итог редактируются здесь
document.querySelector('#download').addEventListener('click', () => {
 const stages = course.stages.map(stage => `${stage.title} — ${stage.hours} ч.`).join('\n');
 const plan = lessons.map((lesson, index) => `${index + 1}. ${lesson[0]} — 2 ак. ч.\n${lesson[2]}\nЗакрепление в конструкторе: ${lesson[3]}`).join('\n\n');
 downloadText('Программа_Юная_мастерская_мерча.txt',
  `${course.title}\nПрограмма «${course.documentTitle}»\n\n${course.age} · ${course.group}\n${course.hours} академических часов · ${course.lessonCount} занятий по 2 часа\n\n${stages}\n\nОбъяснение, показ, обсуждение и закрепление в блочном конструкторе Figma в конце каждого занятия.\n\n${plan}\n\nИтог: ${course.result}\n\n${course.status}`);
});

// ОКНО МИНИ-БРИФА
const dialog=document.querySelector('#idea-dialog');
['#idea-button','#start-idea'].forEach(selector=>document.querySelector(selector).addEventListener('click',()=>dialog.showModal()));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

// СОХРАНЕНИЕ ЗАПОЛНЕННОГО БРИФА
document.querySelector('#idea-form').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);downloadText('Мой_первый_бриф.txt',`МОЙ ПЕРВЫЙ БРИФ\nЮная мастерская мерча\n\nЛагерь: ${form.get('camp')}\n\nЧто делает его особенным:\n${form.get('details')}\n\nМоя история:\n${form.get('story')}\n\nНоситель: ${form.get('carrier')}\n\nСледующий шаг: собрать два-три варианта из готовых блоков и объяснить, какое решение хочется развивать.`);document.querySelector('#form-status').textContent='Бриф подготовлен. Файл передан браузеру для скачивания.'});
