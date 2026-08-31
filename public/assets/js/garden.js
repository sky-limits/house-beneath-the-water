/* p5.js: the impossible garden */
(function(){
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const compactScreen = Math.min(window.innerWidth || 9999, window.innerHeight || 9999) < 700;
  if(typeof p5==='undefined') return;

  new p5(function(p){
    let grasses=[], flowers=[], motes=[];

    function makeGarden(){
      grasses=[]; flowers=[]; motes=[];
      const grassMax = reducedMotion || compactScreen ? 150 : 260;
      const flowerMax = reducedMotion || compactScreen ? 42 : 70;
      const grassCount=Math.min(grassMax,Math.max(80,Math.floor(p.width/6)));
      const flowerCount=Math.min(flowerMax,Math.max(20,Math.floor(p.width/28)));
      for(let i=0;i<grassCount;i++){
        grasses.push({
          x:p.random(-10,p.width+10),
          h:p.random(p.height*.10,p.height*.30),
          lean:p.random(-.45,.45),
          phase:p.random(1000),
          width:p.random(.7,1.7),
          depth:p.random(.25,1)
        });
      }
      for(let i=0;i<flowerCount;i++){
        flowers.push({
          x:p.random(8,p.width-8),
          y:p.random(p.height*.78,p.height*.97),
          h:p.random(25,80),
          phase:p.random(1000),
          petals:p.floor(p.random(4,8)),
          size:p.random(4,9),
          kind:p.random()<.55?'violet':'star'
        });
      }
      for(let i=0;i<(reducedMotion || compactScreen ? 28 : 55);i++){
        motes.push({x:p.random(p.width),y:p.random(p.height),s:p.random(.5,2),phase:p.random(1000)});
      }
    }

    p.setup=function(){
      const host=document.getElementById('garden-canvas');
      const c=p.createCanvas(window.innerWidth,window.innerHeight);
      c.parent(host);
      p.pixelDensity(Math.min(2,window.devicePixelRatio||1));
      p.noFill();
      if(reducedMotion || compactScreen) p.frameRate(24);
      makeGarden();
    };

    p.windowResized=function(){p.resizeCanvas(window.innerWidth,window.innerHeight);makeGarden()};

    function swayAt(x,phase,strength){
      const t=p.frameCount*(reducedMotion ? .0025 : .006);
      const wind=p.noise(x*.0025,phase,t)-.5;
      return wind*strength + Math.sin(t*1.6+phase)*strength*.18;
    }

    p.draw=function(){
      p.background(4,6,18);

      // dim violet night and a suggestion that the cave opens somewhere above.
      for(let y=0;y<p.height;y+=5){
        const k=y/p.height;
        p.stroke(10+8*k,12+13*k,31+9*k,255);
        p.line(0,y,p.width,y);
      }
      p.noStroke();
      for(let i=0;i<6;i++){
        const x=(i+.5)*p.width/6 + Math.sin(p.frameCount*.001+i)*35;
        p.fill(105,103,165,7);
        p.triangle(x-90,0,x+45,0,x+150,p.height*.72);
      }

      // tiny airborne things, half pollen and half cave dust.
      motes.forEach(m=>{
        m.y-=.04+m.s*.012;
        m.x+=Math.sin(p.frameCount*.004+m.phase)*.08;
        if(m.y<-5){m.y=p.height+5;m.x=p.random(p.width)}
        p.noStroke(); p.fill(171,166,210,35+m.s*20); p.circle(m.x,m.y,m.s);
      });

      // mossy ground.
      p.noStroke(); p.fill(8,20,20,245); p.rect(0,p.height*.79,p.width,p.height*.21);
      p.fill(11,27,24,180); p.rect(0,p.height*.86,p.width,p.height*.14);

      // grass, drawn back to front.
      grasses.sort((a,b)=>a.depth-b.depth).forEach(g=>{
        const baseY=p.height*.82 + g.depth*p.height*.18;
        const bend=swayAt(g.x,g.phase,26*g.depth)+g.lean*18;
        const topX=g.x+bend;
        const topY=baseY-g.h*(.72+.28*g.depth);
        p.noFill();
        p.stroke(68+32*g.depth,91+38*g.depth,78+23*g.depth,120+100*g.depth);
        p.strokeWeight(g.width*g.depth+.4);
        p.bezier(g.x,baseY,g.x+bend*.15,baseY-g.h*.35,topX-bend*.15,topY+g.h*.25,topX,topY);
      });

      // Flowers sit among the grass instead of in regimented rows.
      flowers.forEach(f=>{
        const bend=swayAt(f.x,f.phase,12);
        const baseY=f.y;
        const headX=f.x+bend;
        const headY=baseY-f.h;
        p.noFill(); p.stroke(73,111,91,190); p.strokeWeight(1);
        p.bezier(f.x,baseY,f.x+bend*.2,baseY-f.h*.35,headX-bend*.2,headY+f.h*.25,headX,headY);

        p.push(); p.translate(headX,headY); p.rotate(bend*.007);
        if(f.kind==='violet') p.fill(117,104,177,210); else p.fill(163,166,205,195);
        p.noStroke();
        for(let j=0;j<f.petals;j++){
          p.push(); p.rotate((p.TWO_PI/f.petals)*j); p.ellipse(0,-f.size*.65,f.size*.7,f.size*1.25); p.pop();
        }
        p.fill(190,174,123,220); p.circle(0,0,Math.max(2,f.size*.38));
        p.pop();
      });

      // low drifting foreground blades make the bottom edge feel thick and wild.
      for(let x=-10;x<p.width+20;x+=11){
        const h=30+25*p.noise(x*.03);
        const bend=swayAt(x,x*.17,15);
        p.noFill();p.stroke(39,73,59,180);p.strokeWeight(2);
        p.bezier(x,p.height,x,p.height-h*.3,x+bend,p.height-h*.7,x+bend,p.height-h);
      }
    };
  });
})();
