from pathlib import Path
import base64
import re

ROOT=Path('perfect-women-start-here')

def write_b64(src: Path, dst: Path):
    dst.write_text(base64.b64encode(src.read_bytes()).decode())

# ---- Training engine ----
p=ROOT/'dev_sources/pw-training-sequence-v5.js'
s=p.read_text()

if 'const HIIT=[' not in s:
    hiit="""
const HIIT=[
  {name:'Circuit 1 — Upper + Cardio',kind:'circuit',detail:'Cycle through the sequence until you reach 20 minutes.',duration:20,ex:[
    {n:'Jump Rope or Cross Jacks',v:'30 sec'},
    {n:'Wall Push-Ups',v:'10 reps'},
    {n:'Small Arm Circles',v:'30 reps'},
    {n:'High Knees',v:'30 sec'},
    {n:'Dumbbell Shoulder Press',v:'10 reps · household object is fine'},
    {n:'Wall Push-Ups',v:'10 reps'},
    {n:'Punches',v:'50 reps'},
    {n:'Tricep Kickback',v:'10 / arm · dumbbell or household object'},
    {n:'Large Arm Circles',v:'30 reps'}
  ]},
  {name:'Pyramid Workout',kind:'pyramid',detail:'10 rounds. Every round do one rep less of each exercise. Squats stay at a minimum of 1 rep.',duration:20,rounds:10,ex:[
    {n:'Squat / Chair Squat',base:8,v:'8 reps'},
    {n:'Star Jumps',base:20,v:'20 reps'},
    {n:'Plank with Reach',base:10,v:'10 reps'},
    {n:'Punches',base:20,v:'20 reps'},
    {n:'Sit-Up',base:10,v:'10 reps'},
    {n:'Heel Tap',base:40,v:'40 reps'}
  ]},
  {name:'Circuit 2 — Full Body',kind:'circuit',detail:'Complete the sequence repeatedly for 20 minutes.',duration:20,ex:[
    {n:'Jump Rope or Cross Jacks',v:'30 sec'},
    {n:'Bodyweight / Chair Squats',v:'10 reps'},
    {n:'Superman',v:'10 reps'},
    {n:'High Knees',v:'30 sec'},
    {n:'Simple Lunges',v:'10 / leg'},
    {n:'Reverse Crunch',v:'10 reps'},
    {n:'Skaters',v:'30 sec'},
    {n:'Glute Bridges',v:'10 reps'},
    {n:'Dead Bug',v:'10 reps'}
  ]},
  {name:'Strength + Conditioning',kind:'sets',detail:'Structured work with one-minute rests. Complete the prescribed sets within the 20-minute session.',duration:20,ex:[
    {n:'High Knees',v:'30 sec × 3',sets:3},
    {n:'Hip Flexor Stretch',v:'30 sec / leg × 2',sets:2},
    {n:'Squat / Chair Squat',v:'10 reps × 3',sets:3},
    {n:'Glute Bridges',v:'12 reps × 3',sets:3},
    {n:'Lunges',v:'10 / leg × 3',sets:3},
    {n:'Mountain Climbers',v:'30 reps × 3',sets:3}
  ]}
];
"""
    s=s.replace('\nconst RUN={',hiit+'\nconst RUN={')

s=s.replace("const TRACKS={gym:'Basic Gym',home:'Home Dumbbell',run:'Walking & Running'};",
            "const TRACKS={gym:'Basic Gym',home:'Home Dumbbell',hiit:'Home HIIT',run:'Walking & Running'};")

old="function runSession(w,s){const x=RUN[w]&&RUN[w][s-1];return x?{track:'run',w,s,name:x[0],detail:x[1]}:null}\nfunction sessionFor(track,w,s){return track==='run'?runSession(w,s):strengthSession(track,w,s)}"
new="function runSession(w,s){const x=RUN[w]&&RUN[w][s-1];return x?{track:'run',w,s,name:x[0],detail:x[1]}:null}\nfunction hiitSession(w,s){const x=HIIT[s-1];return x?{track:'hiit',w,s,name:x.name,kind:x.kind,detail:x.detail,duration:x.duration||20,rounds:x.rounds||0,ex:x.ex.map(z=>({...z}))}:null}\nfunction sessionFor(track,w,s){return track==='run'?runSession(w,s):track==='hiit'?hiitSession(w,s):strengthSession(track,w,s)}"
if 'function hiitSession(' not in s:
    if old not in s: raise SystemExit('sessionFor anchor missing')
    s=s.replace(old,new)

