import { useEffect, useRef, useState } from 'react';
import {
  Search,
  ArrowUpRight,
  Coffee,
  BookOpen,
  DoorOpen,
  MapPin,
  ArrowUpDown,
  Footprints,
  Info,
  Accessibility,
} from 'lucide-react';
import { floors, places } from '../data/network.js';
import { SectionHeading } from './UI.jsx';
const icons = {
  coffee: Coffee,
  book: BookOpen,
  entrance: DoorOpen,
  lift: ArrowUpDown,
  stairs: Footprints,
  help: Info,
  access: Accessibility,
  place: MapPin,
};
export default function Directory({ onSelect }) {
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('all');
  const searchRef = useRef(null);
  useEffect(() => {
    const focusSearch = e => {
      if (
        e.key !== '/' ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) ||
        e.target.isContentEditable
      )
        return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);
  const filtered = places.filter(
    p =>
      (floor === 'all' || p.floor === floor) &&
      `${p.name} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim())
  );
  return (
    <section className="section directory-section" id="directory">
      <div className="container">
        <SectionHeading
          index="02"
          label="THE FLOOR DIRECTORY"
          title={
            <>
              Less searching.
              <br />
              <span className="muted-heading">More getting there.</span>
            </>
          }
        >
          Find a place, see its level, and make it your destination. Every
          listing here belongs to our illustrative venue.
        </SectionHeading>
        <div className="directory-toolbar reveal">
          <div
            className="floor-tabs"
            role="group"
            aria-label="Filter directory by floor"
          >
            {[
              {
                id: 'all',
                name: 'All floors',
              },
              ...floors,
            ].map(f => (
              <button
                type="button"
                key={f.id}
                aria-pressed={floor === f.id}
                onClick={() => setFloor(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
          <label className="directory-search">
            <Search size={16} />
            <input
              ref={searchRef}
              type="search"
              placeholder="Find a place…"
              aria-label="Search sample directory"
              aria-keyshortcuts="/"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
        </div>
        <div className="directory-count" role="status">
          {filtered.length} sample {filtered.length === 1 ? 'place' : 'places'}
          {search && ` matching “${search}”`}
        </div>
        <div className="directory-grid">
          {filtered.slice(0, search || floor !== 'all' ? 30 : 8).map(p => {
            const Icon = icons[p.icon];
            return (
              <article className="directory-card" key={p.id}>
                <div className="directory-card-top">
                  <span className="directory-icon">
                    <Icon size={20} />
                  </span>
                  <span className="floor-pill">
                    {floors[p.floor].short}{' '}
                    <span>/ {floors[p.floor].name}</span>
                  </span>
                </div>
                <p className="micro-label">{p.category}</p>
                <h3>{p.name}</h3>
                <p className="place-description">{p.detail}</p>
                <button
                  type="button"
                  className="directory-route"
                  onClick={() => onSelect(p.id)}
                >
                  Plan a route here <ArrowUpRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
        {!filtered.length && (
          <div className="directory-empty">
            <Search size={24} />
            <h3>No matching sample places.</h3>
            <p>Try “café”, “lift”, or “lounge”, or select another floor.</p>
            <button
              className="button button-small"
              onClick={() => {
                setSearch('');
                setFloor('all');
              }}
            >
              Reset search
            </button>
          </div>
        )}
        {floor === 'all' && !search && (
          <button
            type="button"
            className="text-button directory-more"
            onClick={() => setFloor(0)}
          >
            Showing 8 of {places.length} places · Explore by floor{' '}
            <ArrowUpRight size={15} />
          </button>
        )}
      </div>
    </section>
  );
}

