(()=>{
"use strict";
/* ====== CONFIGURAÇÃO DE ANÚNCIOS (preencher quando criar a conta) ======
   GTM:  ID do Google Tag Manager (ex.: "GTM-XXXXXXX")  — opcional
   GADS: ID do Google Ads (ex.: "AW-1234567890")
   CONV: rótulos de conversão (ex.: "AW-1234567890/AbCdEfGh")  */
const CFG={GTM:"",GADS:"",CONV:{whatsapp:"",phone:"",form:""}};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
window.dataLayer=window.dataLayer||[];
/* ---------- tema ---------- */
const root=document.documentElement,tm=$('meta[name=theme-color]');
const applyTheme=t=>{root.setAttribute("data-theme",t);if(tm)tm.content=t==="dark"?"#07140d":"#fbfaf6";$$("[data-set]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.set===t));const b=$("#theme");if(b){b.setAttribute("aria-pressed",t==="dark");b.setAttribute("aria-label",t==="dark"?"Mudar para versão clara":"Mudar para versão escura")}};
applyTheme(root.getAttribute("data-theme")||"light");
$("#theme").addEventListener("click",()=>{const n=root.getAttribute("data-theme")==="dark"?"light":"dark";applyTheme(n);store.set("jcs-theme",n)});
$$("[data-set]").forEach(b=>b.addEventListener("click",()=>{applyTheme(b.dataset.set);store.set("jcs-theme",b.dataset.set)}));
/* ---------- rastreamento (só carrega com consentimento e IDs preenchidos) ---------- */
const hasTrack=!!(CFG.GTM||CFG.GADS);let trackOn=false;
function loadTrack(){if(trackOn)return;trackOn=true;
 if(CFG.GTM){window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});const s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id="+CFG.GTM;document.head.appendChild(s)}
 if(CFG.GADS){const s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+CFG.GADS;document.head.appendChild(s);window.gtag=function(){window.dataLayer.push(arguments)};gtag("js",new Date());gtag("config",CFG.GADS)}}
function track(name,extra){window.dataLayer.push(Object.assign({event:name},extra||{}));
 if(trackOn&&window.gtag&&CFG.GADS){gtag("event",name,extra||{});const to=CFG.CONV[name==="whatsapp_click"?"whatsapp":name==="phone_click"?"phone":name==="form_submit"?"form":""];if(to)gtag("event","conversion",{send_to:to})}}
if(hasTrack){const c=store.get("jcs-consent");if(c==="yes")loadTrack();else if(c!=="no")$("#cons").classList.add("on");
 $("#cons-y").onclick=()=>{store.set("jcs-consent","yes");$("#cons").classList.remove("on");loadTrack()};$("#cons-n").onclick=()=>{store.set("jcs-consent","no");$("#cons").classList.remove("on")}}
/* ---------- WhatsApp (mensagem + origem da campanha) ---------- */
const P=new URLSearchParams(location.search);
const origin=[P.get("utm_source"),P.get("utm_campaign"),P.get("utm_term")].filter(Boolean).join(" / ")||(P.get("gclid")?"Google Ads":"");
const waLink=t=>"https://wa.me/5512988229244?text="+encodeURIComponent(t+(origin?"\n\n(Origem: "+origin+")":""));
$$("[data-wa]").forEach(a=>{a.href=waLink(a.dataset.wa);a.target="_blank";a.rel="noopener";a.addEventListener("click",()=>track("whatsapp_click",{place:a.dataset.place||"link"}))});
$$('a[href^="tel:"]').forEach(a=>a.addEventListener("click",()=>track("phone_click")));
$$('a[href^="mailto:"]').forEach(a=>a.addEventListener("click",()=>track("email_click")));
/* ---------- navegação ---------- */
const nav=$("nav"),bar=$("#bar"),tt=$("#tt"),secs=$$("main section[id]"),lk=$$(".links a:not(.btn)");
const onScroll=()=>{const y=scrollY;nav.classList.toggle("sc",y>40);tt.classList.toggle("on",y>500);const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?y/h*100:0)+"%";let cur="";secs.forEach(s=>{if(s.offsetTop-140<=y)cur=s.id});lk.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+cur))};
addEventListener("scroll",onScroll,{passive:true});onScroll();
tt.onclick=()=>scrollTo({top:0,behavior:"smooth"});
$("#bg").onclick=e=>{const o=document.body.classList.toggle("menu-open");e.currentTarget.setAttribute("aria-expanded",o)};
$$(".links a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("menu-open")));
/* ---------- reveal e contadores ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
$$(".rv").forEach((el,i)=>{el.style.transitionDelay=(i%4)*70+"ms";io.observe(el)});
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const n=+e.target.dataset.n,p=e.target.dataset.p||"";let t0;const f=t=>{t0=t0||t;const k=Math.min((t-t0)/1400,1);e.target.textContent=p+Math.round(n*(1-Math.pow(1-k,3)));k<1&&requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$$("[data-n]").forEach(el=>co.observe(el));
/* ---------- modal das áreas ---------- */
const md=$("#md"),mc=$("#mc");let lastFocus=null;
const closeM=()=>{md.classList.remove("on");document.body.style.overflow="";lastFocus&&lastFocus.focus()};
const openM=h=>{lastFocus=document.activeElement;mc.innerHTML=h;md.classList.add("on");document.body.style.overflow="hidden";$(".x",md).focus()};
md.addEventListener("click",e=>{if(e.target===md||e.target.closest(".x"))closeM()});addEventListener("keydown",e=>e.key==="Escape"&&md.classList.contains("on")&&closeM());
const SV=JSON.parse($("#svcdata").textContent);
$$(".svc").forEach(b=>b.addEventListener("click",()=>{const s=SV.items[b.dataset.k];
 openM(`<h3 id="mt">${s.t}</h3><p class="d">${s.d}</p>${s.ex?`<p class="d">${s.ex}</p>`:""}<p class="d" style="font-size:.95rem">${SV.intro}</p>
 <h4>PONTOS DE ANÁLISE — O QUE PODE SER CONSIDERADO</h4><ul class="pts">${s.items.map(i=>`<li>${i[0]}${i[1]?`<span>${i[1]}</span>`:""}</li>`).join("")}</ul>
 <p class="d" style="font-size:.9rem;margin-top:10px">${SV.generic}</p>
 <h4>DÚVIDAS SOBRE ${s.t.toUpperCase()}</h4>${SV.faq.map(f=>`<details class="q"><summary>${f[0].replace("cada área",s.t)}</summary><div class="a">${f[1]}</div></details>`).join("")}
 <div class="ctas"><a class="btn wa" data-place="modal" id="mw">Solicitar avaliação do caso →</a><a class="btn" href="#contato" id="mo">Pedir orçamento →</a></div>`);
 const w=$("#mw");w.href=waLink("Olá, gostaria de informações sobre: "+s.t);w.target="_blank";w.rel="noopener";w.onclick=()=>track("whatsapp_click",{place:"modal",area:s.t});
 $("#mo").onclick=()=>{closeM();const sel=$("#fa");[...sel.options].forEach(o=>{if(o.text===s.t)o.selected=true})}}));
$$(".svc").forEach(c=>{c.addEventListener("mousemove",e=>{if(matchMedia("(hover:none)").matches)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-6px)`});c.addEventListener("mouseleave",()=>c.style.transform="")});
/* ---------- abas, artigos, glossário ---------- */
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.setAttribute("aria-selected",x===t));$$(".stp").forEach((s,i)=>s.classList.toggle("on",i==t.dataset.t))});
$$(".art").forEach(a=>{const tg=()=>{const o=a.classList.toggle("open");a.querySelector(".arrow").textContent=o?"FECHAR −":"LER ARTIGO +";a.querySelector(".arrow").setAttribute("aria-expanded",o)};a.addEventListener("click",e=>{if(e.target.closest("a"))return;tg()})});
$$(".chip").forEach(c=>c.onclick=()=>{$$(".chip").forEach(x=>x.setAttribute("aria-pressed",x===c));const k=c.dataset.c;$$(".art").forEach(a=>a.style.display=k==="all"||a.dataset.c.split(" ").includes(k)?"":"none")});
$("#q").oninput=e=>{const v=e.target.value.toLowerCase();let n=0;$$(".gl").forEach(c=>{const m=c.textContent.toLowerCase().includes(v);c.style.display=m?"":"none";c.open=!!v&&m;n+=m});$("#none").style.display=n?"none":"block"};
/* ---------- formulário → WhatsApp ---------- */
$("#fm").onsubmit=e=>{e.preventDefault();const docs=$$("#docs input:checked").map(i=>i.value).join(", ")||"não informado";
 track("form_submit",{area:$("#fa").value});
 window.open(waLink(`Olá, gostaria de solicitar análise e orçamento.\n\nTipo de perícia/norma: ${$("#fa").value}\nDocumentos disponíveis: ${docs}\nContexto: ${$("#fc").value||"a detalhar"}`),"_blank","noopener")};
/* ---------- rodapé legal ---------- */
const L=JSON.parse($("#legal").textContent);
$$("[data-legal]").forEach(b=>b.onclick=()=>openM(`<h3 id="mt">${b.dataset.legal}</h3><p class="d">${L[b.dataset.legal]}</p><p class="d" style="font-size:.95rem">Para dúvidas sobre atendimento e informações disponibilizadas neste site, utilize os canais indicados na página de contato.</p><div class="ctas"><a class="btn" href="#contato" onclick="document.querySelector('.x').click()">Entrar em contato →</a></div>`));
/* ---------- partículas do topo (só quando visível, sem movimento reduzido) ---------- */
(()=>{const c=$("#cv");if(!c||matchMedia("(prefers-reduced-motion:reduce)").matches||innerWidth<700)return;const x=c.getContext("2d");let w,h,P=[],on=false,mx=-999,my=-999;
 const rs=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;P=Array.from({length:Math.min(55,w/20)},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}))};rs();addEventListener("resize",rs);
 c.parentElement.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
 const loop=()=>{if(!on)return;const col=getComputedStyle(root).getPropertyValue("--dots").trim()||"rgba(26,122,76,.5)";x.clearRect(0,0,w,h);P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;x.fillStyle=col;x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill();
  for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<130){x.globalAlpha=.25*(1-d/130);x.strokeStyle=col;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke();x.globalAlpha=1}}
  const d=Math.hypot(p.x-mx,p.y-my);if(d<170){x.globalAlpha=.6*(1-d/170);x.strokeStyle=col;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mx,my);x.stroke();x.globalAlpha=1}});requestAnimationFrame(loop)};
 new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)loop()}).observe(c.parentElement)})();
})();
