/* Pura Física! — portada: traducciones, historia con scroll y lógica de la página de inicio */
(function(){
"use strict";
var D = document, W = window, PF = W.PF;
if(!PF) return;
var L = PF.lang === "en" ? 1 : PF.lang === "pt" ? 2 : 0;
function tr(a){ return a[L] || a[0]; }

/* ---------- textos con data-i18n: [inglés, portugués] ---------- */
PF.agregarTextos({
"i.lema":["A journey from a falling apple to the edge of the universe. Here physics isn't just read: you touch it, launch it, switch it on and measure it, at the level you choose.","Uma viagem de uma maçã que cai até a borda do universo. Aqui a física não se lê: se toca, se lança, se acende e se mede, no nível que você escolher."],
"i.cta1":["Start the journey","Começar a viagem"],
"i.cta2":["Go to the lab","Ir ao laboratório"],
"i.etq1":["electron","elétron"],
"i.etq2":["nucleus: almost all the mass","núcleo: quase toda a massa"],
"i.desliza":["scroll to begin","role para começar"],
"h.titulo":["A journey across 41 orders of magnitude","Uma viagem por 41 ordens de grandeza"],
"h.sub":["Seven stops, from what fits in your hand to the smallest and largest things we know. The drawing changes as you scroll.","Sete paradas, do que cabe na sua mão ao menor e ao maior que conhecemos. O desenho muda enquanto você rola."],
"c1.n":["Stop 1 · your hand","Parada 1 · sua mão"],
"c1.t":["It all starts with a question","Tudo começa com uma pergunta"],
"c1.p":["Why does an apple fall? Galileo showed that, without air, everything falls with the same acceleration, and Newton realized that the same force pulling the apple keeps the Moon in orbit. Look at the dots: they mark where the ball is at equal time intervals. They get farther apart each time: it is speeding up.","Por que uma maçã cai? Galileu mostrou que, sem ar, tudo cai com a mesma aceleração, e Newton descobriu que a mesma força que puxa a maçã mantém a Lua em órbita. Veja os pontos: marcam onde está a bola a intervalos iguais de tempo. Ficam cada vez mais separados: ela está acelerando."],
"c1.a":["Explore gravity","Explorar a gravidade"],
"c2.n":["Stop 2 · light","Parada 2 · a luz"],
"c2.t":["White light hides a rainbow","A luz branca esconde um arco-íris"],
"c2.p":["Newton passed sunlight through a prism and split it into colors. Each color is a wave with a different wavelength, from about 400 to 700 nanometers. And visible light is only a thin slice of a spectrum that runs from radio waves to gamma rays.","Newton passou a luz do Sol por um prisma e a separou em cores. Cada cor é uma onda com um comprimento diferente, de cerca de 400 a 700 nanômetros. E a luz visível é só uma fatia de um espectro que vai das ondas de rádio aos raios gama."],
"c2.a":["Explore light","Explorar a luz"],
"c3.n":["Stop 3 · the atom","Parada 3 · o átomo"],
"c3.t":["Inside everything there are atoms","Dentro de tudo há átomos"],
"c3.p":["If you blew an apple up to the size of the Earth, its atoms would be about the size of marbles. Electrons don't orbit like planets: they form clouds of probability, and when they jump from one level to another they give off light of an exact color. That is how we know what stars are made of.","Se você ampliasse uma maçã até o tamanho da Terra, seus átomos seriam como bolinhas de gude. Os elétrons não giram como planetas: formam nuvens de probabilidade e, quando saltam de um nível a outro, emitem luz de uma cor exata. É assim que sabemos do que são feitas as estrelas."],
"c3.a":["Explore quantum physics","Explorar a física quântica"],
"c4.n":["Stop 4 · the nucleus","Parada 4 · o núcleo"],
"c4.t":["Deeper still: quarks and gluons","Mais fundo: quarks e glúons"],
"c4.p":["The nucleus is tens of thousands of times smaller than the atom, yet it holds almost all of its mass. Each proton has three quarks bound by gluons, with a force that does not weaken as you pull them apart: that's why we never see a lone quark. Almost all of your mass comes from the energy of that bond.","O núcleo é dezenas de milhares de vezes menor que o átomo, mas guarda quase toda a sua massa. Cada próton tem três quarks unidos por glúons, com uma força que não enfraquece mesmo quando você os separa: por isso nunca vemos um quark sozinho. Quase toda a sua massa vem da energia dessa união."],
"c4.a":["Explore particles","Explorar as partículas"],
"c5.n":["Stop 5 · spacetime","Parada 5 · o espaço-tempo"],
"c5.t":["Mass bends space and time","A massa curva o espaço e o tempo"],
"c5.p":["Einstein discovered that gravity is not a mysterious pull: the Sun bends spacetime and the Earth follows the curve. Near a mass, time runs slower; your GPS corrects for it every day.","Einstein descobriu que a gravidade não é um puxão misterioso: o Sol curva o espaço-tempo e a Terra segue a curva. Perto de uma massa, o tempo passa mais devagar; seu GPS corrige isso todos os dias."],
"c5.a":["Explore relativity","Explorar a relatividade"],
"c6.n":["Stop 6 · the universe","Parada 6 · o universo"],
"c6.t":["Space itself is stretching","O próprio espaço se estica"],
"c6.p":["Distant galaxies move away from each other because the space between them grows, and it has been doing so for about 13.8 billion years. The matter that stars, planets and you are made of is just 5% of the universe: the rest is dark matter and dark energy, two of today's great mysteries.","As galáxias distantes se afastam umas das outras porque o espaço entre elas cresce, e isso acontece há cerca de 13,8 bilhões de anos. A matéria de que são feitas as estrelas, os planetas e você é apenas 5% do universo: o resto é matéria escura e energia escura, dois dos grandes mistérios de hoje."],
"c6.a":["Explore the cosmos","Explorar o cosmos"],
"c7.n":["Stop 7 · you","Parada 7 · você"],
"c7.t":["Now it's your turn","Agora é a sua vez"],
"c7.p":["Choose how you want everything explained. You can change it whenever you like.","Escolha como quer que expliquemos tudo. Você pode mudar quando quiser."],
"n.t":["One question, five answers","Uma pergunta, cinco respostas"],
"n.p":["That's how the whole site works: the same idea told for every age. Try the colored buttons.","É assim que o site inteiro funciona: a mesma ideia contada para cada idade. Experimente os botões coloridos."],
"n.q":["Why doesn't the Moon fall onto the Earth?","Por que a Lua não cai na Terra?"],
"n.1":["It is falling! But it moves sideways so fast that, as it falls, the Earth «curves away» beneath it. It's like swinging a ball tied to a string: the string is gravity.","Ela está caindo! Mas vai tão rápido de lado que, enquanto cai, a Terra «se curva» embaixo dela. É como girar uma bola amarrada a um barbante: o barbante é a gravidade."],
"n.2":["Earth's gravity pulls on the Moon all the time. Because the Moon also moves sideways at about 1 km/s, instead of crashing it follows a curve around us: an orbit. Newton realized it is the same force that makes an apple fall.","A gravidade da Terra puxa a Lua o tempo todo. Como a Lua também avança de lado a cerca de 1 km/s, em vez de bater ela segue uma curva ao nosso redor: uma órbita. Newton percebeu que é a mesma força que faz uma maçã cair."],
"n.3":["The Moon is in free fall: the gravitational pull \\(F=GMm/r^2\\) acts as the centripetal force, \\(GMm/r^2=mv^2/r\\). With \\(r\\approx384\\,000\\) km you get \\(v\\approx1.02\\) km/s and a period of about 27.3 days, just what is observed.","A Lua está em queda livre: a atração gravitacional \\(F=GMm/r^2\\) atua como força centrípeta, \\(GMm/r^2=mv^2/r\\). Com \\(r\\approx384\\,000\\) km obtém-se \\(v\\approx1{,}02\\) km/s e um período de cerca de 27,3 dias, exatamente o que se observa."],
"n.4":["It's a two-body problem with potential \\(-GMm/r\\): the energy \\(E=\\tfrac12\\mu\\dot r^2+\\frac{L^2}{2\\mu r^2}-\\frac{GMm}{r}\\) is negative, so the orbit is bound (an ellipse with eccentricity ≈ 0.055). Conserved angular momentum keeps \\(r\\) from going to 0.","É um problema de dois corpos com potencial \\(-GMm/r\\): a energia \\(E=\\tfrac12\\mu\\dot r^2+\\frac{L^2}{2\\mu r^2}-\\frac{GMm}{r}\\) é negativa, então a órbita é ligada (uma elipse com excentricidade ≈ 0,055). O momento angular conservado impede que \\(r\\to0\\)."],
"n.5":["In general relativity the Moon follows a geodesic of the spacetime curved by the Earth; corrections to Newton are of order \\(GM/rc^2\\sim10^{-11}\\), but lunar laser ranging measures them (geodetic precession ≈ 19 mas/yr). Tides also transfer angular momentum: the Moon recedes about 3.8 cm per year.","Na relatividade geral a Lua segue uma geodésica do espaço-tempo curvado pela Terra; as correções a Newton são da ordem de \\(GM/rc^2\\sim10^{-11}\\), mas o laser lunar as mede (precessão geodésica ≈ 19 mas/ano). Além disso, as marés transferem momento angular: a Lua se afasta cerca de 3,8 cm por ano."],
"q.t":["What are you curious about today?","Do que você tem curiosidade hoje?"],
"q.s":["Start with a question. Each one leads to the explanation and an experiment.","Comece por uma pergunta. Cada uma leva à explicação e a um experimento."],
"q1.t":["Why is the sky blue?","Por que o céu é azul?"],
"q1.s":["And why sunsets are red, with the same answer.","E por que o pôr do sol é vermelho, com a mesma resposta."],
"q2.t":["What's inside a black hole?","O que há dentro de um buraco negro?"],
"q2.s":["A place not even light escapes, drawn on a map.","Um lugar de onde nem a luz escapa, desenhado num mapa."],
"q3.t":["How does a steel ship float?","Como um navio de aço flutua?"],
"q3.s":["Archimedes' buoyancy, with blocks you can sink.","O empuxo de Arquimedes, com blocos que você pode afundar."],
"q4.t":["Can time run slower?","O tempo pode passar mais devagar?"],
"q4.s":["Yes: your GPS corrects for it every day thanks to Einstein.","Sim: seu GPS corrige isso todos os dias graças a Einstein."],
"q5.t":["What are you made of, deep down?","Do que você é feito, no fundo?"],
"q5.s":["Quarks, electrons and a field that gives mass.","Quarks, elétrons e um campo que dá massa."],
"q6.t":["How does a satellite stay in orbit?","Como um satélite fica em órbita?"],
"q6.s":["It falls, but never lands. Fire Newton's cannon.","Ele cai, mas nunca chega. Dispare o canhão de Newton."],
"q7.t":["Can something be in two places at once?","Algo pode estar em dois lugares ao mesmo tempo?"],
"q7.s":["Send particles one by one through two slits.","Lance partículas uma a uma por duas fendas."],
"q8.t":["How did it all begin?","Como tudo começou?"],
"q8.s":["From the Big Bang to you, squeezed into a single year.","Do Big Bang até você, comprimido em um único ano."],
"d.t":["Experiment of the day","Experimento do dia"],
"d.b":["See all 35 experiments","Ver os 35 experimentos"],
"s.t":["Your stamp book","Seu caderno de selos"],
"s.p":["Every topic ends with a quiz. Get at least 60% right and you earn its stamp. Your progress is saved in this browser.","Cada tema termina com um quiz. Acertando pelo menos 60%, você ganha o selo. Seu progresso fica salvo neste navegador."],
"p.t":["Keep exploring","Continue explorando"],
"p1.k":["Start here","Comece aqui"],"p1.t":["Physics","A física"],"p1.s":["What it is, what it's for, its big branches with explorable maps, and where to study it in Mexico.","O que é, para que serve, seus grandes ramos com mapas exploráveis e onde estudá-la no México."],
"p2.k":["73 moments","73 momentos"],"p2.t":["Timeline","Linha do tempo"],"p2.s":["From Thales of Miletus rubbing amber to the 2026 Nobel Prize.","De Tales de Mileto esfregando âmbar ao Nobel de 2026."],
"p3.k":["30 stories","30 histórias"],"p3.t":["Physicists and their work","Físicos e suas contribuições"],"p3.s":["Who overlapped with whom, and two Mexicans who changed physics.","Quem conviveu com quem, e dois mexicanos que mudaram a física."],
"p4.k":["Game","Jogo"],"p4.t":["Myth or fact?","Mito ou verdade?"],"p4.s":["Lightning never strikes the same place twice? Test yourself.","Um raio nunca cai duas vezes no mesmo lugar? Teste-se."],
"p5.k":["18 discoveries","18 descobertas"],"p5.t":["What physics is your phone made of?","De que física é feito seu celular?"],"p5.s":["Pick an object and see which discoveries made it possible.","Escolha um objeto e veja quais descobertas o tornaram possível."],
"p6.k":["Exercises","Exercícios"],"p6.t":["High-school guide","Guia do ensino médio"],"p6.s":["Problems generated at random that grade themselves, plus a formula sheet.","Problemas gerados ao acaso que se corrigem sozinhos, mais um formulário."],
"r.t":["Quick challenge","Desafio rápido"],
"r.c":["«The eternally incomprehensible thing about the world is its comprehensibility.»","«O eternamente incompreensível do mundo é que ele seja compreensível.»"]
});

/* ---------- textos usados desde JS: [es, en, pt] ---------- */
var X = {
  escala:["Escala","Scale","Escala"],
  hoy:["Hoy: {x}. Mañana habrá otro.","Today: {x}. Tomorrow there'll be another.","Hoje: {x}. Amanhã haverá outro."],
  ganado:["Sello ganado","Stamp earned","Selo ganho"],
  mejor:["Mejor: ","Best: ","Melhor: "],
  pend:["Pendiente","Pending","Pendente"],
  cuenta:["<b>{n}</b> de {m} sellos","<b>{n}</b> of {m} stamps","<b>{n}</b> de {m} selos"],
  reto:["¿Cuánta física sabes ya?","How much physics do you already know?","Quanta física você já sabe?"],
  ir:["Ir a la parada {n}","Go to stop {n}","Ir para a parada {n}"],
  foton:["fotón","photon","fóton"], proton:["protón","proton","próton"], neutron:["neutrón","neutron","nêutron"],
  gluon:["gluones","gluons","glúons"], sol:["Sol","Sun","Sol"], tierra:["Tierra","Earth","Terra"],
  visible:["visible","visible","visível"], radio:["radio","radio","rádio"], gamma:["gamma","gamma","gama"],
  intervalo:["mismo tiempo entre puntos","equal time between dots","mesmo tempo entre pontos"],
  esc:[["núcleo","nucleus","núcleo"],["átomo","atom","átomo"],["luz","light","luz"],["tú","you","você"],["Tierra–Sol","Earth–Sun","Terra–Sol"],["universo","universe","universo"]],
  tu:["tú","you","você"],
  misma:["la misma fuerza","the same force","a mesma força"],
  luzcurva:["la luz de una estrella se curva","starlight bends","a luz de uma estrela se curva"],
  aqui:["estás aquí","you are here","você está aqui"]
};
function x(k,o){ var s=tr(X[k]); if(o) for(var j in o) s=s.split("{"+j+"}").join(o[j]); return s; }

var TEMAS=[["newton",["Leyes de Newton","Newton's laws","Leis de Newton"]],["energia-trabajo",["Energía y trabajo","Energy and work","Energia e trabalho"]],["gravedad",["Gravedad","Gravity","Gravidade"]],["cinematica",["Cinemática","Kinematics","Cinemática"]],["luz-sonido",["Luz y sonido","Light and sound","Luz e som"]],["electromagnetismo",["Electromagnetismo","Electromagnetism","Eletromagnetismo"]],["fuerzas-friccion",["Fuerzas y fricción","Forces and friction","Forças e atrito"]],["conservacion-energia",["Conservación de la energía","Energy conservation","Conservação da energia"]],["circuitos",["Circuitos","Circuits","Circuitos"]],["optica",["Óptica","Optics","Óptica"]],["termodinamica",["Termodinámica","Thermodynamics","Termodinâmica"]],["relatividad",["Relatividad","Relativity","Relatividade"]],["cuantica",["Mecánica cuántica","Quantum mechanics","Mecânica quântica"]],["nuclear",["Física nuclear","Nuclear physics","Física nuclear"]],["cuerdas",["Teoría de cuerdas","String theory","Teoria das cordas"]],["tcc",["Campos cuánticos","Quantum fields","Campos quânticos"]],["gravitacion-cuantica",["Gravitación cuántica","Quantum gravity","Gravitação quântica"]],["particulas",["Partículas","Particles","Partículas"]],["cosmologia",["Cosmología","Cosmology","Cosmologia"]],["penrose",["Agujeros negros","Black holes","Buracos negros"]]];
var DIA=[["pendulo",["El péndulo","The pendulum","O pêndulo"]],["optica",["El banco óptico","The optical bench","A bancada óptica"]],["circuito",["Circuito de focos","Light-bulb circuit","Circuito de lâmpadas"]],["rendija",["La doble rendija","The double slit","A fenda dupla"]],["orbita",["El cañón de Newton","Newton's cannon","O canhão de Newton"]],["espectro",["El espectro de la luz","The spectrum of light","O espectro da luz"]],["fision",["Reacción en cadena","Chain reaction","Reação em cadeia"]],["energia",["La pista de energía","The energy track","A pista de energia"]],["campoE",["El campo eléctrico","The electric field","O campo elétrico"]],["relatividad",["El reloj de luz","The light clock","O relógio de luz"]],["gas",["El gas en un pistón","Gas in a piston","O gás num pistão"]],["atomo",["Los colores del hidrógeno","The colors of hydrogen","As cores do hidrogênio"]],["calendario",["El calendario cósmico","The cosmic calendar","O calendário cósmico"]],["arquimedes",["¿Flota o se hunde?","Float or sink?","Flutua ou afunda?"]]];

var RETO=[
[{"p":"¿Qué cae primero si no hay aire: un martillo o una pluma?","o":["El martillo","La pluma","Caen al mismo tiempo"],"r":2,"e":"Sin aire, todos los cuerpos caen con la misma aceleración. Lo comprobó el astronauta David Scott en la Luna en 1971.","n":1},
 {"p":"¿Qué tipo de onda es el sonido?","o":["Electromagnética","Mecánica longitudinal","Mecánica transversal en el aire"],"r":1,"e":"El sonido necesita un medio y sus partículas vibran en la misma dirección en que viaja la onda.","n":2},
 {"p":"Si duplicas la distancia entre dos cargas, la fuerza eléctrica entre ellas…","o":["se reduce a la mitad","se reduce a la cuarta parte","se duplica"],"r":1,"e":"La ley de Coulomb va como 1/r²: (1/2)² = 1/4.","n":3},
 {"p":"¿Qué aplicación cotidiana necesita correcciones de la relatividad?","o":["El horno de microondas","El GPS","La plancha"],"r":1,"e":"Los relojes de los satélites GPS se adelantan unos 38 microsegundos por día; sin corregirlo, el error crecería kilómetros cada día.","n":3},
 {"p":"Por el teorema de Noether, la conservación de la energía está asociada a…","o":["la invariancia ante rotaciones","la invariancia ante traslaciones en el tiempo","la invariancia de norma U(1)"],"r":1,"e":"Tiempo → energía; espacio → momento; rotaciones → momento angular; norma U(1) → carga.","n":4},
 {"p":"¿Cuál de estos NO forma parte del Modelo Estándar?","o":["El gluón","El gravitón","El bosón de Higgs"],"r":1,"e":"El gravitón es hipotético y la gravedad no está incluida en el Modelo Estándar.","n":5},
 {"p":"¿Aproximadamente qué porcentaje del universo es materia ordinaria?","o":["5 %","27 %","68 %"],"r":0,"e":"Cerca de 5 % materia ordinaria, 27 % materia oscura y 68 % energía oscura.","n":2}],
[{"p":"With no air, which falls first: a hammer or a feather?","o":["The hammer","The feather","They land at the same time"],"r":2,"e":"Without air, all bodies fall with the same acceleration. Astronaut David Scott showed it on the Moon in 1971.","n":1},
 {"p":"What kind of wave is sound?","o":["Electromagnetic","Mechanical, longitudinal","Mechanical, transverse in air"],"r":1,"e":"Sound needs a medium, and its particles vibrate in the same direction the wave travels.","n":2},
 {"p":"If you double the distance between two charges, the electric force between them…","o":["drops to half","drops to a quarter","doubles"],"r":1,"e":"Coulomb's law goes as 1/r²: (1/2)² = 1/4.","n":3},
 {"p":"Which everyday technology needs relativity corrections?","o":["The microwave oven","GPS","The clothes iron"],"r":1,"e":"GPS satellite clocks run ahead by about 38 microseconds per day; uncorrected, the error would grow by kilometers every day.","n":3},
 {"p":"By Noether's theorem, conservation of energy is linked to…","o":["invariance under rotations","invariance under time translations","U(1) gauge invariance"],"r":1,"e":"Time → energy; space → momentum; rotations → angular momentum; U(1) gauge → charge.","n":4},
 {"p":"Which of these is NOT part of the Standard Model?","o":["The gluon","The graviton","The Higgs boson"],"r":1,"e":"The graviton is hypothetical and gravity is not included in the Standard Model.","n":5},
 {"p":"Roughly what fraction of the universe is ordinary matter?","o":["5%","27%","68%"],"r":0,"e":"About 5% ordinary matter, 27% dark matter and 68% dark energy.","n":2}],
[{"p":"Sem ar, o que cai primeiro: um martelo ou uma pena?","o":["O martelo","A pena","Caem ao mesmo tempo"],"r":2,"e":"Sem ar, todos os corpos caem com a mesma aceleração. O astronauta David Scott comprovou isso na Lua em 1971.","n":1},
 {"p":"Que tipo de onda é o som?","o":["Eletromagnética","Mecânica longitudinal","Mecânica transversal no ar"],"r":1,"e":"O som precisa de um meio, e suas partículas vibram na mesma direção em que a onda viaja.","n":2},
 {"p":"Se você dobra a distância entre duas cargas, a força elétrica entre elas…","o":["cai pela metade","cai para um quarto","dobra"],"r":1,"e":"A lei de Coulomb vai como 1/r²: (1/2)² = 1/4.","n":3},
 {"p":"Que tecnologia do dia a dia precisa de correções da relatividade?","o":["O micro-ondas","O GPS","O ferro de passar"],"r":1,"e":"Os relógios dos satélites GPS adiantam cerca de 38 microssegundos por dia; sem correção, o erro cresceria quilômetros por dia.","n":3},
 {"p":"Pelo teorema de Noether, a conservação da energia está ligada à…","o":["invariância sob rotações","invariância sob translações no tempo","invariância de calibre U(1)"],"r":1,"e":"Tempo → energia; espaço → momento; rotações → momento angular; calibre U(1) → carga.","n":4},
 {"p":"Qual destes NÃO faz parte do Modelo Padrão?","o":["O glúon","O gráviton","O bóson de Higgs"],"r":1,"e":"O gráviton é hipotético e a gravidade não está incluída no Modelo Padrão.","n":5},
 {"p":"Aproximadamente que porcentagem do universo é matéria comum?","o":["5%","27%","68%"],"r":0,"e":"Cerca de 5% de matéria comum, 27% de matéria escura e 68% de energia escura.","n":2}]
];

/* ---------- montaje de la portada (antes de que PF arranque) ---------- */
var reduce = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
var atomo = D.querySelector(".intro-atomo svg");
if(atomo && reduce && atomo.pauseAnimations) try{ atomo.pauseAnimations(); }catch(e){}

var caja = D.getElementById("reto-caja");
if(caja){
  var q = D.createElement("div"); q.className="quiz"; q.setAttribute("data-id","reto-inicio"); q.setAttribute("data-titulo", x("reto"));
  var js = D.createElement("script"); js.type="application/json"; js.textContent = JSON.stringify(RETO[L]);
  q.appendChild(js); caja.appendChild(q);
}
var TEMASURL = "Temas%20de%20inter%C3%A9s%20en%20la%20f%C3%ADsica.html", LAB = "Laboratorio.html";
var hoy = new Date(), dk = Math.floor((hoy - new Date(hoy.getFullYear(),0,0))/864e5) % DIA.length, dx = DIA[dk];
var dt = D.getElementById("dia-txt"); if(dt) dt.textContent = x("hoy",{x:tr(dx[1])});
var dl = D.getElementById("dia-lab"); if(dl) dl.href = LAB+"#sim="+dx[0];
var ds = D.getElementById("dia-sim"); if(ds) ds.innerHTML = '<div class="sim" data-sim="'+dx[0]+'"></div>';

function sellos(){
  var g = D.getElementById("sellos-grid"); if(!g) return;
  var n = 0;
  g.innerHTML = TEMAS.map(function(t,i){
    var r = PF.sello(t[0]), ok = r!=null && r>=.6; if(ok) n++;
    return '<a class="sello-c'+(ok?' ok':'')+'" data-revela style="--i:'+(i%5)+'" href="'+TEMASURL+'#'+t[0]+'"><span class="sello-m" aria-hidden="true">'+(ok?'✓':'')+'</span><span>'+tr(t[1])+'</span><small>'+(ok?x("ganado"):(r!=null?x("mejor")+Math.round(r*100)+' %':x("pend")))+'</small></a>';
  }).join("");
  D.getElementById("sellos-cuenta").innerHTML = x("cuenta",{n:n,m:TEMAS.length});
  if(PF.revelar) PF.revelar(g); if(PF.inclinar) PF.inclinar(g);
}

D.addEventListener("pf:listo", function(){
  var r = D.querySelector("[data-regla]"); if(r){ r.innerHTML = PF.regla(); PF.montar(r); }
  sellos(); D.addEventListener("pf:progreso", sellos);
  historia();
});

/* ---------- historia con scroll ---------- */
function historia(){
  var sec = D.querySelector(".historia"); if(!sec) return;
  var lienzo = sec.querySelector(".historia__lienzo"), cv = lienzo.querySelector("canvas"), c = cv.getContext("2d");
  var caps = [].slice.call(sec.querySelectorAll(".capitulo")), N = caps.length;
  var escala = lienzo.querySelector(".escala"), pts = lienzo.querySelector(".puntos");
  var w = 0, h = 0, dpr = 1, cur = -1, prev = -1, tCambio = 0, dir = 1, prog = 0, visible = false, raf = 0, t0 = performance.now();
  var C = {};
  function colores(){ ["tinta","tinta-2","tinta-3","papel","hoja","linea","boli","rojo","verde","marca","n1","n2","n3","n4","n5"].forEach(function(k){ C[k] = PF.color(k) || "#000"; }); }
  colores();

  caps.forEach(function(cap,i){
    var b = D.createElement("button"); b.type = "button";
    var h3 = cap.querySelector("h3");
    b.setAttribute("aria-label", x("ir",{n:i+1}) + (h3 ? ": "+h3.textContent : ""));
    b.addEventListener("click", function(){ cap.scrollIntoView({behavior: reduce?"auto":"smooth", block:"center"}); });
    pts.appendChild(b);
  });
  var botones = [].slice.call(pts.children);

  function medir(){
    var r = lienzo.getBoundingClientRect(); dpr = Math.min(W.devicePixelRatio||1, 2);
    w = r.width; h = r.height; cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr);
    dibujar();
  }
  function estado(){
    var vh = W.innerHeight, mid = vh*0.55, a = 0, p = 0;
    for(var i=0;i<N;i++){
      var r = caps[i].getBoundingClientRect();
      if(r.top <= mid){ a = i; p = Math.max(0, Math.min(1, (mid - r.top)/r.height)); }
    }
    prog = p;
    if(a !== cur){
      dir = a > cur ? 1 : -1; prev = cur; cur = a; tCambio = performance.now();
      caps.forEach(function(k,i){ k.classList.toggle("activo", i===a); });
      botones.forEach(function(b,i){ b.setAttribute("aria-current", i===a ? "true" : "false"); });
      var e = caps[a].getAttribute("data-esc");
      escala.innerHTML = x("escala")+" ≈ <b>"+(e==="tú" ? x("tu") : e)+"</b>";
    }
  }

  /* --- utilidades de dibujo: coordenadas normalizadas, unidad u --- */
  var cx, cy, u, movil, oscuro;
  function marco(){
    movil = W.innerWidth < 980;
    var alto = movil ? h*0.56 : h;
    cx = w/2; cy = movil ? alto*0.5 + 14 : h/2;
    u = Math.min(w*0.46, alto*0.44);
    oscuro = D.documentElement.getAttribute("data-tema") === "pizarron";
  }
  function P(xn,yn){ return [cx + xn*u, cy + yn*u]; }
  function hex(cv){ var m = /^#?([0-9a-f]{6})$/i.exec((cv||"").trim()); if(!m) return [128,128,128]; var n=parseInt(m[1],16); return [n>>16&255,n>>8&255,n&255]; }
  function rgba(cv,a){ var k=hex(cv); return "rgba("+k[0]+","+k[1]+","+k[2]+","+a+")"; }
  function mezcla(a,b,t){ var x=hex(a), y=hex(b); return "rgb("+[0,1,2].map(function(i){return Math.round(x[i]+(y[i]-x[i])*t);}).join(",")+")"; }
  function circ(xn,yn,r,fill,stroke,lw){ var p=P(xn,yn); c.beginPath(); c.arc(p[0],p[1],Math.max(.5,r*u),0,7); if(fill){c.fillStyle=fill;c.fill();} if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||2;c.stroke();} }
  function esfera(xn,yn,r,col){
    var p=P(xn,yn), R=Math.max(1,r*u);
    var g=c.createRadialGradient(p[0]-R*.38,p[1]-R*.42,R*.08,p[0],p[1],R);
    g.addColorStop(0,mezcla(col,"#ffffff",.6)); g.addColorStop(.42,col); g.addColorStop(1,mezcla(col,"#000000",.5));
    c.fillStyle=g; c.beginPath(); c.arc(p[0],p[1],R,0,7); c.fill();
  }
  function brillo(xn,yn,r,col,a){
    var p=P(xn,yn), R=Math.max(1,r*u), g=c.createRadialGradient(p[0],p[1],0,p[0],p[1],R);
    g.addColorStop(0,rgba(col,a==null?.55:a)); g.addColorStop(1,rgba(col,0));
    c.fillStyle=g; c.beginPath(); c.arc(p[0],p[1],R,0,7); c.fill();
  }
  function linea(pts,color,lw,dash){ c.beginPath(); pts.forEach(function(q,i){ var p=P(q[0],q[1]); if(i) c.lineTo(p[0],p[1]); else c.moveTo(p[0],p[1]); }); c.strokeStyle=color; c.lineWidth=lw||2; c.setLineDash(dash||[]); c.lineCap="round"; c.lineJoin="round"; c.stroke(); c.setLineDash([]); }
  function texto(s,xn,yn,color,tam,al,fuente,peso){ var p=P(xn,yn); c.fillStyle=color; c.font=(peso||"")+" "+(tam||18)+"px "+(fuente||"Caveat, cursive"); c.textAlign=al||"center"; c.textBaseline="middle"; c.fillText(s,p[0],p[1]); }
  function flecha(x1,y1,x2,y2,color,lw){ var L=Math.hypot(x2-x1,y2-y1); if(L<.01) return; linea([[x1,y1],[x2,y2]],color,lw); var a=Math.atan2(y2-y1,x2-x1), k=Math.min(.06,L*.45); c.beginPath(); var p=P(x2,y2), q1=P(x2-k*Math.cos(a-.42),y2-k*Math.sin(a-.42)), q2=P(x2-k*Math.cos(a+.42),y2-k*Math.sin(a+.42)); c.moveTo(p[0],p[1]); c.lineTo(q1[0],q1[1]); c.lineTo(q2[0],q2[1]); c.closePath(); c.fillStyle=color; c.fill(); }
  function lam(nm,a){ var r=0,g=0,b=0; if(nm<440){r=-(nm-440)/60;b=1;} else if(nm<490){g=(nm-440)/50;b=1;} else if(nm<510){g=1;b=-(nm-510)/20;} else if(nm<580){r=(nm-510)/70;g=1;} else if(nm<645){r=1;g=-(nm-645)/65;} else r=1; var f=nm<420?.3+.7*(nm-380)/40:(nm>700?.3+.7*(780-nm)/80:1); return "rgba("+Math.round(255*r*f)+","+Math.round(255*g*f)+","+Math.round(255*b*f)+","+(a==null?1:a)+")"; }
  function rnd(i){ var s=Math.sin(i*127.1+311.7)*43758.5453; return s-Math.floor(s); }
  function mezclaModo(){ c.globalCompositeOperation = oscuro ? "lighter" : "source-over"; }
  function normal(){ c.globalCompositeOperation = "source-over"; }
  var FM="Atkinson Hyperlegible, sans-serif";

  /* --- escenas: (t segundos, p progreso 0..1) --- */
  var ESC = [
  /* 1 · caída: pelota lanzada desde una repisa, estroboscopia y la Luna */
  function caida(t,p){
    var y0=-.5, x0=-.74, vx=.5, g=1.05, T=1.6, per=T+1.25, dt=T/8;
    // mesa de madera
    var suelo=P(0,.92), ta=P(-1.15,y0+.045), tb=P(x0+.05,y0+.1);
    var gm=c.createLinearGradient(0,ta[1],0,tb[1]); gm.addColorStop(0,mezcla(C.n1,"#ffffff",.35)); gm.addColorStop(1,mezcla(C.n1,"#000000",.3));
    c.fillStyle=gm; c.fillRect(ta[0],ta[1],tb[0]-ta[0],tb[1]-ta[1]);
    c.fillStyle=rgba("#ffffff",.35); c.fillRect(ta[0],ta[1],tb[0]-ta[0],1.5);
    [x0-.04,-1.02].forEach(function(lx){ var l1=P(lx-.022,y0+.1), l2=P(lx+.022,.92), gl=c.createLinearGradient(l1[0],0,l2[0],0); gl.addColorStop(0,mezcla(C.n1,"#000000",.15)); gl.addColorStop(1,mezcla(C.n1,"#000000",.4)); c.fillStyle=gl; c.fillRect(l1[0],l1[1],l2[0]-l1[0],l2[1]-l1[1]); });
    brillo(x0-.04,.94,.12,C.tinta,.12);
    // suelo
    var gs=c.createLinearGradient(0,suelo[1],0,suelo[1]+.25*u); gs.addColorStop(0,rgba(C.verde,.35)); gs.addColorStop(1,rgba(C.verde,0));
    c.fillStyle=gs; c.fillRect(0,suelo[1],w,.25*u); linea([[-1.15,.92],[1.15,.92]],C.verde,2.5);
    var tt = reduce ? T : (t % per), tv = Math.min(tt, T), fade = tt>T+.85 ? Math.max(0,1-(tt-T-.85)/.35) : 1;
    var ga=c.globalAlpha; c.globalAlpha=ga*fade;
    var ys=[];
    for(var k=0;k<=8;k++){ var s=k*dt; if(s>tv+1e-6) break; var bx=x0+vx*s*1.9, by=y0+.5*g*s*s; ys.push(by);
      linea([[bx,y0-.04],[bx,.92]],rgba(C["tinta-3"],.35),1,[2,5]);
      if(k>0){ var gp=P(bx,by), R=.042*u; c.beginPath(); c.arc(gp[0],gp[1],R,0,7); c.fillStyle=rgba(C.rojo,.16); c.fill(); c.strokeStyle=rgba(C.rojo,.55); c.lineWidth=1.4; c.stroke(); }
    }
    // separaciones verticales 1, 3, 5, 7… (Galileo)
    var xr=.9;
    for(var k=1;k<ys.length;k++){ var ya=ys[k-1], yb=ys[k]; linea([[xr-.03,ya],[xr,ya],[xr,yb],[xr-.03,yb]],C["tinta-2"],1.4); texto(String(2*k-1),xr+.06,(ya+yb)/2,C["tinta-2"],movil?13:15,"left",FM,"700"); }
    if(ys.length>2) texto("Δy ∝ 1, 3, 5, 7…",xr+.08,-.8,C["tinta-2"],movil?14:17,"right");
    var bx=x0+vx*tv*1.9, by=y0+.5*g*tv*tv, vy=g*tv;
    brillo(bx,by+.06,.08,C.tinta,.18);
    esfera(bx,by,.05,C.rojo);
    if(p>.12 || reduce){
      flecha(bx,by,bx+.26,by,C.boli,2.6); texto("vₓ",bx+.3,by-.05,C.boli,movil?16:19,"left",FM);
      var Ly=Math.min(.5,.07+vy*.3); flecha(bx,by,bx,by+Ly,C.verde,2.6); texto("v",bx+.04,by+Ly,C.verde,movil?16:19,"left",FM); texto("y",bx+.04+(movil?.05:.045),by+Ly+.025,C.verde,movil?11:13,"left",FM);
    }
    c.globalAlpha=ga;
    texto(x("intervalo"),-.1,-.86,C["tinta-2"],movil?16:20);
    // la misma fuerza mantiene a la Luna
    var ex=.45, ey=-.52, er=.11, ang=t*.35;
    linea((function(){ var q=[]; for(var k=0;k<=60;k++){ var a2=k/60*6.283; q.push([ex+.3*Math.cos(a2),ey+.12*Math.sin(a2)]); } return q; })(),rgba(C["tinta-3"],.6),1.2,[3,5]);
    var mx=ex+.3*Math.cos(ang), my=ey+.12*Math.sin(ang), atras=Math.sin(ang)<0;
    if(atras){ esfera(mx,my,.032,"#9aa3ad"); }
    brillo(ex,ey,er*1.6,C.boli,.25); esfera(ex,ey,er,mezcla(C.boli,C.verde,.25));
    var ep=P(ex,ey); c.save(); c.beginPath(); c.arc(ep[0],ep[1],er*u,0,7); c.clip(); c.fillStyle=rgba(C.verde,.55);
    for(var k=0;k<4;k++){ var q=P(ex-.06+.07*k*Math.cos(k*1.7)+((t*.03)%0.2),ey-.04+.05*Math.sin(k*2.3)); c.beginPath(); c.ellipse(q[0],q[1],(.03+.012*k)*u,.022*u,k,0,7); c.fill(); }
    c.restore();
    if(!atras){ esfera(mx,my,.032,"#9aa3ad"); }
    flecha(mx,my,mx+(ex-mx)*.38,my+(ey-my)*.38,C.rojo,2); texto(x("misma"),ex,ey+.24,C.rojo,movil?15:18);
  },
  /* 2 · luz: prisma con refracción real (ley de Snell) y espectro electromagnético */
  function luz(t,p){
    var A=[0,-.5], B=[-.48,.32], Cc=[.48,.32];
    function nidx(nm){ var l=nm/1000; return 1.44+.0234/(l*l); }
    function norm(v){ var L=Math.hypot(v[0],v[1]); return [v[0]/L,v[1]/L]; }
    function refr(d,n,eta){ var ci=-(d[0]*n[0]+d[1]*n[1]), k=1-eta*eta*(1-ci*ci); if(k<0) return null; var f=eta*ci-Math.sqrt(k); return norm([eta*d[0]+f*n[0],eta*d[1]+f*n[1]]); }
    function corte(o,d,a,b){ var ex=b[0]-a[0], ey=b[1]-a[1], den=d[0]*ey-d[1]*ex; if(Math.abs(den)<1e-9) return null; var s=((a[0]-o[0])*ey-(a[1]-o[1])*ex)/den, r=((a[0]-o[0])*d[1]-(a[1]-o[1])*d[0])/den; if(s<=1e-6||r<0||r>1) return null; return [o[0]+d[0]*s,o[1]+d[1]*s]; }
    var nAB=norm([-(B[1]-A[1]),B[0]-A[0]]); if(nAB[0]>0) nAB=[-nAB[0],-nAB[1]];
    var nAC=norm([Cc[1]-A[1],-(Cc[0]-A[0])]); if(nAC[0]<0) nAC=[-nAC[0],-nAC[1]];
    var S=[-1.2,.02], d0=norm([1,-.2]), P1=corte(S,d0,A,B);
    // vidrio
    var pa=P(A[0],A[1]), pb=P(B[0],B[1]), pc=P(Cc[0],Cc[1]);
    var gv=c.createLinearGradient(pb[0],pb[1],pc[0],pa[1]); gv.addColorStop(0,rgba(C.boli,oscuro?.18:.10)); gv.addColorStop(.6,rgba(C.hoja,oscuro?.12:.55)); gv.addColorStop(1,rgba(C.boli,oscuro?.25:.14));
    c.beginPath(); c.moveTo(pa[0],pa[1]); c.lineTo(pb[0],pb[1]); c.lineTo(pc[0],pc[1]); c.closePath(); c.fillStyle=gv; c.fill();
    c.strokeStyle=rgba(C.tinta,.75); c.lineWidth=2; c.stroke();
    linea([[A[0]-.02,A[1]+.06],[B[0]+.07,B[1]-.05]],rgba("#ffffff",oscuro?.25:.9),2.5);
    // haz blanco
    if(P1){
      var pS=P(S[0],S[1]), pP=P(P1[0],P1[1]);
      c.save(); mezclaModo();
      var gb=c.createLinearGradient(pS[0],pS[1],pP[0],pP[1]); gb.addColorStop(0,rgba(oscuro?"#ffffff":C.tinta,0)); gb.addColorStop(1,rgba(oscuro?"#ffffff":C.tinta,oscuro?.9:.8));
      c.strokeStyle=gb; c.lineWidth=5; c.beginPath(); c.moveTo(pS[0],pS[1]); c.lineTo(pP[0],pP[1]); c.stroke();
      c.setLineDash([3,14]); c.lineDashOffset=reduce?0:-(t*70)%17; c.strokeStyle=rgba(oscuro?"#ffffff":C.hoja,.9); c.lineWidth=2.5; c.stroke(); c.setLineDash([]);
      for(var i=0;i<=36;i++){
        var nm=400+i*300/36, n=nidx(nm), d1=refr(d0,nAB,1/n); if(!d1) continue;
        var P2=corte(P1,d1,A,Cc); if(!P2) continue;
        var d2=refr(d1,[-nAC[0],-nAC[1]],n); if(!d2) continue;
        var fin=[P2[0]+d2[0]*1.6,P2[1]+d2[1]*1.6];
        var q1=P(P1[0],P1[1]), q2=P(P2[0],P2[1]), q3=P(fin[0],fin[1]);
        c.strokeStyle=lam(nm,oscuro?.32:.22); c.lineWidth=1.4; c.beginPath(); c.moveTo(q1[0],q1[1]); c.lineTo(q2[0],q2[1]); c.stroke();
        var gr=c.createLinearGradient(q2[0],q2[1],q3[0],q3[1]); gr.addColorStop(0,lam(nm,oscuro?.75:.85)); gr.addColorStop(1,lam(nm,0));
        c.strokeStyle=gr; c.lineWidth=movil?3:4.5; c.beginPath(); c.moveTo(q2[0],q2[1]); c.lineTo(q3[0],q3[1]); c.stroke();
      }
      c.restore();
      brillo(P1[0],P1[1],.07,oscuro?"#ffffff":C.boli,.5);
    }
    // espectro electromagnético: una onda que se encoge de las ondas de radio a los gamma
    var al=reduce?1:Math.min(1,Math.max(0,(p-.12)*3.2));
    if(al>0){
      var ga=c.globalAlpha; c.globalAlpha=ga*al;
      var y=movil?.6:.72, x1=-.95, x2=.95, N=700, vis0=.16, vis1=.3, pts=[];
      c.lineWidth=2.2;
      for(var k=0;k<N;k++){
        var s=k/(N-1), s2=(k+1)/(N-1), ph=function(z){ return 4*Math.exp(3.6*z)-4; };
        var xa=x1+(x2-x1)*s, xb=x1+(x2-x1)*s2, ya=y-.06*Math.sin(ph(s)-(reduce?0:t*3)), yb=y-.06*Math.sin(ph(s2)-(reduce?0:t*3));
        var col = s>vis0 && s<vis1 ? lam(700-(s-vis0)/(vis1-vis0)*300) : C["tinta-3"];
        linea([[xa,ya],[xb,yb]],col,2.2);
      }
      var etq=[[x("radio"),.03],["micro",.1],["IR",.165],["UV",.37],["X",.56],[x("gamma"),.86]];
      etq.forEach(function(q,i){ texto(q[0],x1+(x2-x1)*q[1],y+.16,C["tinta-2"],movil?12:15,"center",FM); });
      texto(x("visible"),x1+(x2-x1)*.23,y-.15,C.tinta,movil?15:18);
      texto("λ ↓",x2,y-.16,C["tinta-2"],movil?13:15,"right",FM);
      c.globalAlpha=ga;
    }
  },
  /* 3 · átomo de hidrógeno: nube de probabilidad, niveles de Bohr y emisión H-alfa */
  function atomo(t,p){
    var R=[.22,.46,.72];
    var nc=P(0,0), gc=c.createRadialGradient(nc[0],nc[1],0,nc[0],nc[1],.95*u);
    gc.addColorStop(0,rgba(C.boli,oscuro?.32:.22)); gc.addColorStop(.35,rgba(C.boli,oscuro?.16:.10)); gc.addColorStop(.55,rgba(C.boli,oscuro?.05:.03)); gc.addColorStop(.7,rgba(C.boli,oscuro?.12:.07)); gc.addColorStop(1,rgba(C.boli,0));
    c.fillStyle=gc; c.beginPath(); c.arc(nc[0],nc[1],.95*u,0,7); c.fill();
    for(var i=0;i<260;i++){ var rr=(.12+.8*Math.pow(rnd(i),.8)), aa=rnd(i+9)*6.283+(reduce?0:t*.05*(i%3-1)); var pp=P(rr*Math.cos(aa),rr*Math.sin(aa)); c.fillStyle=rgba(C.boli,.18+.25*rnd(i+3)); c.fillRect(pp[0],pp[1],1.6,1.6); }
    R.forEach(function(r,k){ var q=P(0,0); c.beginPath(); c.arc(q[0],q[1],r*u,0,7); c.strokeStyle=rgba(C["tinta-3"],.7); c.lineWidth=1.2; c.setLineDash([4,6]); c.stroke(); c.setLineDash([]); texto("n = "+(k+1),r*.71+.02,-r*.71-.03,C["tinta-2"],movil?12:14,"left",FM); });
    brillo(0,0,.16,C.rojo,.45); esfera(0,0,.055,C.rojo);
    var per=4.2, s=reduce?2.6:(t%per), salto=s>2.2&&s<2.6, r = s<2.2 ? R[2] : (s<2.6 ? R[2]-(s-2.2)/.4*(R[2]-R[1]) : R[1]);
    var ang=t*(s<2.2?.9:1.4)+.6;
    var ex=r*Math.cos(ang), ey=r*Math.sin(ang);
    brillo(ex,ey,.09,C.boli,.6); esfera(ex,ey,.032,mezcla(C.boli,"#ffffff",.15));
    if(s>2.2){
      var d=(s-2.2)*.55, a0=ang, ox=R[2]*.9*Math.cos(a0), oy=R[2]*.9*Math.sin(a0), pts=[];
      for(var k=0;k<=70;k++){ var q=k/70*.5, env=Math.exp(-Math.pow((q-.25)/.12,2)), per2=Math.sin(q*70-(reduce?0:t*24))*.045*env; pts.push([ox+(d+q)*Math.cos(a0)-per2*Math.sin(a0), oy+(d+q)*Math.sin(a0)+per2*Math.cos(a0)]); }
      if(d<1){ c.save(); mezclaModo(); linea(pts,lam(656),2.6); c.restore(); var tx=ox+(d+.6)*Math.cos(a0), ty=oy+(d+.6)*Math.sin(a0); if(Math.abs(tx)<1&&Math.abs(ty)<.95) texto(x("foton")+" · 656 nm",tx,ty-.06,lam(656),movil?15:18); }
    }
    if(!movil){
      // diagrama de niveles de energía
      var bx=.78, lv=[[1,-13.6],[2,-3.4],[3,-1.51],[4,-.85]], Y=function(E){ return .72-(E+13.6)/13.6*1.3; };
      lv.forEach(function(q){ linea([[bx,Y(q[1])],[bx+.15,Y(q[1])]],C["tinta-2"],1.6); texto(String(q[1]).replace("-","−"),bx-.02,Y(q[1]),C["tinta-3"],11,"right",FM); });
      linea([[bx,Y(0)],[bx+.15,Y(0)]],C["tinta-3"],1,[3,3]); texto("eV",bx+.075,Y(0)-.06,C["tinta-3"],11,"center",FM);
      if(s>2.2) flecha(bx+.075,Y(-1.51),bx+.075,Y(-3.4),lam(656),2.4);
    }
  },
  /* 4 · núcleo → protón: nucleones sombreados y quarks unidos por tubos de gluones */
  function nucleo(t,p){
    var z=Math.min(1,Math.max(0,(p-.18)/.32)); if(reduce) z=p>.35?1:0; var zn=Math.min(1,z*1.7), zp=Math.max(0,(z-.35)/.65);
    var ga=c.globalAlpha;
    if(zn<1){
      c.globalAlpha=ga*(1-zn);
      var N=[]; for(var i=0;i<16;i++){ var a=i*2.39996, r=.1*Math.sqrt(i+.5), jx=reduce?0:Math.sin(t*6+i)*.008, jy=reduce?0:Math.cos(t*5+i*2)*.008, zz=rnd(i+40); N.push([(r*Math.cos(a)+jx)*(1+zn*1.6),(r*Math.sin(a)*.92+jy)*(1+zn*1.6),zz,i]); }
      N.sort(function(a,b){ return a[2]-b[2]; });
      brillo(0,0,.6,C.rojo,.12);
      N.forEach(function(q){ esfera(q[0],q[1],.105*(1+zn*1.6),q[3]%2?C.rojo:"#8e9aab"); });
      esfera(-.7,-.66,.045,C.rojo); texto(x("proton"),-.62,-.66,C.rojo,movil?16:20,"left");
      esfera(.38,-.66,.045,"#8e9aab"); texto(x("neutron"),.46,-.66,C["tinta-2"],movil?16:20,"left");
    }
    if(zp>0){
      c.globalAlpha=ga*zp;
      var Rp=.78*(.6+.4*zp), q0=P(0,0), gp=c.createRadialGradient(q0[0],q0[1],Rp*u*.2,q0[0],q0[1],Rp*u);
      gp.addColorStop(0,rgba(C.rojo,oscuro?.10:.06)); gp.addColorStop(.85,rgba(C.rojo,oscuro?.16:.10)); gp.addColorStop(1,rgba(C.rojo,.0));
      c.fillStyle=gp; c.beginPath(); c.arc(q0[0],q0[1],Rp*u,0,7); c.fill();
      circ(0,0,Rp,null,rgba(C.rojo,.55),1.5);
      // mar de pares quark–antiquark virtuales
      for(var i=0;i<26;i++){ var ph=(t*.7+rnd(i))%1, al=Math.sin(ph*Math.PI), a=rnd(i+7)*6.283+i, r=.18+rnd(i+70)*.5; var px=r*Math.cos(a), py=r*Math.sin(a); c.globalAlpha=ga*zp*al*.7; circ(px-.012,py,.011,C.n4); circ(px+.012,py,.011,mezcla(C.n4,"#ffffff",.5)); }
      c.globalAlpha=ga*zp;
      var qc=[C.rojo,C.verde,C.boli], Q=[];
      for(var k=0;k<3;k++){ var a=k*2.094+(reduce?0:t*.5), rr=.34+(reduce?0:Math.sin(t*2.1+k*1.7)*.06); Q.push([rr*Math.cos(a),rr*Math.sin(a)]); }
      for(var k=0;k<3;k++){ var A2=Q[k], B2=Q[(k+1)%3], pts=[], dx=B2[0]-A2[0], dy=B2[1]-A2[1], L=Math.hypot(dx,dy), nx=-dy/L, ny=dx/L;
        for(var j=0;j<=120;j++){ var s=j/120, ph=s*Math.PI*2*9+(reduce?0:t*9), amp=.028*Math.sin(Math.PI*s); pts.push([A2[0]+dx*s+nx*amp*Math.sin(ph)+dx/L*amp*.6*Math.cos(ph), A2[1]+dy*s+ny*amp*Math.sin(ph)+dy/L*amp*.6*Math.cos(ph)]); }
        brillo((A2[0]+B2[0])/2,(A2[1]+B2[1])/2,.22,C.n1,.12);
        linea(pts,C.n1,1.8); }
      Q.forEach(function(q,k){ brillo(q[0],q[1],.17,qc[k],.35); esfera(q[0],q[1],.085,qc[k]); texto(k<2?"u":"d",q[0],q[1]+.005,"#ffffff",movil?16:20,"center",FM,"700"); });
      texto(x("proton")+" = uud",0,-.92,C.rojo,movil?18:22); texto(x("gluon"),.6,.8,C.n1,movil?17:20);
    }
    c.globalAlpha=ga;
  },
  /* 5 · espacio-tiempo: malla curvada, el Sol, la Tierra y la luz que se desvía */
  function espaciotiempo(t,p){
    var M=.6+.3*p, rot=reduce?.6:t*.28;
    function alt(xx,zz){ var r=Math.hypot(xx,zz); return -M*.2/(r*r*3+.24); }
    function pr(xx,zz){ var y=alt(xx,zz); return [xx*1.02, -.2+zz*.46 - y*.95]; }
    var s0=pr(0,0), sp=P(s0[0],s0[1]), gw=c.createRadialGradient(sp[0],sp[1],0,sp[0],sp[1],.9*u);
    gw.addColorStop(0,rgba(C.tinta,oscuro?.25:.10)); gw.addColorStop(1,rgba(C.tinta,0)); c.fillStyle=gw; c.beginPath(); c.ellipse(sp[0],sp[1]-.05*u,.95*u,.45*u,0,0,7); c.fill();
    var n=18;
    for(var i=0;i<=n;i++){ var a=-1+2*i/n, l1=[], l2=[];
      for(var j=0;j<=48;j++){ var b=-1+2*j/48; l1.push(pr(a,b)); l2.push(pr(b,a)); }
      var prof=Math.abs(a)<.3?.85:.5; linea(l1,rgba(C["tinta-3"],prof),1); linea(l2,rgba(C["tinta-3"],prof),1); }
    var R=.55, orb=[]; for(var k=0;k<=80;k++){ var a2=k/80*6.283; orb.push(pr(R*Math.cos(a2),R*Math.sin(a2)*.9)); } linea(orb,rgba(C.boli,.7),1.5,[5,6]);
    var ex=R*Math.cos(rot), ez=R*Math.sin(rot)*.9, e=pr(ex,ez), detras=ez<0;
    function tierra(){ brillo(e[0],e[1]-.05,.09,C.boli,.4); esfera(e[0],e[1]-.05,.045,mezcla(C.boli,C.verde,.3)); texto(x("tierra"),e[0],e[1]-.16,C.boli,movil?15:18); }
    if(detras) tierra();
    c.save(); mezclaModo(); brillo(s0[0],s0[1]-.1,.4,C.marca,oscuro?.55:.45); brillo(s0[0],s0[1]-.1,.22,C.n1,.35); c.restore();
    esfera(s0[0],s0[1]-.1,.11,mezcla(C.marca,C.n1,.35)); texto(x("sol"),s0[0],s0[1]+.14,C.n1,movil?16:19);
    if(!detras) tierra();
    // rayo de luz de una estrella que se curva al pasar cerca del Sol
    var yb=s0[1]-.42, pl=[], rec=[]; for(var k=0;k<=60;k++){ var xx=-1.05+2.1*k/60, d=xx-s0[0]; pl.push([xx,yb+.06*(1+Math.atan(d/.1)/1.5708)]); if(d>0) rec.push([xx,yb+.06]); } linea(rec,rgba(C.n1,.45),1.2,[4,5]);
    c.save(); mezclaModo(); linea(pl,rgba(C.n1,.85),2); c.restore();
    var off=reduce?.5:((t*.25)%1), kk=Math.floor(off*60); if(pl[kk]) brillo(pl[kk][0],pl[kk][1],.05,C.n1,.8);
    texto(x("luzcurva"),-.95,-.92,C.n1,movil?14:17,"left");
  },
  /* 6 · universo: galaxias espirales que se separan (el espacio crece, ellas no) */
  function universo(t,p){
    var a=.55+.9*p+(reduce?0:.02*Math.sin(t*.6));
    for(var i=0;i<140;i++){ var tw=.35+.65*Math.abs(Math.sin(t*(.5+rnd(i+2))+i)); var pp=P(rnd(i)*2.2-1.1,rnd(i+77)*2-1); c.fillStyle=rgba(C["tinta-3"],(reduce?.6:tw)*.7); c.fillRect(pp[0],pp[1],1.4,1.4); }
    var G=[[0,0]]; for(var i=1;i<15;i++){ var gx=((i%5)-2)*.42+(rnd(i+200)-.5)*.2, gy=(Math.floor(i/5)-1)*.5+(rnd(i+300)-.5)*.2; if(Math.abs(gx)<.15&&Math.abs(gy)<.15) gx+=.3; G.push([gx,gy]); }
    G.forEach(function(g,i){
      var gx=g[0]*a, gy=g[1]*a; if(Math.abs(gx)>1.15||Math.abs(gy)>1.05) return;
      var q=P(gx,gy), rot=rnd(i+9)*6.283+(reduce?0:t*.05), incl=.35+rnd(i+4)*.55, R=(.07+rnd(i+11)*.05)*u*(i===0?1.15:1);
      c.save(); c.translate(q[0],q[1]); c.rotate(rnd(i+5)*3); c.scale(1,incl);
      var col=i===0?C.rojo:(i%3===0?C.boli:C.n4);
      c.save(); mezclaModo();
      var gc=c.createRadialGradient(0,0,0,0,0,R*.55); gc.addColorStop(0,rgba("#fff6d8",.95)); gc.addColorStop(.4,rgba(col,.5)); gc.addColorStop(1,rgba(col,0)); c.fillStyle=gc; c.beginPath(); c.arc(0,0,R*.55,0,7); c.fill();
      for(var k=0;k<110;k++){ var arm=k%2, th=(k/110)*4.2, rr=R*.12*Math.exp(.42*th), ang=th+arm*Math.PI+rot+(rnd(k+i*31)-.5)*.5; var px=rr*Math.cos(ang)+(rnd(k+i)-.5)*R*.08, py=rr*Math.sin(ang)+(rnd(k+i*3)-.5)*R*.08; c.fillStyle=rgba(k%7===0?"#ffffff":col,.55); c.fillRect(px,py,1.5,1.5); }
      c.restore(); c.restore();
      if(i>0&&i<6){ var d=Math.hypot(gx,gy), kv=.16*d; if(d>.12){ linea([[0,0],[gx,gy]],rgba(C["tinta-3"],.5),1,[2,6]); flecha(gx+gx/d*.08,gy+gy/d*.08,gx+gx/d*(.08+kv),gy+gy/d*(.08+kv),C.n4,1.8); } }
    });
    texto(x("aqui"),0,.15,C.rojo,movil?15:18);
    texto("v = H₀ · d",0,-.9,C.n4,movil?18:22);
  },
  /* 7 · tú: la escalera de tamaños, de los núcleos al universo observable */
  function tu(t,p){
    var st=[-15,-10,-7,0,11,26], cols=[C.rojo,C.boli,C.n1,C.verde,C.n3,C.n4];
    var vert=movil;
    function pos(e){ var s=(e+15)/41; return vert ? [-.7, -.82+1.36*s] : [-.92+1.84*s, .05]; }
    // eje con degradado
    var a=pos(-15), b=pos(26), pa=P(a[0],a[1]), pb=P(b[0],b[1]), gr=c.createLinearGradient(pa[0],pa[1],pb[0],pb[1]);
    cols.forEach(function(cl,i){ gr.addColorStop(i/5,cl); });
    c.strokeStyle=gr; c.lineWidth=5; c.lineCap="round"; c.beginPath(); c.moveTo(pa[0],pa[1]); c.lineTo(pb[0],pb[1]); c.stroke();
    for(var e=-15;e<=26;e++){ var q=pos(e), mayor=e%5===0, L=mayor?.035:.018; linea(vert?[[q[0]-L,q[1]],[q[0]+L,q[1]]]:[[q[0],q[1]-L],[q[0],q[1]+L]],rgba(C["tinta-3"],mayor?.9:.5),mayor?1.6:1); if(mayor&&!vert) texto("10"+sup(e),q[0],q[1]+.11,C["tinta-3"],11,"center",FM); }
    // cometa que recorre la escala
    if(!reduce){ var f=(t*.12)%1, q=pos(-15+41*f); c.save(); mezclaModo(); brillo(q[0],q[1],.08,C.marca,.7); c.restore(); }
    function icono(i,ix,iy,r){
      var ga=c.globalAlpha;
      circ(ix,iy,r,C.hoja,rgba(cols[i],.9),2);
      c.save(); var pc=P(ix,iy); c.beginPath(); c.arc(pc[0],pc[1],r*u-1,0,7); c.clip();
      if(i===0){ for(var k=0;k<7;k++){ var a2=k*2.4, rr=r*.28*Math.sqrt(k); esfera(ix+rr*Math.cos(a2),iy+rr*Math.sin(a2),r*.3,k%2?C.rojo:"#8e9aab"); } }
      else if(i===1){ circ(ix,iy,r*.62,null,rgba(C.boli,.6),1.2); esfera(ix,iy,r*.18,C.rojo); var aa=t*2; esfera(ix+r*.62*Math.cos(aa),iy+r*.62*Math.sin(aa),r*.12,C.boli); }
      else if(i===2){ var pts=[]; for(var k=0;k<=40;k++){ var s=k/40; pts.push([ix-r*.8+1.6*r*s,iy+r*.35*Math.sin(s*12-(reduce?0:t*5))]); } for(var k=0;k<40;k++) linea([pts[k],pts[k+1]],lam(400+k*7.5),2.2); }
      else if(i===3){ var hh=r*.95; circ(ix,iy-hh*.42,r*.16,C.verde); linea([[ix,iy-hh*.25],[ix,iy+hh*.2]],C.verde,3); linea([[ix-r*.3,iy-hh*.05],[ix,iy-hh*.18],[ix+r*.3,iy-hh*.05]],C.verde,2.5); linea([[ix-r*.22,iy+hh*.55],[ix,iy+hh*.2],[ix+r*.22,iy+hh*.55]],C.verde,2.5); }
      else if(i===4){ brillo(ix-r*.3,iy,r*.6,C.marca,.6); esfera(ix-r*.3,iy,r*.32,mezcla(C.marca,C.n1,.3)); circ(ix-r*.3,iy,r*.72,null,rgba(C["tinta-3"],.6),1); var aa=t*.8; esfera(ix-r*.3+r*.72*Math.cos(aa),iy+r*.72*Math.sin(aa),r*.1,C.boli); }
      else { for(var k=0;k<60;k++){ var arm=k%2, th=k/60*4, rr=r*.08*Math.exp(.5*th), ang=th+arm*Math.PI+t*.2; var pp=P(ix+rr*Math.cos(ang)/u*u,iy+rr*Math.sin(ang)*.6); c.fillStyle=rgba(C.n4,.8); c.fillRect(pp[0],pp[1],1.5,1.5); } brillo(ix,iy,r*.3,"#fff6d8",.9); }
      c.restore(); c.globalAlpha=ga;
    }
    st.forEach(function(e,i){
      var q=pos(e), act=i===3, r=movil?.1:.105, alterna=i%2===0, ix, iy;
      if(vert){ ix=-.22; iy=-.8+i*.27; } else { ix=q[0]; iy=q[1]+(alterna?-.36:.36); }
      linea([q,[ix+(vert?-r:0),iy+(vert?0:(alterna?r:-r))]],rgba(cols[i],.7),1.3);
      circ(q[0],q[1],act?.03:.022,cols[i],C.papel,2);
      if(act){ var pul=reduce?.5:(t%1.6)/1.6; circ(q[0],q[1],.03+.08*pul,null,rgba(cols[i],1-pul),2); }
      icono(i,ix,iy,r);
      var lx=vert?ix+r+.06:ix, ly=vert?iy-.03:iy+(alterna?-r-.1:r+.1);
      texto(tr(X.esc[i]),lx,ly,act?C.rojo:C.tinta,movil?17:20,vert?"left":"center");
      texto("10"+sup(e)+" m",lx,ly+(vert?.1:(alterna?-.09:.09)),C["tinta-2"],movil?12:13,vert?"left":"center",FM);
    });
  }];

  function sup(n){ var m={"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"}; return String(n).split("").map(function(ch){return m[ch];}).join(""); }

  function escena(i,t,p,alpha,esc){
    if(i<0||i>=ESC.length||alpha<=0) return;
    c.save(); c.globalAlpha=alpha;
    if(esc!==1){ c.translate(cx,cy); c.scale(esc,esc); c.translate(-cx,-cy); }
    try{ ESC[i](t,p); }catch(e){}
    c.restore();
  }
  function dibujar(){
    if(!w||!h) return;
    c.setTransform(dpr,0,0,dpr,0,0); c.clearRect(0,0,w,h); marco();
    var t=(performance.now()-t0)/1000, f=reduce?1:Math.min(1,(performance.now()-tCambio)/650), e=f*f*(3-2*f);
    if(prev>=0 && e<1){
      var z=dir>0 ? 1+e*.5 : 1-e*.35;
      escena(prev,t,dir>0?1:0,1-e,z);
      escena(cur,t,prog,e,dir>0 ? .65+.35*e : 1.4-.4*e);
    } else escena(cur,t,prog,1,1);
  }
  function ciclo(){ raf=0; estado(); dibujar(); if(visible && !reduce && !D.hidden) raf=requestAnimationFrame(ciclo); }
  function pedir(){ if(!raf) raf=requestAnimationFrame(ciclo); }

  estado(); medir();
  if(W.ResizeObserver) new ResizeObserver(medir).observe(lienzo); else W.addEventListener("resize", medir);
  W.addEventListener("scroll", function(){ if(reduce||!visible) { estado(); dibujar(); } else pedir(); }, {passive:true});
  D.addEventListener("pf:tema", function(){ setTimeout(function(){ colores(); dibujar(); }, 30); });
  D.addEventListener("visibilitychange", function(){ if(!D.hidden && visible) pedir(); });
  if(W.IntersectionObserver){
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if(visible) pedir(); }, {rootMargin:"100px"}).observe(sec);
  } else { visible = true; pedir(); }
}
})();
