document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"})}}));
const sections=[...document.querySelectorAll("section[id]")], nav=[...document.querySelectorAll(".nav nav a")];
const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+x.target.id))}}),{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>obs.observe(s));