import { icon } from './icons.js';
import { compare } from '../domain/simulation.js';
const fmt = n => n.toLocaleString('en-IN');

export function statCards(result, scenario, state) {
  const accessFeasible = result.coordinated && state.settings.priority && state.verified && state.feed === 'normal';
  const spillbackUrgent = result.spillbackRange[0] === 0;
  return `<div class="stat-grid">
    <article class="stat-card"><div class="stat-top">Network disruption ${icon('signal',17)}</div><div class="stat-value">${fmt(result.queue)}<span>m</span></div><div class="stat-foot"><span class="dot ${result.coordinated ? 'green' : 'red'}"></span>${result.coordinated ? 'Queue growth contained' : 'Queue length · active corridor'}</div></article>
    <article class="stat-card"><div class="stat-top">Spillback forecast ${icon('clock',17)}</div><div class="stat-value">${result.spillbackRange[1]===0?'Reached':result.spillbackRange.join('–')}<span>${result.spillbackRange[1]===0?'':'min'}</span><span class="mini-badge ${result.coordinated && !spillbackUrgent ? 'success' : 'warning'}">${spillbackUrgent?'At junction':result.coordinated?'Deferred':'Act early'}</span></div><div class="stat-foot">${result.spillbackRange[1]===0?'Simulated queue reached J-04':'To Junction J-04 · forecast range'}</div></article>
    <article class="stat-card"><div class="stat-top">Affected journeys ${icon('route',17)}</div><div class="stat-value">${fmt(Math.round(scenario.affected * state.settings.demandScale))}</div><div class="stat-foot">${result.threatened} ${result.threatened===1?'junction':'junctions'} at risk · ${fmt(result.demand)} trips / h</div></article>
    <article class="stat-card"><div class="stat-top">Emergency access ${icon('shield',17)}</div><div class="stat-value">${result.emergencyMinutes}<span>min</span><span class="mini-badge ${accessFeasible ? 'success' : 'warning'}">${accessFeasible ? 'Feasible' : result.coordinated?'Review':'At risk'}</span></div><div class="stat-foot">Estimated corridor time · Cooper Hospital</div></article>
  </div>`;
}

export function incidentPanel(state, scenario) {
  return `<section class="panel incident-panel"><div class="panel-heading"><h2>Active incident</h2><span class="mini-badge danger">${scenario.risk} impact</span></div>
    <div class="incident-title"><div class="incident-icon">${icon(scenario.icon,22)}</div><div><h3>${scenario.type}</h3><p>${scenario.location}</p></div></div>
    <p class="incident-description">${scenario.description}</p>
    <div class="verification-row"><span class="mini-badge ${state.verified ? 'success' : 'warning'}">${icon(state.verified ? 'check' : 'clock',12)} ${state.verified ? 'Reviewed in demo' : 'Awaiting verification'}</span><span>INC-${scenario.id === 'collision' ? '042' : scenario.id === 'roadwork' ? '043' : scenario.id === 'emergency' ? '044' : '045'}</span></div>
    <dl class="incident-details"><div><dt>Reported at</dt><dd>${scenario.time} IST</dd></div><div><dt>Lanes affected</dt><dd>${scenario.lanes}</dd></div><div><dt>Expected duration</dt><dd>${scenario.duration}</dd></div></dl>
    <div class="source-line">${icon('info',13)} ${scenario.source}</div>
    ${!state.verified ? `<button class="button primary full" data-action="verify">${icon('check',16)} Verify incident ${icon('arrow',16)}</button>` : `<div class="verified-note">${icon('check',15)} Verified in this demo session</div>`}
    <div class="prediction-note"><div>${icon('signal',16)} <strong>What happens next?</strong></div><p>Without a coordinated response, the queue may reach J-04 in ${scenario.spillback[0]}–${scenario.spillback[1]} minutes and affect upstream crossings.</p></div>
  </section>`;
}

