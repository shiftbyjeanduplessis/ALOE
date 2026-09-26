(function(){
'use strict';
if(window.__PW_RELEASE_FIXES_V6__) return;
window.__PW_RELEASE_FIXES_V6__=true;

const QA_KEY='pw8v4-qa-date-v2';
const PLAN_META={
  gym:'4 strength sessions · 35–45 min',
  home:'4 home sessions · 20 min max',
  hiit:'4 × 20-minute Home HIIT sessions',
  run:'4 sessions · 20–40 min'
};

function fixUndefinedHome(){
  const home=document.getElementById('home');
  if(!home) return;
  home.querySelectorAll('.v3cta span').forEach(el=>{
    if((el.textContent||'').trim()==='undefined'){
      const k=(window.S&&S.track)||'';
      el.textContent=PLAN_META[k]||'';
    }
  });
  const walker=document.createTreeWalker(home,NodeFilter.SHOW_TEXT);
  const bad=[];
  while(walker.nextNode()){
    if((walker.currentNode.nodeValue||'').trim()==='undefined') bad.push(walker.currentNode);
  }
  bad.forEach(n=>n.nodeValue='');
}

function fixTimedPlank(){
  const modal=document.getElementById('pwSequenceModal');
  if(!modal) return;
  const h=modal.querySelector('.pw-ex-card h1');
  if(!h || (h.textContent||'').trim()!=='Standard Plank') return;
  const card=h.closest('.pw-ex-card');
  if(!card) return;
  const ps=[...card.querySelectorAll('p')];
  const prescription=ps.find(p=>(p.textContent||'').includes('target 30–45 sec'));
  if(prescription){
    prescription.innerHTML=prescription.innerHTML
      .replace(/2 sets × 12 reps · target 30–45 sec/g,'2 sets × 30–45 sec')
      .replace(/2–3 sets × 12 reps · target 30–45 sec/g,'2–3 sets × 30–45 sec')
      .replace(/3 sets × 12 reps · target 30–45 sec/g,'3 sets × 30–45 sec');
    const last=prescription.querySelector('span');
    if(last){
      last.textContent=last.textContent.replace(/Last logged:\s*—\s*×\s*([0-9.]+)/,'Last logged: $1 sec');
    }
  }
}

function observeUi(){
  const home=document.getElementById('home');
  if(home){
    new MutationObserver(()=>fixUndefinedHome()).observe(home,{subtree:true,childList:true,characterData:true});
  }
  new MutationObserver(()=>fixTimedPlank()).observe(document.body,{subtree:true,childList:true});
  fixUndefinedHome();
  fixTimedPlank();
}

function installQaPersistence(){
  if(new URLSearchParams(location.search).get('qa')!=='1') {
    try{sessionStorage.removeItem(QA_KEY)}catch(e){}
    return;
  }
  const panel=document.getElementById('pwQaPanel');
  if(!panel) return;
  const W=panel.querySelector('#qaw'),D=panel.querySelector('#qad');
  if(!W||!D) return;

  function write(obj){
    try{sessionStorage.setItem(QA_KEY,JSON.stringify(obj))}catch(e){}
  }
  function read(){
    try{return JSON.parse(sessionStorage.getItem(QA_KEY)||'null')}catch(e){return null}
  }
  function capture(){
    write({mode:'date',w:+W.value||0,d:+D.value||1});
  }
  function later(fn){setTimeout(fn,0)}

  W.addEventListener('change',()=>later(capture));
  D.addEventListener('change',()=>later(capture));
  ['qap','qan','qawp','qanx'].forEach(id=>{
    const b=panel.querySelector('#'+id);
    if(b)b.addEventListener('click',()=>later(capture));
  });
  const prep=panel.querySelector('#qaprep');
  if(prep)prep.addEventListener('click',()=>later(()=>write({mode:'prep'})));
  const launch=panel.querySelector('#qalaunch');
  if(launch)launch.addEventListener('click',()=>later(()=>write({mode:'launch'})));
  const real=panel.querySelector('#qareal');
  if(real)real.addEventListener('click',()=>{try{sessionStorage.removeItem(QA_KEY)}catch(e){}});
  const restore=panel.querySelector('#qares');
  if(restore)restore.addEventListener('click',()=>{try{sessionStorage.removeItem(QA_KEY)}catch(e){}});

  const saved=read();
  if(!saved) return;
  setTimeout(()=>{
    if(saved.mode==='launch'){
      const b=panel.querySelector('#qalaunch'); if(b)b.click();
    }else if(saved.mode==='prep'){
      const b=panel.querySelector('#qaprep'); if(b)b.click();
    }else if(saved.mode==='date' && saved.w>=0){
      W.value=String(saved.w);
      D.value=String(saved.d||1);
      W.dispatchEvent(new Event('change',{bubbles:true}));
    }
  },0);
}

function installCohortSwitcher(){
  const progress=document.getElementById('progress');
  if(!progress) return;

  function add(){
    if(!document.getElementById('pwCohortSwitch')) {
      const cohortCard=[...progress.querySelectorAll('.card')].find(c=>(c.textContent||'').includes('Assigned start date'));
      if(!cohortCard) return;
      const wrap=document.createElement('div');
      wrap.id='pwCohortSwitch';
      wrap.style.marginTop='14px';
      wrap.style.paddingTop='14px';
      wrap.style.borderTop='1px solid rgba(7,85,104,.15)';
      wrap.innerHTML='<div class="sub" style="margin-bottom:7px;font-weight:800">Wrong start date?</div><div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><select id="pwCohortSelect" style="flex:1;min-width:160px;padding:11px 12px;border:1px solid #b9dfe3;border-radius:10px;background:#fff;color:#075568;font-weight:800"><option value="2026-09-14">14 September</option><option value="2026-09-28">28 September</option></select><button class="btn ghost small" id="pwCohortSave" type="button">CHANGE START DATE</button></div><div class="sub" style="margin-top:7px">Use this only if you chose the wrong intake date.</div>';
      cohortCard.appendChild(wrap);
      const select=wrap.querySelector('#pwCohortSelect');
      const button=wrap.querySelector('#pwCohortSave');
      select.value=S.cohort;
      button.onclick=()=>{
        const next=select.value;
        if(next===S.cohort){toast('Start date is already correct');return}
        const label=next==='2026-09-28'?'28 September':'14 September';
        if(!confirm('Change your challenge start date to '+label+'? Your Week and Day will be recalculated.')){select.value=S.cohort;return}
        S.cohort=next;
        save();
        renderAll();
        setTimeout(()=>{show('progress');toast('Start date changed to '+label)},0);
      };
    } else {
      const select=document.getElementById('pwCohortSelect');
      if(select) select.value=S.cohort;
    }
  }

  new MutationObserver(add).observe(progress,{subtree:true,childList:true});
  add();
}

observeUi();
installQaPersistence();
installCohortSwitcher();
})();
