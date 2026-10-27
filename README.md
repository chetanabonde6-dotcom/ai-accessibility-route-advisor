# AI Accessibility Route Advisor

A responsive accessibility route-planning demonstration built with **React, Tailwind CSS and GSAP**, featuring a dark glassmorphism interface and an interactive indoor sample map.

**Live website:** [AI Accessibility Route Advisor](https://pathwise-00i7so.v2.appdeploy.ai/)

## Features

- Wheelchair, walking, stroller and custom travel preferences.
- A fictional network of 20 places across three floors.
- Route filtering for stairs, modelled slopes, rough surfaces and unknown surfaces.
- Ranked alternatives with distance, illustrative duration and written directions.
- Thick directional route lines, A/B markers, floor transitions, route fitting, keyboard panning and zoom.
- Selectable itinerary steps that locate and highlight the relevant map segment.
- Searchable floor directory and direct destination selection.
- Saved journeys in browser storage, restoration and text download.
- Optional read-aloud directions through the browser's speech support.
- Consent-based local feedback, JSON export and clearing.
- Frosted-glass panels, focus indicators, keyboard controls and reduced-motion handling.

## Run locally

Use Node.js **22.12 or newer**; Node 24 is suitable.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. No API key, account or backend is needed.

```bash
npm test
npm run test:ui
npm run build
npm run test:standalone
npm run preview
```

The production build writes `dist/` and a self-contained `AI-Accessibility-Route-Advisor.html`. Open the standalone file in a modern browser, or serve `dist/` over HTTP. Dependencies and intermediate build files are excluded from Git; the generated Pages build in `docs/` is committed for hosting.

## Publish on GitHub Pages

The repository includes a self-contained production website at `docs/index.html`. Its scripts, styles and icon are embedded, so it works under the repository's Pages subpath without asset path configuration.

The repository owner must open **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/docs**, and save. GitHub Pages is not activated by adding these files alone. Once GitHub reports a successful deployment, the expected address is:

https://chetanabonde6-dotcom.github.io/ai-accessibility-route-advisor/

For future changes, run `npm run build:pages` and commit the updated `docs/` together with the source. This builds the application, runs the standalone interaction smoke check, and refreshes the Pages files. The separate AppDeploy website is not updated by this command.

## Important data boundaries

This is an **educational prototype**, not real-world navigation. Every mapped place, route connection, distance, surface, slope and availability setting is fictional sample data. It is not a floor plan or accessibility audit of Phoenix Marketcity or another venue.

“AI Accessibility Route Advisor” is the project name. The implemented ranking uses transparent graph filtering and explicit distance/lift/stair weights; no trained AI model, Google Maps integration, GPS, verified accessibility dataset or live lift feed is connected.

Feedback and saved journeys remain in the current browser. Nothing is emailed or uploaded by these features. The legacy `pathwise.*` storage keys are intentionally retained so the website rename does not remove existing saved data.

## Architecture

```text
src/App.jsx                 Page composition, navigation and animation lifecycle
src/components/             Brand, hero, planner, map, directory and feedback
src/data/network.js         Fictional network and travel profiles
src/lib/routing.js          Filtering, route ranking, directions and text export
src/lib/mapGeometry.js      Schematic paths, arrows, floor runs and view fitting
src/lib/storage.js          Versioned browser storage and file downloads
src/styles.css              Tailwind theme and responsive visual system
src/glass.css               Glass surfaces and map interface refinements
tests/                      Routing, storage, map geometry and interaction tests
scripts/                    Standalone HTML packaging and DOM smoke check
```

The exhaustive loop-free path search is suitable for this small sample graph. A larger navigation network needs a bounded routing algorithm and verified, maintained data.

## Hosting and verification

This repository contains the tested **Tailwind 4 local edition**. The linked AppDeploy website uses a Tailwind 3 compatibility configuration with the same interface and route logic. Pushing to GitHub does not automatically update that deployment.

The implementation passed 17 routing/storage/geometry checks and 12 component interaction checks. A standalone production smoke test covers mounting, route generation, saving and profile alternatives. The hosted interface was also checked in a real browser at tablet and phone-size widths. These checks do not establish physical venue accessibility, screen-reader certification or real navigation safety.

## Project context and attribution

The project is based on the supplied community engagement report from Dr. D. Y. Patil College of Engineering & Innovation, Varale, Talegaon, Pune, academic year 2026–2027. The report's team is Abhishek Chhavinath Gupta, Avinash Vilas Chavan, Bhagyashri Gulabrao Bhise and Chetana Harishchandra Bonde, guided by Mrs. Ashwini Shirke.

This website implementation was developed with AI assistance. The source report, private working files and browser data are not included in this repository.