export function responsePanel(state, scenario) {
  const comparison = compare(scenario, state.settings, state.minute);
  const values = [comparison.baseline, comparison.single, comparison.coordinated];
  const options = [['none','No action','Existing traffic patterns continue'],['single','Single diversion','Recommend the shortest alternative'],['coordinated','Coordinated response','Distribute demand + preserve access']];
  return `<section class="panel response-panel"><div class="panel-heading"><div><h2>Choose a better network outcome</h2><p>Compare response strategies before approval</p></div><span class="eyebrow mint-text">THE IERMC DIFFERENCE</span></div>
    <div class="response-options">${options.map(([id,title,desc],i) => `<button class="response-option ${state.strategy === id ? 'selected' : ''}" data-action="strategy" data-value="${id}" aria-pressed="${state.strategy === id}"><div class="response-option-title"><span class="radio-dot"></span><strong>${title}</strong>${id === 'coordinated' ? `<span class="recommended">${values[i].localUtilization > 100 || values[i].unassigned > 0 ? 'REVIEW CAPACITY' : 'RECOMMENDED'}</span>` : ''}</div><p>${desc}</p><div class="response-metric"><strong>${fmt(values[i].delay)}</strong><span>vehicle-hours delay</span></div><div class="response-bottom"><span>Peak load <b class="${Math.max(...values[i].routes.map(r=>r.utilization)) > 100 ? 'red-text' : 'green-text'}">${Math.max(...values[i].routes.map(r=>r.utilization))}%</b></span><span>${values[i].emergencyMinutes} min emergency ETA</span></div></button>`).join('')}</div>
    <div class="response-footer"><span>${icon('info',15)} Illustrative model outputs, not measured city improvements.</span><button class="button primary" data-action="review" ${!state.verified || state.strategy === 'none' || state.approved ? 'disabled' : ''}>${state.approved ? icon('check',16)+' Response approved' : 'Review response '+icon('arrow',16)}</button></div>
  </section>`;
}

export function corridorPanel(result) {
  return `<section class="panel corridor-panel"><div class="panel-heading"><div><h2>Corridor distribution</h2><p>Demand assigned against practical capacity</p></div>${icon('route',20)}</div><div class="corridor-table"><div class="corridor-table-head"><span>Corridor</span><span>Trips / h</span><span>Utilisation</span><span>ETA</span></div>${result.routes.map(r=>`<div class="corridor-row"><div><i style="background:${r.color}"></i><strong>${r.name}</strong><small>${r.detail}</small></div><span>${fmt(r.trips)}<small>/ ${fmt(r.capacity)}</small></span><div class="util-cell"><span class="util-bar"><i style="width:${Math.min(r.utilization,100)}%;background:${r.utilization>100?'#e45b5b':r.color}"></i></span><b class="${r.utilization>100?'red-text':''}">${r.utilization}%</b></div><strong>${r.minutes}<small> min</small></strong></div>`).join('')}</div>${result.unassigned>0?`<div class="capacity-note">${icon('info',14)} ${fmt(result.unassigned)} trips remain on the affected approach or await capacity.</div>`:''}</section>`;
}

export function guardPanel(result,state) {
  const safe = result.localUtilization <= 100;
  return `<section class="panel guard-panel"><div class="panel-heading"><div><h2>Neighbourhood spillover guard</h2><p>Better routes. Fairer outcomes.</p></div><span class="guard-icon">${icon('shield',22)}</span></div><div class="guard-status"><span class="mini-badge ${safe ? 'success' : 'warning'}">${safe ? 'Within local capacity' : 'Diversion pressure detected'}</span><strong class="${safe?'green-text':'amber-text'}">${result.localUtilization}%</strong></div><div class="guard-meter"><i style="width:${Math.min(result.localUtilization,100)}%;background:${safe?'#3caf91':'#d8a04b'}"></i></div><div class="guard-caption"><span>Projected local street utilisation</span><span>100% capacity</span></div><div class="protected-place">${icon('shield',17)}<div><strong>School zone & residential streets</strong><p>${state.settings.guard ? 'Capacity constraint enabled' : 'Protection constraint disabled'} · ${result.neighbourhoodTrips} trips / h projected</p></div></div><p class="guard-explanation">${safe ? 'The selected response limits local cut-through traffic while allocating trips to the arterial network.' : 'This response shifts excess demand onto sensitive streets. Compare coordinated routing with the protection constraint enabled.'}</p></section>`;
}
