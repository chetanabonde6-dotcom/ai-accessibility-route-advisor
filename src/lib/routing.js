import { edges, placeById } from '../data/network.js';
export function findRoutes({
  origin,
  destination,
  preferences = {},
  liftUnavailable = false,
}) {
  if (!placeById[origin] || !placeById[destination])
    return {
      routes: [],
      error:
        'Choose a starting point and destination from the sample directory.',
    };
  if (origin === destination)
    return {
      routes: [],
      error:
        'You are already at this destination. Choose a different place to compare routes.',
    };
  const allowed = edges.filter(
    e =>
      !(liftUnavailable && e.type === 'lift') &&
      !(preferences.stepFree && e.type === 'stairs') &&
      !(preferences.gentle && e.slope > 5) &&
      !(preferences.smooth && e.surface !== 'smooth')
  );
  const adjacency = {};
  for (const e of allowed) {
    (adjacency[e.a] ??= []).push({
      ...e,
      from: e.a,
      to: e.b,
    });
    (adjacency[e.b] ??= []).push({
      ...e,
      from: e.b,
      to: e.a,
    });
  }
  const candidates = [];
  const visit = (current, visited, segments) => {
    if (current === destination) {
      const meters = segments.reduce((n, e) => n + e.meters, 0);
      const stairs = segments.filter(e => e.type === 'stairs').length;
      const lifts = segments.filter(e => e.type === 'lift').length;
      // Walking distance plus explicit penalties, not a trained AI model.
      const cost =
        meters + lifts * (preferences.fewerLifts ? 180 : 30) + stairs * 5;
      const seconds = segments.reduce(
        (n, e, i) =>
          n +
          (e.type === 'lift'
            ? segments[i - 1]?.type === 'lift'
              ? 15
              : 55
            : e.meters / (preferences.stepFree ? 0.8 : 1.1) +
              (e.type === 'stairs' ? 15 : 0)),
        0
      );
      candidates.push({
        id: segments.map(e => e.id).join('|'),
        nodes: [...visited],
        segments,
        meters,
        stairs,
        lifts,
        cost,
        minutes: Math.max(1, Math.ceil(seconds / 60)),
        unknown: segments.some(e => e.surface === 'unknown'),
        steep: segments.some(e => e.slope > 5),
        rough: segments.some(e => e.surface === 'rough'),
      });
      return;
    }
    for (const e of adjacency[current] ?? [])
      if (!visited.includes(e.to))
        visit(e.to, [...visited, e.to], [...segments, e]);
  };
  visit(origin, [origin], []);
  candidates.sort(
    (a, b) => a.cost - b.cost || a.meters - b.meters || a.id.localeCompare(b.id)
  );
  return {
    routes: candidates.slice(0, 3),
    error: candidates.length
      ? null
      : 'No route matches all your requirements in this sample network. Try another destination or review your preferences. Step-free travel between floors requires the lift.',
  };
}
export function routeInstructions(route) {
  if (!route) return [];
  const instructions = [
    `Start at ${placeById[route.nodes[0]].name} on ${floorLabel(placeById[route.nodes[0]].floor)}.`,
  ];
  route.segments.forEach((segment, index) => {
    const destination = placeById[segment.to];
    const verb =
      segment.type === 'lift'
        ? `Take the sample lift to ${floorLabel(destination.floor)}`
        : segment.type === 'stairs'
          ? `Use the stairs toward ${destination.name}`
          : segment.type === 'ramp'
            ? `Follow the ramp to ${destination.name} (${segment.slope}% modelled slope)`
            : `Continue to ${destination.name}`;
    const qualifier =
      segment.surface === 'unknown'
        ? ' Surface condition is unknown.'
        : segment.surface === 'rough'
          ? ' This segment has a modelled rough surface.'
          : '';
    instructions.push(
      `${verb} · ${segment.meters} m.${qualifier}${index === route.segments.length - 1 ? ' Arrive at your destination.' : ''}`
    );
  });
  return instructions;
}
export function floorLabel(floor) {
  return (
    ['the ground floor', 'the first floor', 'the second floor'][floor] ??
    'an unknown floor'
  );
}
export function routeText(route, query) {
  return [
    'AI ACCESSIBILITY ROUTE ADVISOR — SAMPLE ROUTE SUMMARY',
    'Educational demonstration only. Not real-world navigation.',
    'All places, distances, surfaces, slopes and routes below are fictional.',
    '',
    `From: ${placeById[query.origin].name}`,
    `To: ${placeById[query.destination].name}`,
    `Modelled distance: ${route.meters} m`,
    `Estimated time: ${route.minutes} min (illustrative)`,
    `Stair segments: ${route.stairs}`,
    `Lift segments: ${route.lifts}`,
    `Preferences: ${JSON.stringify(query.preferences)}`,
    `Sample lift outage: ${query.liftUnavailable ? 'on' : 'off'}`,
    '',
    ...routeInstructions(route).map((text, i) => `${i + 1}. ${text}`),
    '',
    'Verify actual entrances, lift availability, ramp slope and route conditions with the venue.',
  ].join('\n');
}

