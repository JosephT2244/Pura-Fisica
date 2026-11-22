/* Pura Física! — física moderna y de frontera */
(function(){
"use strict";
var F = PFSim.dib;
var Cc=2.99792458e8, Gn=6.674e-11, HB=1.054571817e-34, KB=1.380649e-23, MSOL=1.989e30, EV=1.602176634e-19, HP=6.62607015e-34;

/* ---------- Reloj de luz: dilatación del tiempo ---------- */
PFSim.def("relatividad",{t:"Reloj de luz y dilatación del tiempo", ayuda:"Sube la rapidez de la nave"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var b=.6, t=0, tickT=0, tickN=0, x=0;
  c.slider({l:"Rapidez de la nave (fracción de c)", min:0, max:.995, paso:.005, v:b, fmt:function(v){ return PF.fmt(v,3)+" c"; }, on:function(v){ b=v; t=0; tickT=0; tickN=0; }});
  c.botones().b("Reiniciar relojes", function(){ t=0; tickT=0; tickN=0; });
  c.loop(function(dt){ t+=dt; dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), am=c.col("n1");
    var gam = 1/Math.sqrt(1-b*b);
    var H = c.H*.55, P = 1.6; // periodo del reloj en reposo (s de animación)
    // reloj en reposo (izquierda)
    var x0=c.W*.12, y0=40, w=46;
    F.rect(g,x0-w/2,y0,w,6,tinta); F.rect(g,x0-w/2,y0+H,w,6,tinta);
    var fase=(t%P)/P, yy = fase<.5 ? y0+6+(H-6)*fase*2 : y0+H-(H-6)*(fase-.5)*2;
    F.circulo(g,x0,yy,6,am); F.linea(g,[[x0,y0+6],[x0,y0+H]],am,1,[3,4]);
    var nR = Math.floor(t/P);
    F.texto(g, c.n===1?"Reloj en la Tierra":"Reloj en reposo", x0, y0+H+28, {alin:"center", tam:13, color:tinta});
    F.texto(g, "tic-tac: "+nR, x0, y0+H+46, {alin:"center", mano:true, tam:22, color:rojo});
    // reloj en movimiento: periodo γP; se mueve con b
    var Pm = P*gam, xr0 = c.W*.3, ancho = c.W*.65;
    var vpx = ancho/ (P*3) * b; // px/s
    var xm = xr0 + ((t*vpx) % ancho);
    var fm=(t%Pm)/Pm, ym = fm<.5 ? y0+6+(H-6)*fm*2 : y0+H-(H-6)*(fm-.5)*2;
    // nave contraída
    var largo = 90/gam;
    g.fillStyle=c.col("papel-2"); g.strokeStyle=tinta; g.lineWidth=2;
    g.beginPath(); g.moveTo(xm-largo/2, y0-6); g.lineTo(xm+largo/2, y0-6); g.lineTo(xm+largo/2+10/gam, y0+H/2); g.lineTo(xm+largo/2, y0+H+12); g.lineTo(xm-largo/2, y0+H+12); g.closePath(); g.fill(); g.stroke();
    F.rect(g,xm-w/2,y0,w,6,tinta); F.rect(g,xm-w/2,y0+H,w,6,tinta);
    // trayectoria diagonal del fotón (vista desde la Tierra)
    var pts=[]; for(var k=0;k<=60;k++){ var tt=t - k*0.02; if(tt<0) break; var xx=xr0+((tt*vpx)%ancho); if(xx>xm) break; var f2=(tt%Pm)/Pm, y2=f2<.5? y0+6+(H-6)*f2*2 : y0+H-(H-6)*(f2-.5)*2; pts.push([xx,y2]); }
    if(pts.length>1) F.linea(g,pts,am,1.5,[3,3]);
    F.circulo(g,xm,ym,6,am);
    F.texto(g, c.n===1?"Reloj en la nave":"Reloj que se mueve", xm, y0+H+28, {alin:"center", tam:13, color:tinta});
    F.texto(g, "tic-tac: "+Math.floor(t/Pm), xm, y0+H+46, {alin:"center", mano:true, tam:22, color:boli});
    F.flecha(g, xm-20, y0-22, xm+40, y0-22, boli, 2, PF.fmt(b,2)+" c");
    var anos = 10;
    if(c.n===1) c.datos('<span>Cuando la nave va muy, muy rápido, su reloj hace tic-tac <b>más lento</b>. Si viajaras 10 años en la Tierra, en la nave pasarían solo <b>'+PF.fmt(anos/gam,1)+' años</b>.</span>');
    else c.datosTex('<span>Factor de Lorentz γ = <b>'+PF.fmt(gam,3)+'</b></span><span>10 años en la Tierra = <b>'+PF.fmt(anos/gam,2)+' años</b> en la nave</span><span>Longitud de la nave: <b>'+PF.fmt(100/gam,1)+' %</b> de la original</span>'+(c.n>=3?'<span class="ec">\\(\\gamma=\\dfrac{1}{\\sqrt{1-v^2/c^2}},\\quad \\Delta t=\\gamma\\,\\Delta t_0,\\quad L=L_0/\\gamma\\)</span>':''));
  }
  c.nota("La luz viaja a la misma rapidez para todos. Visto desde la Tierra, el fotón de la nave recorre un camino diagonal más largo, así que cada tic-tac tarda más: el tiempo de la nave pasa más lento. Se ha medido con relojes atómicos en aviones y con muones de los rayos cósmicos.");
});

/* ---------- Diagrama de Minkowski ---------- */
PFSim.def("minkowski",{t:"Diagrama espacio-tiempo de Minkowski", ayuda:"Arrastra el evento B y cambia la velocidad del observador"}, function(c){
  var g = c.canvas(.62, 320, 520);
  var b=.4, B=[1.2,2.0], arr=false; // B = [x, ct]
  c.slider({l:"Velocidad del otro observador", min:-.9, max:.9, paso:.01, v:b, fmt:function(v){return PF.fmt(v,2)+" c";}, on:function(v){b=v;dibujar();}});
  function esc(){ return Math.min(c.W,c.H)/7.2; }
  function aP(x,ct){ var s=esc(); return [c.W/2+x*s, c.H/2-ct*s]; }
  c.puntero(c.cv,{abajo:function(p){ var q=aP(B[0],B[1]); arr=Math.hypot(p.x-q[0],p.y-q[1])<20; }, mover:function(p,ab){ if(ab&&arr){ var s=esc(); B=[Math.round((p.x-c.W/2)/s*10)/10, Math.round((c.H/2-p.y)/s*10)/10]; dibujar(); } }, arriba:function(){arr=false;}});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), am=c.col("n1"), lin=c.col("linea");
    var s=esc(), R=Math.max(c.W,c.H)/s;
    // cono de luz
    g.fillStyle="rgba(232,170,30,.10)"; g.beginPath(); var o=aP(0,0), u1=aP(-R,R), u2=aP(R,R); g.moveTo(o[0],o[1]); g.lineTo(u1[0],u1[1]); g.lineTo(u2[0],u2[1]); g.fill();
    var d1=aP(-R,-R), d2=aP(R,-R); g.beginPath(); g.moveTo(o[0],o[1]); g.lineTo(d1[0],d1[1]); g.lineTo(d2[0],d2[1]); g.fill();
    F.linea(g,[aP(-R,-R),aP(R,R)],am,1.6,[6,4]); F.linea(g,[aP(-R,R),aP(R,-R)],am,1.6,[6,4]);
    // ejes propios
    F.linea(g,[aP(-R,0),aP(R,0)],tinta,1.8); F.linea(g,[aP(0,-R),aP(0,R)],tinta,1.8);
    F.texto(g,"x",c.W-14,c.H/2-8,{tam:15,color:tinta,serif:true,alin:"right"}); F.texto(g,"ct",c.W/2+8,16,{tam:15,color:tinta,serif:true});
    // ejes del otro observador
    var ex=aP(R,R*b), et=aP(R*b,R), ex2=aP(-R,-R*b), et2=aP(-R*b,-R);
    if(c.n>=4){ var gam=1/Math.sqrt(1-b*b); g.globalAlpha=.5; for(var k=-6;k<=6;k++){ if(!k) continue;
      F.linea(g,[aP(-R, -b*R + k/gam), aP(R, b*R + k/gam)],boli,.8,[2,4]);
      F.linea(g,[aP(-b*R + k/gam, -R), aP(b*R + k/gam, R)],boli,.8,[2,4]); } g.globalAlpha=1; }
    F.linea(g,[ex2,ex],boli,2.2); F.linea(g,[et2,et],boli,2.2);
    F.texto(g,"x'",ex[0]>c.W?c.W-30:ex[0],Math.min(c.H-10,Math.max(14,ex[1]))-6,{tam:15,color:boli,serif:true});
    F.texto(g,"ct'",Math.min(c.W-30,Math.max(10,et[0]))+6,22,{tam:15,color:boli,serif:true});
    // eventos
    var A=aP(0,0), Bp=aP(B[0],B[1]);
    F.circulo(g,A[0],A[1],6,tinta); F.texto(g,"A",A[0]-10,A[1]+16,{tam:14,color:tinta,negr:true});
    F.circulo(g,Bp[0],Bp[1],8,rojo,tinta,1.5); F.texto(g,"B",Bp[0]+10,Bp[1]-8,{tam:14,color:rojo,negr:true});
    var gm=1/Math.sqrt(1-b*b), dx=B[0], dt=B[1], dtp=gm*(dt-b*dx), dxp=gm*(dx-b*dt), s2=dt*dt-dx*dx;
    var tipo = Math.abs(s2)<1e-6 ? "tipo luz (lo une un rayo de luz)" : (s2>0 ? "tipo tiempo (B puede ser causado por A)" : "tipo espacio (ningún mensaje puede ir de A a B)");
    if(c.n<=2) c.datos('<span>Cada punto es un <b>evento</b>: un lugar y un momento. La zona amarilla es todo lo que la luz que sale de A puede alcanzar.</span><span>B es <b>'+(s2>0?"alcanzable":"inalcanzable")+'</b> desde A.</span>');
    else c.datos('<span>Separación: <b>'+tipo+'</b></span><span>Δs² = (cΔt)² − Δx² = <b>'+PF.fmt(s2,2)+'</b> (igual para todos)</span><span>Para el otro observador: cΔt\' = <b>'+PF.fmt(dtp,2)+'</b>, Δx\' = <b>'+PF.fmt(dxp,2)+'</b></span>'+(s2<0&&dt*dtp<0?'<span><b>¡El orden de A y B se invierte para el otro observador!</b></span>':''));
  }
  c.nota("Los ejes del observador en movimiento se «cierran» como tijeras hacia la diagonal de la luz. Lo que es simultáneo para uno no lo es para el otro, pero el intervalo Δs² y la rapidez de la luz son iguales para todos.");
});

/* ---------- Efecto fotoeléctrico ---------- */
PFSim.def("fotoelectrico",{t:"Efecto fotoeléctrico", ayuda:"Cambia el color de la luz y el metal"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var lam=400, I=.6, met="sodio", fot=[], ele=[], cuenta=0;
  var MET = {cesio:[2.1,"Cesio"], potasio:[2.3,"Potasio"], sodio:[2.28,"Sodio"], zinc:[4.3,"Zinc"], cobre:[4.7,"Cobre"], platino:[5.65,"Platino"]};
  c.slider({l:"Longitud de onda", min:120, max:780, paso:5, v:lam, u:"nm", dec:0, on:function(v){lam=v;}});
  c.slider({l:"Intensidad", min:0, max:1, paso:.05, v:I, fmt:function(v){return Math.round(v*100)+" %";}, on:function(v){I=v;}});
  c.select({l:"Metal", ops:Object.keys(MET).map(function(k){return [k,MET[k][1]+" (φ = "+MET[k][0]+" eV)"];}), v:met, on:function(v){met=v;}});
  c.loop(function(dt){
    var E = 1239.84/lam, phi=MET[met][0];
    if(Math.random() < I*dt*40) fot.push({x:.05+Math.random()*.3, y:0});
    fot.forEach(function(p){ p.x+=dt*.5; p.y+=dt*.9; });
    fot = fot.filter(function(p){ if(p.y>=.62){ if(E>phi){ var K=E-phi; ele.push({x:p.x+ .62*.55, y:.62, v:Math.sqrt(K)*.35}); cuenta++; } return false; } return true; });
    ele.forEach(function(e){ e.x+=e.v*dt*.7; e.y-=e.v*dt*.7*.3; });
    ele = ele.filter(function(e){ return e.x<1.05; });
    dibujar(E, phi);
  });
  function dibujar(E, phi){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var col = lam>=380 && lam<=750 ? PFSim.colorLambda(lam) : (lam<380 ? "#8e5bd6" : "#a33");
    var W=c.W*.6, H=c.H;
    // lámpara
    F.circulo(g,W*.05,H*.06,14,col,tinta,1.5);
    // placa
    F.rect(g,W*.3,H*.62,W*.6,12,"#b8bec7",tinta,1.5); F.texto(g,MET[met][1],W*.6,H*.62+30,{alin:"center",tam:13,color:tinta});
    fot.forEach(function(p){
      var x=W*(p.x+p.y*.55), y=H*p.y;
      g.strokeStyle=col; g.lineWidth=2; g.beginPath(); for(var k=0;k<=12;k++){ var xx=x-k*1.6, yy=y-k*2.6+Math.sin(k*1.2)*3; if(k) g.lineTo(xx,yy); else g.moveTo(xx,yy);} g.stroke();
    });
    ele.forEach(function(e){ F.circulo(g,W*e.x,H*e.y-6,4,boli); });
    // gráfica K vs f
    var gx=c.W*.66, gw=c.W*.31, gy=30, gh=H*.6;
    var fmax=2.5e15, Kmax=8;
    F.linea(g,[[gx,gy],[gx,gy+gh],[gx+gw,gy+gh]],tinta,1.5);
    F.texto(g,"K máx (eV)",gx+4,gy+10,{tam:11,color:t3}); F.texto(g,"f",gx+gw,gy+gh+14,{tam:12,color:t3,alin:"right"});
    var f0=phi*EV/HP; var p1=[gx+f0/fmax*gw, gy+gh], p2=[gx+gw, gy+gh-((HP*fmax/EV)-phi)/Kmax*gh];
    F.linea(g,[p1,p2],boli,2);
    var f=Cc/(lam*1e-9), K=Math.max(0,E-phi);
    F.circulo(g,gx+Math.min(1,f/fmax)*gw, gy+gh-K/Kmax*gh, 5, rojo);
    F.texto(g,"f₀",p1[0],gy+gh+14,{tam:12,color:boli,alin:"center"});
    if(c.n===1) c.datos('<span>'+(E>phi?"¡La luz arranca electrones del metal!":"Esta luz no tiene suficiente energía: aunque la hagas más brillante, ¡no sale ningún electrón!")+'</span>');
    else c.datos('<span>Energía del fotón: <b>'+PF.fmt(E,2)+' eV</b></span><span>Función trabajo φ: <b>'+phi+' eV</b></span><span>'+(E>phi?'K<sub>máx</sub> = hf − φ = <b>'+PF.fmt(K,2)+' eV</b>':'<b>No hay emisión</b> (hf &lt; φ)')+'</span><span>Umbral: λ₀ = <b>'+PF.fmt(1239.84/phi,0)+' nm</b></span>');
  }
  c.nota("La física clásica decía que una luz más intensa siempre arrancaría electrones. No es así: solo importa la energía de cada fotón, E = hf. Einstein lo explicó en 1905 y por eso recibió el Premio Nobel de 1921.");
});

