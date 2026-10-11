# Frontend architecture

This is a dependency-free browser application using native ES modules, semantic HTML, CSS design tokens, and SVG. A static frontend is appropriate for the requested prototype: deployment requires no API keys, database, mapping licence, or server-side service.

```text
index.html                 Document entry and metadata
src/
  app.js                   Session state, events, navigation, approval dialogs
  data/scenarios.js        Synthetic disruption records and corridor presets
  domain/simulation.js     Deterministic outcomes, comparison, journey presets
  components/
    icons.js               Shared inline SVG icons
    network-map.js         Schematic road network and map controls
    panels.js              Reusable KPI, incident, response, and capacity panels
    views.js               Command centre, lab, emergency, commuter, demo screens
    landing.js             Product introduction, city illustration, entry loader
    traffic-film.js        Original aerial traffic motion and fullscreen road artwork
  styles/
    tokens.css             Colour, typography, spacing foundation and resets
    app.css                Component styling and responsive breakpoints
    readability.css        Shared contrast and typography refinements
    landing.css            Presentation layout, city motion, loader animation
    cinematic.css          Traffic film treatment and fullscreen entry animation
public/favicon.svg         Local brand asset
scripts/
  serve.mjs                Local HTTP preview with path confinement
  build.mjs                Portable static distribution
tests/simulation.test.mjs   Capacity conservation and decision-model checks
docs/                      Architecture, model assumptions, video walkthrough
vercel.json                Static deployment settings
dist/                      Generated static output, ignored in Git
```

## State and behaviour

The active scenario, response strategy, forecast minute, verification, map layers, and model settings live in the current session. Browser refresh resets them. A regular commuter journey is persisted in `localStorage`; no journey leaves the browser. Audit records are session-only and can be exported as JSON.

Changing scenario requires new verification. Changing a response or model setting invalidates its previous approval. Stale or conflicting evidence pauses verification and approval; restoring current evidence requires verification again. Native modal dialogs provide focus containment and Escape dismissal. All primary actions use semantic buttons and form controls.

## Simulation contract

- Scenario demands and capacities are synthetic hourly rates.
- The no-action baseline leaves part of demand on the disrupted approach.
- A single diversion assigns 78% of demand to one arterial, demonstrating overload.
- Coordination assigns demand proportionally to practical corridor capacity, never above capacity. Demand exceeding total available capacity is explicitly unassigned.
- The neighbourhood metric is an indicative exposure estimate for sensitive streets; it is not an additional fourth route or an independent trip count. The coordinated protection setting caps it at 90% of practical local capacity.
- Journey times use a simple congestion penalty. Delay is a comparative scenario score expressed in illustrative vehicle-hours and scaled by selected duration. It is not a calibrated traffic-flow integral.
- Queue growth, spillback ranges, recovery, and emergency-priority benefits are deterministic demo assumptions. The timeline evaluates a forecast horizon from the disruption snapshot, not actual wall-clock time.
- Origin, destination, mode, and departure change journey presets. No road-graph routing or public-transport timetable engine runs in the browser.

## Path to a real product

Replace the scenario adapter with timestamped incident and traffic APIs. Use licensed or open road geometry with directions and turn restrictions. Introduce a calibrated traffic-flow simulation and compare the proposed allocation against baselines. Expose confidence and freshness from actual evidence. Keep operational authorisation and emergency integrations on authenticated services, with durable audit records and explicit permissions.

The proposed novelty is the integrated workflow and network-aware response comparison. This prototype does not establish that the feature combination is unique across all products or that the illustrative improvements occur in a real city.
