/* Pura Física! — física moderna y de frontera */
(function(){
"use strict";
var F = PFSim.dib;
var Cc=2.99792458e8, Gn=6.674e-11, HB=1.054571817e-34, KB=1.380649e-23, MSOL=1.989e30, EV=1.602176634e-19, HP=6.62607015e-34;

/* ---------- Reloj de luz: dilatación del tiempo ---------- */
PFSim.def("relatividad",{t:"Light clock and time dilation", ayuda:"Speed up the ship"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var b=.6, t=0, tickT=0, tickN=0, x=0;
  c.slider({l:"Ship's speed (fraction of c)", min:0, max:.995, paso:.005, v:b, fmt:function(v){ return PF.fmt(v,3)+" c"; }, on:function(v){ b=v; t=0; tickT=0; tickN=0; }});
  c.botones().b("Reset clocks", function(){ t=0; tickT=0; tickN=0; });
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
    F.texto(g, c.n===1?"Clock on Earth":"Clock at rest", x0, y0+H+28, {alin:"center", tam:13, color:tinta});
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
    F.texto(g, c.n===1?"Clock on the ship":"Moving clock", xm, y0+H+28, {alin:"center", tam:13, color:tinta});
    F.texto(g, "tic-tac: "+Math.floor(t/Pm), xm, y0+H+46, {alin:"center", mano:true, tam:22, color:boli});
    F.flecha(g, xm-20, y0-22, xm+40, y0-22, boli, 2, PF.fmt(b,2)+" c");
    var anos = 10;
    if(c.n===1) c.datos('<span>When the ship goes very, very fast, its clock ticks <b>more slowly</b>. If 10 years passed on Earth, only <b>'+PF.fmt(anos/gam,1)+' years</b> would pass on the ship.</span>');
    else c.datosTex('<span>Lorentz factor γ = <b>'+PF.fmt(gam,3)+'</b></span><span>10 years on Earth = <b>'+PF.fmt(anos/gam,2)+' years</b> on the ship</span><span>Ship length: <b>'+PF.fmt(100/gam,1)+' %</b> of the original</span>'+(c.n>=3?'<span class="ec">\\(\\gamma=\\dfrac{1}{\\sqrt{1-v^2/c^2}},\\quad \\Delta t=\\gamma\\,\\Delta t_0,\\quad L=L_0/\\gamma\\)</span>':''));
  }
  c.nota("Light travels at the same speed for everyone. Seen from Earth, the ship's photon travels a longer diagonal path, so each tick takes longer: time on the ship passes more slowly. It has been measured with atomic clocks on airplanes and with muons from cosmic rays.");
});

/* ---------- Diagrama de Minkowski ---------- */
PFSim.def("minkowski",{t:"Minkowski spacetime diagram", ayuda:"Drag event B and change the observer's velocity"}, function(c){
  var g = c.canvas(.62, 320, 520);
  var b=.4, B=[1.2,2.0], arr=false; // B = [x, ct]
  c.slider({l:"Velocity of the other observer", min:-.9, max:.9, paso:.01, v:b, fmt:function(v){return PF.fmt(v,2)+" c";}, on:function(v){b=v;dibujar();}});
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
    var tipo = Math.abs(s2)<1e-6 ? "lightlike (joined by a light ray)" : (s2>0 ? "timelike (B can be caused by A)" : "spacelike (no message can get from A to B)");
    if(c.n<=2) c.datos('<span>Each point is an <b>event</b>: a place and a moment. The yellow area is everything the light leaving A can reach.</span><span>B is <b>'+(s2>0?"reachable":"unreachable")+'</b> from A.</span>');
    else c.datos('<span>Separation: <b>'+tipo+'</b></span><span>Δs² = (cΔt)² − Δx² = <b>'+PF.fmt(s2,2)+'</b> (the same for everyone)</span><span>For the other observer: cΔt\' = <b>'+PF.fmt(dtp,2)+'</b>, Δx\' = <b>'+PF.fmt(dxp,2)+'</b></span>'+(s2<0&&dt*dtp<0?'<span><b>The order of A and B is reversed for the other observer!</b></span>':''));
  }
  c.nota("The moving observer's axes «close» like scissors toward the light diagonal. What's simultaneous for one isn't for the other, but the interval Δs² and the speed of light are the same for everyone.");
});

/* ---------- Efecto fotoeléctrico ---------- */
PFSim.def("fotoelectrico",{t:"Photoelectric effect", ayuda:"Change the color of the light and the metal"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var lam=400, I=.6, met="sodio", fot=[], ele=[], cuenta=0;
  var MET = {cesio:[2.1,"Cesium"], potasio:[2.3,"Potassium"], sodio:[2.28,"Sodium"], zinc:[4.3,"Zinc"], cobre:[4.7,"Copper"], platino:[5.65,"Platinum"]};
  c.slider({l:"Wavelength", min:120, max:780, paso:5, v:lam, u:"nm", dec:0, on:function(v){lam=v;}});
  c.slider({l:"Intensity", min:0, max:1, paso:.05, v:I, fmt:function(v){return Math.round(v*100)+" %";}, on:function(v){I=v;}});
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
    F.texto(g,"K max (eV)",gx+4,gy+10,{tam:11,color:t3}); F.texto(g,"f",gx+gw,gy+gh+14,{tam:12,color:t3,alin:"right"});
    var f0=phi*EV/HP; var p1=[gx+f0/fmax*gw, gy+gh], p2=[gx+gw, gy+gh-((HP*fmax/EV)-phi)/Kmax*gh];
    F.linea(g,[p1,p2],boli,2);
    var f=Cc/(lam*1e-9), K=Math.max(0,E-phi);
    F.circulo(g,gx+Math.min(1,f/fmax)*gw, gy+gh-K/Kmax*gh, 5, rojo);
    F.texto(g,"f₀",p1[0],gy+gh+14,{tam:12,color:boli,alin:"center"});
    if(c.n===1) c.datos('<span>'+(E>phi?"The light knocks electrons out of the metal!":"This light doesn't have enough energy: even if you make it brighter, no electron comes out!")+'</span>');
    else c.datos('<span>Photon energy: <b>'+PF.fmt(E,2)+' eV</b></span><span>Work function φ: <b>'+phi+' eV</b></span><span>'+(E>phi?'K<sub>max</sub> = hf − φ = <b>'+PF.fmt(K,2)+' eV</b>':'<b>No emission</b> (hf &lt; φ)')+'</span><span>Threshold: λ₀ = <b>'+PF.fmt(1239.84/phi,0)+' nm</b></span>');
  }
  c.nota("Classical physics said that more intense light would always knock out electrons. It doesn't: all that matters is the energy of each photon, E = hf. Einstein explained it in 1905, and that's why he received the 1921 Nobel Prize.");
});

