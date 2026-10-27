import { placeById } from '../data/network.js';

// Use the edge's canonical endpoints so reversing a journey follows exactly
// the same schematic corridor, in the opposite direction.
export function segmentPoints(segment) {
  const a = placeById[segment.a];
  const b = placeById[segment.b];
  if (!a || !b || a.floor !== b.floor) return [];
  const points = [[a.x, a.y]];
  if (a.x !== b.x && a.y !== b.y) points.push([b.x, a.y]);
  points.push([b.x, b.y]);
  return segment.from === segment.b ? points.reverse() : points;
}

export function roundedPath(points, radius = 10) {
  if (!points.length) return '';
  let path = 'M ' + points[0].join(' ');
  for (let i = 1; i < points.length - 1; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const next = points[i + 1];
    const before = Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    const after = Math.hypot(next[0] - current[0], next[1] - current[1]);
    if (!before || !after) continue;
    const r = Math.min(radius, before / 2, after / 2);
    const first = current.map((value, axis) => value + (previous[axis] - value) * r / before);
    const last = current.map((value, axis) => value + (next[axis] - value) * r / after);
    path += ' L ' + first.join(' ') + ' Q ' + current.join(' ') + ' ' + last.join(' ');
  }
  if (points.length > 1) path += ' L ' + points[points.length - 1].join(' ');
  return path;
}

export function floorRuns(route, floor) {
  const runs = [];
  let current = [];
  for (const segment of route?.segments ?? []) {
    const points = segmentPoints(segment);
    if (!points.length || placeById[segment.from].floor !== floor) {
      if (current.length) runs.push(current);
      current = [];
      continue;
    }
    if (!current.length) current = points;
    else current.push(...points.slice(1));
  }
  if (current.length) runs.push(current);
  return runs;
}

export function directionArrow(points, fraction = 0.58) {
  const lengths = points.slice(1).map((point, i) => Math.hypot(point[0] - points[i][0], point[1] - points[i][1]));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) * fraction;
  for (let i = 0; i < lengths.length; i += 1) {
    if (remaining <= lengths[i] && lengths[i] > 0) {
      const [x, y] = points[i];
      const dx = points[i + 1][0] - x;
      const dy = points[i + 1][1] - y;
      return { x: x + dx * remaining / lengths[i], y: y + dy * remaining / lengths[i], angle: Math.atan2(dy, dx) * 180 / Math.PI };
    }
    remaining -= lengths[i];
  }
  return null;
}

export function routeFloors(route) {
  const result = [];
  for (const node of route?.nodes ?? []) {
    const floor = placeById[node].floor;
    if (result[result.length - 1] !== floor) result.push(floor);
  }
  return result;
}

export function fitCamera(route, floor) {
  const points = (route?.nodes ?? []).map(id => placeById[id]).filter(place => place.floor === floor);
  if (!points.length) return { zoom: 1, x: 0, y: 0 };
  const minX = Math.min(...points.map(p => p.x)) - 105;
  const maxX = Math.max(...points.map(p => p.x)) + 105;
  const minY = Math.min(...points.map(p => p.y)) - 100;
  const maxY = Math.max(...points.map(p => p.y)) + 100;
  const zoom = Math.min(2, 720 / (maxX - minX), 400 / (maxY - minY));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { zoom, x: (410 - cx) * zoom, y: (270 - cy) * zoom };
}
