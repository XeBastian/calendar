export const calendars = [{id:'tech',name:'Tech Calendar',description:'Conferences, communities, and new possibilities.'}];
export function fundingStatus(funding, today=new Date().toISOString().slice(0,10)) {
  if (!funding) return 'Not listed';
  if (funding.deadline && funding.deadline < today) return 'Closed';
  return funding.status;
}
export function filterEvents(events, params, today=new Date().toISOString().slice(0,10)) {
  const get=k=>params instanceof URLSearchParams?params.get(k):params[k];
  return events.filter(e=>{
    const q=(get('q')||'').toLowerCase();
    if(q && ![e.name,e.city,e.country,e.description,...e.topics].join(' ').toLowerCase().includes(q)) return false;
    for(const key of ['calendar','continent','country','type','price','format']) if(get(key) && e[key]!==get(key)) return false;
    if(get('topic') && !e.topics.includes(get('topic'))) return false;
    if(get('year') && !e.start.startsWith(get('year'))) return false;
    if(get('month') && !e.start.startsWith(get('month'))) return false;
    if(get('from') && e.end<get('from')) return false;
    if(get('to') && e.start>get('to')) return false;
    if(get('past')!=='true' && e.end<today) return false;
    if(get('funding')==='any' && !e.funding) return false;
    if(get('funding')==='open' && !['Open','Contact organiser','Check deadline'].includes(fundingStatus(e.funding,today))) return false;
    if(get('funding')==='travel' && (!e.funding || !/Travel|Sponsored|Fully funded/.test(e.funding.level))) return false;
    if(get('funding')==='full' && e.funding?.level!=='Fully funded') return false;
    if(get('audience') && !e.funding?.audience?.includes(get('audience'))) return false;
    return true;
  }).sort((a,b)=>a.start.localeCompare(b.start)||a.name.localeCompare(b.name));
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