/* ---------- Átomo de Bohr y espectro del hidrógeno ---------- */
PFSim.def("atomo",{t:"Hydrogen atom: jumps and colors", ayuda:"Tap a level to make the electron jump"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=3, foton=null, lineas=[], anim=0;
  var bb=c.botones();
  [1,2,3,4,5,6].forEach(function(k){ bb.b("n = "+k, function(){ saltar(k); }); });
  bb.b("Clear spectrum", function(){ lineas=[]; });
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
      F.texto(g,(foton.emi?"emits":"absorbs")+" "+PF.fmt(foton.l,0)+" nm",x+30,y-30,{mano:true,tam:20,color:col==="#a33"?rojo:col});
    }
    // espectro
    var sx=c.W*.58, sw=c.W*.38, sy=c.H*.22, sh=40;
    F.texto(g,"Emission spectrum (visible)",sx,sy-10,{tam:12,color:t3});
    F.rect(g,sx,sy,sw,sh,"#111");
    lineas.forEach(function(l){ if(l>=380&&l<=750){ var X=sx+(l-380)/370*sw; F.rect(g,X-1.5,sy,3,sh,PFSim.colorLambda(l)); } });
    F.texto(g,"380 nm",sx,sy+sh+14,{tam:11,color:t3}); F.texto(g,"750 nm",sx+sw,sy+sh+14,{tam:11,color:t3,alin:"right"});
    var inv = lineas.filter(function(l){return l<380||l>750;});
    if(inv.length) F.texto(g,"It also emitted (invisible): "+inv.map(function(l){return l+" nm";}).join(", "),sx,sy+sh+34,{tam:11,color:t3});
    // niveles de energía
    var lx=sx, ly=sy+sh+60, lh=c.H-ly-14;
    for(k=1;k<=6;k++){ var Y=ly+lh*(1-(E(k)+13.6)/13.6*.95); F.linea(g,[[lx,Y],[lx+sw*.5,Y]],k===n?rojo:tinta,k===n?2.5:1.2); if(k<=3||k===n) F.texto(g,"n="+k+"  "+PF.fmt(E(k),2)+" eV",lx+sw*.52,Y+(k===n&&k>3?-4:4),{tam:11,color:k===n?rojo:t3}); }
    if(c.n===1) c.datos('<span>The electron can only be on certain «steps». When it steps down, it gives off a tiny packet of light (a photon) of an exact color.</span>');
    else c.datos('<span>Current level: <b>n = '+n+'</b>, E = <b>'+PF.fmt(E(n),2)+' eV</b></span><span>Try dropping to n = 2 from 3, 4, 5 and 6: those are the Balmer lines (656, 486, 434 and 410 nm).</span>');
  }
  c.nota("In Bohr's model (1913), Eₙ = −13.6 eV/n². Each jump between levels emits a photon with E = hf = Eₙᵢ − E_nf. That's why each element has its own «barcode» of colors, and that's how we know what stars are made of.");
});

/* ---------- Doble rendija ---------- */
PFSim.def("rendija",{t:"Double-slit experiment", ayuda:"Send particles one at a time"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var ritmo=60, obs=false, imp=[], hist=new Array(120).fill(0), lam=1, sep=4;
  c.slider({l:"Particles per second", min:5, max:600, paso:5, v:ritmo, dec:0, on:function(v){ritmo=v;}});
  c.slider({l:"Slit separation", min:2, max:8, paso:.5, v:sep, dec:1, on:function(v){sep=v; limpiar();}});
  var bb=c.botones(); bb.check("Detector at the slits (observe)", false, function(v){ obs=v; limpiar(); }); bb.b("Clear screen", limpiar);
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
    if(c.n===1) c.datos('<span>We send particles one at a time. '+(obs?"If we spy on them, they behave like marbles: two stripes.":"Without spying, they form fringes as if they were waves!")+'</span>');
    else c.datos('<span>Hits: <b>'+tot+'</b></span><span>'+(obs?"With detector: no interference (two bands)":"Without detector: interference pattern")+'</span>');
  }
  c.nota("Each particle arrives at a single point, but the pattern formed by thousands of them is an interference pattern: each one «goes through both slits» as a probability wave. If we measure which slit it went through, the pattern disappears. It's been done with photons, electrons and even large molecules.");
});

/* ---------- Partícula en una caja ---------- */
PFSim.def("caja",{t:"Particle in a box (infinite well)", ayuda:"Choose the state or mix two"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=1, mezcla=false, t=0, verPsi=true;
  c.slider({l:"Quantum number n", min:1, max:8, paso:1, v:n, dec:0, on:function(v){n=v;}});
  var bb=c.botones(); bb.check("Superposition of n=1 and n=2", false, function(v){mezcla=v;}); bb.check("Show ψ (real part)", true, function(v){verPsi=v;});
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
    F.texto(g,"|ψ|² (probability)",x0+6,base-8,{tam:12,color:rojo});
    if(verPsi) F.texto(g,"Re ψ",x0+6,base-alto*.5-alto*.2,{tam:12,color:boli});
    if(c.n<=2) c.datos('<span>A trapped particle can\'t sit still or have just any energy: only certain levels. The red area shows where it\'s most likely to be found.</span>');
    else c.datosTex('<span>'+(mezcla?"Superposition: the probability «sloshes» from side to side":"Stationary state n = "+n+": |ψ|² doesn't change with time")+'</span><span>Nodes: <b>'+(mezcla?"—":(n-1))+'</b></span><span class="ec">\\(\\psi_n(x)=\\sqrt{\\tfrac{2}{L}}\\sin\\tfrac{n\\pi x}{L},\\qquad E_n=\\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}\\)</span>');
  }
  c.nota("The lowest energy (n = 1) isn't zero: it's the zero-point energy, a consequence of the uncertainty principle. This simple model explains, for example, the color of the quantum dots in some QLED screens: smaller dots, more widely spaced levels, bluer light.");
});

