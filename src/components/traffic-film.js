// Original, local SVG motion artwork: no remote video or downloaded design assets.
export function trafficFilm() {
  const blocks = [[30,30,125,145],[175,35,82,140],[30,390,120,130],[175,390,85,145],[395,35,100,140],[510,40,110,135],[405,390,90,145],[515,390,105,125]];
  const cars = [
    ['M313 590V-40', '#cbdccf', '7s', '0s'],['M292 590V-40','#a2c5df','9s','-3s'],
    ['M353 -40V590','#ece1c4','8s','-4s'],['M376 -40V590','#96c7b6','10s','-7s'],
    ['M-30 240H680','#dce9df','9s','-2s'],['M680 312H-30','#b7c2d5','8s','-5s'],
    ['M-30 217H680','#94b9a7','11s','-7s'],['M680 337H-30','#e4b99f','12s','-1s'],
  ];
  return `<div class="traffic-film" role="img" aria-label="Animated aerial illustration of a city intersection: traffic signals, moving vehicles, a disruption, and coordinated alternative corridors.">
    <svg viewBox="0 0 650 560" class="traffic-film-svg" aria-hidden="true"><defs><pattern id="film-asphalt" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".5" fill="#a8b5bd" opacity=".08"/></pattern><filter id="film-glow"><feGaussianBlur stdDeviation="4"/></filter></defs>
    <rect width="650" height="560" fill="#122731"/>
    ${blocks.map(([x,y,w,h],i)=>`<rect x="${x+7}" y="${y+9}" width="${w}" height="${h}" rx="5" fill="#08171d" opacity=".55"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#27414a" stroke="#567278" stroke-opacity=".3"/><rect x="${x+12}" y="${y+12}" width="${w-24}" height="${h-24}" rx="2" fill="none" stroke="#76958b" stroke-opacity=".16"/>${Array.from({length:4},(_,j)=>`<path d="M${x+19} ${y+30+j*20}h${w-38}" stroke="#96b7a3" stroke-opacity="${i%3===0?'.23':'.1'}" stroke-width="3"/>`).join('')}`).join('')}
    <path d="M273 0V560M389 0V560M0 189H650M0 365H650" stroke="#7e9994" stroke-opacity=".28" stroke-width="4"/>
    <path d="M280 0H382V560H280ZM0 197H650V357H0Z" fill="#17272c"/><path d="M280 0H382V560H280ZM0 197H650V357H0Z" fill="url(#film-asphalt)"/>
    <path d="M332 0V190M332 365V560M0 277H272M395 277H650" stroke="#b7af79" stroke-opacity=".45" stroke-width="2"/>
    <path d="M304 0V178M359 0V178M304 379V560M359 379V560M0 228H266M0 324H266M399 228H650M399 324H650" stroke="#adc4bc" stroke-opacity=".3" stroke-dasharray="12 15" stroke-width="1"/>
    <g stroke="#b8c9bd" stroke-opacity=".55" stroke-width="4">${Array.from({length:8},(_,i)=>`<path d="M${289+i*12} 180v8M${289+i*12} 367v8M263 ${205+i*19}h9M389 ${205+i*19}h9"/>`).join('')}</g>
    <rect x="297" y="207" width="69" height="139" rx="3" fill="none" stroke="#bca95f" stroke-opacity=".23"/>
    <g fill="none" stroke="#bca95f" stroke-opacity=".1">${Array.from({length:7},(_,i)=>`<path d="m${298+i*10} 208-1 137m1-137 68 137"/>`).join('')}</g>
    <g class="film-routing" fill="none" stroke-linecap="round"><path d="M311 546V440Q311 335 207 335H20" stroke="#90e6c2" stroke-width="16" opacity=".07" filter="url(#film-glow)"/><path d="M311 546V440Q311 335 207 335H20" stroke="#90e6c2" stroke-width="2.5" stroke-dasharray="6 8" class="film-route"/><path d="M352 18V99Q352 220 480 220H630" stroke="#8ab9f4" stroke-width="2" stroke-dasharray="6 8" class="film-route route-b"/><path d="M24 240H172Q304 240 304 107V20" stroke="#bb965c" stroke-width="2" stroke-dasharray="6 8" class="film-route route-c"/></g>
    ${cars.map(([path,color,dur,begin],i)=>`<g class="film-car"><rect x="-5" y="-9" width="10" height="18" rx="3" fill="${color}"/><rect x="-3.5" y="-4" width="7" height="8" rx="1" fill="#263e46"/><path d="M-3-8h2m2 0h2" stroke="#f7efd5" stroke-width="2"/><animateMotion path="${path}" dur="${dur}" begin="${begin}" rotate="auto" repeatCount="indefinite"/></g>`).join('')}
    <g transform="translate(366 136)"><circle r="34" fill="#e78d7b" opacity=".06" class="film-incident-pulse"/><circle r="20" fill="none" stroke="#e78d7b" opacity=".4"/><circle r="6" fill="#f2ac96"/></g>
    <g>${[[270,188],[392,369],[270,369],[392,188]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><rect x="-7" y="-13" width="14" height="27" rx="5" fill="#0b1920" stroke="#56726b"/><circle cy="-7" r="3" fill="${i%2?'#f3b491':'#435952'}"/><circle r="3" fill="#6c6550"/><circle cy="7" r="3" fill="${i%2?'#435952':'#a0e3c0'}"/></g>`).join('')}</g>
    <g fill="#87a59e" font-size="8" letter-spacing="2"><text transform="translate(320 520) rotate(-90)">WESTERN EXPRESS HWY</text><text x="38" y="269">ANDHERI CONNECTOR</text></g></svg>
    <div class="film-vignette"></div><div class="film-timecode"><span class="film-record-dot"></span> NETWORK FILM <span>SIMULATED / 01</span></div>
    <div class="film-incident-label"><i></i><span>Example incident<small>Queue pressure building upstream</small></span></div>
    <div class="film-insight"><span>ROAD NETWORK EXAMPLE</span><strong>Incident location<br/>and diversion routes.</strong><div><i></i> Coordinated corridors visualised</div></div>
    <span class="film-crosshair crosshair-one"></span><span class="film-crosshair crosshair-two"></span>
  </div><div class="film-caption"><span>01 / THE NETWORK IN MOTION</span><span>Original animated illustration · synthetic scenario</span></div>`;
}

export function loaderArtwork() {
  return `<svg class="loader-road-art" viewBox="0 0 1000 650" aria-hidden="true"><defs></defs><ellipse cx="500" cy="325" rx="440" ry="310" fill="#152e33"/><g fill="none" stroke="#8fb6a8" stroke-opacity=".1">${Array.from({length:12},(_,i)=>`<path d="M${i*100-100} 0V650M0 ${i*65}H1000"/>`).join('')}</g><g class="boot-roads" fill="none" stroke="#a4dcca" stroke-width="2"><path d="M0 520H320Q500 520 500 340V0"/><path d="M1000 130H650Q500 130 500 290V650"/><path d="M0 210H285Q350 210 350 280V400Q350 460 420 460H1000"/><path d="M1000 375H680Q615 375 615 300V90H0"/></g><g class="boot-road-dashes" fill="none" stroke="#b5efd0" stroke-width="3" stroke-dasharray="3 25"><path d="M0 520H320Q500 520 500 340V0"/><path d="M1000 130H650Q500 130 500 290V650"/><path d="M0 210H285Q350 210 350 280V400Q350 460 420 460H1000"/></g><g fill="#a9e8c8">${[[500,130],[350,210],[500,460],[615,375],[500,340]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/><circle class="boot-node-pulse" cx="${x}" cy="${y}" r="17" fill="none" stroke="#98d3b1" stroke-opacity=".3"/>`).join('')}</g></svg><div class="loader-scan"></div>`;
}
