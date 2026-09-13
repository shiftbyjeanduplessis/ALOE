from pathlib import Path
import base64,re

ROOT=Path('perfect-women-start-here')
p=ROOT/'dev_sources/pw-training-sequence-v5.js'
s=p.read_text()

old_open="function openSession(track,w,s){if(!canOpen(track,w,s))return;const session=sessionFor(track,w,s);if(!session)return;activeEx=0;if(completed(track,w,s)){showCompleted(session,getSeq(track,w,s));return}track==='run'?runModal(session):track==='hiit'?hiitModal(session):strengthModal(session)}"
new_open="""function strengthResumeIndex(session,log){
  if(!log||log.type!=='strength'||!Array.isArray(log.exercises))return 0;
  const saved=Number(log.activeEx);
  if(Number.isInteger(saved)&&saved>=0&&saved<log.exercises.length)return saved;
  const min=session.sets.min;
  for(let i=0;i<log.exercises.length;i++){
    const ex=log.exercises[i]||{},sets=Array.isArray(ex.sets)?ex.sets:[],needed=min+((ex.optionalChosen||sets.length>min)?1:0);
    let done=true;
    for(let j=0;j<needed;j++)if(!(sets[j]&&sets[j].done)){done=false;break}
    if(!done)return i;
  }
  return Math.max(0,log.exercises.length-1);
}
function openSession(track,w,s){if(!canOpen(track,w,s))return;const session=sessionFor(track,w,s);if(!session)return;const existing=getSeq(track,w,s);activeEx=(track==='gym'||track==='home')?strengthResumeIndex(session,existing):0;if(completed(track,w,s)){showCompleted(session,existing);return}track==='run'?runModal(session):track==='hiit'?hiitModal(session):strengthModal(session)}"""
if old_open in s:
    s=s.replace(old_open,new_open)
elif 'function strengthResumeIndex(session,log)' not in s:
    raise SystemExit('openSession anchor not found')

old_strength="stopTimers();const log=newStrengthLog(session);activeEx=Math.min(activeEx,log.exercises.length-1);const ex=log.exercises[activeEx]"
new_strength="stopTimers();const log=newStrengthLog(session);activeEx=Math.min(activeEx,log.exercises.length-1);log.activeEx=activeEx;putSeq(session.track,session.w,session.s,log);const ex=log.exercises[activeEx]"
if old_strength in s:
    s=s.replace(old_strength,new_strength,1)
elif 'log.activeEx=activeEx;putSeq(session.track,session.w,session.s,log);const ex=' not in s:
    raise SystemExit('strengthModal active exercise anchor not found')

p.write_text(s)
(ROOT/'asset_sources/pw-training-sequence-v5.b64').write_text(base64.b64encode(s.encode()).decode())

sp=ROOT/'dev_sources/sw-v3.js'
sw=sp.read_text()
sw=re.sub(r"const C='pw8-v[^']+';","const C='pw8-v10-strength-resume';",sw)
sp.write_text(sw)
(ROOT/'asset_sources/sw.js.b64').write_text(base64.b64encode(sw.encode()).decode())

assert 'function strengthResumeIndex(session,log)' in s
assert 'log.activeEx=activeEx' in s
print('strength resume fix applied')