/* ---------- Oscilador armónico cuántico ---------- */
PFSim.def("oscilador",{t:"Quantum harmonic oscillator: creating and destroying quanta", ayuda:"Use a† and a to go up or down a level"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var n=0, msg="";
  var bb=c.botones();
  bb.b("a† (create a quantum)", function(){ if(n<9){ msg="a†|"+n+"⟩ = √"+(n+1)+" |"+(n+1)+"⟩"; n++; } }, true);
  bb.b("a (destroy a quantum)", function(){ if(n>0){ msg="a|"+n+"⟩ = √"+n+" |"+(n-1)+"⟩"; n--; } else msg="a|0⟩ = 0 : the vacuum can't be emptied any further"; });
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
    var qx=c.W*.78; F.texto(g,"Quanta in the mode:",qx,40,{tam:12,color:t3});
    for(k=0;k<n;k++){ F.circulo(g,qx+12+(k%5)*22,64+Math.floor(k/5)*22,8,c.col("n1"),tinta,1.2); }
    if(msg) F.texto(g,msg,qx,c.H*.55,{mano:true,tam:21,color:rojo});
    if(c.n<=3) c.datos('<span>A quantum spring can only have energies in equal steps. Each step is a «quantum»; in light, each quantum is a photon.</span><span>Level: <b>n = '+n+'</b></span>');
    else c.datosTex('<span>State <b>|'+n+'⟩</b>, \\(E_n=\\hbar\\omega(n+\\tfrac12)=\\) <b>'+PF.fmt(n+.5,1)+' ħω</b></span><span class="ec">\\([a,a^\\dagger]=1,\\quad a^\\dagger|n\\rangle=\\sqrt{n+1}\\,|n+1\\rangle,\\quad a|n\\rangle=\\sqrt{n}\\,|n-1\\rangle\\)</span>');
  }
  c.nota("In quantum field theory, each vibration mode of a field is an oscillator like this one, and each quantum of excitation is a particle. «Creating a photon» literally means applying a† to the corresponding mode of the electromagnetic field. Even the state |0⟩ (the vacuum) has energy ½ħω.");
});

/* ---------- Reacción en cadena ---------- */
PFSim.def("fision",{t:"Chain reaction", ayuda:"Fire a neutron and adjust the control rods"}, function(c){
  var g = c.canvas(.55, 300, 460);
  var nuc=[], neu=[], abs=.35, fis=0, hist=[], tt=0;
  c.slider({l:"Control rods (absorption)", min:0, max:.9, paso:.01, v:abs, fmt:function(v){return Math.round(v*100)+" %";}, on:function(v){abs=v;}});
  var bb=c.botones(); bb.b("Fire neutron", function(){ neu.push({x:0,y:.5,vx:.5,vy:(Math.random()-.5)*.2,vida:3}); }, true); bb.b("Reload uranium", crear);
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
    var estado = k>1.05?"supercritical (growing)":(k<.95?"subcritical (dying out)":"critical (stable)");
    if(c.n===1) c.datos('<span>Every uranium atom that splits releases 2 or 3 neutrons that split others. Like dominoes that multiply! The rods «eat» neutrons to keep it under control.</span>');
    else c.datos('<span>Fissions: <b>'+fis+'</b></span><span>Energy released: <b>'+PF.fmt(fis*200,0)+' MeV</b> (≈ 200 MeV per fission)</span><span>Approximate regime: <b>'+estado+'</b></span>');
  }
  c.nota("A nuclear reactor runs right at the critical regime: on average, each fission causes exactly one new fission. The control rods (boron or cadmium) absorb the extra neutrons. A single U‑235 fission releases about 200 MeV, some 50 million times more than burning one methane molecule.");
});

/* ---------- Decaimiento radiactivo ---------- */
PFSim.def("decaimiento",{t:"Radioactive decay and half-life", ayuda:"Watch half of them decay in each half-life"}, function(c){
  var g = c.canvas(.5, 300, 420);
  var ISO = {c14:[5730,"years","Carbon‑14 (fossil dating)"], i131:[8.02,"days","Iodine‑131 (nuclear medicine)"], rn222:[3.82,"days","Radon‑222 (a gas in some basements)"], u238:[4.47e9,"years","Uranium‑238 (age of the Earth)"]};
  var iso="c14", N0=400, s=[], t=0, Tv=3, hist=[];
  c.select({l:"Isotope", ops:Object.keys(ISO).map(function(k){return [k,ISO[k][2]];}), v:iso, on:function(v){iso=v; crear();}});
  c.botones().b("Reset", crear, true);
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
    if(c.n===1) c.datos('<span>Unstable atoms transform at random. We don\'t know which one will be next, but we do know that every so often half of them transform!</span>');
    else c.datos('<span>Remaining: <b>'+vivos+'</b> de '+N0+'</span><span>Equivalent real time: <b>'+PF.fmt(tr,tr<100?1:0)+' '+vm[1]+'</b></span><span>Half-life: <b>'+PF.fmt(vm[0],2)+' '+vm[1]+'</b></span>');
  }
  c.nota("N(t) = N₀·(1/2)^(t/T½). Each nucleus has the same probability of decaying at every instant, no matter how long it has existed. Carbon‑14 dates remains up to about 50,000 years old; uranium‑238, rocks billions of years old.");
});

/* ---------- Cuerdas vibrantes ---------- */
PFSim.def("cuerda",{t:"Vibration modes of a string", ayuda:"Change the mode: each one is a different «note»"}, function(c){
  var g = c.canvas(.45, 260, 400);
  var n=1, tipo="abierta", mezcla=false, t=0;
  c.slider({l:"Vibration mode n", min:1, max:8, paso:1, v:n, dec:0, on:function(v){n=v;}});
  c.select({l:"String", ops:[["abierta","Fixed ends (guitar)"],["cerrada","Closed (loop)"]], v:tipo, on:function(v){tipo=v;}});
  c.botones().check("Mix several modes", false, function(v){mezcla=v;});
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
    if(c.n===1) c.datos('<span>A guitar string can vibrate in many ways. Each way sounds like a different note. String theory imagines that every particle is a «note» of a tiny little string!</span>');
    else if(c.n<=3) c.datos('<span>Mode <b>'+n+'</b>: frequency = <b>'+n+'</b> × the fundamental</span><span>Nodes (still points): <b>'+(tipo==="abierta"?n-1:2*n)+'</b></span>');
    else c.datosTex('<span class="ec">Fixed string: \\(y_n(x,t)=A\\sin\\tfrac{n\\pi x}{L}\\cos\\omega_n t,\\;\\; f_n=\\tfrac{n}{2L}\\sqrt{T/\\mu}\\).&nbsp; In string theory, the mass spectrum comes from the modes: \\(\\alpha\' M^2 = N + \\tilde N - 2\\) (closed bosonic string, \\(N=\\tilde N\\)).</span>');
  }
  c.nota("In string theory, particles wouldn't be points but strings about the size of the Planck length (~10⁻³⁵ m). One mode of vibration would look like an electron, another like a photon and another like a graviton. There is still no direct experimental evidence.");
});

