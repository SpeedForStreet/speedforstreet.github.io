const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

// Smooth navigation
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});$('.mobile-menu')?.classList.remove('open');}}));

// Mobile menu
const menuBtn=$('.menu-btn'), mobileMenu=$('.mobile-menu');
menuBtn?.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');mobileMenu.setAttribute('aria-hidden',String(!open));});

// Active navigation
const sections=$$('[id]'); const navLinks=$$('.main-nav a');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>observer.observe(s));

// Car cards -> functional modal
const cars={
 street:{kicker:'STREET CLASS',title:'ГОРОДСКОЙ СПОРТ',desc:'Автомобиль для первых серьёзных шагов. Настройка двигателя, подвески, шин и тормозов меняет его поведение на дороге.',engine:'2.0 TURBO',drive:'RWD',tune:'ЭКСТЕРЬЕР + ТЕХНИКА',img:'assets/car-clean.jpg'},
 performance:{kicker:'PERFORMANCE',title:'СКОРОСТЬ',desc:'Более мощная конфигурация для тех, кто хочет чувствовать разницу между обычной городской машиной и спортивным автомобилем.',engine:'3.0 TWIN-TURBO',drive:'AWD',tune:'ПОЛНЫЙ ТЮНИНГ',img:'assets/hero-clean.jpg'},
 garage:{kicker:'GARAGE',title:'ТЮНИНГ',desc:'Гараж — место, где машина становится твоей. Внешние детали и технические компоненты работают как единая система.',engine:'НАСТРОЙКА',drive:'RWD / AWD',tune:'БЕЗ ОГРАНИЧЕНИЙ',img:'assets/city-clean.jpg'},
 street2:{kicker:'STREET CLASS',title:'НОЧНОЙ STREET',desc:'Городская конфигурация для вечерних улиц. Баланс тяги, тормозов и управляемости.',engine:'2.4 TURBO',drive:'RWD',tune:'STREET SETUP',img:'assets/street-01.jpg'},
 performance2:{kicker:'TRACK / STREET',title:'TRACK BUILD',desc:'Сборка, рассчитанная на скорость, торможение и стабильность на высокой скорости.',engine:'3.5 V6 TURBO',drive:'AWD',tune:'TRACK SETUP',img:'assets/hero-clean.jpg'},
 garage2:{kicker:'GARAGE PROJECT',title:'PROJECT CAR',desc:'Базовый автомобиль для долгого проекта: меняй детали постепенно и собирай собственный характер машины.',engine:'PROJECT',drive:'RWD / AWD',tune:'FULL PROJECT',img:'assets/city-clean.jpg'},

};
const modal=$('#carModal');
$$('.car-card').forEach(card=>card.addEventListener('click',()=>{const d=cars[card.dataset.car];if(!d)return;$('#modalKicker').textContent=d.kicker;$('#modalTitle').textContent=d.title;$('#modalDesc').textContent=d.desc;$('#modalEngine').textContent=d.engine;$('#modalDrive').textContent=d.drive;$('#modalTune').textContent=d.tune;$('#modalImg').style.backgroundImage=`url("${d.img}")`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');}));
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
$('.modal-close')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});


// Gallery filters
$$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter=btn.dataset.filter;
  $$('.car-card').forEach(card=>{
    const show=filter==='all'||card.dataset.category===filter;
    card.hidden=!show;
  });
}));


