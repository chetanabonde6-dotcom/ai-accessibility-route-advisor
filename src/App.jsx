import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Accessibility,
  Route,
  Layers3,
  ScanLine,
  SlidersHorizontal,
  ShieldCheck,
  Menu,
  X,
  Code2,
  Braces,
  Wind,
  Sparkles,
  MapPin,
  Heart,
} from 'lucide-react';
import Brand from './components/Brand.jsx';
import HeroArt from './components/HeroArt.jsx';
import Planner from './components/Planner.jsx';
import Directory from './components/Directory.jsx';
import Feedback from './components/Feedback.jsx';
import { Magnetic, SectionHeading } from './components/UI.jsx';
gsap.registerPlugin(ScrollTrigger);
const nav = [
  ['#planner', 'Route planner'],
  ['#directory', 'Directory'],
  ['#about', 'Our purpose'],
];
function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#planner">
          Explore the demo <ArrowUpRight size={15} />
        </a>
        <button
          type="button"
          className="mobile-menu-toggle icon-button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        inert={!open ? true : undefined}
      >
        {[...nav, ['#contact', 'Feedback']].map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
            <ArrowUpRight size={15} />
          </a>
        ))}
      </nav>
    </header>
  );
}
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-background" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow hero-enter">
            <span className="signal-dot" /> AI ACCESSIBILITY ROUTE ADVISOR
          </div>
          <h1 className="hero-enter">
            A better way.
            <br />
            For <span>every body.</span>
          </h1>
          <p className="hero-description hero-enter">
            The shortest route isn’t always the right one.
            <br className="desktop-break" /> Discover journeys that consider
            your accessibility needs, one thoughtful step at a time.
          </p>
          <div className="hero-actions hero-enter">
            <Magnetic href="#planner" className="button-lime">
              Find your way <ArrowUpRight size={18} />
            </Magnetic>
            <a href="#about" className="quiet-link">
              Meet the project{' '}
              <span className="circle-arrow">
                <ArrowRight size={13} />
              </span>
            </a>
          </div>
          <div className="hero-footnote hero-enter">
            <div className="stacked-icons">
              <span>
                <Accessibility size={15} />
              </span>
              <span>
                <Route size={15} />
              </span>
              <span>
                <Heart size={14} />
              </span>
            </div>
            <p>
              Designed around people.
              <br />
              <strong>Built to explore what’s possible.</strong>
            </p>
          </div>
        </div>
        <div className="hero-enter hero-art-wrap">
          <HeroArt />
        </div>
      </div>
      <div className="container hero-bottom">
        <a href="#planner">
          <ArrowDown size={13} /> SCROLL TO EXPLORE
        </a>
        <p>
          AI ACCESSIBILITY ROUTE ADVISOR <span>CEP / 2026–27</span>
        </p>
      </div>
    </section>
  );
}
function FeatureStrip() {
  return (
    <div className="feature-strip">
      <div className="container feature-strip-grid">
        {[
          [
            Accessibility,
            'Built around you',
            'Preferences that shape your path',
          ],
          [
            Layers3,
            'Every level, considered',
            'An interactive sample floor directory',
          ],
          [
            SlidersHorizontal,
            'Clarity over guesswork',
            'See why a route was suggested',
          ],
          [ShieldCheck, 'Honest by design', 'Sample data. Clear limitations.'],
        ].map(([Icon, title, description]) => (
          <div className="strip-feature" key={title}>
            <Icon size={21} strokeWidth={1.4} />
            <div>
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-intro reveal">
          <div>
            <p className="eyebrow">
              <span>03 /</span> THE REASON WE’RE HERE
            </p>
            <h2>
              Independence shouldn’t
              <br />
              depend on <span className="serif-word">guesswork.</span>
            </h2>
          </div>
          <div className="about-body">
            <p>
              A staircase. A closed lift. An uneven path. Small details can
              change an entire journey.
            </p>
            <p>
              This project brings the AI Accessibility Route Advisor report to life
              as a hands-on web experience. The goal is simple: help people
              understand their options, with accessibility considered from the
              start.
            </p>
          </div>
        </div>
        <div className="approach-grid">
          <article className="approach-card approach-primary reveal">
            <div className="approach-icon">
              <Accessibility size={29} strokeWidth={1.3} />
            </div>
            <span className="card-index">01 / PEOPLE FIRST</span>
            <h3>
              Different needs.
              <br />
              Equal consideration.
            </h3>
            <p>
              Wheelchair users, older adults, people with temporary injuries,
              caregivers, and anyone who benefits from a clearer path.
            </p>
            <div className="people-art" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <i />
            </div>
          </article>
          <article className="approach-card reveal">
            <div className="approach-icon">
              <ScanLine size={27} strokeWidth={1.3} />
            </div>
            <span className="card-index">02 / KNOW YOUR ROUTE</span>
            <h3>
              Details that
              <br />
              make a difference.
            </h3>
            <p>
              Compare stair segments, lift connections, modelled slopes,
              surfaces, and distance. Get a written explanation alongside the
              diagram.
            </p>
            <div className="detail-tags">
              <span>Step-free</span>
              <span>Surface condition</span>
              <span>Lift access</span>
              <span>Slope</span>
            </div>
          </article>
          <article className="approach-card reveal">
            <div className="approach-icon">
              <ShieldCheck size={27} strokeWidth={1.3} />
            </div>
            <span className="card-index">03 / TRUST THE CONTEXT</span>
            <h3>
              Useful information.
              <br />
              Visible uncertainty.
            </h3>
            <p>
              The report describes an informal visit, not a verified
              accessibility audit. This prototype uses fictional data and
              explains its ranking.
            </p>
            <a href="#project-notes" className="text-button">
              Read the project notes <ArrowUpRight size={14} />
            </a>
          </article>
        </div>
        <div className="project-notes reveal" id="project-notes">
          <div className="project-notes-label">
            <MapPin size={19} />
            <span>PROJECT CONTEXT</span>
          </div>
          <div>
            <h3>Inspired by a community question in Pune.</h3>
            <p>
              The report names Phoenix Market City, Viman Nagar, as the visit
              context. Its annexure also names Phoenix Mall of the Millennium
              and contains observation entries that conflict with the “informal
              visit” description. We treat venue conditions and feedback
              outcomes as unverified. The schematic and directory here are
              independently created sample data, not real store listings.
            </p>
          </div>
          <span className="context-tag">Educational prototype</span>
        </div>
      </div>
    </section>
  );
}
function Technology() {
  const team = [
    'Abhishek Chhavinath Gupta',
    'Avinash Vilas Chavan',
    'Bhagyashri Gulabrao Bhise',
    'Chetana Harishchandra Bonde',
  ];
  return (
    <section className="section technology-section" id="technology">
      <div className="container">
        <SectionHeading
          index="04"
          label="THOUGHTFULLY BUILT"
          title={
            <>
              A clear purpose.
              <br />
              <span className="muted-heading">A focused toolkit.</span>
            </>
          }
        >
          A modern React experience built from the report’s workflow.
          Transparent route logic keeps this demonstration easy to inspect and
          explain.
        </SectionHeading>
        <div className="tech-list reveal">
          {[
            [Code2, 'React', 'Reusable interface components'],
            [Wind, 'Tailwind CSS', 'Responsive design system'],
            [Sparkles, 'GSAP', 'Motion with restraint'],
            [Braces, 'JavaScript', 'Transparent graph-based routing'],
          ].map(([Icon, title, detail]) => (
            <div className="tech-item" key={title}>
              <Icon size={25} strokeWidth={1.3} />
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
              <ArrowUpRight size={14} />
            </div>
          ))}
        </div>
        <div className="team-block reveal">
          <div>
            <span className="micro-label">THE REPORT’S PROJECT TEAM</span>
            <p>
              Dr. D. Y. Patil College of Engineering & Innovation, Varale,
              Talegaon, Pune
            </p>
            <small>Guide: Mrs. Ashwini Shirke · Academic year 2026–2027</small>
          </div>
          <div className="team-names">
            {team.map((name, i) => (
              <span key={name}>
                <i>0{i + 1}</i>
                {name}
              </span>
            ))}
          </div>
        </div>
        <details className="implementation-notes">
          <summary>
            What is implemented, and what comes next? <ChevronIcon />
          </summary>
          <p>
            This website implements the input → preferences → route comparison
            workflow, floor lookup, written directions, optional browser speech,
            local journey saving, and local feedback export. The report proposes
            Python and Streamlit; this edition uses React, Tailwind CSS, and
            GSAP as requested. “AI Accessibility Route Advisor” is the project
            title: this build has no trained AI model, GPS positioning, real
            venue data, external map integration, live lift feed, or remote
            feedback service. Real navigation requires verified data,
            consent-based fieldwork, accessibility testing, and ongoing updates.
          </p>
        </details>
      </div>
    </section>
  );
}
function ChevronIcon() {
  return <ArrowDown size={14} />;
}
export default function App() {
  const root = useRef(null);
  const [destinationRequest, setDestinationRequest] = useState(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.hero-enter', {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.08,
        });
        gsap.utils.toArray('.reveal').forEach(el =>
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 93%',
              once: true,
            },
          })
        );
      },
      root
    );
    return () => media.revert();
  }, []);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const directoryDestination = id => {
    setDestinationRequest({
      id,
      at: Date.now(),
    });
    document.getElementById('planner').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    requestAnimationFrame(() =>
      document.getElementById('destination').focus({
        preventScroll: true,
      })
    );
  };
  return (
    <div ref={root} className="site-root relative min-h-screen bg-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <FeatureStrip />
        <section className="section planner-section" id="planner">
          <div className="container">
            <SectionHeading
              index="01"
              label="THE INTERACTIVE EXPERIENCE"
              title={
                <>
                  A route that works
                  <br />
                  <span className="muted-heading">for the way you move.</span>
                </>
              }
            >
              Try the route studio. Set your needs, explore the floors, and see
              how a different preference changes the journey.
            </SectionHeading>
            <Planner destinationRequest={destinationRequest} />
            <div className="planner-undertext">
              <span>
                <span className="signal-dot" /> No sign-up. No location
                tracking.
              </span>
              <span>Made for exploration, not real-world navigation.</span>
            </div>
          </div>
        </section>
        <Directory onSelect={directoryDestination} />
        <About />
        <Technology />
        <Feedback />
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <Brand />
          <p>A better way. For every body.</p>
          <a className="back-top" href="#home">
            Back to top <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 AI Accessibility Route Advisor · A Community Engagement Project</span>
          <span>
            AI Accessibility Route Advisor <i /> Educational demonstration
          </span>
          <a href="#project-notes">
            Data & limitations <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
}