/* ---------- Agujeros negros: calculadora ---------- */
PFSim.def("agujero",{t:"Black hole calculator", ayuda:"Pick a mass and compare"}, function(c){
  var g = c.canvas(.45, 260, 380);
  var M=MSOL;
  var PRE=[["7.35e22","The Moon"],["5.97e24","The Earth"],["1.989e30","The Sun"],["1.99e31","10 suns (stellar black hole)"],["8.55e36","Sagittarius A* (center of the Milky Way)"],["1.29e40","M87* (first photo, 2019)"],["1e12","A mountain (primordial black hole)"]];
  var sM=c.slider({l:"Mass", min:10, max:41, paso:.01, v:M, log:true, fmt:function(v){ return PF.fmt(v,2)+" kg ("+PF.fmt(v/MSOL,3)+" M☉)"; }, on:function(v){ M=v; dibujar(); }});
  sM.set(M);
  c.select({l:"Examples", ops:PRE, v:"1.989e30", on:function(v){ M=+v; sM.set(M); dibujar(); }});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  var REF=[[1e-2,"a marble (1 cm)"],[1,"a person"],[1e3,"a stadium"],[3e4,"a city"],[6.4e6,"the Earth"],[7e8,"the Sun"],[1.5e11,"the Earth's orbit"],[4.5e12,"Neptune's orbit"],[1e16,"a light-year"]];
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var rs=2*Gn*M/(Cc*Cc), T=HB*Cc*Cc*Cc/(8*Math.PI*Gn*M*KB), A=4*Math.PI*rs*rs, S=A*Cc*Cc*Cc/(4*Gn*HB), tev=5120*Math.PI*Gn*Gn*M*M*M/(HB*Math.pow(Cc,4))/3.156e7;
    // comparación: referencia más cercana mayor
    var ref=REF[REF.length-1]; for(var i=0;i<REF.length;i++){ if(REF[i][0]>=rs){ ref=REF[i]; break; } }
    if(rs < 1e-3) ref=[1e-2,"a marble (1 cm)"];
    var cx=c.W*.3, cy=c.H/2, Rmax=Math.min(c.W*.25,c.H*.42), ratio=Math.min(1, rs/ref[0]), r=Math.max(2,Rmax*ratio);
    g.strokeStyle=t3; g.setLineDash([5,4]); g.lineWidth=1.5; g.beginPath(); g.arc(cx,cy,Rmax,0,Math.PI*2); g.stroke(); g.setLineDash([]);
    F.texto(g,"size of "+ref[1],cx,cy+Rmax+18,{alin:"center",tam:12,color:t3});
    var grd=g.createRadialGradient(cx,cy,r*.9,cx,cy,r*1.6); grd.addColorStop(0,"rgba(255,170,60,.0)"); grd.addColorStop(.3,"rgba(255,170,60,.55)"); grd.addColorStop(1,"rgba(255,170,60,0)");
    g.fillStyle=grd; g.beginPath(); g.arc(cx,cy,r*1.6,0,Math.PI*2); g.fill();
    F.circulo(g,cx,cy,r,"#000");
    var tx=c.W*.58, lh=24, y=40;
    function fila(a,b){ F.texto(g,a,tx,y,{tam:13,color:t3}); F.texto(g,b,tx,y+16,{tam:15,color:tinta,negr:true}); y+=lh+16; }
    fila("Event horizon radius", fmtL(rs));
    if(c.n>=3){ fila("Hawking temperature", PF.fmt(T,3)+" K"); }
    if(c.n>=4){ fila("Bekenstein–Hawking entropy", PF.fmt(S,3)+" k_B"); fila("Time to evaporate", PF.fmt(tev,3)+" years"); }
    if(c.n<=2) c.datos('<span>If you squashed '+(M<1e25?"that mass":"that object")+' until it measured <b>'+fmtL(rs)+'</b> in radius, not even light could escape: it would be a black hole.</span>');
    else c.datosTex('<span class="ec">\\(r_s=\\dfrac{2GM}{c^2},\\quad T_H=\\dfrac{\\hbar c^3}{8\\pi G M k_B},\\quad S=\\dfrac{k_B c^3 A}{4G\\hbar},\\quad t_{ev}\\approx\\dfrac{5120\\pi G^2M^3}{\\hbar c^4}\\)</span><span>The age of the universe is ≈ 1.38×10¹⁰ years.</span>');
  }
  function fmtL(m){ if(m<1e-6) return PF.fmt(m,2)+" m"; if(m<1e-3) return PF.fmt(m*1e6,2)+" µm"; if(m<1) return PF.fmt(m*1000,2)+" mm"; if(m<1000) return PF.fmt(m,2)+" m"; if(m<1.5e10) return PF.fmt(m/1000,2)+" km"; if(m<9.46e15*.5) return PF.fmt(m/1.496e11,2)+" UA"; return PF.fmt(m/9.46e15,2)+" light-years"; }
  c.nota("The more massive a black hole is, the bigger and colder it is. Stellar black holes are much colder than the cosmic microwave background (2.7 K), so today they absorb more than they emit and don't evaporate.");
});

