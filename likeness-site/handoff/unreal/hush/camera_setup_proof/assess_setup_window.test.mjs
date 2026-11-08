// GL-19R.3A reproducible synthetic-only test cases. NOT a rehearsal or UE proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import { assessSetupWindow } from './assess_setup_window.mjs';
const scenario={windowMs:8000,eventMs:[0,1200,2400,3600],reactionDurationsMs:[450,500,700,1300]};
test('synthetic 8s window can fit this assumed four-cue schedule',()=>assert.equal(assessSetupWindow(scenario).modelFeasible,true));
test('all four counted events are retained',()=>assert.equal(assessSetupWindow(scenario).accepted,4));
test('stage order is pause, extended pause, camcorder and approach',()=>assert.deepEqual(
  assessSetupWindow(scenario).stageActions.map(s=>s.stage),['PAUSE_START','PAUSE_EXTEND','CAMCORDER_TURN','APPROACH']));
test('minimum four accepted event cadence is 3.6s at 1.2s spacing',()=>assert.equal(assessSetupWindow(scenario).minFourSlipCadenceMs,3600));
test('synthetic 4.5s window fails due to unfinished approach',()=>assert.equal(assessSetupWindow({...scenario,windowMs:4500}).modelFeasible,false));
test('unknown window duration fails input validation',()=>assert.equal(assessSetupWindow({...scenario,windowMs:null}).classification,'INPUT_INCOMPLETE_OR_INVALID'));
test('events after window closure are excluded',()=>assert.equal(assessSetupWindow({...scenario,windowMs:2300}).outside,2));
test('sub-1.2s intervening noise is debounced',()=>assert.equal(
  assessSetupWindow({...scenario,eventMs:[0,900,1200,2400,3600]}).debounced,1));
test('a fifth accepted event is outside the four-action proof and requests rewind',()=>assert.equal(
  assessSetupWindow({...scenario,eventMs:[0,1200,2400,3600,4800]}).classification,'REWIND_EVENT_OUTSIDE_FOUR_CUE_PROOF'));
test('long silence decays exposure, preventing automatic four-stage completion',()=>assert.equal(
  assessSetupWindow({...scenario,windowMs:50000,eventMs:[0,13000,26000,39000]}).modelFeasible,false));
test('unsorted event times are rejected',()=>assert.equal(
  assessSetupWindow({...scenario,eventMs:[1300,200]}).classification,'INPUT_INCOMPLETE_OR_INVALID'));
test('negative assumed performance duration is rejected',()=>assert.equal(
  assessSetupWindow({...scenario,reactionDurationsMs:[450,-1,700,1300]}).classification,'INPUT_INCOMPLETE_OR_INVALID'));
test('any synthetic fit retains physical/actor proof holds',()=>assert.ok(
  assessSetupWindow(scenario).unverified.includes('PERFORMED_COLD_READ')));
