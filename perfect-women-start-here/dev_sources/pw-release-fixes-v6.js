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

function installFreshCohortGate(){
  const params=new URLSearchParams(location.search);
  if(params.get('qa')==='1') return;

  function savedCohort(){
    try{
      const current=JSON.parse(localStorage.getItem('pw8v4')||'null');
      if(current && ['2026-09-14','2026-09-28'].includes(current.cohort)) return current.cohort;
    }catch(e){}
    try{
      const legacy=JSON.parse(localStorage.getItem('pw8')||'null');
      if(legacy && ['2026-09-14','2026-09-28'].includes(legacy.cohort)) return legacy.cohort;
    }catch(e){}
    return '';
  }

  if(savedCohort()) return;
  if(['2026-09-14','2026-09-28'].includes(params.get('cohort'))) return;
  if(document.getElementById('pwFreshCohortGate')) return;

  const gate=document.createElement('div');
  gate.id='pwFreshCohortGate';
  gate.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(255,250,240,.98);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Arial,Helvetica,sans-serif;color:#075568';
  gate.innerHTML='<div style="width:min(430px,100%);background:#fff;border:2px solid #9bdee4;border-radius:22px;padding:24px;box-shadow:0 18px 50px rgba(7,86,104,.18);text-align:center"><div style="font-size:13px;font-weight:900;letter-spacing:.12em;color:#08a8b5;text-transform:uppercase">Perfect Women</div><h1 style="font-size:30px;line-height:1.05;margin:10px 0 8px;color:#075568">When does your challenge start?</h1><p style="font-size:16px;line-height:1.45;margin:0 0 20px;color:#476d73">Choose your intake date once. Your Week and Day will then update automatically.</p><div style="display:grid;gap:12px"><button type="button" data-cohort-choice="2026-09-14" style="border:0;border-radius:14px;padding:16px;background:#08a8b5;color:#fff;font-size:18px;font-weight:900;cursor:pointer">14 September</button><button type="button" data-cohort-choice="2026-09-28" style="border:0;border-radius:14px;padding:16px;background:#ff5960;color:#fff;font-size:18px;font-weight:900;cursor:pointer">28 September</button></div><p style="font-size:13px;line-height:1.4;margin:16px 0 0;color:#6b8589">Not sure? Check the start date you were given before choosing.</p></div>';
  document.body.appendChild(gate);
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';

  gate.querySelectorAll('[data-cohort-choice]').forEach(button=>{
    button.onclick=()=>{
      const next=button.getAttribute('data-cohort-choice');
      S.cohort=next;
      save();
      gate.remove();
      document.documentElement.style.overflow='';
      document.body.style.overflow='';
      renderAll();
      toast('Start date saved');
    };
  });
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
installFreshCohortGate();
installCohortSwitcher();
})();