/* ---------- Escalas del universo ---------- */
var ESC=[
 [1.6e-35,"Planck length","The scale where quantum gravity is expected to matter. Nobody knows what's here.","Quantum gravity (unknown)"],
 [1e-18,"The limit for quarks and electrons","Experiments haven't found internal structure above ~10⁻¹⁸ m.","Quantum field theory"],
 [1.7e-15,"Proton","Three quarks held together by gluons. About 1.7 fm across.","Quantum chromodynamics"],
 [1e-10,"Atom","The electron cloud is about 100,000 times bigger than the nucleus.","Quantum mechanics"],
 [2e-9,"DNA (width of the helix)","The molecule that stores the instructions for life.","Quantum chemistry"],
 [1e-7,"Virus","About 100 nm: smaller than the wavelength of visible light.","Molecular physics"],
 [8e-6,"Red blood cell","About 8 µm. You can already see it with an optical microscope.","Fluid physics and biophysics"],
 [1e-3,"Small ant","One millimeter: the smallest square on graph paper.","Classical mechanics"],
 [1.7,"Person","Our scale: Newton's physics works here.","Classical mechanics"],
 [8.8e3,"Mount Everest","8.8 km high.","Geophysics"],
 [1.27e7,"The Earth","12,742 km in diameter.","Newtonian gravitation"],
 [1.39e9,"The Sun","More than a million Earths would fit inside.","Plasma physics and fusion"],
 [9e12,"Solar System (Neptune's orbit)","Light takes about 4 hours to reach Neptune.","Celestial mechanics"],
 [9.46e15,"A light-year","The distance light travels in a year.","Relativity"],
 [9.5e20,"Milky Way","About 100,000 light-years across and hundreds of billions of stars.","Galactic dynamics and dark matter"],
 [8.8e26,"Observable universe","About 93 billion light-years across.","Cosmology and general relativity"]
];
PFSim.def("escalas",{t:"From the Planck size to the universe", ayuda:"Slide to zoom"}, function(c){
  var g = c.canvas(.45, 260, 400);
  var L=Math.log10(1.7);
  var s=c.slider({l:"Size", min:-35, max:27, paso:.01, v:1.7, log:true, fmt:function(v){ return "10"+PF.sup(Math.round(Math.log10(v)))+" m"; }, on:function(v){ L=Math.log10(v); dibujar(); }});
  s.set(1.7);
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  function dibujar(){
    if(!c.W) return; c.limpiar();
    var tinta=c.col("tinta"), rojo=c.col("rojo"), boli=c.col("boli"), t3=c.col("tinta-3");
    var cx=c.W*.3, cy=c.H/2, R=Math.min(c.W*.26,c.H*.44);
    // dibuja objetos con tamaño relativo a 10^L (que ocupa R)
    ESC.forEach(function(o,i){
      var r = R*o[0]/Math.pow(10,L);
      if(r<2 || r>R*30) return;
      g.globalAlpha = r>R*1.05 ? .25 : 1;
      g.strokeStyle = i%2?boli:rojo; g.lineWidth=2; g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.stroke();
      if(r<R*1.05 && r>14) F.texto(g,o[1],cx,cy-r-5,{alin:"center",tam:12,color:i%2?boli:rojo});
      g.globalAlpha=1;
    });
    // regla logarítmica
    var rx=c.W*.6, rw=c.W*.37, ry=c.H-40;
    F.linea(g,[[rx,ry],[rx+rw,ry]],tinta,1.5);
    for(var e=-30;e<=20;e+=10){ var X=rx+(e+35)/62*rw; F.linea(g,[[X,ry-4],[X,ry+4]],tinta,1); F.texto(g,"10"+PF.sup(e),X,ry+18,{alin:"center",tam:10,color:t3}); }
    var Xm=rx+(L+35)/62*rw; F.circulo(g,Xm,ry,6,rojo);
    // objeto más cercano
    var cerca=ESC.reduce(function(a,o){ return Math.abs(Math.log10(o[0])-L)<Math.abs(Math.log10(a[0])-L)?o:a; });
    F.texto(g,cerca[1],rx,46,{serif:true,tam:20,color:tinta});
    var palabras=cerca[2].split(" "), lin="", yy=72;
    palabras.forEach(function(w){ var prueba=lin+w+" "; g.font='14px "Atkinson",sans-serif'; if(g.measureText(prueba).width>rw && lin){ F.texto(g,lin,rx,yy,{tam:14,color:tinta}); lin=w+" "; yy+=19; } else lin=prueba; });
    F.texto(g,lin,rx,yy,{tam:14,color:tinta});
    if(c.n>=2) F.texto(g,"Dominant physics: "+cerca[3],rx,yy+28,{tam:13,color:boli});
    c.datos('<span>The big circle measures <b>10'+PF.sup(Math.round(L))+' m</b>.</span><span>There are about 62 orders of magnitude between the Planck length and the observable universe.</span>');
  }
  c.nota("Each scale has its own physics: quantum in the small, Newton in everyday life, general relativity in the enormous. Uniting quantum mechanics and gravity in a single framework is one of the great open problems.");
});

/* ---------- Destino del universo (ecuaciones de Friedmann) ---------- */
PFSim.def("cosmos",{t:"How will the universe end?", ayuda:"Change the amount of matter and dark energy"}, function(c){
  var g = c.canvas(.5, 300, 440);
  var Om=.315, OL=.685, H0=67.4*1.0227e-3; // 1/Gyr
  var sOm=c.slider({l:"Matter Ωₘ", min:0, max:3, paso:.005, v:Om, dec:3, on:function(v){Om=v;dibujar();}});
  var sOL=c.slider({l:"Dark energy Ω_Λ", min:-.5, max:2, paso:.005, v:OL, dec:3, on:function(v){OL=v;dibujar();}});
  c.select({l:"Scenarios", ops:[["real","Our universe (Planck 2018)"],["crunch","Lots of matter, no dark energy"],["plano","Matter only, flat"],["vacio","Almost empty universe"]], v:"real", on:function(v){ var m={real:[.315,.685],crunch:[2.5,0],plano:[1,0],vacio:[.05,0]}[v]; Om=m[0]; OL=m[1]; sOm.set(Om); sOL.set(OL); dibujar(); }});
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
    F.texto(g,"billions of years from today",gx+gw,gy+gh-6,{alin:"right",tam:11,color:t3});
    F.texto(g,"relative size a(t)",gx+4,gy+12,{tam:11,color:t3});
    F.linea(g,[[X(0),gy],[X(0),gy+gh]],t3,1,[4,4]); F.texto(g,"today",X(0)+4,gy+28,{mano:true,tam:20,color:rojo});
    F.linea(g,pas.pts.map(function(p){return [X(p[0]),Y(p[1])];}),boli,2.5);
    F.linea(g,fut.pts.filter(function(p){return p[1]<=amax;}).map(function(p){return [X(p[0]),Y(p[1])];}),verde,2.8);
    var Ok=1-Om-OL, destino;
    var accHoy = -Om/2+OL;
    if(fut.fin==="crunch") destino="Big Crunch: the expansion stops and everything comes back together";
    else if(OL>0 && accHoy>0) destino="Accelerated expansion forever: the universe cools and empties out (Big Freeze)";
    else destino="Eternal but ever slower expansion";
    var geo = Math.abs(Ok)<.01?"plano":(Ok>0?"open (negative curvature)":"closed (positive curvature)");
    if(c.n===1) c.datos('<span>The universe is stretching like a balloon being blown up. Depending on how much «stuff» it has, it could keep growing forever or shrink back.</span><span>Fate: <b>'+(fut.fin==="crunch"?"shrinks back":"grows forever")+'</b></span>');
    else c.datos('<span>Fate: <b>'+destino+'</b></span><span>Age: <b>'+(edad?PF.fmt(edad,1)+" billion years":"no Big Bang in this model")+'</b></span>'+(c.n>=3?'<span>Geometry: <b>'+geo+'</b> (Ω_k = '+PF.fmt(Ok,3)+')</span><span>Expansion today: <b>'+(accHoy>0?"accelerating":"decelerating")+'</b> (q₀ = '+PF.fmt(-accHoy,2)+')</span>':''));
  }
  c.nota("This solves the Friedmann equation ä/a = −(4πG/3)ρ + Λc²/3 with H₀ = 67.4 km/s/Mpc. With the values measured by the Planck satellite you get an age of about 13.8 billion years and accelerated expansion. Some recent data suggest that dark energy might change over time: it's an open question.");
});

