import { icon } from './components/icons.js';
import { scenarios, defaultSettings } from './data/scenarios.js';
import { simulate, compare, emergencyAssessment } from './domain/simulation.js';
import { dashboard, labView, commuterView, emergencyView } from './components/views.js';
import { landing } from './components/landing.js';

const storage = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* Browser storage can be unavailable. */ } },
};
const saved = storage.get('iermc-journey');
const validOrigin = ['Andheri Station','Airport Terminal 2','Jogeshwari'];
const validDestination = ['BKC','Cooper Hospital','Powai'];
const journey = saved && validOrigin.includes(saved.origin) && validDestination.includes(saved.destination)
  ? { origin:saved.origin,destination:saved.destination,departure:['now','later'].includes(saved.departure)?saved.departure:'now',mode:['car','bus','walk'].includes(saved.mode)?saved.mode:'car' }
  : { origin:'Andheri Station',destination:'BKC',departure:'now',mode:'car' };
const state = {
  page: 'landing', launching: false, scenario: 'collision', strategy: 'none', verified: false, approved: false,
  minute: 0, playing: false, tilt: false, zoom: 1, layersOpen: false, mobileNav: false,
  layers: { routes: true, risk: true, guard: true, emergency: false },
  settings: { ...defaultSettings }, journey, savedJourney: Boolean(saved), planned: false,
  selectedRoute: null, emergencyDestination: 'Cooper Hospital', vehicle: 'ambulance', feed: 'normal', emergencyRequested: false,
  audit: [],
};
let ticker;
let toastTimer;
let launchTimer;
const app = document.querySelector('#app');
const navItems = [['landing','network','Product overview'],['dashboard','grid','Command centre'],['lab','flask','Scenario lab'],['emergency','shield','Emergency access'],['commuter','route','Commuter journeys']];
const pageNames = { dashboard:'Command centre', lab:'Scenario lab', emergency:'Emergency access', commuter:'Commuter journeys' };
const scenario = () => scenarios.find(s=>s.id===state.scenario);
const result = () => simulate(scenario(),state.strategy,state.settings,state.minute);
const toast = msg => { const el = document.querySelector('#toast'); el.textContent=msg; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('visible'),4500); };
const record = (title,detail) => state.audit.push({title,detail,time:`08:${String(45+Math.min(state.audit.length,14)).padStart(2,'0')} IST · demo`});

