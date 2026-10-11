import { icon } from './icons.js';

const blocks = [
  [95,72,40,27],[149,65,55,22],[220,64,24,38],[278,72,54,26],[351,65,35,40],[411,73,42,27],
  [88,121,63,22],[166,120,31,40],[214,124,42,28],[277,125,57,25],[353,128,39,36],[414,122,43,37],
  [74,211,55,38],[146,217,38,28],[207,203,40,40],[265,213,49,25],[336,205,30,43],[391,218,43,27],
  [64,280,44,30],[128,281,47,35],[193,277,42,25],[258,280,36,31],[309,280,53,28],[382,275,43,34],
  [67,376,52,24],[139,367,36,40],[194,377,40,28],[256,364,43,39],[319,372,42,29],[379,369,42,37],
  [532,71,39,25],[590,64,48,29],[661,77,30,30],[718,66,60,29],[801,71,34,38],
  [534,119,59,32],[616,114,34,43],[670,130,51,26],[742,116,46,32],[805,131,27,29],
  [537,208,38,31],[599,214,44,27],[665,206,45,31],[729,210,33,34],[791,213,42,25],
  [536,281,41,27],[598,274,49,33],[670,281,43,34],[737,284,40,29],[797,275,37,38],
  [532,369,55,29],[610,368,40,39],[675,381,43,26],[739,370,50,28],[810,372,26,35],
];
const road = (d, width = 16) => `<path d="${d}" fill="none" stroke="#344557" stroke-width="${width + 3}"/><path d="${d}" fill="none" stroke="#24364b" stroke-width="${width}"/><path d="${d}" fill="none" stroke="#8191a4" stroke-opacity=".34" stroke-width="1" stroke-dasharray="5 8"/>`;
const marker = (x,y,label,color,type='pin') => `<g transform="translate(${x},${y})"><circle r="13" fill="#172b41" stroke="${color}" stroke-width="1.5"/><text text-anchor="middle" dy="4" fill="${color}" font-size="13" font-weight="600">${type === 'hospital' ? '+' : type === 'school' ? 'S' : 'M'}</text><text x="20" y="5" fill="#bfcbda" font-size="10">${label}</text></g>`;

