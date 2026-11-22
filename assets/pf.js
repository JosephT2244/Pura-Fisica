/* Pura Física! — núcleo compartido
   Encabezado, regla de niveles, tema, buscador, KaTeX, mapas explorables,
   explicaciones por nivel, quizzes, pasos revelables e índice lateral. */
(function(){
"use strict";
var PF = window.PF = window.PF || {};
var D = document, H = D.documentElement;

/* ---------- almacenamiento seguro ---------- */
function leer(k, def){ try{ var v = localStorage.getItem("pf:"+k); return v===null?def:v; }catch(e){ return def; } }
function guardar(k, v){ try{ localStorage.setItem("pf:"+k, v); }catch(e){} }
PF.leer = leer; PF.guardar = guardar;

/* ---------- idiomas ---------- */
PF.IDIOMAS = [["es","Español"],["en","English"],["pt","Português"]];
var lang = (H.getAttribute("lang")||"es").slice(0,2);
if(!/^(es|en|pt)$/.test(lang)) lang = "es";
PF.lang = lang;
PF.urlIdioma = function(l){
  var f = location.pathname.split("/").pop() || "";
  return (PF.lang==="es" ? "" : "../") + (l==="es" ? "" : l+"/") + f + location.hash;
};
if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)) H.classList.add("pf-anim");
var DIC = {
"Inicio":["Home","Início"],"La física":["Physics","A física"],"Temas":["Topics","Temas"],"Laboratorio":["Lab","Laboratório"],"Línea del tiempo":["Timeline","Linha do tempo"],"Físicos":["Physicists","Físicos"],"Descubrimientos":["Discoveries","Descobertas"],"Datos curiosos":["Fun facts","Curiosidades"],"Guía de bachillerato":["High-school guide","Guia do ensino médio"],"Cómo estudiar física":["How to study physics","Como estudar física"],
"Más":["More","Mais"],"Buscar":["Search","Buscar"],"Tema claro u oscuro":["Light or dark theme","Tema claro ou escuro"],"Saltar al contenido":["Skip to content","Pular para o conteúdo"],
"Física explicada a cinco niveles, del patio de recreo al pizarrón de posgrado. Hecho en CECyT 16 “Hidalgo”, IPN.":["Physics explained at five levels, from the playground to the graduate blackboard. Made at CECyT 16 “Hidalgo”, IPN (Mexico).","Física explicada em cinco níveis, do recreio ao quadro da pós-graduação. Feito no CECyT 16 “Hidalgo”, IPN (México)."],
"Aprender":["Learn","Aprender"],"Explorar":["Explore","Explorar"],"Tu nivel":["Your level","Seu nível"],"Elige cómo quieres que te expliquen las cosas. Puedes cambiarlo cuando quieras.":["Choose how you want things explained. You can change it anytime.","Escolha como quer que as coisas sejam explicadas. Pode mudar quando quiser."],"Cambiar nivel":["Change level","Mudar nível"],"Volver arriba":["Back to top","Voltar ao topo"],
"¿Cómo quieres que te lo expliquen?":["How do you want it explained?","Como você quer que expliquem?"],"Todo el sitio se adapta: textos, fórmulas, simulaciones y preguntas. Cada explicación también tiene botones para ver los otros niveles.":["The whole site adapts: texts, formulas, simulations and quizzes. Each explanation also has buttons to see the other levels.","Todo o site se adapta: textos, fórmulas, simulações e perguntas. Cada explicação também tem botões para ver os outros níveis."],"Listo":["Done","Pronto"],
"Busca un tema: péndulo, entropía, Newton, cuántica…":["Search a topic (in Spanish): péndulo, entropía, Newton…","Busque um tema (em espanhol): péndulo, entropía, Newton…"],"Sin resultados. Prueba con otra palabra, por ejemplo “energía” o “luz”.":["No results. Try another word, e.g. “energía” or “luz”.","Sem resultados. Tente outra palavra, por exemplo “energía” ou “luz”."],
"Explicación para:":["Explanation for:","Explicação para:"],"Toca un recuadro para abrirlo y leer qué es":["Tap a box to open it and read what it is","Toque um quadro para abri-lo e ler o que é"],"Abrir todo":["Expand all","Abrir tudo"],"Cerrar todo":["Collapse all","Fechar tudo"],"Ir a la explicación completa":["Go to the full explanation","Ir para a explicação completa"],"Contiene:":["Contains:","Contém:"],
"Ponte a prueba":["Test yourself","Teste-se"],"¡Perfecto! Dominas este tema.":["Perfect! You've mastered this topic.","Perfeito! Você domina este tema."],"¡Bien! Repasa las que fallaste y vuelve a intentarlo.":["Good! Review the ones you missed and try again.","Bom! Revise as que errou e tente de novo."],"Vuelve a leer la explicación y prueba otra vez: así se aprende.":["Read the explanation again and retry: that's how you learn.","Releia a explicação e tente de novo: é assim que se aprende."],"Ganaste el sello de este tema para tu cuaderno.":["You earned this topic's stamp for your notebook.","Você ganhou o selo deste tema para o seu caderno."],"Resultado":["Score","Resultado"],"Intentar de nuevo":["Try again","Tentar de novo"],"Correcto.":["Correct.","Correto."],"No exactamente.":["Not quite.","Não exatamente."],"Siguiente pregunta":["Next question","Próxima pergunta"],"Ver resultado":["See score","Ver resultado"],"Pregunta":["Question","Pergunta"],"Terminado":["Finished","Concluído"],
"Mostrar el primer paso":["Show the first step","Mostrar o primeiro passo"],"Ver todo":["Show all","Ver tudo"],"Ocultar pasos":["Hide steps","Ocultar passos"],"Siguiente paso":["Next step","Próximo passo"],"En esta página":["On this page","Nesta página"],
"Explorador":["Explorer","Explorador"],"Curioso":["Curious","Curioso"],"Bachiller":["High school","Ensino médio"],"Universitario":["University","Universitário"],"Físico":["Physicist","Físico"],
"6–11 años":["Ages 6–11","6–11 anos"],"12–15 años":["Ages 12–15","12–15 anos"],"15–18 años":["Ages 15–18","15–18 anos"],"Licenciatura":["Undergraduate","Graduação"],"Posgrado e investigación":["Graduate & research","Pós e pesquisa"],
"Ideas contadas con juguetes, cocina y patio de recreo. Sin fórmulas.":["Ideas told with toys, kitchens and playgrounds. No formulas.","Ideias contadas com brinquedos, cozinha e recreio. Sem fórmulas."],"Los conceptos clave y las primeras fórmulas, con ejemplos que puedes probar en casa.":["Key concepts and first formulas, with examples you can try at home.","Conceitos-chave e primeiras fórmulas, com exemplos para testar em casa."],"Fórmulas, unidades y problemas resueltos paso a paso, como en el examen.":["Formulas, units and step-by-step solved problems, like on the exam.","Fórmulas, unidades e problemas resolvidos passo a passo, como na prova."],"Cálculo, vectores y modelos completos; de dónde salen las ecuaciones.":["Calculus, vectors and full models; where the equations come from.","Cálculo, vetores e modelos completos; de onde vêm as equações."],"Formalismo, límites de validez de cada teoría y preguntas abiertas.":["Formalism, the limits of each theory and open questions.","Formalismo, limites de validade de cada teoria e questões em aberto."],
"Idioma":["Language","Idioma"],
"¡Sello ganado!":["Stamp earned!","Selo ganho!"],
"aviso-idioma":["The navigation and controls are translated, but this page's content and simulations are in Spanish. You can use your browser's translator for the full text.","A navegação e os controles estão traduzidos, mas o conteúdo e as simulações desta página estão em espanhol. Você pode usar o tradutor do navegador para o texto completo."]
};
function T(x){ if(PF.lang==="es") return x==="aviso-idioma" ? "" : x; var d = DIC[x]; return d ? d[PF.lang==="en"?0:1] : x; }
PF.T = T; PF.DIC = DIC;
PF.inclinar = function(raiz){
  if(!(window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches) || !H.classList.contains("pf-anim")) return;
  (raiz||D).querySelectorAll(".preg, .puerta, .sello-c, .lab-item").forEach(function(e){
    if(e.classList.contains("pf-tilt")) return;
    e.classList.add("pf-tilt");
    e.addEventListener("pointermove", function(ev){ var b = e.getBoundingClientRect(), px = (ev.clientX-b.left)/b.width, py = (ev.clientY-b.top)/b.height;
      e.style.setProperty("--ry", ((px-.5)*7).toFixed(2)+"deg"); e.style.setProperty("--rx", ((.5-py)*6).toFixed(2)+"deg");
      e.style.setProperty("--gx", (px*100).toFixed(1)+"%"); e.style.setProperty("--gy", (py*100).toFixed(1)+"%"); });
    e.addEventListener("pointerleave", function(){ e.style.setProperty("--rx","0deg"); e.style.setProperty("--ry","0deg"); });
  });
};
PF.revelar = function(raiz){
  var els=[].slice.call((raiz||D).querySelectorAll("[data-revela]:not(.visto)"));
  if(!els.length) return;
  if(!("IntersectionObserver" in window) || !H.classList.contains("pf-anim")){ els.forEach(function(e){ e.classList.add("visto"); }); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("visto"); io.unobserve(e.target); } }); },{rootMargin:"0px 0px -6% 0px"});
  els.forEach(function(e){ io.observe(e); });
};
PF.agregarTextos = function(o){ for(var k in o) DIC[k] = o[k]; };