function render() {
  const activeControl = document.activeElement;
  const focusSelector = activeControl?.id ? `#${CSS.escape(activeControl.id)}` : activeControl?.dataset.action
    ? `[data-action="${CSS.escape(activeControl.dataset.action)}"]${activeControl.dataset.value ? `[data-value="${CSS.escape(activeControl.dataset.value)}"]` : ''}` : null;
  if(state.page === 'landing') {
    document.title = 'IERMC  -  Predict. Coordinate. Protect.';
    app.innerHTML = landing(state);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('animateMotion').forEach(el=>el.remove());
    document.querySelector('#launch-dialog').addEventListener('cancel',stopLaunch);
    if(focusSelector) document.querySelector(focusSelector)?.focus({preventScroll:true});
    return;
  }
  document.title = `IERMC  -  ${pageNames[state.page]}`;
  const s = scenario();
  const r = result();
  const views = {dashboard,lab:labView,commuter:commuterView,emergency:emergencyView};
  app.innerHTML = `<aside class="sidebar ${state.mobileNav?'open':''}" aria-label="Main navigation"><a class="brand" href="#landing" data-action="nav" data-value="landing" aria-label="IERMC product overview"><span class="brand-mark">${icon('signal',25)}</span><span>IERMC<small>TRAFFIC INTELLIGENCE</small></span></a><div class="workspace-switch"><span class="workspace-icon">M</span><div><strong>Mumbai operations</strong><small>Operator workspace</small></div><span>${icon('down',14)}</span></div><span class="nav-label">WORKSPACE</span><nav>${navItems.map(([id,ic,label])=>`<button data-action="nav" data-value="${id}" class="nav-item ${state.page===id?'active':''}" ${state.page===id?'aria-current="page"':''}>${icon(ic,19)}<span>${label}</span>${id==='dashboard'?'<span class="nav-count">4</span>':''}</button>`).join('')}</nav><div class="sidebar-spacer"></div><div class="sidebar-insight"><div class="sidebar-insight-icon">${icon('network',22)}</div><strong>Review reports.<br/>Compare routes.</strong><p>Inspect the scenario.<br/>Choose a response.</p></div><div class="system-health"><span class="dot green"></span>Prototype environment <span class="version">v1.0</span></div><div class="profile"><span class="avatar">${icon('shield',18)}</span><div><strong>Operator</strong><small>Traffic management centre</small></div><span class="profile-dot"></span></div></aside>
    <div class="app-body"><header class="topbar"><div class="breadcrumb"><button class="icon-button mobile-menu" data-action="mobile-nav" aria-label="Toggle navigation">${icon('menu',22)}</button><span>Workspace</span>${icon('chevron',12)}<strong>${pageNames[state.page]}</strong></div><div class="topbar-right"><button class="feed-status ${state.feed!=='normal'?'feed-warning':''}" data-action="feed"><span class="dot ${state.feed==='normal'?'green':'amber'}"></span>${state.feed==='normal'?'Demo feed · just updated':state.feed==='stale'?'Stale feed · 18 min old':'Conflicting reports'} ${icon('down',12)}</button><span class="demo-tag">SIMULATED DATA</span><button class="notification-button" data-action="notifications" aria-label="Open demo notifications">${icon('bell',19)}<i></i></button></div></header><main id="main-content" tabindex="-1">${state.feed!=='normal'?`<div class="feed-banner">${icon('alert',19)}<div><strong>${state.feed==='stale'?'Freshness warning: feed is stale':'Verification warning: reports conflict'}</strong><span>Forecasts are illustrative and operational approval is paused. Restore the demo feed and verify the incident.</span></div><button class="button secondary compact" data-action="restore-feed">Restore demo feed</button></div>`:''}${views[state.page](state,s,r)}</main><footer class="app-footer"><span>IERMC · Traffic incident planning</span><span>Illustrative road geometry & synthetic traffic · No live operational integration</span><button data-action="reset" class="text-button">Reset demo ${icon('refresh',13)}</button></footer></div><dialog id="modal" class="modal" aria-labelledby="modal-title"></dialog>`;
  document.querySelectorAll('.network-svg').forEach(el=>el.style.transform=`scale(${state.zoom})`);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('animateMotion').forEach(el=>el.remove());
  const sidebar = document.querySelector('.sidebar');
  sidebar.id = 'primary-sidebar';
  sidebar.inert = window.matchMedia('(max-width: 760px)').matches && !state.mobileNav;
  const menu = document.querySelector('.mobile-menu');
  menu.setAttribute('aria-controls','primary-sidebar');
  menu.setAttribute('aria-expanded',String(state.mobileNav));
  if(focusSelector) document.querySelector(focusSelector)?.focus({preventScroll:true});
}

