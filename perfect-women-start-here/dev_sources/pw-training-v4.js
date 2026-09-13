(function(){
'use strict';
if(window.__PW_INTERACTIVE_TRAINING__)return;
window.__PW_INTERACTIVE_TRAINING__=true;

const STRENGTH={
  gym:{
    name:'Basic Gym',rest:[60,75],
    lower:[
      {n:'Leg Press',r:'12',w:1},{n:'Goblet Squat',r:'12',w:1},{n:'Seated Leg Curl',r:'12',w:1},
      {n:'Leg Extension',r:'12',w:1},{n:'Hip Thrust / Glute Bridge',r:'12',w:1},{n:'Standing Calf Raise',r:'12',w:1}
    ],
    upper:[
      {n:'Lat Pulldown',r:'12',w:1},{n:'Seated Chest Press',r:'12',w:1},{n:'Seated Cable Row',r:'12',w:1},
      {n:'Dumbbell Shoulder Press',r:'12',w:1},{n:'Dumbbell Biceps Curl',r:'12',w:1},{n:'Cable Triceps Pushdown',r:'12',w:1}
    ]
  },
  home:{
    name:'Home Dumbbell',rest:[45,60],
    lower:[
      {n:'Goblet Squat',r:'8–12',w:1},{n:'Dumbbell Romanian Deadlift',r:'8–12',w:1},
      {n:'Dumbbell Glute Bridge',r:'10–15',w:1},{n:'Full Dead Bug',r:'6–10 / side',w:0}
    ],
    upper:[
      {n:'Dumbbell Floor Press',r:'8–12',w:1},{n:'Supported One-Arm Row',r:'8–12 / arm',w:1},
      {n:'Seated Shoulder Press',r:'8–12',w:1},{n:'Overhead Triceps Extension',r:'8–12',w:1}
    ]
  }
};

const RUN={
  1:{1:['Easy Walk','20 min easy walk. Comfortable pace.'],2:['Intervals','5 min easy + 5 × (1 min brisk / 1 min easy) + 5 min easy.'],4:['Recovery Walk','20 min recovery walk. Easy pace.'],6:['Longer Walk','25 min steady walk.']},
  2:{1:['Easy Walk','25 min easy walk.'],2:['Intervals','5 min easy + 5 × (1 min jog / 2 min walk) + 5 min easy.'],4:['Recovery Walk','20 min recovery walk.'],6:['Longer Walk','30 min steady walk.']},
  3:{1:['Easy Walk / Run','25 min easy walk/run. Add short jogs only if comfortable.'],2:['Intervals','5 min easy + 5 × (2 min jog / 2 min walk) + 5 min easy.'],4:['Recovery Walk','25 min easy recovery walk.'],6:['Longer Walk / Run','30 min easy walk/run.']},
  4:{1:['Easy Walk / Run','25 min easy walk/run.'],2:['Intervals','5 min easy + 4 × (3 min run / 2 min walk) + 5 min easy.'],4:['Recovery Walk','25 min easy recovery walk.'],6:['Longer Walk / Run','35 min easy walk/run.']},
  5:{1:['Easy Run / Walk','30 min easy run/walk.'],2:['Intervals','5 min easy + 4 × (4 min run / 2 min walk) + easy cool-down.'],4:['Recovery Walk','25–30 min easy recovery walk.'],6:['Longer Run / Walk','35 min easy run/walk.']},
  6:{1:['Easy Run / Walk','30 min easy run/walk.'],2:['Intervals','5 min easy + 4 × (5 min run / 2 min walk) + easy cool-down.'],4:['Recovery Walk','25–30 min easy recovery walk.'],6:['Longer Run / Walk','40 min easy run/walk.']},
  7:{1:['Easy Run','30 min easy conversational run. Walk whenever needed.'],2:['Intervals','5 min easy + 4 × (6 min run / 2 min walk) + easy cool-down.'],4:['Recovery Walk','30 min easy recovery walk.'],6:['Longer Run','40 min mostly running with walk breaks if needed.']},
  8:{1:['Easy Run','30 min easy conversational run.'],2:['Intervals','5 min easy + 3 × (8 min run / 2 min walk) + 5 min easy.'],4:['Recovery Walk','30 min easy recovery walk.'],6:['Longer Run','40 min continuous easy run OR run/walk.']}
};

function wk(){try{return Math.max(0,Math.min(8,+week()||0))}catch(e){return 0}}
function key(){try{return dateKey()}catch(e){return new Date().toISOString().slice(0,10)}}
function dow(){return new Date(key()+'T12:00:00+02:00').getDay()}
function dayNo(){const d=dow();return d===1?1:d===2?2:d===4?3:d===6?4:0}
function ensureLogs(){S.trainingLogs=S.trainingLogs||{};return S.trainingLogs}
function logKey(track){return key()+'|'+track}
function saveNow(){try{save()}catch(e){}}
function markMove(){S.days=S.days||{};S.days[key()]=S.days[key()]||{};S.days[key()].move=true;saveNow()}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function strengthWeek(track,w){
  if(track==='gym') return w===1?{min:2,max:2,label:'2 sets × 12 reps'}:w===2?{min:2,max:3,label:'2–3 sets × 12 reps'}:{min:3,max:3,label:'3 sets × 12 reps'};
  return w<=2?{min:2,max:2,label:'2 sets'}:w<=4?{min:2,max:3,label:'2–3 sets'}:{min:3,max:3,label:'3 sets'};
}
function strengthSession(track,w,d){
  if(!STRENGTH[track]||!w||!d)return null;
  let type=(d===1||d===3)?'lower':'upper';
  let name=track==='gym'?(type==='lower'?'Lower Body':'Upper Body'):(type==='lower'?'Lower Body + Core':'Upper Body');
  if(d>2)name+=' · repeat approved template';
  let ex=STRENGTH[track][type].map(x=>({...x}));
  if(track==='home'&&d===4)ex=[...ex,{n:'Full Dead Bug',r:'6–10 / side',w:0}];
  return {track,w,d,name,ex,sets:strengthWeek(track,w),rest:STRENGTH[track].rest};
}
function runningSession(w){const x=RUN[w]&&RUN[w][dow()];return x?{w,d:dayNo(),name:x[0],detail:x[1]}:null}

function getLog(track){return ensureLogs()[logKey(track)]||null}
function putLog(track,obj){ensureLogs()[logKey(track)]=obj;saveNow();return obj}
function strengthLog(session){
  let l=getLog(session.track);
  if(l&&l.type==='strength')return l;
  l={type:'strength',track:session.track,date:key(),week:session.w,day:session.d,session:session.name,startedAt:new Date().toISOString(),completed:false,rest:session.rest[0],exercises:session.ex.map(x=>({name:x.n,target:x.r,weight:!!x.w,sets:Array.from({length:session.sets.min},()=>({weight:'',reps:'',done:false}))}))};
  return putLog(session.track,l);
}
function runLog(session){
  let l=getLog('run');
  if(l&&l.type==='run')return l;
  l={type:'run',track:'run',date:key(),week:session.w,day:session.d,session:session.name,prescription:session.detail,duration:'',distance:'',effort:'3',completedPlan:false,notes:'',completed:false};
  return putLog('run',l);
}
function priorExercise(track,name){
  const vals=Object.values(ensureLogs()).filter(x=>x&&x.type==='strength'&&x.track===track&&x.date<key());
  vals.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  for(const l of vals){const e=(l.exercises||[]).find(z=>z.name===name);if(e){const s=(e.sets||[]).filter(z=>z.done||z.reps||z.weight);if(s.length)return s[s.length-1]}}
  return null;
}

let modal=null,restTimer=null,restLeft=0,activeEx=0,elapsedTimer=null;
function ensureModal(){
  if(modal)return modal;
  modal=document.createElement('div');modal.id='pwTrainingModal';modal.className='pw-training-modal';modal.innerHTML='<div class="pw-train-shell"><div id="pwTrainBody"></div></div>';
  document.body.appendChild(modal);return modal;
}
function stopTimers(){if(restTimer){clearInterval(restTimer);restTimer=null}if(elapsedTimer){clearInterval(elapsedTimer);elapsedTimer=null}}
function closeTraining(){stopTimers();if(modal)modal.classList.remove('on');renderAll();show('exercise')}
function fmtElapsed(iso){const n=Math.max(0,Math.floor((Date.now()-new Date(iso).getTime())/1000)),m=Math.floor(n/60),s=n%60;return m+':'+String(s).padStart(2,'0')}
function startElapsed(log){
  if(elapsedTimer)clearInterval(elapsedTimer);
  elapsedTimer=setInterval(()=>{const e=document.getElementById('pwElapsed');if(e)e.textContent=fmtElapsed(log.startedAt)},1000)
}
function runRest(sec){
  restLeft=sec;if(restTimer)clearInterval(restTimer);const box=document.getElementById('pwRest');if(!box)return;
  box.classList.add('on');
  function paint(){const t=document.getElementById('pwRestTime');if(t)t.textContent=restLeft+'s';if(restLeft<=0){clearInterval(restTimer);restTimer=null;box.classList.add('done');setTimeout(()=>{box.classList.remove('on','done')},900)}}
  paint();restTimer=setInterval(()=>{restLeft--;paint()},1000)
}
function strengthModal(session){
  const l=strengthLog(session);activeEx=Math.min(activeEx,l.exercises.length-1);const e=l.exercises[activeEx],target=session.ex[activeEx];const prev=priorExercise(session.track,e.name);const m=ensureModal(),b=m.querySelector('#pwTrainBody');m.classList.add('on');
  b.innerHTML=`<header class="pw-train-head"><button id="pwCloseTrain" aria-label="Close">×</button><div><small>WEEK ${session.w} · SESSION ${session.d}</small><b>${esc(session.name)}</b></div><span id="pwElapsed">${fmtElapsed(l.startedAt)}</span></header>
  <div class="pw-train-progress"><i style="width:${((activeEx+1)/l.exercises.length)*100}%"></i></div>
  <section class="pw-ex-card"><div class="pw-ex-count">EXERCISE ${activeEx+1} OF ${l.exercises.length}</div><h1>${esc(e.name)}</h1><p>${esc(session.sets.label)} · target ${esc(target.r)}${prev?`<br><span>Last logged: ${esc(prev.weight||'—')}${target.w?' kg':''} × ${esc(prev.reps||'—')}</span>`:''}</p>
  <div class="pw-set-head"><span>SET</span>${target.w?'<span>KG</span>':''}<span>REPS</span><span>DONE</span></div>
  <div class="pw-set-list">${e.sets.map((s,i)=>`<div class="pw-set-row ${s.done?'done':''}" data-set="${i}"><b>${i+1}</b>${target.w?`<input data-f="weight" inputmode="decimal" type="number" min="0" step="0.5" value="${esc(s.weight)}" placeholder="kg">`:''}<input data-f="reps" inputmode="numeric" type="number" min="0" step="1" value="${esc(s.reps)}" placeholder="${esc(target.r.replace(/[^0-9–-].*$/,''))}"><button data-setdone="${i}">${s.done?'✓':'DONE'}</button></div>`).join('')}</div>
  ${session.sets.max>e.sets.length?'<button id="pwAddSet" class="pw-add-set">+ ADD OPTIONAL SET</button>':''}
  </section>
  <div class="pw-rest-choice"><span>REST BETWEEN SETS</span>${session.rest.map(x=>`<button data-rest="${x}" class="${+l.rest===x?'on':''}">${x}s</button>`).join('')}</div>
  <div id="pwRest" class="pw-rest"><span>REST</span><b id="pwRestTime">${l.rest}s</b><button id="pwRestSkip">SKIP</button><button id="pwRestPlus">+15s</button></div>
  <footer class="pw-train-nav"><button id="pwPrevEx" ${activeEx===0?'disabled':''}>← PREVIOUS</button><button id="pwNextEx" class="primary">${activeEx===l.exercises.length-1?'FINISH SESSION':'NEXT EXERCISE →'}</button></footer>`;
  b.querySelector('#pwCloseTrain').onclick=closeTraining;
  b.querySelectorAll('.pw-set-row input').forEach(inp=>inp.onchange=()=>{const row=inp.closest('.pw-set-row'),i=+row.dataset.set;l.exercises[activeEx].sets[i][inp.dataset.f]=inp.value;putLog(session.track,l)});
  b.querySelectorAll('[data-setdone]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.setdone,s=l.exercises[activeEx].sets[i];s.done=!s.done;putLog(session.track,l);if(s.done)runRest(+l.rest||session.rest[0]);strengthModal(session)});
  const add=b.querySelector('#pwAddSet');if(add)add.onclick=()=>{l.exercises[activeEx].sets.push({weight:'',reps:'',done:false});putLog(session.track,l);strengthModal(session)};
  b.querySelectorAll('[data-rest]').forEach(btn=>btn.onclick=()=>{l.rest=+btn.dataset.rest;putLog(session.track,l);strengthModal(session)});
  b.querySelector('#pwRestSkip').onclick=()=>{if(restTimer)clearInterval(restTimer);restTimer=null;b.querySelector('#pwRest').classList.remove('on')};
  b.querySelector('#pwRestPlus').onclick=()=>{restLeft+=15};
  b.querySelector('#pwPrevEx').onclick=()=>{activeEx--;strengthModal(session)};
  b.querySelector('#pwNextEx').onclick=()=>{if(activeEx<l.exercises.length-1){activeEx++;strengthModal(session)}else finishStrength(session,l)};
  startElapsed(l)
}
function finishStrength(session,l){
  stopTimers();l.completed=true;l.completedAt=new Date().toISOString();l.elapsedSec=Math.max(0,Math.floor((new Date(l.completedAt)-new Date(l.startedAt))/1000));putLog(session.track,l);markMove();const b=ensureModal().querySelector('#pwTrainBody');
  const sets=l.exercises.reduce((n,e)=>n+(e.sets||[]).filter(s=>s.done).length,0);
  b.innerHTML=`<div class="pw-finish"><div class="pw-finish-check">✓</div><small>SESSION COMPLETE</small><h1>${esc(session.name)}</h1><p>${sets} sets logged · ${Math.max(1,Math.round(l.elapsedSec/60))} minutes</p><button id="pwFinishClose">BACK TO EXERCISE</button></div>`;b.querySelector('#pwFinishClose').onclick=closeTraining
}

function runModal(session){
  const l=runLog(session),m=ensureModal(),b=m.querySelector('#pwTrainBody');m.classList.add('on');stopTimers();
  const pace=()=>{const d=parseFloat(l.distance),t=parseFloat(l.duration);if(!(d>0&&t>0))return '—';const p=t/d,mm=Math.floor(p),ss=Math.round((p-mm)*60);return mm+':'+String(ss).padStart(2,'0')+' / km'};
  b.innerHTML=`<header class="pw-train-head"><button id="pwCloseTrain">×</button><div><small>WEEK ${session.w} · SESSION ${session.d}</small><b>${esc(session.name)}</b></div><span>LOG</span></header>
  <section class="pw-run-card"><small>PLANNED SESSION</small><h1>${esc(session.name)}</h1><p>${esc(session.detail)}</p><div class="pw-run-note">You do not need to use the app while walking or running. Come back afterwards and log the session.</div>
  <label>ACTUAL TIME <span>minutes</span><input id="pwRunTime" type="number" inputmode="numeric" min="0" step="1" value="${esc(l.duration)}" placeholder="e.g. 30"></label>
  <label>DISTANCE <span>km · optional</span><input id="pwRunDistance" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(l.distance)}" placeholder="e.g. 4.2"></label>
  <div class="pw-pace"><span>AVERAGE PACE</span><b id="pwPace">${pace()}</b></div>
  <label>HOW HARD DID IT FEEL?<select id="pwRunEffort"><option value="1">1 · Very easy</option><option value="2">2 · Easy</option><option value="3">3 · Comfortable</option><option value="4">4 · Challenging</option><option value="5">5 · Hard</option></select></label>
  <label class="pw-run-check"><input id="pwRunPlan" type="checkbox" ${l.completedPlan?'checked':''}> I completed the planned session</label>
  <label>NOTES <span>optional</span><textarea id="pwRunNotes" placeholder="How did it go?">${esc(l.notes)}</textarea></label>
  <button id="pwSaveRun" class="pw-run-save">${l.completed?'UPDATE SESSION':'SAVE SESSION'}</button></section>`;
  b.querySelector('#pwCloseTrain').onclick=closeTraining;b.querySelector('#pwRunEffort').value=l.effort||'3';
  function sync(){l.duration=b.querySelector('#pwRunTime').value;l.distance=b.querySelector('#pwRunDistance').value;l.effort=b.querySelector('#pwRunEffort').value;l.completedPlan=b.querySelector('#pwRunPlan').checked;l.notes=b.querySelector('#pwRunNotes').value;putLog('run',l);b.querySelector('#pwPace').textContent=pace()}
  ['#pwRunTime','#pwRunDistance','#pwRunEffort','#pwRunPlan','#pwRunNotes'].forEach(s=>b.querySelector(s).onchange=sync);
  b.querySelector('#pwSaveRun').onclick=()=>{sync();l.completed=true;l.completedAt=new Date().toISOString();putLog('run',l);markMove();toast('Session logged');closeTraining()}
}

function trainingCard(){
  const r=document.getElementById('exercise');if(!r||r.querySelector('.pw-session-card'))return;
  const w=wk(),track=S.track,d=dayNo();if(!w||!track)return;
  const anchor=r.querySelector('.v3plans')||r.querySelector('.hero');if(!anchor)return;
  let html='',action=null;
  if(track==='gym'||track==='home'){
    const s=strengthSession(track,w,d),l=getLog(track);
    if(s){
      const done=!!(l&&l.completed);html=`<section class="pw-session-card ${done?'complete':''}"><div class="pw-session-top"><div><small>TODAY'S TRAINING</small><h2>${esc(s.name)}</h2><p>${esc(s.sets.label)} · Rest ${s.rest[0]}–${s.rest[1]} sec</p></div><span>${done?'DONE':'SESSION '+s.d}</span></div><button id="pwSessionAction">${done?'VIEW / EDIT LOG':'START SESSION'}</button></section>`;action=()=>strengthModal(s)
    }else html='<section class="pw-session-card rest"><small>TODAY</small><h2>Rest / mobility day</h2><p>Your next strength session will appear here on the next scheduled training day.</p></section>'
  }else if(track==='run'){
    const s=runningSession(w),l=getLog('run');if(s){const done=!!(l&&l.completed);html=`<section class="pw-session-card ${done?'complete':''}"><div class="pw-session-top"><div><small>TODAY'S WALK / RUN</small><h2>${esc(s.name)}</h2><p>${esc(s.detail)}</p></div><span>${done?'LOGGED':'SESSION '+s.d}</span></div><button id="pwSessionAction">${done?'VIEW / EDIT LOG':'LOG AFTER SESSION'}</button><div class="pw-session-hint">No live tracking needed. Do the session, then come back and record the result.</div></section>`;action=()=>runModal(s)}else html='<section class="pw-session-card rest"><small>TODAY</small><h2>Rest day</h2><p>No walking/running session is scheduled today.</p></section>'
  }
  if(!html)return;anchor.insertAdjacentHTML('afterend',html);const b=r.querySelector('#pwSessionAction');if(b&&action)b.onclick=action
}

const oldRender=renderExercise;
renderExercise=function(){oldRender();trainingCard()};
renderExercise();
})();