if 'function hiitModal(session)' not in s:
    helper=r'''
let hiitTimer=null;
function hiitTarget(session,ex,round){if(session.kind!=='pyramid')return ex.v||'';return Math.max(1,(+ex.base||1)-Math.max(0,(round||1)-1))+' reps'}
function hiitLog(session){let log=getSeq('hiit',session.w,session.s);if(log&&!log.completed&&log.type==='hiit')return log;log={type:'hiit',track:'hiit',week:session.w,sessionNo:session.s,date:today(),session:session.name,startedAt:new Date().toISOString(),remainingSec:1200,running:false,round:1,roundsDone:0,checks:{},setCounts:{},notes:'',completed:false};putSeq('hiit',session.w,session.s,log);return log}
function hiitModal(session){
  stopTimers();if(hiitTimer){clearInterval(hiitTimer);hiitTimer=null}const log=hiitLog(session),m=ensureModal(),body=m.querySelector('#pwSequenceBody');m.classList.add('on');
  function timeText(){const n=Math.max(0,+log.remainingSec||0),mm=Math.floor(n/60),ss=n%60;return `${mm}:${String(ss).padStart(2,'0')}`}
  function target(ex){return hiitTarget(session,ex,log.round)}
  function persist(){putSeq('hiit',session.w,session.s,log)}
  function rows(){return session.ex.map((x,i)=>{if(session.kind==='sets'){const done=+(log.setCounts[i]||0),total=+(x.sets||1);return `<button class="pw-hiit-row ${done>=total?'done':''}" data-hiit-set="${i}"><span>${i+1}</span><b>${esc(x.n)}</b><em>${esc(x.v)}</em><strong>${done}/${total} DONE</strong></button>`}const done=!!log.checks[i];return `<button class="pw-hiit-row ${done?'done':''}" data-hiit-check="${i}"><span>${i+1}</span><b>${esc(x.n)}</b><em>${esc(target(x))}</em><strong>${done?'✓ DONE':'TAP DONE'}</strong></button>`}).join('')}
  body.innerHTML=`<header class="pw-train-head"><button id="pwSeqClose">×</button><div><small>WEEK ${session.w} · SESSION ${session.s}</small><b>${esc(session.name)}</b></div><span>20 MIN</span></header><section class="pw-hiit-card"><div class="pw-hiit-clock"><small>SESSION TIMER</small><b id="pwHiitClock">${timeText()}</b><button id="pwHiitTimerBtn">${log.running?'PAUSE':'START'}</button></div><p class="pw-hiit-rule">${esc(session.detail)}</p><div class="pw-hiit-meta">${session.kind==='pyramid'?`ROUND <b>${log.round}/10</b>`:session.kind==='circuit'?`ROUNDS COMPLETE <b>${log.roundsDone}</b>`:'Complete each prescribed set in order.'}</div><div class="pw-hiit-list">${rows()}</div>${session.kind==='sets'?'<button id="pwHiitRest" class="pw-hiit-round">REST 60 SECONDS</button>':`<button id="pwHiitRound" class="pw-hiit-round">${session.kind==='pyramid'?'ROUND COMPLETE':'ROUND COMPLETE + RESET'}</button>`}<div id="pwHiitRestBox" class="pw-hiit-rest"></div><label class="pw-hiit-notes">SESSION NOTE <textarea id="pwHiitNotes" rows="2" placeholder="Optional">${esc(log.notes||'')}</textarea></label></section><footer class="pw-train-nav"><button id="pwHiitSave">SAVE + CLOSE</button><button id="pwHiitFinish" class="primary">FINISH SESSION</button></footer>`;
  function startTick(){if(hiitTimer)clearInterval(hiitTimer);if(!log.running)return;hiitTimer=setInterval(()=>{log.remainingSec=Math.max(0,(+log.remainingSec||0)-1);const c=body.querySelector('#pwHiitClock');if(c)c.textContent=timeText();if(log.remainingSec<=0){log.running=false;clearInterval(hiitTimer);hiitTimer=null;const b=body.querySelector('#pwHiitTimerBtn');if(b)b.textContent='TIME';persist()}},1000)}
  body.querySelector('#pwSeqClose').onclick=()=>{log.notes=body.querySelector('#pwHiitNotes').value;log.running=false;persist();if(hiitTimer)clearInterval(hiitTimer);hiitTimer=null;closeModal()};
  body.querySelector('#pwHiitTimerBtn').onclick=()=>{log.running=!log.running;body.querySelector('#pwHiitTimerBtn').textContent=log.running?'PAUSE':'START';persist();startTick()};
  body.querySelectorAll('[data-hiit-check]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.hiitCheck;log.checks[i]=!log.checks[i];persist();hiitModal(session)});
  body.querySelectorAll('[data-hiit-set]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.hiitSet,total=+(session.ex[i].sets||1);log.setCounts[i]=Math.min(total,(+log.setCounts[i]||0)+1);persist();hiitModal(session)});
  const round=body.querySelector('#pwHiitRound');if(round)round.onclick=()=>{log.roundsDone=(+log.roundsDone||0)+1;if(session.kind==='pyramid')log.round=Math.min(10,(+log.round||1)+1);log.checks={};persist();hiitModal(session)};
  const rest=body.querySelector('#pwHiitRest');if(rest)rest.onclick=()=>{let left=60,box=body.querySelector('#pwHiitRestBox');box.textContent='REST 60s';const id=setInterval(()=>{left--;box.textContent=left>0?`REST ${left}s`:'REST COMPLETE';if(left<=0)clearInterval(id)},1000)};
  body.querySelector('#pwHiitSave').onclick=()=>{log.notes=body.querySelector('#pwHiitNotes').value;log.running=false;persist();if(hiitTimer)clearInterval(hiitTimer);hiitTimer=null;closeModal()};
  body.querySelector('#pwHiitFinish').onclick=()=>{log.notes=body.querySelector('#pwHiitNotes').value;log.running=false;log.completed=true;log.completedAt=new Date().toISOString();log.completedDate=today();log.elapsedSec=Math.max(0,1200-(+log.remainingSec||0));persist();markMove();if(hiitTimer)clearInterval(hiitTimer);hiitTimer=null;closeModal()};
  startTick();
}
'''
    anchor='function openSession(track,w,s){'
    if anchor not in s: raise SystemExit('openSession anchor missing')
    s=s.replace(anchor,helper+'\n'+anchor)

