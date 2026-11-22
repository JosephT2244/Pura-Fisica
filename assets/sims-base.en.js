/* Pura Física! — motor de simulaciones + mecánica */
(function(){
"use strict";
var D = document;
var PFSim = window.PFSim = window.PFSim || {registro:{}};
PFSim.def = function(id, meta, fn){ PFSim.registro[id] = {meta:meta, fn:fn}; };

var DPR = Math.min(window.devicePixelRatio || 1, 2);
var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- contexto de cada simulación ---------------- */
function Ctx(el, def){
  var c = this;
  c.el = el; c.meta = def.meta; c.visible = true; c._loops = []; c._nivelFns = []; c._temaFns = []; c._resize = [];
  el.innerHTML = '';
  var cab = PF.el("div",{class:"sim__cab"},'<h4>'+(el.getAttribute("data-titulo")||def.meta.t)+'</h4>'+(def.meta.ayuda?'<span class="sim__ayuda">'+def.meta.ayuda+'</span>':''));
  c.lienzo = PF.el("div",{class:"sim__lienzo"});
  c.datosEl = PF.el("div",{class:"sim__datos","aria-live":"polite"});
  c.ctrlEl = PF.el("div",{class:"sim__ctrl"});
  c.notaEl = PF.el("div",{class:"sim__nota"});
  el.appendChild(cab); el.appendChild(c.lienzo); el.appendChild(c.datosEl); el.appendChild(c.ctrlEl); el.appendChild(c.notaEl);
  c.n = PF.nivel();
  c.opc = {}; // data-* extra
  for(var i=0;i<el.attributes.length;i++){ var a = el.attributes[i]; if(a.name.indexOf("data-o-")===0) c.opc[a.name.slice(7)] = a.value; }
  D.addEventListener("pf:nivel", function(e){ c.n = e.detail; c._nivelFns.forEach(function(f){ f(c.n); }); });
  D.addEventListener("pf:tema", function(){ c._col = {}; c._temaFns.forEach(function(f){ f(); }); });
  c._col = {};
}
var P = Ctx.prototype;
P.col = function(v){ if(!this._col[v]) this._col[v] = PF.color(v) || "#000"; return this._col[v]; };
P.alNivel = function(f){ this._nivelFns.push(f); };
P.alTema = function(f){ this._temaFns.push(f); };
P.alRedim = function(f){ this._resize.push(f); };

/* lienzo con escalado por DPR y redimensión automática */
P.canvas = function(aspecto, minH, maxH, padre){
  var c = this, cv = D.createElement("canvas"), g = cv.getContext("2d");
  (padre||c.lienzo).appendChild(cv);
  cv.setAttribute("role","img"); cv.setAttribute("aria-label", c.meta.t);
  function ajustar(){
    var w = (padre||c.lienzo).clientWidth || 600;
    var h = Math.round(Math.max(minH||220, Math.min(maxH||520, w*aspecto)));
    cv.style.height = h+"px";
    cv.width = Math.round(w*DPR); cv.height = Math.round(h*DPR);
    g.setTransform(DPR,0,0,DPR,0,0);
    cv.W = w; cv.H = h;
    if(!padre){ c.W = w; c.H = h; }
    c._resize.forEach(function(f){ f(); });
  }
  ajustar();
  if(window.ResizeObserver){ var ro = new ResizeObserver(function(){ var w=(padre||c.lienzo).clientWidth; if(Math.abs(w-cv.W)>1) ajustar(); }); ro.observe(padre||c.lienzo); }
  else window.addEventListener("resize", ajustar);
  if(!padre){ c.cv = cv; c.g = g; }
  return g;
};
P.limpiar = function(g){ g = g||this.g; var cv = g.canvas; g.clearRect(0,0,cv.W||this.W,cv.H||this.H); };

/* controles */
P.slider = function(o){
  var c = this, id = "s"+Math.random().toString(36).slice(2,8);
  var w = PF.el("div",{class:"ctrl"});
  var fmt = o.fmt || function(v){ return PF.fmt(v, o.dec==null?2:o.dec) + (o.u?" "+o.u:""); };
  w.innerHTML = '<label for="'+id+'"><span>'+o.l+'</span><output></output></label><input id="'+id+'" type="range" min="'+o.min+'" max="'+o.max+'" step="'+(o.paso||"any")+'" value="'+o.v+'">';
  var inp = w.querySelector("input"), out = w.querySelector("output");
  var api = { el:w, get v(){ return o.log ? Math.pow(10,+inp.value) : +inp.value; }, set:function(v){ inp.value = o.log ? Math.log10(v) : v; out.textContent = fmt(api.v); }, mostrar:function(s){ w.style.display = s?"":"none"; } };
  out.textContent = fmt(api.v);
  inp.addEventListener("input", function(){ out.textContent = fmt(api.v); if(o.on) o.on(api.v); });
  (o.en||c.ctrlEl).appendChild(w);
  return api;
};
P.select = function(o){
  var c = this, id = "s"+Math.random().toString(36).slice(2,8);
  var w = PF.el("div",{class:"ctrl"});
  w.innerHTML = '<label for="'+id+'"><span>'+o.l+'</span></label><select id="'+id+'">'+o.ops.map(function(p){ return '<option value="'+p[0]+'"'+(String(p[0])===String(o.v)?" selected":"")+'>'+p[1]+'</option>'; }).join("")+'</select>';
  var s = w.querySelector("select");
  s.addEventListener("change", function(){ if(o.on) o.on(s.value); });
  (o.en||c.ctrlEl).appendChild(w);
  return { el:w, get v(){ return s.value; }, set:function(v){ s.value = v; }, mostrar:function(x){ w.style.display = x?"":"none"; } };
};
P.botones = function(){
  var w = PF.el("div",{class:"ctrl ctrl-btns"}); this.ctrlEl.appendChild(w);
  var api = { el:w, b:function(txt, on, prim){ var b = PF.el("button",{type:"button",class:"btn chico"+(prim?" prim":"")}, txt); b.onclick = on; w.appendChild(b); return b; },
    check:function(txt, v, on){ var l = PF.el("label",{class:"chico",style:"display:inline-flex;gap:.35rem;align-items:center;cursor:pointer"}, '<input type="checkbox"'+(v?" checked":"")+'> '+txt); var i = l.querySelector("input"); i.onchange = function(){ on(i.checked); }; w.appendChild(l); return i; } };
  return api;
};
P.datos = function(h){ this.datosEl.innerHTML = h || ""; this.datosEl.style.display = h ? "" : "none"; };
P.nota = function(h){ this.notaEl.innerHTML = h || ""; if(h) PF.tex(this.notaEl); };
P.datosTex = function(h){ this.datos(h); PF.tex(this.datosEl); };

/* bucle de animación que se pausa fuera de pantalla */
P.loop = function(fn){
  var c = this, t0 = null, vivo = true;
  function paso(t){
    if(!vivo) return;
    if(!c.el.isConnected){ vivo = false; return; }
    if(c.visible && !D.hidden){
      var dt = t0==null ? 0.016 : Math.min(0.05, (t - t0)/1000);
      fn(dt);
    }
    t0 = t;
    requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
  return { parar:function(){ vivo = false; } };
};

/* puntero (mouse/táctil) en coordenadas CSS del lienzo */
P.puntero = function(cv, h){
  cv = cv || this.cv;
  function pos(e){ var r = cv.getBoundingClientRect(); return {x:e.clientX - r.left, y:e.clientY - r.top}; }
  var abajo = false;
  cv.addEventListener("pointerdown", function(e){ abajo = true; try{cv.setPointerCapture(e.pointerId);}catch(_){} if(h.abajo) h.abajo(pos(e), e); });
  cv.addEventListener("pointermove", function(e){ if(h.mover) h.mover(pos(e), abajo, e); });
  cv.addEventListener("pointerup", function(e){ if(abajo && h.arriba) h.arriba(pos(e), e); abajo = false; });
  cv.addEventListener("pointercancel", function(){ abajo = false; });
};

/* --------- dibujo --------- */
var F = PFSim.dib = {};
F.flecha = function(g, x1, y1, x2, y2, color, ancho, etq, opt){
  opt = opt || {};
  var dx = x2-x1, dy = y2-y1, L = Math.hypot(dx,dy);
  if(L < 1) return;
  var a = Math.atan2(dy,dx), cab = Math.min(12, 4 + L*.25);
  g.save(); g.strokeStyle = g.fillStyle = color; g.lineWidth = ancho||2.5; g.lineCap = "round";
  if(opt.guion) g.setLineDash([5,4]);
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2 - Math.cos(a)*cab*.6, y2 - Math.sin(a)*cab*.6); g.stroke();
  g.setLineDash([]);
  g.beginPath(); g.moveTo(x2,y2); g.lineTo(x2 - cab*Math.cos(a-.42), y2 - cab*Math.sin(a-.42)); g.lineTo(x2 - cab*Math.cos(a+.42), y2 - cab*Math.sin(a+.42)); g.closePath(); g.fill();
  if(etq){ F.texto(g, etq, x2 + Math.cos(a)*10 + (opt.ex||0), y2 + Math.sin(a)*10 + (opt.ey||0), {color:color, mano:true, tam:opt.tam||19, alin: Math.cos(a)>0.3?"left":(Math.cos(a)<-0.3?"right":"center"), base:"middle"}); }
  g.restore();
};
F.texto = function(g, s, x, y, o){
  o = o || {};
  g.save();
  g.fillStyle = o.color || "#000";
  g.font = (o.negr?"700 ":"") + (o.tam||14) + "px " + (o.mano ? '"Caveat","Segoe Print",cursive' : (o.serif ? '"Young Serif",Georgia,serif' : '"Atkinson","Segoe UI",sans-serif'));
  g.textAlign = o.alin || "left"; g.textBaseline = o.base || "alphabetic";
  if(o.fondo){ var w = g.measureText(s).width, t = (o.tam||14); g.fillStyle = o.fondo; var xx = o.alin==="center"? x-w/2 : (o.alin==="right"? x-w : x); g.fillRect(xx-3, y-t*0.85, w+6, t*1.15); g.fillStyle = o.color||"#000"; }
  g.fillText(s, x, y);
  g.restore();
};
F.linea = function(g, pts, color, ancho, guion){
  g.save(); g.strokeStyle = color; g.lineWidth = ancho||1.5; if(guion) g.setLineDash(guion);
  g.beginPath(); pts.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.stroke(); g.restore();
};
F.circulo = function(g, x, y, r, relleno, borde, ancho){
  g.beginPath(); g.arc(x,y,r,0,Math.PI*2);
  if(relleno){ g.fillStyle = relleno; g.fill(); }
  if(borde){ g.strokeStyle = borde; g.lineWidth = ancho||1.5; g.stroke(); }
};
F.rect = function(g, x, y, w, h, relleno, borde, ancho){
  if(relleno){ g.fillStyle = relleno; g.fillRect(x,y,w,h); }
  if(borde){ g.strokeStyle = borde; g.lineWidth = ancho||1.5; g.strokeRect(x,y,w,h); }
};
/* ejes y gráfica sencilla */
F.grafica = function(g, x, y, w, h, o){
  // o: {xmin,xmax,ymin,ymax, series:[{pts:[[x,y]], color}], ex, ey, col, tinta}
  var tx = function(v){ return x + (v-o.xmin)/(o.xmax-o.xmin)*w; };
  var ty = function(v){ return y + h - (v-o.ymin)/(o.ymax-o.ymin)*h; };
  g.save();
  g.strokeStyle = o.rejilla || "rgba(0,0,0,.08)"; g.lineWidth = 1;
  var nx = o.nx||5, ny = o.ny||4;
  for(var i=0;i<=nx;i++){ var xv = x + i*w/nx; g.beginPath(); g.moveTo(xv,y); g.lineTo(xv,y+h); g.stroke(); }
  for(var j=0;j<=ny;j++){ var yv = y + j*h/ny; g.beginPath(); g.moveTo(x,yv); g.lineTo(x+w,yv); g.stroke(); }
  g.strokeStyle = o.tinta; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+h); g.lineTo(x+w,y+h); g.stroke();
  if(o.ymin<0 && o.ymax>0){ g.setLineDash([3,3]); g.beginPath(); g.moveTo(x,ty(0)); g.lineTo(x+w,ty(0)); g.stroke(); g.setLineDash([]); }
  F.texto(g, o.ey||"", x+4, y+12, {color:o.tinta, tam:12});
  F.texto(g, o.ex||"", x+w, y+h-5, {color:o.tinta, tam:12, alin:"right"});
  F.texto(g, PF.fmt(o.ymax,1), x-4, y+4, {color:o.tinta2||o.tinta, tam:11, alin:"right", base:"middle"});
  F.texto(g, PF.fmt(o.ymin,1), x-4, y+h, {color:o.tinta2||o.tinta, tam:11, alin:"right", base:"middle"});
  F.texto(g, PF.fmt(o.xmax,1), x+w, y+h+13, {color:o.tinta2||o.tinta, tam:11, alin:"right"});
  (o.series||[]).forEach(function(s){
    g.strokeStyle = s.color; g.lineWidth = s.ancho||2.2; g.beginPath();
    s.pts.forEach(function(p,k){ var X = tx(p[0]), Y = ty(Math.max(o.ymin,Math.min(o.ymax,p[1]))); if(k) g.lineTo(X,Y); else g.moveTo(X,Y); });
    g.stroke();
    if(s.punto && s.pts.length){ var u = s.pts[s.pts.length-1]; F.circulo(g, tx(u[0]), ty(Math.max(o.ymin,Math.min(o.ymax,u[1]))), 4, s.color); }
  });
  g.restore();
  return {tx:tx, ty:ty};
};

/* --------- montaje perezoso --------- */
var ioVis = "IntersectionObserver" in window ? new IntersectionObserver(function(ents){ ents.forEach(function(e){ if(e.target._ctx) e.target._ctx.visible = e.isIntersecting; }); },{rootMargin:"100px"}) : null;
function montar(el){
  if(el._ctx || el._montando) return; el._montando = 1;
  var id = el.getAttribute("data-sim"), def = PFSim.registro[id];
  if(!def){ el.innerHTML = '<div class="sim__nota">Simulation «'+id+'» unavailable.</div>'; return; }
  var c = new Ctx(el, def); el._ctx = c;
  try{ def.fn(c); }catch(err){ console.error("Sim "+id, err); c.nota("This simulation couldn't start in your browser."); }
  if(ioVis) ioVis.observe(el);
  if(D.fonts && D.fonts.ready) D.fonts.ready.then(function(){ c._resize.forEach(function(f){ f(); }); });
}
PFSim.montar = montar;
var ioLazy = "IntersectionObserver" in window ? new IntersectionObserver(function(ents){ ents.forEach(function(e){ if(e.isIntersecting){ ioLazy.unobserve(e.target); montar(e.target); } }); },{rootMargin:"400px"}) : null;
PFSim.montarTodas = function(raiz){
  (raiz||D).querySelectorAll(".sim[data-sim]").forEach(function(el){
    if(el._ctx || el._obs) return; el._obs = 1;
    if(ioLazy && !el.hasAttribute("data-ya")) ioLazy.observe(el); else montar(el);
  });
};

/* ======================================================================
   MECÁNICA
   ====================================================================== */
var G_PLANETAS = {tierra:[9.81,"Earth"], luna:[1.62,"Moon"], marte:[3.71,"Mars"], jupiter:[24.79,"Jupiter"], venus:[8.87,"Venus"]};

/* ---------- Lanzador de proyectiles (portada) ---------- */
PFSim.def("lanzador",{t:"Projectile launcher", ayuda:"Drag from the cannon to aim and release to fire"}, function(c){
  var g = c.canvas(.5, 300, 520);
  var VMAX = 40, ang = 45, vel = 25, grav = 9.81, aire = false;
  var tiros = [], bola = null, apuntando = false, dianaX = 0, aciertos = 0, mensaje = "";
  var sAng = c.slider({l:"Angle", min:5, max:85, paso:1, v:ang, u:"°", dec:0, on:function(v){ang=v;}});
  var sVel = c.slider({l:"Initial speed", min:5, max:VMAX, paso:.5, v:vel, u:"m/s", dec:1, on:function(v){vel=v;}});
  var sG = c.select({l:"Place", ops:Object.keys(G_PLANETAS).map(function(k){return [k, G_PLANETAS[k][1]+" (g = "+G_PLANETAS[k][0]+" m/s²)"];}), v:"tierra", on:function(v){ grav = G_PLANETAS[v][0]; tiros=[]; nuevaDiana(); }});
  var bb = c.botones();
  bb.b("Fire", disparar, true);
  bb.b("Clear trails", function(){ tiros = []; });
  var chkAire = bb.check("Air resistance", false, function(v){ aire = v; });
  function escala(){ var R = VMAX*VMAX/grav; return Math.min((c.W-70)/(R*1.02), (c.H-50)/(R*.52)); }
  function origen(){ return {x:40, y:c.H-28}; }
  function nuevaDiana(){ var R = VMAX*VMAX/grav; dianaX = R*(.25 + Math.random()*.6); }
  nuevaDiana();
  function disparar(){
    var a = ang*Math.PI/180;
    bola = {x:0, y:0, vx:vel*Math.cos(a), vy:vel*Math.sin(a), t:0, pts:[[0,0]], hmax:0, sig:.1, v0:vel, ang:ang};
    mensaje = "";
  }
  function vista(){ chkAire.parentNode.style.display = c.n>=4 ? "" : "none"; if(c.n<4) aire=false; }
  vista(); c.alNivel(vista);
  c.puntero(c.cv, {
    abajo:function(p){ apuntando = true; apuntar(p); },
    mover:function(p, ab){ if(ab) apuntar(p); },
    arriba:function(){ if(apuntando){ apuntando = false; disparar(); } }
  });
  function apuntar(p){
    var o = origen(), dx = p.x - o.x, dy = o.y - p.y;
    var a = Math.atan2(dy, dx)*180/Math.PI; a = Math.max(5, Math.min(85, a));
    var L = Math.hypot(dx,dy); var v = Math.max(5, Math.min(VMAX, L/ (Math.min(c.W,c.H)*.55) * VMAX));
    ang = Math.round(a); vel = Math.round(v*2)/2; sAng.set(ang); sVel.set(vel);
  }
  c.loop(function(dt){
    if(bola){
      var pasos = 8, h = dt/pasos;
      for(var i=0;i<pasos && bola;i++){
        var ax = 0, ay = -grav;
        if(aire){ var v = Math.hypot(bola.vx,bola.vy), k = 0.012; ax -= k*v*bola.vx; ay -= k*v*bola.vy; }
        bola.vx += ax*h; bola.vy += ay*h; bola.x += bola.vx*h; bola.y += bola.vy*h; bola.t += h;
        bola.hmax = Math.max(bola.hmax, bola.y);
        if(bola.t >= bola.sig){ bola.pts.push([bola.x,bola.y]); bola.sig += .1; }
        if(bola.y < 0){
          // interpolar al suelo
          var f = bola.y/(bola.vy*h); bola.x -= bola.vx*h*f; bola.t -= h*f; bola.y = 0; bola.pts.push([bola.x,0]);
          var R = VMAX*VMAX/grav, tol = R*.025;
          if(Math.abs(bola.x - dianaX) < tol){ aciertos++; mensaje = c.n<=2 ? "You hit the target!" : "Hit! Error: "+PF.fmt(Math.abs(bola.x-dianaX),2)+" m"; setTimeout(nuevaDiana, 900); }
          else mensaje = bola.x < dianaX ? (c.n<=2?"A little short":"Short by "+PF.fmt(dianaX-bola.x,1)+" m") : (c.n<=2?"You overshot":"Long by "+PF.fmt(bola.x-dianaX,1)+" m");
          tiros.push(bola); if(tiros.length>5) tiros.shift();
          var fin = bola; bola = null; info(fin);
        }
      }
    }
    dibujar();
  });
  function info(b){
    if(!b){ c.datos(""); return; }
    var R = b.x, T = b.t, Hm = b.hmax;
    if(c.n===1) c.datos('<span>The ball landed <b>'+PF.fmt(R,0)+' m</b> away and rose <b>'+PF.fmt(Hm,0)+' m</b>.</span><span>Targets: <b>'+aciertos+'</b></span>');
    else {
      var h = '<span>Range: <b>'+PF.fmt(R,2)+' m</b></span><span>Max height: <b>'+PF.fmt(Hm,2)+' m</b></span><span>Flight time: <b>'+PF.fmt(T,2)+' s</b></span><span>Targets: <b>'+aciertos+'</b></span>';
      if(c.n>=3 && !aire){ var a=b.ang*Math.PI/180; h += '<span class="ec">Theory (no air): \\(R=\\dfrac{v_0^2\\sin 2\\theta}{g}=\\dfrac{('+b.v0+')^2\\sin '+(2*b.ang)+'^\\circ}{'+grav+'}='+PF.fmt(b.v0*b.v0*Math.sin(2*a)/grav,2)+'\\,\\text{m}\\)</span>'; }
      c.datosTex(h);
    }
  }
  function aPix(x,y){ var s = escala(), o = origen(); return [o.x + x*s, o.y - y*s]; }
  function dibujar(){
    c.limpiar();
    var tinta = c.col("tinta"), rojo = c.col("rojo"), boli = c.col("boli"), t3 = c.col("tinta-3"), verde = c.col("verde");
    var o = origen(), s = escala();
    // suelo y regla
    F.linea(g, [[0,o.y],[c.W,o.y]], tinta, 2);
    var R = VMAX*VMAX/grav, paso = R>400?100:(R>150?20:10);
    for(var m=0; m<=R*1.02; m+=paso){ var X = o.x+m*s; F.linea(g,[[X,o.y],[X,o.y+6]], tinta, 1); if(X < c.W-20) F.texto(g, m+" m", X, o.y+19, {color:t3, tam:11, alin:"center"}); }
    // diana
    var dx = o.x + dianaX*s, tol = R*.025*s;
    g.fillStyle = rojo; g.globalAlpha = .18; g.fillRect(dx-tol, o.y-6, tol*2, 6); g.globalAlpha = 1;
    F.circulo(g, dx, o.y-14, 10, null, rojo, 2); F.circulo(g, dx, o.y-14, 5, rojo);
    F.linea(g, [[dx,o.y-4],[dx,o.y]], rojo, 2);
    // trazos previos
    tiros.forEach(function(b, i){
      g.globalAlpha = .25 + .15*i/tiros.length;
      b.pts.forEach(function(p){ var q = aPix(p[0],p[1]); F.circulo(g, q[0], q[1], 2.2, t3); });
      g.globalAlpha = 1;
    });
    // cañón
    var a = ang*Math.PI/180, L = 34;
    g.save(); g.translate(o.x, o.y); g.rotate(-a); F.rect(g, -6, -7, L, 14, tinta); g.restore();
    F.circulo(g, o.x, o.y, 11, c.col("papel"), tinta, 2.5);
    // vector de apuntado
    if(c.n>=2 || apuntando){
      var Lv = vel/VMAX*Math.min(c.W,c.H)*.55;
      F.flecha(g, o.x, o.y, o.x + Lv*Math.cos(a), o.y - Lv*Math.sin(a), boli, 2, c.n>=2 ? "v₀ = "+vel+" m/s, "+ang+"°" : "", {guion:true});
    }
    // bola en vuelo
    if(bola){
      bola.pts.forEach(function(p){ var q = aPix(p[0],p[1]); F.circulo(g, q[0], q[1], 2.6, boli); });
      var q = aPix(bola.x, bola.y); F.circulo(g, q[0], q[1], 7, rojo, tinta, 1.5);
      if(c.n>=2){ var k = 1.6; F.flecha(g, q[0], q[1], q[0]+bola.vx*k, q[1]-bola.vy*k, boli, 2, c.n>=3?"v":""); }
      if(c.n>=3){ F.flecha(g, q[0], q[1], q[0]+bola.vx*1.6, q[1], verde, 1.6, "vx"); F.flecha(g, q[0], q[1], q[0], q[1]-bola.vy*1.6, verde, 1.6, "vy"); }
    } else if(tiros.length){
      var u = tiros[tiros.length-1];
      u.pts.forEach(function(p){ var q = aPix(p[0],p[1]); F.circulo(g, q[0], q[1], 2.6, boli); });
      var qf = aPix(u.x,0); F.texto(g, (c.n===1?"¡":"")+PF.fmt(u.x,1)+" m"+(c.n===1?"!":""), qf[0], qf[1]-30, {mano:true, tam:22, color:rojo, alin:"center"});
      if(c.n>=2){ var top = u.pts.reduce(function(a,p){return p[1]>a[1]?p:a;}, [0,0]); var qt = aPix(top[0],top[1]); F.texto(g, "h max ≈ "+PF.fmt(u.hmax,1)+" m", qt[0], qt[1]-12, {mano:true, tam:20, color:boli, alin:"center"}); }
    }
    if(mensaje) F.texto(g, mensaje, c.W-14, 30, {mano:true, tam:24, color:rojo, alin:"right"});
    if(!bola && !tiros.length) F.texto(g, c.W<560 ? "Drag and release to launch" : (c.n===1 ? "Drag from the cannon and release to launch!" : "Drag from the cannon to aim · release to launch"), c.W/2, 34, {mano:true, tam:Math.min(23, c.W/17), color:t3, alin:"center"});
  }
  c.nota(c.n>=3 ? "Each blue dot marks the position every 0.1 s: you'll see they're equally spaced horizontally (constant horizontal velocity) but not vertically (gravity accelerates downward)." : "Each little dot marks where the ball was every tenth of a second. See how they're closer together at the top? That's where the ball goes slowest.");
  c.alNivel(function(){ c.nota(c.n>=3 ? "Each blue dot marks the position every 0.1 s: horizontally they're equally spaced (constant horizontal velocity) but not vertically (gravity accelerates downward). Try 30° and 60°: with the same speed they land in the same spot." : "Each little dot marks where the ball was every tenth of a second. See how they're closer together at the top? That's where the ball goes slowest."); if(tiros.length) info(tiros[tiros.length-1]); });
});

/* ---------- 2ª y 3ª ley de Newton ---------- */
PFSim.def("newton",{t:"Push the box", ayuda:"Change the force, the mass and the friction"}, function(c){
  var g = c.canvas(.42, 260, 400);
  var modo = "2", m = 10, Fap = 30, mu = .2, x = 0, v = 0, dist = 0;
  var pat = {x1:-1, x2:1, v1:0, v2:0, m1:50, m2:70, emp:0};
  var sModo = c.select({l:"Experiment", ops:[["2","2nd law: F = m·a"],["3","3rd law: action and reaction"]], v:"2", on:function(v){ modo=v; vista(); reiniciar(); }});
  var sF = c.slider({l:"Applied force", min:-80, max:80, paso:1, v:Fap, u:"N", dec:0, on:function(v){Fap=v;}});
  var sM = c.slider({l:"Mass of the box", min:1, max:50, paso:1, v:m, u:"kg", dec:0, on:function(v){m=v;}});
  var sMu = c.slider({l:"Friction (μ)", min:0, max:.6, paso:.01, v:mu, dec:2, on:function(v){mu=v;}});
  var sM1 = c.slider({l:"Mass of skater A", min:20, max:120, paso:1, v:50, u:"kg", dec:0, on:function(v){pat.m1=v;}});
  var sM2 = c.slider({l:"Mass of skater B", min:20, max:120, paso:1, v:70, u:"kg", dec:0, on:function(v){pat.m2=v;}});
  var bb = c.botones();
  var bEmp = bb.b("Push off!", function(){ reiniciar(); pat.emp = .35; }, true);
  bb.b("Reset", reiniciar);
  function reiniciar(){ x=0; v=0; dist=0; pat.x1=-1; pat.x2=1; pat.v1=0; pat.v2=0; pat.emp=0; }
  function vista(){
    var d = modo==="2";
    sF.mostrar(d); sM.mostrar(d); sMu.mostrar(d); sM1.mostrar(!d); sM2.mostrar(!d); bEmp.style.display = d?"none":"";
  }
  vista();
  var g0 = 9.81, scroll = 0;
  c.loop(function(dt){
    if(modo==="2"){
      var N = m*g0, fs = (mu>0? mu+.1 : 0)*N, fk = mu*N, Fr = 0;
      if(Math.abs(v) < 1e-3){
        if(Math.abs(Fap) <= fs){ Fr = -Fap; v = 0; } else Fr = -Math.sign(Fap)*fk;
      } else Fr = -Math.sign(v)*fk;
      var a = (Fap + Fr)/m;
      var vn = v + a*dt;
      if(v !== 0 && Math.sign(vn) !== Math.sign(v) && Math.abs(Fap) <= fs){ vn = 0; }
      v = Math.max(-25, Math.min(25, vn)); x += v*dt; dist += Math.abs(v*dt);
      scroll = x;
      dibujar2(a, Fr, N);
    } else {
      if(pat.emp > 0){ var Fp = 120; pat.v1 -= Fp/pat.m1*dt; pat.v2 += Fp/pat.m2*dt; pat.emp -= dt; }
      pat.x1 += pat.v1*dt; pat.x2 += pat.v2*dt;
      dibujar3();
    }
  });
  function dibujar2(a, Fr, N){
    c.limpiar();
    var tinta = c.col("tinta"), rojo = c.col("rojo"), boli = c.col("boli"), verde = c.col("verde"), t3 = c.col("tinta-3");
    var suelo = c.H*.72, ppm = 60;
    F.linea(g, [[0,suelo],[c.W,suelo]], tinta, 2);
    // marcas del suelo que se desplazan
    var off = ((scroll*ppm) % 60 + 60) % 60;
    for(var X = -off; X < c.W; X += 60){ F.linea(g, [[X,suelo],[X-10,suelo+10]], t3, 1.2); }
    var bw = 60 + m*1.6, bh = 44 + m*.9, bx = c.W/2 - bw/2, by = suelo - bh;
    F.rect(g, bx, by, bw, bh, c.col("hoja"), tinta, 2);
    F.texto(g, m+" kg", c.W/2, by+bh/2, {alin:"center", base:"middle", tam:16, negr:true, color:tinta});
    var k = 2.2;
    if(Fap){ var sx = Fap>0 ? bx-4 : bx+bw+4; F.flecha(g, sx - Fap*k, by+bh/2, sx, by+bh/2, rojo, 3.5); F.texto(g, c.n===1?"push":"F = "+Fap+" N", sx - Fap*k/2, by+bh/2-12, {mano:true, tam:20, color:rojo, alin:"center"}); }
    if(Fr && c.n>=2){ var fx = bx+bw*.3; F.flecha(g, fx, suelo+12, fx + Fr*k, suelo+12, c.col("n1"), 3); F.texto(g, c.n>=3?"f = "+PF.fmt(Math.abs(Fr),1)+" N":"friction", fx + Fr*k/2, suelo+34, {mano:true, tam:20, color:c.col("n1"), alin:"center"}); }
    if(c.n>=3){
      F.flecha(g, bx+bw-10, by, bx+bw-10, by - Math.min(70,N*.06+20), verde, 2.2, "N");
      F.flecha(g, bx+bw-10, by+bh*.4, bx+bw-10, by+bh*.4 + Math.min(70,N*.06+20), verde, 2.2, "mg");
    }
    var Fn = Fap + Fr;
    if(c.n>=2 && Math.abs(Fn) > .05){ F.flecha(g, c.W/2, by-60, c.W/2 + Fn*k, by-60, boli, 3); F.texto(g, "Net F"+(c.n>=3?" = "+PF.fmt(Fn,1)+" N":""), c.W/2 + Fn*k + (Fn>0?8:-8), by-60, {mano:true, tam:20, color:boli, alin:Fn>0?"left":"right", base:"middle"}); }
    var h;
    if(c.n===1) h = '<span>'+(Math.abs(v)<.01 ? (Fap===0?"The box is still: nobody is pushing it.":"The box won't move! Friction is holding it back: push harder or use less friction.") : "The box moves "+(v>0?"to the right":"to the left")+" y "+(Math.abs(a)<.01?"at a steady speed.":(a*v>0?"faster and faster.":"and slows down.")))+'</span>';
    else h = '<span>Acceleration: <b>'+PF.fmt(a,2)+' m/s²</b></span><span>Velocity: <b>'+PF.fmt(v,2)+' m/s</b></span><span>Distance: <b>'+PF.fmt(dist,1)+' m</b></span>'+(c.n>=3?'<span>Max static friction: <b>'+PF.fmt((mu>0?mu+.1:0)*N,1)+' N</b></span>':'');
    c.datos(h);
  }
  function dibujar3(){
    c.limpiar();
    var tinta = c.col("tinta"), rojo = c.col("rojo"), boli = c.col("boli");
    var suelo = c.H*.8, ppm = 40, cx = c.W/2;
    F.linea(g, [[0,suelo],[c.W,suelo]], tinta, 2);
    function persona(x, m, col, et){
      var X = cx + x*ppm, h = 50 + m*.5;
      if(X < -40 || X > c.W+40) return X;
      F.circulo(g, X, suelo - h - 12, 11, null, col, 2.5);
      F.linea(g, [[X, suelo-h],[X, suelo-24]], col, 3);
      F.linea(g, [[X-12, suelo-6],[X, suelo-24],[X+12, suelo-6]], col, 3);
      F.linea(g, [[X-14, suelo-2],[X+14, suelo-2]], tinta, 3);
      F.texto(g, et+" ("+m+" kg)", X, suelo+20, {alin:"center", tam:13, color:col});
      return X;
    }
    var X1 = persona(pat.x1, pat.m1, boli, "A"), X2 = persona(pat.x2, pat.m2, rojo, "B");
    if(pat.emp > 0){
      F.flecha(g, X1+4, suelo-70, X1-50, suelo-70, boli, 3, "F of B on A", {ey:-14});
      F.flecha(g, X2-4, suelo-70, X2+50, suelo-70, rojo, 3, "F of A on B", {ey:-14});
    }
    var p = pat.m1*pat.v1 + pat.m2*pat.v2;
    if(c.n===1) c.datos('<span>They push each other with the <b>same force</b>, but the lighter one shoots off faster.</span>');
    else c.datos('<span>v<sub>A</sub>: <b>'+PF.fmt(pat.v1,2)+' m/s</b></span><span>v<sub>B</sub>: <b>'+PF.fmt(pat.v2,2)+' m/s</b></span>'+(c.n>=3?'<span>Total momentum: <b>'+PF.fmt(Math.abs(p)<1e-9?0:p,2)+' kg·m/s</b></span>':''));
  }
});

/* ---------- Pista de energía ---------- */
PFSim.def("energia",{t:"Energy track", ayuda:"Drag the ball to change where it starts"}, function(c){
  var g = c.canvas(.5, 300, 470);
  var pista = "u", m = 2, fr = 0, x = -0.9, vx = 0, E0 = 0, termica = 0, arr = false, g0 = 9.81;
  var sP = c.select({l:"Track", ops:[["u","U-shaped ramp"],["doble","Double hill"],["salto","Ramp and hump"]], v:"u", on:function(v){ pista=v; reiniciar(-0.9); }});
  var sM = c.slider({l:"Mass", min:.5, max:10, paso:.5, v:m, u:"kg", dec:1, on:function(v){ m=v; reiniciar(x); }});
  var sF = c.slider({l:"Friction", min:0, max:.5, paso:.01, v:0, dec:2, on:function(v){ fr=v; }});
  var bb = c.botones(); bb.b("Reset", function(){ reiniciar(-0.9); });
  // forma de la pista: y(x) en metros, x en [-1,1] (escala 10 m)
  var L = 10;
  function y(x){ if(pista==="u") return 8*x*x; if(pista==="doble") return 7*(x*x*x*x*1.6 - x*x*1.25)+3.2; return x<0 ? 7*x*x : 2.5*Math.exp(-((x-.45)*(x-.45))/.03)+ 3*x*x*x*x; }
  function dy(x){ var h=1e-4; return (y(x+h)-y(x-h))/(2*h)/L; }
  function d2y(x){ var h=1e-3; return (y(x+h)-2*y(x)+y(x-h))/(h*h)/(L*L); }
  function reiniciar(x0, mantener){ x = x0; vx = 0; termica = 0; E0 = m*g0*y(x); }
  reiniciar(-0.9);
  function P2(xx){ var s = Math.min((c.W*.84)/(2*L), (c.H-80)/9.5); return [c.W/2 + xx*L*s, c.H-36 - y(xx)*s]; }
  c.puntero(c.cv, {
    abajo:function(p){ var q = P2(x); if(Math.hypot(p.x-q[0], p.y-q[1]) < 30){ arr = true; } },
    mover:function(p, ab){ if(arr && ab){ var s = Math.min((c.W*.84)/(2*L), (c.H-80)/9.5); var xx = (p.x - c.W/2)/(L*s); xx = Math.max(-1, Math.min(1, xx)); reiniciar(xx); } },
    arriba:function(){ arr = false; }
  });
  c.loop(function(dt){
    if(!arr){
      var n = 20, h = dt/n;
      for(var i=0;i<n;i++){
        var yp = dy(x), ypp = d2y(x); // derivadas respecto a X real (m), X = x*L
        // dinámica de cuenta en alambre, en X (m): X'' = -(g y' + y' y'' X'^2)/(1+y'^2) - fricción
        var Xv = vx*L;
        var acc = -(g0*yp + yp*ypp*Xv*Xv)/(1+yp*yp);
        var vtan = Xv*Math.sqrt(1+yp*yp);
        acc -= fr*g0*Math.sign(Xv)/Math.sqrt(1+yp*yp) * (Math.abs(Xv)>1e-3?1:0);
        var Xvn = Xv + acc*h;
        if(fr>0 && Xv!==0 && Math.sign(Xvn)!==Math.sign(Xv) && Math.abs(acc) < fr*g0*1.2) Xvn = 0;
        vx = Xvn/L; x += vx*h;
        if(x>1){ x=1; vx=-Math.abs(vx)*.0; } if(x<-1){ x=-1; vx=Math.abs(vx)*.0; }
      }
      var yp2 = dy(x), ec = .5*m*(vx*L)*(vx*L)*(1+yp2*yp2), ep = m*g0*y(x);
      termica = Math.max(0, E0 - ec - ep);
      if(fr===0){ /* corrige deriva numérica */ termica = 0; var ecObj = E0 - ep; if(ecObj>0 && ec>0){ var f = Math.sqrt(ecObj/ec); vx *= f; } }
    }
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta = c.col("tinta"), rojo = c.col("rojo"), boli = c.col("boli"), verde = c.col("verde"), am = c.col("n1"), t3 = c.col("tinta-3");
    // pista
    var pts = []; for(var i=0;i<=200;i++){ var xx = -1 + i/100; pts.push(P2(xx)); }
    F.linea(g, pts, tinta, 3);
    // línea de referencia h=0
    var s = Math.min((c.W*.84)/(2*L), (c.H-80)/9.5), base = c.H-36;
    F.linea(g, [[c.W*.06, base],[c.W*.94, base]], t3, 1, [4,4]);
    if(c.n>=2){ for(var hm=0; hm<=9; hm+=1){ var Y = base - hm*s; F.linea(g,[[c.W*.06-6,Y],[c.W*.06,Y]], t3, 1); if(hm%2===0) F.texto(g, hm+" m", c.W*.06-9, Y+4, {alin:"right", tam:11, color:t3}); } }
    // altura máxima posible (energía total)
    if(c.n>=2){ var Ytot = base - (E0 - termica)/(m*g0)*s; F.linea(g, [[c.W*.08,Ytot],[c.W*.92,Ytot]], verde, 1.2, [6,5]); F.texto(g, "it can climb this high", c.W*.08+4, Ytot-6, {mano:true, tam:18, color:verde}); }
    var q = P2(x);
    var r = 9 + m*.9;
    var nx = -dy(x)*L, ny = 1, nl = Math.hypot(nx,ny); nx/=nl; ny/=nl;
    F.circulo(g, q[0] + nx*r*0, q[1] - r, r, rojo, tinta, 2);
    // barras
    var yp = dy(x), ec = .5*m*(vx*L)*(vx*L)*(1+yp*yp), ep = m*g0*y(x), tot = Math.max(E0, 1);
    var nombres = c.n===1 ? ["height","motion","warmth","total"] : (c.n===2 ? ["potential","kinetic","thermal","total"] : ["Epot = mgh","Ekin = ½mv²","Thermal","Total"]);
    var vals = [ep, ec, termica, ep+ec+termica], cols = [boli, rojo, am, verde];
    var bw = Math.min(170, c.W*.26), bx = c.W/2 - bw/2, by = 18, bh = 11;
    F.texto(g, "Energy", bx, by, {serif:true, tam:14, color:tinta});
    vals.forEach(function(v,i){
      var Y = by + 8 + i*(bh+15);
      F.rect(g, bx, Y, bw, bh, null, t3, 1);
      F.rect(g, bx, Y, bw*Math.max(0,Math.min(1,v/tot)), bh, cols[i]);
      F.texto(g, nombres[i] + (c.n>=2 ? "  "+PF.fmt(v,0)+" J" : ""), bx, Y+bh+12, {tam:12, color:tinta});
    });
    if(c.n===1) c.datos('<span>When the ball goes up, it gains <b>height</b> energy; when it comes down, it gains <b>motion</b> energy. Energy only changes form!</span>');
    else c.datos('<span>Height: <b>'+PF.fmt(y(x),2)+' m</b></span><span>Speed: <b>'+PF.fmt(Math.abs(vx*L)*Math.sqrt(1+yp*yp),2)+' m/s</b></span><span>E<sub>total</sub>: <b>'+PF.fmt(ep+ec+termica,0)+' J</b></span>');
  }
  c.nota("Set friction to zero: the ball always returns to the same height. Turn it up: the «lost» energy shows up as thermal energy (heat), but the total doesn't change.");
});

/* ---------- Caída libre en distintos mundos ---------- */
PFSim.def("caida",{t:"What falls first?", ayuda:"Drop a feather and a hammer"}, function(c){
  var g = c.canvas(.55, 300, 470);
  var lugar = "tierra", aire = true, h0 = 20, t = 0, corriendo = false;
  var obj = [{n:"feather", m:.03, k:.012, y:0, v:0, t:null},{n:"hammer", m:1.32, k:.0012, y:0, v:0, t:null}];
  c.select({l:"Place", ops:Object.keys(G_PLANETAS).map(function(k){return [k,G_PLANETAS[k][1]];}), v:lugar, on:function(v){ lugar=v; reiniciar(); }});
  c.slider({l:"Height", min:1, max:50, paso:1, v:h0, u:"m", dec:0, on:function(v){ h0=v; reiniciar(); }});
  var bb = c.botones();
  bb.b("Drop", function(){ reiniciar(); corriendo = true; }, true);
  var chk = bb.check("There's air", true, function(v){ aire = v; reiniciar(); });
  function reiniciar(){ t=0; corriendo=false; obj.forEach(function(o){ o.y=h0; o.v=0; o.t=null; }); }
  reiniciar();
  c.loop(function(dt){
    var gg = G_PLANETAS[lugar][0], conAire = aire && lugar!=="luna";
    if(corriendo){
      t += dt;
      obj.forEach(function(o){
        if(o.t!=null) return;
        var n=10,h=dt/n; for(var i=0;i<n;i++){ var a = gg - (conAire ? o.k*o.v*o.v/o.m*(lugar==="marte"?.01:(lugar==="venus"?60:(lugar==="jupiter"?1:1))) : 0); o.v += a*h; o.y -= o.v*h; }
        if(o.y<=0){ o.y=0; o.t=t; }
      });
      if(obj.every(function(o){return o.t!=null;})) corriendo=false;
    }
    dibujar(conAire);
  });
  function dibujar(conAire){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), rojo=c.col("rojo"), boli=c.col("boli");
    var top=64, base=c.H-30, s=(base-top)/h0;
    F.linea(g,[[0,base],[c.W,base]],tinta,2);
    for(var hm=0; hm<=h0; hm+= h0>20?10:5){ var Y=base-hm*s; F.linea(g,[[40,Y],[48,Y]],t3,1); F.texto(g,hm+" m",36,Y+4,{alin:"right",tam:11,color:t3}); }
    var xs=[c.W*.4,c.W*.65];
    obj.forEach(function(o,i){
      var X=xs[i], Y=base-o.y*s;
      if(i===0){ g.save(); g.translate(X,Y-14); g.rotate(-.5); g.strokeStyle=boli; g.lineWidth=2; g.beginPath(); g.ellipse(0,0,6,16,0,0,Math.PI*2); g.stroke(); F.linea(g,[[0,-18],[0,18]],boli,1.5); g.restore(); }
      else { F.rect(g,X-3,Y-34,6,30,tinta); F.rect(g,X-15,Y-38,30,12,rojo,tinta,1.5); }
      F.texto(g, o.n, X, base+20, {alin:"center", tam:13, color:tinta});
      if(o.t!=null) F.texto(g, PF.fmt(o.t,2)+" s", X, Y-50, {alin:"center", mano:true, tam:22, color:rojo});
    });
    F.texto(g, G_PLANETAS[lugar][1]+(lugar==="luna"?" (no air)":(conAire?" with air":" without air")), c.W-12, 24, {alin:"right", serif:true, tam:15, color:tinta});
    var tt = Math.sqrt(2*h0/G_PLANETAS[lugar][0]);
    if(c.n===1) c.datos('<span>'+(conAire?"With air, the feather floats and lands much later.":"Without air they both fall <b>together</b>!")+'</span>');
    else c.datos('<span>g = <b>'+G_PLANETAS[lugar][0]+' m/s²</b></span><span>Time without air: <b>'+PF.fmt(tt,2)+' s</b></span>'+(c.n>=3?'<span class="ec">\\(t=\\sqrt{2h/g}=\\sqrt{2('+h0+')/'+G_PLANETAS[lugar][0]+'}\\)</span>':''));
    if(c.n>=3) PF.tex(c.datosEl);
  }
  c.nota("In 1971, astronaut David Scott (Apollo 15) dropped a hammer and a feather on the Moon: they hit the ground at the same time, just as Galileo predicted.");
});

/* ---------- Cañón de Newton (órbitas) ---------- */
PFSim.def("orbita",{t:"Newton's cannon", ayuda:"Choose the speed and fire from 400 km up"}, function(c){
  var g = c.canvas(.62, 320, 560);
  var GM = 3.986e14, R = 6.371e6, h = 4e5, v0 = 7000, trazos = [], sat = null, vel = 1200;
  var sV = c.slider({l:"Launch speed", min:1000, max:12000, paso:50, v:v0, fmt:function(v){return PF.fmt(v/1000,2)+" km/s";}, on:function(v){v0=v;}});
  var bb = c.botones(); bb.b("Fire", disparar, true); bb.b("Clear", function(){ trazos=[]; sat=null; });
  function disparar(){ sat = {x:0, y:R+h, vx:v0, vy:0, t:0, pts:[], estado:""}; }
  c.loop(function(dt){
    if(sat && !sat.estado){
      var T = dt*vel, n = 200, hh = T/n;
      for(var i=0;i<n;i++){
        var r = Math.hypot(sat.x,sat.y), a = -GM/(r*r*r);
        sat.vx += a*sat.x*hh; sat.vy += a*sat.y*hh; sat.x += sat.vx*hh; sat.y += sat.vy*hh; sat.t += hh;
        if(r < R){ sat.estado = "choque"; break; }
        if(r > 9*R){ sat.estado = "escapa"; break; }
        if(sat.t > 3*5554 && sat.pts.length>50){ sat.estado = "orbita"; break; }
      }
      sat.pts.push([sat.x, sat.y]);
      if(sat.estado){ trazos.push(sat); if(trazos.length>6) trazos.shift(); }
    }
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), rojo=c.col("rojo"), boli=c.col("boli"), verde=c.col("verde");
    var cx = c.W/2, cy = c.H/2, s = Math.min(c.W, c.H)/2/(R*1.75);
    F.circulo(g, cx, cy, R*s, PF.tema()==="papel"?"#CFE3DA":"#2F4A41", tinta, 2);
    g.save(); g.beginPath(); g.arc(cx,cy,R*s,0,Math.PI*2); g.clip();
    g.fillStyle = PF.tema()==="papel"?"#9FC7B5":"#3E6455"; g.beginPath(); g.ellipse(cx-R*s*.3, cy+R*s*.2, R*s*.45, R*s*.3, .6, 0, Math.PI*2); g.fill(); g.beginPath(); g.ellipse(cx+R*s*.4, cy-R*s*.3, R*s*.3, R*s*.4, -.4, 0, Math.PI*2); g.fill();
    g.restore();
    // montaña
    var my = cy - (R+h)*s; F.linea(g, [[cx-14, cy-R*s+2],[cx, my],[cx+14, cy-R*s+2]], tinta, 2);
    F.rect(g, cx-2, my-6, 16, 6, tinta);
    trazos.concat(sat&&!sat.estado?[sat]:[]).forEach(function(t,k){
      var col = t.estado==="choque"?rojo:(t.estado==="escapa"?c.col("n4"):(t.estado==="orbita"?verde:boli));
      F.linea(g, t.pts.map(function(p){return [cx+p[0]*s, cy-p[1]*s];}), col, 2);
      var u = t.pts[t.pts.length-1]; if(u) F.circulo(g, cx+u[0]*s, cy-u[1]*s, 4, col);
    });
    var vc = Math.sqrt(GM/(R+h)), ve = Math.sqrt(2*GM/(R+h));
    var est = sat ? sat.estado : "";
    var msg = !sat ? "" : (est==="choque" ? (c.n===1?"It fell back to Earth!":"Falls to Earth") : est==="escapa" ? (c.n===1?"It escaped into space!":"Escapes the Earth") : est==="orbita" ? (c.n===1?"It goes around without falling!":"In orbit (it falls, but never reaches the ground)") : "Volando…");
    if(msg) F.texto(g, msg, 14, 28, {mano:true, tam:24, color:rojo});
    if(c.n===1) c.datos('<span>If you fire very fast, the cannonball falls… but the Earth is round and the ground «curves away»! That\'s how satellites keep going around.</span>');
    else c.datos('<span>Orbital (circular) speed at 400 km: <b>'+PF.fmt(vc/1000,2)+' km/s</b></span><span>Escape velocity: <b>'+PF.fmt(ve/1000,2)+' km/s</b></span>'+(c.n>=3?'<span class="ec">\\(v_{orb}=\\sqrt{GM/r},\\quad v_{esc}=\\sqrt{2GM/r}\\)</span>':''));
    if(c.n>=3) PF.tex(c.datosEl);
  }
  c.nota("Newton imagined this experiment in his writings: a very tall mountain and an ever more powerful cannon. The International Space Station does exactly this, at about 7.7 km/s.");
});

/* ---------- Cinemática: MRU y MRUA con gráficas ---------- */
PFSim.def("cinematica",{t:"Cart with graphs", ayuda:"Choose initial velocity and acceleration; watch x–t and v–t"}, function(c){
  var g = c.canvas(.62, 360, 560);
  var v0 = 2, a = 1, t = 0, corre = false, datos = [], TMAX = 10;
  c.slider({l:"Initial velocity v₀", min:-10, max:20, paso:.5, v:v0, u:"m/s", dec:1, on:function(v){ v0=v; reiniciar(); }});
  c.slider({l:"Acceleration a", min:-4, max:4, paso:.1, v:a, u:"m/s²", dec:1, on:function(v){ a=v; reiniciar(); }});
  var bb = c.botones(); var bPlay = bb.b("Go", function(){ if(t>=TMAX) reiniciar(); corre=!corre; bPlay.textContent = corre?"Pause":"Go"; }, true); bb.b("Reset", reiniciar);
  function reiniciar(){ t=0; corre=false; datos=[[0,0,v0]]; if(bPlay) bPlay.textContent="Go"; }
  reiniciar();
  c.loop(function(dt){
    if(corre){ t = Math.min(TMAX, t+dt); datos.push([t, v0*t+.5*a*t*t, v0+a*t]); if(t>=TMAX){ corre=false; bPlay.textContent="Again"; } }
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), rojo=c.col("rojo"), boli=c.col("boli"), verde=c.col("verde");
    // rango de x
    var xs = []; for(var k=0;k<=50;k++){ var tt=k/50*TMAX; xs.push(v0*tt+.5*a*tt*tt); }
    var xmin = Math.min(0, Math.min.apply(null,xs)), xmax = Math.max(10, Math.max.apply(null,xs));
    var x = v0*t + .5*a*t*t, v = v0 + a*t;
    // pista
    var py = 56, px0 = 40, pw = c.W-80, sx = pw/(xmax-xmin);
    F.linea(g, [[px0,py],[px0+pw,py]], tinta, 2);
    var paso = (xmax-xmin)>150?50:((xmax-xmin)>60?20:((xmax-xmin)>25?5:2));
    for(var m=Math.ceil(xmin/paso)*paso; m<=xmax; m+=paso){ var X = px0+(m-xmin)*sx; F.linea(g,[[X,py],[X,py+6]],t3,1); F.texto(g, m+"", X, py+18, {alin:"center",tam:10,color:t3}); }
    var cx = px0+(x-xmin)*sx;
    F.rect(g, cx-18, py-22, 36, 16, rojo, tinta, 1.5); F.circulo(g, cx-10, py-4, 4, tinta); F.circulo(g, cx+10, py-4, 4, tinta);
    if(Math.abs(v)>.05 && c.n>=2) F.flecha(g, cx, py-30, cx + v*4, py-30, boli, 2.2, "v");
    if(Math.abs(a)>.05 && c.n>=3) F.flecha(g, cx, py-42, cx + a*10, py-42, verde, 2, "a");
    // gráficas
    var gy = 100, gh = c.H - gy - 30, n = c.n>=3 ? 3 : 2, gw = (c.W - 70 - (n-1)*40)/n;
    var vs = datos.map(function(d){return d[2];});
    var vmin = Math.min(0, v0, v0+a*TMAX), vmax = Math.max(1, v0, v0+a*TMAX);
    var opts = {tinta:tinta, tinta2:t3, rejilla:c.col("linea")};
    F.grafica(g, 50, gy, gw, gh, Object.assign({}, opts, {xmin:0,xmax:TMAX,ymin:xmin,ymax:xmax, ex:"t (s)", ey:"x (m)", series:[{pts:datos.map(function(d){return [d[0],d[1]];}), color:rojo, punto:true}]}));
    F.grafica(g, 50+gw+40, gy, gw, gh, Object.assign({}, opts, {xmin:0,xmax:TMAX,ymin:vmin-.5,ymax:vmax+.5, ex:"t (s)", ey:"v (m/s)", series:[{pts:datos.map(function(d){return [d[0],d[2]];}), color:boli, punto:true}]}));
    if(n===3) F.grafica(g, 50+2*(gw+40), gy, gw, gh, Object.assign({}, opts, {xmin:0,xmax:TMAX,ymin:Math.min(-1,a-1),ymax:Math.max(1,a+1), ex:"t (s)", ey:"a (m/s²)", series:[{pts:datos.map(function(d){return [d[0],a];}), color:verde, punto:true}]}));
    var tipo = Math.abs(a)<1e-9 ? "UM (constant velocity)" : "UAM (constant acceleration)";
    if(c.n===1) c.datos('<span>'+(Math.abs(a)<1e-9?"The cart always goes at the same speed.":(a*v0>=0&&v0!==0||v0===0?"The cart goes faster and faster.":"The cart slows down… and then it can go in reverse!"))+'</span><span>Time: <b>'+PF.fmt(t,1)+' s</b></span>');
    else c.datosTex('<span>'+tipo+'</span><span>t = <b>'+PF.fmt(t,2)+' s</b></span><span>x = <b>'+PF.fmt(x,2)+' m</b></span><span>v = <b>'+PF.fmt(v,2)+' m/s</b></span>'+(c.n>=3?'<span class="ec">\\(x = '+v0+'t + \\tfrac12('+a+')t^2,\\qquad v = '+v0+' + ('+a+')t\\)</span>':''));
  }
  c.nota("The slope of the x–t graph is the velocity; the slope of v–t is the acceleration. The area under v–t is the displacement.");
});

/* ---------- Vectores ---------- */
PFSim.def("vectores",{t:"Vector addition", ayuda:"Drag the tip of A or B"}, function(c){
  var g = c.canvas(.62, 320, 500);
  var A = [4,2], B = [1,3.5], modo = "suma", arr = null;
  c.select({l:"Operation", ops:[["suma","A + B"],["resta","A − B"],["comp","Components"]], v:"suma", on:function(v){modo=v;}});
  function esc(){ return Math.min(c.W/16, c.H/10); }
  function O(){ return [c.W/2 - esc()*2.5, c.H/2 + esc()*3]; }
  function aP(v){ var o=O(), s=esc(); return [o[0]+v[0]*s, o[1]-v[1]*s]; }
  function aV(p){ var o=O(), s=esc(); return [Math.round((p.x-o[0])/s*2)/2, Math.round((o[1]-p.y)/s*2)/2]; }
  c.puntero(c.cv, {
    abajo:function(p){ var a=aP(A), b=aP(B); arr = Math.hypot(p.x-a[0],p.y-a[1])<24 ? "A" : (Math.hypot(p.x-b[0],p.y-b[1])<24 ? "B" : null); },
    mover:function(p,ab){ if(ab&&arr){ var v=aV(p); if(arr==="A") A=v; else B=v; dibujar(); } },
    arriba:function(){ arr=null; }
  });
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), rojo=c.col("rojo"), boli=c.col("boli"), verde=c.col("verde"), lin=c.col("linea");
    var o=O(), s=esc();
    for(var i=-10;i<=14;i++){ F.linea(g,[[o[0]+i*s,0],[o[0]+i*s,c.H]],lin,1); F.linea(g,[[0,o[1]-i*s],[c.W,o[1]-i*s]],lin,1); }
    F.linea(g,[[0,o[1]],[c.W,o[1]]],t3,1.5); F.linea(g,[[o[0],0],[o[0],c.H]],t3,1.5);
    var a=aP(A), b=aP(B);
    if(modo==="suma"){
      var S=[A[0]+B[0],A[1]+B[1]], sp=aP(S);
      F.flecha(g, a[0],a[1], sp[0],sp[1], boli, 1.5, "", {guion:true}); F.flecha(g, b[0],b[1], sp[0],sp[1], rojo, 1.5, "", {guion:true});
      F.flecha(g, o[0],o[1], sp[0],sp[1], verde, 3.5, "A + B");
      info(S,"A + B");
    } else if(modo==="resta"){
      var Rr=[A[0]-B[0],A[1]-B[1]];
      F.flecha(g, b[0],b[1], a[0],a[1], verde, 3.5, "A − B");
      info(Rr,"A − B");
    } else {
      F.flecha(g, o[0],o[1], a[0],o[1], boli, 1.8, "Aₓ = "+A[0], {guion:true, ey:14}); F.flecha(g, a[0],o[1], a[0],a[1], boli, 1.8, "Ay = "+A[1], {guion:true});
      info(A,"A");
    }
    F.flecha(g, o[0],o[1], a[0],a[1], boli, 3, "A");
    F.flecha(g, o[0],o[1], b[0],b[1], rojo, 3, "B");
    F.circulo(g, a[0],a[1], 7, null, boli, 2); F.circulo(g, b[0],b[1], 7, null, rojo, 2);
  }
  function info(V, nom){
    var mag = Math.hypot(V[0],V[1]), ang = Math.atan2(V[1],V[0])*180/Math.PI;
    var h = '<span>A = ('+A[0]+', '+A[1]+')</span><span>B = ('+B[0]+', '+B[1]+')</span><span>'+nom+' = (<b>'+PF.fmt(V[0],1)+', '+PF.fmt(V[1],1)+'</b>)</span><span>|'+nom+'| = <b>'+PF.fmt(mag,2)+'</b></span><span>Direction: <b>'+PF.fmt(ang,1)+'°</b></span>';
    if(c.n>=4) h += '<span>A·B = <b>'+PF.fmt(A[0]*B[0]+A[1]*B[1],2)+'</b></span><span>(A×B)<sub>z</sub> = <b>'+PF.fmt(A[0]*B[1]-A[1]*B[0],2)+'</b></span>';
    c.datos(h);
  }
  c.nota("Vectors add «tip to tail»: place B at the end of A. The components add separately: (A<sub>x</sub> + B<sub>x</sub>, A<sub>y</sub> + B<sub>y</sub>).");
});

