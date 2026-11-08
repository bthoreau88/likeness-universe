// GL-19R.3A — parameterized camera-setup feasibility screen.
// This is only a synthetic timing model. No source screenplay supplies scene seconds.
// This is NOT an Unreal integration, motion clip, production gameplay or physical proof.
export function assessSetupWindow({windowMs,eventMs,reactionDurationsMs,quietDecayMs=12000,refractoryMs=1200}={}) {
  const finiteNonneg=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
  if(!finiteNonneg(windowMs)||!Array.isArray(eventMs)||!Array.isArray(reactionDurationsMs)||
      reactionDurationsMs.length!==4||!reactionDurationsMs.every(x=>finiteNonneg(x)&&x>0)||
      !finiteNonneg(quietDecayMs)||quietDecayMs===0||!finiteNonneg(refractoryMs)){
    return {classification:"INPUT_INCOMPLETE_OR_INVALID",assumption:"Inputs are model data, not screenplay measurements",accepted:0,stageActions:[],unverified:["ACTOR_REHEARSAL","PHYSICAL_RETURN_PATH","SCRIPT_APPROVAL"]};
  }
  const inputSorted=[...eventMs];
  if(!inputSorted.every(finiteNonneg)||inputSorted.some((x,i)=>i>0&&x<inputSorted[i-1])) {
    return {classification:"INPUT_INCOMPLETE_OR_INVALID",accepted:0,stageActions:[],unverified:["EVENT_ORDER"]};
  }
  let exposure=0,previousEvent=-Infinity,silenceAnchor=0,actionFinish=0, accepted=0,major=false, outside=0,debounced=0;
  const actions=[],acceptedEvents=[];
  const names=["PAUSE_START","PAUSE_EXTEND","CAMCORDER_TURN","APPROACH"];
  for(const t of inputSorted){
    if(t>windowMs){outside++;continue}
    if(t-previousEvent<refractoryMs){debounced++;continue}
    const quietPeriods=Math.floor((t-silenceAnchor)/quietDecayMs);
    if(quietPeriods>0){exposure=Math.max(0,exposure-quietPeriods);silenceAnchor+=quietPeriods*quietDecayMs}
    previousEvent=t;silenceAnchor=t;accepted++;
    exposure=Math.min(5,exposure+1);
    acceptedEvents.push({atMs:t,exposure});
    if(exposure===5){major=true;break}
    if(exposure>=1&&exposure<=4) {
      const index=exposure-1;
      const earliestMs=Math.max(t,actionFinish);
      actionFinish=earliestMs+reactionDurationsMs[index];
      actions.push({atMs:t,stage:names[index],startMs:earliestMs,finishMs:actionFinish});
    }
  }
  const allFour=actions.some(x=>x.stage==="APPROACH");
  const feasible=allFour&&!major&&actions.every(x=>x.finishMs<=windowMs);
  const classification=major?"REWIND_EVENT_OUTSIDE_FOUR_CUE_PROOF":feasible?"SYNTHETIC_SCHEDULE_FITS":"SYNTHETIC_SCHEDULE_INCOMPLETE_OR_OVERRUN";
  return {classification,modelFeasible:feasible,windowMs,accepted,debounced,outside,acceptedEvents,
    stageActions:actions,requiredFinishMs:allFour?actions.find(x=>x.stage==="APPROACH").finishMs:null,
    minFourSlipCadenceMs:3*refractoryMs,
    unverified:["REAL_SETUP_WINDOW_DURATION","ACTOR_REACH_AND_VISIBILITY","PROP_SCREEN_ORIENTATION","APPROACH_RETURN_TO_SCRIPT_POSE","PERFORMED_COLD_READ","GL15_HIDE_PASSBACK","G06_UE_RESOURCE_TEST"],
    conclusion:"A synthetic schedule never constitutes gameplay, performance, or canon approval"};
}