old_open="function openSession(track,w,s){if(!canOpen(track,w,s))return;const session=sessionFor(track,w,s);if(!session)return;activeEx=0;if(completed(track,w,s)){showCompleted(session,getSeq(track,w,s));return}track==='run'?runModal(session):strengthModal(session)}"
new_open="function openSession(track,w,s){if(!canOpen(track,w,s))return;const session=sessionFor(track,w,s);if(!session)return;activeEx=0;if(completed(track,w,s)){showCompleted(session,getSeq(track,w,s));return}track==='run'?runModal(session):track==='hiit'?hiitModal(session):strengthModal(session)}"
if old_open in s: s=s.replace(old_open,new_open)

if "if(session.track==='hiit')" not in s:
    anchor="  if(session.track==='run'){"
    repl="  if(session.track==='hiit'){\n    body.innerHTML=`<div class=\"pw-finish\"><div class=\"pw-finish-check\">✓</div><small>COMPLETED ${esc(fmtDate(log.completedDate||log.date))}</small><h1>${esc(session.name)}</h1><p>${log.roundsDone?esc(log.roundsDone)+' rounds · ':''}${log.elapsedSec?Math.max(1,Math.round(log.elapsedSec/60))+' minutes':'20-minute session'}</p><button id=\"pwSeqDoneClose\">BACK TO PROGRAM</button></div>`;\n  }else if(session.track==='run'){"
    if anchor not in s: raise SystemExit('showCompleted anchor missing')
    s=s.replace(anchor,repl,1)

