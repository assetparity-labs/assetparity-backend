import test from 'node:test';import assert from 'node:assert/strict';import {compare} from './compare.mjs';import {sample} from '../assetparity-scenario-suite/index.mjs';const copy=()=>structuredClone(sample);
for(const c of sample.cases)test(c.id,()=>assert.equal(compare({...sample,cases:[c]}).rows[0].parity,true));
test('wrong balance delta is mismatch',()=>{let c=copy();c.cases[0].sac.after.recipient='12345677';assert.equal(compare(c).rows[0].parity,false)});
test('failed observation cannot hide balance change',()=>{let c=copy();c.cases[2].sac.after={sender:'1',recipient:'0'};assert.equal(compare(c).rows[2].parity,false)});
test('two unknown failures are not parity',()=>{let c=copy();c.cases[2].classic.error='new';c.cases[2].sac.errorCode=999;assert.equal(compare(c).rows[2].parity,false)});
test('duplicate cases rejected',()=>{let c=copy();c.cases.push(c.cases[0]);assert.throws(()=>compare(c))});
test('zero transfer rejected',()=>{let c=copy();c.cases[0].amountUnits='0';assert.throws(()=>compare(c))});
test('fees excluded explicitly',()=>assert.equal(compare(copy()).rows[0].differences.feesCompared,false));

test('issuer endpoints are outside transfer scope',()=>{let c=copy();c.participants.sender=c.asset.issuer;assert.throws(()=>compare(c))});
test('route recipient mismatch rejected',()=>{let c=copy();c.cases[0].sac.recipient='G'+'D'.repeat(55);assert.throws(()=>compare(c))});
