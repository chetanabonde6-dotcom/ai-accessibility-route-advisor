import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
// Recent Node versions expose a native localStorage global. Explicitly use
// jsdom's origin-scoped Storage for component tests instead of the host global.
const storageDOM = new JSDOM('', { url: 'https://pathwise.test/' });
vi.stubGlobal('localStorage', storageDOM.window.localStorage);
vi.mock('gsap',()=>({default:{registerPlugin:vi.fn(),matchMedia:()=>({add:vi.fn(),revert:vi.fn()}),to:vi.fn(),from:vi.fn(),utils:{toArray:()=>[]}}}));
vi.mock('gsap/ScrollTrigger',()=>({ScrollTrigger:{}}));
Object.defineProperty(window,'matchMedia',{writable:true,value:vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}))});
HTMLElement.prototype.scrollIntoView=vi.fn();
HTMLDialogElement.prototype.showModal=function(){this.open=true;};
HTMLDialogElement.prototype.close=function(){this.open=false;};
afterEach(()=>{cleanup();localStorage.clear();});