old_picker='<button data-track="home"><b>Home Dumbbell</b><span>4 sessions each week · interactive set logging</span></button><button data-track="run">'
new_picker='<button data-track="home"><b>Home Dumbbell</b><span>4 sessions each week · interactive set logging</span></button><button data-track="hiit"><b>Home HIIT</b><span>4 × 20-minute sessions · live timer + round tracking</span></button><button data-track="run">'
if old_picker in s: s=s.replace(old_picker,new_picker)

old_detail="detail=track==='run'?session.detail:(session.sets.label+' · '+session.ex.length+' exercises');"
new_detail="detail=track==='run'?session.detail:track==='hiit'?('20 min · '+session.ex.length+' exercises · '+(session.kind==='pyramid'?'pyramid':session.kind==='sets'?'structured sets':'repeat circuit')):(session.sets.label+' · '+session.ex.length+' exercises');"
if old_detail in s: s=s.replace(old_detail,new_detail)

s=s.replace('<p>4 sessions per week · always in sequence</p>',"<p>${track==='hiit'?'4 × 20 min · two extra walks encouraged':'4 sessions per week'} · always in sequence</p>")

p.write_text(s)
write_b64(p,ROOT/'asset_sources/pw-training-sequence-v5.b64')

# ---- UI / QA ----
p=ROOT/'dev_sources/pw-ui-v3.part7.js'
s=p.read_text()
if "hiit:{n:'Home HIIT'" not in s:
    s=s.replace("run:{n:'Walking & Running',s:'4 sessions · 20–40 min',d:'Easy work, intervals, recovery and one longer walk/run each week.'}};",
                "hiit:{n:'Home HIIT',s:'4 × 20-minute sessions',d:'No-gym circuits, pyramid work and structured strength/conditioning.'},run:{n:'Walking & Running',s:'4 sessions · 20–40 min',d:'Easy work, intervals, recovery and one longer walk/run each week.'}};")
if 'tracks.hiit' not in s:
    s=s.replace('function active(){',"try{if(typeof tracks==='object'&&!tracks.hiit)tracks.hiit={n:'Home HIIT',s:'4 × 20-minute sessions',days:{}}}catch(e){}\nfunction active(){")
s=s.replace("t=S.track?tracks[S.track]:null,dow=", "t=S.track==='hiit'?META.hiit:(S.track?tracks[S.track]:null),dow=")
s=s.replace("session=t&&t.days[dow]?t.days[dow]:'';", "session=S.track==='hiit'?'Next sequential Home HIIT session':(t&&t.days&&t.days[dow]?t.days[dow]:'');")
s=s.replace("k==='gym'?'GYM':k==='home'?'HOME':'WALK'", "k==='gym'?'GYM':k==='home'?'HOME':k==='hiit'?'HIIT':'WALK'")
s=s.replace('<option value="home">Home Dumbbell</option><option value="run">Walking & Running</option>', '<option value="home">Home Dumbbell</option><option value="hiit">Home HIIT</option><option value="run">Walking & Running</option>')
s=s.replace("function nx(){S.track=S.track||'gym';const t=tracks[S.track];", "function nx(){S.track=S.track||'gym';if(S.track==='hiit'){show('exercise');return}const t=tracks[S.track];")
s=s.replace('grid-template-columns:repeat(3,1fr)', 'grid-template-columns:repeat(4,1fr)')
s=s.replace('<button type="button" data-qa-plan="home">HOME<br>DUMBBELL</button><button type="button" data-qa-plan="run">WALK +<br>RUN</button>', '<button type="button" data-qa-plan="home">HOME<br>DUMBBELL</button><button type="button" data-qa-plan="hiit">HOME<br>HIIT</button><button type="button" data-qa-plan="run">WALK +<br>RUN</button>')
p.write_text(s)
write_b64(p,ROOT/'asset_sources/pw-ui-v3.part7.b64')