/* ---------- Choques en una dimensión ---------- */
PFSim.def("choques",{t:"Cart collisions", ayuda:"Adjust masses, velocities and how elastic the collision is"}, function(c){
  var g = c.canvas(.35, 220, 330);
  var m1=2, m2=1, u1=3, u2=-1, e=1, x1, x2, v1, v2, chocado=false, corre=false, ant=null;
  c.slider({l:"Mass 1", min:.5, max:5, paso:.5, v:m1, u:"kg", dec:1, on:function(v){m1=v;reiniciar();}});
  c.slider({l:"Mass 2", min:.5, max:5, paso:.5, v:m2, u:"kg", dec:1, on:function(v){m2=v;reiniciar();}});
  c.slider({l:"Velocity 1", min:-4, max:6, paso:.5, v:u1, u:"m/s", dec:1, on:function(v){u1=v;reiniciar();}});
  c.slider({l:"Velocity 2", min:-6, max:4, paso:.5, v:u2, u:"m/s", dec:1, on:function(v){u2=v;reiniciar();}});
  c.slider({l:"Restitution coef. e", min:0, max:1, paso:.05, v:e, dec:2, on:function(v){e=v;reiniciar();}});
  var bb=c.botones(); var bp=bb.b("Go", function(){ if(chocado&&!corre) reiniciar(); corre=!corre; bp.textContent=corre?"Pause":"Go"; }, true); bb.b("Reset", reiniciar);
  function reiniciar(){ x1=-3; x2=3; v1=u1; v2=u2; chocado=false; corre=false; ant=null; if(bp) bp.textContent="Go"; }
  reiniciar();
  c.loop(function(dt){
    if(corre){
      x1+=v1*dt; x2+=v2*dt;
      var sc=c.W/16, w1=(34+m1*9)/sc, w2=(34+m2*9)/sc;
      if(!chocado && x2-x1 <= (w1+w2)/2){
        ant={p:m1*v1+m2*v2, K:.5*m1*v1*v1+.5*m2*v2*v2};
        var P=m1*v1+m2*v2, n1=(P+m2*e*(v2-v1))/(m1+m2), n2=(P+m1*e*(v1-v2))/(m1+m2);
        v1=n1; v2=n2; chocado=true;
      }
      if(Math.abs(x1)>9 && Math.abs(x2)>9){ corre=false; bp.textContent="Again"; }
    }
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var y=c.H*.62, s=c.W/16, cx=c.W/2;
    F.linea(g,[[0,y],[c.W,y]],tinta,2);
    [[x1,m1,v1,boli,"1"],[x2,m2,v2,rojo,"2"]].forEach(function(o){
      var w=34+o[1]*9, X=cx+o[0]*s;
      F.rect(g, X-w/2, y-w*.8-8, w, w*.8, o[3], tinta, 1.5);
      F.circulo(g, X-w*.3, y-4, 4, tinta); F.circulo(g, X+w*.3, y-4, 4, tinta);
      F.texto(g, o[1]+" kg", X, y-w*.4-8, {alin:"center", base:"middle", tam:12, color:"#fff", negr:true});
      if(Math.abs(o[2])>.01) F.flecha(g, X, y-w*.8-18, X+o[2]*s*.5, y-w*.8-18, o[3], 2.2, c.n>=2?PF.fmt(o[2],2)+" m/s":"");
    });
    var p=m1*v1+m2*v2, K=.5*m1*v1*v1+.5*m2*v2*v2;
    var tipo = e===1?"elastic":(e===0?"perfectly inelastic (they stick together)":"inelastic");
    if(c.n===1) c.datos('<span>Collision '+(e===1?"big bounce":(e===0?"sticky":"normal"))+'. El carrito pesado empuja más al ligero.</span>');
    else c.datos('<span>Collision <b>'+tipo+'</b></span><span>Total p: <b>'+PF.fmt(p,2)+' kg·m/s</b></span><span>Kinetic energy: <b>'+PF.fmt(K,2)+' J</b></span>'+(ant&&c.n>=3?'<span>Energy lost: <b>'+PF.fmt(Math.abs(ant.K-K)<1e-9?0:ant.K-K,2)+' J</b></span>':''));
  }
  c.nota("In every collision the total momentum p = m₁v₁ + m₂v₂ is conserved. Kinetic energy is only conserved if the collision is elastic (e = 1).");
});

/* ---------- Principio de Arquímedes ---------- */
PFSim.def("arquimedes",{t:"Float or sink?", ayuda:"Change the density of the block and the liquid"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var rb=600, rl=1000, V=.001, y=0, vy=0;
  var LIQ = {agua:[1000,"Water"], mar:[1025,"Seawater"], aceite:[920,"Oil"], alcohol:[789,"Alcohol"], mercurio:[13534,"Mercury"]};
  var MAT = [["200","Cork (≈200 kg/m³)"],["600","Pine wood (≈600)"],["917","Ice (917)"],["1000","Water (1000)"],["2700","Aluminum (2700)"],["7870","Iron (7870)"],["11340","Lead (11340)"],["19300","Gold (19300)"]];
  var sM = c.select({l:"Block material", ops:MAT, v:"600", on:function(v){ rb=+v; sR.set(rb); }});
  var sR = c.slider({l:"Block density", min:100, max:20000, paso:10, v:rb, u:"kg/m³", dec:0, on:function(v){rb=v;}});
  c.select({l:"Liquid", ops:Object.keys(LIQ).map(function(k){return [k,LIQ[k][1]+" ("+LIQ[k][0]+" kg/m³)"];}), v:"agua", on:function(v){ rl=LIQ[v][0]; }});
  var lado=.1; // 10 cm
  c.loop(function(dt){
    // y: profundidad sumergida (m) de la base, 0..lado (o más si se hunde)
    var gg=9.81, A=lado*lado, m=rb*A*lado;
    var sum = Math.max(0, Math.min(lado, y));
    var E = rl*gg*A*sum, W = m*gg;
    var a = (W - E)/m - 6*vy;
    vy += a*dt; y += vy*dt;
    var fondo = .30;
    if(y > fondo){ y=fondo; vy=0; }
    if(y < 0){ y=0; vy=0; }
    dibujar(E, W, sum);
  });
  function dibujar(E, W, sum){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), verde=c.col("verde");
    var tx=c.W*.25, tw=c.W*.5, sup=c.H*.3, fondoY=c.H-24, s=(fondoY-sup)/.34;
    var col = rl>5000 ? "rgba(160,170,185,.55)" : (rl<900 ? "rgba(230,190,80,.35)" : "rgba(80,150,220,.28)");
    F.rect(g, tx, sup, tw, fondoY-sup, col);
    F.linea(g, [[tx,sup-40],[tx,fondoY],[tx+tw,fondoY],[tx+tw,sup-40]], tinta, 2.5);
    var L = lado*s, bx = c.W/2 - L/2, by = sup + y*s - L;
    var cb = rb>5000? "#8a8f99" : (rb>2000 ? "#b8bec7" : (rb>950? "#cfe6f5":"#C79A5B"));
    F.rect(g, bx, by, L, L, cb, tinta, 2);
    var k = 2.2;
    F.flecha(g, c.W/2-12, by+L/2, c.W/2-12, by+L/2 + Math.min(120, W*k*3+10), rojo, 3, c.n===1?"peso":"W = "+PF.fmt(W,2)+" N");
    if(E>0.001) F.flecha(g, c.W/2+12, by+L/2, c.W/2+12, by+L/2 - Math.min(120, E*k*3+10), boli, 3, c.n===1?"empuje":"E = "+PF.fmt(E,2)+" N");
    var flota = rb < rl;
    var frac = Math.min(1, rb/rl);
    if(c.n===1) c.datos('<span>'+(flota?"It floats! The liquid pushes it up with enough force.":"It sinks: it weighs more than the liquid's buoyant force.")+'</span>');
    else c.datos('<span>'+(flota?"Floats":"Sinks")+'</span><span>Submerged part: <b>'+PF.fmt(flota?frac*100:100,0)+' %</b></span><span>Buoyant force: <b>'+PF.fmt(E,2)+' N</b></span><span>Weight: <b>'+PF.fmt(W,2)+' N</b></span>'+(c.n>=3?'<span>Apparent weight: <b>'+PF.fmt(Math.max(0,W-E),2)+' N</b></span>':''));
  }
  c.nota("Archimedes: every submerged body receives an upward push equal to the weight of the liquid it displaces, E = ρ<sub>liquid</sub>·g·V<sub>submerged</sub>. That's why ice floats with about 90% under water.");
});

