import { Accessibility, ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
export default function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="Artistic illustration of a step-free route through three building levels. Not a geographical map."
      role="img"
    >
      <div className="orb orb-blue" />
      <div className="orb orb-violet" />
      <div className="art-coordinate coordinate-top">
        INCLUSIVE BY DESIGN <span>↗</span>
      </div>
      <div className="isometric-scene">
        <svg
          className="iso-map"
          viewBox="0 0 650 600"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="plate"
              x1="100"
              y1="0"
              x2="550"
              y2="450"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2b2d3c" />
              <stop offset=".46" stopColor="#141721" />
              <stop offset="1" stopColor="#12151c" />
            </linearGradient>
            <linearGradient id="edge" x1="0" y1="0" x2="650" y2="600">
              <stop stopColor="#848698" stopOpacity=".5" />
              <stop offset="1" stopColor="#171b2b" />
            </linearGradient>
            <linearGradient
              id="route"
              x1="150"
              y1="500"
              x2="500"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6289ff" />
              <stop offset=".5" stopColor="#9d9aff" />
              <stop offset="1" stopColor="#c5f277" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <pattern
              id="grid"
              width="38"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-30)"
            >
              <path d="M38 0H0V24" stroke="#adb6e9" strokeOpacity=".045" />
            </pattern>
          </defs>
          <ellipse
            cx="330"
            cy="493"
            rx="244"
            ry="54"
            fill="#05060b"
            opacity=".8"
          />
          {[160, 80, 0].map((shift, i) => (
            <g
              key={shift}
              transform={`translate(0 ${shift})`}
              className={`art-floor art-floor-${i}`}
            >
              <path
                d="M83 220 323 80 574 226 334 366Z"
                fill="#0e111a"
                transform="translate(0 12)"
                stroke="#363a4c"
                strokeOpacity=".5"
              />
              <path
                d="M83 220 323 80 574 226 334 366Z"
                fill="url(#plate)"
                stroke="url(#edge)"
              />
              <path d="M83 220 323 80 574 226 334 366Z" fill="url(#grid)" />
              <path
                d="m120 220 204-118 214 124-204 118Z"
                stroke="#7f88b7"
                strokeOpacity=".12"
              />
              <path
                d="m228 135 215 125M163 174l215 126M278 329l205-118M216 293l204-118"
                stroke="#8f98b9"
                strokeOpacity=".13"
              />
              <path
                d="m165 219 54-31 54 31-54 32Z"
                fill="#303442"
                stroke="#717895"
                strokeOpacity=".2"
              />
              <path d="m165 219 54 32v-22l-54-32Z" fill="#252936" />
              <path d="m219 251 54-32v-22l-54 32Z" fill="#1b1e2b" />
              <path
                d="m165 197 54-32 54 32-54 32Z"
                fill="#3c4053"
                stroke="#747a96"
                strokeOpacity=".4"
              />
              <path
                d="m353 176 57-33 62 36-57 33Z"
                fill="#343847"
                stroke="#747a96"
                strokeOpacity=".3"
              />
              <path d="m353 176 62 36v-31l-62-36Z" fill="#252a38" />
              <path d="m415 212 57-33v-31l-57 33Z" fill="#1d2230" />
              <path
                d="m353 145 57-33 62 36-57 33Z"
                fill="#44495d"
                stroke="#8d92ac"
                strokeOpacity=".4"
              />
              <path
                d="m354 291 59-34 48 28-59 34Z"
                fill="#2c3141"
                stroke="#717895"
                strokeOpacity=".3"
              />
              <circle
                cx="334"
                cy="281"
                r="14"
                fill="#161b28"
                stroke="#6473a6"
                strokeOpacity=".35"
              />
            </g>
          ))}
          <path
            d="m147 419 77 45 110-65v-80l87-50v-80l63-37"
            stroke="#85a0ff"
            strokeWidth="13"
            opacity=".3"
            filter="url(#glow)"
          />
          <path
            className="hero-route-line"
            d="m147 419 77 45 110-65v-80l87-50v-80l63-37"
            stroke="url(#route)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m334 399v-80m87-50v-80"
            stroke="#b1b5f5"
            strokeWidth="2"
            strokeDasharray="4 7"
          />
          <ellipse
            cx="147"
            cy="419"
            rx="14"
            ry="8"
            fill="#6b93ff"
            opacity=".2"
          />
          <ellipse cx="147" cy="419" rx="6" ry="3.5" fill="#a3c0ff" />
          <ellipse
            cx="484"
            cy="152"
            rx="22"
            ry="12"
            fill="#c5f277"
            opacity=".1"
          />
          <ellipse cx="484" cy="152" rx="9" ry="5" fill="#c5f277" />
          <path d="M484 144v-36" stroke="#c5f277" strokeWidth="2" />
          <circle cx="484" cy="100" r="13" fill="#c5f277" />
          <path
            d="m479 100 3 3 6-6"
            stroke="#202617"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="566"
            y="254"
            fill="#6c7286"
            fontSize="10"
            fontFamily="monospace"
          >
            02
          </text>
          <text
            x="566"
            y="334"
            fill="#6c7286"
            fontSize="10"
            fontFamily="monospace"
          >
            01
          </text>
          <text
            x="566"
            y="414"
            fill="#6c7286"
            fontSize="10"
            fontFamily="monospace"
          >
            G
          </text>
        </svg>
      </div>
      <div className="art-tag tag-destination">
        <span className="tiny-icon">
          <MoveUpRight size={15} />
        </span>
        <div>
          <small>YOUR DESTINATION</small>
          <strong>A little more independent.</strong>
        </div>
      </div>
      <div className="art-tag tag-access">
        <span className="access-icon">
          <Accessibility size={22} />
        </span>
        <div>
          <strong>Step-free. Stress less.</strong>
          <small>
            <Check size={11} /> Your preferences, considered.
          </small>
        </div>
        <ArrowUpRight size={16} />
      </div>
      <div className="art-coordinate coordinate-bottom">
        <span className="signal-dot" /> SAMPLE JOURNEY <span>G → 02</span>
      </div>
    </div>
  );
}