/* ---------- Calendario cósmico ---------- */
var EVENTOS_CAL=[
 [13.8e9,"Big Bang","The expansion of space begins; everything is hot and dense."],
 [13.8e9-380e3,"The universe becomes transparent","The first atoms form and the light we see today as the cosmic microwave background is released."],
 [13.6e9,"First stars","The first stars forge the first heavy elements inside them."],
 [13.0e9,"The Milky Way forms (its oldest parts)","Our galaxy begins to assemble from smaller galaxies."],
 [4.6e9,"The Solar System is born","A cloud of gas, enriched by stars that exploded earlier, collapses and forms the Sun and the planets."],
 [3.8e9,"First life on Earth","Simple microbes in the oceans (the exact date is still being researched)."],
 [2.4e9,"Great Oxidation","Cyanobacteria fill the atmosphere with oxygen."],
 [538e6,"Cambrian explosion","Many groups of complex animals appear suddenly."],
 [230e6,"First dinosaurs",""],
 [66e6,"Extinction of the dinosaurs","An asteroid impact at Chicxulub, in Yucatán, Mexico!"],
 [300e3,"Homo sapiens appears","Our species, in Africa."],
 [12e3,"Agriculture begins",""],
 [339,"Newton publishes the Principia (1687)","Modern physics is born."],
 [0,"Today","All of humanity's written history fits into the last seconds of the year."]
];
PFSim.def("calendario",{t:"Cosmic calendar", ayuda:"The whole history of the universe squeezed into one year"}, function(c){
  var g = c.canvas(.32, 220, 300);
  var sel=4, zoom=false;
  var opts=EVENTOS_CAL.map(function(e,i){ return [i, e[1]]; });
  var sS=c.select({l:"Event", ops:opts, v:sel, on:function(v){ sel=+v; dibujar(); }});
  c.botones().check("Zoom in on December 31", false, function(v){ zoom=v; dibujar(); });
  c.puntero(c.cv,{abajo:function(p){ var best=0, bd=1e9; EVENTOS_CAL.forEach(function(e,i){ var X=xDe(e[0]); if(X==null) return; if(Math.abs(X-p.x)<bd){bd=Math.abs(X-p.x);best=i;} }); if(bd<30){ sel=best; sS.set(sel); dibujar(); } }});
  c.alRedim(dibujar); c.alTema(dibujar); c.alNivel(dibujar);
  var T=13.8e9;
  function frac(ago){ return 1-ago/T; }
  function xDe(ago){ var f=frac(ago), x0=30, w=c.W-60; if(!zoom) return x0+f*w; var f0=1-1/365.25; if(f<f0) return null; return x0+(f-f0)/(1-f0)*w; }
  function fecha(ago){
    var dias=frac(ago)*365.25, meses=["January","February","March","April","May","June","July","August","September","October","November","December"], dm=[31,28,31,30,31,30,31,31,30,31,30,31];
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
    else { for(var h=0;h<=24;h+=3){ var X2=x0+h/24*w; F.linea(g,[[X2,y-6],[X2,y+6]],tinta,1); F.texto(g,h+":00",X2,y+20,{alin:"center",tam:11,color:t3}); } F.texto(g,"December 31",x0,y-30,{tam:12,color:t3}); }
    EVENTOS_CAL.forEach(function(e,i){ var X=xDe(e[0]); if(X==null) return; F.circulo(g,X,y,i===sel?7:4,i===sel?rojo:boli); });
    var e=EVENTOS_CAL[sel], Xs=xDe(e[0]);
    if(Xs!=null){ F.linea(g,[[Xs,y-10],[Xs,y-40]],rojo,1.5); F.texto(g,e[1],Math.min(c.W-20,Math.max(20,Xs)),y-46,{alin:Xs<c.W*.25?"left":(Xs>c.W*.75?"right":"center"),mano:true,tam:22,color:rojo}); }
    else F.texto(g,"(Turn off zoom to see this event)",c.W/2,y-46,{alin:"center",tam:13,color:t3});
    var real = e[0]>=1e9 ? PF.fmt(e[0]/1e9,1)+" billion years" : (e[0]>=1e6 ? PF.fmt(e[0]/1e6,0)+" million years" : (e[0]>=1e3? PF.fmt(e[0]/1e3,0)+" thousand years": (e[0]>0? e[0]+" years":"now")));
    c.datos('<span>On the calendar: <b>'+fecha(e[0])+'</b></span><span>How long ago: <b>'+real+'</b></span>'+(e[2]?'<span class="ec">'+e[2]+'</span>':''));
  }
  c.nota("An idea popularized by Carl Sagan: if the whole history of the universe lasted one year, each day would equal about 38 million years and each second about 437 years. Humans appear in the last minutes of December 31.");
});

