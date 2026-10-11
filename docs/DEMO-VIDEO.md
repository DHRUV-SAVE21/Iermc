# IERMC demo video

Use the built-in **Demo & decision log** screen as your rehearsal companion.

## Preparation

1. Run `npm run dev` and open `http://127.0.0.1:5173` in a browser.
2. Record a desktop browser at 1920 × 1080, 100% zoom. Maximise the window.
3. Hide bookmarks, notifications, personal tabs, and desktop pop-ups. Enable microphone recording and do a 10-second audio check.
4. Press **Reset demo** at the bottom of the app. Saved journeys persist, so check the commuter preset before recording.
5. Rehearse once. Move the pointer slowly. Pause for two seconds after each result so the judge can read it.
6. Start the recording on the landing page. Use **Product overview** in the workspace navigation to return there, or open the root URL. Capture the fullscreen intro and animated traffic illustration, then click **Enter command centre** to capture the animated entry transition.

## Three-minute script

| Time | Screen and actions | Narration |
| --- | --- | --- |
| 00:00–00:20 | Landing page. Show the traffic motion illustration, then click **Enter command centre** to show the loader and open the collision scenario. | “A collision is local. Its consequences are not. Queues spread into junctions, diversions overload, and emergency access becomes uncertain. IERMC predicts the next bottleneck and coordinates a response before disruption spreads.” |
| 00:20–00:55 | Inspect the incident. Point to source confidence, lanes, timestamp. Click **Verify incident**. Play forecast briefly or drag timeline to +8 min. | “Operators get a shared disruption picture with source confidence and verification. The forecast shows queue growth and a time range before spillback reaches another junction.” |
| 00:55–01:15 | Choose **Overload**. Verify this new incident. Choose **Single diversion** and scroll to corridor distribution. | “If everyone follows the same alternative, the diversion becomes the next bottleneck. Notice the corridor exceeding capacity and pressure transferring onto neighbourhood streets.” |
| 01:15–01:45 | Choose **Coordinated response**. Show corridor distribution, local protection, and estimated emergency time. Open Scenario lab if time permits. | “Our proposed differentiation combines capacity-aware multi-route allocation, a neighbourhood guard, and emergency access in one decision. These outcomes recalculate together. Excess demand is shown rather than silently assigned to full corridors.” |
| 01:45–02:05 | Open **Emergency access**. Point to the assessed corridor. Review coordination and record the request. | “Emergency teams can assess feasible corridors and constraints. This is decision support; coordination remains an authorised human workflow.” |
| 02:05–02:30 | Open **Commuter journeys**. Select origin and destination, find options, save the regular journey. | “Commuters see route-relevant disruption warnings and alternatives with time, cost, and capacity. The system considers the network impact of many journeys.” |
| 02:30–02:45 | Return to command centre. Review the coordinated response and approve it. Open **Demo & decision log**. | “An operator reviews the trade-offs before approval. The decision record preserves what was verified and what was selected.” |
| 02:45–03:00 | Show the USP statement or decision record | “This is an interactive frontend prototype using synthetic data and illustrative road geometry. Next, we calibrate the road-network model and compare outcomes against independent routing. Our focus is network reliability, emergency access, and fairer diversion outcomes.” |

## Optional 30-second robustness segment

Click **Demo feed · just updated** in the header and select **Stale observation**. Show the warning and explain that approval pauses until current evidence is restored and verified. This demonstrates an operational fallback instead of pretending every feed is reliable.

## What to say about the numbers

- “Illustrative forecast”, “simulated comparison”, and “under these scenario inputs”.
- The displayed delay reduction demonstrates the scenario model, not measured traffic performance.
- The map is a schematic inspired by Andheri landmarks. Do not describe it as surveyed road geometry, actual turn restrictions, or live city coverage.
- This prototype has no trained AI service, real emergency dispatch, or traffic-signal actuation.

## Suggested submission description

“IERMC is an interactive traffic intelligence prototype by GiniXIndex. It demonstrates incident verification, queue spillback forecasting, capacity-aware route distribution, neighbourhood protection, emergency corridor assessment, and route-aware commuter guidance. The proposed USP is integrating network consequences and coordinated response in one operator workflow. All traffic values and comparisons in this demonstration are simulated.”
