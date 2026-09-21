"use strict";
const assert=require("node:assert/strict");const {test}=require("node:test");const fs=require("node:fs");const vm=require("node:vm");const path=require("node:path");const P=require("./demo/engine.js");const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"demo/data.js"),"utf8"),context);const data=JSON.parse(JSON.stringify(context.window.DEMO_DATA));const person={tenant:"alpha",role:"support",revoked:false};

test("baseline investment reproduces original bundle",()=>{const b=P.solve(data);assert.equal(b.value,480);assert.equal(b.effort,11);assert.deepEqual(b.ids.sort(),["audit","recovery","routing"]);});
test("lower confidence changes bundle",()=>{const b=P.solve(data.map(r=>r.id==="routing"?{...r,confidence:.4}:r));assert.equal(b.value,452);assert.ok(b.ids.includes("dashboard"));});
test("higher recovery effort changes bundle",()=>{const b=P.solve(data.map(r=>r.id==="recovery"?{...r,effort:6}:r));assert.equal(b.value,388);assert.ok(b.ids.includes("branding"));});
test("infeasible budget returns no plan",()=>{assert.equal(P.solve(data,2,1),null);});
test("every selected item honors dependency",()=>{const b=P.solve(data);for(const r of data.filter(r=>b.ids.includes(r.id)))if(r.dependency)assert.ok(b.ids.includes(r.dependency));});
test("every item has a concrete rationale",()=>{const r=P.explain(data);assert.equal(r.rows.length,8);assert.ok(r.rows.every(r=>r.reason.length>10));});
test("invalid reserve and exponential input rejected",()=>{assert.throws(()=>P.solve(data,1,2));assert.throws(()=>P.solve(Array(17).fill(data[0])));});
