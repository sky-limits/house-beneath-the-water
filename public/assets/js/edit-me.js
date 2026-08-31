/*
===============================================================================
                         ✦  EDIT ME, FINCH  ✦
===============================================================================
This is the friendly control panel for the parts of the site you'll change most.
Edit the words between quotes, save, then upload THIS file to:

    /assets/js/edit-me.js

You do not need to touch HTML for ordinary updates.

A few rules so JavaScript doesn't bite your ankles:
  • keep the quote marks around text
  • keep commas where they already are
  • use <br> when you want a line break
  • leave an array [] empty if you don't want that section to appear
  • URLs should include https:// when they leave your site
===============================================================================
*/

const EDIT_ME = {
  // --------------------------------------------------------------------------
  // SHARED SIDEBAR + LITTLE SITE DETAILS
  // These appear throughout the house.
  // --------------------------------------------------------------------------
  cave: {
    status: 'lights are on',
    pressure: 'tolerable',
    visibility: 'poor',
    signal: 'somehow'
  },

  // Optional "currently" box. Leave a value blank and that line disappears.
  currently: {
    listening: '',
    reading: '',
    making: 'this strange little house',
    thinking: ''
  },

  marquee: 'tiny lights below the surface :: handmade pages :: horses in the next valley :: wet paper drying on the radiator :: leave the shiny thing where you found it :: ',

  footer: {
    firstLine: 'handmade on the internet ♡',
    secondLine: 'no algorithms live here. no feed. no infinite scroll. you eventually reach the wall.',
    copyright: '© finch · the house beneath the water'
  },

  // --------------------------------------------------------------------------
  // HOMEPAGE
  // --------------------------------------------------------------------------
  home: {
    subtitle: 'finch was here. last updated when the tide brought something in.',
    roomNote: 'Nothing here is optimized. The cabinet sticks. The computer hums. There is water on the other side of the window and, inconveniently, also upstairs.',
    siteLog: [
      { date: '08.31.26', text: 'opened the house. put labels on the dangerous drawers. forgot one.' }
    ],
    scribble: 'if you hear scratching in the walls it is probably css'
  },

  // --------------------------------------------------------------------------
  // ABOUT / THE PHOTOGRAPH
  // --------------------------------------------------------------------------
  about: {
    name: 'finch',
    lede: 'artist, site-builder, keeper of too many little fictional animals, collector of useful scraps.',
    paragraphs: [
      'This place is a personal web cave. It holds art, creature records, a working grimoire, weblog scraps, tiny experiments, and whatever else refuses to fit neatly somewhere else.',
      'I like websites that feel inhabited. Pages can be uneven. Some rooms are full. Some rooms have one object in them and that is enough.'
    ],
    thingsTitle: 'things that keep turning up',
    things: 'horses. antlers. moonlight. dark water. blue glass. pixel edges. handwritten notes. old forums. weather. strange little tools. the feeling of finding a page nobody was trying to sell you.',
    siteTitle: 'about this site',
    siteText: 'Plain HTML, CSS, JavaScript, and p5.js, with Vercel underneath for the few things that need a server. No feed. The site is supposed to accrete instead of “launch.”',
    stamp: 'NOT A BRAND'
  },

  // --------------------------------------------------------------------------
  // JOURNAL
  // Add another { ... } block to the TOP of this list for a new entry.
  // Keep the comma between entries.
  // --------------------------------------------------------------------------
  journal: {
    entries: [
      {
        date: '08.31.26',
        title: 'house opened',
        text: 'Made the room navigable. Put the ocean outside the window. It immediately got into the walls.'
      },
      {
        date: '08.31.26',
        title: 'design rule',
        text: 'If a page only needs three lines, it gets three lines. Empty space does not need to justify rent.'
      },
      {
        date: '08.31.26',
        title: 'future note',
        text: 'Actual weblog entries belong here when there are actual weblog entries to keep.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // LINKS
  // Add your favorite outside sites here. If this stays empty, the whole
  // external-links section stays hidden.
  // --------------------------------------------------------------------------
  links: {
    outside: [
      // { label: 'a cool website', url: 'https://example.com/', note: 'why i keep it around' },
    ]
  }
};

// ============================================================================
// You can stop scrolling here. Everything below this line makes the edits work.
// ============================================================================
(function applyEditMe(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const path=location.pathname.replace(/index\.html$/,'');

  // Shared cave conditions.
  $$('.sidebar .box').forEach(box=>{
    const title=$('.boxtitle',box);
    if(!title || title.textContent.trim()!=='cave conditions') return;
    const ps=$$('p',box);
    if(ps[0]) ps[0].innerHTML='<span class="status-dot"></span> '+EDIT_ME.cave.status;
    if(ps[2]) ps[2].innerHTML='pressure: '+EDIT_ME.cave.pressure+'<br>visibility: '+EDIT_ME.cave.visibility+'<br>signal: '+EDIT_ME.cave.signal;

    const rows=Object.entries(EDIT_ME.currently).filter(([,v])=>String(v).trim());
    const sidebar=box.parentElement;
    if(rows.length && sidebar && !sidebar.querySelector('[data-currently-box]')){
      const current=document.createElement('section');
      current.className='box';
      current.dataset.currentlyBox='true';
      current.innerHTML='<div class="boxtitle">currently</div>'+rows.map(([k,v])=>'<p><b>'+k+':</b> '+v+'</p>').join('');
      box.insertAdjacentElement('afterend',current);
    }
  });

  // Shared marquee + footer.
  $$('.marquee span').forEach(el=>el.textContent=EDIT_ME.marquee);
  $$('footer').forEach(footer=>{
    const p=$$('p',footer);
    if(p[0]) p[0].textContent=EDIT_ME.footer.firstLine;
    if(p[1]) p[1].textContent=EDIT_ME.footer.secondLine;
    if(p[2]){
      const map=p[2].querySelector('a');
      p[2].textContent=EDIT_ME.footer.copyright+' · ';
      if(map){ p[2].appendChild(map); }
    }
  });

  // Homepage.
  if(path==='/' || path===''){
    const subtitle=$('.banner > p'); if(subtitle) subtitle.textContent=EDIT_ME.home.subtitle;
    const note=$('.roomnote'); if(note) note.textContent=EDIT_ME.home.roomNote;
    const boxes=$$('.main > .box');
    const logBox=boxes.find(box=>$('.boxtitle',box)?.textContent.trim()==='site log');
    if(logBox){
      const title=$('.boxtitle',logBox);
      logBox.innerHTML=''; logBox.appendChild(title);
      EDIT_ME.home.siteLog.forEach(entry=>{
        const p=document.createElement('p');
        p.innerHTML='<b>'+entry.date+'</b> — '+entry.text;
        logBox.appendChild(p);
      });
      if(EDIT_ME.home.scribble){
        const p=document.createElement('p'); p.className='scribble'; p.textContent=EDIT_ME.home.scribble; logBox.appendChild(p);
      }
    }
  }

  // About page.
  if(path.startsWith('/about/')){
    const article=$('.paper');
    if(article){
      const tiny=$('.tiny',article);
      article.innerHTML='';
      if(tiny) article.appendChild(tiny);
      const h2=document.createElement('h2'); h2.textContent=EDIT_ME.about.name; article.appendChild(h2);
      const lede=document.createElement('p'); lede.className='lede'; lede.textContent=EDIT_ME.about.lede; article.appendChild(lede);
      EDIT_ME.about.paragraphs.forEach(t=>{const p=document.createElement('p');p.textContent=t;article.appendChild(p)});
      const h31=document.createElement('h3');h31.textContent=EDIT_ME.about.thingsTitle;article.appendChild(h31);
      const things=document.createElement('p');things.textContent=EDIT_ME.about.things;article.appendChild(things);
      const h32=document.createElement('h3');h32.textContent=EDIT_ME.about.siteTitle;article.appendChild(h32);
      const site=document.createElement('p');site.textContent=EDIT_ME.about.siteText;article.appendChild(site);
      const stampP=document.createElement('p');stampP.innerHTML='<span class="stamp"></span>';$('.stamp',stampP).textContent=EDIT_ME.about.stamp;article.appendChild(stampP);
    }
  }

  // Journal page.
  if(path.startsWith('/journal/')){
    const terminal=$('.terminalpage');
    if(terminal){
      $$('.logentry',terminal).forEach(e=>e.remove());
      const prompt=$('.prompt',terminal);
      EDIT_ME.journal.entries.slice().reverse().forEach(entry=>{
        const div=document.createElement('div');
        div.className='logentry';
        div.innerHTML='<time></time><h3></h3><p></p>';
        $('time',div).textContent=entry.date;
        $('h3',div).textContent=entry.title;
        $('p',div).textContent=entry.text;
        prompt.insertAdjacentElement('afterend',div);
      });
    }
  }

  // Links page. Outside links only appear if you add some above.
  if(path.startsWith('/links/') && EDIT_ME.links.outside.length){
    const article=$('.paper');
    if(article && !article.querySelector('[data-outside-links]')){
      const h3=document.createElement('h3');h3.dataset.outsideLinks='true';h3.textContent='doors leading elsewhere';
      const ul=document.createElement('ul');ul.dataset.outsideLinks='true';
      EDIT_ME.links.outside.forEach(link=>{
        const li=document.createElement('li');
        const a=document.createElement('a');a.href=link.url;a.textContent=link.label;
        li.appendChild(a);
        if(link.note) li.appendChild(document.createTextNode(' — '+link.note));
        ul.appendChild(li);
      });
      const inside=[...article.querySelectorAll('h3')].find(h=>h.textContent.trim()==='the shell says');
      if(inside){inside.insertAdjacentElement('beforebegin',ul);ul.insertAdjacentElement('beforebegin',h3)} else {article.append(h3,ul)}
    }
  }
})();