/* ---------- páginas ---------- */
PF.paginas = [
  {id:"inicio", t:"Inicio", f:"Pura Física!.html"},
  {id:"fisica", t:"La física", f:"La física.html"},
  {id:"temas", t:"Temas", f:"Temas de interés en la física.html"},
  {id:"lab", t:"Laboratorio", f:"Laboratorio.html"},
  {id:"linea", t:"Línea del tiempo", f:"Línea del tiempo.html"},
  {id:"fisicos", t:"Físicos", f:"Los mejores físicos y sus aportes.html", mas:1},
  {id:"descubrimientos", t:"Descubrimientos", f:"Los mejores descubrimientos.html", mas:1},
  {id:"datos", t:"Datos curiosos", f:"Datos curiosos.html", mas:1},
  {id:"bach", t:"Guía de bachillerato", f:"Explicaciones nivel bachillerato.html", mas:1},
  {id:"recom", t:"Cómo estudiar física", f:"Recomendaciones para estudiar física.html", mas:1}
];
PF.url = function(id, ancla){
  var p = PF.paginas.filter(function(x){return x.id===id;})[0];
  return p ? encodeURI(p.f) + (ancla ? "#" + encodeURIComponent(ancla) : "") : "#";
};

/* ---------- niveles ---------- */
PF.NIVELES = [
  {n:1, nom:"Explorador", edad:"6–11 años", d:"Ideas contadas con juguetes, cocina y patio de recreo. Sin fórmulas."},
  {n:2, nom:"Curioso", edad:"12–15 años", d:"Los conceptos clave y las primeras fórmulas, con ejemplos que puedes probar en casa."},
  {n:3, nom:"Bachiller", edad:"15–18 años", d:"Fórmulas, unidades y problemas resueltos paso a paso, como en el examen."},
  {n:4, nom:"Universitario", edad:"Licenciatura", d:"Cálculo, vectores y modelos completos; de dónde salen las ecuaciones."},
  {n:5, nom:"Físico", edad:"Posgrado e investigación", d:"Formalismo, límites de validez de cada teoría y preguntas abiertas."}
];
PF.NIVELES.forEach(function(x){ x.nom = T(x.nom); x.edad = T(x.edad); x.d = T(x.d); });
PF.nivel = function(){ var n = parseInt(leer("nivel","3"),10); return (n>=1&&n<=5)?n:3; };
PF.ponerNivel = function(n){
  n = Math.max(1, Math.min(5, n|0));
  guardar("nivel", String(n));
  H.setAttribute("data-nivel", n);
  aplicarNivel(D);
  var b = D.querySelector(".btn-nivel");
  if(b){ b.querySelector("i").textContent = n; b.querySelector("span").textContent = PF.NIVELES[n-1].nom; b.setAttribute("aria-label","Nivel: "+PF.NIVELES[n-1].nom+". Cambiar nivel"); }
  D.querySelectorAll(".regla__btn").forEach(function(x){ x.setAttribute("aria-pressed", String(+x.dataset.n===n)); });
  var desc = D.querySelectorAll(".regla__desc");
  desc.forEach(function(d){ d.textContent = PF.NIVELES[n-1].d; });
  D.dispatchEvent(new CustomEvent("pf:nivel",{detail:n}));
};
H.setAttribute("data-nivel", PF.nivel());