# ---- Release home summary ----
p=ROOT/'dev_sources/pw-release-fixes-v6.js'
s=p.read_text()
if "hiit:'4 × 20-minute Home HIIT sessions'" not in s:
    s=s.replace("  home:'4 home sessions · 20 min max',\n  run:","  home:'4 home sessions · 20 min max',\n  hiit:'4 × 20-minute Home HIIT sessions',\n  run:")
p.write_text(s)
write_b64(p,ROOT/'asset_sources/pw-release-fixes-v6.b64')

# ---- CSS ----
p=ROOT/'dev_sources/pw-training-sequence-v5.css'
css=p.read_text()
if 'Home HIIT interactive session' not in css:
    css += r'''
/* Home HIIT interactive session */
.pw-hiit-card{padding:16px;display:grid;gap:12px}.pw-hiit-clock{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4px 12px;background:#075568;color:#fff;border-radius:16px;padding:14px}.pw-hiit-clock small{font-weight:900;letter-spacing:.08em}.pw-hiit-clock b{font-size:38px;line-height:1;grid-row:1/3;grid-column:2}.pw-hiit-clock button{justify-self:start;border:0;border-radius:999px;background:#ffd62e;color:#075568;font-weight:900;padding:8px 14px}.pw-hiit-rule{margin:0;background:#fff4c2;border-radius:12px;padding:12px;font-weight:800}.pw-hiit-meta{font-weight:900;color:#075568}.pw-hiit-list{display:grid;gap:8px}.pw-hiit-row{width:100%;display:grid;grid-template-columns:34px 1fr auto;gap:4px 10px;align-items:center;text-align:left;border:1px solid #cdebed;background:#fff;border-radius:14px;padding:11px;color:#163f49}.pw-hiit-row span{grid-row:1/3;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#ff5960;color:white;font-weight:900}.pw-hiit-row b{font-size:15px}.pw-hiit-row em{font-style:normal;font-size:12px;color:#53777d}.pw-hiit-row strong{grid-column:3;grid-row:1/3;font-size:10px;color:#075568}.pw-hiit-row.done{background:#eafafb;border-color:#08a8b5}.pw-hiit-round{border:0;border-radius:12px;background:#08a8b5;color:#fff;font-weight:900;padding:13px}.pw-hiit-rest{text-align:center;font-weight:900;color:#ff5960;min-height:20px}.pw-hiit-notes{display:grid;gap:5px;font-size:11px;font-weight:900;color:#075568}.pw-hiit-notes textarea{border:1px solid #cdebed;border-radius:10px;padding:10px;font:inherit;font-weight:500}.pw-seq-track-picker button[data-track="hiit"]{border-color:#ffd62e;background:#fff9db}@media(max-width:420px){.pw-hiit-clock b{font-size:32px}.pw-hiit-row{grid-template-columns:30px 1fr}.pw-hiit-row strong{grid-column:2;grid-row:3}.pw-hiit-row em{grid-column:2}}
'''
p.write_text(css)
write_b64(p,ROOT/'asset_sources/pw-training-sequence-v5.css.b64')

# ---- Service worker cache ----
p=ROOT/'dev_sources/sw-v3.js'
s=p.read_text()
s=re.sub(r"const C='pw8-v[^']+';", "const C='pw8-v8-hiit';", s)
p.write_text(s)
write_b64(p,ROOT/'asset_sources/sw.js.b64')

# Final sanity assertions
assert "hiit:'Home HIIT'" in (ROOT/'dev_sources/pw-training-sequence-v5.js').read_text()
assert 'Pyramid Workout' in (ROOT/'dev_sources/pw-training-sequence-v5.js').read_text()
assert 'data-track="hiit"' in (ROOT/'dev_sources/pw-training-sequence-v5.js').read_text()
assert 'Home HIIT' in (ROOT/'dev_sources/pw-ui-v3.part7.js').read_text()
print('Home HIIT patch prepared')