/* ---------- Átomo de Bohr y espectro del hidrógeno ---------- */
PFSim.def("atomo",{t:"Átomo de hidrógeno: saltos y colores", ayuda:"Toca un nivel para que el electrón salte"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=3, foton=null, lineas=[], anim=0;
  var bb=c.botones();
  [1,2,3,4,5,6].forEach(function(k){ bb.b("n = "+k, function(){ saltar(k); }); });
  bb.b("Borrar espectro", function(){ lineas=[]; });
  function E(k){ return -13.6/(k*k); }
  function saltar(k){
    if(k===n) return;
    if(k<n){ var dE=E(n)-E(k), l=1239.84/dE; foton={l:l, t:0, emi:true}; if(lineas.indexOf(Math.round(l))<0) lineas.push(Math.round(l)); }
    else { var dE2=E(k)-E(n); foton={l:1239.84/dE2, t:0, emi:false}; }
    n=k; anim=1;
  }
  c.puntero(c.cv,{abajo:function(p){ var cx=c.W*.28, cy=c.H*.45; var r=Math.hypot(p.x-cx,p.y-cy); var best=1,bd=1e9; for(var k=1;k<=6;k++){ var rk=rad(k); if(Math.abs(rk-r)<bd){bd=Math.abs(rk-r);best=k;} } if(bd<14) saltar(best); }});
  function rad(k){ return 14 + k*k*Math.min(c.W*.26,c.H*.42)/36; }
  var ang=0;
  c.loop(function(dt){ ang+=dt*3/(n*n)*2; if(foton){ foton.t+=dt; if(foton.t>1.6) foton=null; } dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var cx=c.W*.28, cy=c.H*.45;
    for(var k=1;k<=6;k++){ g.strokeStyle=k===n?tinta:c.col("linea"); g.lineWidth=k===n?2:1.3; g.beginPath(); g.arc(cx,cy,rad(k),0,Math.PI*2); g.stroke(); if(rad(k)<c.H*.45) F.texto(g,"n="+k,cx+rad(k)*.71+3,cy-rad(k)*.71-3,{tam:11,color:t3}); }
    F.circulo(g,cx,cy,7,rojo);
    F.circulo(g,cx+Math.cos(ang)*rad(n),cy+Math.sin(ang)*rad(n),6,boli);
    if(foton){
      var col = foton.l>=380&&foton.l<=750 ? PFSim.colorLambda(foton.l) : (foton.l<380?"#8e5bd6":"#a33");
      var d = foton.emi ? 40+foton.t*160 : 220-foton.t*160;
      var x=cx+d, y=cy-d*.4;
      g.strokeStyle=col; g.lineWidth=2.5; g.beginPath(); for(var q=0;q<=30;q++){ var xx=x+q*2, yy=y-q*.8+Math.sin(q*.9)*5; if(q) g.lineTo(xx,yy); else g.moveTo(xx,yy);} g.stroke();
      F.texto(g,(foton.emi?"emite":"absorbe")+" "+PF.fmt(foton.l,0)+" nm",x+30,y-30,{mano:true,tam:20,color:col==="#a33"?rojo:col});
    }
    // espectro
    var sx=c.W*.58, sw=c.W*.38, sy=c.H*.22, sh=40;
    F.texto(g,"Espectro de emisión (visible)",sx,sy-10,{tam:12,color:t3});
    F.rect(g,sx,sy,sw,sh,"#111");
    lineas.forEach(function(l){ if(l>=380&&l<=750){ var X=sx+(l-380)/370*sw; F.rect(g,X-1.5,sy,3,sh,PFSim.colorLambda(l)); } });
    F.texto(g,"380 nm",sx,sy+sh+14,{tam:11,color:t3}); F.texto(g,"750 nm",sx+sw,sy+sh+14,{tam:11,color:t3,alin:"right"});
    var inv = lineas.filter(function(l){return l<380||l>750;});
    if(inv.length) F.texto(g,"También emitió (invisible): "+inv.map(function(l){return l+" nm";}).join(", "),sx,sy+sh+34,{tam:11,color:t3});
    // niveles de energía
    var lx=sx, ly=sy+sh+60, lh=c.H-ly-14;
    for(k=1;k<=6;k++){ var Y=ly+lh*(1-(E(k)+13.6)/13.6*.95); F.linea(g,[[lx,Y],[lx+sw*.5,Y]],k===n?rojo:tinta,k===n?2.5:1.2); if(k<=3||k===n) F.texto(g,"n="+k+"  "+PF.fmt(E(k),2)+" eV",lx+sw*.52,Y+(k===n&&k>3?-4:4),{tam:11,color:k===n?rojo:t3}); }
    if(c.n===1) c.datos('<span>El electrón solo puede estar en ciertos «escalones». Cuando baja de escalón suelta un paquetito de luz (fotón) de un color exacto.</span>');
    else c.datos('<span>Nivel actual: <b>n = '+n+'</b>, E = <b>'+PF.fmt(E(n),2)+' eV</b></span><span>Prueba bajar a n = 2 desde 3, 4, 5 y 6: son las líneas de Balmer (656, 486, 434 y 410 nm).</span>');
  }
  c.nota("En el modelo de Bohr (1913), Eₙ = −13.6 eV/n². Cada salto entre niveles emite un fotón con E = hf = Eₙᵢ − E_nf. Por eso cada elemento tiene su propio «código de barras» de colores, y así sabemos de qué están hechas las estrellas.");
});

/* ---------- Doble rendija ---------- */
PFSim.def("rendija",{t:"Experimento de la doble rendija", ayuda:"Lanza partículas una por una"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var ritmo=60, obs=false, imp=[], hist=new Array(120).fill(0), lam=1, sep=4;
  c.slider({l:"Partículas por segundo", min:5, max:600, paso:5, v:ritmo, dec:0, on:function(v){ritmo=v;}});
  c.slider({l:"Separación de rendijas", min:2, max:8, paso:.5, v:sep, dec:1, on:function(v){sep=v; limpiar();}});
  var bb=c.botones(); bb.check("Detector en las rendijas (observar)", false, function(v){ obs=v; limpiar(); }); bb.b("Limpiar pantalla", limpiar);
  function limpiar(){ imp=[]; hist.fill(0); }
  function I(y){ // y en [-1,1]
    var a=.6, b=Math.PI*a*y*3, s = b===0?1:Math.sin(b)/b; var env=s*s;
    if(obs) return env;
    var ph=Math.PI*sep*y*1.6; return env*Math.cos(ph)*Math.cos(ph);
  }
  function muestra(){ for(var k=0;k<1000;k++){ var y=Math.random()*2-1; if(Math.random()<I(y)) return y; } return 0; }
  c.loop(function(dt){
    var n=Math.min(50, Math.floor(ritmo*dt + Math.random()));
    for(var i=0;i<n;i++){ var y=muestra(); imp.push([Math.random(), y]); var k=Math.min(119,Math.max(0,Math.floor((y+1)/2*120))); hist[k]++; }
    if(imp.length>6000) imp.splice(0, imp.length-6000);
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var cx=c.W*.3, cy=c.H/2, h=c.H*.85;
    // cañón
    F.rect(g,20,cy-10,40,20,tinta); F.texto(g,"fuente",40,cy+28,{alin:"center",tam:11,color:t3});
    // pared con rendijas
    var gap=6, d=sep*5;
    F.rect(g,cx-4,cy-h/2,8,h/2-d/2-gap/2,tinta); F.rect(g,cx-4,cy-d/2+gap/2,8,d-gap,tinta); F.rect(g,cx-4,cy+d/2+gap/2,8,h/2-d/2-gap/2,tinta);
    if(obs){ F.texto(g,"👁",cx+10,cy-d/2-12,{tam:16}); }
    // pantalla
    var sx=c.W*.62, sw=26;
    F.rect(g,sx,cy-h/2,sw,h,"#0d1420");
    imp.forEach(function(p){ g.fillStyle="rgba(150,230,255,.75)"; g.fillRect(sx+p[0]*sw, cy+p[1]*h/2, 1.6, 1.6); });
    // histograma
    var hx=sx+sw+10, hw=c.W-hx-14, mx=Math.max.apply(null,hist)||1;
    g.fillStyle="rgba(37,70,200,.45)";
    hist.forEach(function(v,k){ var y=cy-h/2+k/120*h; g.fillRect(hx,y,v/mx*hw,h/120+.5); });
    // curva teórica
    var pts=[]; for(var k=0;k<=200;k++){ var y=-1+k/100; pts.push([hx+I(y)*hw, cy+y*h/2]); } F.linea(g,pts,rojo,1.5);
    var tot=imp.length;
    if(c.n===1) c.datos('<span>Lanzamos partículas una por una. '+(obs?"Si las espiamos, se portan como canicas: dos rayas.":"Sin espiarlas, ¡forman franjas como si fueran olas!")+'</span>');
    else c.datos('<span>Impactos: <b>'+tot+'</b></span><span>'+(obs?"Con detector: sin interferencia (dos bandas)":"Sin detector: patrón de interferencia")+'</span>');
  }
  c.nota("Cada partícula llega a un solo punto, pero el patrón que se forma con miles de ellas es de interferencia: cada una «pasa por las dos rendijas» como onda de probabilidad. Si medimos por cuál pasó, el patrón desaparece. Se ha hecho con fotones, electrones e incluso moléculas grandes.");
});

/* ---------- Partícula en una caja ---------- */
PFSim.def("caja",{t:"Partícula en una caja (pozo infinito)", ayuda:"Elige el estado o mezcla dos"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=1, mezcla=false, t=0, verPsi=true;
  c.slider({l:"Número cuántico n", min:1, max:8, paso:1, v:n, dec:0, on:function(v){n=v;}});
  var bb=c.botones(); bb.check("Superposición de n=1 y n=2", false, function(v){mezcla=v;}); bb.check("Mostrar ψ (parte real)", true, function(v){verPsi=v;});
  c.loop(function(dt){ t+=dt; dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var x0=c.W*.1, w=c.W*.55, base=c.H-30, alto=c.H-70;
    F.linea(g,[[x0,30],[x0,base],[x0+w,base],[x0+w,30]],tinta,3);
    // niveles
    var Emax=64, lx=x0+w+30, lw=c.W-lx-20;
    for(var k=1;k<=8;k++){ var Y=base - k*k/Emax*alto; F.linea(g,[[lx,Y],[lx+lw*.5,Y]],(!mezcla&&k===n)||(mezcla&&k<=2)?rojo:t3,(!mezcla&&k===n)?2.5:1.2); F.texto(g,"E"+(k<=9?"₁₂₃₄₅₆₇₈"[k-1]:"")+" = "+k*k+"E₁",lx+lw*.55,Y+4,{tam:11,color:t3}); }
    var w1=.4*2*Math.PI; // ω₁ visual
    var pts=[], dens=[];
    for(var i=0;i<=200;i++){
      var x=i/200, re, im;
      if(!mezcla){ var ph=-n*n*w1*t; var s=Math.sqrt(2)*Math.sin(n*Math.PI*x); re=s*Math.cos(ph); im=s*Math.sin(ph); }
      else { var s1=Math.sin(Math.PI*x), s2=Math.sin(2*Math.PI*x), p1=-w1*t, p2=-4*w1*t; re=(s1*Math.cos(p1)+s2*Math.cos(p2)); im=(s1*Math.sin(p1)+s2*Math.sin(p2)); }
      pts.push([x0+x*w, base-alto*.5 - re*alto*.18]); dens.push([x0+x*w, base - (re*re+im*im)*alto*.2]);
    }
    g.fillStyle="rgba(210,64,46,.15)"; g.beginPath(); g.moveTo(x0,base); dens.forEach(function(p){g.lineTo(p[0],p[1]);}); g.lineTo(x0+w,base); g.fill();
    F.linea(g,dens,rojo,2.2);
    if(verPsi){ F.linea(g,[[x0,base-alto*.5],[x0+w,base-alto*.5]],t3,1,[3,3]); F.linea(g,pts,boli,2); }
    F.texto(g,"|ψ|² (probabilidad)",x0+6,base-8,{tam:12,color:rojo});
    if(verPsi) F.texto(g,"Re ψ",x0+6,base-alto*.5-alto*.2,{tam:12,color:boli});
    if(c.n<=2) c.datos('<span>Una partícula encerrada no puede quedarse quieta ni tener cualquier energía: solo ciertos niveles. La zona roja dice dónde es más probable encontrarla.</span>');
    else c.datosTex('<span>'+(mezcla?"Superposición: la probabilidad «chapotea» de un lado a otro":"Estado estacionario n = "+n+": |ψ|² no cambia con el tiempo")+'</span><span>Nodos: <b>'+(mezcla?"—":(n-1))+'</b></span><span class="ec">\\(\\psi_n(x)=\\sqrt{\\tfrac{2}{L}}\\sin\\tfrac{n\\pi x}{L},\\qquad E_n=\\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}\\)</span>');
  }
  c.nota("La energía mínima (n = 1) no es cero: es la energía de punto cero, consecuencia del principio de incertidumbre. Este modelo sencillo explica, por ejemplo, el color de los puntos cuánticos de algunas pantallas QLED: más pequeños, niveles más separados, luz más azul.");
});

/* ---------- Oscilador armónico cuántico ---------- */
PFSim.def("oscilador",{t:"Oscilador armónico cuántico: crear y destruir cuantos", ayuda:"Usa a† y a para subir o bajar de nivel"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=0, msg="";
  var bb=c.botones();
  bb.b("a† (crear un cuanto)", function(){ if(n<9){ msg="a†|"+n+"⟩ = √"+(n+1)+" |"+(n+1)+"⟩"; n++; } }, true);
  bb.b("a (destruir un cuanto)", function(){ if(n>0){ msg="a|"+n+"⟩ = √"+n+" |"+(n-1)+"⟩"; n--; } else msg="a|0⟩ = 0 : el vacío no se puede vaciar más"; });
  function herm(k,x){ var h0=1, h1=2*x; if(k===0) return h0; for(var i=1;i<k;i++){ var h2=2*x*h1-2*i*h0; h0=h1; h1=h2; } return h1; }
  function fact(k){ var f=1; for(var i=2;i<=k;i++) f*=i; return f; }
  function psi(k,x){ return Math.pow(Math.PI,-.25)/Math.sqrt(Math.pow(2,k)*fact(k))*Math.exp(-x*x/2)*herm(k,x); }
  c.loop(function(){ dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var cx=c.W*.42, base=c.H-24, X=5.2, sx=c.W*.36/X, Emax=10.5, sy=(c.H-50)/Emax;
    var par=[]; for(var i=0;i<=200;i++){ var x=-X+2*X*i/200; par.push([cx+x*sx, base-.5*x*x*sy]); } F.linea(g,par,tinta,2.5);
    for(var k=0;k<=9;k++){ var E=k+.5, xt=Math.sqrt(2*E); F.linea(g,[[cx-xt*sx,base-E*sy],[cx+xt*sx,base-E*sy]],k===n?rojo:c.col("linea"),k===n?2:1); }
    var E0=n+.5, pts=[]; for(i=0;i<=240;i++){ var x2=-X+2*X*i/240; pts.push([cx+x2*sx, base-E0*sy - psi(n,x2)*sy*1.6]); } F.linea(g,pts,boli,2.4);
    F.texto(g,"|"+n+"⟩",cx+Math.sqrt(2*E0)*sx+10,base-E0*sy+5,{tam:18,color:rojo,serif:true});
    // contador de cuantos
    var qx=c.W*.78; F.texto(g,"Cuantos en el modo:",qx,40,{tam:12,color:t3});
    for(k=0;k<n;k++){ F.circulo(g,qx+12+(k%5)*22,64+Math.floor(k/5)*22,8,c.col("n1"),tinta,1.2); }
    if(msg) F.texto(g,msg,qx,c.H*.55,{mano:true,tam:21,color:rojo});
    if(c.n<=3) c.datos('<span>Un resorte cuántico solo puede tener energías en escalones iguales. Cada escalón es un «cuanto»; en la luz, cada cuanto es un fotón.</span><span>Nivel: <b>n = '+n+'</b></span>');
    else c.datosTex('<span>Estado <b>|'+n+'⟩</b>, \\(E_n=\\hbar\\omega(n+\\tfrac12)=\\) <b>'+PF.fmt(n+.5,1)+' ħω</b></span><span class="ec">\\([a,a^\\dagger]=1,\\quad a^\\dagger|n\\rangle=\\sqrt{n+1}\\,|n+1\\rangle,\\quad a|n\\rangle=\\sqrt{n}\\,|n-1\\rangle\\)</span>');
  }
  c.nota("En la teoría cuántica de campos, cada modo de vibración de un campo es un oscilador como este, y cada cuanto de excitación es una partícula. «Crear un fotón» significa literalmente aplicar a† al modo correspondiente del campo electromagnético. Hasta el estado |0⟩ (el vacío) tiene energía ½ħω.");
});

/* ---------- Reacción en cadena ---------- */
PFSim.def("fision",{t:"Reacción en cadena", ayuda:"Dispara un neutrón y ajusta las barras de control"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var nuc=[], neu=[], abs=.35, fis=0, hist=[], tt=0;
  c.slider({l:"Barras de control (absorción)", min:0, max:.9, paso:.01, v:abs, fmt:function(v){return Math.round(v*100)+" %";}, on:function(v){abs=v;}});
  var bb=c.botones(); bb.b("Disparar neutrón", function(){ neu.push({x:0,y:.5,vx:.5,vy:(Math.random()-.5)*.2,vida:3}); }, true); bb.b("Recargar uranio", crear);
  function crear(){ nuc=[]; fis=0; hist=[]; tt=0; for(var i=0;i<260;i++) nuc.push({x:.06+Math.random()*.9, y:.05+Math.random()*.9, ok:true, t:0}); neu=[]; }
  crear();
  c.loop(function(dt){
    tt+=dt;
    neu.forEach(function(n){ n.x+=n.vx*dt; n.y+=n.vy*dt; n.vida-=dt; if(Math.random()<abs*dt*1.2) n.vida=-1; });
    neu.forEach(function(n){ if(n.vida<0) return; for(var i=0;i<nuc.length;i++){ var u=nuc[i]; if(u.ok && Math.abs(u.x-n.x)<.018 && Math.abs(u.y-n.y)<.03){ u.ok=false; u.t=0; n.vida=-1; fis++; var k=Math.random()<.5?2:3; for(var j=0;j<k;j++){ var a=Math.random()*Math.PI*2; neu.push({x:u.x,y:u.y,vx:Math.cos(a)*.35,vy:Math.sin(a)*.35*c.W/c.H,vida:2.5}); } break; } } });
    neu = neu.filter(function(n){ return n.vida>0 && n.x>-0.02 && n.x<1.02 && n.y>-0.02 && n.y<1.02; });
    if(neu.length>400) neu.splice(0, neu.length-400);
    nuc.forEach(function(u){ if(!u.ok) u.t+=dt; });
    if(hist.length===0 || tt-hist[hist.length-1][0]>.1) hist.push([tt,neu.length]); if(hist.length>150) hist.shift();
    dibujar();
  });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), am=c.col("n1");
    var W=c.W*.68, H=c.H;
    // barras de control
    for(var b=1;b<=4;b++){ var x=W*b/5; F.rect(g,x-3,0,6,H*abs*1.05,t3); }
    nuc.forEach(function(u){
      if(u.ok){ F.circulo(g,u.x*W,u.y*H,5,"#3d9a5a"); }
      else if(u.t<.6){ g.globalAlpha=1-u.t/.6; F.circulo(g,u.x*W,u.y*H,6+u.t*30,am); g.globalAlpha=1; F.circulo(g,u.x*W-4,u.y*H,3,rojo); F.circulo(g,u.x*W+4,u.y*H,3,rojo); }
      else { F.circulo(g,u.x*W-3,u.y*H,2.5,t3); F.circulo(g,u.x*W+3,u.y*H,2.5,t3); }
    });
    neu.forEach(function(n){ F.circulo(g,n.x*W,n.y*H,2.6,boli); });
    var gx=W+20, gw=c.W-gx-14, gy=24, gh=H*.45, mx=Math.max(10, Math.max.apply(null,hist.map(function(h){return h[1];})));
    F.texto(g,"neutrones libres",gx,gy-6,{tam:11,color:t3}); F.rect(g,gx,gy,gw,gh,null,c.col("linea"),1);
    F.linea(g,hist.map(function(h,i){return [gx+i/150*gw, gy+gh-h[1]/mx*gh];}),boli,2);
    var k = (1-abs*1.25)*2.5;
    var estado = k>1.05?"supercrítico (crece)":(k<.95?"subcrítico (se apaga)":"crítico (estable)");
    if(c.n===1) c.datos('<span>Cada átomo de uranio que se rompe suelta 2 o 3 neutrones que rompen a otros. ¡Como fichas de dominó que se multiplican! Las barras «se comen» neutrones para controlarlo.</span>');
    else c.datos('<span>Fisiones: <b>'+fis+'</b></span><span>Energía liberada: <b>'+PF.fmt(fis*200,0)+' MeV</b> (≈ 200 MeV por fisión)</span><span>Régimen aproximado: <b>'+estado+'</b></span>');
  }
  c.nota("Un reactor nuclear trabaja justo en el régimen crítico: cada fisión provoca, en promedio, exactamente una fisión nueva. Las barras de control (de boro o cadmio) absorben los neutrones sobrantes. Una sola fisión de U‑235 libera unos 200 MeV, unos 50 millones de veces más que quemar una molécula de metano.");
});

/* ---------- Decaimiento radiactivo ---------- */
PFSim.def("decaimiento",{t:"Decaimiento radiactivo y vida media", ayuda:"Observa cómo la mitad decae en cada vida media"}, function(c){
  var g = c.canvas(.5, 300, 420);
  var ISO = {c14:[5730,"años","Carbono‑14 (datación de fósiles)"], i131:[8.02,"días","Yodo‑131 (medicina nuclear)"], rn222:[3.82,"días","Radón‑222 (gas en algunos sótanos)"], u238:[4.47e9,"años","Uranio‑238 (edad de la Tierra)"]};
  var iso="c14", N0=400, s=[], t=0, Tv=3, hist=[];
  c.select({l:"Isótopo", ops:Object.keys(ISO).map(function(k){return [k,ISO[k][2]];}), v:iso, on:function(v){iso=v; crear();}});
  c.botones().b("Reiniciar", crear, true);
  function crear(){ s=[]; for(var i=0;i<N0;i++) s.push(true); t=0; hist=[[0,N0]]; }
  crear();
  c.loop(function(dt){
    t+=dt; var p=1-Math.pow(.5,dt/Tv), vivos=0;
    for(var i=0;i<N0;i++){ if(s[i] && Math.random()<p) s[i]=false; if(s[i]) vivos++; }
    if(t-hist[hist.length-1][0]>.1 && t<Tv*6) hist.push([t,vivos]);
    dibujar(vivos);
  });
  function dibujar(vivos){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var cols=20, filas=20, cw=Math.min(c.W*.4, c.H-40)/cols;
    for(var i=0;i<N0;i++){ var x=20+(i%cols)*cw+cw/2, y=20+Math.floor(i/cols)*cw+cw/2; F.circulo(g,x,y,cw*.38,s[i]?rojo:c.col("linea")); }
    var gx=c.W*.5, gw=c.W*.46, gy=20, gh=c.H-56;
    F.linea(g,[[gx,gy],[gx,gy+gh],[gx+gw,gy+gh]],tinta,1.5);
    for(var k=1;k<=6;k++){ var X=gx+k/6*gw; F.linea(g,[[X,gy+gh],[X,gy+gh+5]],tinta,1); F.texto(g,k+"T½",X,gy+gh+18,{tam:11,color:t3,alin:"center"}); }
    var teo=[]; for(var q=0;q<=120;q++){ var tt=q/120*6*Tv; teo.push([gx+tt/(6*Tv)*gw, gy+gh-Math.pow(.5,tt/Tv)*gh]); } F.linea(g,teo,t3,1.5,[5,4]);
    F.linea(g,hist.map(function(h){return [gx+h[0]/(6*Tv)*gw, gy+gh-h[1]/N0*gh];}),boli,2.4);
    [.5,.25,.125].forEach(function(f){ var Y=gy+gh-f*gh; F.linea(g,[[gx,Y],[gx+gw,Y]],c.col("linea"),1); F.texto(g,(f*100)+" %",gx-4,Y+4,{tam:11,color:t3,alin:"right"}); });
    var vm=ISO[iso], tr=t/Tv*vm[0];
    if(c.n===1) c.datos('<span>Los átomos inestables se transforman al azar. No sabemos cuál será el siguiente, ¡pero sí que cada cierto tiempo se transforma la mitad!</span>');
    else c.datos('<span>Quedan: <b>'+vivos+'</b> de '+N0+'</span><span>Tiempo real equivalente: <b>'+PF.fmt(tr,tr<100?1:0)+' '+vm[1]+'</b></span><span>Vida media: <b>'+PF.fmt(vm[0],2)+' '+vm[1]+'</b></span>');
  }
  c.nota("N(t) = N₀·(1/2)^(t/T½). Cada núcleo tiene la misma probabilidad de decaer en cada instante, sin importar cuánto tiempo lleva existiendo. Con el carbono‑14 se fechan restos de hasta unos 50 000 años; con el uranio‑238, rocas de miles de millones de años.");
});

/* ---------- Cuerdas vibrantes ---------- */
PFSim.def("cuerda",{t:"Modos de vibración de una cuerda", ayuda:"Cambia el modo: cada uno es una «nota» distinta"}, function(c){
  var g = c.canvas(.45, 260, 400);
  var n=1, tipo="abierta", mezcla=false, t=0;
  c.slider({l:"Modo de vibración n", min:1, max:8, paso:1, v:n, dec:0, on:function(v){n=v;}});
  c.select({l:"Cuerda", ops:[["abierta","Con extremos fijos (guitarra)"],["cerrada","Cerrada (lazo)"]], v:tipo, on:function(v){tipo=v;}});
  c.botones().check("Mezclar varios modos", false, function(v){mezcla=v;});
  c.loop(function(dt){ t+=dt; dibujar(); });
  function dibujar(){
    c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var w0=2.2;
    if(tipo==="abierta"){
      var x0=40, w=c.W-80, y0=c.H/2, A=c.H*.3;
      F.circulo(g,x0,y0,5,tinta); F.circulo(g,x0+w,y0,5,tinta);
      var pts=[], env=[];
      for(var i=0;i<=300;i++){ var x=i/300, y;
        if(mezcla) y = .6*Math.sin(Math.PI*x)*Math.cos(w0*t) + .3*Math.sin(2*Math.PI*x)*Math.cos(2*w0*t) + .2*Math.sin(3*Math.PI*x)*Math.cos(3*w0*t);
        else y = Math.sin(n*Math.PI*x)*Math.cos(n*w0*t/Math.sqrt(n));
        pts.push([x0+x*w, y0-y*A/ (mezcla?1.1:1)]); env.push([x0+x*w, y0-Math.abs(Math.sin(n*Math.PI*x))*A]);
      }
      if(!mezcla){ F.linea(g,env,c.col("linea"),1,[3,3]); F.linea(g,env.map(function(p){return [p[0],2*y0-p[1]];}),c.col("linea"),1,[3,3]); for(var k=1;k<n;k++) F.circulo(g,x0+k/n*w,y0,4,rojo); }
      F.linea(g,pts,boli,3);
    } else {
      var cx=c.W/2, cy=c.H/2, R=Math.min(c.W,c.H)*.3, pts2=[];
      for(var j=0;j<=360;j++){ var th=j/360*Math.PI*2, r;
        if(mezcla) r = R*(1 + .12*Math.cos(2*th)*Math.cos(w0*t) + .08*Math.cos(3*th+1)*Math.cos(1.5*w0*t) + .06*Math.sin(5*th)*Math.cos(2.2*w0*t));
        else r = R*(1 + .16*Math.cos(n*th)*Math.cos(w0*t));
        pts2.push([cx+r*Math.cos(th), cy+r*Math.sin(th)]);
      }
      F.linea(g,pts2,boli,3);
    }
    if(c.n===1) c.datos('<span>Una cuerda de guitarra puede vibrar de muchas formas. Cada forma suena como una nota distinta. ¡La teoría de cuerdas imagina que cada partícula es una «nota» de una cuerdita diminuta!</span>');
    else if(c.n<=3) c.datos('<span>Modo <b>'+n+'</b>: frecuencia = <b>'+n+'</b> × la fundamental</span><span>Nodos (puntos quietos): <b>'+(tipo==="abierta"?n-1:2*n)+'</b></span>');
    else c.datosTex('<span class="ec">Cuerda fija: \\(y_n(x,t)=A\\sin\\tfrac{n\\pi x}{L}\\cos\\omega_n t,\\;\\; f_n=\\tfrac{n}{2L}\\sqrt{T/\\mu}\\).&nbsp; En teoría de cuerdas, el espectro de masas sale de los modos: \\(\\alpha\' M^2 = N + \\tilde N - 2\\) (cuerda cerrada bosónica, \\(N=\\tilde N\\)).</span>');
  }
  c.nota("En la teoría de cuerdas, las partículas no serían puntos sino cuerdas de tamaño cercano a la longitud de Planck (~10⁻³⁵ m). Un modo de vibración se vería como un electrón, otro como un fotón y otro como un gravitón. Todavía no hay evidencia experimental directa.");
});

/* ---------- Agujeros negros: calculadora ---------- */
PFSim.def("agujero",{t:"Calculadora de agujeros negros", ayuda:"Elige una masa y compara"}, function(c){
  var g = c.canvas(.45, 260, 380);
  var M=MSOL;
  var PRE=[["7.35e22","La Luna"],["5.97e24","La Tierra"],["1.989e30","El Sol"],["1.99e31","10 soles (agujero estelar)"],["8.55e36","Sagitario A* (centro de la Vía Láctea)"],["1.29e40","M87* (primera foto, 2019)"],["1e12","Una montaña (agujero primordial)"]];
  var sM=c.slider({l:"Masa", min:10, max:41, paso:.01, v:M, log:true, fmt:function(v){ return PF.fmt(v,2)+" kg ("+PF.fmt(v/MSOL,3)+" M☉)"; }, on:function(v){ M=v; dibujar(); }});
  sM.set(M);
  c.select({l:"Ejemplos", ops:PRE, v:"1.989e30", on:function(v){ M=+v; sM.set(M); dibujar(); }});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  var REF=[[1e-2,"una canica (1 cm)"],[1,"una persona"],[1e3,"un estadio"],[3e4,"una ciudad"],[6.4e6,"la Tierra"],[7e8,"el Sol"],[1.5e11,"la órbita de la Tierra"],[4.5e12,"la órbita de Neptuno"],[1e16,"un año luz"]];
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var rs=2*Gn*M/(Cc*Cc), T=HB*Cc*Cc*Cc/(8*Math.PI*Gn*M*KB), A=4*Math.PI*rs*rs, S=A*Cc*Cc*Cc/(4*Gn*HB), tev=5120*Math.PI*Gn*Gn*M*M*M/(HB*Math.pow(Cc,4))/3.156e7;
    // comparación: referencia más cercana mayor
    var ref=REF[REF.length-1]; for(var i=0;i<REF.length;i++){ if(REF[i][0]>=rs){ ref=REF[i]; break; } }
    if(rs < 1e-3) ref=[1e-2,"una canica (1 cm)"];
    var cx=c.W*.3, cy=c.H/2, Rmax=Math.min(c.W*.25,c.H*.42), ratio=Math.min(1, rs/ref[0]), r=Math.max(2,Rmax*ratio);
    g.strokeStyle=t3; g.setLineDash([5,4]); g.lineWidth=1.5; g.beginPath(); g.arc(cx,cy,Rmax,0,Math.PI*2); g.stroke(); g.setLineDash([]);
    F.texto(g,"tamaño de "+ref[1],cx,cy+Rmax+18,{alin:"center",tam:12,color:t3});
    var grd=g.createRadialGradient(cx,cy,r*.9,cx,cy,r*1.6); grd.addColorStop(0,"rgba(255,170,60,.0)"); grd.addColorStop(.3,"rgba(255,170,60,.55)"); grd.addColorStop(1,"rgba(255,170,60,0)");
    g.fillStyle=grd; g.beginPath(); g.arc(cx,cy,r*1.6,0,Math.PI*2); g.fill();
    F.circulo(g,cx,cy,r,"#000");
    var tx=c.W*.58, lh=24, y=40;
    function fila(a,b){ F.texto(g,a,tx,y,{tam:13,color:t3}); F.texto(g,b,tx,y+16,{tam:15,color:tinta,negr:true}); y+=lh+16; }
    fila("Radio del horizonte de eventos", fmtL(rs));
    if(c.n>=3){ fila("Temperatura de Hawking", PF.fmt(T,3)+" K"); }
    if(c.n>=4){ fila("Entropía de Bekenstein–Hawking", PF.fmt(S,3)+" k_B"); fila("Tiempo para evaporarse", PF.fmt(tev,3)+" años"); }
    if(c.n<=2) c.datos('<span>Si aplastaras '+(M<1e25?"esa masa":"ese objeto")+' hasta que midiera <b>'+fmtL(rs)+'</b> de radio, ni la luz podría escapar: sería un agujero negro.</span>');
    else c.datosTex('<span class="ec">\\(r_s=\\dfrac{2GM}{c^2},\\quad T_H=\\dfrac{\\hbar c^3}{8\\pi G M k_B},\\quad S=\\dfrac{k_B c^3 A}{4G\\hbar},\\quad t_{ev}\\approx\\dfrac{5120\\pi G^2M^3}{\\hbar c^4}\\)</span><span>La edad del universo es ≈ 1.38×10¹⁰ años.</span>');
  }
  function fmtL(m){ if(m<1e-6) return PF.fmt(m,2)+" m"; if(m<1e-3) return PF.fmt(m*1e6,2)+" µm"; if(m<1) return PF.fmt(m*1000,2)+" mm"; if(m<1000) return PF.fmt(m,2)+" m"; if(m<1.5e10) return PF.fmt(m/1000,2)+" km"; if(m<9.46e15*.5) return PF.fmt(m/1.496e11,2)+" UA"; return PF.fmt(m/9.46e15,2)+" años luz"; }
  c.nota("Cuanto más masivo es un agujero negro, más grande y más frío es. Los agujeros negros estelares están mucho más fríos que la radiación cósmica de fondo (2.7 K), así que hoy absorben más de lo que emiten y no se evaporan.");
});

/* ---------- Escalas del universo ---------- */
var ESC=[
 [1.6e-35,"Longitud de Planck","Escala donde se espera que la gravedad cuántica sea importante. Nadie sabe qué hay aquí.","Gravedad cuántica (desconocida)"],
 [1e-18,"Límite de los quarks y electrones","Los experimentos no han encontrado estructura interna por encima de ~10⁻¹⁸ m.","Teoría cuántica de campos"],
 [1.7e-15,"Protón","Tres quarks unidos por gluones. Mide unos 1.7 fm.","Cromodinámica cuántica"],
 [1.5e-14,"Núcleo de uranio","Unos 235 protones y neutrones apretados en 15 fm.","Física nuclear"],
 [1e-10,"Átomo","La nube de electrones es unas 100 000 veces más grande que el núcleo.","Mecánica cuántica"],
 [2e-9,"ADN (ancho de la hélice)","La molécula que guarda las instrucciones de la vida.","Química cuántica"],
 [1e-7,"Virus","Unos 100 nm: más pequeño que la longitud de onda de la luz visible.","Física molecular"],
 [8e-6,"Glóbulo rojo","Unos 8 µm. Ya se ve con un microscopio óptico.","Física de fluidos y biofísica"],
 [1e-3,"Hormiga pequeña","Un milímetro: el cuadrito más pequeño del papel milimétrico.","Mecánica clásica"],
 [8e-2,"Manzana","Unos 8 cm, como la que, según la historia, inspiró a Newton.","Gravedad de Newton"],
 [1.7,"Persona","Nuestra escala: aquí funciona la física de Newton.","Mecánica clásica"],
 [2.25e2,"Pirámide del Sol","Teotihuacan: unos 225 m de lado en su base.","Estática"],
 [8.8e3,"Monte Everest","8.8 km de altura.","Geofísica"],
 [6e5,"Huracán","Unos 600 km de nubes que giran alrededor de un ojo en calma.","Dinámica de fluidos"],
 [1.27e7,"La Tierra","12 742 km de diámetro.","Gravitación de Newton"],
 [1.39e9,"El Sol","Cabrían más de un millón de Tierras dentro.","Física de plasmas y fusión"],
 [3e11,"Órbita de la Tierra","Unos 300 millones de km de lado a lado: dos unidades astronómicas.","Leyes de Kepler"],
 [9e12,"Sistema solar (órbita de Neptuno)","La luz tarda unas 4 horas en llegar a Neptuno.","Mecánica celeste"],
 [2.4e13,"Heliosfera","La burbuja del viento solar. La Voyager 1 salió de ella en 2012, a unos 120 UA.","Física de plasmas"],
 [9.46e15,"Un año luz","Lo que recorre la luz en un año.","Relatividad"],
 [8e16,"Vecindario solar","La estrella más cercana, Próxima Centauri, está a 4.2 años luz.","Mecánica celeste"],
 [2.3e17,"Nebulosa de Orión","Unos 24 años luz de gas brillante donde están naciendo estrellas.","Formación de estrellas"],
 [1.6e18,"Cúmulo globular ω Centauri","Unos 10 millones de estrellas en una esfera de 170 años luz.","Dinámica estelar"],
 [1.3e20,"Gran Nube de Magallanes","Una galaxia satélite de la Vía Láctea, de unos 14 000 años luz. Se ve a simple vista desde el hemisferio sur.","Dinámica galáctica"],
 [9.5e20,"Vía Láctea","Unos 100 000 años luz de diámetro y cientos de miles de millones de estrellas.","Dinámica galáctica y materia oscura"],
 [9.5e22,"Grupo Local","La Vía Láctea, Andrómeda y decenas de galaxias enanas, en unos 10 millones de años luz.","Gravitación y materia oscura"],
 [4.9e24,"Supercúmulo Laniakea","Unos 520 millones de años luz: cien mil galaxias que fluyen hacia un mismo centro.","Cosmología"],
 [8.8e26,"Universo observable","Unos 93 000 millones de años luz de diámetro.","Cosmología y relatividad general"]
];
PFSim.def("escalas",{t:"Del tamaño de Planck al universo", ayuda:"Desliza, toca la regla o pulsa «Viaje» para hacer zoom"}, function(c){
  var g = c.canvas(.5, 320, 470);
  var L=Math.log10(1.7), Lv=L, auto=0, t=0, quieto = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var s=c.slider({l:"Tamaño", min:-35, max:27, paso:.01, v:1.7, log:true, fmt:function(v){ return tam(Math.log10(v)); }, on:function(v){ L=Math.log10(v); parar(); }});
  s.set(1.7);
  var bs=c.botones();
  var bt=bs.b("▶ Viaje automático", function(){ if(auto){ parar(); return; } auto = L>25 ? -1 : 1; if(L<-34) auto=1; bt.textContent="■ Detener"; }, true);
  bs.b("Ir a mi tamaño", function(){ parar(); L=Math.log10(1.7); s.set(1.7); });
  function parar(){ auto=0; bt.textContent="▶ Viaje automático"; }
  var regla={x:0,y:0,w:0}, ultimo="";
  c.puntero(null,{abajo:function(p){ if(Math.abs(p.y-regla.y)<22 && p.x>regla.x-10 && p.x<regla.x+regla.w+10){ parar(); L=Math.max(-35,Math.min(27,-35+(p.x-regla.x)/regla.w*62)); s.set(Math.pow(10,L)); } },
    mover:function(p,abajo){ if(abajo && Math.abs(p.y-regla.y)<40 && regla.w){ L=Math.max(-35,Math.min(27,-35+(p.x-regla.x)/regla.w*62)); s.set(Math.pow(10,L)); } }});
  function hex(cv){ var m=/^#?([0-9a-f]{6})$/i.exec((cv||"").trim()); if(!m) return [128,128,128]; var n=parseInt(m[1],16); return [n>>16&255,n>>8&255,n&255]; }
  function rgba(cv,a){ var k=hex(cv); return "rgba("+k[0]+","+k[1]+","+k[2]+","+a+")"; }
  function mez(a,b,k){ var x=hex(a), y=hex(b); return "#"+[0,1,2].map(function(i){ var v=Math.round(x[i]+(y[i]-x[i])*k); return (v<16?"0":"")+v.toString(16); }).join(""); }
  function esfera(x,y,r,col){ if(r<.6) return; var q=g.createRadialGradient(x-r*.38,y-r*.42,r*.08,x,y,r); q.addColorStop(0,mez(col,"#ffffff",.6)); q.addColorStop(.45,col); q.addColorStop(1,mez(col,"#000000",.5)); g.fillStyle=q; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
  function halo(x,y,r,col,a){ if(r<1) return; var q=g.createRadialGradient(x,y,0,x,y,r); q.addColorStop(0,rgba(col,a)); q.addColorStop(1,rgba(col,0)); g.fillStyle=q; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
  function rnd(i){ var v=Math.sin(i*127.1+311.7)*43758.5453; return v-Math.floor(v); }
  var C={};
  /* ilustraciones: (x, y, r = radio aparente, t = tiempo) */
  var DIB=[
    function(x,y,r){ for(var i=0;i<70;i++){ var a=rnd(i)*6.28, d=Math.sqrt(rnd(i+5))*r, rr=r*(.05+.12*Math.abs(Math.sin(t*3+i*1.7))); g.strokeStyle=rgba(i%3?C.n4:C.boli,.55); g.lineWidth=1; g.beginPath(); g.arc(x+d*Math.cos(a),y+d*Math.sin(a),Math.max(.5,rr),0,7); g.stroke(); } },
    function(x,y,r){ halo(x,y,r,C.boli,.45); esfera(x,y,r*.12,C.boli); },
    function(x,y,r){ halo(x,y,r,C.rojo,.18); g.strokeStyle=rgba(C.rojo,.5); g.lineWidth=1.2; g.beginPath(); g.arc(x,y,r,0,7); g.stroke();
      var Q=[]; for(var k=0;k<3;k++){ var a=k*2.094+t*.6, rr=r*(.45+.08*Math.sin(t*2+k)); Q.push([x+rr*Math.cos(a),y+rr*Math.sin(a)]); }
      for(var k=0;k<3;k++){ var A=Q[k], B=Q[(k+1)%3]; g.strokeStyle=C.n1; g.lineWidth=Math.max(1,r*.025); g.beginPath(); for(var j=0;j<=60;j++){ var u=j/60, o=Math.sin(u*Math.PI*14+t*8)*r*.05*Math.sin(Math.PI*u), dx=B[0]-A[0], dy=B[1]-A[1], l=Math.hypot(dx,dy)||1; var px=A[0]+dx*u-dy/l*o, py=A[1]+dy*u+dx/l*o; if(j) g.lineTo(px,py); else g.moveTo(px,py); } g.stroke(); }
      Q.forEach(function(q,k){ esfera(q[0],q[1],r*.15,[C.rojo,C.verde,C.boli][k]); }); },
    function(x,y,r){ halo(x,y,r*1.3,C.rojo,.12); for(var k=45;k>=0;k--){ var a=k*2.39996, d=r*.8*Math.sqrt((k+.5)/46), j=r*.018; esfera(x+d*Math.cos(a)+Math.sin(t*7+k)*j,y+d*Math.sin(a)+Math.cos(t*6+k*1.3)*j,r*.17,k%2?C.rojo:mez(C["tinta-3"],"#ffffff",.25)); } },
    function(x,y,r){ var q=g.createRadialGradient(x,y,0,x,y,r); q.addColorStop(0,rgba(C.boli,.35)); q.addColorStop(.7,rgba(C.boli,.12)); q.addColorStop(1,rgba(C.boli,0)); g.fillStyle=q; g.beginPath(); g.arc(x,y,r,0,7); g.fill();
      for(var k=0;k<3;k++){ g.save(); g.translate(x,y); g.rotate(k*1.05+t*.15); g.strokeStyle=rgba(C["tinta-3"],.6); g.lineWidth=1; g.beginPath(); g.ellipse(0,0,r*.75,r*.28,0,0,7); g.stroke(); var a=t*(1.5+k*.4); esfera(r*.75*Math.cos(a),r*.28*Math.sin(a),Math.max(1.5,r*.05),C.boli); g.restore(); }
      esfera(x,y,Math.max(1.5,r*.06),C.rojo); },
    function(x,y,r){ var hgt=r*1.8, n=40; for(var j=0;j<n;j++){ var u=j/(n-1), yy=y-hgt/2+u*hgt, ph=u*Math.PI*4+t*1.5, x1=x+Math.sin(ph)*r*.35, x2=x+Math.sin(ph+Math.PI)*r*.35, fr=Math.cos(ph)>0;
        if(j%2===0){ g.strokeStyle=rgba([C.rojo,C.verde,C.n1,C.boli][(j/2)%4],.75); g.lineWidth=Math.max(1,r*.03); g.beginPath(); g.moveTo(x1,yy); g.lineTo(x2,yy); g.stroke(); } }
      [0,Math.PI].forEach(function(desf,k){ g.strokeStyle=k?C.n4:C.boli; g.lineWidth=Math.max(1.5,r*.06); g.beginPath(); for(var j=0;j<=60;j++){ var u=j/60, yy=y-hgt/2+u*hgt, xx=x+Math.sin(u*Math.PI*4+t*1.5+desf)*r*.35; if(j) g.lineTo(xx,yy); else g.moveTo(xx,yy); } g.stroke(); }); },
    function(x,y,r){ g.save(); g.translate(x,y); g.rotate(t*.25); for(var k=0;k<18;k++){ var a=k/18*6.283; g.strokeStyle=C.n5; g.lineWidth=Math.max(1,r*.05); g.beginPath(); g.moveTo(Math.cos(a)*r*.72,Math.sin(a)*r*.72); g.lineTo(Math.cos(a)*r*.98,Math.sin(a)*r*.98); g.stroke(); esfera(Math.cos(a)*r,Math.sin(a)*r,Math.max(1,r*.07),C.n5); } g.restore(); esfera(x,y,r*.72,mez(C.n5,"#ffffff",.25)); },
    function(x,y,r){ g.save(); g.translate(x,y); g.rotate(.4+Math.sin(t*.7)*.2); g.scale(1,.55+.05*Math.sin(t*1.3)); var q=g.createRadialGradient(0,0,r*.1,0,0,r); q.addColorStop(0,mez(C.rojo,"#000000",.35)); q.addColorStop(.45,mez(C.rojo,"#ffffff",.15)); q.addColorStop(.8,C.rojo); q.addColorStop(1,mez(C.rojo,"#000000",.4)); g.fillStyle=q; g.beginPath(); g.arc(0,0,r,0,7); g.fill(); g.restore(); },
    function(x,y,r){ var s2=r/1.0, pasos=Math.sin(t*10); g.strokeStyle=C.tinta; g.lineWidth=Math.max(1,r*.05); for(var k=0;k<3;k++){ for(var sgn=-1;sgn<=1;sgn+=2){ var bx=x+(k-1)*s2*.35, ph=(k%2?1:-1)*sgn*pasos*.2; g.beginPath(); g.moveTo(bx,y); g.lineTo(bx+s2*(.15+ph)*1,y+sgn*s2*.45); g.lineTo(bx+s2*(.25+ph),y+sgn*s2*.7); g.stroke(); } }
      [[-.55,.22],[0,.18],[.48,.26]].forEach(function(p){ g.fillStyle=mez(C.tinta,C.rojo,.35); g.beginPath(); g.ellipse(x+p[0]*s2,y,p[1]*s2*1.3,p[1]*s2,0,0,7); g.fill(); });
      g.beginPath(); g.moveTo(x+.7*s2,y-.1*s2); g.quadraticCurveTo(x+.95*s2,y-.4*s2,x+1.05*s2,y-.3*s2); g.moveTo(x+.7*s2,y+.1*s2); g.quadraticCurveTo(x+.95*s2,y+.4*s2,x+1.05*s2,y+.3*s2); g.stroke(); },
    function(x,y,r){ var col=mez(C.rojo,C.n5,.3), cae=Math.abs(Math.sin(t*1.2))*r*.06; y+=cae; esfera(x-r*.27,y+r*.05,r*.7,col); esfera(x+r*.27,y+r*.05,r*.7,col); g.fillStyle=rgba("#ffffff",.3); g.beginPath(); g.ellipse(x-r*.42,y-r*.22,r*.13,r*.28,-.5,0,7); g.fill();
      g.strokeStyle=mez(C.tinta,C.n1,.4); g.lineWidth=Math.max(1.5,r*.08); g.lineCap="round"; g.beginPath(); g.moveTo(x,y-r*.5); g.quadraticCurveTo(x+r*.05,y-r*.85,x+r*.18,y-r); g.stroke();
      g.save(); g.translate(x+r*.1,y-r*.8); g.rotate(-.6+Math.sin(t*2)*.15); g.fillStyle=C.verde; g.beginPath(); g.ellipse(r*.25,0,r*.28,r*.11,0,0,7); g.fill(); g.restore(); },
    function(x,y,r){ var h2=r*2, col=C.verde, lw=Math.max(1.5,r*.07), sal=Math.sin(t*4)*.5; g.strokeStyle=col; g.fillStyle=col; g.lineWidth=lw; g.lineCap="round";
      g.beginPath(); g.arc(x,y-h2*.38,h2*.09,0,7); g.fill();
      g.beginPath(); g.moveTo(x,y-h2*.28); g.lineTo(x,y+h2*.08); g.moveTo(x,y+h2*.08); g.lineTo(x-h2*.12,y+h2*.45); g.moveTo(x,y+h2*.08); g.lineTo(x+h2*.12,y+h2*.45);
      g.moveTo(x,y-h2*.2); g.lineTo(x-h2*.2,y-h2*.02); g.moveTo(x,y-h2*.2); g.lineTo(x+h2*.18*Math.cos(-1.1+sal),y-h2*.2+h2*.18*Math.sin(-1.1+sal)); g.stroke(); },
    function(x,y,r){ var b=y+r*.5, w=r, h=r*.6, n=5, sy2=b-h*1.25+Math.sin(t*.5)*r*.1; halo(x+r*.75,sy2,r*.4,C.marca,.7); esfera(x+r*.75,sy2,r*.1,mez(C.marca,C.n1,.3));
      for(var k=0;k<n;k++){ var w1=w*(1-k*.17), w2=w*(1-(k+1)*.17+.03), y1=b-h*k/n, y2=b-h*(k+1)/n; g.fillStyle=mez(C.n1,C["tinta-3"],.3+k*.1); g.beginPath(); g.moveTo(x-w1,y1); g.lineTo(x-w2,y2); g.lineTo(x+w2,y2); g.lineTo(x+w1,y1); g.closePath(); g.fill(); g.strokeStyle=rgba(C.tinta,.35); g.lineWidth=1; g.stroke(); }
      g.fillStyle=mez(C.n1,C.tinta,.2); g.fillRect(x-w*.08,b-h-h*.08,w*.16,h*.08);
      g.strokeStyle=rgba(C.tinta,.3); for(var k=0;k<14;k++){ var yy=b-h*k/14, ww=w*(.07-.03*k/14); g.beginPath(); g.moveTo(x-ww,yy); g.lineTo(x+ww,yy); g.stroke(); }
      g.strokeStyle=rgba(C.tinta,.55); g.lineWidth=1.5; g.beginPath(); g.moveTo(x-r*1.4,b); g.lineTo(x+r*1.4,b); g.stroke(); },
    function(x,y,r){ var b=y+r*.75; g.fillStyle=mez(C["tinta-3"],C.tinta,.35); g.beginPath(); g.moveTo(x-r*1.3,b); g.lineTo(x-r*.35,y-r*.35); g.lineTo(x-r*.1,y-r*.15); g.lineTo(x+r*.05,y-r*.75); g.lineTo(x+r*1.3,b); g.closePath(); g.fill();
      g.fillStyle="#f4f7fb"; g.beginPath(); g.moveTo(x+r*.05,y-r*.75); g.lineTo(x-r*.16,y-r*.4); g.lineTo(x-r*.02,y-r*.46); g.lineTo(x+r*.12,y-r*.36); g.lineTo(x+r*.3,y-r*.42); g.closePath(); g.fill();
      for(var k=0;k<3;k++){ var cx2=x-r*1.2+((t*.08*r+k*r*.9)%(r*2.6)), cy2=y-r*(.2+.25*k); halo(cx2,cy2,r*.35,"#ffffff",.7); } },
    function(x,y,r){ g.save(); g.translate(x,y); g.rotate(-t*.35); for(var arm=0;arm<4;arm++){ for(var k=0;k<34;k++){ var u=k/34, rr=r*(.14+.86*u), a=arm*1.571+u*3.4; halo(rr*Math.cos(a),rr*Math.sin(a),r*(.24-.13*u),mez(C["tinta-3"],"#ffffff",.35),.4*(1-u*.6)); } } g.restore();
      halo(x,y,r*.16,C.boli,.25); g.strokeStyle=rgba(C["tinta-3"],.7); g.lineWidth=1.5; g.beginPath(); g.arc(x,y,r*.07,0,7); g.stroke(); },
    function(x,y,r){ halo(x,y,r*1.25,C.boli,.35); esfera(x,y,r,mez(C.boli,"#1f6fd1",.3)); g.save(); g.beginPath(); g.arc(x,y,r,0,7); g.clip(); g.fillStyle=rgba(C.verde,.75);
      for(var k=0;k<7;k++){ var px=x+((rnd(k)*2.4*r+t*r*.12)%(2.6*r))-1.3*r, py=y+(rnd(k+9)-.5)*1.4*r; g.beginPath(); g.ellipse(px,py,r*(.18+.2*rnd(k+3)),r*(.1+.12*rnd(k+4)),rnd(k+2)*3,0,7); g.fill(); }
      g.fillStyle=rgba("#ffffff",.6); g.beginPath(); g.ellipse(x,y-r*.92,r*.5,r*.12,0,0,7); g.fill(); g.restore(); },
    function(x,y,r){ halo(x,y,r*1.8,C.marca,.45); for(var k=0;k<14;k++){ var a=k/14*6.283+t*.05, l=r*(1.1+.25*Math.abs(Math.sin(t*1.7+k*2.1))); g.strokeStyle=rgba(C.n1,.35); g.lineWidth=Math.max(1,r*.04); g.beginPath(); g.moveTo(x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.95); g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); g.stroke(); }
      esfera(x,y,r,mez(C.marca,C.n1,.35)); g.save(); g.beginPath(); g.arc(x,y,r,0,7); g.clip(); for(var k=0;k<30;k++){ var px=x+(rnd(k)-.5)*2*r, py=y+(rnd(k+30)-.5)*2*r; g.fillStyle=rgba(C.n1,.15+.15*Math.sin(t*2+k)); g.beginPath(); g.arc(px,py,r*.12,0,7); g.fill(); } g.restore(); },
    function(x,y,r){ halo(x,y,Math.max(8,r*.22),C.marca,.75); esfera(x,y,Math.max(3,r*.05),mez(C.marca,C.n1,.3));
      [[.39,C.n1,4.15,.03],[.72,C.n5,1.62,.045],[1,C.boli,1,.05]].forEach(function(pl,k){ var rr=r*pl[0]; g.strokeStyle=rgba(C["tinta-3"],.45); g.lineWidth=1; g.setLineDash(k===2?[]:[3,4]); g.beginPath(); g.arc(x,y,rr,0,7); g.stroke(); g.setLineDash([]);
        var an=t*.35*pl[2]+k*2; for(var q=1;q<14;q++){ var aq=an-q*.03; halo(x+rr*Math.cos(aq),y+rr*Math.sin(aq),Math.max(2,r*pl[3]*.6),pl[1],.18*(1-q/14)); } esfera(x+rr*Math.cos(an),y+rr*Math.sin(an),Math.max(2.5,r*pl[3]),pl[1]); }); },
    function(x,y,r){ var orb=[.039,.072,.1,.152,.52,.95,1.92,3.0].map(function(a){ return a/3; }); esfera(x,y,Math.max(2,r*.035),C.marca); halo(x,y,r*.12,C.marca,.6);
      orb.forEach(function(a,k){ var rr=r*Math.pow(a,.55); g.strokeStyle=rgba(C["tinta-3"],.45); g.lineWidth=1; g.beginPath(); g.arc(x,y,rr,0,7); g.stroke(); var an=t*(.9/Math.pow(a*3,1.5))+k; esfera(x+rr*Math.cos(an),y+rr*Math.sin(an),Math.max(1.5,r*(k>3?.03:.018)),[C["tinta-3"],C.n1,C.boli,C.rojo,C.n1,C.marca,C.n3,C.boli][k]); }); },
    function(x,y,r){ g.save(); g.translate(x,y); var q=g.createRadialGradient(0,0,r*.2,0,0,r); q.addColorStop(0,rgba(C.marca,.05)); q.addColorStop(.85,rgba(C.n1,.14)); q.addColorStop(1,rgba(C.n1,0)); g.fillStyle=q; g.beginPath(); g.ellipse(r*.15,0,r*1.1,r*.85,0,0,7); g.fill();
      g.strokeStyle=rgba(C.n1,.6); g.lineWidth=1.5; g.setLineDash([5,5]); g.beginPath(); g.ellipse(r*.15,0,r,r*.8,0,0,7); g.stroke(); g.setLineDash([]);
      for(var k=0;k<18;k++){ var a=k/18*6.283, u=(t*.25+rnd(k))%1; halo(Math.cos(a)*r*.9*u,Math.sin(a)*r*.72*u,Math.max(2,r*.022),C.n1,.75*(1-u)); } g.restore();
      halo(x,y,Math.max(5,r*.05),C.marca,.9); esfera(x,y,Math.max(2,r*.015),C.marca);
      var vx=x+r*1.12*Math.cos(-.55)+r*.1, vy=y+r*.88*Math.sin(-.55); g.fillStyle=C.tinta; g.fillRect(vx-2.5,vy-2.5,5,5); g.strokeStyle=C.tinta; g.lineWidth=1; g.beginPath(); g.moveTo(vx-6,vy+3); g.lineTo(vx+6,vy-3); g.stroke(); if(r>50) F.texto(g,"Voyager 1",vx+8,vy-8,{tam:11,color:C["tinta-2"]}); },
    function(x,y,r){ g.strokeStyle=rgba(C.n1,.6); g.lineWidth=1.5; g.setLineDash([4,5]); g.beginPath(); g.moveTo(x-r,y); g.lineTo(x+r,y); g.stroke(); g.setLineDash([]);
      [[x-r],[x+r]].forEach(function(p){ g.beginPath(); g.moveTo(p[0],y-8); g.lineTo(p[0],y+8); g.stroke(); });
      var u=(t*.25)%1, px=x-r+2*r*u; halo(px,y,Math.max(6,r*.15),C.marca,.9); for(var k=0;k<5;k++){ halo(px-k*r*.05,y,Math.max(3,r*.08),C.marca,.25*(1-k/5)); } },
    function(x,y,r){ g.strokeStyle=rgba(C["tinta-3"],.35); g.lineWidth=1; g.setLineDash([3,5]); g.beginPath(); g.arc(x,y,r,0,7); g.stroke(); g.setLineDash([]);
      halo(x,y,Math.max(7,r*.08),C.marca,.9); esfera(x,y,Math.max(2.5,r*.02),mez(C.marca,C.n1,.3));
      var ES=[[1,-.55,C.n1,"α Centauri"],[1.4,2.3,C.rojo,""],[1.86,1.1,C.rojo,""],[2.03,3.6,C.boli,"Sirio"],[2.5,-2.2,C.n1,""],[2.7,.4,C.rojo,""]];
      ES.forEach(function(e,k){ var px=x+r*e[0]*Math.cos(e[1]), py=y+r*e[0]*Math.sin(e[1])*.85, b=.65+.35*Math.sin(t*2.5+k*1.9); halo(px,py,Math.max(5,r*.06),e[2],.55*b); esfera(px,py,Math.max(2,r*.018),e[2]); if(e[3] && r>40) F.texto(g,e[3],px+9,py-8,{tam:12,color:C["tinta-2"]}); });
      if(r>40){ g.strokeStyle=rgba(C.n1,.6); g.setLineDash([2,4]); g.beginPath(); g.moveTo(x,y); g.lineTo(x+r*Math.cos(-.55),y+r*Math.sin(-.55)*.85); g.stroke(); g.setLineDash([]); } },
    function(x,y,r){ var cols=[C.rojo,C.n4,C.boli,C.n1,C.n5,C.n4]; for(var k=0;k<10;k++){ var a=rnd(k)*6.283+t*.04*(k%2?1:-1), d=r*.5*rnd(k+4); halo(x+d*Math.cos(a),y+d*Math.sin(a)*.8,r*(.3+.4*rnd(k+8)),cols[k%6],.26); }
      g.strokeStyle=rgba(C.rojo,.25); g.lineWidth=Math.max(1,r*.01); for(var k=0;k<6;k++){ g.beginPath(); var a0=rnd(k+30)*6.283; for(var j=0;j<=30;j++){ var u=j/30, rr=r*(.2+.7*u), a=a0+u*1.2+Math.sin(t*.3+k)*.1; var px=x+rr*Math.cos(a), py=y+rr*Math.sin(a)*.75; j?g.lineTo(px,py):g.moveTo(px,py); } g.stroke(); }
      for(var k=0;k<26;k++){ var px=x+(rnd(k+20)-.5)*2*r, py=y+(rnd(k+50)-.5)*1.6*r; halo(px,py,Math.max(2.5,r*.02),mez(C.marca,C.n1,.4),.8*(.6+.4*Math.sin(t*2+k))); }
      [[0,0],[.05,.03],[-.04,.05],[.02,-.05]].forEach(function(p,k){ halo(x+p[0]*r,y+p[1]*r,Math.max(5,r*.06),C.boli,.85*(.75+.25*Math.sin(t*3+k))); esfera(x+p[0]*r,y+p[1]*r,Math.max(1.5,r*.012),C.boli); }); },
    function(x,y,r){ halo(x,y,r*.7,C.marca,.4); for(var k=0;k<300;k++){ var a=rnd(k)*6.283, d=r*Math.pow(rnd(k+300),1.7), tw=.55+.45*Math.sin(t*3+k); g.fillStyle=rgba(k%6?C.n1:C.rojo,.8*tw); g.beginPath(); g.arc(x+d*Math.cos(a),y+d*Math.sin(a),Math.max(.9,r*.009),0,7); g.fill(); } },
    function(x,y,r){ g.save(); g.translate(x,y); g.rotate(-.3+Math.sin(t*.2)*.05); g.scale(1,.55); halo(0,0,r*.55,C.n1,.3); g.fillStyle=rgba(C.n1,.22); g.beginPath(); g.ellipse(0,0,r*.55,r*.13,0,0,7); g.fill();
      for(var k=0;k<240;k++){ var a=rnd(k)*6.283, d=r*Math.sqrt(rnd(k+500))*.95; g.fillStyle=rgba(k%7?C.boli:C.rojo,.45+.3*Math.sin(t*2+k)); g.beginPath(); g.arc(d*Math.cos(a),d*Math.sin(a),Math.max(.9,r*.01),0,7); g.fill(); }
      halo(r*.35,-r*.25,r*.14,C.rojo,.55); g.restore(); },
    function(x,y,r){ halo(x,y,r*.35,"#fff3c4",.8); g.save(); g.translate(x,y); g.scale(1,.62); for(var k=0;k<420;k++){ var arm=k%2, th=(k/420)*4.4, rr=r*.1*Math.exp(.52*th), a=th+arm*Math.PI+t*.08+(rnd(k)-.5)*.45; var px=rr*Math.cos(a)+(rnd(k+3)-.5)*r*.06, py=rr*Math.sin(a)+(rnd(k+7)-.5)*r*.06; g.fillStyle=rgba(k%9===0?"#ffffff":(k%3?C.n4:C.boli),.7); g.fillRect(px,py,1.6,1.6); } g.restore(); },
    function(x,y,r){ function esp(cx,cy,sz,rot,col){ g.save(); g.translate(cx,cy); g.rotate(rot); g.scale(1,.5); halo(0,0,sz*.35,mez(C.marca,"#ffffff",.3),.85); for(var k=0;k<200;k++){ var arm=k%2, th=k/200*4, rr=sz*.12*Math.exp(.5*th), a=th+arm*Math.PI+t*.1+(rnd(k)-.5)*.35; g.fillStyle=rgba(col,.6); g.beginPath(); g.arc(rr*Math.cos(a),rr*Math.sin(a),Math.max(.8,sz*.012),0,7); g.fill(); } g.restore(); }
      g.strokeStyle=rgba(C["tinta-3"],.35); g.lineWidth=1; g.setLineDash([3,5]); g.beginPath(); g.arc(x,y,r,0,7); g.stroke(); g.setLineDash([]);
      esp(x-r*.3,y+r*.12,r*.22,.5,C.boli); esp(x+r*.32,y-r*.14,r*.3,-.7,C.n4);
      for(var k=0;k<22;k++){ var a=rnd(k)*6.283+t*.02, d=r*(.15+.75*rnd(k+2)); halo(x+d*Math.cos(a),y+d*Math.sin(a)*.75,Math.max(2,r*.025),k%3?C["tinta-3"]:C.n1,.55); }
      if(r>60){ F.texto(g,"Vía Láctea",x-r*.3,y+r*.12+r*.2,{alin:"center",tam:11,color:C["tinta-2"]}); F.texto(g,"Andrómeda",x+r*.32,y-r*.14+r*.24,{alin:"center",tam:11,color:C["tinta-2"]}); } },
    function(x,y,r){ halo(x,y,r*.45,C.n4,.2); for(var k=0;k<34;k++){ var a0=rnd(k)*6.283, d0=r*(.55+.45*rnd(k+3)), giro=(k%2?1:-1)*(.8+rnd(k+9)); g.strokeStyle=rgba(C.n4,.28); g.lineWidth=1.1; g.beginPath(); for(var j=0;j<=26;j++){ var u=j/26, d=d0*(1-u*.92), a=a0+u*giro; var px=x+d*Math.cos(a), py=y+d*Math.sin(a)*.8; j?g.lineTo(px,py):g.moveTo(px,py); } g.stroke();
        for(var m=0;m<2;m++){ var u=(t*.08+rnd(k+7)+m*.5)%1, d=d0*(1-u*.92), a=a0+u*giro; halo(x+d*Math.cos(a),y+d*Math.sin(a)*.8,Math.max(2.5,r*.018),k%3?C.boli:C.n1,.9); } }
      esfera(x,y,Math.max(3,r*.03),C.n4); },
    function(x,y,r){ var q=g.createRadialGradient(x,y,r*.8,x,y,r); q.addColorStop(0,rgba(C.n1,0)); q.addColorStop(.9,rgba(C.n1,.25)); q.addColorStop(1,rgba(C.rojo,.0)); g.fillStyle=q; g.beginPath(); g.arc(x,y,r,0,7); g.fill();
      var N=46, P2=[]; for(var k=0;k<N;k++){ var a=rnd(k)*6.283, d=Math.sqrt(rnd(k+40))*r*.9; P2.push([x+d*Math.cos(a),y+d*Math.sin(a)]); }
      g.lineWidth=1; for(var i=0;i<N;i++) for(var j=i+1;j<N;j++){ var dd=Math.hypot(P2[i][0]-P2[j][0],P2[i][1]-P2[j][1]); if(dd<r*.28){ g.strokeStyle=rgba(C.n4,.35*(1-dd/(r*.28))); g.beginPath(); g.moveTo(P2[i][0],P2[i][1]); g.lineTo(P2[j][0],P2[j][1]); g.stroke(); } }
      P2.forEach(function(p,k){ halo(p[0],p[1],Math.max(2,r*.025),k%2?C.n4:C.boli,.9*(.6+.4*Math.sin(t*2+k))); });
      g.strokeStyle=rgba(C.rojo,.5); g.lineWidth=1.5; g.beginPath(); g.arc(x,y,r,0,7); g.stroke(); }
  ];
  c.loop(function(dt){
    t += quieto ? 0 : dt;
    if(auto){ L += auto*dt*(quieto?6:1.7); if(L>=27 || L<=-35){ L=Math.max(-35,Math.min(27,L)); parar(); } s.set(Math.pow(10,L)); }
    Lv += (L-Lv)*Math.min(1, quieto?1:dt*5);
    dibujar();
  });
  c.alNivel(function(){});
   function tam(v){ var e=Math.floor(v+1e-9), m=Math.pow(10,v-e); if(m>=9.95){ m=1; e++; } if(e>=-2 && e<=3){ var x=m*Math.pow(10,e); return (x<1?x.toPrecision(2):x<100?x.toFixed(1):Math.round(x))+" m"; } return m.toFixed(1)+" × 10"+PF.sup(e)+" m"; }
  function dibujar(){
    if(!c.W) return; c.limpiar();
    ["tinta","tinta-2","tinta-3","rojo","boli","verde","marca","n1","n3","n4","n5","papel"].forEach(function(k){ C[k]=c.col(k); });
    var ancho=c.W>=560, sw=ancho?c.W*.58:c.W, sx=sw/2, sy=ancho?c.H/2:c.H*.42, R=Math.min(sw*.36,(ancho?c.H:c.H*.84)*.36);
    var cercaO=ESC.reduce(function(a,o){ return Math.abs(Math.log10(o[0])-Lv)<Math.abs(Math.log10(a[0])-Lv)?o:a; });
    var vis=0;
    // objetos anidados, del más grande al más pequeño
    for(var i=ESC.length-1;i>=0;i--){
      var o=ESC[i], r=R*o[0]/Math.pow(10,Lv);
      if(r<1.2 || r>R*7) continue;
      var a = r<10 ? (r-1.2)/8.8 : (r>R*1.3 ? Math.max(0,1-(r/R-1.3)/2.2) : 1);
      g.save(); g.globalAlpha=Math.max(0,Math.min(1,a)); DIB[i](sx,sy,r); g.restore(); if(a>.08) vis=Math.max(vis,Math.min(r,R*1.5));
      if(r>Math.max(16,R*.3) && r<R*1.15 && (ancho || o!==cercaO)){ g.globalAlpha=Math.min(1,a); F.texto(g,o[1],sx,sy-Math.min(r,R*1.05)-12,{alin:"center",tam:13,color:C.tinta}); g.globalAlpha=1; }
    }
    if(vis<R*.15){ for(var k=0;k<40;k++){ var px=sx+(rnd(k)-.5)*sw*.8, py=sy+(rnd(k+40)-.5)*R*1.6; halo(px,py,6+4*Math.sin(t*4+k),C.n4,.18*(.5+.5*Math.sin(t*3+k*2.3))); }
      var zona = Lv<-18.4 ? ["El gran desierto","Entre 10⁻³⁵ y 10⁻¹⁸ m no conocemos nada: ningún experimento llega ahí."] : Lv<-14 ? ["Dentro del protón","Quarks y gluones unidos por la fuerza fuerte."] : ["Sigue haciendo zoom","El siguiente objeto está a pocos órdenes de magnitud."];
      F.texto(g,zona[0],sx,sy-8,{alin:"center",tam:24,mano:true,color:C["tinta-2"]}); F.texto(g,zona[1],sx,sy+18,{alin:"center",tam:13,color:C["tinta-3"]}); }
    // barra de escala
    var bx=ancho?18:14, by=c.H-(ancho?24:62);
    F.linea(g,[[bx,by],[bx+R,by]],C.tinta,2); F.linea(g,[[bx,by-5],[bx,by+5]],C.tinta,2); F.linea(g,[[bx+R,by-5],[bx+R,by+5]],C.tinta,2);
    F.texto(g,tam(Lv),bx+R+8,by+4,{tam:12,color:C["tinta-2"]});
    // regla logarítmica con todos los objetos
    var rx=ancho?sw+14:18, rw=ancho?c.W-sw-30:c.W-36, ry=ancho?c.H-46:c.H-22;
    regla={x:rx,y:ry,w:rw};
    var gr=g.createLinearGradient(rx,0,rx+rw,0); gr.addColorStop(0,C.n4); gr.addColorStop(.3,C.rojo); gr.addColorStop(.58,C.verde); gr.addColorStop(.8,C.boli); gr.addColorStop(1,C.n4);
    g.strokeStyle=gr; g.lineWidth=4; g.lineCap="round"; g.beginPath(); g.moveTo(rx,ry); g.lineTo(rx+rw,ry); g.stroke();
    for(var e=-30;e<=20;e+=10){ var X=rx+(e+35)/62*rw; F.linea(g,[[X,ry-5],[X,ry+5]],C.tinta,1); if(ancho) F.texto(g,"10"+PF.sup(e),X,ry+19,{alin:"center",tam:10,color:C["tinta-3"]}); }
    ESC.forEach(function(o){ var X=rx+(Math.log10(o[0])+35)/62*rw; g.fillStyle=C["tinta-2"]; g.beginPath(); g.arc(X,ry,2.2,0,7); g.fill(); });
    var Xm=rx+(Lv+35)/62*rw; halo(Xm,ry,14,C.rojo,.45); F.circulo(g,Xm,ry,6.5,C.rojo);
    // ficha del objeto más cercano
    var cerca=ESC.reduce(function(a,o){ return Math.abs(Math.log10(o[0])-Lv)<Math.abs(Math.log10(a[0])-Lv)?o:a; });
    if(ancho){
      F.texto(g,cerca[1],rx,40,{serif:true,tam:20,color:C.tinta});
      var palabras=cerca[2].split(" "), lin="", yy=66;
      g.font='14px "Atkinson Hyperlegible",sans-serif';
      palabras.forEach(function(w){ var prueba=lin+w+" "; if(g.measureText(prueba).width>rw && lin){ F.texto(g,lin,rx,yy,{tam:14,color:C.tinta}); lin=w+" "; yy+=19; } else lin=prueba; });
      F.texto(g,lin,rx,yy,{tam:14,color:C.tinta});
      if(c.n>=2) F.texto(g,"Física dominante: "+cerca[3],rx,yy+28,{tam:13,color:C.boli});
    } else {
      F.texto(g,cerca[1],c.W/2,22,{alin:"center",serif:true,tam:17,color:C.tinta});
    }
    var clave=tam(Lv)+"|"+cerca[1]+"|"+ancho; if(clave===ultimo) return; ultimo=clave;
    c.datos('<span>Lo que ves mide unos <b>'+tam(Lv)+'</b>.</span><span>'+(ancho?'':cerca[2]+' ')+'Hay unos 62 órdenes de magnitud entre la longitud de Planck y el universo observable.</span>');
  }
  c.nota("Cada escala tiene su propia física: cuántica en lo pequeño, Newton en lo cotidiano, relatividad general en lo enorme. Unir la cuántica con la gravedad en un solo marco es uno de los grandes problemas abiertos.");
});

/* ---------- Destino del universo (ecuaciones de Friedmann) ---------- */
PFSim.def("cosmos",{t:"¿Cómo acabará el universo?", ayuda:"Cambia la cantidad de materia y de energía oscura"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var Om=.315, OL=.685, H0=67.4*1.0227e-3; // 1/Gyr
  var sOm=c.slider({l:"Materia Ωₘ", min:0, max:3, paso:.005, v:Om, dec:3, on:function(v){Om=v;dibujar();}});
  var sOL=c.slider({l:"Energía oscura Ω_Λ", min:-.5, max:2, paso:.005, v:OL, dec:3, on:function(v){OL=v;dibujar();}});
  c.select({l:"Escenarios", ops:[["real","Nuestro universo (Planck 2018)"],["crunch","Mucha materia, sin energía oscura"],["plano","Solo materia, plano"],["vacio","Universo casi vacío"]], v:"real", on:function(v){ var m={real:[.315,.685],crunch:[2.5,0],plano:[1,0],vacio:[.05,0]}[v]; Om=m[0]; OL=m[1]; sOm.set(Om); sOL.set(OL); dibujar(); }});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function integra(sig){
    var a=1, ad=H0*Math.sqrt(Math.max(0,Om+OL+(1-Om-OL))), t=0, h=.02*sig, pts=[[0,1]], fin="";
    // a'' = H0² (−Ωm/(2a²) + ΩΛ a)
    for(var i=0;i<6000;i++){
      var acc=H0*H0*(-Om/(2*a*a)+OL*a);
      ad+=acc*h; a+=ad*h; t+=h; // h con signo
      if(a<=.01){ fin = sig>0?"crunch":"bang"; pts.push([t,0]); break; }
      if(a>12){ fin="lejos"; pts.push([t,a]); break; }
      pts.push([t,a]);
      if(Math.abs(t)>60) break;
    }
    return {pts:pts, fin:fin, t:t};
  }
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), verde=c.col("verde");
    var fut=integra(1), pas=integra(-1);
    var edad = pas.fin==="bang" ? -pas.t : null;
    var gx=56, gy=20, gw=c.W-80, gh=c.H-56, tmin=-30, tmax=50, amax=5;
    var X=function(t){ return gx+(t-tmin)/(tmax-tmin)*gw; }, Y=function(a){ return gy+gh-Math.min(a,amax)/amax*gh; };
    F.linea(g,[[gx,gy],[gx,gy+gh],[gx+gw,gy+gh]],tinta,1.5);
    for(var t=-30;t<=50;t+=10){ F.linea(g,[[X(t),gy+gh],[X(t),gy+gh+5]],tinta,1); F.texto(g,(t>0?"+":"")+t,X(t),gy+gh+18,{alin:"center",tam:11,color:t3}); }
    F.texto(g,"miles de millones de años desde hoy",gx+gw,gy+gh-6,{alin:"right",tam:11,color:t3});
    F.texto(g,"tamaño relativo a(t)",gx+4,gy+12,{tam:11,color:t3});
    F.linea(g,[[X(0),gy],[X(0),gy+gh]],t3,1,[4,4]); F.texto(g,"hoy",X(0)+4,gy+28,{mano:true,tam:20,color:rojo});
    F.linea(g,pas.pts.map(function(p){return [X(p[0]),Y(p[1])];}),boli,2.5);
    F.linea(g,fut.pts.filter(function(p){return p[1]<=amax;}).map(function(p){return [X(p[0]),Y(p[1])];}),verde,2.8);
    var Ok=1-Om-OL, destino;
    var accHoy = -Om/2+OL;
    if(fut.fin==="crunch") destino="Gran Colapso (Big Crunch): la expansión se detiene y todo vuelve a juntarse";
    else if(OL>0 && accHoy>0) destino="Expansión acelerada para siempre: el universo se enfría y se vacía (Gran Congelamiento)";
    else destino="Expansión eterna pero cada vez más lenta";
    var geo = Math.abs(Ok)<.01?"plano":(Ok>0?"abierto (curvatura negativa)":"cerrado (curvatura positiva)");
    if(c.n===1) c.datos('<span>El universo se está estirando como un globo que se infla. Según cuánta «cosa» tenga, podría seguir creciendo para siempre o volver a encogerse.</span><span>Destino: <b>'+(fut.fin==="crunch"?"se vuelve a encoger":"crece para siempre")+'</b></span>');
    else c.datos('<span>Destino: <b>'+destino+'</b></span><span>Edad: <b>'+(edad?PF.fmt(edad,1)+" mil millones de años":"sin Big Bang en este modelo")+'</b></span>'+(c.n>=3?'<span>Geometría: <b>'+geo+'</b> (Ω_k = '+PF.fmt(Ok,3)+')</span><span>Expansión hoy: <b>'+(accHoy>0?"acelerada":"desacelerada")+'</b> (q₀ = '+PF.fmt(-accHoy,2)+')</span>':''));
  }
  c.nota("Se resuelve la ecuación de Friedmann ä/a = −(4πG/3)ρ + Λc²/3 con H₀ = 67.4 km/s/Mpc. Con los valores medidos por el satélite Planck sale una edad de unos 13.8 mil millones de años y expansión acelerada. Algunos datos recientes sugieren que la energía oscura podría cambiar con el tiempo: es un tema abierto.");
});

/* ---------- Calendario cósmico ---------- */
var EVENTOS_CAL=[
 [13.8e9,"Big Bang","Comienza la expansión del espacio; todo está caliente y denso."],
 [13.8e9-380e3,"El universo se vuelve transparente","Se forman los primeros átomos y se libera la luz que hoy vemos como radiación cósmica de fondo."],
 [13.6e9,"Primeras estrellas","Las primeras estrellas fabrican en su interior los primeros elementos pesados."],
 [13.0e9,"Se forma la Vía Láctea (sus partes más antiguas)","Nuestra galaxia empieza a ensamblarse a partir de galaxias más pequeñas."],
 [4.6e9,"Nace el Sistema Solar","Una nube de gas, enriquecida por estrellas que explotaron antes, colapsa y forma el Sol y los planetas."],
 [3.8e9,"Primera vida en la Tierra","Microbios sencillos en los océanos (la fecha exacta todavía se investiga)."],
 [2.4e9,"Gran Oxidación","Las cianobacterias llenan la atmósfera de oxígeno."],
 [538e6,"Explosión cámbrica","Aparecen de golpe muchos grupos de animales complejos."],
 [230e6,"Primeros dinosaurios",""],
 [66e6,"Extinción de los dinosaurios","El impacto de un asteroide en Chicxulub, ¡en Yucatán, México!"],
 [300e3,"Aparece el Homo sapiens","Nuestra especie, en África."],
 [12e3,"Inicia la agricultura",""],
 [339,"Newton publica los Principia (1687)","Nace la física moderna."],
 [0,"Hoy","Toda la historia escrita de la humanidad cabe en los últimos segundos del año."]
];
PFSim.def("calendario",{t:"Calendario cósmico", ayuda:"Toda la historia del universo comprimida en un año"}, function(c){
  var g = c.canvas(.32, 220, 300);
  var sel=4, zoom=false;
  var opts=EVENTOS_CAL.map(function(e,i){ return [i, e[1]]; });
  var sS=c.select({l:"Evento", ops:opts, v:sel, on:function(v){ sel=+v; dibujar(); }});
  c.botones().check("Acercar al 31 de diciembre", false, function(v){ zoom=v; dibujar(); });
  c.puntero(c.cv,{abajo:function(p){ var best=0, bd=1e9; EVENTOS_CAL.forEach(function(e,i){ var X=xDe(e[0]); if(X==null) return; if(Math.abs(X-p.x)<bd){bd=Math.abs(X-p.x);best=i;} }); if(bd<30){ sel=best; sS.set(sel); dibujar(); } }});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  var T=13.8e9;
  function frac(ago){ return 1-ago/T; }
  function xDe(ago){ var f=frac(ago), x0=30, w=c.W-60; if(!zoom) return x0+f*w; var f0=1-1/365.25; if(f<f0) return null; return x0+(f-f0)/(1-f0)*w; }
  function fecha(ago){
    var dias=frac(ago)*365.25, meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"], dm=[31,28,31,30,31,30,31,31,30,31,30,31];
    var d=Math.floor(dias), seg=(dias-d)*86400, m=0; while(m<11 && d>=dm[m]){ d-=dm[m]; m++; }
    var hh=Math.floor(seg/3600), mm=Math.floor(seg%3600/60), ss=Math.floor(seg%60);
    return (d+1)+" de "+meses[m]+", "+String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");
  }
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var y=c.H*.42, x0=30, w=c.W-60;
    F.linea(g,[[x0,y],[x0+w,y]],tinta,2);
    if(!zoom){ var ms=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]; ms.forEach(function(m,i){ var X=x0+i/12*w; F.linea(g,[[X,y-6],[X,y+6]],tinta,1); F.texto(g,m,X+w/24,y+20,{alin:"center",tam:11,color:t3}); }); }
    else { for(var h=0;h<=24;h+=3){ var X2=x0+h/24*w; F.linea(g,[[X2,y-6],[X2,y+6]],tinta,1); F.texto(g,h+":00",X2,y+20,{alin:"center",tam:11,color:t3}); } F.texto(g,"31 de diciembre",x0,y-30,{tam:12,color:t3}); }
    EVENTOS_CAL.forEach(function(e,i){ var X=xDe(e[0]); if(X==null) return; F.circulo(g,X,y,i===sel?7:4,i===sel?rojo:boli); });
    var e=EVENTOS_CAL[sel], Xs=xDe(e[0]);
    if(Xs!=null){ F.linea(g,[[Xs,y-10],[Xs,y-40]],rojo,1.5); F.texto(g,e[1],Math.min(c.W-20,Math.max(20,Xs)),y-46,{alin:Xs<c.W*.25?"left":(Xs>c.W*.75?"right":"center"),mano:true,tam:22,color:rojo}); }
    else F.texto(g,"(Desactiva el acercamiento para ver este evento)",c.W/2,y-46,{alin:"center",tam:13,color:t3});
    var real = e[0]>=1e9 ? PF.fmt(e[0]/1e9,1)+" mil millones de años" : (e[0]>=1e6 ? PF.fmt(e[0]/1e6,0)+" millones de años" : (e[0]>=1e3? PF.fmt(e[0]/1e3,0)+" mil años": (e[0]>0? e[0]+" años":"ahora")));
    c.datos('<span>En el calendario: <b>'+fecha(e[0])+'</b></span><span>Hace: <b>'+real+'</b></span>'+(e[2]?'<span class="ec">'+e[2]+'</span>':''));
  }
  c.nota("Idea popularizada por Carl Sagan: si toda la historia del universo durara un año, cada día equivaldría a unos 38 millones de años y cada segundo a unos 437 años. Los humanos aparecemos en los últimos minutos del 31 de diciembre.");
});