/* tema */
var temaGuardado = leer("tema", null);
if(!temaGuardado && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) temaGuardado = "pizarron";
H.setAttribute("data-tema", temaGuardado || "papel");
PF.tema = function(){ return H.getAttribute("data-tema"); };
function aplicarTema(t){
  H.setAttribute("data-tema", t); guardar("tema", t);
  D.dispatchEvent(new CustomEvent("pf:tema",{detail:t}));
}
function cambiarTema(ev){
  var t = PF.tema()==="papel" ? "pizarron" : "papel";
  var quieto = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!D.startViewTransition || quieto){ aplicarTema(t); return; }
  var b = ev && ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : {left:innerWidth-40,top:20,width:0,height:0};
  var x = b.left + b.width/2, y = b.top + b.height/2, r = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y));
  H.classList.add("vt-tema");
  var vt = D.startViewTransition(function(){ aplicarTema(t); });
  vt.ready.then(function(){
    H.animate({clipPath:["circle(0px at "+x+"px "+y+"px)","circle("+r+"px at "+x+"px "+y+"px)"]},{duration:620,easing:"cubic-bezier(.22,.8,.2,1)",pseudoElement:"::view-transition-new(root)"});
  }).catch(function(){});
  vt.finished.then(function(){ H.classList.remove("vt-tema"); }, function(){ H.classList.remove("vt-tema"); });
}

/* colores leídos del CSS (para lienzos) */
PF.color = function(v){ return getComputedStyle(H).getPropertyValue("--"+v).trim(); };

