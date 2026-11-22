/* Pura Física! — simulaciones de ondas, electromagnetismo, óptica y termodinámica */
(function(){
"use strict";
var F = PFSim.dib;

/* color aproximado de una longitud de onda visible (nm) */
function colorLambda(nm, alfa){
  var r=0,g=0,b=0;
  if(nm>=380&&nm<440){ r=-(nm-440)/60; b=1; } else if(nm<490){ g=(nm-440)/50; b=1; } else if(nm<510){ g=1; b=-(nm-510)/20; }
  else if(nm<580){ r=(nm-510)/70; g=1; } else if(nm<645){ r=1; g=-(nm-645)/65; } else if(nm<=780){ r=1; }
  var f = nm<420 ? .3+.7*(nm-380)/40 : (nm>700 ? .3+.7*(780-nm)/80 : 1);
  f = Math.max(.15, Math.min(1,f));
  return "rgba("+Math.round(255*Math.pow(r*f,.8))+","+Math.round(255*Math.pow(g*f,.8))+","+Math.round(255*Math.pow(b*f,.8))+","+(alfa==null?1:alfa)+")";
}
PFSim.colorLambda = colorLambda;

/* ---------- Espectro electromagnético ---------- */
var BANDAS = [
  {n:"Ondas de radio", a:1, b:1e5, ej:"Radio AM y FM, televisión abierta, comunicación con sondas espaciales.", ve:"Antenas y radiotelescopios.", nino:"Las usa la radio del coche para traer música desde muy lejos."},
  {n:"Microondas", a:1e-3, b:1, ej:"Horno de microondas, Wi‑Fi, Bluetooth, radar y la radiación cósmica de fondo que quedó del Big Bang.", ve:"Antenas pequeñas, radiotelescopios.", nino:"Calientan tu comida y llevan el internet del Wi‑Fi."},
  {n:"Infrarrojo", a:7.5e-7, b:1e-3, ej:"Control remoto de la tele, cámaras térmicas, el calor que sientes junto a una fogata.", ve:"Tu piel (como calor) y cámaras térmicas.", nino:"Es la luz del calor: tu control remoto la usa ¡y no la puedes ver!"},
  {n:"Luz visible", a:3.8e-7, b:7.5e-7, ej:"Todo lo que ves. Del rojo (≈700 nm) al violeta (≈400 nm): los colores del arcoíris.", ve:"Tus ojos.", nino:"La única parte que tus ojos pueden ver: ¡los colores del arcoíris!"},
  {n:"Ultravioleta", a:1e-8, b:3.8e-7, ej:"Broncea y quema la piel, desinfecta agua, hace brillar la ropa blanca bajo la «luz negra».", ve:"Las abejas y muchas aves.", nino:"Es la que te quema si no usas bloqueador. Las abejas sí la ven."},
  {n:"Rayos X", a:1e-11, b:1e-8, ej:"Radiografías y tomografías, revisión de maletas, estudio de la estructura de los cristales.", ve:"Placas fotográficas y detectores electrónicos.", nino:"Atraviesan la piel pero no los huesos: así se hacen las radiografías."},
  {n:"Rayos gamma", a:1e-16, b:1e-11, ej:"Núcleos radiactivos, explosiones de estrellas, radioterapia contra el cáncer.", ve:"Detectores de partículas y telescopios espaciales.", nino:"La luz más poderosa: sale de los átomos y de estrellas que explotan."}
];
PFSim.def("espectro",{t:"Explorador del espectro electromagnético", ayuda:"Desliza para cambiar la longitud de onda"}, function(c){
  var g = c.canvas(.42, 260, 380);
  var L = -6.3; // log10(λ en m)
  var sL = c.slider({l:"Longitud de onda λ", min:-13, max:4, paso:.01, v:L, fmt:function(v){ return fmtL(v); }, on:function(v){ L=Math.log10(v); dibujar(); }, log:true});
  sL.set(Math.pow(10,L));
  function fmtL(lam){
    if(lam>=1) return PF.fmt(lam,2)+" m"; if(lam>=1e-3) return PF.fmt(lam*1e3,2)+" mm"; if(lam>=1e-6) return PF.fmt(lam*1e6,2)+" µm";
    if(lam>=1e-9) return PF.fmt(lam*1e9,1)+" nm"; return PF.fmt(lam*1e12,2)+" pm";
  }
  function fmtF(f){ var u=[[1e18,"EHz"],[1e15,"PHz"],[1e12,"THz"],[1e9,"GHz"],[1e6,"MHz"],[1e3,"kHz"]]; for(var i=0;i<u.length;i++) if(f>=u[i][0]) return PF.fmt(f/u[i][0],2)+" "+u[i][1]; return PF.fmt(f,1)+" Hz"; }
  function banda(lam){ for(var i=0;i<BANDAS.length;i++) if(lam>=BANDAS[i].a && lam<BANDAS[i].b) return BANDAS[i]; return lam>=1e5?BANDAS[0]:BANDAS[6]; }
  c.puntero(c.cv,{abajo:mov, mover:function(p,ab){ if(ab) mov(p); }});
  function mov(p){ var x0=20, w=c.W-40; if(p.y<90){ L = 4 - (p.x-x0)/w*17; L=Math.max(-13,Math.min(4,L)); sL.set(Math.pow(10,L)); dibujar(); } }
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  var t=0; c.loop(function(dt){ t+=dt; dibujarOnda(); });
  function xDeL(l){ return 20 + (4-l)/17*(c.W-40); }
  function dibujar(){ dibujarOnda(); }
  function dibujarOnda(){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), rojo=c.col("rojo");
    var y0=26, h=34;
    // franja
    BANDAS.forEach(function(b,i){
      var x1 = xDeL(Math.log10(Math.min(b.b,1e4))), x2 = xDeL(Math.log10(Math.max(b.a,1e-13)));
      if(b.n==="Luz visible"){ for(var x=x1;x<=x2;x++){ var nm = 750 - (x-x1)/(x2-x1)*370; g.fillStyle=colorLambda(nm); g.fillRect(x,y0,1.5,h); } }
      else { g.fillStyle = i%2 ? c.col("papel-2") : c.col("hoja"); g.fillRect(x1,y0,x2-x1,h); }
      g.strokeStyle=c.col("linea"); g.strokeRect(x1,y0,x2-x1,h);
      var nom = b.n.replace("Ondas de ","").replace("Luz ","").replace("Rayos ","");
      if(x2-x1>30 && b.n!=="Luz visible") F.texto(g, nom, (x1+x2)/2, y0+h/2+1, {alin:"center", base:"middle", tam:12, color:tinta});
    });
    F.texto(g,"visible", (xDeL(Math.log10(7.5e-7))+xDeL(Math.log10(3.8e-7)))/2, y0-6, {alin:"center", tam:12, color:tinta});
    F.texto(g,"← más largas, menos energía", 20, y0+h+16, {tam:12, color:t3});
    F.texto(g,"más cortas, más energía →", c.W-20, y0+h+16, {tam:12, color:t3, alin:"right"});
    var mx = xDeL(L);
    F.linea(g,[[mx,y0-10],[mx,y0+h+4]],rojo,3);
    g.fillStyle=rojo; g.beginPath(); g.moveTo(mx-7,y0-14); g.lineTo(mx+7,y0-14); g.lineTo(mx,y0-4); g.fill();
    // onda dibujada (λ visual comprimida logarítmicamente)
    var lam = Math.pow(10,L), b = banda(lam);
    var wy = y0+h+60, amp = Math.min(40, (c.H-wy-14)/2), lpix = 18 + (L+13)/17*(c.W*.7);
    var col = b.n==="Luz visible" ? colorLambda(lam*1e9) : c.col("boli");
    g.save(); g.strokeStyle=col; g.lineWidth=2.6; g.beginPath();
    for(var x=20;x<=c.W-20;x+=1.5){ var yy = wy + amp - 0 + amp*Math.sin(2*Math.PI*(x/lpix) - t*4); if(x===20) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke(); g.restore();
    var cc=3e8, f=cc/lam, E=6.62607015e-34*f/1.602176634e-19;
    var h1;
    if(c.n===1) h1 = '<span><b>'+b.n+'</b>: '+b.nino+'</span>';
    else {
      h1 = '<span><b>'+b.n+'</b></span><span>λ = <b>'+fmtL(lam)+'</b></span><span>f = <b>'+fmtF(f)+'</b></span>'+(c.n>=3?'<span>Energía del fotón: <b>'+PF.fmt(E,3)+' eV</b></span>':'')+'<span class="ec">'+b.ej+(c.n>=2?' <i>¿Quién la detecta?</i> '+b.ve:'')+'</span>';
    }
    c.datos(h1);
  }
  c.nota("Todas estas ondas son lo mismo: campos eléctricos y magnéticos que viajan a la velocidad de la luz, c ≈ 3×10⁸ m/s. Solo cambia su longitud de onda λ. Se cumple c = λ·f, y la energía de cada fotón es E = h·f.");
});

/* ---------- Ondas sonoras ---------- */
PFSim.def("sonido",{t:"Ondas de sonido", ayuda:"Cambia la frecuencia y escucha el tono"}, function(c){
  var g = c.canvas(.5, 280, 420);
  var f=440, A=.6, medio="aire", t=0, osc=null, ac=null, gan=null;
  var V = {aire:[343,"Aire a 20 °C"], agua:[1482,"Agua"], acero:[5960,"Acero"], helio:[1007,"Helio"]};
  c.slider({l:"Frecuencia", min:50, max:2000, paso:1, v:f, u:"Hz", dec:0, on:function(v){ f=v; if(osc) osc.frequency.setTargetAtTime(f, ac.currentTime, .02); }});
  c.slider({l:"Amplitud (volumen)", min:.1, max:1, paso:.05, v:A, dec:2, on:function(v){ A=v; if(gan) gan.gain.setTargetAtTime(.12*A, ac.currentTime, .02); }});
  c.select({l:"Medio", ops:Object.keys(V).map(function(k){return [k,V[k][1]+" ("+V[k][0]+" m/s)"];}), v:"aire", on:function(v){medio=v;}});
  var bb=c.botones();
  var bS = bb.b("▶ Escuchar", function(){
    try{
      if(osc){ osc.stop(); osc=null; bS.textContent="▶ Escuchar"; return; }
      ac = ac || new (window.AudioContext||window.webkitAudioContext)();
      osc = ac.createOscillator(); gan = ac.createGain(); osc.type="sine"; osc.frequency.value=f; gan.gain.value=.12*A;
      osc.connect(gan); gan.connect(ac.destination); osc.start(); bS.textContent="■ Detener";
    }catch(e){ bS.textContent="Sin audio"; }
  }, true);
  var N=46, filas=7;
  var semilla=[]; for(var i=0;i<N*filas;i++) semilla.push([Math.random()-.5, Math.random()-.5]);
  c.loop(function(dt){ t+=dt; dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), t3=c.col("tinta-3"), boli=c.col("boli"), rojo=c.col("rojo");
    var x0=40, w=c.W-80, y0=30, h=c.H*.48;
    var lvis = w/ (1.5 + f/400*2.2); // longitud de onda visual
    var k=2*Math.PI/lvis, om=2*Math.PI*.9;
    // bocina
    g.fillStyle=tinta; g.beginPath(); g.moveTo(x0-30,y0+h*.35); g.lineTo(x0-12,y0+h*.35); g.lineTo(x0,y0+h*.15); g.lineTo(x0,y0+h*.85); g.lineTo(x0-12,y0+h*.65); g.lineTo(x0-30,y0+h*.65); g.fill();
    for(var j=0;j<filas;j++) for(var i=0;i<N;i++){
      var xe = x0+10 + i*(w-10)/N + semilla[j*N+i][0]*4;
      var d = A*lvis*.12*Math.sin(k*(xe-x0) - om*t);
      var ye = y0 + (j+.5)*h/filas + semilla[j*N+i][1]*6;
      F.circulo(g, xe+d, ye, 3.2, (i===N/2|0 && j===3)?rojo:boli);
    }
    // presión
    var py=y0+h+40, ph=Math.min(60,c.H-py-20);
    F.linea(g,[[x0,py],[x0+w,py]],t3,1,[3,3]);
    var pts=[]; for(var x=0;x<=w;x+=2){ pts.push([x0+x, py - ph*.8*A*Math.cos(k*x - om*t)]); }
    F.linea(g,pts,rojo,2.2);
    F.texto(g, c.n===1?"↑ apretado":"↑ compresión", x0+w, py-ph*.85-4, {tam:12,color:t3,alin:"right"});
    F.texto(g, c.n===1?"↓ separado":"↓ rarefacción", x0+w, py+ph*.85+14, {tam:12,color:t3,alin:"right"});
    if(c.n>=2){ // marca de λ
      var xa = x0 + ((om*t/k)%lvis), xb = xa+lvis; if(xb < x0+w){ F.linea(g,[[xa,py+ph*.95],[xb,py+ph*.95]],tinta,1.2); F.texto(g,"λ",(xa+xb)/2,py+ph*.95-4,{mano:true,tam:20,alin:"center",color:tinta}); }
    }
    var v=V[medio][0], lam=v/f;
    var tono = f<250?"grave":(f<1000?"medio":"agudo");
    if(c.n===1) c.datos('<span>Tono <b>'+tono+'</b>. El sonido es aire que se aprieta y se separa, ¡como un resorte que vibra!</span>');
    else c.datos('<span>f = <b>'+f+' Hz</b> (tono '+tono+')</span><span>Rapidez en '+V[medio][1].toLowerCase()+': <b>'+v+' m/s</b></span><span>λ = v/f = <b>'+PF.fmt(lam,3)+' m</b></span>'+(c.n>=3?'<span>Periodo T = 1/f = <b>'+PF.fmt(1000/f,2)+' ms</b></span>':''));
  }
  c.nota("Las partículas no viajan con el sonido: solo vibran de ida y vuelta (mira el punto rojo). Lo que viaja es la perturbación. Por eso el sonido es una onda longitudinal y necesita un medio: en el vacío no hay sonido. El oído humano percibe aproximadamente de 20 Hz a 20 000 Hz.");
});

/* ---------- Campo eléctrico ---------- */
PFSim.def("campoE",{t:"Campo eléctrico de cargas", ayuda:"Arrastra las cargas y la sonda"}, function(c){
  var g = c.canvas(.6, 320, 520);
  var Q = [], sonda = {x:.5, y:.2}, arr=null, potencial=false, lineas=true, flechas=true;
  function preset(p){
    if(p==="dipolo") Q=[{x:.35,y:.5,q:1},{x:.65,y:.5,q:-1}];
    else if(p==="iguales") Q=[{x:.35,y:.5,q:1},{x:.65,y:.5,q:1}];
    else if(p==="una") Q=[{x:.5,y:.5,q:1}];
    else if(p==="capacitor"){ Q=[]; for(var i=0;i<7;i++){ Q.push({x:.2+i*.1,y:.3,q:.5}); Q.push({x:.2+i*.1,y:.72,q:-.5}); } }
    else if(p==="tres") Q=[{x:.3,y:.65,q:1},{x:.7,y:.65,q:1},{x:.5,y:.3,q:-2}];
    dibujar();
  }
  c.select({l:"Arreglo", ops:[["dipolo","Dipolo (+ y −)"],["iguales","Dos cargas positivas"],["una","Una carga"],["tres","Tres cargas"],["capacitor","Placas paralelas"]], v:"dipolo", on:preset});
  var bb=c.botones();
  bb.b("+ carga", function(){ Q.push({x:.15+Math.random()*.7,y:.15+Math.random()*.7,q:1}); dibujar(); });
  bb.b("− carga", function(){ Q.push({x:.15+Math.random()*.7,y:.15+Math.random()*.7,q:-1}); dibujar(); });
  bb.check("Líneas", true, function(v){lineas=v;dibujar();});
  bb.check("Vectores", true, function(v){flechas=v;dibujar();});
  var chP = bb.check("Potencial", false, function(v){potencial=v;dibujar();});
  function px(p){ return [p.x*c.W, p.y*c.H]; }
  function E(x,y){ var ex=0,ey=0,V=0; for(var i=0;i<Q.length;i++){ var dx=x-Q[i].x*c.W, dy=y-Q[i].y*c.H, r2=dx*dx+dy*dy+1e-6, r=Math.sqrt(r2); var k=Q[i].q/(r2*r); ex+=k*dx; ey+=k*dy; V+=Q[i].q/r; } return [ex,ey,V]; }
  c.puntero(c.cv,{
    abajo:function(p){ arr=null; var s=px(sonda); if(Math.hypot(p.x-s[0],p.y-s[1])<16){arr="s";return;} Q.forEach(function(q,i){ var a=px(q); if(Math.hypot(p.x-a[0],p.y-a[1])<18) arr=i; }); },
    mover:function(p,ab){ if(!ab||arr===null) return; var o={x:Math.max(.02,Math.min(.98,p.x/c.W)), y:Math.max(.02,Math.min(.98,p.y/c.H))}; if(arr==="s") sonda=o; else { Q[arr].x=o.x; Q[arr].y=o.y; } dibujar(); },
    arriba:function(){ arr=null; }
  });
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(function(){ chP.parentNode.style.display = c.n>=4?"":"none"; if(c.n<4) potencial=false; dibujar(); });
  chP.parentNode.style.display = c.n>=4?"":"none";
  function dibujar(){
    if(!c.W) return;
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    if(potencial){
      var paso=8; for(var y=0;y<c.H;y+=paso) for(var x=0;x<c.W;x+=paso){ var V=E(x+paso/2,y+paso/2)[2]*40; var a=Math.min(.55,Math.abs(V)*.5); g.fillStyle = V>0 ? "rgba(210,64,46,"+a+")" : "rgba(37,70,200,"+a+")"; g.fillRect(x,y,paso,paso); }
    }
    if(flechas){
      var s=34; for(var yy=s/2; yy<c.H; yy+=s) for(var xx=s/2; xx<c.W; xx+=s){
        var e=E(xx,yy), m=Math.hypot(e[0],e[1]); if(m<1e-9) continue;
        var L=Math.min(14, 3+Math.log(1+m*4e5)*2.2); var a=Math.min(.9,.25+Math.log(1+m*4e5)*.08);
        g.globalAlpha=a; F.flecha(g, xx-e[0]/m*L/2, yy-e[1]/m*L/2, xx+e[0]/m*L/2, yy+e[1]/m*L/2, t3, 1.4); g.globalAlpha=1;
      }
    }
    if(lineas){
      var pos = Q.filter(function(q){return q.q>0;}), dir=1;
      if(!pos.length){ pos = Q.filter(function(q){return q.q<0;}); dir=-1; }
      pos.forEach(function(q){
        var nl = Math.round(12*Math.abs(q.q)) || 6;
        for(var k=0;k<nl;k++){
          var a=2*Math.PI*k/nl, x=q.x*c.W+Math.cos(a)*10, y=q.y*c.H+Math.sin(a)*10, pts=[[x,y]];
          for(var n=0;n<700;n++){
            var e=E(x,y), m=Math.hypot(e[0],e[1]); if(m<1e-12) break;
            var hx=dir*e[0]/m*3, hy=dir*e[1]/m*3; var e2=E(x+hx/2,y+hy/2), m2=Math.hypot(e2[0],e2[1]);
            x+=dir*e2[0]/m2*3; y+=dir*e2[1]/m2*3; pts.push([x,y]);
            if(x<-20||y<-20||x>c.W+20||y>c.H+20) break;
            var fin=false; for(var i=0;i<Q.length;i++){ if(Q[i].q*dir<0 && Math.hypot(x-Q[i].x*c.W,y-Q[i].y*c.H)<9){fin=true;break;} } if(fin) break;
          }
          F.linea(g,pts,tinta,1.3);
        }
      });
    }
    Q.forEach(function(q){ var p=px(q); F.circulo(g,p[0],p[1],12,q.q>0?rojo:boli,tinta,1.5); F.texto(g,q.q>0?"+":"−",p[0],p[1]+1,{alin:"center",base:"middle",tam:18,negr:true,color:"#fff"}); });
    // sonda
    var sp=px(sonda), es=E(sp[0],sp[1]), ms=Math.hypot(es[0],es[1]);
    F.circulo(g,sp[0],sp[1],6,c.col("hoja"),c.col("verde"),2.5);
    if(ms>0){ var Ls=Math.min(70,20+Math.log(1+ms*4e5)*8); F.flecha(g,sp[0],sp[1],sp[0]+es[0]/ms*Ls,sp[1]+es[1]/ms*Ls,c.col("verde"),3,"E"); }
    // en unidades: 1 px = 1 cm, |q| = 1 nC
    var ESI = ms*8.99e9*1e-9*1e4, VSI = es[2]*8.99e9*1e-9*100;
    if(c.n===1) c.datos('<span>Las cargas iguales se <b>empujan</b> y las distintas se <b>atraen</b>. Las líneas muestran hacia dónde se movería una cargita positiva.</span>');
    else c.datos('<span>Campo en la sonda: <b>'+PF.fmt(ESI,2)+' N/C</b></span><span>Dirección: <b>'+PF.fmt(Math.atan2(-es[1],es[0])*180/Math.PI,0)+'°</b></span>'+(c.n>=4?'<span>Potencial: <b>'+PF.fmt(VSI,2)+' V</b></span>':'')+'<span class="chico">Escala: 1 cuadrito = 20 cm · cada carga = ±1 nC</span>');
  }
  preset("dipolo");
  c.nota("Las líneas de campo salen de las cargas positivas y entran en las negativas; donde están más juntas el campo es más intenso. Para una carga puntual, E = kq/r²: si duplicas la distancia, el campo baja a la cuarta parte.");
});

/* ---------- Campo magnético de un cable ---------- */
PFSim.def("campoB",{t:"Campo magnético de una corriente", ayuda:"Cambia la corriente y mueve la sonda"}, function(c){
  var g = c.canvas(.55, 300, 470);
  var I=10, dos=false, mismo=true, sonda={x:.68,y:.5}, arr=false;
  c.slider({l:"Corriente I", min:-20, max:20, paso:1, v:I, u:"A", dec:0, on:function(v){ I=v; dibujar(); }});
  var sel = c.select({l:"Cables", ops:[["1","Un cable"],["2m","Dos cables, misma dirección"],["2o","Dos cables, direcciones opuestas"]], v:"1", on:function(v){ dos = v!=="1"; mismo = v==="2m"; dibujar(); }});
  function cables(){ if(!dos) return [{x:.5,y:.5,I:I}]; return [{x:.4,y:.5,I:I},{x:.6,y:.5,I:mismo?I:-I}]; }
  function B(x,y){ var bx=0,by=0; cables().forEach(function(w){ var dx=x-w.x*c.W, dy=y-w.y*c.H, r2=dx*dx+dy*dy+1; bx+= -w.I*dy/r2; by+= w.I*dx/r2; }); return [bx,-by]; }
  // nota: pantalla y hacia abajo; la corriente positiva sale de la pantalla (contrarreloj visto de frente)
  function Bp(x,y){ var bx=0,by=0; cables().forEach(function(w){ var dx=x-w.x*c.W, dy=-(y-w.y*c.H), r2=dx*dx+dy*dy+1; bx+= -w.I*dy/r2; by+= w.I*dx/r2; }); return [bx,-by]; }
  c.puntero(c.cv,{abajo:function(p){ arr = Math.hypot(p.x-sonda.x*c.W,p.y-sonda.y*c.H)<20; }, mover:function(p,ab){ if(ab&&arr){ sonda={x:p.x/c.W,y:p.y/c.H}; dibujar(); } }, arriba:function(){arr=false;}});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function brujula(x,y,ang,col){
    g.save(); g.translate(x,y); g.rotate(ang);
    g.fillStyle=col; g.beginPath(); g.moveTo(11,0); g.lineTo(0,3.5); g.lineTo(0,-3.5); g.fill();
    g.fillStyle=c.col("tinta-3"); g.beginPath(); g.moveTo(-11,0); g.lineTo(0,3.5); g.lineTo(0,-3.5); g.fill();
    g.restore();
  }
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    // círculos de campo
    if(!dos && I!==0){ for(var r=30;r<Math.max(c.W,c.H);r+=30+r*.25){ g.strokeStyle=c.col("linea"); g.lineWidth=1.4; g.beginPath(); g.arc(c.W/2,c.H/2,r,0,Math.PI*2); g.stroke(); } }
    var s=40; for(var y=s/2;y<c.H;y+=s) for(var x=s/2;x<c.W;x+=s){
      var b=Bp(x,y), m=Math.hypot(b[0],b[1]); if(m<1e-9){ brujula(x,y,-Math.PI/2,rojo); continue; }
      var near = cables().some(function(w){ return Math.hypot(x-w.x*c.W,y-w.y*c.H)<22; }); if(near) continue;
      g.globalAlpha = Math.min(1,.35+m*30); brujula(x,y,Math.atan2(b[1],b[0]),rojo); g.globalAlpha=1;
    }
    cables().forEach(function(w){ var X=w.x*c.W, Y=w.y*c.H; F.circulo(g,X,Y,16,c.col("hoja"),tinta,2.5);
      if(w.I>0){ F.circulo(g,X,Y,4,tinta); } else if(w.I<0){ F.linea(g,[[X-7,Y-7],[X+7,Y+7]],tinta,2.5); F.linea(g,[[X-7,Y+7],[X+7,Y-7]],tinta,2.5); }
      F.texto(g, w.I>0?"sale":(w.I<0?"entra":"I = 0"), X, Y+32, {alin:"center", tam:12, color:t3});
    });
    var sx=sonda.x*c.W, sy=sonda.y*c.H, bs=Bp(sx,sy), ms=Math.hypot(bs[0],bs[1]);
    F.circulo(g,sx,sy,7,null,c.col("verde"),2.5);
    if(ms>1e-9) F.flecha(g,sx,sy,sx+bs[0]/ms*45,sy+bs[1]/ms*45,c.col("verde"),3,"B");
    // SI: 1 px = 1 mm
    var BSI=0; cables().forEach(function(w){ var r=Math.hypot(sx-w.x*c.W,sy-w.y*c.H)/1000; BSI=0; });
    var bxS=0, byS=0; cables().forEach(function(w){ var dx=(sx-w.x*c.W)/1000, dy=-(sy-w.y*c.H)/1000, r2=dx*dx+dy*dy+1e-8; bxS+= 2e-7*(-w.I*dy)/r2; byS+= 2e-7*(w.I*dx)/r2; });
    BSI=Math.hypot(bxS,byS);
    var fuerza = dos ? (mismo?"se atraen":"se repelen") : "";
    if(c.n===1) c.datos('<span>La corriente eléctrica crea un campo magnético en círculos alrededor del cable: ¡mira cómo giran las brújulas!</span>'+(dos?'<span>Los cables <b>'+fuerza+'</b>.</span>':''));
    else c.datos('<span>B en la sonda: <b>'+PF.fmt(BSI*1e6,1)+' µT</b></span><span>(el campo de la Tierra ≈ 25–65 µT)</span>'+(dos?'<span>Los cables <b>'+fuerza+'</b></span>':'')+'<span class="chico">Escala: 1 cuadrito = 2 cm</span>');
  }
  c.nota("Regla de la mano derecha: si tu pulgar apunta en la dirección de la corriente, tus dedos se enroscan en la dirección del campo. Para un cable largo, B = μ₀I/(2πr). Dos corrientes en el mismo sentido se atraen; así se definía el ampere hasta 2019.");
});

/* ---------- Circuitos ---------- */
PFSim.def("circuito",{t:"Circuito de focos", ayuda:"Arma en serie o en paralelo y mira el brillo"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var tipo="serie", V=12, R=[10,20,30], fase=0;
  c.select({l:"Conexión", ops:[["serie","En serie"],["paralelo","En paralelo"],["mixto","Mixto: R1 + (R2 ∥ R3)"]], v:tipo, on:function(v){tipo=v;}});
  c.slider({l:"Batería", min:1.5, max:24, paso:.5, v:V, u:"V", dec:1, on:function(v){V=v;}});
  [0,1,2].forEach(function(i){ c.slider({l:"R"+(i+1), min:1, max:100, paso:1, v:R[i], u:"Ω", dec:0, on:function(v){R[i]=v;}}); });
  function resolver(){
    var I=[0,0,0], Vr=[0,0,0], Req;
    if(tipo==="serie"){ Req=R[0]+R[1]+R[2]; var it=V/Req; I=[it,it,it]; }
    else if(tipo==="paralelo"){ Req=1/(1/R[0]+1/R[1]+1/R[2]); I=[V/R[0],V/R[1],V/R[2]]; }
    else { var p=R[1]*R[2]/(R[1]+R[2]); Req=R[0]+p; var it2=V/Req; I=[it2, it2*p/R[1], it2*p/R[2]]; }
    Vr=[I[0]*R[0],I[1]*R[1],I[2]*R[2]];
    return {Req:Req, I:I, V:Vr, P:[I[0]*Vr[0],I[1]*Vr[1],I[2]*Vr[2]], It:V/Req};
  }
  function geo(){
    // devuelve posiciones (px) de resistencias y rutas de corriente
    var W=c.W, H=c.H, L=W*.12, Rr=W*.9, T=H*.18, B=H*.85, bat={x:L, y:(T+B)/2};
    if(tipo==="serie"){
      var r=[{x:W*.35,y:T,h:1},{x:W*.68,y:T,h:1},{x:Rr,y:(T+B)/2,h:0}];
      return {bat:bat, r:r, rutas:[{I:"0", pts:[[L,T],[Rr,T],[Rr,B],[L,B],[L,T]]}], cables:[[[L,T],[Rr,T],[Rr,B],[L,B],[L,T]]]};
    }
    if(tipo==="paralelo"){
      var xs=[W*.42,W*.64,W*.86];
      return {bat:bat, r:xs.map(function(x){return {x:x,y:(T+B)/2,h:0};}),
        rutas:xs.map(function(x,i){ return {I:String(i), pts:[[L,T],[x,T],[x,B],[L,B],[L,T]]}; }),
        cables:[[[L,T],[xs[2],T]],[[L,B],[xs[2],B]],[[L,T],[L,B]]].concat(xs.map(function(x){return [[x,T],[x,B]];}))};
    }
    var x2=W*.62, x3=W*.86;
    return {bat:bat, r:[{x:W*.33,y:T,h:1},{x:x2,y:(T+B)/2,h:0},{x:x3,y:(T+B)/2,h:0}],
      rutas:[{I:"1",pts:[[L,T],[x2,T],[x2,B],[L,B],[L,T]]},{I:"2",pts:[[L,T],[x3,T],[x3,B],[L,B],[L,T]]}],
      cables:[[[L,T],[x3,T]],[[L,B],[x3,B]],[[L,T],[L,B]],[[x2,T],[x2,B]],[[x3,T],[x3,B]]]};
  }
  function largo(p){ var s=0; for(var i=1;i<p.length;i++) s+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); return s; }
  function punto(p, d){ for(var i=1;i<p.length;i++){ var l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); if(d<=l){ var f=d/l; return [p[i-1][0]+(p[i][0]-p[i-1][0])*f, p[i-1][1]+(p[i][1]-p[i-1][1])*f]; } d-=l; } return p[p.length-1]; }
  var avance=[0,0,0];
  c.loop(function(dt){
    var s=resolver(), G=geo();
    G.rutas.forEach(function(r,k){ avance[k] = (avance[k] + dt*s.I[+r.I]*90) % 1e6; });
    dibujar(s,G);
  });
  function dibujar(s,G){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), am=c.col("n1"), t3=c.col("tinta-3");
    G.cables.forEach(function(p){ F.linea(g,p,tinta,2.5); });
    // electrones
    G.rutas.forEach(function(r,k){
      var Lr=largo(r.pts), esp=26;
      for(var d=(avance[k]%esp); d<Lr; d+=esp){ var q=punto(r.pts, Lr-d); F.circulo(g,q[0],q[1],3,boli); }
    });
    // batería
    var b=G.bat; F.rect(g,b.x-20,b.y-34,40,68,c.col("papel"));
    F.linea(g,[[b.x-18,b.y-8],[b.x+18,b.y-8]],tinta,3); F.linea(g,[[b.x-10,b.y+8],[b.x+10,b.y+8]],tinta,5);
    F.texto(g,"+",b.x+24,b.y-10,{tam:16,color:rojo,negr:true}); F.texto(g,V+" V",b.x-26,b.y+4,{tam:13,alin:"right",color:tinta,negr:true});
    var Pmax = Math.max(1, (V*V)/Math.min(R[0],R[1],R[2]));
    G.r.forEach(function(r,i){
      var brillo = Math.min(1, Math.sqrt(s.P[i]/Pmax)*1.2);
      // brillo
      var gr=g.createRadialGradient(r.x,r.y,4,r.x,r.y,60*brillo+8); gr.addColorStop(0,"rgba(255,215,80,"+(.85*brillo)+")"); gr.addColorStop(1,"rgba(255,215,80,0)");
      g.fillStyle=gr; g.beginPath(); g.arc(r.x,r.y,60*brillo+8,0,Math.PI*2); g.fill();
      F.circulo(g,r.x,r.y,17,c.col("hoja"),tinta,2);
      // filamento
      g.strokeStyle = brillo>.05 ? am : t3; g.lineWidth=2; g.beginPath();
      for(var k=0;k<=8;k++){ var xx=r.x-9+k*2.25, yy=r.y+(k%2?-5:5); if(k) g.lineTo(xx,yy); else g.moveTo(xx,yy); } g.stroke();
      var izq = !r.h && r.x > c.W*.75, al = r.h ? "center" : (izq ? "right" : "left");
      var tx = r.h ? r.x : (izq ? r.x-24 : r.x+24), ty = r.h ? r.y-42 : r.y-4;
      F.texto(g,"R"+(i+1)+" = "+R[i]+" Ω",tx,ty,{tam:12,alin:al,color:tinta,negr:true,fondo:c.col("papel")});
      if(c.n>=2) F.texto(g,PF.fmt(s.I[i],2)+" A · "+PF.fmt(s.V[i],1)+" V",tx,ty+15,{tam:12,alin:al,color:t3,fondo:c.col("papel")});
    });
    if(c.n===1) c.datos('<span>Los puntitos azules son electrones. '+(tipo==="serie"?"En serie todos los focos comparten la misma corriente: si quitas uno, ¡se apagan todos!":"En paralelo cada foco tiene su propio camino: si uno se funde, los demás siguen prendidos.")+'</span>');
    else c.datos('<span>Resistencia equivalente: <b>'+PF.fmt(s.Req,2)+' Ω</b></span><span>Corriente total: <b>'+PF.fmt(s.It,3)+' A</b></span><span>Potencia total: <b>'+PF.fmt(V*s.It,2)+' W</b></span>'+(c.n>=3?'<span>P₁, P₂, P₃: <b>'+s.P.map(function(p){return PF.fmt(p,2);}).join(" W, ")+' W</b></span>':''));
  }
  c.nota("Ley de Ohm: V = I·R. En serie las resistencias se suman (R = R₁+R₂+R₃) y la corriente es la misma en todas; en paralelo el voltaje es el mismo en cada rama y 1/R = 1/R₁+1/R₂+1/R₃. El brillo es proporcional a la potencia P = V·I.");
});