function stopPlayback() { clearInterval(ticker); state.playing=false; }
function stopLaunch() {
  clearTimeout(launchTimer);
  state.launching = false;
  const dialog = document.querySelector('#launch-dialog');
  if(dialog?.open) dialog.close();
}
function launchWorkspace(destination = 'dashboard') {
  if(state.launching || state.page !== 'landing') return;
  stopPlayback();
  state.launching = true;
  const dialog = document.querySelector('#launch-dialog');
  document.querySelector('#launch-title').innerHTML = destination === 'landing' ? 'Preparing the<br/>road network' : 'Opening the<br/>command centre';
  dialog.showModal();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phases = [
    [28,'Preparing the simulated road network…'],
    [65,'Loading scenario and response tools…'],
    [100,destination === 'landing' ? 'The network is ready. Welcome to IERMC.' : 'Workspace ready. Opening command centre…'],
  ];
  let phase = 0;
  function advance() {
    if(!state.launching) return;
    const [progress,label] = phases[phase++];
    document.querySelector('#launch-progress').style.width = `${progress}%`;
    document.querySelector('#launch-percent').textContent = `${progress}%`;
    document.querySelector('.loader-track').setAttribute('aria-valuenow',String(progress));
    document.querySelector('#launch-status').textContent = label;
    launchTimer = setTimeout(phase<phases.length ? advance : ()=>navigate(destination),reducedMotion ? 100 : 800);
  }
  advance();
}
function navigate(page) {
  if (page !== 'landing' && !navItems.some(([id])=>id===page)) return;
  stopLaunch();
  stopPlayback(); state.page=page; state.mobileNav=false; state.layersOpen=false;
  history.replaceState(null,'',`#${page}`); render(); window.scrollTo({top:0,behavior:'instant'});
  document.querySelector('#main-content').focus({preventScroll:true});
}
function setScenario(id) {
  if (!scenarios.some(s=>s.id===id)) return;
  stopPlayback(); Object.assign(state,{scenario:id,verified:false,approved:false,strategy:'none',minute:0,selectedRoute:null,emergencyRequested:false});
  state.layers.emergency=id==='emergency'; render();
}
function modal(title,body,footer='') {
  stopPlayback();
  const el=document.querySelector('#modal');
  el.innerHTML=`<div class="modal-heading"><h2 id="modal-title">${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Close dialog">${icon('close',20)}</button></div><div class="modal-content">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  el.showModal();
}
function review(emergency=false) {
  if (!state.verified) { toast('Verify the active incident before reviewing a response.'); return; }
  if (state.feed!=='normal') { toast('Restore current, consistent evidence before approval.'); return; }
  if (!emergency && state.strategy==='none') return;
  const r=result(); if(emergency) r.emergencyMinutes=emergencyAssessment(r,state).minutes;
  modal(emergency?'Review emergency coordination':'Review proposed response',`<span class="mini-badge info">SIMULATED OPERATOR APPROVAL</span><p class="modal-lead">${emergency?'Assess access to '+state.emergencyDestination+' and record a coordination request.':'Approve '+(state.strategy==='coordinated'?'capacity-aware distribution':'a single diversion')+' for this scenario.'}</p><dl class="review-details"><div><dt>Active disruption</dt><dd>${scenario().type}</dd></div><div><dt>Incident evidence</dt><dd>Reviewed in this demo session</dd></div><div><dt>Emergency corridor</dt><dd>${r.emergencyMinutes} min estimated ${state.settings.priority?'· priority enabled':''}</dd></div><div><dt>Local street load</dt><dd>${r.localUtilization}% ${r.localUtilization>100?'· exceeds practical capacity':'· within practical capacity'}</dd></div><div><dt>Unassigned demand</dt><dd>${r.unassigned} trips / h</dd></div></dl>${r.localUtilization>100?'<div class="approval-warning">Local street capacity is exceeded. The record will retain this trade-off; consider coordinated routing with neighbourhood protection.</div>':''}<p class="fine-print">This records a demo decision only. Field coordination, traffic signals, and emergency dispatch require authorised systems and personnel.</p>`,`<button class="button secondary" data-action="close-modal">Keep reviewing</button><button class="button primary" data-action="approve" data-value="${emergency?'emergency':'response'}">${icon('check',16)} ${emergency?'Record coordination request':'Approve demo response'}</button>`);
}
function exportJSON(name,data) {
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download=name; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('Demo data exported as JSON.');
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]'); if (!target) return;
  event.preventDefault();
  const action=target.dataset.action,value=target.dataset.value;
  switch(action) {
    case 'launch': launchWorkspace(); break;
    case 'cancel-launch': stopLaunch(); break;
    case 'launch-scenario': setScenario(value); launchWorkspace(); break;
    case 'landing-scroll': document.getElementById(value)?.scrollIntoView({behavior:'instant',block:'start'}); break;
    case 'nav': navigate(value); break;
    case 'mobile-nav': state.mobileNav=!state.mobileNav; render(); break;
    case 'scenario': setScenario(value); break;
    case 'strategy': if (!['none','single','coordinated'].includes(value)) return; state.strategy=value; state.approved=false; state.selectedRoute=null; render(); if(value==='single')toast('Watch the peak corridor load and neighbourhood pressure.'); if(value==='coordinated')toast('Demand distributed across feasible arterial capacity.'); break;
    case 'verify': if(state.feed!=='normal') { toast('Resolve stale or conflicting evidence before verification.'); break; } state.verified=true; record('Incident verified',`${scenario().type} · ${scenario().location} · reviewed in the demo session`); render(); toast('Incident verified. You can now review a response.'); break;
    case 'inspect': document.querySelector('.incident-panel')?.scrollIntoView({behavior:'instant',block:'center'}); toast(`${scenario().type} · ${scenario().location}`); break;
    case 'layers': state.layersOpen=!state.layersOpen; render(); break;
    case 'zoom-in': state.zoom=Math.min(1.6,state.zoom+.15); document.querySelectorAll('.network-svg').forEach(el=>el.style.transform=`scale(${state.zoom})`); break;
    case 'zoom-out': state.zoom=Math.max(.85,state.zoom-.15); document.querySelectorAll('.network-svg').forEach(el=>el.style.transform=`scale(${state.zoom})`); break;
    case 'tilt': state.tilt=!state.tilt; render(); break;
    case 'play': if(state.playing){stopPlayback();render();}else{if(state.minute>=15)state.minute=0;state.playing=true;render();ticker=setInterval(()=>{state.minute++;if(state.minute>=15)stopPlayback();render();},1400);} break;
    case 'rewind': stopPlayback();state.minute=0;render();break;
    case 'review': review();break;
    case 'emergency-request': review(true);break;
    case 'close-modal': document.querySelector('#modal').close();break;
    case 'approve': if(state.feed!=='normal'||!state.verified)return;if(value==='emergency')state.emergencyRequested=true;else state.approved=true;record(value==='emergency'?'Emergency coordination requested':'Demo response approved',`${scenario().label} · ${state.strategy==='coordinated'?'Coordinated distribution':state.strategy==='single'?'Single diversion':'Current network'} · ${result().localUtilization}% local load · ${value==='emergency'?emergencyAssessment(result(),state).minutes:result().emergencyMinutes} min emergency corridor`);document.querySelector('#modal').close();render();toast('Decision recorded for this session.');break;
    case 'reset-settings':state.settings={...defaultSettings};state.approved=false;render();toast('Scenario inputs restored.');break;
    case 'use-coordinated':state.strategy='coordinated';state.approved=false;navigate('dashboard');break;
    case 'export':exportJSON('iermc-scenario-comparison.json',{simulation:true,model:'Illustrative deterministic prototype',scenario:scenario(),settings:state.settings,forecastMinute:state.minute,...compare(scenario(),state.settings,state.minute)});break;
    case 'export-audit':exportJSON('iermc-decision-record.json',{simulation:true,decisions:state.audit});break;
    case 'mode':state.journey.mode=value;state.planned=false;state.selectedRoute=null;render();break;
    case 'plan':state.planned=true;state.selectedRoute=null;render();toast('Simulated journey options calculated for your selected preset.');break;
    case 'save-journey':storage.set('iermc-journey',state.journey);state.savedJourney=true;render();toast('Regular journey saved in this browser.');break;
    case 'select-route':state.selectedRoute=Number(value);render();toast('Corridor selected for the demo journey.');break;
    case 'story':if(value==='commuter'){state.planned=true;navigate('commuter');}else if(value==='coordinated'){state.strategy='coordinated';state.approved=false;navigate('dashboard');}else{setScenario(value);if(value==='overload')state.strategy='single';navigate('dashboard');}break;
    case 'demo-start':setScenario('collision');state.settings={...defaultSettings};navigate('dashboard');toast('Demo story ready: verify the collision, then play the forecast.');break;
    case 'feed':modal('Evidence & freshness',`<p>Test the product’s fallback behaviour with synthetic feed conditions.</p><div class="feed-choices">${[['normal','Current & consistent','Timestamped field report; response review available.'],['stale','Stale observation','18-minute-old evidence; operational approval paused.'],['conflicting','Conflicting reports','Sources disagree on lane closures; verification required.']].map(([id,title,desc])=>`<button data-action="set-feed" data-value="${id}" class="${state.feed===id?'selected':''}"><strong>${title}</strong><span>${desc}</span>${icon('chevron',16)}</button>`).join('')}</div>`);break;
    case 'set-feed':document.querySelector('#modal').close();state.feed=value;state.verified=false;state.approved=false;record('Evidence state changed',value==='normal'?'Current simulated evidence restored':value==='stale'?'Feed stale; response approval paused':'Conflicting reports; verification paused');render();break;
    case 'restore-feed':state.feed='normal';state.verified=false;state.approved=false;render();toast('Current demo evidence restored. Verify the incident again.');break;
    case 'notifications':modal('Route & network notifications',`<div class="notification-modal-row">${icon('alert',21)}<div><strong>Queue spillback forecast</strong><p>${scenario().type}: J-04 may be affected in ${scenario().spillback.join('–')} minutes without coordination.</p></div></div><div class="notification-modal-row">${icon('bell',21)}<div><strong>Planned closure · 09:00–11:00 IST</strong><p>Andheri–Kurla Road resurfacing overlaps the morning commute. Explore the roadwork scenario.</p></div></div><div class="notification-modal-row">${icon('shield',21)}<div><strong>Neighbourhood load</strong><p>Current response projects ${result().localUtilization}% local street utilisation.</p></div></div>`,`<button class="button primary" data-action="notification-roadwork">Open roadwork scenario ${icon('arrow',15)}</button>`);break;
    case 'notification-roadwork':document.querySelector('#modal').close();setScenario('roadwork');navigate('dashboard');break;
    case 'reset':stopPlayback();Object.assign(state,{page:'dashboard',scenario:'collision',strategy:'none',verified:false,approved:false,minute:0,tilt:false,zoom:1,feed:'normal',audit:[],settings:{...defaultSettings},planned:false,selectedRoute:null});navigate('dashboard');toast('Demo reset. Your saved regular journey is retained.');break;
  }
});
document.addEventListener('change',event=>{
  const {id,value,checked,dataset}=event.target;
  if(dataset.layer){state.layers[dataset.layer]=checked;render();return;}
  if(id==='lab-scenario'){setScenario(value);return;}
  if(id==='timeline'){stopPlayback();state.minute=Number(value);render();return;}
  if(id==='demand'){state.settings.demandScale=Number(value)/100;state.approved=false;render();}
  if(id==='duration'){state.settings.duration=Number(value);state.approved=false;render();}
  if(id==='guard-setting'||id==='priority-setting'){state.settings[id==='guard-setting'?'guard':'priority']=checked;state.approved=false;render();}
  if(['origin','destination','departure'].includes(id)){state.journey[id]=value;state.planned=false;state.selectedRoute=null;state.savedJourney=false;render();}
  if(id==='emergency-destination'){state.emergencyDestination=value;state.approved=false;render();}
  if(id==='vehicle'){state.vehicle=value;state.approved=false;render();}
});
document.addEventListener('input',event=>{
  if(event.target.id==='timeline') document.querySelector('.timeline-label span').textContent=`+${String(event.target.value).padStart(2,'0')} min`;
  if(event.target.id==='demand') document.querySelector('label[for="demand"] strong').textContent=`${event.target.value}%`;
});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
let mobileLayout = window.matchMedia('(max-width: 760px)').matches;
window.addEventListener('resize',()=>{
  const nextMobileLayout = window.matchMedia('(max-width: 760px)').matches;
  if(nextMobileLayout!==mobileLayout){mobileLayout=nextMobileLayout;state.mobileNav=false;if(!state.launching)render();}
});
if(navItems.some(([id])=>id===location.hash.slice(1)))state.page=location.hash.slice(1);
render();
if(state.page === 'landing') launchWorkspace('landing');