/* ---------- Diagrama de Penrose ---------- */
PFSim.def("penrose",{t:"Diagramas de Penrose–Carter", ayuda:"Pasa el cursor o toca cada región; haz clic para lanzar rayos de luz"}, function(c){
  var g = c.canvas(.62, 320, 520);
  var tipo="mink", rayos=[], hover=null;
  c.select({l:"Espacio-tiempo", ops:[["mink","Minkowski (espacio vacío)"],["schw","Agujero negro de Schwarzschild"]], v:tipo, on:function(v){ tipo=v; rayos=[]; hover=null; dibujar(); }});
  c.botones().b("Borrar rayos", function(){ rayos=[]; dibujar(); });
  var INFO = {
    mink:{
      "i+":["i⁺ · futuro temporal","Adonde llega todo objeto con masa después de un tiempo infinito."],
      "i-":["i⁻ · pasado temporal","De donde vienen todos los objetos con masa."],
      "i0":["i⁰ · infinito espacial","Los puntos infinitamente lejanos «ahora»."],
      "J+":["ℐ⁺ · infinito nulo futuro","Adonde escapan los rayos de luz."],
      "J-":["ℐ⁻ · infinito nulo pasado","De donde llega la luz desde el infinito."],
      "int":["Todo el espacio-tiempo","Un universo infinito comprimido en un triángulo: los rayos de luz siempre viajan a 45°."]
    },
    schw:{
      "I":["Región I · nuestro universo","Afuera del agujero negro. Desde aquí se puede escapar al infinito ℐ⁺."],
      "II":["Región II · interior del agujero negro","Una vez dentro, todo camino hacia el futuro termina en la singularidad r = 0. «Adentro» se vuelve una dirección del tiempo."],
      "III":["Región III · otro universo","En la solución matemática completa (eterna) aparece un segundo exterior, inalcanzable desde el nuestro."],
      "IV":["Región IV · agujero blanco","La reversión temporal del agujero negro: nada puede entrar. No se cree que exista en la naturaleza."],
      "sing":["Singularidad r = 0","Las ecuaciones de Einstein dejan de funcionar: se espera que la gravedad cuántica diga qué pasa."],
      "hor":["Horizonte de eventos r = 2GM/c²","Una superficie de luz: cruzarla es fácil, regresar es imposible."]
    }
  };
  function geo(){ var s=Math.min(tipo==="schw"?c.W*.17:c.W*.4,c.H*.4); return {cx:tipo==="schw"?c.W*.38:c.W*.3, cy:c.H/2, s:s}; }
  function region(p){
    var G=geo(), x=(p.x-G.cx)/G.s, y=(G.cy-p.y)/G.s;
    if(tipo==="mink"){
      // triángulo: vértices (0,1) i+, (0,-1) i-, (1,0) i0 ; región x>=0
      if(Math.hypot(x,y-1)<.09) return "i+"; if(Math.hypot(x,y+1)<.09) return "i-"; if(Math.hypot(x-1,y)<.09) return "i0";
      if(x>=0 && Math.abs(y)+x<=1){ if(Math.abs(x+y-1)<.06 && y>0) return "J+"; if(Math.abs(x-y-1)<.06 && y<0) return "J-"; return "int"; }
      return null;
    }
    // Schwarzschild: diamante con singularidades arriba y abajo (y=±1, |x|<1)
    if(Math.abs(y-1)<.05 && Math.abs(x)<1) return "sing"; if(Math.abs(y+1)<.05 && Math.abs(x)<1) return "sing";
    if((Math.abs(x-y)<.04 || Math.abs(x+y)<.04) && Math.abs(x)<1) return "hor";
    if(Math.abs(x)>2||Math.abs(y)>1) return null;
    if(x>Math.abs(y)){ if(Math.abs(y)+(x-1)<=1) return "I"; return null; }
    if(-x>Math.abs(y)){ if(Math.abs(y)+(-x-1)<=1) return "III"; return null; }
    if(y>Math.abs(x)) return "II"; if(-y>Math.abs(x)) return "IV";
    return null;
  }
  c.puntero(c.cv,{
    mover:function(p){ var r=region(p); if(r!==hover){ hover=r; dibujar(); } },
    abajo:function(p){ var r=region(p); hover=r; if(r){ var G=geo(); rayos.push([(p.x-G.cx)/G.s,(G.cy-p.y)/G.s]); } dibujar(); }
  });
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function P(x,y){ var G=geo(); return [G.cx+x*G.s, G.cy-y*G.s]; }
  function poli(pts,fill,stroke,w,dash){ g.beginPath(); pts.forEach(function(q,i){ var a=P(q[0],q[1]); if(i) g.lineTo(a[0],a[1]); else g.moveTo(a[0],a[1]); }); g.closePath(); if(fill){ g.fillStyle=fill; g.fill(); } if(stroke){ g.strokeStyle=stroke; g.lineWidth=w||2; if(dash) g.setLineDash(dash); g.stroke(); g.setLineDash([]); } }
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3"), am=c.col("n1");
    var resal="rgba(37,70,200,.14)";
    if(tipo==="mink"){
      poli([[0,1],[1,0],[0,-1]], hover==="int"?resal:"rgba(46,140,112,.08)", tinta, 2.2);
      F.linea(g,[P(0,1),P(0,-1)],t3,1.2,[4,4]);
      // líneas de r constante y t constante aproximadas
      for(var k=1;k<6;k++){ var pts=[]; for(var j=-40;j<=40;j++){ var tt=j/4, r=k*.6; var u=Math.atan(tt+r), v=Math.atan(tt-r); var T=(u+v)/Math.PI, R=(u-v)/Math.PI; pts.push(P(R,T)); } F.linea(g,pts,c.col("linea"),1); }
      for(k=-3;k<=3;k++){ var pts2=[]; for(j=0;j<=60;j++){ var r2=j/4, t2=k*.8; var u2=Math.atan(t2+r2), v2=Math.atan(t2-r2); pts2.push(P((u2-v2)/Math.PI,(u2+v2)/Math.PI)); } F.linea(g,pts2,c.col("linea"),1); }
      etiq("i⁺",0,1.07,"i+"); etiq("i⁻",0,-1.12,"i-"); etiq("i⁰",1.08,0,"i0"); etiq("ℐ⁺",.56,.56,"J+"); etiq("ℐ⁻",.56,-.62,"J-");
      F.texto(g,"r = 0",P(0,0)[0]-8,P(0,0)[1],{alin:"right",tam:12,color:t3});
    } else {
      var col=function(r){ return hover===r?resal:"rgba(46,140,112,.06)"; };
      poli([[0,0],[1,1],[2,0],[1,-1]], col("I"), tinta, 2);
      poli([[0,0],[-1,1],[-2,0],[-1,-1]], col("III"), tinta, 2);
      poli([[0,0],[1,1],[-1,1]], col("II"), tinta, 2);
      poli([[0,0],[1,-1],[-1,-1]], col("IV"), tinta, 2);
      // singularidades zigzag
      [1,-1].forEach(function(yy){ var pts=[]; for(var i=0;i<=20;i++){ pts.push(P(-1+i/10, yy + (i%2?.03:-.03))); } F.linea(g,pts,hover==="sing"?rojo:tinta,2.5); });
      F.linea(g,[P(-1,-1),P(1,1)],hover==="hor"?rojo:am,2.5); F.linea(g,[P(-1,1),P(1,-1)],hover==="hor"?rojo:am,2.5);
      etiq("I",1,0,"I"); etiq("II",0,.55,"II"); etiq("III",-1,0,"III"); etiq("IV",0,-.55,"IV");
      F.texto(g,"r = 0 (singularidad)",P(0,1)[0],P(0,1)[1]-12,{alin:"center",tam:12,color:tinta});
      F.texto(g,"ℐ⁺",P(1.5,.5)[0]+8,P(1.5,.5)[1]-4,{tam:15,color:t3}); F.texto(g,"ℐ⁻",P(1.5,-.5)[0]+8,P(1.5,-.5)[1]+12,{tam:15,color:t3});
    }
    // rayos de luz desde los clics (45°)
    rayos.forEach(function(r){
      var x=r[0], y=r[1];
      [1,-1].forEach(function(dx){
        var pts=[[x,y]], xx=x, yy=y;
        for(var i=0;i<600;i++){ xx+=dx*.005; yy+=.005; var p=P(xx,yy); if(!region({x:p[0],y:p[1]})) break; if(tipo==="schw" && yy>=1) break; pts.push([xx,yy]); }
        F.linea(g,pts.map(function(q){return P(q[0],q[1]);}),am,2);
      });
      F.circulo(g,P(x,y)[0],P(x,y)[1],4,rojo);
    });
    var inf = hover ? INFO[tipo][hover] : null;
    var tx=c.W*.72, tw=c.W*.26;
    if(tipo==="schw"){ tx=c.W*.74; tw=c.W*.24; }
    if(inf){ F.texto(g,inf[0],tx,40,{serif:true,tam:15,color:tinta}); envolver(inf[1],tx,64,tw,tinta); }
    else { F.texto(g,"Explora",tx,40,{serif:true,tam:15,color:tinta}); envolver("Pasa el cursor o toca una región del diagrama. Haz clic para lanzar rayos de luz (siempre a 45°).",tx,64,tw,t3); }
    c.datos(c.n<=3?'<span>Un diagrama de Penrose comprime un espacio-tiempo infinito en una figura finita, conservando los ángulos de la luz.</span>':'<span>Transformación conforme: \\(u=\\arctan(t+r),\\ v=\\arctan(t-r)\\); los conos de luz se mantienen a 45°.</span>');
    if(c.n>=4) PF.tex(c.datosEl);
  }
  function etiq(s,x,y,id){ var p=P(x,y); F.texto(g,s,p[0],p[1]+5,{alin:"center",tam:17,color:hover===id?c.col("rojo"):c.col("tinta"),serif:true}); }
  function envolver(t,x,y,w,col){ var pal=t.split(" "), lin=""; g.font='13px "Atkinson",sans-serif'; pal.forEach(function(p){ var pr=lin+p+" "; if(g.measureText(pr).width>w && lin){ F.texto(g,lin,x,y,{tam:13,color:col}); y+=18; lin=p+" "; } else lin=pr; }); F.texto(g,lin,x,y,{tam:13,color:col}); }
  c.nota("En el agujero negro, cualquier rayo de luz lanzado en la región II termina en la singularidad: no hay forma de llegar a ℐ⁺. Eso es, precisamente, estar dentro de un agujero negro.");
});