/* ---------- Óptica: reflexión, refracción, lentes y prisma ---------- */
var MEDIOS = {aire:[1.000,"Aire"], agua:[1.333,"Agua"], vidrio:[1.50,"Vidrio"], diamante:[2.42,"Diamante"], aceite:[1.47,"Aceite"]};
PFSim.def("optica",{t:"Banco óptico", ayuda:"Elige un experimento y mueve los controles"}, function(c){
  var g = c.canvas(.55, 300, 470);
  var modo=c.opc.modo||"refraccion", th=40, n1="aire", n2="agua", f=120, dob=260, hob=50, arr=false;
  var sModo=c.select({l:"Experimento", ops:[["reflexion","Reflexión en un espejo"],["refraccion","Refracción (ley de Snell)"],["lente","Lente delgada"],["prisma","Prisma: dispersión"]], v:modo, on:function(v){modo=v;vista();}});
  var sTh=c.slider({l:"Ángulo de incidencia", min:0, max:89, paso:1, v:th, u:"°", dec:0, on:function(v){th=v;}});
  var sN1=c.select({l:"Medio de arriba", ops:Object.keys(MEDIOS).map(function(k){return [k,MEDIOS[k][1]+" (n = "+MEDIOS[k][0]+")"];}), v:n1, on:function(v){n1=v;}});
  var sN2=c.select({l:"Medio de abajo", ops:Object.keys(MEDIOS).map(function(k){return [k,MEDIOS[k][1]+" (n = "+MEDIOS[k][0]+")"];}), v:n2, on:function(v){n2=v;}});
  var sF=c.slider({l:"Distancia focal f", min:-200, max:200, paso:5, v:f, fmt:function(v){ return v+" (u.a.) · "+(v>0?"convergente":"divergente"); }, on:function(v){ if(Math.abs(v)<20) v=v<0?-20:20; f=v;}});
  var sD=c.slider({l:"Distancia del objeto", min:40, max:420, paso:5, v:dob, dec:0, on:function(v){dob=v;}});
  function vista(){ var r=modo==="refraccion", l=modo==="lente"; sTh.mostrar(!l); sN1.mostrar(r); sN2.mostrar(r); sF.mostrar(l); sD.mostrar(l); }
  vista();
  c.puntero(c.cv,{abajo:function(p){arr=true;mover(p);}, mover:function(p,ab){ if(ab&&arr) mover(p); }, arriba:function(){arr=false;}});
  function mover(p){
    if(modo==="lente"){ dob=Math.max(40,Math.min(c.W/2-20,c.W/2-p.x)); sD.set(Math.round(dob)); hob=Math.max(-80,Math.min(80,c.H/2-p.y)); }
    else if(modo==="reflexion"||modo==="refraccion"){ var cx=c.W/2, cy=modo==="reflexion"?c.H*.72:c.H/2; var a=Math.atan2(cx-p.x, cy-p.y)*180/Math.PI; th=Math.max(0,Math.min(89,Math.abs(a))); sTh.set(Math.round(th)); }
  }
  c.loop(function(){ dibujar(); });
  function rayo(x1,y1,x2,y2,col,w,guion){ F.linea(g,[[x1,y1],[x2,y2]],col,w||2.5,guion); }
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), verde=c.col("verde");
    var luz = PF.tema()==="papel" ? "#E0A100" : "#FFD54A";
    if(modo==="reflexion"){
      var cx=c.W/2, cy=c.H*.72, L=Math.min(c.W,c.H)*.6, a=th*Math.PI/180;
      F.rect(g,cx-c.W*.35,cy,c.W*.7,10,c.col("papel-2")); F.linea(g,[[cx-c.W*.35,cy],[cx+c.W*.35,cy]],tinta,3);
      for(var x=cx-c.W*.35;x<cx+c.W*.35;x+=12) F.linea(g,[[x,cy+2],[x-8,cy+12]],t3,1);
      F.linea(g,[[cx,cy],[cx,cy-L*1.05]],t3,1.2,[5,5]);
      var sx=cx-L*Math.sin(a), sy=cy-L*Math.cos(a);
      rayo(sx,sy,cx,cy,luz,3); F.flecha(g,(sx+cx)/2-1,(sy+cy)/2,(sx+cx)/2+Math.sin(a)*2,(sy+cy)/2+Math.cos(a)*2,luz,3);
      var rx=cx+L*Math.sin(a), ry=cy-L*Math.cos(a); rayo(cx,cy,rx,ry,luz,3); F.flecha(g,cx,cy,(cx+rx)/2,(cy+ry)/2,luz,3);
      F.circulo(g,sx,sy,10,luz,tinta,1.5);
      arco(cx,cy,-Math.PI/2-a,-Math.PI/2,50,tinta,"θᵢ = "+Math.round(th)+"°",-1);
      arco(cx,cy,-Math.PI/2,-Math.PI/2+a,64,tinta,"θᵣ = "+Math.round(th)+"°",1);
      if(c.n===1) c.datos('<span>La luz rebota en el espejo como una pelota en la pared: sale con el mismo ángulo con el que llegó.</span>');
      else c.datos('<span>Ángulo de incidencia: <b>'+Math.round(th)+'°</b></span><span>Ángulo de reflexión: <b>'+Math.round(th)+'°</b></span><span>Ley de la reflexión: θᵢ = θᵣ</span>');
    } else if(modo==="refraccion"){
      var cx2=c.W/2, cy2=c.H/2, L2=Math.min(c.W,c.H)*.46, a2=th*Math.PI/180, N1=MEDIOS[n1][0], N2=MEDIOS[n2][0];
      g.fillStyle = n2==="agua"?"rgba(80,150,220,.22)":(n2==="aire"?"rgba(0,0,0,0)":"rgba(140,170,190,.25)"); g.fillRect(0,cy2,c.W,c.H-cy2);
      g.fillStyle = n1==="agua"?"rgba(80,150,220,.22)":(n1==="aire"?"rgba(0,0,0,0)":"rgba(140,170,190,.25)"); g.fillRect(0,0,c.W,cy2);
      F.linea(g,[[0,cy2],[c.W,cy2]],tinta,2);
      F.linea(g,[[cx2,cy2-L2*1.1],[cx2,cy2+L2*1.1]],t3,1.2,[5,5]);
      F.texto(g,MEDIOS[n1][1]+" · n₁ = "+N1,14,22,{tam:13,color:tinta}); F.texto(g,MEDIOS[n2][1]+" · n₂ = "+N2,14,c.H-12,{tam:13,color:tinta});
      var sx2=cx2-L2*Math.sin(a2), sy2=cy2-L2*Math.cos(a2);
      rayo(sx2,sy2,cx2,cy2,luz,3); F.flecha(g,sx2,sy2,(sx2+cx2)/2,(sy2+cy2)/2,luz,3);
      var s2 = N1/N2*Math.sin(a2), tir = s2>1;
      // reflejado parcial
      g.globalAlpha = tir?1:.35; rayo(cx2,cy2,cx2+L2*Math.sin(a2),cy2-L2*Math.cos(a2),luz,tir?3:2); g.globalAlpha=1;
      var b2=0;
      if(!tir){ b2=Math.asin(s2); var tx=cx2+L2*Math.sin(b2), ty=cy2+L2*Math.cos(b2); rayo(cx2,cy2,tx,ty,luz,3); F.flecha(g,cx2,cy2,(cx2+tx)/2,(cy2+ty)/2,luz,3); arco(cx2,cy2,Math.PI/2-b2,Math.PI/2,56,tinta,"θ₂ = "+PF.fmt(b2*180/Math.PI,1)+"°",1,true); }
      arco(cx2,cy2,-Math.PI/2-a2,-Math.PI/2,50,tinta,"θ₁ = "+Math.round(th)+"°",-1);
      F.circulo(g,sx2,sy2,10,luz,tinta,1.5);
      var crit = N1>N2 ? Math.asin(N2/N1)*180/Math.PI : null;
      if(tir) F.texto(g,"¡Reflexión total interna!",c.W-14,26,{mano:true,tam:24,color:rojo,alin:"right"});
      if(c.n===1) c.datos('<span>'+(tir?"¡La luz no puede salir y rebota completa! Así funcionan los cables de fibra óptica.":"Al cambiar de material, la luz cambia de rapidez y se «dobla». Por eso un popote se ve chueco en un vaso de agua.")+'</span>');
      else c.datosTex('<span>θ₁ = <b>'+Math.round(th)+'°</b></span><span>θ₂ = <b>'+(tir?"—":PF.fmt(b2*180/Math.PI,1)+"°")+'</b></span><span>Rapidez de la luz abajo: <b>'+PF.fmt(3e5/N2,0)+' km/s</b></span>'+(crit?'<span>Ángulo crítico: <b>'+PF.fmt(crit,1)+'°</b></span>':'')+(c.n>=3?'<span class="ec">\\(n_1\\sin\\theta_1=n_2\\sin\\theta_2\\;\\Rightarrow\\;'+N1+'\\sin '+Math.round(th)+'^\\circ='+N2+'\\sin\\theta_2\\)</span>':''));
    } else if(modo==="lente"){
      var ax=c.H/2, lx=c.W/2, hob2=hob, ff=f;
      F.linea(g,[[0,ax],[c.W,ax]],t3,1.2,[6,5]);
      // lente
      g.strokeStyle=boli; g.lineWidth=3; g.beginPath();
      var hl=c.H*.42;
      if(ff>0){ g.moveTo(lx,ax-hl); g.quadraticCurveTo(lx+16,ax,lx,ax+hl); g.quadraticCurveTo(lx-16,ax,lx,ax-hl); }
      else { g.moveTo(lx-10,ax-hl); g.lineTo(lx+10,ax-hl); g.quadraticCurveTo(lx+2,ax,lx+10,ax+hl); g.lineTo(lx-10,ax+hl); g.quadraticCurveTo(lx-2,ax,lx-10,ax-hl); }
      g.stroke();
      [ff,-ff,2*ff,-2*ff].forEach(function(x,i){ F.circulo(g,lx+x,ax,3.5,tinta); F.texto(g,i<2?(x>0?"F'":"F"):(x>0?"2F'":"2F"),lx+x,ax+18,{alin:"center",tam:12,color:t3}); });
      var ox=lx-dob, oy=ax-hob2;
      F.flecha(g,ox,ax,ox,oy,rojo,3.5);
      var di = 1/(1/ff - 1/dob), m = -di/dob, ix=lx+di, iy=ax - m*hob2;
      var real = di>0 && isFinite(di);
      var ext = c.W*2;
      // rayo 1: paralelo → por F'
      rayo(ox,oy,lx,oy,luz,2.2);
      var d1x = ff, d1y = -( -hob2 ); // desde (lx,oy) hacia (lx+f, ax)
      var dir1 = [ff>0? 1: -1, 0]; // calculado abajo
      var px1=lx+ff, py1=ax; var vx=px1-lx, vy=py1-oy; var l1=Math.hypot(vx,vy); vx/=l1; vy/=l1;
      if(ff>0){ rayo(lx,oy,lx+vx*ext,oy+vy*ext,luz,2.2); if(!real) rayo(lx,oy,lx-vx*ext,oy-vy*ext,luz,1.2,[5,5]); }
      else { rayo(lx,oy,lx-vx*ext,oy-vy*ext,luz,2.2); rayo(lx,oy,px1,py1,luz,1.2,[5,5]); }
      // rayo 2: por el centro
      var vx2=lx-ox, vy2=ax-oy, l2=Math.hypot(vx2,vy2); vx2/=l2; vy2/=l2;
      rayo(ox,oy,lx+vx2*ext,ax+vy2*ext,luz,2.2); if(!real) rayo(lx,ax,lx-vx2*ext,ax-vy2*ext,luz,1.2,[5,5]);
      // rayo 3: por F → sale paralelo
      var fx=lx-ff, vx3=fx-ox, vy3=ax-oy; var ty3 = oy + vy3/vx3*(lx-ox);
      if(isFinite(ty3) && Math.abs(ty3-ax)<hl){ rayo(ox,oy,lx,ty3,luz,2.2); rayo(lx,ty3,c.W,ty3,luz,2.2); if(!real) rayo(lx,ty3,0,ty3,luz,1.2,[5,5]); if(ff<0) rayo(ox,oy,fx,ax,luz,1.2,[5,5]); }
      if(isFinite(di) && Math.abs(iy-ax)<c.H){ F.flecha(g,ix,ax,ix,iy,real?verde:c.col("n4"),3.5,"",real?null:{guion:true}); F.texto(g,real?"imagen real":"imagen virtual",ix,iy+(iy<ax?-10:18),{mano:true,tam:20,alin:"center",color:real?verde:c.col("n4")}); }
      F.texto(g,"objeto",ox,oy-10,{mano:true,tam:20,alin:"center",color:rojo});
      if(c.n===1) c.datos('<span>'+(real?"La lente junta los rayos de luz y forma una imagen "+(m<0?"¡de cabeza!":"")+" que puedes ver en una pantalla.":"Esta imagen no se puede proyectar: tu ojo la «ve» detrás de la lente, como en una lupa.")+'</span>');
      else c.datosTex('<span>Imagen <b>'+(real?"real":"virtual")+'</b>, <b>'+(m<0?"invertida":"derecha")+'</b>, <b>'+(Math.abs(m)>1?"más grande":"más pequeña")+'</b></span><span>d<sub>o</sub> = <b>'+dob+'</b></span><span>d<sub>i</sub> = <b>'+PF.fmt(di,1)+'</b></span><span>Aumento m = <b>'+PF.fmt(m,2)+'</b></span>'+(c.n>=3?'<span class="ec">\\(\\dfrac{1}{f}=\\dfrac{1}{d_o}+\\dfrac{1}{d_i}\\;\\Rightarrow\\;\\dfrac{1}{'+ff+'}=\\dfrac{1}{'+dob+'}+\\dfrac{1}{d_i}\\)</span>':''));
    } else {
      // prisma
      var cxp=c.W*.5, cyp=c.H*.6, sz=Math.min(c.W,c.H)*.62;
      var V0=[cxp,cyp-sz*.62], V1=[cxp-sz*.55,cyp+sz*.33], V2=[cxp+sz*.55,cyp+sz*.33];
      g.fillStyle="rgba(140,180,210,.22)"; g.beginPath(); g.moveTo(V0[0],V0[1]); g.lineTo(V1[0],V1[1]); g.lineTo(V2[0],V2[1]); g.closePath(); g.fill(); g.strokeStyle=tinta; g.lineWidth=2; g.stroke();
      // punto de entrada en la cara izquierda
      var ent=[V0[0]+(V1[0]-V0[0])*.5, V0[1]+(V1[1]-V0[1])*.5];
      var fx2=V1[0]-V0[0], fy2=V1[1]-V0[1], fl=Math.hypot(fx2,fy2); var nrm=[-fy2/fl, fx2/fl]; // normal hacia fuera (izquierda)
      if(nrm[0]>0){ nrm=[-nrm[0],-nrm[1]]; }
      var a3=th*Math.PI/180; // ángulo respecto a la normal
      var din=[-nrm[0], -nrm[1]]; // dirección normal hacia dentro
      // rota din por a3 (hacia abajo)
      var ca=Math.cos(a3), sa=Math.sin(a3);
      var d0=[din[0]*ca - din[1]*sa*-1, din[0]*sa*-1*-1 + din[1]*ca];
      d0=[din[0]*ca + din[1]*sa, -din[0]*sa + din[1]*ca];
      var origen=[ent[0]-d0[0]*c.W, ent[1]-d0[1]*c.W];
      F.linea(g,[origen,ent],PF.tema()==="papel"?"#555":"#fff",4);
      var lams=[700,650,600,570,530,480,430];
      lams.forEach(function(nm){
        var n = 1.5046 + 14000/(nm*nm); // dispersión exagerada ×3 para que se aprecie
        var t1 = refractar(d0, nrm, 1/n); if(!t1) return;
        // intersección con cara derecha V0–V2 o base V1–V2
        var hit = interseca(ent, t1, [[V0,V2],[V1,V2]]);
        if(!hit) return;
        F.linea(g,[ent,hit.p],colorLambda(nm,.85),1.6);
        var t2 = refractar(t1, hit.n, n);
        if(!t2) return;
        F.linea(g,[hit.p,[hit.p[0]+t2[0]*c.W, hit.p[1]+t2[1]*c.W]],colorLambda(nm),2.6);
      });
      if(c.n===1) c.datos('<span>¡La luz blanca está hecha de todos los colores! El prisma los separa porque cada color se dobla un poquito distinto. Así se forma el arcoíris en las gotas de lluvia.</span>');
      else c.datos('<span>El índice de refracción depende del color: violeta ≈ '+PF.fmt(1.5046+4200/430/430,3)+', rojo ≈ '+PF.fmt(1.5046+4200/700/700,3)+' (en el dibujo la diferencia está exagerada para que se vea)</span><span>El violeta se desvía más que el rojo (dispersión).</span>');
    }
  }
  function refractar(d, n, eta){ // n normal unitaria que apunta contra d
    var cosi = -(d[0]*n[0]+d[1]*n[1]);
    if(cosi<0){ n=[-n[0],-n[1]]; cosi=-cosi; }
    var k = 1 - eta*eta*(1-cosi*cosi);
    if(k<0) return null;
    var t=[eta*d[0] + (eta*cosi - Math.sqrt(k))*n[0], eta*d[1] + (eta*cosi - Math.sqrt(k))*n[1]];
    var l=Math.hypot(t[0],t[1]); return [t[0]/l,t[1]/l];
  }
  function interseca(o, d, caras){
    var mejor=null;
    caras.forEach(function(cr){
      var a=cr[0], b=cr[1], ex=b[0]-a[0], ey=b[1]-a[1];
      var den = d[0]*ey - d[1]*ex; if(Math.abs(den)<1e-9) return;
      var t = ((a[0]-o[0])*ey - (a[1]-o[1])*ex)/den, u = ((a[0]-o[0])*d[1] - (a[1]-o[1])*d[0])/den;
      if(t>1e-6 && u>=0 && u<=1 && (!mejor || t<mejor.t)){ var l=Math.hypot(ex,ey); mejor={t:t, p:[o[0]+d[0]*t, o[1]+d[1]*t], n:[-ey/l, ex/l]}; }
    });
    return mejor;
  }
  function arco(x,y,a1,a2,r,col,etq,lado,abajo){
    g.strokeStyle=col; g.lineWidth=1.4; g.beginPath(); g.arc(x,y,r,a1,a2); g.stroke();
    var am=(a1+a2)/2; F.texto(g,etq,x+Math.cos(am)*(r+14)+(lado<0?-4:4),y+Math.sin(am)*(r+14)+(abajo?8:0),{mano:true,tam:19,color:col,alin:lado<0?"right":"left"});
  }
  c.nota("La luz viaja más lento en materiales con mayor índice de refracción n (en el agua, a unos 225 000 km/s). Al cambiar de rapidez cambia de dirección: eso es la refracción.");
});