// CMS data: cars and development news are managed from admin.html
async function loadSiteData(){
  try{
    const [carsRes,newsRes]=await Promise.all([fetch('data/cars.json'),fetch('data/news.json')]);
    if(!carsRes.ok||!newsRes.ok) throw new Error('CMS data unavailable');
    const siteCars=await carsRes.json(), siteNews=await newsRes.json();
    renderSiteCars(siteCars); renderSiteNews(siteNews);
  }catch(e){ console.warn('SpeedForStreet CMS:',e); }
}
function renderSiteCars(list){
  const grid=$('.gallery-grid'); if(!grid)return;
  grid.innerHTML=list.map((c,i)=>`<button class="car-card ${i===0?'featured':''}" data-car-cms="${c.id}" data-category="${c.category}">
    <div class="car-image" style="background-image:url("${c.image}")"></div>
    <div class="card-copy"><small>${c.kicker}</small><h3>${c.title}</h3><p>${c.desc}</p><b>ОТКРЫТЬ КАРТОЧКУ →</b></div>
  </button>`).join('');
  grid.querySelectorAll('.car-card').forEach(card=>card.addEventListener('click',()=>{
    const d=list.find(x=>x.id===card.dataset.carCms); if(!d||!modal)return;
    $('#modalKicker').textContent=d.kicker; $('#modalTitle').textContent=d.title; $('#modalDesc').textContent=d.desc;
    $('#modalEngine').textContent=d.engine; $('#modalDrive').textContent=d.drive; $('#modalTune').textContent=d.tune;
    $('#modalImg').style.backgroundImage=`url("${d.image}")`; modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  }));
  $$('.filter-btn').forEach(btn=>btn.onclick=()=>{ $$('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const f=btn.dataset.filter; grid.querySelectorAll('.car-card').forEach(c=>c.hidden=!(f==='all'||c.dataset.category===f)); });
}
function renderSiteNews(list){
  const grid=$('.news-grid'); if(!grid)return;
  list=list.filter(n=>n.published!==false);
  grid.innerHTML=list.map((n,i)=>`<article class="news-card ${i===0?'featured-news':''}" data-news-id="${n.id}"><div class="news-image" style="background-image:url("${n.image}")"></div><div class="news-body"><span>${n.date} • ${n.tag}</span><h3>${n.title}</h3><p class="news-short">${n.shortDescription||n.text||''}</p><a href="#" class="news-read-more" data-news-id="${n.id}">ЧИТАТЬ ДАЛЬШЕ →</a></div></article>`).join('');
  grid.querySelectorAll('.news-read-more').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openNewsModal(list.find(n=>n.id===a.dataset.newsId));}));
}
function openNewsModal(n){
  if(!n||!$('#newsModal'))return;
  $('#newsModalKicker').textContent=(n.date?n.date+' • ':'')+(n.tag||'');
  $('#newsModalTitle').textContent=n.title||'';
  $('#newsModalDesc').innerHTML=n.fullDescription||n.text||n.shortDescription||'';
  $('#newsModalImg').style.backgroundImage=n.image?'url("'+n.image+'")':'none';
  $('#newsModal').classList.add('open');
  $('#newsModal').setAttribute('aria-hidden','false');
}
function closeNewsModal(){const m=$('#newsModal');if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');}
document.addEventListener('click',e=>{if(e.target.closest('.news-modal-close'))closeNewsModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNewsModal();});
const newsModalEl=$('#newsModal'); newsModalEl?.addEventListener('click',e=>{if(e.target===newsModalEl)closeNewsModal();});
loadSiteData();


// Site loading screen
(function(){
  const loader=document.getElementById('siteLoader');
  const percent=document.getElementById('loaderPercent');
  const status=document.getElementById('loaderStatus');
  if(!loader)return;
  const staticAssets=['assets/hero-clean.jpg','assets/world-clean.jpg','assets/car-clean.jpg','assets/city-clean.jpg','assets/city-01.jpg','assets/street-01.jpg'];
  const setProgress=(n,label)=>{if(percent)percent.textContent=Math.round(n)+'%';if(status&&label)status.firstChild.nodeValue=label;};
  const preloadImage=src=>new Promise(resolve=>{
    const img=new Image();
    img.onload=img.onerror=()=>resolve();
    img.src=src;
  });
  const hideLoader=()=>{
    if(loader.classList.contains('done'))return;
    setProgress(100,'ГОТОВО');
    loader.classList.add('done');
    setTimeout(()=>loader.remove(),700);
  };
  const start=async()=>{
    let imageUrls=[...staticAssets];
    setProgress(5,'ЗАПУСК SPEEDFOR STREET');
    try{
      const [carsRes,newsRes]=await Promise.all([fetch('data/cars.json'),fetch('data/news.json')]);
      setProgress(15,'ПОЛУЧЕНИЕ ДАННЫХ');
      if(carsRes.ok){const data=await carsRes.json();data.forEach(x=>x.image&&imageUrls.push(x.image));}
      if(newsRes.ok){const data=await newsRes.json();data.forEach(x=>x.image&&imageUrls.push(x.image));}
    }catch(e){}
    imageUrls=[...new Set(imageUrls)];
    let loaded=0;
    setProgress(20,'ЗАГРУЗКА ИЗОБРАЖЕНИЙ');
    await Promise.all(imageUrls.map(async src=>{
      await preloadImage(src);
      loaded++;
      setProgress(20+Math.round((loaded/imageUrls.length)*70),'ЗАГРУЗКА ИЗОБРАЖЕНИЙ');
    }));
    setProgress(94,'ПОДГОТОВКА САЙТА');
    if(document.fonts&&document.fonts.ready)try{await document.fonts.ready}catch(e){}
    setProgress(98,'ПОЧТИ ГОТОВО');
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    hideLoader();
  };
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});
  setTimeout(hideLoader,15000);
})();