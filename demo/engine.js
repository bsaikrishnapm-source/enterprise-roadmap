(function(){
"use strict";
function finite(value, name, min=0, max=Number.MAX_SAFE_INTEGER) {
  if(typeof value!=="number" || !Number.isFinite(value) || value<min || value>max) throw new Error(`${name} must be a finite number from ${min} to ${max}`);
  return value;
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function unique(rows,key){if(new Set(rows.map(r=>r[key])).size!==rows.length)throw new Error(`Duplicate ${key}`);}
function ratio(a,b){return b ? a/b : null;}

function validate(rows,budget,reserve){
 finite(budget,"Capacity",0,1000);finite(reserve,"Reserve",0,budget);
 if(!Array.isArray(rows)||!rows.length||rows.length>16)throw new Error("Use 1–16 opportunities");unique(rows,"id");
 const ids=new Set(rows.map(r=>r.id));
 for(const r of rows){finite(r.reach,"Reach",0,1000000);finite(r.impact,"Impact",0,3);finite(r.confidence,"Confidence",0,1);finite(r.effort,"Effort",.01,1000);if(r.dependency&&!ids.has(r.dependency))throw new Error("Unknown dependency");}
}
function solve(rows,budget=12,reserve=1,forced=null){
 validate(rows,budget,reserve);let best=null;
 for(let mask=0;mask<(1<<rows.length);mask++){
 const chosen=rows.filter((r,i)=>mask&(1<<i)),ids=new Set(chosen.map(r=>r.id));
 if(rows.some(r=>r.mandatory&&!ids.has(r.id))||chosen.some(r=>r.dependency&&!ids.has(r.dependency))||(forced&&!ids.has(forced)))continue;
 const effort=chosen.reduce((n,r)=>n+r.effort,0);if(effort>budget-reserve)continue;
 const value=chosen.reduce((n,r)=>n+r.reach*r.impact*r.confidence,0);
 if(!best||value>best.value||(value===best.value&&effort<best.effort))best={ids:[...ids],effort,value,remaining:budget-reserve-effort,reserve};
 }
 return best;
}
function explain(rows,budget=12,reserve=1){
 const best=solve(rows,budget,reserve);
 return {best,rows:rows.map(r=>{
 const selected=!!best?.ids.includes(r.id),alternative=selected?best:solve(rows,budget,reserve,r.id);
 return {...r,score:r.reach*r.impact*r.confidence/r.effort,selected,reason:selected?(r.mandatory?"Required prerequisite":"Part of highest modeled-value feasible bundle"):!alternative?"Cannot fit with required dependencies and reserve": "Including this item yields best value "+alternative.value+" vs "+best.value,alternative_value:alternative?.value??null};
 })};
}
const API={solve,explain};

if(typeof module!=="undefined"&&module.exports)module.exports=API;else window.Product=API;
})();
