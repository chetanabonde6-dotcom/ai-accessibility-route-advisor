import test from 'node:test';
import assert from 'node:assert/strict';
import { edges, placeById, defaultPreferences } from '../src/data/network.js';
import { findRoutes } from '../src/lib/routing.js';
import { directionArrow, fitCamera, floorRuns, roundedPath, routeFloors, segmentPoints } from '../src/lib/mapGeometry.js';

const route = findRoutes({ origin: 'entrance', destination: 'food', preferences: defaultPreferences }).routes[0];
test('reversing an edge retraces the same schematic corridor', () => {
  for (const edge of edges) {
    const forward = segmentPoints({ ...edge, from: edge.a, to: edge.b });
    const reverse = segmentPoints({ ...edge, from: edge.b, to: edge.a });
    assert.deepEqual(forward, [...reverse].reverse());
    if (forward.length) {
      assert.deepEqual(forward[0], [placeById[edge.a].x, placeById[edge.a].y]);
      assert.deepEqual(forward.at(-1), [placeById[edge.b].x, placeById[edge.b].y]);
    }
  }
});
test('routes stay continuous within each floor and never draw a lift across the plan', () => {
  assert.deepEqual(routeFloors(route), [0, 1, 2]);
  assert.deepEqual(floorRuns(route, 0), [[[100,285],[220,285],[370,285],[560,285]]]);
  assert.deepEqual(floorRuns(route, 1), []);
  assert.deepEqual(floorRuns(route, 2), [[[560,285],[370,285]]]);
});
test('direction arrows point toward the destination in both directions', () => {
  assert.equal(directionArrow([[0,0],[100,0]]).angle, 0);
  assert.equal(directionArrow([[100,0],[0,0]]).angle, 180);
  assert.equal(directionArrow([[0,0],[0,100]]).angle, 90);
});
test('rounded corridor path has the expected endpoints and a curved corner', () => {
  assert.equal(roundedPath([[0,0],[100,0]]), 'M 0 0 L 100 0');
  const curve = roundedPath([[0,0],[100,0],[100,100]]);
  assert.match(curve, /^M 0 0/); assert.match(curve, /Q 100 0/); assert.match(curve, /L 100 100$/);
});
test('fit view keeps every selected-floor route node inside the map viewport', () => {
  for (const floor of routeFloors(route)) {
    const {zoom,x,y} = fitCamera(route, floor);
    for (const id of route.nodes) {
      const p = placeById[id]; if (p.floor !== floor) continue;
      const px = 410 * (1 - zoom) + x + p.x * zoom;
      const py = 270 * (1 - zoom) + y + p.y * zoom;
      assert.ok(px > 0 && px < 820 && py > 0 && py < 540);
    }
  }
});
