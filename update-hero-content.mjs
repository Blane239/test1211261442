import {readFile,writeFile} from 'node:fs/promises';
const base=new URL('./',import.meta.url);
const content=JSON.parse(await readFile(new URL('content-hero.json',base),'utf8'));
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [file,key] of [['index.html','home'],['development.html','development']]){
 let html=await readFile(new URL(file,base),'utf8');const c=content[key];
 html=html.replace(/<section class="mascot-hero[\s\S]*?<\/section>/,hero=>hero.replace(/(<p class="mascot-hero-subtitle">)[\s\S]*?(<\/p>)/,'$1'+escape(c.label)+'$2').replace(/(<div class="mascot-hero-story"><h2>)[\s\S]*?(<\/h2><p>)[\s\S]*?(<\/p>)/,'$1'+escape(c.storyTitle||'')+'$2'+escape(c.description)+'$3').replace(/<a class="mascot-hero-cta"[^>]*>[\s\S]*?<\/a>/,'<a class="mascot-hero-cta" href="'+escape(c.href)+'">'+escape(c.primary)+'</a>').replace(/(<p class="eyebrow">)[\s\S]*?(<\/p>)/,'$1'+escape(c.label)+'$2').replace(/(<h1[^>]*>)[\s\S]*?(<\/h1>)/,'$1'+escape(c.title)+'$2').replace(/(<div class="mascot-hero-footer"><p>)[\s\S]*?(<\/p>)/,'$1'+escape(c.description)+'$2').replace(/<a class="button primary"[^>]*>[\s\S]*?<\/a>/,'<a class="button primary" href="'+escape(c.href)+'">'+escape(c.primary)+'</a>').replace(/<a class="button secondary"[^>]*>[\s\S]*?<\/a>/,'<a class="button secondary" href="'+escape(c.secondaryHref)+'">'+escape(c.secondary)+'</a>'));
 await writeFile(new URL(file,base),html);
}
console.log('Hero content updated');