/* ---------- Modelo Estándar interactivo (HTML) ---------- */
var PART=[
 {s:"u",n:"up (arriba)",t:"quark",gen:1,q:"+2/3",sp:"1/2",m:"2.16 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"Junto con el down forma protones (uud) y neutrones (udd)."},
 {s:"c",n:"charm (encanto)",t:"quark",gen:2,q:"+2/3",sp:"1/2",m:"1.27 GeV",a:1974,f:["fuerte","em","debil","higgs"],d:"Descubierto en la «revolución de noviembre» de 1974 (partícula J/ψ)."},
 {s:"t",n:"top (cima)",t:"quark",gen:3,q:"+2/3",sp:"1/2",m:"172.6 GeV",a:1995,f:["fuerte","em","debil","higgs"],d:"La partícula elemental más pesada conocida: pesa casi como un átomo de oro. Vive tan poco que no forma hadrones."},
 {s:"d",n:"down (abajo)",t:"quark",gen:1,q:"−1/3",sp:"1/2",m:"4.70 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"Un neutrón libre decae cuando un quark d se convierte en u (decaimiento beta)."},
 {s:"s",n:"strange (extraño)",t:"quark",gen:2,q:"−1/3",sp:"1/2",m:"93.5 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"Presente en los kaones, descubiertos en rayos cósmicos en 1947."},
 {s:"b",n:"bottom (fondo)",t:"quark",gen:3,q:"−1/3",sp:"1/2",m:"4.18 GeV",a:1977,f:["fuerte","em","debil","higgs"],d:"Clave para estudiar por qué hay más materia que antimateria."},
 {s:"e",n:"electrón",t:"leptón",gen:1,q:"−1",sp:"1/2",m:"0.511 MeV",a:1897,f:["em","debil","higgs"],d:"Descubierto por J. J. Thomson en 1897. Responsable de toda la química y la electricidad."},
 {s:"μ",n:"muón",t:"leptón",gen:2,q:"−1",sp:"1/2",m:"105.7 MeV",a:1936,f:["em","debil","higgs"],d:"Un «electrón pesado». Los muones de rayos cósmicos llegan al suelo gracias a la dilatación del tiempo."},
 {s:"τ",n:"tau",t:"leptón",gen:3,q:"−1",sp:"1/2",m:"1.777 GeV",a:1975,f:["em","debil","higgs"],d:"El leptón cargado más pesado; vive unos 3×10⁻¹³ s."},
 {s:"νₑ",n:"neutrino electrónico",t:"leptón",gen:1,q:"0",sp:"1/2",m:"< 0.8 eV",a:1956,f:["debil"],d:"Atraviesan la Tierra casi sin interactuar: billones pasan por tu cuerpo cada segundo, la mayoría desde el Sol."},
 {s:"ν_μ",n:"neutrino muónico",t:"leptón",gen:2,q:"0",sp:"1/2",m:"< 0.19 MeV",a:1962,f:["debil"],d:"Los neutrinos cambian de tipo al viajar (oscilaciones): por eso sabemos que tienen masa (Nobel 2015)."},
 {s:"ν_τ",n:"neutrino tauónico",t:"leptón",gen:3,q:"0",sp:"1/2",m:"< 18.2 MeV",a:2000,f:["debil"],d:"Observado directamente por el experimento DONUT en Fermilab, en el año 2000."},
 {s:"g",n:"gluón",t:"bosón",gen:0,q:"0",sp:"1",m:"0",a:1979,f:["fuerte"],d:"Porta la fuerza fuerte y mantiene unidos a los quarks. Hay 8 tipos según su «carga de color»."},
 {s:"γ",n:"fotón",t:"bosón",gen:0,q:"0",sp:"1",m:"0",a:1905,f:["em"],d:"La partícula de la luz y de toda la radiación electromagnética."},
 {s:"Z",n:"bosón Z",t:"bosón",gen:0,q:"0",sp:"1",m:"91.19 GeV",a:1983,f:["debil","higgs"],d:"Uno de los portadores de la fuerza débil, descubierto en el CERN."},
 {s:"W",n:"bosón W±",t:"bosón",gen:0,q:"±1",sp:"1",m:"80.37 GeV",a:1983,f:["em","debil","higgs"],d:"Cambia el tipo de las partículas: convierte un quark d en u en el decaimiento beta."},
 {s:"H",n:"bosón de Higgs",t:"higgs",gen:0,q:"0",sp:"0",m:"125.2 GeV",a:2012,f:["higgs","debil"],d:"La excitación del campo de Higgs, que da masa a W, Z, quarks y leptones cargados. Hallado en el LHC en 2012."}
];
PFSim.def("modelo",{t:"El Modelo Estándar de partículas", ayuda:"Toca una partícula o filtra por fuerza"}, function(c){
  c.lienzo.style.background="none";
  var filtro=null, sel=6;
  var orden=[["u","c","t","g","H"],["d","s","b","γ",null],["e","μ","τ","Z",null],["νₑ","ν_μ","ν_τ","W",null]];
  var bb=c.botones();
  var FU=[["fuerte","Fuerza fuerte"],["em","Electromagnética"],["debil","Débil"],["higgs","Se acopla al Higgs"]];
  var bts = FU.map(function(f){ var b=bb.b(f[1], function(){ filtro = filtro===f[0]?null:f[0]; bts.forEach(function(x,i){ x.classList.toggle("prim", filtro===FU[i][0]); }); pintar(); }); return b; });
  var cont=PF.el("div",{style:"display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:12px;max-width:640px"});
  var info=PF.el("div",{style:"padding:4px 14px 14px;min-height:110px"});
  c.lienzo.appendChild(cont); c.lienzo.appendChild(info);
  function colT(t){ return t==="quark"?"var(--n4)":(t==="leptón"?"var(--n2)":(t==="bosón"?"var(--n5)":"var(--n1)")); }
  function pintar(){
    var h="";
    orden.forEach(function(fila){ fila.forEach(function(s){
      if(!s){ h+='<div></div>'; return; }
      var i=PART.findIndex(function(p){return p.s===s;}), p=PART[i], apagada = filtro && p.f.indexOf(filtro)<0;
      h+='<button type="button" data-i="'+i+'" style="text-align:left;font:inherit;cursor:pointer;border:2px solid '+colT(p.t)+';background:'+(i===sel?'color-mix(in srgb,'+colT(p.t)+' 18%,var(--hoja))':'var(--hoja)')+';border-radius:8px;padding:6px 8px;color:var(--tinta);opacity:'+(apagada?.22:1)+';min-height:74px">'+
        '<div style="font-size:.72rem;color:var(--tinta-3)">'+p.m+'</div><div style="font-family:var(--f-titulo);font-size:1.6rem;line-height:1.1">'+p.s.replace("_","")+'</div><div style="font-size:.72rem;line-height:1.15">'+p.n+'</div></button>';
    }); });
    cont.innerHTML=h;
    var p=PART[sel];
    info.innerHTML='<h5 style="font-family:var(--f-titulo);font-weight:400;font-size:1.2rem;margin:.2rem 0 .3rem">'+p.n+' ('+p.s.replace("_","")+')</h5><p style="margin:0 0 .4rem">'+p.d+'</p>'+
      (c.n>=2?'<p class="chico" style="margin:0">Tipo: <b>'+p.t+'</b>'+(p.gen?' · generación '+p.gen:'')+' · carga: <b>'+p.q+'</b> · espín: <b>'+p.sp+'</b> · masa: <b>'+p.m+'</b> · descubierto/confirmado: <b>'+p.a+'</b></p>':'');
    cont.querySelectorAll("button").forEach(function(b){ b.onclick=function(){ sel=+b.dataset.i; pintar(); }; });
  }
  c.alNivel(pintar);
  pintar();
  c.datos("");
  c.nota("Morado: quarks · verde: leptones · rojo: bosones de fuerza · amarillo: Higgs. Toda la materia ordinaria está hecha solo de la primera columna: u, d y e. La gravedad, la materia oscura y la masa de los neutrinos quedan fuera de este modelo. Masas aproximadas según el Particle Data Group.");
});

/* ---------- Diagramas de Feynman (SVG) ---------- */
var PROC = {
  moller:{t:"Dispersión de dos electrones", d:"Dos electrones se repelen intercambiando un fotón virtual.",
    l:[["f",[60,60],[200,110],"e⁻"],["f",[60,300],[200,250],"e⁻"],["f",[200,110],[340,60],"e⁻"],["f",[200,250],[340,300],"e⁻"],["foton",[200,110],[200,250],"γ"]],
    v:[[200,110,"Vértice QED: un electrón emite un fotón. Intensidad ∝ e (carga del electrón)."],[200,250,"El otro electrón absorbe el fotón y cambia su dirección: eso es la repulsión eléctrica."]]},
  aniq:{t:"Aniquilación electrón–positrón", d:"Materia y antimateria se aniquilan y se convierten en dos fotones.",
    l:[["f",[60,60],[200,120],"e⁻"],["fa",[60,300],[200,240],"e⁺"],["f",[200,120],[200,240],""],["foton",[200,120],[340,60],"γ"],["foton",[200,240],[340,300],"γ"]],
    v:[[200,120,"El electrón emite un fotón."],[200,240,"El positrón (flecha hacia atrás en el tiempo) se encuentra con el electrón y emite el segundo fotón."]]},
  beta:{t:"Decaimiento beta del neutrón", d:"Un quark down se convierte en up emitiendo un bosón W⁻, que decae en un electrón y un antineutrino.",
    l:[["f",[60,180],[180,180],"d"],["f",[180,180],[340,90],"u"],["W",[180,180],[260,270],"W⁻"],["f",[260,270],[340,230],"e⁻"],["fa",[260,270],[340,320],"ν̄ₑ"]],
    v:[[180,180,"Vértice débil: el quark d cambia de «sabor» a u. Solo la fuerza débil puede hacer esto."],[260,270,"El W⁻ es muy pesado (80 GeV): vive tan poco que decae de inmediato."]]},
  higgs:{t:"Producción del Higgs en el LHC", d:"Dos gluones de los protones se fusionan (a través de un lazo de quarks top) y crean un bosón de Higgs, que decae en dos fotones.",
    l:[["gluon",[50,70],[150,130],"g"],["gluon",[50,290],[150,230],"g"],["f",[150,130],[150,230],"t"],["f",[150,230],[220,180],"t"],["f",[220,180],[150,130],"t"],["H",[220,180],[300,180],"H"],["foton",[300,180],[360,90],"γ"],["foton",[300,180],[360,270],"γ"]],
    v:[[150,130,"Los gluones no sienten al Higgs directamente: lo hacen a través de un lazo de quarks top, los que más se acoplan al Higgs."],[220,180,"Del lazo sale un Higgs."],[300,180,"El Higgs decae en dos fotones: así se descubrió en 2012 (un «pico» en 125 GeV)."]]}
};
PFSim.def("feynman",{t:"Diagramas de Feynman", ayuda:"Elige un proceso y toca los vértices"}, function(c){
  c.lienzo.style.background="none";
  var proc="moller", vsel=-1;
  c.select({l:"Proceso", ops:Object.keys(PROC).map(function(k){return [k,PROC[k].t];}), v:proc, on:function(v){ proc=v; vsel=-1; pintar(); }});
  var box=PF.el("div",{style:"display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;padding:10px 12px;align-items:center"});
  c.lienzo.appendChild(box);
  function onda(a,b,amp,per){ var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy, ny=ux, n=Math.max(4,Math.round(L/per)), d="M"+a[0]+" "+a[1]; for(var i=1;i<=n*8;i++){ var s=i/(n*8), w=Math.sin(s*n*2*Math.PI)*amp; d+=" L"+(a[0]+dx*s+nx*w).toFixed(1)+" "+(a[1]+dy*s+ny*w).toFixed(1); } return d; }
  function rizo(a,b){ var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy, ny=ux, n=Math.round(L/14), d="M"+a[0]+" "+a[1]; for(var i=1;i<=n*12;i++){ var s=i/(n*12), th=s*n*2*Math.PI; var px=a[0]+dx*s - ux*6*Math.sin(th)*0+ux*7*Math.cos(th)-ux*7, py=a[1]+dy*s+uy*7*Math.cos(th)-uy*7; px+=nx*7*Math.sin(th); py+=ny*7*Math.sin(th); d+=" L"+px.toFixed(1)+" "+py.toFixed(1); } return d; }
  function pintar(){
    var P=PROC[proc], s='<svg viewBox="0 0 400 360" style="width:100%;height:auto;max-height:420px" role="img" aria-label="'+P.t+'"><defs><marker id="fl'+proc+'" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--tinta)"/></marker></defs>';
    s+='<text x="20" y="352" font-size="12" fill="var(--tinta-3)">tiempo →</text>';
    P.l.forEach(function(e){
      var a=e[1], b=e[2], mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
      if(e[0]==="f"||e[0]==="fa"){
        s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="var(--tinta)" stroke-width="2.5"/>';
        var A = e[0]==="f"?a:b, B = e[0]==="f"?b:a; s+='<path d="M'+A[0]+' '+A[1]+' L'+((A[0]+B[0])/2)+' '+((A[1]+B[1])/2)+'" stroke="none" marker-end="url(#fl'+proc+')"/>';
      } else if(e[0]==="foton") s+='<path d="'+onda(a,b,6,16)+'" fill="none" stroke="var(--n1)" stroke-width="2.5"/>';
      else if(e[0]==="W") s+='<path d="'+onda(a,b,7,12)+'" fill="none" stroke="var(--n4)" stroke-width="2.5"/>';
      else if(e[0]==="gluon") s+='<path d="'+rizo(a,b)+'" fill="none" stroke="var(--n2)" stroke-width="2.2"/>';
      else if(e[0]==="H") s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="var(--n5)" stroke-width="2.6" stroke-dasharray="7 5"/>';
      if(e[3]){ var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy); s+='<text x="'+(mx-dy/L*16)+'" y="'+(my+dx/L*16+5)+'" font-size="16" text-anchor="middle" fill="var(--tinta)" font-family="var(--f-titulo)">'+e[3]+'</text>'; }
    });
    P.v.forEach(function(v,i){ s+='<circle cx="'+v[0]+'" cy="'+v[1]+'" r="'+(i===vsel?10:7)+'" fill="'+(i===vsel?"var(--rojo)":"var(--tinta)")+'" data-v="'+i+'" style="cursor:pointer" tabindex="0" role="button" aria-label="Vértice '+(i+1)+'"/>'; });
    s+='</svg>';
    var txt='<h5 style="font-family:var(--f-titulo);font-weight:400;font-size:1.2rem;margin:0 0 .4rem">'+P.t+'</h5><p style="margin:0 0 .6rem">'+P.d+'</p>'+(vsel>=0?'<p style="margin:0;padding:.6rem .7rem;border-left:3px solid var(--rojo);background:var(--papel-2)">'+P.v[vsel][2]+'</p>':'<p class="chico">Toca un punto negro (vértice) para ver qué pasa ahí.</p>')+
      '<p class="chico" style="margin-top:.6rem">Líneas: <span style="color:var(--tinta)">— fermión</span> · <span style="color:var(--n1)">∿ fotón</span> · <span style="color:var(--n4)">∿ W/Z</span> · <span style="color:var(--n2)">ℓ gluón</span> · <span style="color:var(--n5)">- - Higgs</span></p>';
    box.innerHTML='<div>'+s+'</div><div>'+txt+'</div>';
    box.querySelectorAll("[data-v]").forEach(function(el){ var f=function(){ vsel=+el.getAttribute("data-v"); pintar(); }; el.addEventListener("click",f); el.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" ") f(); }); });
  }
  pintar();
  c.datos("");
  c.nota("Cada diagrama es un término de un cálculo: Feynman inventó estas reglas para convertir dibujos en integrales. Las flechas hacia atrás representan antipartículas. Las partículas internas son «virtuales»: no se pueden observar directamente.");
});

if(window.PF && PF.listo) PFSim.montarTodas(document);
})();
