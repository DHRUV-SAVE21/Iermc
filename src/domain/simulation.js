import { corridors } from '../data/scenarios.js';

// A deliberately small, deterministic illustrative model. No trained model or live feed.
export function simulate(scenario, strategy = 'none', settings = {}, minute = 0) {
  const demand = Math.round(scenario.demand * (settings.demandScale ?? 1));
  const guard = settings.guard !== false;
  const coordinated = strategy === 'coordinated';
  const diverted = strategy === 'single';
  let allocations;
  let unassigned = 0;
  if (coordinated) {
    const total = scenario.capacity.reduce((a, b) => a + b, 0);
    const assigned = Math.min(total, demand);
    allocations = scenario.capacity.map(c => Math.floor(assigned * c / total));
    let remainder = assigned - allocations.reduce((a, b) => a + b, 0);
    for (let i = 0; remainder > 0; i = (i + 1) % allocations.length) {
      if (allocations[i] < scenario.capacity[i]) { allocations[i]++; remainder--; }
    }
    unassigned = demand - assigned;
  } else if (diverted) {
    allocations = [Math.round(demand * .78), Math.round(demand * .14), 0];
    allocations[2] = demand - allocations[0] - allocations[1];
  } else {
    allocations = [Math.round(demand * .34), Math.round(demand * .18), Math.round(demand * .08)];
    unassigned = demand - allocations.reduce((a, b) => a + b, 0);
  }
  const routes = corridors.map((c, i) => {
    const utilization = Math.round(allocations[i] / scenario.capacity[i] * 100);
    const overload = Math.max(0, utilization - 85);
    const minutes = Math.round(c.baseTime + overload * .16 + (coordinated ? 0 : 3));
    return { ...c, capacity: scenario.capacity[i], trips: allocations[i], utilization, minutes };
  });
  const localExposure = Math.round(demand * (coordinated ? (guard ? .09 : .24) : diverted ? .29 : .2));
  const neighbourhoodTrips = coordinated && guard ? Math.min(localExposure, Math.floor(scenario.sensitiveCap * .9)) : localExposure;
  const localUtilization = Math.round(neighbourhoodTrips / scenario.sensitiveCap * 100);
  const durationFactor = (settings.duration ?? 30) / 30;
  const delay = Math.round((routes.reduce((sum, r) => sum + r.trips * Math.max(0, r.minutes - 16), 0) / 60 + unassigned * .6 + Math.max(0, localUtilization - 100) * .65) * durationFactor);
  const queue = Math.round((coordinated ? 180 : diverted ? 520 : 840) * (demand / scenario.demand) * (1 + minute / 25) * durationFactor);
  const emergencyMinutes = coordinated && settings.priority !== false ? 13 : diverted ? 22 : 28;
  const spillbackRange = (coordinated ? [12,16] : scenario.spillback).map(n=>Math.max(0,n-minute));
  return { demand, routes, delay, queue, neighbourhoodTrips, localUtilization, unassigned, emergencyMinutes, spillbackRange, threatened: coordinated ? 1 : diverted ? 3 : 4, recovery: Math.round((coordinated ? 22 : diverted ? 35 : 46) * durationFactor), coordinated };
}

export function compare(scenario, settings, minute) {
  const baseline = simulate(scenario, 'none', settings, minute);
  const single = simulate(scenario, 'single', settings, minute);
  const coordinated = simulate(scenario, 'coordinated', settings, minute);
  return { baseline, single, coordinated, reduction: Math.round((baseline.delay - coordinated.delay) / baseline.delay * 100) };
}

export function journeyOptions(result, journey) {
  const originFactor = { 'Andheri Station': 1, 'Airport Terminal 2': 1.18, Jogeshwari: 1.1 }[journey.origin] ?? 1;
  const destinationFactor = { BKC: 1, 'Cooper Hospital': .65, Powai: 1.24 }[journey.destination] ?? 1;
  const factor = originFactor * destinationFactor;
  const modeFactor = journey.mode === 'bus' ? 1.35 : journey.mode === 'walk' ? 3.8 : 1;
  const departureFactor = journey.departure === 'later' ? 1.12 : 1;
  return result.routes.map(r=>({...r, distance:Math.round(r.distance*factor*10)/10, minutes:Math.round(r.minutes*factor*modeFactor*departureFactor), cost:journey.mode==='bus'?25:journey.mode==='walk'?0:Math.round(r.cost*factor)}));
}

export function emergencyAssessment(result, state) {
  const vehiclePenalty = state.vehicle === 'fire' ? 3 : 0;
  const destinationAdjustment = state.emergencyDestination === 'SevenHills Hospital' ? -2 : 0;
  return {
    minutes: Math.max(5, result.emergencyMinutes + vehiclePenalty + destinationAdjustment),
    feasible: result.coordinated && state.settings.priority && state.feed === 'normal' && state.verified,
  };
}