/* ---------- Plano inclinado con fricción ---------- */
PFSim.def("plano",{t:"Inclined plane", ayuda:"Tilt the ramp until the block slides"}, function(c){
  var g = c.canvas(.5, 290, 440);
  var ang=15, ms=.5, mk=.35, m=5, s=0, v=0;
  c.slider({l:"Tilt", min:0, max:60, paso:1, v:ang, u:"°", dec:0, on:function(x){ang=x;}});
  c.slider({l:"static μ", min:0, max:1, paso:.01, v:ms, dec:2, on:function(x){ms=x; if(mk>ms) mk=ms;}});
  c.slider({l:"kinetic μ", min:0, max:1, paso:.01, v:mk, dec:2, on:function(x){mk=Math.min(x,ms);}});
  c.botones().b("Put the block back", function(){ s=0; v=0; });
  c.loop(function(dt){
    var gg=9.81, th=ang*Math.PI/180, N=m*gg*Math.cos(th), Fp=m*gg*Math.sin(th), a=0;
    if(v<1e-6){ if(Fp > ms*N){ a=(Fp-mk*N)/m; } else a=0; }
    else a=(Fp-mk*N)/m;
    v=Math.max(0, v+a*dt); s+=v*dt;
    if(s>3.2){ s=3.2; v=0; }
    dibujar(N, Fp, v>0 ? mk*N : Math.min(Fp, ms*N));
  });
  function dibujar(N, Fp, fr){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), verde=c.col("verde"), am=c.col("n1");
    var th=ang*Math.PI/180, L=Math.min(c.W*.75, (c.H-60)/Math.max(.3,Math.sin(th))*.95), x0=c.W*.12, y0=c.H-30;
    var x1=x0+L*Math.cos(th), y1=y0-L*Math.sin(th);
    g.fillStyle=c.col("papel-2"); g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y0); g.lineTo(x1,y1); g.closePath(); g.fill();
    F.linea(g,[[x0,y0],[x1,y0],[x1,y1],[x0,y0]],tinta,2);
    // ángulo
    g.strokeStyle=tinta; g.lineWidth=1.3; g.beginPath(); g.arc(x0,y0,40,-th,0); g.stroke();
    F.texto(g, ang+"°", x0+46, y0-8, {mano:true, tam:20, color:tinta});
    var pos = .86 - s/3.6*.85; var cx=x0+L*pos*Math.cos(th), cy=y0-L*pos*Math.sin(th);
    var b=46;
    g.save(); g.translate(cx,cy); g.rotate(-th); F.rect(g,-b/2,-b,b,b,c.col("hoja"),tinta,2); g.restore();
    var mx=cx - Math.sin(th)*b/2, my=cy - Math.cos(th)*b/2, k=1.6;
    var ux=-Math.cos(th), uy=Math.sin(th);  // hacia abajo de la rampa (pantalla)
    var nx=-Math.sin(th), ny=-Math.cos(th);
    if(c.n>=2){
      F.flecha(g, mx,my, mx, my+m*9.81*k, rojo, 2.5, c.n>=3?"mg":"peso");
      F.flecha(g, mx,my, mx+nx*N*k, my+ny*N*k, verde, 2.5, "N");
      if(fr>0.01) F.flecha(g, mx,my, mx-ux*fr*k, my-uy*fr*k, am, 2.5, c.n>=3?"f = "+PF.fmt(fr,1)+" N":"friction");
      if(c.n>=3) F.flecha(g, mx,my, mx+ux*Fp*k, my+uy*Fp*k, boli, 2, "mg sin θ", {guion:true});
    }
    var crit = Math.atan(ms)*180/Math.PI;
    if(c.n===1) c.datos('<span>'+(v>0?"It slides!":"The block stays still: friction holds it.")+'</span>');
    else c.datos('<span>'+(v>0?"Sliding":"At rest")+'</span><span>Critical angle: <b>'+PF.fmt(crit,1)+'°</b></span><span>Normal: <b>'+PF.fmt(N,1)+' N</b></span><span>Friction: <b>'+PF.fmt(fr,1)+' N</b></span>'+(c.n>=3?'<span>a = <b>'+PF.fmt(v>0?(Fp-mk*N)/m:0,2)+' m/s²</b></span>':''));
  }
  c.nota("The block starts to slide when tan θ exceeds the static coefficient: tan θ<sub>c</sub> = μ<sub>s</sub>. Once it's moving, kinetic friction (which is smaller) takes over.");
});

