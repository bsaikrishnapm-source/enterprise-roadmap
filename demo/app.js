"use strict";
const $=id=>document.getElementById(id);
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function num(id){const v=$(id).value;if(v.trim()==="")throw new Error("Enter a value for "+id);return Number(v);}
function field(id,label,value,options){
 const wrap=el("label");wrap.append(el("span",label));let input;
 if(options){input=el("select");for(const item of options){const o=el("option",typeof item==="string"?item:item[1]);o.value=typeof item==="string"?item:item[0];input.append(o);}}
 else{input=el("input");input.type=typeof value==="number"?"number":"text";if(input.type==="number"){input.step="any";input.min="0";}}
 input.id=id;input.value=value;wrap.append(input);$("controls").append(wrap);return input;
}
function button(label,fn,secondary=false){const b=el("button",label,secondary?"secondary":"");b.type="button";b.onclick=()=>{try{$("error").textContent="";fn();}catch(e){$("error").textContent=e.message;}};$("actions").append(b);return b;}
function metric(label,value){const c=el("div",undefined,"metric");c.append(el("span",label),el("strong",String(value)));$("metrics").append(c);}
function clear(){for(const id of ["metrics","results","notes"])$(id).replaceChildren();}
function message(text){$("notes").append(el("p",text));}
function table(title,rows,columns){
 const section=el("section",undefined,"result-section");section.append(el("h2",title));if(!rows.length){section.append(el("p","No records for this scenario."));$("results").append(section);return;}
 const wrap=el("div",undefined,"table-scroll"),t=el("table"),head=el("thead"),hr=el("tr");
 for(const [key,label]of columns)hr.append(el("th",label));head.append(hr);t.append(head);
 const body=el("tbody");for(const row of rows){const tr=el("tr");for(const [key]of columns){const v=row[key];tr.append(el("td",v===null||v===undefined?"—":Array.isArray(v)?v.join(", "):String(v)));}body.append(tr);}t.append(body);wrap.append(t);section.append(wrap);$("results").append(section);
}
function download(name,data,type="application/json"){
 const body=typeof data==="string"?data:JSON.stringify(data,null,2);
 const url=URL.createObjectURL(new Blob([body],{type}));const a=el("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function csv(rows){if(!rows.length)return "";const keys=Object.keys(rows[0]);const cell=v=>{let s=typeof v==="object"?JSON.stringify(v):String(v??"");if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return [keys.map(cell).join(","),...rows.map(r=>keys.map(k=>cell(r[k])).join(","))].join("\r\n");}
function pct(n){return n===null?"N/A":(n*100).toFixed(1)+"%";}
function money(n){return "$"+n.toFixed(2);}
const copies=[];
function saveComparison(label,result){copies.push({label,at:new Date().toISOString(),result:JSON.parse(JSON.stringify(result))});if(copies.length>5)copies.shift();$("saved").textContent=copies.length+" comparison snapshots saved in this tab";}
let lastResult=null;


field("capacity","Total capacity (team-weeks)",12);field("reserve","Contingency reserve",1);
field("routing","Routing confidence",.6);field("recovery","Connector recovery effort",4);
function run(){
 clear();const rows=JSON.parse(JSON.stringify(DEMO_DATA));rows.find(r=>r.id==="routing").confidence=num("routing");rows.find(r=>r.id==="recovery").effort=num("recovery");
 const result=Product.explain(rows,num("capacity"),num("reserve"));lastResult={...result,capacity:num("capacity"),reserve:num("reserve")};
 metric("Feasible plan",result.best?"Available":"None");metric("Modeled value",result.best?.value??"—");metric("Effort used",result.best?.effort??"—");metric("Contingency",num("reserve"));
 table("Investment decisions",result.rows.map(r=>({...r,score:r.score.toFixed(1),selected:r.selected?"Selected":"Deferred",dependency:r.dependency||"None"})),[["name","Opportunity"],["score","RICE score"],["effort","Effort"],["dependency","Dependency"],["selected","Decision"],["reason","Rationale"]]);
 const scenarios=[["Baseline",DEMO_DATA],["Lower routing confidence",DEMO_DATA.map(r=>r.id==="routing"?{...r,confidence:.4}:r)],["Higher recovery effort",DEMO_DATA.map(r=>r.id==="recovery"?{...r,effort:6}:r)]].map(([name,input])=>({name,...Product.solve(input,num("capacity"),num("reserve"))}));
 table("Sensitivity comparison at current capacity",scenarios,[["name","Scenario"],["ids","Selected items"],["effort","Effort"],["value","Modeled value"]]);
 message("Value units are not revenue or unique customers. Reach may overlap across opportunities; the additive objective can overstate combined benefit. Team-weeks are effort units, not calendar deadlines.");
 if(!result.best)message("No feasible bundle can satisfy mandatory work and the reserve. Increase capacity or revisit assumptions; do not silently drop required work.");
}
button("Compare investment options",run);run();

button("Save comparison snapshot",()=>{if(!lastResult)throw new Error("Run the scenario first");saveComparison("Scenario "+(copies.length+1),lastResult);table("Saved comparisons",copies.map(c=>({label:c.label,time:c.at})),[["label","Snapshot"],["time","Captured (UTC)"]]);},true);
button("Download evidence JSON",()=>download("product-evidence.json",{current:lastResult,comparisons:copies,scope:"Independent prototype; synthetic data only"}),true);
