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