/* ---------- utilidades ---------- */
PF.el = function(tag, attrs, html){
  var e = D.createElement(tag);
  if(attrs) for(var k in attrs){ if(k==="class") e.className = attrs[k]; else if(k.slice(0,2)==="on") e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); }
  if(html!=null) e.innerHTML = html;
  return e;
};
PF.slug = function(s){ return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); };
PF.fmt = function(x, d){
  if(!isFinite(x)) return "∞";
  d = d==null?2:d;
  var a = Math.abs(x);
  if(a!==0 && (a>=1e5 || a<1e-3)){
    var e = Math.floor(Math.log10(a)), m = x/Math.pow(10,e);
    return m.toFixed(d).replace(/\.?0+$/,"") + "×10" + sup(e);
  }
  return Number(x.toFixed(d)).toLocaleString("es-MX",{maximumFractionDigits:d});
};
function sup(e){ var m = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"}; return String(e).split("").map(function(c){return m[c]||c;}).join(""); }
PF.sup = sup;
PF.tex = function(el){
  if(window.renderMathInElement){
    try{ renderMathInElement(el||D.body,{delimiters:[{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false}],throwOnError:false,ignoredTags:["script","noscript","style","textarea","pre","code","option","input"]}); }catch(e){}
  }
};
PF.texStr = function(s, display){
  if(window.katex){ try{ return katex.renderToString(s,{throwOnError:false,displayMode:!!display}); }catch(e){} }
  return s;
};

/* ---------- logo ---------- */
var LOGO = '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2">'+
 '<ellipse cx="32" cy="32" rx="27" ry="10.5"/><ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="27" ry="10.5" transform="rotate(-60 32 32)"/></g>'+
 '<circle cx="32" cy="32" r="9" fill="currentColor"/><text x="32" y="35.6" text-anchor="middle" font-family="Young Serif,Georgia,serif" font-size="9.5" fill="var(--papel)">PF!</text>'+
 '<circle cx="59" cy="32" r="3" fill="var(--rojo)"/><circle cx="18.5" cy="8.6" r="3" fill="var(--boli)"/></svg>';
PF.LOGO = LOGO;

/* ---------- encabezado y pie ---------- */
function construirEncabezado(){
  var actual = D.body.getAttribute("data-pagina") || "";
  var nav = PF.paginas.filter(function(p){return !p.mas && p.id!=="inicio";}).map(function(p){
    return '<a href="'+PF.url(p.id)+'"'+(p.id===actual?' aria-current="page"':'')+'>'+T(p.t)+'</a>';
  }).join("");
  var mas = PF.paginas.filter(function(p){return p.mas;}).map(function(p){
    return '<a href="'+PF.url(p.id)+'"'+(p.id===actual?' aria-current="page"':'')+'>'+T(p.t)+'</a>';
  }).join("");
  var todos = PF.paginas.map(function(p){
    return '<a href="'+PF.url(p.id)+'"'+(p.id===actual?' aria-current="page"':'')+'>'+T(p.t)+'</a>';
  }).join("");
  var n = PF.nivel();
  var top = PF.el("header",{class:"pf-top"},
   '<div class="pf-top__in">'+
    '<button class="btn-ico pf-hamb" id="pf-hamb" aria-label="Abrir menú">☰</button>'+
    '<a class="pf-logo" href="'+PF.url("inicio")+'" aria-label="Pura Física! — inicio">'+LOGO+'<b>Pura Física!</b></a>'+
    '<nav class="pf-nav" aria-label="Principal">'+nav+
      '<div class="pf-mas"><button aria-expanded="false" aria-haspopup="true">'+T("Más")+' ▾</button><div class="pf-mas__menu">'+mas+'</div></div>'+
    '</nav>'+
    '<div class="pf-herr">'+
      '<button class="btn-buscar" id="pf-buscar" aria-label="'+T("Buscar")+'">⌕ <span>'+T("Buscar")+'</span> <kbd>Ctrl K</kbd></button>'+
      '<button class="btn-ico" id="pf-tema" title="'+T("Tema claro u oscuro")+'" aria-label="'+T("Tema claro u oscuro")+'"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button>'+
      '<div class="pf-mas pf-idioma"><button class="btn-ico" id="pf-lang" aria-haspopup="true" aria-expanded="false" title="'+T("Idioma")+'" aria-label="'+T("Idioma")+'">'+PF.lang.toUpperCase()+'</button><div class="pf-mas__menu pf-idioma__menu">'+PF.IDIOMAS.map(function(l){ return '<button type="button" data-lang="'+l[0]+'"'+(l[0]===PF.lang?' aria-current="true"':'')+'>'+l[1]+'</button>'; }).join("")+'</div></div>'+
      '<button class="btn-nivel" id="pf-nivel" aria-haspopup="dialog"><i>'+n+'</i><span>'+PF.NIVELES[n-1].nom+'</span></button>'+
    '</div>'+
   '</div>');
  D.body.insertBefore(top, D.body.firstChild);
  var skip = PF.el("a",{href:"#contenido",class:"oculto"},T("Saltar al contenido"));
  skip.addEventListener("focus",function(){skip.classList.remove("oculto");});
  D.body.insertBefore(skip, top);

  // cajón móvil
  var cajon = PF.el("div",{class:"pf-cajon",role:"dialog","aria-label":"Menú"},
    '<div class="pf-cajon__fondo"></div><div class="pf-cajon__panel"><a class="pf-logo" href="'+PF.url("inicio")+'">'+LOGO+'<b>Pura Física!</b></a>'+todos+'</div>');
  D.body.appendChild(cajon);
  D.getElementById("pf-hamb").onclick = function(){ cajon.setAttribute("data-abierto",""); cajon.querySelector(".pf-cajon__panel a:not(.pf-logo)").focus(); };
  cajon.querySelector(".pf-cajon__fondo").onclick = function(){ cajon.removeAttribute("data-abierto"); };

  // menú "más"
  var m = top.querySelector(".pf-mas"), mb = m.querySelector("button");
  mb.onclick = function(e){ e.stopPropagation(); var a = m.hasAttribute("data-abierto"); if(a){m.removeAttribute("data-abierto");mb.setAttribute("aria-expanded","false");}else{m.setAttribute("data-abierto","");mb.setAttribute("aria-expanded","true");} };
  D.addEventListener("click", function(){ m.removeAttribute("data-abierto"); mb.setAttribute("aria-expanded","false"); });

  var li = top.querySelector(".pf-idioma"), lb = li.querySelector("#pf-lang");
  lb.onclick = function(e){ e.stopPropagation(); var ab = li.hasAttribute("data-abierto"); if(ab){ li.removeAttribute("data-abierto"); } else { li.setAttribute("data-abierto",""); } lb.setAttribute("aria-expanded", String(!ab)); };
  D.addEventListener("click", function(){ li.removeAttribute("data-abierto"); lb.setAttribute("aria-expanded","false"); });
  var barra = PF.el("div",{class:"pf-lectura","aria-hidden":"true"},"<i></i>"); top.appendChild(barra);
  var pend = false; function leer_(){ pend = false; var m = D.documentElement.scrollHeight - innerHeight; barra.style.setProperty("--p", m>0 ? Math.min(1, scrollY/m) : 0); }
  addEventListener("scroll", function(){ if(!pend){ pend = true; requestAnimationFrame(leer_); } }, {passive:true}); leer_();
  li.querySelectorAll("[data-lang]").forEach(function(b){ b.onclick = function(){ guardar("lang", b.dataset.lang); if(b.dataset.lang!==PF.lang) location.href = PF.urlIdioma(b.dataset.lang); }; });
  if(PF.lang !== "es" && !D.body.hasAttribute("data-traducida")){
    var av = PF.el("div",{class:"aviso-idioma",role:"note"}, '<p>'+T("aviso-idioma")+'</p>');
    var main = D.getElementById("contenido"); if(main) main.insertBefore(av, main.firstChild);
  }
  // encabezado compacto al hacer scroll
  var compacto = false;
  window.addEventListener("scroll", function(){ var c = window.scrollY > 24; if(c!==compacto){ compacto=c; top.classList.toggle("pf-top--scroll", c); } }, {passive:true});
  D.getElementById("pf-tema").onclick = cambiarTema;
  D.getElementById("pf-nivel").onclick = abrirNivel;
  D.getElementById("pf-buscar").onclick = abrirBuscador;

  // pie
  var pie = PF.el("footer",{class:"pf-pie"},
   '<div class="pf-pie__in">'+
    '<div><b>Pura Física!</b><p class="chico">'+T("Física explicada a cinco niveles, del patio de recreo al pizarrón de posgrado. Hecho en CECyT 16 “Hidalgo”, IPN.")+'</p></div>'+
    '<div><b>'+T("Aprender")+'</b>'+PF.paginas.slice(0,6).map(function(p){return '<a href="'+PF.url(p.id)+'">'+T(p.t)+'</a>';}).join("")+'</div>'+
    '<div><b>'+T("Explorar")+'</b>'+PF.paginas.slice(6).map(function(p){return '<a href="'+PF.url(p.id)+'">'+T(p.t)+'</a>';}).join("")+'</div>'+
    '<div><b>'+T("Tu nivel")+'</b><p class="chico">'+T("Elige cómo quieres que te expliquen las cosas. Puedes cambiarlo cuando quieras.")+'</p><button class="btn chico" type="button" data-abrir-nivel>'+T("Cambiar nivel")+'</button></div>'+
   '</div>');
  D.body.appendChild(pie);
  pie.querySelector("[data-abrir-nivel]").onclick = abrirNivel;

  var subir = PF.el("button",{class:"btn-ico pf-subir","aria-label":T("Volver arriba")},"↑");
  subir.onclick = function(){ window.scrollTo({top:0}); };
  D.body.appendChild(subir);
  window.addEventListener("scroll", function(){ subir.classList.toggle("visible", window.scrollY > 900); }, {passive:true});
}

/* ---------- regla de niveles ---------- */
PF.regla = function(){
  var n = PF.nivel();
  return '<div class="regla"><div class="regla__marcas" role="group" aria-label="Elige tu nivel">'+
    PF.NIVELES.map(function(x){
      return '<button type="button" class="regla__btn" data-n="'+x.n+'" aria-pressed="'+(x.n===n)+'"><span class="num">'+x.n+'</span><b>'+x.nom+'</b><small>'+x.edad+'</small></button>';
    }).join("")+'</div><p class="regla__desc">'+PF.NIVELES[n-1].d+'</p></div>';
};
function conectarReglas(raiz){
  (raiz||D).querySelectorAll(".regla__btn").forEach(function(b){
    if(b._ok) return; b._ok = 1;
    b.addEventListener("click", function(){ PF.ponerNivel(+b.dataset.n); });
  });
}
var popNivel;
function abrirNivel(){
  if(!popNivel){
    popNivel = PF.el("div",{class:"pf-pop",role:"dialog","aria-modal":"true","aria-labelledby":"pf-nivel-t"},
      '<div class="pf-pop__fondo"></div><div class="pf-pop__caja"><h2 id="pf-nivel-t">'+T("¿Cómo quieres que te lo expliquen?")+'</h2>'+
      '<p class="chico">'+T("Todo el sitio se adapta: textos, fórmulas, simulaciones y preguntas. Cada explicación también tiene botones para ver los otros niveles.")+'</p>'+
      PF.regla()+'<div class="fila-btn" style="justify-content:flex-end"><button class="btn prim" type="button" data-cerrar>'+T("Listo")+'</button></div></div>');
    D.body.appendChild(popNivel);
    conectarReglas(popNivel);
    popNivel.querySelector(".pf-pop__fondo").onclick = cerrarNivel;
    popNivel.querySelector("[data-cerrar]").onclick = cerrarNivel;
  }
  popNivel.setAttribute("data-abierto","");
  var act = popNivel.querySelector('.regla__btn[aria-pressed="true"]'); if(act) act.focus();
}
function cerrarNivel(){ if(popNivel){ popNivel.removeAttribute("data-abierto"); var b=D.getElementById("pf-nivel"); if(b) b.focus(); } }
PF.abrirNivel = abrirNivel;

/* ---------- buscador ---------- */
var popBusca;
function indice(){
  var lista = (window.PF_INDICE||[]).slice();
  var aqui = D.body.getAttribute("data-pagina");
  // complementa con encabezados de esta página
  D.querySelectorAll("main h2[id], main h3[id], main [data-buscar][id]").forEach(function(h){
    var t = (h.getAttribute("data-buscar")||h.textContent).trim();
    if(!lista.some(function(x){return x.p===aqui && x.a===h.id;})) lista.push({t:t,p:aqui,a:h.id,k:""});
  });
  return lista;
}
function norm(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }
function abrirBuscador(){
  if(!popBusca){
    popBusca = PF.el("div",{class:"pf-pop pf-busca",role:"dialog","aria-modal":"true","aria-label":"Buscar"},
     '<div class="pf-pop__fondo"></div><div class="pf-pop__caja"><input type="search" placeholder="'+T("Busca un tema: péndulo, entropía, Newton, cuántica…")+'" aria-label="'+T("Buscar")+'" autocomplete="off"><ul role="listbox"></ul></div>');
    D.body.appendChild(popBusca);
    var inp = popBusca.querySelector("input"), ul = popBusca.querySelector("ul"), sel = 0, res = [];
    var datos = indice();
    var nombrePag = {}; PF.paginas.forEach(function(p){nombrePag[p.id]=T(p.t);});
    function pintar(){
      var q = norm(inp.value.trim());
      var palabras = q.split(/\s+/).filter(Boolean);
      res = datos.map(function(x){
        var h = norm(x.t+" "+(x.k||"")), s = 0;
        if(!palabras.length) s = 1;
        palabras.forEach(function(w){ if(norm(x.t).indexOf(w)===0) s+=4; else if(norm(x.t).indexOf(w)>=0) s+=3; else if(h.indexOf(w)>=0) s+=1; else s-=100; });
        return {x:x,s:s};
      }).filter(function(r){return r.s>0;}).sort(function(a,b){return b.s-a.s;}).slice(0,40);
      sel = 0;
      ul.innerHTML = res.length ? res.map(function(r,i){
        return '<li><a role="option" href="'+PF.url(r.x.p, r.x.a)+'" aria-selected="'+(i===0)+'">'+r.x.t+'<small>'+(nombrePag[r.x.p]||"")+'</small></a></li>';
      }).join("") : '<li class="vacio">'+T("Sin resultados. Prueba con otra palabra, por ejemplo “energía” o “luz”.")+'</li>';
    }
    function mover(d){
      var as = ul.querySelectorAll("a"); if(!as.length) return;
      sel = (sel + d + as.length) % as.length;
      as.forEach(function(a,i){ a.setAttribute("aria-selected", String(i===sel)); });
      as[sel].scrollIntoView({block:"nearest"});
    }
    inp.addEventListener("input", pintar);
    inp.addEventListener("keydown", function(e){
      if(e.key==="ArrowDown"){e.preventDefault();mover(1);}
      else if(e.key==="ArrowUp"){e.preventDefault();mover(-1);}
      else if(e.key==="Enter"){ var a = ul.querySelectorAll("a")[sel]; if(a){ e.preventDefault(); cerrarBuscador(); location.href = a.href; } }
    });
    ul.addEventListener("click", function(e){ if(e.target.closest("a")) cerrarBuscador(); });
    popBusca.querySelector(".pf-pop__fondo").onclick = cerrarBuscador;
    pintar();
  }
  popBusca.setAttribute("data-abierto","");
  var i = popBusca.querySelector("input"); i.select(); i.focus();
}
function cerrarBuscador(){ if(popBusca) popBusca.removeAttribute("data-abierto"); }
D.addEventListener("keydown", function(e){
  if((e.ctrlKey||e.metaKey) && (e.key==="k"||e.key==="K")){ e.preventDefault(); abrirBuscador(); }
  else if(e.key==="/" && !/input|textarea|select/i.test((e.target.tagName||""))){ e.preventDefault(); abrirBuscador(); }
  else if(e.key==="Escape"){ cerrarBuscador(); cerrarNivel(); var c=D.querySelector(".pf-cajon"); if(c) c.removeAttribute("data-abierto"); }
});

/* ---------- explicaciones por nivel ---------- */
function prepararNiveles(raiz){
  raiz.querySelectorAll(".niveles").forEach(function(box){
    if(box._ok) return; box._ok = 1;
    var hijos = Array.prototype.filter.call(box.children, function(c){ return c.hasAttribute("data-n"); });
    var tabs = PF.el("div",{class:"niveles__tabs",role:"group","aria-label":"Ver explicación para otro nivel"});
    tabs.innerHTML = '<span>'+T("Explicación para:")+'</span>' + hijos.map(function(c){
      var n = +c.getAttribute("data-n");
      return '<button type="button" data-n="'+n+'" title="'+PF.NIVELES[n-1].edad+'">'+PF.NIVELES[n-1].nom+'</button>';
    }).join("");
    box.insertBefore(tabs, box.firstChild);
    tabs.addEventListener("click", function(e){
      var b = e.target.closest("button"); if(!b) return;
      box._manual = +b.dataset.n; mostrar(box, box._manual);
    });
  });
}
function mostrar(box, n){
  var hijos = Array.prototype.filter.call(box.children, function(c){ return c.hasAttribute("data-n"); });
  var elegido = null, mejor = -1;
  hijos.forEach(function(c){ var k=+c.getAttribute("data-n"); if(k<=n && k>mejor){mejor=k;elegido=c;} });
  if(!elegido){ elegido = hijos.reduce(function(a,c){ return (!a || +c.getAttribute("data-n") < +a.getAttribute("data-n")) ? c : a; }, null); }
  hijos.forEach(function(c){ c.classList.toggle("visible", c===elegido); });
  var k = elegido ? +elegido.getAttribute("data-n") : n;
  box.style.setProperty("--nv","var(--n"+k+")");
  box.querySelectorAll(".niveles__tabs button").forEach(function(b){ b.setAttribute("aria-pressed", String(+b.dataset.n===k)); });
}
function aplicarNivel(raiz){
  var n = PF.nivel();
  raiz.querySelectorAll(".niveles").forEach(function(box){ box._manual = null; mostrar(box, n); });
  raiz.querySelectorAll("[data-desde]").forEach(function(e){ e.classList.toggle("visible", n >= +e.getAttribute("data-desde")); });
  raiz.querySelectorAll("[data-hasta]").forEach(function(e){ e.classList.toggle("visible", n <= +e.getAttribute("data-hasta")); });
}

/* ---------- mapas explorables ---------- */
/* <div class="mapa" data-titulo="…"><script type="application/json">{t,d,f,a,h:[…]}</script></div> */
PF.mapa = function(el, datos){
  if(el._ok) return; el._ok = 1;
  if(!datos){ var s = el.querySelector('script[type="application/json"]'); datos = s ? JSON.parse(s.textContent) : null; }
  if(!datos) return;
  var colores = ["var(--n3)","var(--n2)","var(--n4)","var(--n1)","var(--n5)","var(--boli)"];
  var cont = 0, nodos = [];
  function li(nd, prof, color){
    var id = cont++; nodos[id] = nd;
    var c = prof===1 ? colores[(id-1)%colores.length] : color;
    if(prof===1){ nd._c = c; }
    var tieneH = nd.h && nd.h.length;
    var abierto = prof < (+el.getAttribute("data-abrir")||2);
    var h = '<li'+(tieneH && !abierto ? ' data-cerrado':'')+'><button type="button" class="nodo'+(prof===0?' raiz':'')+'" data-id="'+id+'" style="--c:'+(c||"var(--tinta)")+'"'+(tieneH?' aria-expanded="'+abierto+'"':'')+'>'+
      (tieneH ? '<span class="mas" aria-hidden="true">'+(abierto?"−":"+")+'</span>' : '')+nd.t+'</button>';
    if(tieneH){ h += '<ul>'+nd.h.map(function(x){ return li(x, prof+1, c); }).join("")+'</ul>'; }
    return h + '</li>';
  }
  var titulo = el.getAttribute("data-titulo") || ("Mapa: " + datos.t);
  el.innerHTML = '<div class="mapa__cab"><h4>'+titulo+'</h4><span class="chico">'+T("Toca un recuadro para abrirlo y leer qué es")+'</span>'+
    '<button type="button" class="btn chico" data-todo>'+T("Abrir todo")+'</button></div>'+
    '<div class="mapa__cuerpo"><div class="mapa__arbol"><ul class="arbol">'+li(datos,0,null)+'</ul></div><div class="mapa__info" aria-live="polite"></div></div>';
  var info = el.querySelector(".mapa__info");
  function verInfo(nd){
    var h = '<h5>'+nd.t+'</h5>'+(nd.d?'<p>'+nd.d+'</p>':'');
    if(nd.f) h += '<p>'+PF.texStr(nd.f, true)+'</p>';
    if(nd.a) h += '<p><a href="'+nd.a+'">'+T("Ir a la explicación completa")+'</a></p>';
    if(nd.h && nd.h.length) h += '<p class="chico">'+T("Contiene:")+' '+nd.h.map(function(x){return x.t;}).join(", ")+'.</p>';
    info.innerHTML = h;
  }
  verInfo(datos);
  el.querySelector(".arbol").addEventListener("click", function(e){
    var b = e.target.closest(".nodo"); if(!b) return;
    var nd = nodos[+b.dataset.id], li = b.parentNode;
    el.querySelectorAll(".nodo[aria-current]").forEach(function(x){x.removeAttribute("aria-current");});
    b.setAttribute("aria-current","true");
    if(nd.h && nd.h.length){
      var cerrado = li.hasAttribute("data-cerrado");
      if(cerrado) li.removeAttribute("data-cerrado"); else if(b._visto) li.setAttribute("data-cerrado","");
      b.setAttribute("aria-expanded", String(!li.hasAttribute("data-cerrado")));
      b.querySelector(".mas").textContent = li.hasAttribute("data-cerrado") ? "+" : "−";
    }
    b._visto = 1;
    verInfo(nd);
  });
  el.querySelector("[data-todo]").onclick = function(){
    var abrir = this.textContent === T("Abrir todo");
    el.querySelectorAll(".arbol li").forEach(function(l){ var b=l.querySelector(":scope>.nodo"); if(!l.querySelector(":scope>ul")) return; if(abrir) l.removeAttribute("data-cerrado"); else if(l.parentNode!==el.querySelector(".arbol")) l.setAttribute("data-cerrado",""); b.setAttribute("aria-expanded",String(!l.hasAttribute("data-cerrado"))); b.querySelector(".mas").textContent = l.hasAttribute("data-cerrado")?"+":"−"; });
    this.textContent = abrir ? T("Cerrar todo") : T("Abrir todo");
  };
};

/* ---------- progreso (sellos) ---------- */
PF.prog = function(){ try{ return JSON.parse(leer("prog","{}")) || {}; }catch(e){ return {}; } };
PF.guardarQuiz = function(id, aciertos, total){
  if(!id) return; var p = PF.prog(); p.q = p.q || {};
  var prev = p.q[id]; var r = aciertos/total;
  if(!prev || r > prev) p.q[id] = r;
  guardar("prog", JSON.stringify(p));
  D.dispatchEvent(new CustomEvent("pf:progreso"));
  if(r >= .6 && !(prev >= .6)){
    var hh = D.getElementById(id), nombre = hh && hh.tagName === "H3" ? hh.textContent.replace(/✓.*$/,"").trim() : "";
    PF.celebrar(nombre);
  }
};
PF.celebrar = function(nombre){
  var toast = PF.el("div",{class:"pf-toast",role:"status"}, '<span class="pf-toast__sello" aria-hidden="true">✓</span><span><b>'+T("¡Sello ganado!")+'</b>'+(nombre?'<small>'+nombre+'</small>':'')+'</span>');
  D.body.appendChild(toast);
  requestAnimationFrame(function(){ toast.classList.add("ver"); });
  setTimeout(function(){ toast.classList.remove("ver"); setTimeout(function(){ toast.remove(); }, 500); }, 3200);
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var cv = PF.el("canvas",{class:"pf-confeti","aria-hidden":"true"}); D.body.appendChild(cv);
  var dpr = Math.min(devicePixelRatio||1,2), W = innerWidth, Hh = innerHeight; cv.width = W*dpr; cv.height = Hh*dpr;
  var g = cv.getContext("2d"); g.scale(dpr,dpr);
  var cols = ["rojo","boli","verde","marca","n4","n1"].map(function(k){ return PF.color(k); });
  var ps = []; for(var i=0;i<150;i++){ var a = -Math.PI/2 + (Math.random()-.5)*1.3, v = 9+Math.random()*9;
    ps.push({x:W/2+(Math.random()-.5)*80, y:Hh*.62, vx:Math.cos(a)*v, vy:Math.sin(a)*v, w:5+Math.random()*6, h:8+Math.random()*8, r:Math.random()*6.28, vr:(Math.random()-.5)*.35, c:cols[i%cols.length], f:Math.random()*6.28}); }
  var t0 = performance.now();
  (function paso(ahora){
    var t = (ahora - t0)/1000; g.clearRect(0,0,W,Hh);
    ps.forEach(function(p){ p.vy += .32; p.vx *= .985; p.vy *= .985; p.x += p.vx + Math.sin(t*4+p.f)*.6; p.y += p.vy; p.r += p.vr;
      g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.scale(1, Math.cos(t*6+p.f)); g.globalAlpha = Math.max(0, 1 - Math.max(0,t-1.8)/1); g.fillStyle = p.c; g.fillRect(-p.w/2,-p.h/2,p.w,p.h); g.restore(); });
    if(t < 2.9) requestAnimationFrame(paso); else cv.remove();
  })(t0);
};
PF.sello = function(id){ var p = PF.prog(); return p.q && p.q[id] != null ? p.q[id] : null; };
function marcarSellos(){
  D.querySelectorAll(".tema-cab h3[id]").forEach(function(h){
    var r = PF.sello(h.id), cab = h.parentNode, s = cab.querySelector(".sello");
    if(r != null && r >= .6){ if(!s){ s = PF.el("span",{class:"sello",title:"Sello ganado en el quiz de este tema"},"✓ Sello"); cab.insertBefore(s, cab.querySelector(".etiq")); } }
  });
}
D.addEventListener("pf:progreso", marcarSellos);

/* ---------- quiz ---------- */
/* <div class="quiz" data-titulo="…"><script type="application/json">[{p,o:[],r,e,n}]</script></div> */
PF.quiz = function(el){
  if(el._ok) return; el._ok = 1;
  var s = el.querySelector('script[type="application/json"]'); if(!s) return;
  var todas = JSON.parse(s.textContent);
  var titulo = el.getAttribute("data-titulo") || T("Ponte a prueba");
  function preguntas(){
    var n = PF.nivel();
    var q = todas.filter(function(x){ return (x.n||1) <= n+1 && (x.n||1) >= n-2; });
    if(q.length < 3) q = todas.slice().sort(function(a,b){ return Math.abs((a.n||1)-n) - Math.abs((b.n||1)-n); }).slice(0,Math.min(4,todas.length));
    return q.slice(0,5);
  }
  var lista, i, aciertos, respondida;
  function iniciar(){ lista = preguntas(); i = 0; aciertos = 0; pintar(); }
  function pintar(){
    respondida = false;
    if(i >= lista.length){
      var pct = Math.round(100*aciertos/lista.length);
      var msg = pct===100 ? T("¡Perfecto! Dominas este tema.") : pct>=60 ? T("¡Bien! Repasa las que fallaste y vuelve a intentarlo.") : T("Vuelve a leer la explicación y prueba otra vez: así se aprende.");
      var art = el.closest(".tema"), qid = el.getAttribute("data-id") || (art && art.querySelector("h3[id]") ? art.querySelector("h3[id]").id : null);
      PF.guardarQuiz(qid, aciertos, lista.length);
      if(pct>=60 && qid) msg += " "+T("Ganaste el sello de este tema para tu cuaderno.");
      el.innerHTML = cab(1) + '<div class="quiz__cuerpo"><p class="quiz__preg">'+T("Resultado")+': '+aciertos+' / '+lista.length+'</p><p>'+msg+'</p><div class="quiz__pie"><button class="btn prim" type="button" data-otra>'+T("Intentar de nuevo")+'</button></div></div>';
      el.querySelector("[data-otra]").onclick = iniciar;
      return;
    }
    var q = lista[i];
    var orden = q.o.map(function(_,k){return k;});
    if(!q.fijo) orden.sort(function(){ return Math.random()-.5; });
    el.innerHTML = cab(i/lista.length) + '<div class="quiz__cuerpo"><p class="quiz__preg">'+q.p+'</p><div class="quiz__ops">'+
      orden.map(function(k){ return '<button type="button" class="quiz__op" data-k="'+k+'">'+q.o[k]+'</button>'; }).join("")+
      '</div><div class="quiz__salida"></div></div>';
    PF.tex(el);
    el.querySelectorAll(".quiz__op").forEach(function(b){
      b.onclick = function(){
        if(respondida) return; respondida = true;
        var k = +b.dataset.k, ok = k===q.r;
        if(ok) aciertos++;
        el.querySelectorAll(".quiz__op").forEach(function(x){ x.disabled = true; if(+x.dataset.k===q.r) x.setAttribute("data-r","bien"); });
        if(!ok) b.setAttribute("data-r","mal");
        el.querySelector(".quiz__salida").innerHTML = '<div class="quiz__exp"><b>'+(ok?T("Correcto."):T("No exactamente."))+'</b>'+(q.e||"")+'</div><div class="quiz__pie"><button class="btn prim" type="button">'+(i+1<lista.length?T("Siguiente pregunta"):T("Ver resultado"))+'</button></div>';
        PF.tex(el.querySelector(".quiz__exp"));
        var sig = el.querySelector(".quiz__pie .btn"); sig.onclick = function(){ i++; pintar(); el.querySelector(".quiz__op, .btn").focus(); }; sig.focus();
      };
    });
  }
  function cab(p){
    return '<div class="quiz__cab"><h4>'+titulo+'</h4><span class="chico">'+(i<lista.length?(T("Pregunta")+" "+(i+1)+" / "+lista.length):T("Terminado"))+'</span></div><div class="quiz__barra"><i style="width:'+(p*100)+'%"></i></div>';
  }
  iniciar();
  D.addEventListener("pf:nivel", iniciar);
};

/* ---------- pasos revelables ---------- */
PF.pasos = function(el){
  if(el._ok) return; el._ok = 1;
  var lis = el.querySelectorAll("li"); var k = 0;
  var fila = PF.el("div",{class:"fila-btn"});
  var b = PF.el("button",{class:"btn chico prim",type:"button"},T("Mostrar el primer paso"));
  var t = PF.el("button",{class:"btn chico",type:"button"},T("Ver todo"));
  fila.appendChild(b); fila.appendChild(t); el.appendChild(fila);
  function act(){ b.textContent = k>=lis.length ? T("Ocultar pasos") : (k===0 ? T("Mostrar el primer paso") : T("Siguiente paso")+" ("+(k+1)+" / "+lis.length+")"); }
  b.onclick = function(){
    if(k>=lis.length){ lis.forEach(function(l){l.classList.remove("visible");}); k=0; }
    else { lis[k].classList.add("visible"); k++; }
    act();
  };
  t.onclick = function(){ lis.forEach(function(l){l.classList.add("visible");}); k = lis.length; act(); };
};

/* ---------- índice lateral con seguimiento ---------- */
function indiceLateral(){
  var cont = D.querySelector(".indice[data-auto]"); if(!cont) return;
  var hs = Array.prototype.slice.call(D.querySelectorAll(cont.getAttribute("data-auto")||"main h2[id]"));
  if(!hs.length) return;
  cont.innerHTML = '<b>'+(cont.getAttribute("data-titulo")||T("En esta página"))+'</b><ol>'+hs.map(function(h){
    return '<li class="'+(h.tagName==="H3"?"sub":"")+'"><a href="#'+h.id+'">'+(h.getAttribute("data-corto")||h.textContent)+'</a></li>';
  }).join("")+'</ol>';
  var enlaces = cont.querySelectorAll("a");
  if(!("IntersectionObserver" in window)) return;
  var visibles = new Map();
  var io = new IntersectionObserver(function(ents){
    ents.forEach(function(en){ visibles.set(en.target, en.boundingClientRect.top); });
    var activo = null;
    hs.forEach(function(h){ if(h.getBoundingClientRect().top < 160) activo = h; });
    enlaces.forEach(function(a){ if(a.getAttribute("href")==="#"+(activo&&activo.id)) a.setAttribute("data-activo",""); else a.removeAttribute("data-activo"); });
  },{rootMargin:"-80px 0px -60% 0px",threshold:[0,1]});
  hs.forEach(function(h){ io.observe(h); });
  window.addEventListener("scroll", function(){
    var activo = null; hs.forEach(function(h){ if(h.getBoundingClientRect().top < 160) activo = h; });
    enlaces.forEach(function(a){ if(a.getAttribute("href")==="#"+(activo&&activo.id)) a.setAttribute("data-activo",""); else a.removeAttribute("data-activo"); });
  },{passive:true});
}

/* ---------- arranque ---------- */
PF.traducir = function(raiz){
  (raiz||D).querySelectorAll("[data-i18n]").forEach(function(e){ var k = e.getAttribute("data-i18n"); if(PF.lang!=="es" && DIC[k]) e.innerHTML = T(k); });
};
PF.montar = function(raiz){
  raiz = raiz || D;
  prepararNiveles(raiz);
  aplicarNivel(raiz);
  raiz.querySelectorAll(".mapa").forEach(function(m){ PF.mapa(m); });
  raiz.querySelectorAll(".quiz").forEach(function(q){ PF.quiz(q); });
  raiz.querySelectorAll(".pasos").forEach(function(p){ PF.pasos(p); });
  conectarReglas(raiz);
  if(window.PFSim) PFSim.montarTodas(raiz);
};
function arrancar(){
  PF.traducir(D);
  construirEncabezado();
  PF.tex(D.body);
  PF.montar(D);
  indiceLateral();
  marcarSellos();
  // saltos a anclas: corrige la posición mientras se montan simulaciones perezosas
  var usuarioMovio = false;
  ["wheel","touchstart","keydown"].forEach(function(ev){ window.addEventListener(ev, function(){ usuarioMovio = true; }, {passive:true}); });
  PF.irA = function(t, suave){
    usuarioMovio = false;
    t.scrollIntoView({behavior: suave ? "smooth" : "instant"});
    [450, 1000, 1700, 2600].forEach(function(ms){ setTimeout(function(){ if(!usuarioMovio) t.scrollIntoView({behavior: suave && ms < 1000 ? "smooth" : "instant"}); }, ms); });
  };
  if(location.hash){ var t = D.getElementById(decodeURIComponent(location.hash.slice(1))); if(t) setTimeout(function(){ PF.irA(t); }, 60); }
  window.addEventListener("hashchange", function(){ var t = D.getElementById(decodeURIComponent(location.hash.slice(1))); if(t) PF.irA(t); });
  D.addEventListener("click", function(e){
    var a = e.target.closest('a[href^="#"]'); if(!a || e.defaultPrevented) return;
    var id = decodeURIComponent(a.getAttribute("href").slice(1)); var t = id && D.getElementById(id); if(!t) return;
    e.preventDefault(); try{ history.pushState(null, "", "#"+id); }catch(_){}
    PF.irA(t, true);
  });
  D.querySelectorAll(".rama, .tema, .ficha, .lab-item, .fisico, .carta, .recurso, .sello-c, .descubrimiento, .mito, .practica, .ruta-etapa, .preg, .puerta").forEach(function(e, i){ if(!e.hasAttribute("data-revela") && !e.closest(".historia")){ e.setAttribute("data-revela",""); } });
  PF.revelar(D);
  PF.inclinar(D);
  PF.listo = true;
  D.dispatchEvent(new CustomEvent("pf:listo"));
}
if(D.readyState === "complete") arrancar(); else D.addEventListener("DOMContentLoaded", arrancar);
})();
