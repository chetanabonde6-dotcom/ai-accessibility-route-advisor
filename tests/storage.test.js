import test from 'node:test';
import assert from 'node:assert/strict';
import { readRecords, writeRecords } from '../src/lib/storage.js';
test('corrupt and unsupported stored values are safely ignored',()=>{
  for(const value of ['{invalid','null','{}','3','[null,4,"text",{"id":"valid"}]']){
    globalThis.localStorage={getItem:()=>value};
    assert.deepEqual(readRecords('test'),value.includes('valid"')?[{id:'valid'}]:[]);
  }
});
test('blocked storage reports failure without crashing',()=>{
  globalThis.localStorage={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');}};
  assert.deepEqual(readRecords('test'),[]);assert.equal(writeRecords('test',[]),false);
});
test('saved record count is bounded',()=>{
  let text='';globalThis.localStorage={getItem:()=>text,setItem:(_key,value)=>{text=value;}};
  assert.equal(writeRecords('test',Array.from({length:100},(_,i)=>({id:String(i)}))),true);
  assert.equal(readRecords('test').length,30);
});
