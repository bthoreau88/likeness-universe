// Run: node --test handoff/web/hush/hideNoiseDirector.test.mjs (from likeness-site/)
import { HideNoiseDirector, NODES } from './HideNoiseDirector.js';
import assert from 'node:assert/strict';
const events=[]; let thr=null, variants=[];
const d=new HideNoiseDirector({onNode:(n,m)=>events.push([n,m.reason||m.via||'']), onVariant:v=>variants.push(v), onThresholds:t=>thr=t});
d.beginHide();
// 4 minor slips -> ATTN 4, no fail
for(let i=0;i<4;i++) d.handleBreach({tier:'minor'});
assert.equal(d.EXPOSURE,4); assert.equal(d.node,NODES.HIDE); assert.equal(d.STRAIN,12);
d.loopSeam(); assert.deepEqual(variants,[4]);
// quiet decay
d.tick(12000); assert.equal(d.EXPOSURE,3);
// 5th path: two more minors -> 5 -> fail
d.handleBreach({tier:'minor'}); d.handleBreach({tier:'minor'});
assert.equal(d.node,NODES.FAIL); assert.equal(d.failCount,1);
d.failClipEnded(); assert.equal(d.node,NODES.HIDE); assert.equal(d.EXPOSURE,2);
// major -> fail 2, then 3 -> forced resolve
d.handleBreach({tier:'major'}); d.failClipEnded();
d.handleBreach({tier:'major'}); d.failClipEnded();
assert.equal(d.node,NODES.RESOLVE); assert.ok(d.STRAIN>=60); assert.deepEqual(thr,{minorDb:5});
console.log('variant', d.resolveVariant(), 'grief', d.STRAIN);
d.tick(8000); assert.equal(d.answered,false);
console.log(d.publicCutLine());
// survival path
const e=new HideNoiseDirector({}); e.beginHide(); for(let t=0;t<90000;t+=16) e.tick(16);
assert.equal(e.node,NODES.SURVIVE); e.surviveClipEnded(); assert.equal(e.node,NODES.RESOLVE);
e.handleSustain(); assert.equal(e.answered,true); console.log(e.publicCutLine(), e.resolveVariant());
console.log('ALL PASS', events.map(x=>x.join(':')).join(' | '));
