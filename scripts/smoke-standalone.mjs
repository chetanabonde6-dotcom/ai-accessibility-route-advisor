// DOM smoke test of the exact generated artifact. No browser or network access.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM, VirtualConsole } from 'jsdom';

const html=await readFile(resolve(import.meta.dirname,'../AI-Accessibility-Route-Advisor.html'),'utf8');
const errors=[];const consoleCapture=new VirtualConsole();
consoleCapture.on('jsdomError',error=>errors.push(error.message));
const dom=new JSDOM(html,{url:'https://pathwise.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:consoleCapture});
const {window}=dom;const document=window.document;
window.matchMedia=query=>({matches:query.includes('reduce')&&!query.includes('no-preference'),media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};
window.structuredClone=globalThis.structuredClone;
assert.equal(document.querySelectorAll('script[src],link[rel="stylesheet"]').length,0,'Standalone must not require external scripts or styles');
assert.ok(document.querySelector('link[rel="icon"]').href.startsWith('data:'));
const script=document.querySelector('script[type="module"]');assert.ok(script?.textContent);
const tick=()=>new Promise(resolve=>setTimeout(resolve,80));
try{
  window.eval(script.textContent);await tick();
  assert.ok(document.querySelector('h1')?.textContent.includes('For every body.'));
  document.querySelector('.find-route').click();await tick();
  assert.ok(document.querySelector('.route-option.selected')?.textContent.includes('Step-free in sample'),JSON.stringify(errors));
  assert.ok(document.querySelector('.directions-list')?.textContent.includes('Start at West entrance'));
  const save=[...document.querySelectorAll('.route-actions button')].find(b=>b.textContent.trim()==='Save');assert.ok(save);save.click();await tick();
  assert.equal(JSON.parse(window.localStorage.getItem('pathwise.journeys.v1')).length,1);
  [...document.querySelectorAll('.profile-picker button')].find(b=>b.textContent.trim()==='Walking').click();await tick();
  document.querySelector('.find-route').click();await tick();
  assert.equal(document.querySelectorAll('.route-option').length,3);
  assert.ok(document.querySelector('.route-option.selected').textContent.includes('3 stair segments'));
  assert.deepEqual(errors,[]);
  console.log('Standalone DOM smoke: PASS — embedded assets, app mount, step-free route, saved journey, walking alternatives, no jsdom errors.');
  console.log('This is a DOM-only check. It does not verify CSS layout, actual browser rendering, or speech output.');
}finally{window.close();}