/* ---------- Gas ideal en un pistón ---------- */
PFSim.def("gas",{t:"Gas en un pistón", ayuda:"Calienta el gas o mueve el pistón"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var N=70, T=300, Vf=.8, modo="iso", P=[], pist=.8, impulso=0, tAcum=0, presion=0;
  c.slider({l:"Temperatura del baño", min:50, max:900, paso:10, v:T, u:"K", dec:0, on:function(v){T=v;}});
  c.slider({l:"Posición del pistón (volumen)", min:.25, max:1, paso:.01, v:Vf, fmt:function(v){return Math.round(v*100)+" %";}, on:function(v){Vf=v;}});
  var sm=c.select({l:"Paredes", ops:[["iso","Conectado a un baño térmico (T fija)"],["adia","Aislado (adiabático)"]], v:"iso", on:function(v){modo=v;}});
  c.slider({l:"Número de partículas", min:10, max:150, paso:5, v:N, dec:0, on:function(v){ N=v; crear(); }});
  function v0(){ return Math.sqrt(T)*6; }
  function crear(){ P=[]; for(var i=0;i<N;i++){ var a=Math.random()*Math.PI*2, s=v0()*(.5+Math.random()); P.push({x:Math.random()*.9*pist+.02, y:Math.random()*.9+.05, vx:Math.cos(a)*s, vy:Math.sin(a)*s}); } }
  crear();
  var hist=[];
  c.loop(function(dt){
    var bx=30, by=24, bw=c.W*.56, bh=c.H-48;
    var objetivo=Vf, u=(objetivo-pist)*3; pist += u*dt; var upx = u*bw; // velocidad del pistón en px/s
    var Wp = pist*bw;
    var r=4;
    for(var i=0;i<P.length;i++){
      var p=P[i]; p.x += p.vx*dt/bw; p.y += p.vy*dt/bh;
      var X=p.x*bw, Y=p.y*bh;
      if(X<r){ p.x=r/bw; p.vx=Math.abs(p.vx); impulso+=2*Math.abs(p.vx); }
      if(X>Wp-r){ p.x=(Wp-r)/bw; var vrel=p.vx-upx; if(vrel>0){ p.vx = 2*upx - p.vx; impulso+=2*Math.abs(vrel);} }
      if(Y<r){ p.y=r/bh; p.vy=Math.abs(p.vy); impulso+=2*Math.abs(p.vy); }
      if(Y>bh-r){ p.y=(bh-r)/bh; p.vy=-Math.abs(p.vy); impulso+=2*Math.abs(p.vy); }
    }
    // choques entre partículas (elásticos, masas iguales)
    for(i=0;i<P.length;i++) for(var j=i+1;j<P.length;j++){
      var a=P[i], b=P[j], dx=(b.x-a.x)*bw, dy=(b.y-a.y)*bh, d2=dx*dx+dy*dy;
      if(d2<64 && d2>0){ var d=Math.sqrt(d2), nx=dx/d, ny=dy/d, dv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny; if(dv>0){ a.vx-=dv*nx; a.vy-=dv*ny; b.vx+=dv*nx; b.vy+=dv*ny; } }
    }
    // termostato
    var ke=0; P.forEach(function(p){ ke+=p.vx*p.vx+p.vy*p.vy; }); var Tmed = ke/P.length/2/18; // tal que v0 ↔ T
    if(modo==="iso" && Tmed>0){ var f=Math.sqrt(1 + (T/Tmed-1)*Math.min(1,dt*3)); P.forEach(function(p){ p.vx*=f; p.vy*=f; }); }
    tAcum+=dt; if(tAcum>.5){ presion = impulso/tAcum/(2*(Wp+bh)); impulso=0; tAcum=0; }
    dibujar(bx,by,bw,bh,Wp,Tmed);
  });
  function dibujar(bx,by,bw,bh,Wp,Tmed){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var caliente = Math.min(1,Tmed/900);
    if(modo==="iso"){ g.fillStyle="rgba("+Math.round(80+175*caliente)+",80,"+Math.round(220-180*caliente)+",.25)"; g.fillRect(bx-10,by+bh,Wp+20,14); F.texto(g,"baño térmico",bx,by+bh+11,{tam:10,color:tinta}); }
    F.linea(g,[[bx+bw+40,by],[bx,by],[bx,by+bh],[bx+bw+40,by+bh]],tinta,3);
    F.rect(g,bx+Wp,by+2,12,bh-4,c.col("papel-2"),tinta,2); F.rect(g,bx+Wp+12,by+bh/2-5,bw*.5,10,t3);
    P.forEach(function(p){ var s=Math.hypot(p.vx,p.vy)/(Math.sqrt(900)*6*1.5); var col="hsl("+Math.round(220-200*Math.min(1,s))+",75%,50%)"; F.circulo(g,bx+p.x*bw,by+p.y*bh,4,col); });
    // termómetro / medidores
    var mx=bx+bw+70, mw=c.W-mx-20;
    if(mw>60){
      F.texto(g,"Temperatura",mx,by+14,{tam:12,color:t3}); F.rect(g,mx,by+20,mw,10,null,tinta,1); F.rect(g,mx,by+20,mw*Math.min(1,Tmed/900),10,rojo);
      F.texto(g,"Presión",mx,by+52,{tam:12,color:t3}); F.rect(g,mx,by+58,mw,10,null,tinta,1); F.rect(g,mx,by+58,mw*Math.min(1,presion/(P.length*3600*2.3e-4)),10,boli);
      F.texto(g,"Volumen",mx,by+90,{tam:12,color:t3}); F.rect(g,mx,by+96,mw,10,null,tinta,1); F.rect(g,mx,by+96,mw*pist,10,c.col("verde"));
      if(c.n>=4){
        // histograma de rapideces
        var hb=12, hh=bh-150, hy=by+130+hh, cuenta=new Array(hb).fill(0), vmax=Math.sqrt(900)*6*2.2;
        P.forEach(function(p){ var k=Math.min(hb-1,Math.floor(Math.hypot(p.vx,p.vy)/vmax*hb)); cuenta[k]++; });
        var mxc=Math.max.apply(null,cuenta)||1;
        cuenta.forEach(function(n,k){ F.rect(g,mx+k*mw/hb,hy-n/mxc*hh,mw/hb-2,n/mxc*hh,"rgba(37,70,200,.45)"); });
        // curva teórica 2D: f(v) ∝ v e^{-v²/(2σ²)}
        var sig2=Tmed*18, pts=[]; var fmax=Math.sqrt(sig2)*Math.exp(-.5);
        for(var q=0;q<=40;q++){ var v=q/40*vmax; pts.push([mx+q/40*mw, hy - (v*Math.exp(-v*v/(2*sig2)))/fmax*hh*.95]); }
        F.linea(g,pts,rojo,2);
        F.texto(g,"rapideces (Maxwell–Boltzmann 2D)",mx,hy+14,{tam:11,color:t3});
      }
    }
    var PV = presion*pist;
    if(c.n===1) c.datos('<span>Las bolitas son moléculas de gas. Con más calor se mueven más rápido y chocan más fuerte contra las paredes: ¡eso es la presión!</span>');
    else c.datos('<span>T = <b>'+PF.fmt(Tmed,0)+' K</b></span><span>V = <b>'+Math.round(pist*100)+' %</b></span><span>P (medida) = <b>'+PF.fmt(presion,0)+'</b> u.a.</span>'+(c.n>=3?'<span>P·V/T = <b>'+PF.fmt(100*PV/Math.max(1,Tmed),1)+'</b> u.a. (casi constante)</span>':''));
  }
  c.nota("Con el baño térmico, comprimir el gas sube la presión (ley de Boyle, PV = constante). Aislado, el pistón que empuja «golpea» a las moléculas y las acelera: el gas se calienta al comprimirlo. Es lo que pasa al inflar una llanta con una bomba de mano.");
});

