import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpDown, Clock3, Layers, MapPin, Maximize2, Minus, Move, Plus, Route } from 'lucide-react';
import { edges, places, floors, placeById } from '../data/network.js';
import { directionArrow, fitCamera, floorRuns, roundedPath, routeFloors, segmentPoints } from '../lib/mapGeometry.js';

export default function RouteMap({ route, floor, setFloor, destination, origin, activeStep = null }) {
  const [camera, setCamera] = useState({ key: null, zoom: 1, x: 0, y: 0 });
  const drag = useRef(null);
  const key = String(floor) + ':' + (route?.id ?? 'empty');
  const baseCamera = fitCamera(route, floor);
  const view = camera.key === key ? camera : baseCamera;
  const currentPlaces = places.filter(place => place.floor === floor);
  const onRoute = new Set(route?.nodes ?? []);
  const runs = floorRuns(route, floor);
  const visibleEdges = edges.filter(edge => placeById[edge.a].floor === floor && placeById[edge.b].floor === floor);
  const routeSegments = (route?.segments ?? []).map((segment, index) => ({ ...segment, step: index + 1 })).filter(segment => placeById[segment.from].floor === floor && placeById[segment.to].floor === floor);
  const transitions = (route?.segments ?? []).filter(segment => placeById[segment.from].floor === floor && placeById[segment.to].floor !== floor);
  const journeyFloors = routeFloors(route);
  const floorIsOnRoute = (route?.nodes ?? []).some(id => placeById[id].floor === floor);
  const selectedSegment = activeStep > 0 ? route?.segments[activeStep - 1] : null;
  const selectedPoints = selectedSegment && placeById[selectedSegment.from].floor === floor ? segmentPoints(selectedSegment) : [];
  const start = placeById[origin];
  const end = placeById[destination];
  const transform = 'translate(' + (410 * (1 - view.zoom) + view.x) + ' ' + (270 * (1 - view.zoom) + view.y) + ') scale(' + view.zoom + ')';

  function updateCamera(updater) {
    setCamera(previous => ({ ...updater(previous.key === key ? previous : baseCamera), key }));
  }
  function reset() { setCamera({ ...baseCamera, key }); }
  function zoomBy(delta) {
    updateCamera(previous => ({ ...previous, zoom: Math.max(0.7, Math.min(3, previous.zoom + delta)) }));
  }
  function beginDrag(event) {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: view.x, panY: view.y };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveDrag(event) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const factor = 820 / Math.max(1, event.currentTarget.getBoundingClientRect().width);
    const x = drag.current.panX + (event.clientX - drag.current.x) * factor;
    const y = drag.current.panY + (event.clientY - drag.current.y) * factor;
    updateCamera(previous => ({ ...previous, x: Math.max(-1500, Math.min(1500, x)), y: Math.max(-1000, Math.min(1000, y)) }));
  }
  function stopDrag() { drag.current = null; }
  function handleKey(event) {
    const deltas = { ArrowLeft: [45, 0], ArrowRight: [-45, 0], ArrowUp: [0, 45], ArrowDown: [0, -45] };
    if (deltas[event.key]) {
      event.preventDefault();
      const [dx, dy] = deltas[event.key];
      updateCamera(previous => ({ ...previous, x: previous.x + dx, y: previous.y + dy }));
    } else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomBy(0.25); }
    else if (event.key === '-') { event.preventDefault(); zoomBy(-0.25); }
    else if (event.key === 'Home') { event.preventDefault(); reset(); }
  }
  return (
    <div className="route-map clear-route-map" id="route-preview-map">
      <div className="map-header">
        <div><span className="signal-dot" /><strong>Route preview</strong><span className="map-header-divider">/</span><span>{floors[floor].name}</span></div>
        <span className="map-mode"><Layers size={13} /> SAMPLE MAP</span>
      </div>
      {route && (
        <div className="journey-floor-bar">
          <span className="journey-label"><Route size={14} /> YOUR JOURNEY</span>
          <div className="journey-floor-buttons" role="group" aria-label="Journey floors">
            {journeyFloors.map((level, index) => (
              <span className="journey-floor-stop" key={String(level) + '-' + index}>
                {index > 0 && <ArrowRight size={13} aria-hidden="true" />}
                <button type="button" onClick={() => setFloor(level)} aria-pressed={floor === level} aria-label={'Follow route on ' + floors[level].name.toLowerCase()}>{floors[level].short}<span>{floors[level].name}</span></button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="map-viewport">
        <svg
          className="floor-diagram navigable-map"
          id="route-map-canvas"
          viewBox="0 0 820 540"
          role="img"
          tabIndex={0}
          aria-label={'Illustrative ' + floors[floor].name + ' map. ' + (route ? 'Blue path from A, ' + start.name + ', to B, ' + end.name + '. Arrows show travel direction. Select journey floors to follow lift or stair transitions.' : 'Plan a journey to display a highlighted path.')}
          aria-describedby="map-keyboard-help"
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
          onKeyDown={handleKey}
        >
          <defs>
            <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#b8c9ec" opacity=".16" /></pattern>
            <linearGradient id="map-building" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#182842" stopOpacity=".8" /><stop offset="1" stopColor="#0e182b" stopOpacity=".9" /></linearGradient>
          </defs>
          <rect width="820" height="540" fill="url(#map-grid)" />
          <g transform={transform} data-testid="map-camera">
            <rect x="45" y="65" width="730" height="420" rx="35" fill="url(#map-building)" stroke="#a9bfed" strokeOpacity=".2" strokeWidth="2" />
            {[[80,90,230,145],[85,345,230,100],[420,90,90,140],[615,85,130,145],[420,350,85,95],[615,345,135,100]].map(([x,y,w,h],index) => (
              <rect key={index} x={x} y={y} width={w} height={h} rx="13" fill="#d0ddff" fillOpacity=".035" stroke="#c4d7ff" strokeOpacity=".09" />
            ))}
            {visibleEdges.map(edge => (
              <g key={edge.id}>
                <path d={roundedPath(segmentPoints(edge))} fill="none" stroke="#101b2d" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
                <path d={roundedPath(segmentPoints(edge))} fill="none" stroke="#33445d" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
                {edge.type === 'stairs' && <path d={roundedPath(segmentPoints(edge))} fill="none" stroke="#71839e" strokeWidth="2" strokeDasharray="3 7" />}
              </g>
            ))}
            <text x="195" y="162" fill="#7488a6" fontSize="16" textAnchor="middle" letterSpacing="2">{floor === 0 ? 'WEST WING' : floor === 1 ? 'READ & REST' : 'GARDEN WING'}</text>
            <text x="678" y="385" fill="#7488a6" fontSize="13" textAnchor="middle" letterSpacing="1">EAST WING</text>
            {runs.map((points,index) => (
              <g key={index} className="route-run">
                <path d={roundedPath(points)} fill="none" stroke="#0a1221" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
                <path d={roundedPath(points)} fill="none" stroke="#b7d5ff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path className="clear-route-path" data-testid="highlighted-route" d={roundedPath(points)} fill="none" stroke="#3d8dff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
            {selectedPoints.length > 0 && <path className="selected-route-segment" d={roundedPath(selectedPoints)} fill="none" stroke="#c5f277" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />}
            {routeSegments.map(segment => {
              const arrow = directionArrow(segmentPoints(segment));
              if (!arrow) return null;
              return <g key={segment.id} transform={'translate(' + arrow.x + ' ' + arrow.y + ') rotate(' + arrow.angle + ')'} aria-hidden="true"><path d="M -5 -4 L 0 0 L -5 4" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></g>;
            })}
            {currentPlaces.map(place => {
              const isStart = route && place.id === origin;
              const isEnd = route && place.id === destination;
              const isLift = place.icon === 'lift';
              const isActivePlace = activeStep !== null && (activeStep === 0 ? origin === place.id : selectedSegment?.to === place.id);
              return (
                <g key={place.id}>
                  {isActivePlace && <circle className="active-step-point" cx={place.x} cy={place.y} r="29" fill="#c5f277" fillOpacity=".12" stroke="#c5f277" strokeWidth="2" strokeDasharray="4 4" />}
                  {!isStart && !isEnd && <circle cx={place.x} cy={place.y} r={onRoute.has(place.id) ? 5 : 4} fill={onRoute.has(place.id) ? '#dcecff' : '#8d9cb3'} stroke="#17243a" strokeWidth="2" />}
                  {isLift && !isStart && !isEnd && (
                    <g transform={'translate(' + (place.x - 15) + ' ' + (place.y - 40) + ')'}>
                      <rect width="30" height="28" rx="8" fill="#292743" stroke="#ada8ec" strokeOpacity=".7" />
                      <text x="15" y="21" textAnchor="middle" fill="#e2ddff" fontSize="23">↕</text>
                    </g>
                  )}
                  {isStart && (
                    <g className="map-start-marker" transform={'translate(' + place.x + ' ' + place.y + ')'}>
                      <circle r="26" fill="#3d8dff" opacity=".15" /><circle r="17" fill="#3d8dff" stroke="#fff" strokeWidth="3" /><text y="6" fill="#fff" fontWeight="700" fontSize="17" textAnchor="middle">A</text>
                    </g>
                  )}
                  {isEnd && (
                    <g className="map-end-marker" transform={'translate(' + place.x + ' ' + place.y + ')'}>
                      <path d="M 0 2 C -4 -5 -18 -16 -18 -28 A 18 18 0 1 1 18 -28 C 18 -16 4 -5 0 2 Z" fill="#ff8797" stroke="#ffe0e5" strokeWidth="2" /><text y="-22" fill="#33111a" fontWeight="700" fontSize="18" textAnchor="middle">B</text>
                    </g>
                  )}
                  <text x={place.x} y={place.y + (isStart ? 39 : 29)} textAnchor="middle" fill={onRoute.has(place.id) ? '#f0f6ff' : '#a4b1c7'} fontSize={onRoute.has(place.id) ? 17 : 14} fontWeight={onRoute.has(place.id) ? '600' : '400'} stroke="#142138" strokeWidth="4" paintOrder="stroke" fontFamily="inherit">{place.name.replace(/ · .*/, '')}</text>
                </g>
              );
            })}
          </g>
        </svg>
        <div className="floor-switcher" role="group" aria-label="View floor">
          {[...floors].reverse().map(level => <button type="button" key={level.id} aria-label={'View ' + level.name.toLowerCase()} aria-pressed={floor === level.id} onClick={() => setFloor(level.id)}>{level.short}</button>)}
        </div>
        <div className="map-controls">
          <button type="button" aria-label="Zoom in on diagram" disabled={view.zoom >= 3} onClick={() => zoomBy(.25)}><Plus size={16} /></button>
          <button type="button" aria-label="Zoom out on diagram" disabled={view.zoom <= .7} onClick={() => zoomBy(-.25)}><Minus size={16} /></button>
          <button type="button" aria-label="Fit route to map" onClick={reset}><Maximize2 size={15} /></button>
        </div>
        {!route && <div className="map-empty-hint"><MapPin size={15} /> Choose a destination. See a clearer path.</div>}
        {route && !floorIsOnRoute && <div className="map-empty-hint">Your route does not pass through this floor.</div>}
        {route && floorIsOnRoute && transitions.length > 0 && (
          <div className="map-transition-controls">
            {transitions.map(segment => <button type="button" key={segment.id} onClick={() => setFloor(placeById[segment.to].floor)}><ArrowUpDown size={15} /><span>{segment.type === 'lift' ? 'Take the lift' : 'Use the stairs'} to <strong>{floors[placeById[segment.to].floor].name.toLowerCase()}</strong></span><ArrowRight size={15} /></button>)}
          </div>
        )}
        {route && floor === end.floor && <div className="map-destination-note"><span>B</span> Destination on this floor</div>}
      </div>
      {route && (
        <div className="map-trip-summary" aria-label="Route endpoints">
          <div><span className="endpoint-dot endpoint-a">A</span><span><small>START</small><strong>{start.name}</strong></span><ArrowRight size={14} /><span className="endpoint-dot endpoint-b">B</span><span><small>DESTINATION</small><strong>{end.name}</strong></span></div>
          <span className="map-duration"><Clock3 size={13} /> {route.minutes} min · {route.meters} m</span>
        </div>
      )}
      <div className="map-legend-row"><span><i className="blue-route-key" /> Selected route</span><span><i className="active-route-key" /> Selected step</span><span><ArrowUpDown size={12} /> Lift / stairs between floors</span></div>
      <div className="map-footer"><span>ILLUSTRATIVE INDOOR MAP · NOT FOR REAL NAVIGATION</span><span id="map-keyboard-help"><Move size={11} /> Drag or use arrow keys · + / − zoom · Home fits</span></div>
    </div>
  );
}

