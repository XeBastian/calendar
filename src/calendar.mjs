export const calendars = [{id:'tech',name:'Tech Calendar',description:'Conferences, communities, and new possibilities.'}];
export function fundingStatus(funding, today=new Date().toISOString().slice(0,10)) {
  if (!funding) return 'Not listed';
  if (funding.deadline && funding.deadline < today) return 'Closed';
  if (funding.opensAt && funding.opensAt > today) return 'Not yet open';
  if (funding.opensAt && funding.status === 'Not yet open') return 'Open';
  return funding.status;
}
export function filterOpportunities(opportunities, params, today=new Date().toISOString().slice(0,10)) {
 const get=k=>params instanceof URLSearchParams?params.get(k):params[k];
 const cutoff=new Date(Date.parse(today+'T00:00:00Z')+30*86400000).toISOString().slice(0,10);
 return opportunities.filter(o=>{
  if(get('topic')&&!o.topics.includes(get('topic')))return false;
  if(get('audience')&&!o.audience.includes(get('audience')))return false;
  const q=(get('q')||'').toLowerCase().trim();
  if(q&&!q.split(/\s+/).every(t=>[o.name,o.region,o.eligibility,o.coverage,...o.topics].join(' ').toLowerCase().includes(t)))return false;
  const eligible=o.eligibleContinents|| (o.region==='Global'?null:[o.region]);
  if(get('continent')&&eligible&&!eligible.includes(get('continent')))return false;
  if(get('region')&&eligible&&!eligible.includes('Africa'))return false;
  if(get('country')){
   if(o.countries&&!o.countries.includes(get('country')))return false;
   if(!o.countries&&eligible&&!eligible.includes(continentForCountry(get('country'))))return false;
  }
  if(get('funding')==='open'&&!['Open','Contact organiser','Check deadline'].includes(fundingStatus(o,today)))return false;
  if(get('funding')==='full'&&o.level!=='Fully funded')return false;
  if(get('funding')==='travel'&&!/Travel|Sponsored|Fully funded/i.test(o.level))return false;
  if(get('deadline')==='any-deadline'&&!o.deadline)return false;
  if(get('deadline')==='no-deadline'&&o.deadline)return false;
  if(get('deadline')==='open-deadline'&&(!o.deadline||o.deadline<today||o.deadline>cutoff||fundingStatus(o,today)==='Not yet open'))return false;
  return true;
 });
}
const opportunityCountryContinents = {};
const opportunityRegionNames = new Intl.DisplayNames(['en'],{type:'region'});
for(const [continent,codes] of Object.entries({
 Africa:'DZ AO BJ BW BF BI CV CM CF TD KM CG CD DJ EG GQ ER SZ ET GA GM GH GN GW CI KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW',
 Europe:'AL AD AT BY BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
 Asia:'AF AM AZ BH BD BT BN KH CN GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE',
 'North America':'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US',
 'South America':'AR BO BR CL CO EC GY PY PE SR UY VE',
 Oceania:'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU'
}))for(const code of codes.split(' '))opportunityCountryContinents[opportunityRegionNames.of(code)]=continent;
Object.assign(opportunityCountryContinents,{'Democratic Republic of the Congo':'Africa','Ivory Coast':'Africa','Cabo Verde':'Africa'});
export function continentForCountry(country){return opportunityCountryContinents[country];}
export function filterEvents(events, params, today=new Date().toISOString().slice(0,10)) {
  const get=k=>params instanceof URLSearchParams?params.get(k):params[k];
  return events.filter(e=>{
    const q=(get('q')||'').toLowerCase();
    if(q && !matchesEventQuery(e,q)) return false;
    for(const key of ['calendar','continent','country','type','price','format']) if(get(key) && e[key]!==get(key)) return false;
    if(get('topic') && !e.topics.includes(get('topic'))) return false;
    if(get('region') && !regionsForCountry(e.country).includes(get('region'))) return false;
    if(get('series') && (e.series||'Other organizers')!==get('series')) return false;
    if(get('year') && !e.start.startsWith(get('year'))) return false;
    if(get('month') && !e.start.startsWith(get('month'))) return false;
    if(get('from') && e.end<get('from')) return false;
    if(get('to') && e.start>get('to')) return false;
    if(get('past')!=='true' && e.end<today) return false;
    if(get('funding')==='any' && !e.funding) return false;
    if(get('funding')==='open' && !['Open','Contact organiser','Check deadline'].includes(fundingStatus(e.funding,today))) return false;
    if(get('funding')==='travel' && (!e.funding || !/Travel|Sponsored|Fully funded/i.test(e.funding.level))) return false;
    if(get('funding')==='full' && e.funding?.level!=='Fully funded') return false;
    if(get('audience') && !e.funding?.audience?.includes(get('audience'))) return false;
    return true;
  }).sort((a,b)=>a.start.localeCompare(b.start)||a.name.localeCompare(b.name));
}
export function matchesEventQuery(event, query) {
  const normalize=s=>String(s||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();
  const text=normalize([event.name,event.city,event.country,event.description,event.organizer,event.series,...(event.tags||[]),...event.topics,...regionsForCountry(event.country)].join(' '));
  return normalize(query).trim().split(/\s+/).every(raw=>{
    const term=raw==='golang'?'go':raw;
    if(['go','ai','gis','aws'].includes(term))return new RegExp('\\b'+term+'\\b','i').test(text);
    return text.includes(term);
  });
}
export function regionsForCountry(country) {
  const groups = {
    'SADC': ['Angola','Botswana','Comoros','Democratic Republic of the Congo','Eswatini','Lesotho','Madagascar','Malawi','Mauritius','Mozambique','Namibia','Seychelles','South Africa','Tanzania','Zambia','Zimbabwe'],
    'West Africa': ['Benin','Burkina Faso','Cabo Verde','Gambia','Ghana','Guinea','Guinea-Bissau','Ivory Coast','Liberia','Mali','Mauritania','Niger','Nigeria','Senegal','Sierra Leone','Togo'],
    'East Africa': ['Burundi','Ethiopia','Kenya','Rwanda','Somalia','South Sudan','Tanzania','Uganda']
  };
  return Object.keys(groups).filter(region=>groups[region].includes(country));
}
export function eventAgenda(events, params, anchor, today=new Date().toISOString().slice(0,10)) {
  const filters = new URLSearchParams(params);
  for (const key of ['month','date','sort','q','agendaFrom','agendaQ']) filters.delete(key);
  let matching = filterEvents(events, filters, today);
  if (params.get('agendaQ')) matching = filterEvents(matching, {q:params.get('agendaQ')}, today);
  // Preserve overlapping events on the selected day, then order later dates.
  return matching.filter(e=>e.end>=anchor)
    .map(e=>({event:e,day:e.start<anchor?anchor:e.start}));
}
export function nextDay(day){return new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString().slice(0,10);}
const esc=v=>String(v??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
export function foldLine(line){let lines=[],part='',bytes=0;for(const ch of line){const size=new TextEncoder().encode(ch).length;if(bytes+size>75){lines.push(part);part=' ';bytes=1;}part+=ch;bytes+=size;}lines.push(part);return lines.join('\r\n');}
export function toICS(events,origin='https://calendar.korvexa.com',now=new Date()) {
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Korvexa//Calendar//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Korvexa Tech Calendar','REFRESH-INTERVAL;VALUE=DURATION:PT12H','X-PUBLISHED-TTL:PT12H'];
  const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  for(const e of events){lines.push('BEGIN:VEVENT',`UID:${e.id}@calendar.korvexa.com`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${e.start.replace(/-/g,'')}`,`DTEND;VALUE=DATE:${nextDay(e.end).replace(/-/g,'')}`,`SUMMARY:${esc(e.name)}`,`DESCRIPTION:${esc(e.description+'\nOrganizer: '+e.url+(e.funding?'\nSupport: '+e.funding.coverage+'\nApply: '+e.funding.url:''))}`,`LOCATION:${esc([e.city,e.country].filter(Boolean).join(', '))}`,`URL:${origin}/events/${encodeURIComponent(e.id)}`,'END:VEVENT');}
  lines.push('END:VCALENDAR');return lines.map(foldLine).join('\r\n')+'\r\n';
}
export function googleCalendarURL(e){const p=new URLSearchParams({action:'TEMPLATE',text:e.name,dates:e.start.replace(/-/g,'')+'/'+nextDay(e.end).replace(/-/g,''),details:e.description+'\n'+e.url,location:[e.city,e.country].filter(Boolean).join(', ')});return 'https://calendar.google.com/calendar/render?'+p;}
