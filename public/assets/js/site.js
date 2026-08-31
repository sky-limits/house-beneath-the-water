(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Add the garden everywhere without editing every page by hand.
  $$('.oldnav').forEach(nav=>{
    if(!nav.querySelector('a[href="/garden/"]')){
      const a=document.createElement('a');
      a.href='/garden/';
      a.textContent='garden';
      if(location.pathname.startsWith('/garden')) a.setAttribute('aria-current','page');
      nav.appendChild(a);
    }
  });
  $$('.pixel-links').forEach(list=>{
    if(!list.querySelector('a[href="/garden/"]')){
      const li=document.createElement('li');
      li.innerHTML='<a href="/garden/">impossible garden</a>';
      list.insertBefore(li,list.firstChild);
    }
  });

  // -------------------------------------------------------------------------
  // THE HOUSE REMEMBERS YOU
  // Browser-local on purpose. No account and no tracking service.
  // -------------------------------------------------------------------------
  const memoryKey='finch-house-memory-v1';
  const oldVisitsKey='finch-cave-visits';
  const now=new Date();
  const path=(location.pathname||'/').replace(/index\.html$/,'')||'/';
  let memory={visits:0,rooms:{},firstSeen:null,lastSeen:null};
  let previousLastSeen=null;

  try{
    const saved=JSON.parse(localStorage.getItem(memoryKey)||'null');
    if(saved&&typeof saved==='object') memory={...memory,...saved,rooms:saved.rooms||{}};
    const oldVisits=parseInt(localStorage.getItem(oldVisitsKey)||'0',10);
    if(Number.isFinite(oldVisits)) memory.visits=Math.max(memory.visits||0,oldVisits);

    previousLastSeen=memory.lastSeen;
    memory.visits=(memory.visits||0)+1;
    memory.firstSeen=memory.firstSeen||now.toISOString();
    memory.lastSeen=now.toISOString();
    memory.rooms[path]=(memory.rooms[path]||0)+1;
    localStorage.setItem(memoryKey,JSON.stringify(memory));
    localStorage.setItem(oldVisitsKey,String(memory.visits));
  }catch(e){}

  $$('.local-visits').forEach(el=>el.textContent=String(memory.visits||1).padStart(5,'0'));

  function memoryGreeting(){
    const n=memory.visits||1;
    if(n<=1) return "you don't remember this door.";
    if(n<6) return 'the house has seen you before.';
    if(n<20) return "you've used this door before.";
    return 'welcome home.';
  }

  function relativeLastSeen(iso){
    if(!iso) return 'this is the first mark in the ledger.';
    const then=new Date(iso);
    if(Number.isNaN(then.getTime())) return 'the ink ran.';
    const minutes=Math.max(0,Math.round((now-then)/60000));
    if(minutes<2) return 'a moment ago.';
    if(minutes<60) return `${minutes} minutes ago.`;
    const hours=Math.round(minutes/60);
    if(hours<36) return `${hours} hour${hours===1?'':'s'} ago.`;
    const days=Math.round(hours/24);
    return `${days} day${days===1?'':'s'} ago.`;
  }

  $$('.sidebar').forEach(sidebar=>{
    if(sidebar.querySelector('[data-house-memory]')) return;
    const box=document.createElement('section');
    box.className='box house-memory';
    box.dataset.houseMemory='true';
    box.innerHTML='<div class="boxtitle">the house remembers</div>'+
      '<p class="memory-greeting"></p><p>rooms found: <span class="rooms-found"></span></p>'+
      '<p>last seen: <span class="last-seen"></span></p>';
    const pocket=[...sidebar.querySelectorAll('.box')].find(b=>$('.boxtitle',b)?.textContent.trim()==='pocket');
    if(pocket) pocket.insertAdjacentElement('afterend',box); else sidebar.appendChild(box);
    $('.memory-greeting',box).textContent=memoryGreeting();
    $('.rooms-found',box).textContent=Object.keys(memory.rooms||{}).length;
    $('.last-seen',box).textContent=relativeLastSeen(previousLastSeen);
  });

  // -------------------------------------------------------------------------
  // POCKET / TREASURES
  // -------------------------------------------------------------------------
  const treasureKey='finch-cave-pocket';
  function getPocket(){try{return JSON.parse(localStorage.getItem(treasureKey)||'[]')}catch(e){return []}}
  function setPocket(v){try{localStorage.setItem(treasureKey,JSON.stringify(v))}catch(e){}}
  function renderPocket(){
    const pocket=getPocket();
    $$('.pocket-count').forEach(el=>el.textContent=pocket.length);
    $$('.pocket-list').forEach(el=>el.textContent=pocket.length?pocket.join(' · '):'empty');
    $$('.collect-treasure').forEach(btn=>{
      if(pocket.includes(btn.dataset.treasure)){btn.textContent='kept.';btn.disabled=true}
    });
  }
  $$('.collect-treasure').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.dataset.treasure;
    const pocket=getPocket();
    if(!pocket.includes(item)){pocket.push(item);setPocket(pocket)}
    btn.textContent='kept.'; btn.disabled=true; renderPocket();
  }));
  $$('.empty-pocket').forEach(btn=>btn.addEventListener('click',()=>{
    setPocket([]);
    $$('.collect-treasure').forEach(b=>{b.disabled=false;b.textContent='put it in your pocket'});
    renderPocket();
  }));
  renderPocket();

  // -------------------------------------------------------------------------
  // VERCEL HOUSE HEARTBEAT
  // One tiny server-side state. houseTide is fictional, not real tide data.
  // -------------------------------------------------------------------------
  function ensureHeartbeat(){
    const utility=$('.utility');
    if(!utility) return null;
    let el=$('.house-heartbeat',utility);
    if(!el){
      el=document.createElement('span');
      el.className='house-heartbeat';
      el.textContent='house signal: listening...';
      utility.appendChild(el);
    }
    return el;
  }
  const heartbeat=ensureHeartbeat();

  fetch('/api/house-state',{headers:{'Accept':'application/json'}})
    .then(r=>{if(!r.ok) throw new Error('house asleep'); return r.json()})
    .then(state=>{
      document.documentElement.dataset.housePhase=state.phase||'night';
      document.documentElement.dataset.houseTide=state.houseTide||'unknown';
      if(state.rareWindow) document.documentElement.dataset.rareWindow='true';
      if(heartbeat) heartbeat.textContent=`house signal: ${state.phase} / ${state.houseTide} tide`;
      window.dispatchEvent(new CustomEvent('house-state-ready',{detail:state}));
    })
    .catch(()=>{
      const h=now.getHours();
      const fallback=h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'dusk':h<4?'deep-night':'night';
      document.documentElement.dataset.housePhase=fallback;
      if(heartbeat) heartbeat.textContent=`house signal: ${fallback} / local only`;
    });

  // Existing tiny interactions.
  const shellBtn=$('#shell-whisper'), shellOut=$('#shell-output');
  if(shellBtn&&shellOut){
    const whispers=['something small is still glowing.','the tide moved it, not you.','leave one thing unnamed.','there is a door behind the ordinary door.','you have enough pockets for this.','the water is quieter farther in.'];
    shellBtn.addEventListener('click',()=>shellOut.textContent=whispers[Math.floor(Math.random()*whispers.length)]);
  }

  const owl=$('#wandering-owl');
  if(owl){
    const move=()=>{owl.style.left=(8+Math.random()*78)+'%';owl.style.top=(8+Math.random()*76)+'%'};
    move(); owl.addEventListener('mouseenter',move); owl.addEventListener('click',move); setInterval(move,7000);
  }

  const stripe=$('#deploy-stripe'), stripeStage=$('#stripe-stage');
  if(stripe&&stripeStage){
    stripe.addEventListener('click',()=>{
      const d=document.createElement('img');
      d.src='/assets/img/dog.png';d.alt='';
      d.style.cssText='position:fixed;z-index:9999;width:86px;height:86px;object-fit:contain;bottom:8px;left:-100px;image-rendering:pixelated;transition:left 2.3s linear;pointer-events:none';
      document.body.appendChild(d);requestAnimationFrame(()=>d.style.left='calc(100vw + 100px)');setTimeout(()=>d.remove(),2700);
    });
  }

  // edit-me.js stays the everyday control panel.
  if(!document.querySelector('script[data-edit-me]')){
    const s=document.createElement('script');
    s.src='/assets/js/edit-me.js';
    s.dataset.editMe='true';
    document.body.appendChild(s);
  }
})();
