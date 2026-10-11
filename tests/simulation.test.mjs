import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, defaultSettings } from '../src/data/scenarios.js';
import { simulate, compare, journeyOptions, emergencyAssessment } from '../src/domain/simulation.js';

test('coordinated assignments conserve demand and never exceed corridor capacity', () => {
  for (const scenario of scenarios) {
    for (const demandScale of [.5,1,1.5]) {
      const r = simulate(scenario,'coordinated',{...defaultSettings,demandScale});
      assert.equal(r.routes.reduce((sum,x)=>sum+x.trips,0)+r.unassigned,r.demand);
      for (const route of r.routes) assert.ok(route.trips<=route.capacity);
      assert.ok(r.localUtilization<=90,'protected neighbourhood retains a capacity margin');
    }
  }
});
test('excess demand is retained visibly rather than silently assigned to full roads', () => {
  const r=simulate(scenarios[3],'coordinated',{...defaultSettings,demandScale:1.5});
  assert.ok(r.unassigned>0);
  assert.equal(r.routes.reduce((sum,x)=>sum+x.trips,0),scenarios[3].capacity.reduce((a,b)=>a+b,0));
});
test('single diversion demonstrates the overload failure and coordinated response reduces it', () => {
  const c=compare(scenarios[3],defaultSettings,0);
  assert.ok(c.single.routes[0].utilization>100);
  assert.ok(c.single.localUtilization>100);
  assert.ok(c.coordinated.delay<c.baseline.delay);
  assert.ok(c.coordinated.localUtilization<c.single.localUtilization);
});
test('protection and priority settings affect their corresponding outcomes', () => {
  const protectedResult=simulate(scenarios[0],'coordinated',defaultSettings);
  const unprotected=simulate(scenarios[0],'coordinated',{...defaultSettings,guard:false,priority:false});
  assert.ok(protectedResult.neighbourhoodTrips<unprotected.neighbourhoodTrips);
  assert.ok(protectedResult.emergencyMinutes<unprotected.emergencyMinutes);
});
test('longer disruption changes delay and recovery; forecast identifies reached junctions', () => {
  const short=simulate(scenarios[0],'none',{...defaultSettings,duration:15},0);
  const long=simulate(scenarios[0],'none',{...defaultSettings,duration:60},15);
  assert.ok(long.delay>short.delay);
  assert.ok(long.recovery>short.recovery);
  assert.ok(long.queue>short.queue);
  assert.deepEqual(long.spillbackRange,[0,0]);
});
test('journey presets respond to origin, destination, departure, and mode', () => {
  const r=simulate(scenarios[0],'coordinated',defaultSettings);
  const base={origin:'Andheri Station',destination:'BKC',mode:'car',departure:'now'};
  const routes=journeyOptions(r,base);
  assert.notEqual(journeyOptions(r,{...base,origin:'Airport Terminal 2'})[0].minutes,routes[0].minutes);
  assert.notEqual(journeyOptions(r,{...base,destination:'Cooper Hospital'})[0].minutes,routes[0].minutes);
  assert.ok(journeyOptions(r,{...base,departure:'later'})[0].minutes>routes[0].minutes);
  assert.equal(journeyOptions(r,{...base,mode:'walk'})[0].cost,0);
  assert.equal(journeyOptions(r,{...base,mode:'bus'})[0].cost,25);
});
test('emergency feasibility requires verified current evidence and enabled priority', () => {
  const r=simulate(scenarios[0],'coordinated',defaultSettings);
  const state={settings:defaultSettings,vehicle:'ambulance',emergencyDestination:'Cooper Hospital',feed:'normal',verified:true};
  assert.equal(emergencyAssessment(r,state).feasible,true);
  assert.equal(emergencyAssessment(r,{...state,feed:'stale'}).feasible,false);
  assert.equal(emergencyAssessment(r,{...state,verified:false}).feasible,false);
  assert.equal(emergencyAssessment(r,{...state,settings:{...defaultSettings,priority:false}}).feasible,false);
  assert.ok(emergencyAssessment(r,{...state,vehicle:'fire'}).minutes>emergencyAssessment(r,state).minutes);
});
