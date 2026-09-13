(function(){
'use strict';
if(window.__PW_SEQUENCE_TRAINING_V5__) return;
window.__PW_SEQUENCE_TRAINING_V5__=true;

const STRENGTH={
  gym:{
    label:'Basic Gym', rest:[60,75],
    sessions:[
      {name:'Lower Body A',guide:'/assets/pw-gym-page-06.jpg',ex:[
        {n:'Leg Press',r:'12',w:1,c:'Feet shoulder-width. Lower with control. Do not lock the knees.'},
        {n:'Goblet Squat',r:'12',w:1,c:'Hold one dumbbell at chest height. Sit down and back; keep chest up.'},
        {n:'Seated Leg Curl',r:'12',w:1,c:'Sit tall. Curl smoothly and squeeze the hamstrings.'},
        {n:'Leg Extension',r:'12',w:1,c:'Lift with control. Do not swing the weight.'},
        {n:'Hip Thrust / Glute Bridge',r:'12',w:1,c:'Drive hips up and squeeze the glutes at the top.'},
        {n:'Standing Calf Raise',r:'12',w:1,c:'Rise onto the toes, pause, then lower slowly.'}
      ]},
      {name:'Upper Body A',guide:'/assets/pw-gym-page-07.jpg',ex:[
        {n:'Lat Pulldown',r:'12',w:1,c:'Pull toward the upper chest. Drive the elbows down.'},
        {n:'Seated Chest Press',r:'12',w:1,c:'Press straight forward under control. Do not lock the elbows.'},
        {n:'Seated Cable Row',r:'12',w:1,c:'Pull the elbows back and squeeze the shoulder blades.'},
        {n:'Dumbbell Shoulder Press',r:'12',w:1,c:'Start at shoulder height. Press overhead without arching the back.'},
        {n:'Dumbbell Biceps Curl',r:'12',w:1,c:'Keep elbows close to the body. Do not swing.'},
        {n:'Cable Triceps Pushdown',r:'12',w:1,c:'Keep upper arms still and straighten the elbows under control.'}
      ]},
      {name:'Lower Body B + Core',guide:'/assets/pw-gym-page-08.jpg',ex:[
        {n:'Dumbbell Romanian Deadlift',r:'12',w:1,c:'Push the hips back, keep the spine long and load the hamstrings.'},
        {n:'Reverse Lunge',r:'12 each',w:1,c:'Step back under control. Push through the front foot to stand.'},
        {n:'Hip Abduction Machine',r:'12',w:1,c:'Open the knees under control. Avoid bouncing the stack.'},
        {n:'Hip Adduction Machine',r:'12',w:1,c:'Bring the legs together under control.'},
        {n:'Glute Kickback',r:'12 each',w:1,c:'Keep the pelvis stable and drive the leg back with the glute.'},
        {n:'Dead Bug',r:'12 total',w:0,c:'Extend opposite arm and leg while keeping the lower back controlled.'},
        {n:'Standard Plank',r:'30–45 sec',w:0,t:'seconds',c:'Forearms on the floor. Keep a straight line from head to heels.'}
      ]},
      {name:'Upper Body B + Full Body',guide:'/assets/pw-gym-page-09.jpg',ex:[
        {n:'Assisted Pull-Up OR Lat Pulldown',r:'12',w:1,c:'Choose the version that lets you control the full set.'},
        {n:'Incline Dumbbell Chest Press',r:'12',w:1,c:'Keep shoulder blades supported and press smoothly.'},
        {n:'One-Arm Dumbbell Row',r:'12 each',w:1,c:'Brace the torso and pull the elbow toward the hip.'},
        {n:'Dumbbell Lateral Raise',r:'12',w:1,c:'Use a light weight. Lift to about shoulder height.'},
        {n:'Dumbbell Squat to Press',r:'12',w:1,c:'Stand strongly from the squat before pressing overhead.'},
        {n:'Cable Biceps Curl',r:'12',w:1,c:'Keep elbows close and use a controlled range.'},
        {n:'Cable Triceps Pushdown',r:'12',w:1,c:'Keep upper arms still. Do not lean onto the cable.'}
      ]}
    ]
  },
  home:{
    label:'Home Dumbbell', rest:[45,60],
    sessions:[
      {name:'Lower Body A',guide:'/assets/pw-home-page-06.jpg',ex:[
        {n:'Goblet Squat',r:'8–12',w:1,c:'Hold one dumbbell at chest height. Sit down and back, keep chest up.'},
        {n:'Dumbbell Romanian Deadlift',r:'8–12',w:1,c:'Push the hips back, keep the spine long and load the hamstrings.'},
        {n:'Dumbbell Glute Bridge',r:'10–15',w:1,c:'Drive through the heels. Squeeze the glutes at the top. Lower slowly.'},
        {n:'Full Dead Bug',r:'6–10 / side',w:0,c:'Extend opposite arm and leg slowly. Keep the lower back controlled.'}
      ]},
      {name:'Upper Body A',guide:'/assets/pw-home-page-07.jpg',ex:[
        {n:'Dumbbell Floor Press',r:'8–12',w:1,c:'Press straight up. Keep shoulders down. Lower until the upper arms touch the floor.'},
        {n:'Supported One-Arm Row',r:'8–12 / arm',w:1,c:'Brace on a sturdy chair. Row the dumbbell toward your hip. Lower slowly.'},
        {n:'Seated Shoulder Press',r:'8–12',w:1,c:'Sit tall. Press overhead. Keep ribs down. Control the lowering phase.'},
        {n:'Overhead Triceps Extension',r:'8–12',w:1,c:'Keep elbows pointing up. Lower behind the head. Extend fully.'}
      ]},
      {name:'Lower Body B + Core',guide:'/assets/pw-home-page-08.jpg',ex:[
        {n:'Reverse Lunge',r:'8–10 / leg',w:1,c:'Step back under control. Push through the front foot to stand.'},
        {n:'Dumbbell Romanian Deadlift',r:'8–12',w:1,c:'Push the hips back. Keep the spine long and load the hamstrings.'},
        {n:'Sumo Squat',r:'10–12',w:1,c:'Take a wide stance. Sit down between the hips. Stand tall.'},
        {n:'Dumbbell Glute Bridge',r:'10–15',w:1,c:'Drive through the heels. Pause and squeeze the glutes at the top.'}
      ]},
      {name:'Upper Body B + Core',guide:'/assets/pw-home-page-09.jpg',ex:[
        {n:'Dumbbell Floor Press',r:'8–12',w:1,c:'Press upward with control. Lower until the upper arms touch the floor.'},
        {n:'Supported One-Arm Row',r:'8–12 / arm',w:1,c:'Keep a flat back. Pull toward the hip. Control the lowering.'},
        {n:'Overhead Triceps Extension',r:'8–12',w:1,c:'Elbows point up. Keep the upper arms steady. Extend fully.'},
        {n:'Full Dead Bug',r:'6–10 / side',w:0,c:'Extend opposite arm and leg while keeping the lower back controlled.'}
      ]}
    ]
  }
};

const RUN={
  1:[['Easy Walk','20 min easy walk. Comfortable pace.'],['Intervals','5 min easy + 5 × (1 min brisk / 1 min easy) + 5 min easy.'],['Recovery Walk','20 min recovery walk. Easy pace.'],['Longer Walk','25 min steady walk.']],
  2:[['Easy Walk','25 min easy walk.'],['Intervals','5 min easy + 5 × (1 min jog / 2 min walk) + 5 min easy.'],['Recovery Walk','20 min recovery walk.'],['Longer Walk','30 min steady walk.']],
  3:[['Easy Walk / Run','25 min easy walk/run. Add short jogs only if comfortable.'],['Intervals','5 min easy + 5 × (2 min jog / 2 min walk) + 5 min easy.'],['Recovery Walk','25 min easy recovery walk.'],['Longer Walk / Run','30 min easy walk/run.']],
  4:[['Easy Walk / Run','25 min easy walk/run.'],['Intervals','5 min easy + 4 × (3 min run / 2 min walk) + 5 min easy.'],['Recovery Walk','25 min easy recovery walk.'],['Longer Walk / Run','35 min easy walk/run.']],
  5:[['Easy Run / Walk','30 min easy run/walk.'],['Intervals','5 min easy + 4 × (4 min run / 2 min walk) + easy cool-down.'],['Recovery Walk','25–30 min easy recovery walk.'],['Longer Run / Walk','35 min easy run/walk.']],
  6:[['Easy Run / Walk','30 min easy run/walk.'],['Intervals','5 min easy + 4 × (5 min run / 2 min walk) + easy cool-down.'],['Recovery Walk','25–30 min easy recovery walk.'],['Longer Run / Walk','40 min easy run/walk.']],
  7:[['Easy Run','30 min easy conversational run. Walk whenever needed.'],['Intervals','5 min easy + 4 × (6 min run / 2 min walk) + easy cool-down.'],['Recovery Walk','30 min easy recovery walk.'],['Longer Run','40 min mostly running with walk breaks if needed.']],
  8:[['Easy Run','30 min easy conversational run.'],['Intervals','5 min easy + 3 × (8 min run / 2 min walk) + 5 min easy.'],['Recovery Walk','30 min easy recovery walk.'],['Longer Run','40 min continuous easy run OR run/walk.']]
};

const TRACKS={gym:'Basic Gym',home:'Home Dumbbell',run:'Walking & Running'};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const curWeek=()=>{try{return Math.max(0,Math.min(8,+week()||0))}catch(e){return 0}};
const today=()=>{try{return dateKey()}catch(e){return new Date().toISOString().slice(0,10)}};
const saveState=()=>{try{save()}catch(e){}};
const logs=()=>{S.trainingLogs=S.trainingLogs||{};return S.trainingLogs};
const seqKey=(track,w,s)=>`seq|${track}|${w}|${s}`;

function strengthProgression(track,w){
  if(track==='gym') return w===1?{min:2,max:2,label:'2 sets × 12 reps'}:w===2?{min:2,max:3,label:'2–3 sets × 12 reps'}:{min:3,max:3,label:'3 sets × 12 reps'};
  return w<=2?{min:2,max:2,label:'2 sets'}:w<=4?{min:2,max:3,label:'2–3 sets'}:{min:3,max:3,label:'3 sets'};
}
function strengthSession(track,w,s){
  const cfg=STRENGTH[track]; if(!cfg||!cfg.sessions||!cfg.sessions[s-1])return null;
  const src=cfg.sessions[s-1];
  return {track,w,s,name:src.name,guide:src.guide,ex:src.ex.map(x=>({...x})),sets:strengthProgression(track,w),rest:cfg.rest};
}
function runSession(w,s){const x=RUN[w]&&RUN[w][s-1];return x?{track:'run',w,s,name:x[0],detail:x[1]}:null}
function sessionFor(track,w,s){return track==='run'?runSession(w,s):strengthSession(track,w,s)}
function oldLog(track,w,s){return Object.values(logs()).find(l=>l&&l.track===track&&+l.week===w&&+l.day===s&&l.completed)}
function getSeq(track,w,s){return logs()[seqKey(track,w,s)]||oldLog(track,w,s)||null}
function putSeq(track,w,s,obj){logs()[seqKey(track,w,s)]=obj;saveState();return obj}
function completed(track,w,s){const l=getSeq(track,w,s);return !!(l&&l.completed)}
function completedCount(track,w){let n=0;for(let s=1;s<=4;s++)if(completed(track,w,s))n++;return n}
function earliestDue(track){
  const cw=curWeek(); if(cw<1)return null;
  for(let w=1;w<=cw;w++) for(let s=1;s<=4;s++) if(!completed(track,w,s)) return {w,s};
  return cw<8?null:{w:8,s:4,done:true};
}
function canOpen(track,w,s){
  const cw=curWeek();
  if(w>cw || cw<1) return false;
  if(completed(track,w,s)) return true;
  const due=earliestDue(track);
  return !!(due&&due.w===w&&due.s===s);
}
function isCatchup(w,s,track){const due=earliestDue(track);return !!(due&&due.w===w&&due.s===s&&w<curWeek())}
function markMove(){S.days=S.days||{};S.days[today()]=S.days[today()]||{};S.days[today()].move=true;saveState()}
function fmtDate(d){if(!d)return '';try{return new Date(d+'T12:00:00').toLocaleDateString('en-ZA',{day:'numeric',month:'short'})}catch(e){return d}}

let modal=null,restTimer=null,restLeft=0,activeEx=0,elapsedTimer=null;
function ensureModal(){if(modal)return modal;modal=document.createElement('div');modal.id='pwSequenceModal';modal.className='pw-training-modal';modal.innerHTML='<div class="pw-train-shell"><div id="pwSequenceBody"></div></div>';document.body.appendChild(modal);return modal}
function stopTimers(){if(restTimer){clearInterval(restTimer);restTimer=null}if(elapsedTimer){clearInterval(elapsedTimer);elapsedTimer=null}}
function closeModal(){stopTimers();if(modal)modal.classList.remove('on');renderSequence()}
function fmtElapsed(iso){const n=Math.max(0,Math.floor((Date.now()-new Date(iso).getTime())/1000)),m=Math.floor(n/60),s=n%60;return `${m}:${String(s).padStart(2,'0')}`}
function startElapsed(log){if(elapsedTimer)clearInterval(elapsedTimer);elapsedTimer=setInterval(()=>{const el=document.getElementById('pwSeqElapsed');if(el)el.textContent=fmtElapsed(log.startedAt)},1000)}
function runRest(sec){restLeft=sec;if(restTimer)clearInterval(restTimer);const box=document.getElementById('pwSeqRest');if(!box)return;box.classList.add('on');box.classList.remove('done');const paint=()=>{const t=document.getElementById('pwSeqRestTime');if(t)t.textContent=restLeft+'s';if(restLeft<=0){clearInterval(restTimer);restTimer=null;box.classList.add('done');setTimeout(()=>box.classList.remove('on','done'),900)}};paint();restTimer=setInterval(()=>{restLeft--;paint()},1000)}
function priorExercise(track,name,w,s){const arr=[];for(const l of Object.values(logs()))if(l&&l.type==='strength'&&l.track===track&&l.completed&&(l.week<w||(l.week===w&&l.sessionNo<s)))arr.push(l);arr.sort((a,b)=>String(b.completedAt||b.date||'').localeCompare(String(a.completedAt||a.date||'')));for(const l of arr){const e=(l.exercises||[]).find(z=>z.name===name);if(e){const done=(e.sets||[]).filter(x=>x.done||x.reps||x.weight);if(done.length)return done[done.length-1]}}return null}
function newStrengthLog(session){
  const existing=getSeq(session.track,session.w,session.s);
  if(existing&&!existing.completed&&existing.type==='strength')return existing;
  return putSeq(session.track,session.w,session.s,{type:'strength',track:session.track,week:session.w,sessionNo:session.s,date:today(),session:session.name,startedAt:new Date().toISOString(),completed:false,rest:session.rest[0],exercises:session.ex.map(x=>({name:x.n,target:x.r,weight:!!x.w,sets:Array.from({length:session.sets.min},()=>({weight:'',reps:'',done:false}))}))});
}
function syncInputs(body,log){body.querySelectorAll('.pw-set-row').forEach(row=>{const i=+row.dataset.set,w=row.querySelector('[data-f="weight"]'),r=row.querySelector('[data-f="reps"]');if(w)log.exercises[activeEx].sets[i].weight=w.value;if(r)log.exercises[activeEx].sets[i].reps=r.value})}
function strengthModal(session){
  stopTimers();const log=newStrengthLog(session);activeEx=Math.min(activeEx,log.exercises.length-1);const ex=log.exercises[activeEx],target=session.ex[activeEx],prev=priorExercise(session.track,ex.name,session.w,session.s),m=ensureModal(),body=m.querySelector('#pwSequenceBody');m.classList.add('on');
  body.innerHTML=`<header class="pw-train-head"><button id="pwSeqClose" aria-label="Close">×</button><div><small>WEEK ${session.w} · SESSION ${session.s}</small><b>${esc(session.name)}</b></div><span id="pwSeqElapsed">${fmtElapsed(log.startedAt)}</span></header><div class="pw-train-progress"><i style="width:${((activeEx+1)/log.exercises.length)*100}%"></i></div>${session.guide?`<details class="pw-session-guide"><summary>VIEW APPROVED SESSION GUIDE</summary><img src="${esc(session.guide)}" alt="${esc(session.name)} approved workout guide"></details>`:''}<section class="pw-ex-card"><div class="pw-ex-count">EXERCISE ${activeEx+1} OF ${log.exercises.length}</div><h1>${esc(ex.name)}</h1><p class="pw-ex-cue">${esc(target.c||'')}</p><p>${esc(session.sets.label)} · target ${esc(target.r)}${prev?`<br><span>Last logged: ${esc(prev.weight||'—')}${target.w?' kg':''} × ${esc(prev.reps||'—')}</span>`:''}</p><div class="pw-set-head ${target.w?'':'no-weight'}"><span>SET</span>${target.w?'<span>KG</span>':''}<span>${target.t==='seconds'?'SECONDS':'REPS'}</span><span>DONE</span></div><div class="pw-set-list">${ex.sets.map((x,i)=>`<div class="pw-set-row ${target.w?'':'no-weight'} ${x.done?'done':''}" data-set="${i}"><b>${i+1}</b>${target.w?`<input data-f="weight" inputmode="decimal" type="number" min="0" step="0.5" value="${esc(x.weight)}" placeholder="kg">`:''}<input data-f="reps" inputmode="numeric" type="number" min="0" step="1" value="${esc(x.reps)}" placeholder="${target.t==='seconds'?'sec':'reps'}"><button data-setdone="${i}">${x.done?'✓':'DONE'}</button></div>`).join('')}</div>${session.sets.max>ex.sets.length?'<button id="pwSeqAddSet" class="pw-add-set">+ ADD OPTIONAL SET</button>':''}</section><div class="pw-rest-choice"><span>REST BETWEEN SETS</span>${session.rest.map(x=>`<button data-rest="${x}" class="${+log.rest===x?'on':''}">${x}s</button>`).join('')}</div><div id="pwSeqRest" class="pw-rest"><span>REST</span><b id="pwSeqRestTime">${log.rest}s</b><button id="pwSeqRestSkip">SKIP</button><button id="pwSeqRestPlus">+15s</button></div><footer class="pw-train-nav"><button id="pwSeqPrev" ${activeEx===0?'disabled':''}>← PREVIOUS</button><button id="pwSeqNext" class="primary">${activeEx===log.exercises.length-1?'FINISH SESSION':'NEXT EXERCISE →'}</button></footer>`;
  body.querySelector('#pwSeqClose').onclick=()=>{syncInputs(body,log);putSeq(session.track,session.w,session.s,log);closeModal()};body.querySelectorAll('.pw-set-row input').forEach(inp=>inp.onchange=()=>{syncInputs(body,log);putSeq(session.track,session.w,session.s,log)});body.querySelectorAll('[data-setdone]').forEach(btn=>btn.onclick=()=>{syncInputs(body,log);const i=+btn.dataset.setdone;log.exercises[activeEx].sets[i].done=!log.exercises[activeEx].sets[i].done;putSeq(session.track,session.w,session.s,log);const done=log.exercises[activeEx].sets[i].done;strengthModal(session);if(done)requestAnimationFrame(()=>runRest(+log.rest||session.rest[0]))});const add=body.querySelector('#pwSeqAddSet');if(add)add.onclick=()=>{syncInputs(body,log);log.exercises[activeEx].sets.push({weight:'',reps:'',done:false});putSeq(session.track,session.w,session.s,log);strengthModal(session)};body.querySelectorAll('[data-rest]').forEach(btn=>btn.onclick=()=>{syncInputs(body,log);log.rest=+btn.dataset.rest;putSeq(session.track,session.w,session.s,log);strengthModal(session)});body.querySelector('#pwSeqRestSkip').onclick=()=>{if(restTimer)clearInterval(restTimer);restTimer=null;body.querySelector('#pwSeqRest').classList.remove('on')};body.querySelector('#pwSeqRestPlus').onclick=()=>{restLeft+=15;const t=body.querySelector('#pwSeqRestTime');if(t)t.textContent=restLeft+'s'};body.querySelector('#pwSeqPrev').onclick=()=>{syncInputs(body,log);putSeq(session.track,session.w,session.s,log);activeEx--;strengthModal(session)};body.querySelector('#pwSeqNext').onclick=()=>{syncInputs(body,log);putSeq(session.track,session.w,session.s,log);if(activeEx<log.exercises.length-1){activeEx++;strengthModal(session)}else finishStrength(session,log)};startElapsed(log)
}
function finishStrength(session,log){stopTimers();log.completed=true;log.completedAt=new Date().toISOString();log.completedDate=today();log.elapsedSec=Math.max(0,Math.floor((new Date(log.completedAt)-new Date(log.startedAt))/1000));putSeq(session.track,session.w,session.s,log);markMove();const sets=log.exercises.reduce((n,e)=>n+(e.sets||[]).filter(x=>x.done).length,0),body=ensureModal().querySelector('#pwSequenceBody');body.innerHTML=`<div class="pw-finish"><div class="pw-finish-check">✓</div><small>SESSION ${session.s} COMPLETE</small><h1>${esc(session.name)}</h1><p>${sets} sets logged · ${Math.max(1,Math.round(log.elapsedSec/60))} minutes</p><div class="pw-finish-next">Your next training session is now unlocked.</div><button id="pwSeqFinishClose">BACK TO PROGRAM</button></div>`;body.querySelector('#pwSeqFinishClose').onclick=closeModal}
function runModal(session){
  let log=getSeq('run',session.w,session.s);if(!log||log.completed||log.type!=='run')log={type:'run',track:'run',week:session.w,sessionNo:session.s,date:today(),session:session.name,prescription:session.detail,duration:'',distance:'',effort:'3',completedPlan:false,notes:'',completed:false};
  const m=ensureModal(),body=m.querySelector('#pwSequenceBody');m.classList.add('on');stopTimers();const pace=()=>{const d=parseFloat(log.distance),t=parseFloat(log.duration);if(!(d>0&&t>0))return '—';const p=t/d,mm=Math.floor(p),ss=Math.round((p-mm)*60);return `${mm}:${String(ss).padStart(2,'0')} / km`};
  body.innerHTML=`<header class="pw-train-head"><button id="pwSeqClose">×</button><div><small>WEEK ${session.w} · SESSION ${session.s}</small><b>${esc(session.name)}</b></div><span>LOG</span></header><section class="pw-run-card"><small>PLANNED SESSION</small><h1>${esc(session.name)}</h1><p>${esc(session.detail)}</p><div class="pw-run-note">Do the session without using the app. Come back afterwards and log what you did.</div><label>ACTUAL TIME <span>minutes</span><input id="pwSeqRunTime" type="number" inputmode="numeric" min="0" step="1" value="${esc(log.duration)}" placeholder="e.g. 30"></label><label>DISTANCE <span>km · optional</span><input id="pwSeqRunDistance" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(log.distance)}" placeholder="e.g. 4.2"></label><div class="pw-run-pace"><span>AVERAGE PACE</span><b id="pwSeqRunPace">${pace()}</b></div><label>EFFORT <span>1 easy · 5 very hard</span><select id="pwSeqRunEffort">${[1,2,3,4,5].map(x=>`<option ${String(log.effort)===String(x)?'selected':''}>${x}</option>`).join('')}</select></label><label class="pw-run-check"><input id="pwSeqRunPlan" type="checkbox" ${log.completedPlan?'checked':''}> I completed the planned session</label><label>NOTES <span>optional</span><textarea id="pwSeqRunNotes" rows="3" placeholder="How did it feel?">${esc(log.notes)}</textarea></label></section><footer class="pw-train-nav"><button id="pwSeqRunCancel">CANCEL</button><button id="pwSeqRunSave" class="primary">SAVE SESSION</button></footer>`;
  const pull=()=>{log.duration=body.querySelector('#pwSeqRunTime').value;log.distance=body.querySelector('#pwSeqRunDistance').value;log.effort=body.querySelector('#pwSeqRunEffort').value;log.completedPlan=body.querySelector('#pwSeqRunPlan').checked;log.notes=body.querySelector('#pwSeqRunNotes').value;body.querySelector('#pwSeqRunPace').textContent=pace()};body.querySelector('#pwSeqClose').onclick=closeModal;body.querySelector('#pwSeqRunCancel').onclick=closeModal;body.querySelector('#pwSeqRunTime').oninput=pull;body.querySelector('#pwSeqRunDistance').oninput=pull;body.querySelector('#pwSeqRunSave').onclick=()=>{pull();if(!log.duration){body.querySelector('#pwSeqRunTime').focus();return}log.completed=true;log.completedAt=new Date().toISOString();log.completedDate=today();putSeq('run',session.w,session.s,log);markMove();closeModal()}
}
function openSession(track,w,s){if(!canOpen(track,w,s))return;const session=sessionFor(track,w,s);if(!session)return;activeEx=0;if(completed(track,w,s)){showCompleted(session,getSeq(track,w,s));return}track==='run'?runModal(session):strengthModal(session)}
function showCompleted(session,log){
  const m=ensureModal(),body=m.querySelector('#pwSequenceBody');m.classList.add('on');stopTimers();
  if(session.track==='run'){
    const d=parseFloat(log.distance),t=parseFloat(log.duration),p=(d>0&&t>0)?(()=>{const x=t/d,mm=Math.floor(x),ss=Math.round((x-mm)*60);return `${mm}:${String(ss).padStart(2,'0')} / km`})():'—';
    body.innerHTML=`<header class="pw-train-head"><button id="pwSeqClose">×</button><div><small>WEEK ${session.w} · SESSION ${session.s}</small><b>${esc(session.name)}</b></div><span>DONE</span></header><section class="pw-run-card"><small>COMPLETED ${esc(fmtDate(log.completedDate||log.date))}</small><h1>${esc(session.name)}</h1><p>${esc(session.detail)}</p><div class="pw-run-summary"><div><span>TIME</span><b>${esc(log.duration||'—')} min</b></div><div><span>DISTANCE</span><b>${esc(log.distance||'—')} km</b></div><div><span>PACE</span><b>${esc(p)}</b></div><div><span>EFFORT</span><b>${esc(log.effort||'—')}/5</b></div></div>${log.notes?`<p class="pw-log-note">${esc(log.notes)}</p>`:''}</section><footer class="pw-train-nav"><button id="pwSeqDoneClose" class="primary">BACK TO PROGRAM</button></footer>`;
  }else{
    const sets=(log.exercises||[]).reduce((n,e)=>n+(e.sets||[]).filter(x=>x.done).length,0);body.innerHTML=`<div class="pw-finish"><div class="pw-finish-check">✓</div><small>COMPLETED ${esc(fmtDate(log.completedDate||log.date))}</small><h1>${esc(session.name)}</h1><p>${sets} sets logged${log.elapsedSec?` · ${Math.max(1,Math.round(log.elapsedSec/60))} minutes`:''}</p><button id="pwSeqDoneClose">BACK TO PROGRAM</button></div>`;
  }
  body.querySelector('#pwSeqClose')?.addEventListener('click',closeModal);body.querySelector('#pwSeqDoneClose').onclick=closeModal;
}
function chooseTrack(){const m=ensureModal(),body=m.querySelector('#pwSequenceBody');m.classList.add('on');stopTimers();body.innerHTML=`<header class="pw-train-head"><button id="pwSeqClose">×</button><div><small>EXERCISE PROGRAM</small><b>Choose your program</b></div></header><div class="pw-seq-track-picker"><button data-track="gym"><b>Basic Gym</b><span>4 sessions each week · interactive set logging</span></button><button data-track="home"><b>Home Dumbbell</b><span>4 sessions each week · interactive set logging</span></button><button data-track="run"><b>Walking & Running</b><span>4 sessions each week · log after the session</span></button></div>`;body.querySelector('#pwSeqClose').onclick=closeModal;body.querySelectorAll('[data-track]').forEach(btn=>btn.onclick=()=>{S.track=btn.dataset.track;saveState();closeModal()})}
function sessionCard(track,w,s){const session=sessionFor(track,w,s),log=getSeq(track,w,s),done=completed(track,w,s),open=canOpen(track,w,s),catchup=isCatchup(w,s,track),locked=!done&&!open,status=done?`DONE · ${fmtDate(log.completedDate||log.date)}`:catchup?'CATCH UP NEXT':open?'NEXT UP':w>curWeek()?'NOT YET':'LOCKED',detail=track==='run'?session.detail:(session.sets.label+' · '+session.ex.length+' exercises');return `<button class="pw-seq-session ${done?'done':''} ${open&&!done?'next':''} ${locked?'locked':''}" data-open-session="${w}|${s}" ${locked?'disabled':''}><span class="pw-seq-num">${done?'✓':s}</span><span class="pw-seq-copy"><small>SESSION ${s}</small><b>${esc(session.name)}</b><em>${esc(detail)}</em></span><span class="pw-seq-status">${esc(status)}</span></button>`}
function weekBlock(track,w){const count=completedCount(track,w),cw=curWeek(),isCurrent=w===cw,hasCatchup=w<cw&&count<4,label=count===4?'COMPLETE':hasCatchup?'CATCH-UP':isCurrent?'THIS WEEK':w>cw?'UPCOMING':'IN PROGRESS',expanded=isCurrent||hasCatchup||(cw===0&&w===1);return `<section class="pw-seq-week ${isCurrent?'current':''} ${hasCatchup?'catchup':''} ${w>cw?'future':''}"><button class="pw-seq-week-head" data-week-toggle="${w}"><div><small>WEEK ${w}</small><h3>${count}/4 sessions complete</h3></div><span>${label}</span><i>${expanded?'−':'+'}</i></button><div class="pw-seq-week-body ${expanded?'open':''}" data-week-body="${w}">${[1,2,3,4].map(s=>sessionCard(track,w,s)).join('')}</div></section>`}
function renderSequence(){
  const root=document.getElementById('exercise');if(!root)return;const track=TRACKS[S.track]?S.track:'gym';if(!S.track){S.track=track;saveState()}const cw=curWeek(),due=earliestDue(track);let banner='Your sessions stay in order. Move them to another day if life gets in the way.';if(cw===0)banner='Your program starts with Week 1. Sessions unlock in order when the challenge begins.';else if(due&&due.w<cw)banner=`You have a catch-up session from Week ${due.w}. Finish it first, then continue in sequence.`;else if(due)banner=`Next up: Week ${due.w}, Session ${due.s}. The day can move — the order does not.`;else banner='You are fully caught up. Nice work.';
  root.innerHTML=`<div class="pw-seq-page"><div class="pw-seq-title"><div><small>YOUR PROGRAM</small><h1>${esc(TRACKS[track])}</h1><p>4 sessions per week · always in sequence</p></div><button id="pwSeqChange">CHANGE</button></div><div class="pw-seq-rule"><b>FLEXIBLE DAYS. FIXED ORDER.</b><span>${esc(banner)}</span></div><div class="pw-seq-weeks">${Array.from({length:8},(_,i)=>weekBlock(track,i+1)).join('')}</div></div>`;
  root.querySelector('#pwSeqChange').onclick=chooseTrack;root.querySelectorAll('[data-week-toggle]').forEach(btn=>btn.onclick=()=>{const w=btn.dataset.weekToggle,body=root.querySelector(`[data-week-body="${w}"]`);body.classList.toggle('open');btn.querySelector('i').textContent=body.classList.contains('open')?'−':'+'});root.querySelectorAll('[data-open-session]').forEach(btn=>btn.onclick=()=>{const [w,s]=btn.dataset.openSession.split('|').map(Number);openSession(track,w,s)});
}
function hook(){const nav=document.querySelector('[data-screen="exercise"]');if(nav&&!nav.dataset.seqHook){nav.dataset.seqHook='1';nav.addEventListener('click',()=>setTimeout(renderSequence,0))}renderSequence()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hook,0));else setTimeout(hook,0);setTimeout(hook,350);
})();