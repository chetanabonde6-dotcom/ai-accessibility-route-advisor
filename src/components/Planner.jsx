import { useRef, useState } from 'react';
import {
  Accessibility,
  Footprints,
  Baby,
  ArrowRight,
  ArrowDownUp,
  MapPin,
  Navigation,
  ArrowUpRight,
  Bookmark,
  Download,
  Clock3,
  Route,
  ChevronDown,
  ChevronRight,
  Volume2,
  VolumeX,
  Trash2,
  Info,
  CircleCheck,
  TriangleAlert,
} from 'lucide-react';
import {
  defaultPreferences,
  places,
  floors,
  placeById,
  profiles,
} from '../data/network.js';
import { findRoutes, routeInstructions, routeText } from '../lib/routing.js';
import {
  STORAGE_KEY,
  readRecords,
  writeRecords,
  downloadFile,
} from '../lib/storage.js';
import RouteMap from './RouteMap.jsx';
import { CheckMark, DemoNote, CloseButton } from './UI.jsx';
const preferenceLabels = [
  ['stepFree', 'Step-free access', 'Exclude every stair segment'],
  ['gentle', 'Gentle slopes', 'Exclude modelled slopes above 5%'],
  ['smooth', 'Known smooth surfaces', 'Exclude rough and unknown surfaces'],
  [
    'fewerLifts',
    'Fewer lift segments',
    'Give lift segments a higher ranking cost',
  ],
];
const initialQuery = {
  origin: 'entrance',
  destination: 'food',
  preferences: defaultPreferences,
  liftUnavailable: false,
};
function PlaceSelect({ label, value, onChange, id }) {
  return (
    <div className="place-field">
      <label htmlFor={id}>{label}</label>
      <div className="select-wrap">
        <MapPin size={16} aria-hidden="true" />
        <select id={id} value={value} onChange={e => onChange(e.target.value)}>
          {floors.map(f => (
            <optgroup key={f.id} label={f.name}>
              {places
                .filter(p => p.floor === f.id)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown size={14} aria-hidden="true" />
      </div>
    </div>
  );
}
export default function Planner({ destinationRequest }) {
  const [query, setQuery] = useState(initialQuery);
  const [profile, setProfile] = useState('wheelchair');
  const [plan, setPlan] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(null);
  const [floor, setFloor] = useState(0);
  const [saved, setSaved] = useState(() => readRecords(STORAGE_KEY));
  const [notice, setNotice] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const dialog = useRef(null);
  const lastRequest = useRef(null);
  // Requests originate only from directory button actions. Render-phase state
  // adjustment avoids an effect that briefly shows results for the old query.
  if (destinationRequest && destinationRequest !== lastRequest.current) {
    lastRequest.current = destinationRequest;
    setQuery(q => ({
      ...q,
      destination: destinationRequest.id,
    }));
    setPlan(null);
    setFloor(placeById[destinationRequest.id].floor);
    setActiveStep(null);
  }
  const route = plan?.routes[selectedIndex] ?? null;
  const updateQuery = patch => {
    setActiveStep(null);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setQuery(q => ({
      ...q,
      ...patch,
    }));
    setPlan(null);
    setNotice('');
  };
  const submit = event => {
    event.preventDefault();
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    const result = findRoutes(query);
    setPlan({
      ...result,
      query: structuredClone(query),
    });
    setSelectedIndex(0);
    setActiveStep(null);
    setFloor(placeById[query.origin].floor);
    setNotice('');
  };
  const chooseProfile = key => {
    setProfile(key);
    const { label, ...preferences } = profiles[key];
    updateQuery({
      preferences,
    });
  };
  const save = () => {
    const record = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      origin: query.origin,
      destination: query.destination,
      preferences: query.preferences,
      liftUnavailable: query.liftUnavailable,
      routeId: route.id,
    };
    const next = [record, ...saved].slice(0, 12);
    if (writeRecords(STORAGE_KEY, next)) {
      setSaved(next);
      setNotice('Journey saved in this browser.');
    } else
      setNotice(
        'Browser storage is unavailable. Download the route summary to keep a copy.'
      );
  };
  const restore = record => {
    if (!placeById[record.origin] || !placeById[record.destination]) {
      setNotice('This saved journey is no longer supported.');
      return;
    }
    const restored = {
      origin: record.origin,
      destination: record.destination,
      preferences: record.preferences ?? defaultPreferences,
      liftUnavailable: !!record.liftUnavailable,
    };
    const result = findRoutes(restored);
    const index = Math.max(
      0,
      result.routes.findIndex(r => r.id === record.routeId)
    );
    setQuery(restored);
    setProfile('custom');
    setPlan({
      ...result,
      query: restored,
    });
    setSelectedIndex(index);
    setActiveStep(null);
    setFloor(placeById[record.origin].floor);
    setNotice('Saved journey restored and recalculated.');
    dialog.current.close();
  };
  const remove = id => {
    const next = saved.filter(s => s.id !== id);
    if (writeRecords(STORAGE_KEY, next)) {
      setSaved(next);
      setNotice('Saved journey removed.');
    } else setNotice('Could not update browser storage.');
  };
  const readAloud = () => {
    if (!('speechSynthesis' in window)) {
      setNotice(
        'Speech is unavailable in this browser. Written directions are shown below.'
      );
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const speech = new SpeechSynthesisUtterance(
      'This is a fictional sample route, not real navigation. ' +
        routeInstructions(route).join(' ')
    );
    speech.lang = 'en-IN';
    speech.rate = 0.9;
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(speech);
    setSpeaking(true);
  };
  return (
    <div className="planner-shell reveal">
      <div className="planner-topbar">
        <span className="planner-logo">
          <Navigation size={17} /> ROUTE STUDIO
        </span>
        <span className="demo-badge">
          <i /> INTERACTIVE DEMO
        </span>
        <button
          className="text-button saved-button"
          type="button"
          onClick={() => dialog.current.showModal()}
        >
          <Bookmark size={14} /> Saved
          <span className="count-badge">{saved.length}</span>
        </button>
      </div>
      <div className="planner-workspace">
        <form className="planner-form" onSubmit={submit}>
          <div className="form-intro">
            <span className="micro-label">LET’S FIND YOUR WAY</span>
            <h3>
              Your journey.
              <br />
              Your preferences.
            </h3>
          </div>
          <div
            className="profile-picker"
            role="group"
            aria-label="Travel profile"
          >
            {[
              ['wheelchair', Accessibility, 'Wheelchair'],
              ['walking', Footprints, 'Walking'],
              ['stroller', Baby, 'Stroller'],
            ].map(([key, Icon, label]) => (
              <button
                type="button"
                key={key}
                aria-pressed={profile === key}
                onClick={() => chooseProfile(key)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="locations-form">
            <PlaceSelect
              id="origin"
              label="STARTING POINT"
              value={query.origin}
              onChange={origin =>
                updateQuery({
                  origin,
                })
              }
            />
            <button
              type="button"
              className="swap-button"
              aria-label="Swap starting point and destination"
              onClick={() =>
                updateQuery({
                  origin: query.destination,
                  destination: query.origin,
                })
              }
            >
              <ArrowDownUp size={14} />
            </button>
            <PlaceSelect
              id="destination"
              label="DESTINATION"
              value={query.destination}
              onChange={destination =>
                updateQuery({
                  destination,
                })
              }
            />
          </div>
          <fieldset className="preferences">
            <legend>MAKE IT WORK FOR YOU</legend>
            {preferenceLabels.map(([key, label, description]) => (
              <label className="preference" key={key}>
                <input
                  type="checkbox"
                  checked={query.preferences[key]}
                  onChange={e => {
                    setProfile('custom');
                    updateQuery({
                      preferences: {
                        ...query.preferences,
                        [key]: e.target.checked,
                      },
                    });
                  }}
                />
                <CheckMark checked={query.preferences[key]} />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <button className="button button-lime find-route" type="submit">
            Find my route <ArrowRight size={17} />
          </button>
          <details className="simulation">
            <summary>
              <Info size={13} /> Test a lift outage <ChevronDown size={12} />
            </summary>
            <label>
              <input
                type="checkbox"
                checked={query.liftUnavailable}
                onChange={e =>
                  updateQuery({
                    liftUnavailable: e.target.checked,
                  })
                }
              />{' '}
              Mark the sample lift unavailable
            </label>
            <p>Simulated condition. No live lift status is connected.</p>
          </details>
        </form>
        <div className="planner-right">
          <RouteMap
            route={route}
            activeStep={activeStep}
            floor={floor}
            setFloor={setFloor}
            origin={query.origin}
            destination={query.destination}
          />
          <div className="route-results" aria-live="polite" aria-atomic="true">
            {!plan && (
              <div className="results-welcome">
                <div className="welcome-route-icon">
                  <Route size={23} />
                </div>
                <div>
                  <h4>More than the shortest way.</h4>
                  <p>
                    Select your preferences. We’ll compare the paths that fit.
                  </p>
                </div>
                <ArrowUpRight size={21} />
              </div>
            )}
            {plan?.error && (
              <div className="route-error" role="status">
                <TriangleAlert size={21} />
                <div>
                  <h4>
                    {query.origin === query.destination
                      ? 'Choose a different destination'
                      : 'No matching sample route'}
                  </h4>
                  <p>{plan.error}</p>
                </div>
              </div>
            )}
            {!!plan?.routes.length && (
              <>
                <div className="results-heading">
                  <span>
                    <CircleCheck size={14} /> {plan.routes.length} sample{' '}
                    {plan.routes.length === 1 ? 'option' : 'options'} found
                  </span>
                  <small>Ranked by your preferences</small>
                </div>
                <div className="route-options">
                  {plan.routes.map((r, i) => (
                    <button
                      type="button"
                      key={r.id}
                      className={`route-option ${i === selectedIndex ? 'selected' : ''}`}
                      aria-pressed={i === selectedIndex}
                      onClick={() => {
                        window.speechSynthesis?.cancel();
                        setSpeaking(false);
                        setSelectedIndex(i);
                        setActiveStep(null);
                      }}
                    >
                      <span className="route-option-top">
                        <span className="route-number">0{i + 1}</span>
                        <span>
                          {i === 0
                            ? 'Best preference match'
                            : `Alternative ${i}`}
                        </span>
                        <span className="radio-indicator" />
                      </span>
                      <span className="route-option-time">
                        {r.minutes}
                        <small>min</small>
                        <span>{r.meters} m</span>
                      </span>
                      <span className="route-features">
                        {r.stairs === 0 ? (
                          <>
                            <Accessibility size={12} /> Step-free in sample
                          </>
                        ) : (
                          <>
                            <Footprints size={12} /> {r.stairs} stair segments
                          </>
                        )}
                        <span>· {r.lifts} lift segments</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {route && (
        <div className="directions-panel">
          <div className="directions-header">
            <div>
              <span className="micro-label">YOUR SAMPLE ITINERARY</span>
              <h3>
                {placeById[query.origin].name} <ArrowRight size={18} />{' '}
                {placeById[query.destination].name}
              </h3>
            </div>
            <div className="route-actions">
              <button
                type="button"
                className="button button-small"
                onClick={save}
              >
                <Bookmark size={14} /> Save
              </button>
              <button
                type="button"
                className="button button-small"
                onClick={() =>
                  downloadFile(
                    'ai-accessibility-route-advisor-sample-route.txt',
                    routeText(route, plan.query)
                  )
                }
              >
                <Download size={14} /> Download
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={readAloud}
                aria-label={
                  speaking
                    ? 'Stop reading directions'
                    : 'Read sample directions aloud'
                }
              >
                {speaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>
          </div>
          {(route.unknown || route.steep || route.rough) && (
            <DemoNote>
              {[
                route.unknown && 'A segment has an unknown surface.',
                route.steep && 'A ramp has a modelled slope above 5%.',
                route.rough && 'A segment has a modelled rough surface.',
              ]
                .filter(Boolean)
                .join(' ')}
            </DemoNote>
          )}
          <ol className="directions-list">
            {routeInstructions(route).map((instruction, i) => (
              <li key={instruction}>
                <button
                  type="button"
                  className="direction-step-button"
                  aria-pressed={activeStep === i}
                  aria-label={'Show step ' + (i + 1) + ' on map: ' + instruction}
                  onClick={() => {
                    setActiveStep(i);
                    const node = i === 0 ? route.nodes[0] : route.segments[i - 1].to;
                    setFloor(placeById[node].floor);
                    requestAnimationFrame(() => {
                      document.getElementById('route-preview-map')?.scrollIntoView({
                        block: 'center',
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                      });
                      document.getElementById('route-map-canvas')?.focus({ preventScroll: true });
                    });
                  }}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span><span className="direction-step-text">{instruction}</span><span className="direction-step-hint">Show this step on the map ↗</span></span>
                </button>
              </li>
            ))}
          </ol>
          <p className="timing-note">
            <Clock3 size={12} /> Time is illustrative and excludes crowds,
            stops, and real lift wait times.
          </p>
          <details className="ranking-details">
            <summary>
              How was this route ranked? <ChevronDown size={13} />
            </summary>
            <p>
              First, the planner removes segments that conflict with your
              requirements. It then ranks connected paths by distance plus 30
              metres per lift segment and 5 metres per stair segment. “Fewer
              lift segments” increases the lift penalty to 180 metres. These are
              transparent demonstration weights, not measured accessibility
              scores or predictions from a trained AI model. A 5% slope filter
              is a demo preference, not a compliance certification.
            </p>
          </details>
        </div>
      )}
      <div className="planner-notice" role="status">
        {notice}
      </div>
      <DemoNote className="planner-disclaimer">
        A working demonstration with fictional places, distances, slopes, and
        connections. This is not a floor plan of Phoenix Marketcity or any real
        venue. Verify real-world accessibility with the venue.
      </DemoNote>
      <dialog
        ref={dialog}
        className="saved-dialog"
        onClick={e => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-header">
          <div>
            <span className="micro-label">KEPT CLOSE</span>
            <h3>Your saved journeys</h3>
          </div>
          <CloseButton onClick={() => dialog.current.close()} />
        </div>
        <p className="muted">
          Stored only in this browser. Reopening recalculates the sample route.
        </p>
        <div className="saved-list">
          {!saved.length ? (
            <div className="empty-saved">
              <Bookmark size={28} />
              <p>No journeys saved yet.</p>
              <small>Plan a route and select Save to keep it here.</small>
            </div>
          ) : (
            saved.map(record => (
              <div className="saved-item" key={record.id}>
                <button
                  type="button"
                  className="saved-restore"
                  onClick={() => restore(record)}
                >
                  <strong>
                    {placeById[record.origin]?.name ?? 'Unknown'}{' '}
                    <ChevronRight size={13} />{' '}
                    {placeById[record.destination]?.name ?? 'Unknown'}
                  </strong>
                  <small>
                    {new Date(record.date).toLocaleDateString('en-IN')} · Sample
                    journey
                  </small>
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Delete saved journey to ${placeById[record.destination]?.name ?? 'destination'}`}
                  onClick={() => remove(record.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        <div role="status" className="dialog-status">
          {notice}
        </div>
      </dialog>
    </div>
  );
}