export function networkMap(state, scenario, result) {
  const coordinated = state.strategy === 'coordinated';
  const queueEnd = Math.min(396, 178 + result.queue / 6);
  const congestion = coordinated ? '#67d5b5' : '#f07370';
  const roadwork = scenario.id === 'roadwork';
  const incidentX = roadwork ? 720 : 490;
  const incidentY = 178;
  const incidentLink = roadwork ? 'Andheri–Kurla Road' : 'Western Express Highway';
  return `<div class="map-shell ${state.tilt ? 'is-tilted' : ''}">
    <div class="map-top"><div class="map-location">${icon('pin',15)} Andheri district <span>Mumbai · schematic network</span></div><span class="map-live"><i></i> SIMULATION</span></div>
    <div class="map-scene"><svg id="network-svg" class="network-svg" viewBox="0 0 900 470" role="img" aria-label="Illustrative Andheri road network. ${coordinated ? 'Traffic distributed across three corridors.' : `Congestion building on ${incidentLink}.`}">
      <defs>
        <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#8aabc1" stroke-opacity=".035"/></pattern>
        <pattern id="park-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.5" fill="#467067" fill-opacity=".35"/></pattern>
        <filter id="route-glow"><feGaussianBlur stdDeviation="4"/></filter>
        
      </defs>
      <rect width="900" height="470" fill="#122236"/><rect width="900" height="470" fill="url(#map-grid)"/>
      <path d="M0 0h50l16 63-27 60 9 69-35 62 21 81-34 68Z" fill="#183346"/>
      <path d="m700 320 159-5 25 72-36 75-129-19Z" fill="#1c3939" opacity=".7"/><path d="m700 320 159-5 25 72-36 75-129-19Z" fill="url(#park-dots)"/>
      <path d="m260 332 100-9 22 82-70 26-63-29Z" fill="#203c38"/><path d="m260 332 100-9 22 82-70 26-63-29Z" fill="url(#park-dots)"/>
      <g class="city-blocks">${blocks.map(([x,y,w,h],i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${i % 4 === 0 ? '#24354a' : '#1d2e42'}" stroke="#304257" stroke-width=".8"/><path d="M${x+3} ${y+h-3}h${w-6}" stroke="#384e63" stroke-opacity=".35"/>`).join('')}</g>
      ${[104,178,260,341,428].map(y => road(`M55 ${y}H865`, y === 178 || y === 341 ? 20 : 9)).join('')}
      ${[60,193,260,392,530,654,784,850].map(x => road(`M${x} 30V450`, x === 193 || x === 654 ? 19 : 8)).join('')}
      ${road('M480 -20V135Q480 158 488 178V475',28)}
      ${road('M50 440Q104 335 193 341H410Q455 340 488 294Q533 248 654 260H865',12)}
      <path d="${roadwork ? `M${Math.max(490,720-result.queue/6)} 178H720` : `M466 ${queueEnd}V177`}" stroke="${congestion}" stroke-width="24" opacity=".1"/>
      <path d="${roadwork ? `M${Math.max(490,720-result.queue/6)} 181H720` : `M484 ${queueEnd}V179`}" stroke="${congestion}" stroke-width="5" stroke-linecap="round" class="queue-line"/>
      <path d="M493 72V157" stroke="#dfa948" stroke-width="4" stroke-linecap="round"/>
      <path d="M490 323V430" stroke="#65cbb3" stroke-width="4" stroke-linecap="round"/>
      <path d="M58 178H184" stroke="#62cbb1" stroke-width="4" stroke-linecap="round"/>
      <path d="M654 51V172" stroke="#65cbb3" stroke-width="4" stroke-linecap="round"/>
      <path d="M533 341H850" stroke="#719af9" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      ${state.layers.routes ? `<g class="route-paths">
        <path d="M486 265H193V104H370" fill="none" stroke="${state.strategy === 'single' ? '#f3a951' : '#55c8ad'}" stroke-width="5" stroke-linecap="round" opacity=".85"/>
        <path d="M490 268H654V178H830" fill="none" stroke="#719af9" stroke-width="4" stroke-linecap="round" opacity="${coordinated ? '.95' : '.35'}"/>
        <path d="M484 269V341H60V104H190" fill="none" stroke="#bb965c" stroke-width="4" stroke-linecap="round" opacity="${coordinated ? '.85' : '.3'}"/>
        <circle r="4" fill="#c5ffe9"><animateMotion dur="8s" repeatCount="indefinite" path="M486 265H193V104H370"/></circle>
        ${coordinated ? '<circle r="4" fill="#b9d4ff"><animateMotion dur="7s" repeatCount="indefinite" path="M490 268H654V178H830"/></circle>' : ''}
      </g>` : ''}
      ${state.layers.guard ? `<rect x="261" y="205" width="165" height="120" rx="12" fill="#dfa948" fill-opacity=".055" stroke="#dfa948" stroke-opacity=".6" stroke-dasharray="5 5"/><text x="274" y="222" fill="#d2ac70" font-size="9" letter-spacing="1">PROTECTED LOCAL STREETS</text>` : ''}
      ${state.layers.risk ? `<circle cx="487" cy="${roadwork?178:341}" r="25" fill="${result.spillbackRange[0]===0?'#e87773':'#e4a440'}" fill-opacity=".08" stroke="#e4a440" stroke-opacity=".3"/><circle cx="487" cy="${roadwork?178:341}" r="7" fill="${result.spillbackRange[0]===0?'#e87773':'#e4a440'}"/><text x="510" y="${roadwork?158:360}" fill="#d3a768" font-size="10">Junction J-04</text><circle cx="193" cy="260" r="6" fill="${coordinated ? '#55c8ad' : '#e4a440'}"/>` : ''}
      ${state.layers.emergency ? `<path d="M798 341H654V104H${state.emergencyDestination==='SevenHills Hospital'?784:369}" fill="none" stroke="#79d9f6" stroke-width="2.5" stroke-dasharray="7 5"/><text x="679" y="332" fill="#8ed3e8" font-size="9">EMERGENCY ACCESS</text>` : ''}
      <g fill="#75869a" font-size="11" letter-spacing="2"><text x="95" y="45">JOGESHWARI WEST</text><text x="546" y="44">JOGESHWARI EAST</text><text x="97" y="460">ANDHERI WEST</text><text x="556" y="461">ANDHERI EAST</text></g>
      <g fill="#a2b0c0" font-size="10"><text x="211" y="171">Andheri–Kurla Road</text><text x="675" y="171">Airport Road</text><text x="610" y="335">JVLR connector</text><text transform="translate(179 328) rotate(-90)">SV ROAD</text><text transform="translate(471 139) rotate(-90)">WESTERN EXPRESS HWY</text><text x="733" y="407" fill="#6f9b89">Green buffer</text></g>
      ${marker(365,104,'Cooper Hospital','#79d9f6','hospital')}${marker(784,104,'SevenHills','#79d9f6','hospital')}${marker(335,260,'School zone','#d2ac70','school')}${marker(654,178,'Metro interchange','#a7b1de')}
      <circle cx="${incidentX}" cy="${incidentY}" r="27" fill="#ee7775" fill-opacity=".07" stroke="#ee7775" stroke-opacity=".2" class="incident-pulse"/>
      <g transform="translate(${incidentX},${incidentY})"><circle r="15" fill="#e45b5b" stroke="#ffa7a0" stroke-width="1.5"/><path d="m0-10-8 14h16l-8-14Z" fill="none" stroke="white" stroke-width="1.4"/><path d="M0-5v4m0 2v1" stroke="white" stroke-width="1.4"/></g>
      <g transform="translate(${incidentX+24} ${incidentY+8})"><rect width="122" height="35" rx="7" fill="#26364b" stroke="#ef7775" stroke-opacity=".4"/><text x="12" y="14" fill="#fff" font-size="10" font-weight="600">${scenario.type}</text><text x="12" y="27" fill="#9fb0c4" font-size="9">${scenario.lanes} lanes affected</text></g>
      <g transform="translate(36 405)"><circle r="17" fill="#1d3046" stroke="#415169"/><path d="m0-10-5 15 5-3 5 3Z" fill="#b4c3d2"/><text y="-23" text-anchor="middle" font-size="9" fill="#9fb0c4">N</text></g>
      <path d="M765 436h72m-72-4v8m72-8v8" stroke="#8295ac"/><text x="786" y="426" fill="#8295ac" font-size="9">500 m*</text>
    </svg></div>
    <button class="map-incident-hit" style="left:${incidentX/9-2}%;" data-action="inspect" aria-label="Inspect active incident"></button>
    <div class="map-controls"><button data-action="zoom-in" aria-label="Zoom in">${icon('plus',17)}</button><button data-action="zoom-out" aria-label="Zoom out">${icon('minus',17)}</button><button data-action="tilt" aria-label="Toggle perspective view" aria-pressed="${state.tilt}">${icon('layers',17)}</button></div>
    <div class="map-legend"><span><i style="background:#65cbb3"></i>Free flow</span><span><i style="background:#dfa948"></i>Building pressure</span><span><i style="background:#ed7773"></i>Disrupted</span><span class="map-scale-note">*Illustrative geometry</span></div>
  </div>`;
}
