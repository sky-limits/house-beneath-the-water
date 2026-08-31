const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const compactScreen = Math.min(window.innerWidth || 9999, window.innerHeight || 9999) < 700;
let motes=[], bubbles=[], fish=[], kelp=[], jelly=[], glints=[], t=0;
function setup(){
  const c=createCanvas(windowWidth,windowHeight);c.parent('ocean-canvas');pixelDensity(1);noSmooth();
  if(reducedMotion || compactScreen) frameRate(24);
  const light = reducedMotion || compactScreen;
  for(let i=0;i<(light?36:70);i++)motes.push(new Mote(true));
  for(let i=0;i<(light?10:18);i++)bubbles.push(new Bubble(true));
  for(let i=0;i<(light?6:10);i++)fish.push(new Fish(random(width),random(height*.18,height*.9),random(.45,1.1)));
  for(let i=0;i<(light?9:14);i++)kelp.push({x:random(width),h:random(55,210),p:random(TWO_PI)});
  for(let i=0;i<(light?2:3);i++)jelly.push(new Jelly(random(width),random(height*.25,height*.85),random(.5,.9)));
  for(let i=0;i<(light?5:9);i++)glints.push({x:random(width),y:random(height*.45,height*.95),p:random(TWO_PI),s:random(1,2.3)});
}
function draw(){clear();t+=reducedMotion?.0008:.002;lightshafts();rocks();drawKelp();glints.forEach(drawGlint);motes.forEach(o=>{o.update();o.show()});bubbles.forEach(o=>{o.update();o.show()});jelly.forEach(o=>{o.update();o.show()});fish.forEach(o=>{o.update();o.show()})}
function lightshafts(){push();noStroke();for(let i=0;i<4;i++){let x=width*(.13+i*.25)+sin(t*8+i)*30;fill(107,119,183,4);triangle(x-45,0,x+24,0,x+175,height*.78)}pop()}
function rocks(){push();noStroke();fill(1,1,7,155);beginShape();vertex(0,0);vertex(width*.12,0);for(let y=0;y<=height;y+=30)vertex(25+sin(y*.03)*21,y);vertex(0,height);endShape(CLOSE);beginShape();vertex(width,0);vertex(width*.88,0);for(let y=0;y<=height;y+=30)vertex(width-26+sin(y*.028+2)*22,y);vertex(width,height);endShape(CLOSE);fill(1,1,6,115);rect(0,height*.93,width,height*.07);pop()}
function drawKelp(){push();noFill();stroke(40,49,79,72);strokeWeight(2);kelp.forEach(k=>{beginShape();for(let y=height+8;y>height-k.h;y-=9){let q=(height-y)/k.h;curveVertex(k.x+sin(y*.026+t*11+k.p)*10*(q+.2),y)}endShape()});pop()}
function drawGlint(g){let a=12+max(0,sin(frameCount*.016+g.p))*44;push();stroke(156,171,217,a);point(g.x,g.y);if(a>45){line(g.x-2,g.y,g.x+2,g.y);line(g.x,g.y-2,g.x,g.y+2)}pop()}
class Mote{constructor(a=false){this.reset(a)}reset(a=false){this.x=random(width);this.y=a?random(height):height+5;this.s=random(1,2);this.sp=random(.02,.13);this.a=random(14,50);this.p=random(TWO_PI)}update(){this.y-=this.sp;this.x+=sin(frameCount*.004+this.p)*.035;if(this.y<-5)this.reset()}show(){noStroke();fill(151,160,205,this.a);rect(floor(this.x),floor(this.y),this.s,this.s)}}
class Bubble{constructor(a=false){this.reset(a)}reset(a=false){this.x=random(width);this.y=a?random(height):height+8;this.r=random(2,6);this.sp=random(.07,.23);this.p=random(TWO_PI)}update(){this.y-=this.sp;this.x+=sin(frameCount*.01+this.p)*.08;if(this.y<-10)this.reset()}show(){noFill();stroke(118,142,185,25);ellipse(this.x,this.y,this.r,this.r)}}
class Fish{constructor(x,y,s){this.x=x;this.y=y;this.s=s;this.dir=random()<.5?-1:1;this.sp=random(.11,.32);this.p=random(TWO_PI);this.a=random(18,47)}update(){this.x+=this.sp*this.dir;this.y+=sin(frameCount*.008+this.p)*.025;if(this.x>width+28)this.x=-28;if(this.x<-28)this.x=width+28}show(){push();translate(this.x,this.y);scale(this.dir*this.s,this.s);noStroke();fill(81,102,145,this.a);triangle(-8,0,-14,-4,-14,4);ellipse(0,0,17,6);fill(177,188,220,34);rect(5,-1,1,1);pop()}}
class Jelly{constructor(x,y,s){this.x=x;this.y=y;this.s=s;this.p=random(TWO_PI);this.sp=random(.025,.07)}update(){this.y-=this.sp;this.x+=sin(frameCount*.003+this.p)*.05;if(this.y<-60){this.y=height+60;this.x=random(width)}}show(){push();translate(this.x,this.y);scale(this.s);noStroke();fill(127,112,183,15);arc(0,0,32,24,PI,TWO_PI,CHORD);stroke(125,132,192,16);noFill();for(let i=-10;i<=10;i+=7)bezier(i,0,i+5,13,i-5,20,i+sin(frameCount*.02+i)*4,32);pop()}}
function windowResized(){resizeCanvas(windowWidth,windowHeight)}