/* ---------- Ciclo de Carnot ---------- */
PFSim.def("carnot",{t:"Ciclo de Carnot", ayuda:"Cambia las temperaturas y observa el trabajo"}, function(c){
  var g = c.canvas(.55, 320, 470);
  var Th=600, Tc=300, r=3, t=0, gam=5/3, R=8.314;
  c.slider({l:"Temperatura del foco caliente", min:350, max:1200, paso:10, v:Th, u:"K", dec:0, on:function(v){ Th=v; if(Tc>Th-40) Tc=Th-40; }});
  c.slider({l:"Temperatura del foco frío", min:100, max:800, paso:10, v:Tc, u:"K", dec:0, on:function(v){ Tc=Math.min(v,Th-40); }});
  c.slider({l:"Expansión isotérmica V₂/V₁", min:1.3, max:5, paso:.1, v:r, dec:1, on:function(v){ r=v; }});
  var etapas=["1 → 2: expansión isotérmica (absorbe calor Q_h del foco caliente)","2 → 3: expansión adiabática (se enfría sin intercambiar calor)","3 → 4: compresión isotérmica (cede calor Q_c al foco frío)","4 → 1: compresión adiabática (se calienta sin intercambiar calor)"];
  c.loop(function(dt){ t=(t+dt*.35)%4; dibujar(); });
  function estados(){
    var V1=1, V2=r*V1, k=Math.pow(Th/Tc,1/(gam-1)), V3=V2*k, V4=V1*k;
    return {V:[V1,V2,V3,V4]};
  }
  function P(V,T){ return R*T/V; }
  function punto(s, u){ // etapa s (0..3), fracción u
    var e=estados(), V=e.V;
    if(s===0){ var v=V[0]*Math.pow(V[1]/V[0],u); return [v,P(v,Th),Th]; }
    if(s===1){ var v2=V[1]*Math.pow(V[2]/V[1],u); var T=Th*Math.pow(V[1]/v2,gam-1); return [v2,P(v2,T),T]; }
    if(s===2){ var v3=V[2]*Math.pow(V[3]/V[2],u); return [v3,P(v3,Tc),Tc]; }
    var v4=V[3]*Math.pow(V[0]/V[3],u); var T4=Tc*Math.pow(V[3]/v4,gam-1); return [v4,P(v4,T4),T4];
  }
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), verde=c.col("verde");
    var e=estados(), Vmax=e.V[2]*1.1, Pmax=P(e.V[0],Th)*1.1;
    var gx=56, gy=20, gw=c.W*.58-56, gh=c.H-60;
    var tx=function(v){ return gx + v/Vmax*gw; };
    var ty=function(p){ return gy+gh - p/Pmax*gh; };
    F.linea(g,[[gx,gy],[gx,gy+gh],[gx+gw,gy+gh]],tinta,1.5);
    F.texto(g,"P",gx-24,gy+10,{tam:14,color:tinta,serif:true}); F.texto(g,"V",gx+gw,gy+gh+18,{tam:12,color:t3,alin:"right"});
    // área
    var todo=[]; for(var s=0;s<4;s++) for(var k=0;k<=30;k++){ var q=punto(s,k/30); todo.push([tx(q[0]),ty(q[1])]); }
    g.fillStyle="rgba(46,140,112,.16)"; g.beginPath(); todo.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.closePath(); g.fill();
    var cols=[rojo,t3,boli,t3];
    for(s=0;s<4;s++){ var pts=[]; for(k=0;k<=40;k++){ var q2=punto(s,k/40); pts.push([tx(q2[0]),ty(q2[1])]); } F.linea(g,pts,cols[s],s%2?2:3, s%2?[6,4]:null); }
    for(s=0;s<4;s++){ var q3=punto(s,0); F.circulo(g,tx(q3[0]),ty(q3[1]),4,tinta); F.texto(g,String(s+1),tx(q3[0])+(s<2?-12:8),ty(q3[1])+(s===0?-6:(s===2?14:0)),{tam:14,color:tinta,negr:true}); }
    F.texto(g,"W",tx(Math.sqrt(e.V[0]*e.V[2])),ty(Math.sqrt(P(e.V[0],Th)*P(e.V[2],Tc)))+4,{mano:true,tam:28,color:verde,alin:"center"});
    var et=Math.floor(t), u=t-et, q4=punto(et,u);
    F.circulo(g,tx(q4[0]),ty(q4[1]),8,c.col("n1"),tinta,2);
    // pistón esquemático
    var px=c.W*.66, pw=c.W*.28, py=40, ph=c.H*.42;
    var vf = (q4[0]-e.V[0])/(e.V[2]-e.V[0]);
    F.rect(g,px,py,pw,ph,null,tinta,2.5);
    var piston=py+ph - (ph-14)*(.15+.8*vf);
    var calor = (q4[2]-Tc)/(Th-Tc);
    g.fillStyle="rgba("+Math.round(60+190*calor)+",90,"+Math.round(220-170*calor)+",.35)"; g.fillRect(px+2,piston,pw-4,py+ph-piston-2);
    F.rect(g,px+2,piston-10,pw-4,10,c.col("papel-2"),tinta,1.5); F.rect(g,px+pw/2-4,py-10,8,piston-py,t3);
    var foco = et===0?"caliente":(et===2?"frío":"aislado");
    var fc = et===0?rojo:(et===2?boli:t3);
    F.rect(g,px,py+ph+8,pw,22,fc); F.texto(g, foco==="aislado"?"aislado (sin calor)":"foco "+foco+" ("+(et===0?Th:Tc)+" K)", px+pw/2, py+ph+23, {alin:"center",tam:12,color:"#fff",negr:true});
    F.texto(g, PF.fmt(q4[2],0)+" K", px+pw/2, piston+24, {alin:"center",tam:14,color:tinta,negr:true});
    var Qh=R*Th*Math.log(r), Qc=R*Tc*Math.log(r), W=Qh-Qc, eta=1-Tc/Th;
    c.datos((c.n===1?'<span>Una máquina térmica toma calor de algo caliente, convierte una parte en movimiento y tira el resto a algo frío.</span>':'<span>Etapa: <b>'+etapas[et]+'</b></span>')+
      (c.n>=2?'<span>Eficiencia máxima: <b>'+PF.fmt(eta*100,1)+' %</b></span>':'')+(c.n>=3?'<span>Por mol: Q<sub>h</sub> = <b>'+PF.fmt(Qh,0)+' J</b>, Q<sub>c</sub> = <b>'+PF.fmt(Qc,0)+' J</b>, W = <b>'+PF.fmt(W,0)+' J</b></span>':''));
  }
  c.nota("Ninguna máquina que opere entre dos temperaturas puede superar la eficiencia de Carnot, η = 1 − T<sub>c</sub>/T<sub>h</sub> (temperaturas en kelvin). Es una consecuencia directa de la segunda ley de la termodinámica. El área encerrada en el diagrama P–V es el trabajo neto por ciclo.");
});

if(window.PF && PF.listo) PFSim.montarTodas(document);
})();
