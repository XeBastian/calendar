// Only fetch explicitly configured organizer pages. No visitor-controlled URLs.
export const SOURCES = [
  {id:'ictam',name:'ICT Association of Malawi',url:'https://admin.ictam.org.mw/api/public/events',parser:'ictam',series:'ICTAM',topics:['Development']},
  ...Array.from({length:6},(_,i)=>({id:'gdg-'+(i+1),name:'Google Developer Groups · page '+(i+1),url:'https://gdg.community.dev/api/event/?page='+(i+1)+'&page_size=200&status=Published',parser:'bevy',series:'Google Developer Groups',prefix:'gdg',topics:['Development']})),
  {id:'cncf',name:'CNCF community events',url:'https://community.cncf.io/api/event/?page_size=200&status=Published',parser:'bevy',series:'CNCF',prefix:'cncf',topics:['Cloud & DevOps','Open source']},
  {id:'python-conferences',name:'Python.org conferences',url:'https://www.python.org/events/python-events/',parser:'python',topics:['Development','Open source']},
  {id:'python-conferences-2',name:'Python.org conferences · page 2',url:'https://www.python.org/events/python-events/?page=2',parser:'python',topics:['Development','Open source']},
  {id:'python-meetups-2',name:'Python.org meetups · page 2',url:'https://www.python.org/events/python-user-group/?page=2',parser:'python',topics:['Development','Open source'],type:'Meetup'},
  {id:'python-meetups',name:'Python.org community meetups',url:'https://www.python.org/events/python-user-group/',parser:'python',topics:['Development','Open source'],type:'Meetup'},
  {id:'usenix',name:'USENIX',url:'https://www.usenix.org/conferences',parser:'usenix',topics:['Development']},
  ...[
    ['ces','CES','https://www.ces.tech/', ['AI','Digital health']],
    ['mwc','MWC Barcelona','https://www.mwcbarcelona.com/', ['Connectivity','AI']],
    ['gitex','GITEX','https://www.gitex.com/', ['AI','Startups']],
    ['pyho','PyHo','https://2026.pythonho.com/', ['Development','Open source']],
    ['africa-tech','Africa Tech Summit','https://www.africatechsummit.com/nairobi/', ['Startups']],
    ['fosdem','FOSDEM','https://fosdem.org/2027/', ['Development','Open source']],
    ['qatar','Web Summit Qatar','https://qatar.websummit.com/', ['Startups','AI']],
    ['websummit','Web Summit','https://websummit.com/', ['Startups','AI']]
  ].map(([id,name,url,topics])=>({id,name,url,topics,parser:'jsonld'}))
];
export function plain(s){return String(s??'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;|&#160;/g,' ').replace(/&ndash;/g,'–').replace(/&mdash;/g,'—').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(Number(n),0x10ffff))).replace(/\s+/g,' ').trim();}
const countries={US:['United States','North America'],USA:['United States','North America'],'United States':['United States','North America'],Canada:['Canada','North America'],Brazil:['Brazil','South America'],Argentina:['Argentina','South America'],Mexico:['Mexico','North America'],Germany:['Germany','Europe'],Spain:['Spain','Europe'],Portugal:['Portugal','Europe'],Belgium:['Belgium','Europe'],France:['France','Europe'],Ireland:['Ireland','Europe'],UK:['United Kingdom','Europe'],'United Kingdom':['United Kingdom','Europe'],Poland:['Poland','Europe'],Ghana:['Ghana','Africa'],Kenya:['Kenya','Africa'],Uganda:['Uganda','Africa'],Malawi:['Malawi','Africa'],Nigeria:['Nigeria','Africa'],'South Africa':['South Africa','Africa'],Rwanda:['Rwanda','Africa'],Morocco:['Morocco','Africa'],India:['India','Asia'],Singapore:['Singapore','Asia'],Thailand:['Thailand','Asia'],Japan:['Japan','Asia'],China:['China','Asia'],Qatar:['Qatar','Asia'],UAE:['United Arab Emirates','Asia'],'United Arab Emirates':['United Arab Emirates','Asia'],'Saudi Arabia':['Saudi Arabia','Asia'],Australia:['Australia','Oceania'],'New Zealand':['New Zealand','Oceania']};
Object.assign(countries,{'The Netherlands':['Netherlands','Europe'],Netherlands:['Netherlands','Europe'],Switzerland:['Switzerland','Europe'],Pakistan:['Pakistan','Asia'],Taiwan:['Taiwan','Asia'],Panama:['Panama','North America'],Colombia:['Colombia','South America'],Chile:['Chile','South America'],Italy:['Italy','Europe'],Austria:['Austria','Europe'],Sweden:['Sweden','Europe'],Denmark:['Denmark','Europe'],Finland:['Finland','Europe'],Norway:['Norway','Europe'],Turkey:['Turkey','Asia'],Türkiye:['Turkey','Asia'],Indonesia:['Indonesia','Asia'],Malaysia:['Malaysia','Asia'],Bangladesh:['Bangladesh','Asia'],'Sri Lanka':['Sri Lanka','Asia']});
const countryCodes = {
 Africa:'DZ AO BJ BW BF BI CV CM CF TD KM CG CD DJ EG GQ ER SZ ET GA GM GH GN GW CI KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW',
 Europe:'AL AD AT BY BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
 Asia:'AF AM AZ BH BD BT BN KH CN GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE',
 'North America':'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US',
 'South America':'AR BO BR CL CO EC GY PY PE SR UY VE',
 Oceania:'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU'
};
const displayCountries = new Intl.DisplayNames(['en'],{type:'region'});
const continentByCode = {};
for(const [continent,codes] of Object.entries(countryCodes))for(const code of codes.split(' ')){
 const country=displayCountries.of(code);continentByCode[code]=continent;countries[country]=[country,continent];
}
Object.assign(countries,{'United States of America':['United States','North America'],"Côte d'Ivoire":['Ivory Coast','Africa'],'Congo (the Democratic Republic of the)':['Democratic Republic of the Congo','Africa'],'Congo - Kinshasa':['Democratic Republic of the Congo','Africa'],'Cabo Verde':['Cabo Verde','Africa'],'Cape Verde':['Cabo Verde','Africa'],'Swaziland':['Eswatini','Africa'],'United Republic of Tanzania':['Tanzania','Africa']});
export function countryFromChapter(chapter){
 const code=chapter?.country?.toUpperCase();const named=countries[chapter?.country_name];
 if(named)return {country:named[0],continent:named[1]};
 if(continentByCode[code])return {country:code==='CD'?'Democratic Republic of the Congo':code==='CI'?'Ivory Coast':code==='CV'?'Cabo Verde':displayCountries.of(code),continent:continentByCode[code]};
 return {country:plain(chapter?.country_name)||'Not specified',continent:'Not specified'};
}
export function geography(location){const text=plain(location);if(/online|virtual|remote/i.test(text))return {city:'Online',country:'Online',continent:'Online'};for(const key of Object.keys(countries).sort((a,b)=>b.length-a.length)){if(new RegExp('(?:^|[,\\s])'+key+'(?:$|[,\\s])','i').test(text)){const [country,continent]=countries[key];return {city:text.split(',')[0]||country,country,continent};}}return {city:text||'Location to be confirmed',country:'Not specified',continent:'Not specified'};}
function safeURL(value,base){try{const u=new URL(value,base);return u.protocol==='https:'?u.href:null;}catch{return null;}}
export function validDate(d){return /^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;}
function makeEvent(v,source,now){if(!v.name||!validDate(v.start)||!validDate(v.end)||v.end<v.start)return null;const url=safeURL(v.url,source.url);if(!url)return null;const name=plain(v.name).slice(0,220);return {id:'web-'+hash(url+'|'+name.toLowerCase()+'|'+v.start),calendar:'tech',name,start:v.start,end:v.end,...geography(v.location),topics:source.topics,type:source.type||'Conference',format:/online|virtual/i.test(v.location||'')?'Online':'In person',price:'Not announced',url,description:plain(v.description||'See the organizer’s website for programme, registration and participation details.').slice(0,1500),verifiedAt:now.slice(0,10),verification:'Source imported',funding:null,...v.free===true?{price:'Free'}:{}};}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
export function parseJSONLD(html,source,now=new Date().toISOString()){
  const events=[];function visit(v){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(visit);return;}const types=[].concat(v['@type']||[]);if(types.some(t=>/Event$/.test(t))&&v.startDate){const l=v.location||{},a=l.address||{},country=typeof a.addressCountry==='string'?a.addressCountry:a.addressCountry?.name;const event=makeEvent({name:v.name,start:String(v.startDate).slice(0,10),end:String(v.endDate||v.startDate).slice(0,10),location:typeof l==='string'?l:[a.addressLocality,country,l.name].filter(Boolean).join(', '),url:v.url||source.url,description:v.description,free:v.isAccessibleForFree===true},source,now);if(event)events.push(event);}for(const [key,val] of Object.entries(v))if(key!=='location')visit(val);}
  for(const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{visit(JSON.parse(match[1]));}catch{/* Malformed blocks do not interrupt other sources. */}}
  return events;
}
export function parsePython(html,source,now=new Date().toISOString()){
  const events=[];for(const item of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)){const s=item[1],title=s.match(/<h3[^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i),times=[...s.matchAll(/<time[^>]*datetime=["']([^"']+)["']/gi)],loc=s.match(/<span[^>]*class=["'][^"']*event-location[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);if(!title||!times.length)continue;const start=times[0][1].slice(0,10);let end=times.at(-1)[1].slice(0,10);const range=s.match(/(?:&ndash;|–)\s*(\d{1,2})\s+([A-Za-z]{3})\.?[\s\S]*?id=["']end-\d+["'][^>]*>\s*(20\d{2})/i);if(range&&months[range[2].toLowerCase()])end=range[3]+'-'+months[range[2].toLowerCase()]+'-'+range[1].padStart(2,'0');const ev=makeEvent({name:title[2],url:title[1],start,end,location:loc?.[1]},source,now);if(ev)events.push(ev);}return events;
}
const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
export function parseUsenix(html,source,now=new Date().toISOString()){
  const events=[];for(const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){const cols=[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>x[1]);const dateCol=cols.find(c=>/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d/.test(plain(c)));if(!dateCol)continue;const d=plain(dateCol).match(/([A-Za-z]{3})\s+(\d{1,2})(?:\s*[–—-]\s*(?:([A-Za-z]{3})\s+)?(\d{1,2}))?,?\s+(20\d{2})/);if(!d)continue;const titleCol=cols.find(c=>/class=["']conference-title["']/i.test(c));if(!titleCol)continue;const name=titleCol.match(/class=["']conference-title["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];const primaryLink=titleCol.match(/<a[^>]*href=["']([^"']+)["'][^>]*>\s*<span class=["']conference-title["']/i)?.[1];const title=[null,primaryLink||source.url+'#'+eventName(plain(name)),name];if(!name)continue;const start=d[5]+'-'+months[d[1].toLowerCase()]+'-'+d[2].padStart(2,'0'),end=d[5]+'-'+months[(d[3]||d[1]).toLowerCase()]+'-'+(d[4]||d[2]).padStart(2,'0');const ev=makeEvent({name:title[2],url:title[1],start,end,location:[cols.at(-1)?.match(/class=["']address["'][^>]*>([\s\S]*?)<\/div>/)?.[1],cols.at(-1)?.match(/class=["']country["'][^>]*>([\s\S]*?)<\/div>/)?.[1]].filter(Boolean).map(plain).join(', ')},source,now);if(ev)events.push(ev);}return events;
}
export function eventTopics(event,source){
 const text=plain([event.title,event.description_short,...(event.tags||[])].join(' '));
 const topics=new Set(source.topics||['Development']);
 const rules=[['AI',/\bAI\b|artificial intelligence|machine learning|Gemini|Gemma|\bLLM\b|agentic/i],['Flutter',/flutter|\bdart\b/i],['Go',/golang|gopher|\bGo (?:meetup|programming|language|developers?)\b/i],['GIS',/\bGIS\b|geospatial|earth engine|google maps|openstreetmap|remote sensing/i],['Security',/cybersecurity|\bsecurity\b|privacy|phishing/i],['Cloud & DevOps',/cloud|devops|kubernetes|platform engineering|\bAWS\b/i],['Startups',/startups?|entrepreneur/i],['Open source',/open source|linux|kubernetes/i],['Digital inclusion',/accessibility|digital inclusion/i]];
 for(const [topic,pattern] of rules)if(pattern.test(text))topics.add(topic);
 return [...topics];
}
export function parseBevy(payload,source,now=new Date().toISOString()){
 if(typeof payload==='string'){try{payload=JSON.parse(payload);}catch{return [];}}
 const rows=Array.isArray(payload)?payload:payload?.results||[payload];const events=[];
 for(const v of rows){
  if(!v||v.status!=='Published'||v.is_hidden||v.is_test||v.chapter?.is_private||/\btest event\b|\btesting\b|^test$/i.test(v.title||''))continue;
  const start=String(v.start_date||'').slice(0,10),end=String(v.end_date||v.start_date||'').slice(0,10),url=safeURL(v.url,source.url);
  if(!validDate(start)||!validDate(end)||end<start||!url||!v.title)continue;
  const detailed='audience_type' in v,host=countryFromChapter(v.chapter),topics=eventTopics(v,source),tags=(v.tags||[]).map(plain);
  const format={IN_PERSON:'In person',VIRTUAL:'Online',HYBRID:'Hybrid'}[v.audience_type]||(v.is_virtual_event===true?'Online':'Not announced');
  const venue=plain(v.venue_name);const realVenue=venue&&!/^(?:tba|tbt|tbd|to be announce|to be confirm|online|virtual|none)/i.test(venue)&&!v.hide_location;
  const addressGeo=geography(v.venue_address||'');const explicitCountry=addressGeo.country!=='Not specified'&&addressGeo.country!=='Online';
  const country=format!=='Online'&&explicitCountry?addressGeo.country:host.country,continent=format!=='Online'&&explicitCountry?addressGeo.continent:host.continent;
  const organizer=plain(v.chapter?.title)||source.name;
  const type=/DevFest|Conference|KCD|Community Days?/i.test(v.title+' '+tags.join(' '))?'Conference':/Hackathon/i.test(v.title+' '+tags.join(' '))?'Hackathon':/Workshop|hands.on/i.test(v.title+' '+tags.join(' '))?'Workshop':/Webinar/i.test(v.title)?'Webinar':/Meetup|Tech Talk/i.test(v.title+' '+tags.join(' '))?'Meetup':'Community event';
  const tickets=(v.tickets||[]).filter(t=>t.visible!==false&&Number.isFinite(t.price));
  let price='Not announced',priceLabel='See organizer for admission details';
  if(tickets.length&&!v.use_external_ticketing){price=tickets.some(t=>t.price>0)?'Paid':'Free';priceLabel=price==='Free'?'Free registration; check availability':tickets.some(t=>t.price===0)?'Free and paid ticket options; see organizer':'Paid registration; see organizer for current prices';}
  const locationBasis=format==='Online'?'Online':realVenue?'Organizer venue':'Chapter location';
  events.push({id:(source.prefix||'bevy')+'-'+v.id,calendar:'tech',name:plain(v.title).slice(0,220),start,end,city:format==='Online'?'Online':plain(v.venue_city||v.chapter?.city)||'Location to be confirmed',country,continent,topics,type,format,price,priceLabel,url,organizer,series:source.series||source.name,tags,description:`Hosted by ${organizer}.${topics.some(t=>t!=='Development')?' Published topics include '+topics.filter(t=>t!=='Development').join(', ')+'.':''} See the organizer for the agenda and registration.`,verifiedAt:now.slice(0,10),verification:'Organizer record',funding:null,locationBasis,...(realVenue?{venue}:{}),sourceAPI:new URL('/api/event/'+v.id+'/',source.url).href,...(detailed?{detailsVerifiedAt:now.slice(0,10),timezone:v.event_timezone||v.chapter?.timezone}:{})});
 }
 return events;
}
export function parseICTAM(payload,source,now=new Date().toISOString()) {
 if(typeof payload==='string'){try{payload=JSON.parse(payload);}catch{return [];}}
 if(!Array.isArray(payload))return [];
 return payload.flatMap(v=>{
  const start=String(v.date||'').slice(0,10),end=String(v.endDate||v.date||'').slice(0,10);
  if(!v.id||!v.title||!validDate(start)||!validDate(end)||end<start||/cancel/i.test(v.status||''))return [];
  const venue=plain(v.location),online=/online|zoom|virtual/i.test(venue),geo=geography(venue);
  const city=online?'Online':/nkopola/i.test(venue)?'Mangochi':geo.country==='Malawi'?geo.city:'Location to be confirmed';
  const name=plain(v.title),topics=eventTopics({title:name,description_short:plain(v.description)},source);
  return [{id:'ictam-'+v.id,calendar:'tech',name,start,end,city,country:'Malawi',continent:'Africa',topics,type:online?'Webinar':v.category==='Training'?'Course':/Conference/i.test(name)?'Conference':'Community event',format:online?'Online':'In person',price:'Not announced',url:'https://www.ictam.org.mw/events/'+encodeURIComponent(v.id),organizer:source.name,series:'ICTAM',description:plain(v.description).slice(0,350),funding:null,venue:online?undefined:venue,locationBasis:online?'Online':'Organizer venue',sourceAPI:source.url+'/'+encodeURIComponent(v.id),verifiedAt:now.slice(0,10),detailsVerifiedAt:now.slice(0,10),verification:'Organizer record'}];
 });
}
function eventName(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/20\d{2}/g,'').replace(/[^a-z0-9]/g,'');}
export function mergeEvents(existing,incoming){
 const merged=[...existing];
 const canonical=u=>u.replace(/\/$/,'');
 for(const event of incoming){
  const index=merged.findIndex(e=>e.id===event.id||(e.sourceRecordIds||[]).includes(event.id)||(
   e.start.slice(0,4)===event.start.slice(0,4)&&canonical(e.url)===canonical(event.url)&&new URL(e.url).pathname!=='/conferences/srecon'
  )||(
   e.start===event.start&&e.country===event.country&&e.city===event.city&&
   ((!e.sourceAPI&&!event.sourceAPI&&eventName(e.name)===eventName(event.name))||(e.aliases||[]).some(n=>eventName(n)===eventName(event.name)))
  ));
  if(index<0){merged.push(event);continue;}
  const old=merged[index];
  if((old.sourceRecordIds||[]).includes(event.id)){merged[index]={...old,verifiedAt:event.verifiedAt};continue;}
  if(old.verification==='Source imported'||old.verification==='Organizer record'){
   // A listing refresh must not replace detail-verified prices and venues with unknowns.
   merged[index]=old.detailsVerifiedAt&&!event.detailsVerifiedAt?
    {...old,name:event.name,start:event.start,end:event.end,verifiedAt:event.verifiedAt}:
    {...event,id:old.id,funding:old.funding,...(old.sourceRecordIds?{sourceRecordIds:old.sourceRecordIds,alternateSources:old.alternateSources}:{})};
  }else merged[index]={...old,start:event.start,end:event.end,verifiedAt:event.verifiedAt};
 }
 return merged;
}
export async function scrape(snapshot,{fetcher=fetch,now=new Date().toISOString()}={}){
  const reports=[],incoming=[];
  // Three concurrent, bounded requests; all source failures retain existing data.
  for(let i=0;i<SOURCES.length;i+=3){await Promise.all(SOURCES.slice(i,i+3).map(async source=>{try{
    const response=await fetcher(source.url,{headers:{'User-Agent':'KorvexaCalendar/1.0 (+https://calendar.korvexa.com)'},signal:AbortSignal.timeout(15000),redirect:'manual'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    if(Number(response.headers.get('content-length')||0)>8000000)throw new Error('Page too large');
    const reader=response.body.getReader();let chunks=[],length=0;for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>8000000){await reader.cancel();throw new Error('Page too large');}chunks.push(value);}const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}const html=new TextDecoder().decode(bytes);
    const parsed=source.parser==='ictam'?parseICTAM(html,source,now):source.parser==='bevy'?parseBevy(html,source,now):source.parser==='python'?parsePython(html,source,now):source.parser==='usenix'?parseUsenix(html,source,now):parseJSONLD(html,source,now);
    incoming.push(...parsed.filter(e=>e.end>=now.slice(0,10)));reports.push({id:source.id,name:source.name,url:source.url,status:parsed.length?'ok':'no structured events',count:parsed.length,checkedAt:now});
  }catch(error){reports.push({id:source.id,name:source.name,url:source.url,status:'error',error:error.message,checkedAt:now,count:0});}}));}
  return {...snapshot,events:mergeEvents(snapshot.events,incoming),sources:reports,lastScrape:now,updatedAt:incoming.length?now:snapshot.updatedAt};
}
