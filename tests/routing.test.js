import test from 'node:test';
import assert from 'node:assert/strict';
import { findRoutes, routeInstructions, routeText } from '../src/lib/routing.js';
import { defaultPreferences, placeById } from '../src/data/network.js';
const base = { origin: 'entrance', destination: 'food', preferences: defaultPreferences };

test('step-free route crosses floors by lift and has no stairs', () => {
  const { routes, error } = findRoutes(base);
  assert.equal(error, null); assert.ok(routes.length);
  assert.equal(routes[0].stairs, 0); assert.equal(routes[0].lifts, 2);
  assert.deepEqual(routes[0].nodes, ['entrance','ramp','atrium','lift0','lift1','lift2','food']);
});
test('walking profile exposes the shorter stair route', () => {
  const { routes } = findRoutes({...base,preferences:{}});
  assert.ok(routes[0].stairs > 0); assert.equal(routes[0].meters,87);
  assert.ok(routes.every((route,i)=>i===0||route.cost>=routes[i-1].cost));
});
test('lift outage cannot produce a step-free inter-floor route', () => {
  const result=findRoutes({...base,liftUnavailable:true});
  assert.equal(result.routes.length,0);assert.match(result.error,/No route/);
  assert.ok(findRoutes({...base,preferences:{},liftUnavailable:true}).routes.length);
});
test('same-floor step-free journeys remain available during lift outage',()=>{
  const result=findRoutes({...base,destination:'cafe',liftUnavailable:true});assert.ok(result.routes.length);assert.equal(result.routes[0].lifts,0);
});
test('gentle slope requirement rejects the terrace approach',()=>{
  assert.equal(findRoutes({...base,destination:'terrace'}).routes.length,0);
  const route=findRoutes({...base,destination:'terrace',preferences:{...defaultPreferences,gentle:false}}).routes[0];
  assert.ok(route);assert.equal(route.steep,true);
});
test('smooth surface requirement rejects rough or unknown approaches',()=>{
  assert.equal(findRoutes({...base,destination:'studio'}).routes.length,0);
  const route=findRoutes({...base,destination:'studio',preferences:{...defaultPreferences,smooth:false}}).routes[0];assert.equal(route.rough,true);
  const lounge=findRoutes({...base,destination:'lounge'}).routes[0];assert.ok(lounge.nodes.includes('bookshop'));assert.equal(lounge.unknown,false);
});
test('invalid and identical endpoints produce useful errors',()=>{
  for(const origin of ['unknown',null,'food']){const result=findRoutes({...base,origin});assert.equal(result.routes.length,0);assert.ok(result.error);}
});
test('graph connectivity, filters and distances hold for every endpoint pair',()=>{
  const ids=Object.keys(placeById);
  for(const origin of ids)for(const destination of ids){
    if(origin===destination)continue;
    const {routes}=findRoutes({...base,origin,destination});
    for(const route of routes){assert.equal(route.nodes[0],origin);assert.equal(route.nodes.at(-1),destination);assert.equal(new Set(route.nodes).size,route.nodes.length);assert.equal(route.stairs,0);assert.ok(route.segments.every(e=>e.surface==='smooth'&&e.slope<=5));assert.equal(route.meters,route.segments.reduce((total,e)=>total+e.meters,0));route.segments.forEach((s,i)=>{assert.equal(s.from,route.nodes[i]);assert.equal(s.to,route.nodes[i+1]);});}
  }
});
test('route direction is reversible and export labels fictional data',()=>{
  const a=findRoutes(base).routes[0];const b=findRoutes({...base,origin:base.destination,destination:base.origin}).routes[0];
  assert.equal(a.meters,b.meters);assert.deepEqual(a.nodes,[...b.nodes].reverse());assert.match(routeText(a,base),/fictional/);assert.equal(routeInstructions(a).length,a.segments.length+1);
});
