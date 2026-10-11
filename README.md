# IERMC · Traffic Intelligence
Vercel-https://iermc.vercel.app/

**Predict the next bottleneck. Coordinate before it spreads.**

An interactive frontend prototype for the AI-powered Traffic Incident Prediction & Response System proposed by **IERMC**. The command centre demonstrates network spillback, capacity-aware routing, neighbourhood protection, and emergency access as one operator workflow.

## Run locally

Requires Node.js 20.11 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open **http://127.0.0.1:5173**. To build and serve the production output:

```sh
npm run build
npm run preview
```

Stop the previous preview before starting another on the same port, or set `PORT` to a different value.

## What works

- Product landing page with an original animated aerial traffic intersection and direct scenario entry.
- A brief workspace loading state with Escape/cancel support; the landing page opens directly.
- Four scenarios: collision, scheduled roadwork, emergency access, and diversion overload.
- Incident inspection and manual verification, with source confidence and freshness.
- Animated schematic road network, forecast timeline, map layers, zoom, and perspective view.
- No-action, single-diversion, and coordinated-response comparisons.
- Capacity-constrained distribution, visible unmet demand, and neighbourhood exposure.
- Adjustable demand, disruption duration, local protection, and emergency priority.
- Emergency destination and vehicle presets, corridor assessment, and coordination review.
- Commuter origin, destination, departure, and mode presets; journey alternatives and saved local journey alerts.
- Human approval dialog, session decision record, comparison and audit JSON exports.
- Stale-feed and conflicting-report fallback states.
- Responsive layouts, keyboard controls, native dialogs, and reduced-motion support.
- Built-in demo story and a three-minute recording script.

## Deploy

Run `npm run build` and deploy the contents of `dist/` to a static host. A `vercel.json` configuration is included: build command `npm run build`, output directory `dist`, no framework preset required. Hash-based navigation requires no server-side route handling. This repository has been prepared for deployment; no external publication or Git push is performed by the build.

All assets are local and there are no runtime CDN, API, or package dependencies.

The root URL opens the product landing page. Use `#dashboard` for direct workspace access, or select **Product overview** in the workspace navigation to return to the landing page.

## Verify

```sh
npm test
npm run build
```

Tests cover demand conservation, corridor limits, excess demand, protection constraints, overload behaviour, forecast evolution, journey presets, and emergency evidence requirements.

## Documentation

- [Architecture and model assumptions](docs/ARCHITECTURE.md)
- [Demo video walkthrough](docs/DEMO-VIDEO.md)
- [Project proposal](Project%20Report.pdf)

**Prototype disclosure:** Road geometry is schematic and traffic data is synthetic. Forecasts and comparisons are illustrative. There is no live traffic feed, trained prediction service, emergency dispatch, or signal-control integration. The UI demonstrates the proposed product flow, not validated real-world performance.