/* ---------- Péndulo ---------- */
PFSim.def("pendulo",{t:"Pendulum", ayuda:"Drag the bob to release it from another angle"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var L=2, th=.6, w=0, gg=9.81, amort=0, arr=false, hist=[], tt=0;
  c.slider({l:"Length", min:.3, max:4, paso:.1, v:L, u:"m", dec:1, on:function(v){L=v;}});
  c.select({l:"Gravity", ops:Object.keys(G_PLANETAS).map(function(k){return [k,G_PLANETAS[k][1]];}), v:"tierra", on:function(v){gg=G_PLANETAS[v][0];}});
  c.slider({l:"Damping", min:0, max:.5, paso:.01, v:0, dec:2, on:function(v){amort=v;}});
  function piv(){ return [c.W*.38, 26]; }
  function esc(){ return (c.H-70)/4.2; }
  c.puntero(c.cv,{abajo:function(){arr=true;}, mover:function(p,ab){ if(ab&&arr){ var o=piv(); th=Math.atan2(p.x-o[0], p.y-o[1]); th=Math.max(-2.8,Math.min(2.8,th)); w=0; hist=[]; } }, arriba:function(){arr=false;}});
  c.loop(function(dt){
    if(!arr){ var n=20,h=dt/n; for(var i=0;i<n;i++){ var a=-gg/L*Math.sin(th)-amort*w; w+=a*h; th+=w*h; } tt+=dt; }
    hist.push(th); if(hist.length>240) hist.shift();
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), verde=c.col("verde");
    var o=piv(), s=esc(), bx=o[0]+L*s*Math.sin(th), by=o[1]+L*s*Math.cos(th);
    F.linea(g,[[o[0]-40,o[1]],[o[0]+40,o[1]]],tinta,3);
    F.linea(g,[[o[0],o[1]],[o[0],o[1]+L*s]],t3,1,[4,4]);
    F.linea(g,[[o[0],o[1]],[bx,by]],tinta,2);
    F.circulo(g,bx,by,14,rojo,tinta,2);
    if(c.n>=2){ F.flecha(g,bx,by,bx+w*L*s*.25*Math.cos(th),by-w*L*s*.25*Math.sin(th),boli,2,"v"); }
    // gráfica θ(t)
    var gx=c.W*.66, gw=c.W*.31, gy=40, gh=c.H*.5;
    F.texto(g,"angle vs. time",gx,gy-10,{tam:12,color:t3});
    F.linea(g,[[gx,gy+gh/2],[gx+gw,gy+gh/2]],t3,1);
    F.linea(g,hist.map(function(v,i){return [gx+i/240*gw, gy+gh/2 - v/Math.PI*gh/2*1.6];}),boli,2);
    // energía
    var m=1, h=L*(1-Math.cos(th)), ep=m*gg*h, ec=.5*m*Math.pow(w*L,2), tot=ep+ec||1;
    var ex=gx, ey=gy+gh+30, ew=gw;
    F.rect(g,ex,ey,ew*ep/tot,12,boli); F.rect(g,ex+ew*ep/tot,ey,ew*ec/tot,12,rojo); F.rect(g,ex,ey,ew,12,null,tinta,1);
    F.texto(g,c.n===1?"height energy":"Potential E",ex,ey+28,{tam:12,color:boli}); F.texto(g,c.n===1?"of motion":"Kinetic E",ex+ew,ey+28,{tam:12,color:rojo,alin:"right"});
    var T=2*Math.PI*Math.sqrt(L/gg);
    if(c.n===1) c.datos('<span>A longer pendulum swings more slowly. And it doesn\'t matter how heavy it is!</span>');
    else c.datosTex('<span>Period (small angles): <b>'+PF.fmt(T,2)+' s</b></span><span>Angle: <b>'+PF.fmt(th*180/Math.PI,1)+'°</b></span>'+(c.n>=3?'<span class="ec">\\(T=2\\pi\\sqrt{L/g}=2\\pi\\sqrt{'+L+'/'+gg+'}\\)</span>':''));
  }
  c.nota("Galileo noticed that the period hardly depends on how far you release the pendulum (if the angle is small). At large angles the period grows: the formula 2π√(L/g) is an approximation.");
});
if(window.PF && PF.listo) PFSim.montarTodas(document);
})();