/* ---------- Diagrama de Penrose ---------- */
PFSim.def("penrose",{t:"Penrose–Carter diagrams", ayuda:"Hover over or tap each region; click to fire light rays"}, function(c){
  var g = c.canvas(.62, 320, 520);
  var tipo="mink", rayos=[], hover=null;
  c.select({l:"Espacio-tiempo", ops:[["mink","Minkowski (empty space)"],["schw","Schwarzschild black hole"]], v:tipo, on:function(v){ tipo=v; rayos=[]; hover=null; dibujar(); }});
  c.botones().b("Clear rays", function(){ rayos=[]; dibujar(); });
  var INFO = {
    mink:{
      "i+":["i⁺ · future timelike","Where every massive object ends up after infinite time."],
      "i-":["i⁻ · past timelike","Where every massive object comes from."],
      "i0":["i⁰ · spatial infinity","The points infinitely far away «now»."],
      "J+":["ℐ⁺ · future null infinity","Where light rays escape to."],
      "J-":["ℐ⁻ · past null infinity","Where light arrives from infinity."],
      "int":["All of spacetime","An infinite universe squeezed into a triangle: light rays always travel at 45°."]
    },
    schw:{
      "I":["Region I · our universe","Outside the black hole. From here you can escape to infinity ℐ⁺."],
      "II":["Region II · inside the black hole","Once inside, every path into the future ends at the singularity r = 0. «Inward» becomes a direction of time."],
      "III":["Region III · another universe","In the complete (eternal) mathematical solution, a second exterior appears, unreachable from ours."],
      "IV":["Region IV · white hole","The time reversal of the black hole: nothing can get in. It isn't thought to exist in nature."],
      "sing":["Singularity r = 0","Einstein's equations stop working: quantum gravity is expected to tell us what happens."],
      "hor":["Event horizon r = 2GM/c²","A surface of light: crossing it is easy, coming back is impossible."]
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
      F.texto(g,"r = 0 (singularity)",P(0,1)[0],P(0,1)[1]-12,{alin:"center",tam:12,color:tinta});
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
    else { F.texto(g,"Explore",tx,40,{serif:true,tam:15,color:tinta}); envolver("Hover over or tap a region of the diagram. Click to fire light rays (always at 45°).",tx,64,tw,t3); }
    c.datos(c.n<=3?'<span>A Penrose diagram squeezes an infinite spacetime into a finite figure, keeping the angles of light.</span>':'<span>Conformal transformation: \\(u=\\arctan(t+r),\\ v=\\arctan(t-r)\\); light cones stay at 45°.</span>');
    if(c.n>=4) PF.tex(c.datosEl);
  }
  function etiq(s,x,y,id){ var p=P(x,y); F.texto(g,s,p[0],p[1]+5,{alin:"center",tam:17,color:hover===id?c.col("rojo"):c.col("tinta"),serif:true}); }
  function envolver(t,x,y,w,col){ var pal=t.split(" "), lin=""; g.font='13px "Atkinson",sans-serif'; pal.forEach(function(p){ var pr=lin+p+" "; if(g.measureText(pr).width>w && lin){ F.texto(g,lin,x,y,{tam:13,color:col}); y+=18; lin=p+" "; } else lin=pr; }); F.texto(g,lin,x,y,{tam:13,color:col}); }
  c.nota("In the black hole, any light ray launched in region II ends at the singularity: there's no way to reach ℐ⁺. That is, precisely, being inside a black hole.");
});

/* ---------- Modelo Estándar interactivo (HTML) ---------- */
var PART=[
 {s:"u",n:"up",t:"quark",gen:1,q:"+2/3",sp:"1/2",m:"2.16 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"Together with the down quark it forms protons (uud) and neutrons (udd)."},
 {s:"c",n:"charm",t:"quark",gen:2,q:"+2/3",sp:"1/2",m:"1.27 GeV",a:1974,f:["fuerte","em","debil","higgs"],d:"Discovered in the «November Revolution» of 1974 (the J/ψ particle)."},
 {s:"t",n:"top",t:"quark",gen:3,q:"+2/3",sp:"1/2",m:"172.6 GeV",a:1995,f:["fuerte","em","debil","higgs"],d:"The heaviest known elementary particle: it weighs almost as much as a gold atom. It lives so briefly that it doesn't form hadrons."},
 {s:"d",n:"down",t:"quark",gen:1,q:"−1/3",sp:"1/2",m:"4.70 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"A free neutron decays when a d quark turns into a u (beta decay)."},
 {s:"s",n:"strange",t:"quark",gen:2,q:"−1/3",sp:"1/2",m:"93.5 MeV",a:1968,f:["fuerte","em","debil","higgs"],d:"Present in kaons, discovered in cosmic rays in 1947."},
 {s:"b",n:"bottom",t:"quark",gen:3,q:"−1/3",sp:"1/2",m:"4.18 GeV",a:1977,f:["fuerte","em","debil","higgs"],d:"Key to studying why there's more matter than antimatter."},
 {s:"e",n:"electron",t:"lepton",gen:1,q:"−1",sp:"1/2",m:"0.511 MeV",a:1897,f:["em","debil","higgs"],d:"Discovered by J. J. Thomson in 1897. Responsible for all of chemistry and electricity."},
 {s:"μ",n:"muon",t:"lepton",gen:2,q:"−1",sp:"1/2",m:"105.7 MeV",a:1936,f:["em","debil","higgs"],d:"A «heavy electron». Cosmic-ray muons reach the ground thanks to time dilation."},
 {s:"τ",n:"tau",t:"lepton",gen:3,q:"−1",sp:"1/2",m:"1.777 GeV",a:1975,f:["em","debil","higgs"],d:"The heaviest charged lepton; it lives about 3×10⁻¹³ s."},
 {s:"νₑ",n:"electron neutrino",t:"lepton",gen:1,q:"0",sp:"1/2",m:"< 0.8 eV",a:1956,f:["debil"],d:"They pass through the Earth almost without interacting: trillions go through your body every second, most of them from the Sun."},
 {s:"ν_μ",n:"muon neutrino",t:"lepton",gen:2,q:"0",sp:"1/2",m:"< 0.19 MeV",a:1962,f:["debil"],d:"Neutrinos change type as they travel (oscillations): that's how we know they have mass (Nobel 2015)."},
 {s:"ν_τ",n:"tau neutrino",t:"lepton",gen:3,q:"0",sp:"1/2",m:"< 18.2 MeV",a:2000,f:["debil"],d:"Observed directly by the DONUT experiment at Fermilab in 2000."},
 {s:"g",n:"gluon",t:"boson",gen:0,q:"0",sp:"1",m:"0",a:1979,f:["fuerte"],d:"It carries the strong force and holds quarks together. There are 8 kinds according to their «color charge»."},
 {s:"γ",n:"photon",t:"boson",gen:0,q:"0",sp:"1",m:"0",a:1905,f:["em"],d:"The particle of light and of all electromagnetic radiation."},
 {s:"Z",n:"Z boson",t:"boson",gen:0,q:"0",sp:"1",m:"91.19 GeV",a:1983,f:["debil","higgs"],d:"One of the carriers of the weak force, discovered at CERN."},
 {s:"W",n:"W± boson",t:"boson",gen:0,q:"±1",sp:"1",m:"80.37 GeV",a:1983,f:["em","debil","higgs"],d:"It changes the type of particles: it turns a d quark into a u in beta decay."},
 {s:"H",n:"Higgs boson",t:"higgs",gen:0,q:"0",sp:"0",m:"125.2 GeV",a:2012,f:["higgs","debil"],d:"The excitation of the Higgs field, which gives mass to the W, Z, quarks and charged leptons. Found at the LHC in 2012."}
];
PFSim.def("modelo",{t:"The Standard Model of particles", ayuda:"Tap a particle or filter by force"}, function(c){
  c.lienzo.style.background="none";
  var filtro=null, sel=6;
  var orden=[["u","c","t","g","H"],["d","s","b","γ",null],["e","μ","τ","Z",null],["νₑ","ν_μ","ν_τ","W",null]];
  var bb=c.botones();
  var FU=[["fuerte","Strong force"],["em","Electromagnetic"],["debil","Weak"],["higgs","Couples to the Higgs"]];
  var bts = FU.map(function(f){ var b=bb.b(f[1], function(){ filtro = filtro===f[0]?null:f[0]; bts.forEach(function(x,i){ x.classList.toggle("prim", filtro===FU[i][0]); }); pintar(); }); return b; });
  var cont=PF.el("div",{style:"display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:12px;max-width:640px"});
  var info=PF.el("div",{style:"padding:4px 14px 14px;min-height:110px"});
  c.lienzo.appendChild(cont); c.lienzo.appendChild(info);
  function colT(t){ return t==="quark"?"var(--n4)":(t==="lepton"?"var(--n2)":(t==="boson"?"var(--n5)":"var(--n1)")); }
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
      (c.n>=2?'<p class="chico" style="margin:0">Type: <b>'+p.t+'</b>'+(p.gen?' · generation '+p.gen:'')+' · charge: <b>'+p.q+'</b> · spin: <b>'+p.sp+'</b> · mass: <b>'+p.m+'</b> · discovered/confirmed: <b>'+p.a+'</b></p>':'');
    cont.querySelectorAll("button").forEach(function(b){ b.onclick=function(){ sel=+b.dataset.i; pintar(); }; });
  }
  c.alNivel(pintar);
  pintar();
  c.datos("");
  c.nota("Purple: quarks · green: leptons · red: force bosons · yellow: Higgs. All ordinary matter is made only of the first column: u, d and e. Gravity, dark matter and neutrino masses are left out of this model. Approximate masses from the Particle Data Group.");
});

/* ---------- Diagramas de Feynman (SVG) ---------- */
var PROC = {
  moller:{t:"Scattering of two electrons", d:"Two electrons repel by exchanging a virtual photon.",
    l:[["f",[60,60],[200,110],"e⁻"],["f",[60,300],[200,250],"e⁻"],["f",[200,110],[340,60],"e⁻"],["f",[200,250],[340,300],"e⁻"],["foton",[200,110],[200,250],"γ"]],
    v:[[200,110,"QED vertex: an electron emits a photon. Strength ∝ e (the electron's charge)."],[200,250,"The other electron absorbs the photon and changes direction: that's electric repulsion."]]},
  aniq:{t:"Electron–positron annihilation", d:"Matter and antimatter annihilate and turn into two photons.",
    l:[["f",[60,60],[200,120],"e⁻"],["fa",[60,300],[200,240],"e⁺"],["f",[200,120],[200,240],""],["foton",[200,120],[340,60],"γ"],["foton",[200,240],[340,300],"γ"]],
    v:[[200,120,"The electron emits a photon."],[200,240,"The positron (arrow backward in time) meets the electron and emits the second photon."]]},
  beta:{t:"Beta decay of the neutron", d:"A down quark turns into an up by emitting a W⁻ boson, which decays into an electron and an antineutrino.",
    l:[["f",[60,180],[180,180],"d"],["f",[180,180],[340,90],"u"],["W",[180,180],[260,270],"W⁻"],["f",[260,270],[340,230],"e⁻"],["fa",[260,270],[340,320],"ν̄ₑ"]],
    v:[[180,180,"Weak vertex: the d quark changes «flavor» to u. Only the weak force can do this."],[260,270,"The W⁻ is very heavy (80 GeV): it lives so briefly that it decays right away."]]},
  higgs:{t:"Higgs production at the LHC", d:"Two gluons from the protons fuse (through a loop of top quarks) and create a Higgs boson, which decays into two photons.",
    l:[["gluon",[50,70],[150,130],"g"],["gluon",[50,290],[150,230],"g"],["f",[150,130],[150,230],"t"],["f",[150,230],[220,180],"t"],["f",[220,180],[150,130],"t"],["H",[220,180],[300,180],"H"],["foton",[300,180],[360,90],"γ"],["foton",[300,180],[360,270],"γ"]],
    v:[[150,130,"Gluons don't feel the Higgs directly: they do so through a loop of top quarks, the ones that couple most strongly to the Higgs."],[220,180,"A Higgs comes out of the loop."],[300,180,"The Higgs decays into two photons: that's how it was discovered in 2012 (a «bump» at 125 GeV)."]]}
};
PFSim.def("feynman",{t:"Feynman diagrams", ayuda:"Pick a process and tap the vertices"}, function(c){
  c.lienzo.style.background="none";
  var proc="moller", vsel=-1;
  c.select({l:"Process", ops:Object.keys(PROC).map(function(k){return [k,PROC[k].t];}), v:proc, on:function(v){ proc=v; vsel=-1; pintar(); }});
  var box=PF.el("div",{style:"display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;padding:10px 12px;align-items:center"});
  c.lienzo.appendChild(box);
  function onda(a,b,amp,per){ var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy, ny=ux, n=Math.max(4,Math.round(L/per)), d="M"+a[0]+" "+a[1]; for(var i=1;i<=n*8;i++){ var s=i/(n*8), w=Math.sin(s*n*2*Math.PI)*amp; d+=" L"+(a[0]+dx*s+nx*w).toFixed(1)+" "+(a[1]+dy*s+ny*w).toFixed(1); } return d; }
  function rizo(a,b){ var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, nx=-uy, ny=ux, n=Math.round(L/14), d="M"+a[0]+" "+a[1]; for(var i=1;i<=n*12;i++){ var s=i/(n*12), th=s*n*2*Math.PI; var px=a[0]+dx*s - ux*6*Math.sin(th)*0+ux*7*Math.cos(th)-ux*7, py=a[1]+dy*s+uy*7*Math.cos(th)-uy*7; px+=nx*7*Math.sin(th); py+=ny*7*Math.sin(th); d+=" L"+px.toFixed(1)+" "+py.toFixed(1); } return d; }
  function pintar(){
    var P=PROC[proc], s='<svg viewBox="0 0 400 360" style="width:100%;height:auto;max-height:420px" role="img" aria-label="'+P.t+'"><defs><marker id="fl'+proc+'" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--tinta)"/></marker></defs>';
    s+='<text x="20" y="352" font-size="12" fill="var(--tinta-3)">time →</text>';
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
    var txt='<h5 style="font-family:var(--f-titulo);font-weight:400;font-size:1.2rem;margin:0 0 .4rem">'+P.t+'</h5><p style="margin:0 0 .6rem">'+P.d+'</p>'+(vsel>=0?'<p style="margin:0;padding:.6rem .7rem;border-left:3px solid var(--rojo);background:var(--papel-2)">'+P.v[vsel][2]+'</p>':'<p class="chico">Tap a black dot (a vertex) to see what happens there.</p>')+
      '<p class="chico" style="margin-top:.6rem">Lines: <span style="color:var(--tinta)">— fermion</span> · <span style="color:var(--n1)">∿ photon</span> · <span style="color:var(--n4)">∿ W/Z</span> · <span style="color:var(--n2)">ℓ gluon</span> · <span style="color:var(--n5)">- - Higgs</span></p>';
    box.innerHTML='<div>'+s+'</div><div>'+txt+'</div>';
    box.querySelectorAll("[data-v]").forEach(function(el){ var f=function(){ vsel=+el.getAttribute("data-v"); pintar(); }; el.addEventListener("click",f); el.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" ") f(); }); });
  }
  pintar();
  c.datos("");
  c.nota("Each diagram is a term in a calculation: Feynman invented these rules to turn drawings into integrals. Backward arrows represent antiparticles. Internal particles are «virtual»: they can't be observed directly.");
});

if(window.PF && PF.listo) PFSim.montarTodas(document);
})();
