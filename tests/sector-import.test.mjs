import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SECTOR_SOURCES} from '../src/sector-sources.mjs';
import {parseOrganizerPage,parseOrganizerAPI,eventTopics,mergeEvents,scrape} from '../src/scraper.mjs';
import {filterOpportunities,fundingStatus,filterEvents} from '../src/calendar.mjs';

test('organizer page evidence rejects old editions, hidden scripts and deadline-only dates',()=>{
 const source=SECTOR_SOURCES.find(s=>s.id==='digital-health-barcelona');
 assert.equal(parseOrganizerPage('<p>3–4 November 2026</p>',source).length,1);
 assert.equal(parseOrganizerPage('<p>3–4 November 2025</p>',source).length,0);
 assert.equal(parseOrganizerPage('<script>3–4 November 2026</script><p>To be announced</p>',source).length,0);
 assert.equal(parseOrganizerPage('<!-- 3–4 November 2026 --><p>To be announced</p>',source).length,0);
 assert.equal(parseOrganizerPage('<p>Abstract deadline: 3 November 2026</p>',source).length,0);
});
test('one organizer page can publish several separately scheduled programmes',()=>{
 const source=SECTOR_SOURCES.find(s=>s.id==='muhas-health');
 const html='<p>Health Data Analytics Training (2–6 November 2026)</p><p>Girls and Women in HealthTech Workshop (11 November 2026)</p><p>Tanzania Digital Health and Innovation Forum (12–13 November 2026)</p>';
 const events=parseOrganizerPage(html,source);
 assert.equal(events.length,3);assert.equal(mergeEvents([],events).length,3);
 assert.deepEqual(events.map(e=>e.type),['Course','Workshop','Conference']);
});
test('a missing organizer confirmation reports review and preserves the previous record',async()=>{
 const source=SECTOR_SOURCES.find(s=>s.id==='digital-health-barcelona');
 const existing=source.records[0].event;
 const snapshot={events:[existing],updatedAt:'2026-10-14',sources:[{id:'curated-funding',status:'programme page checked'}]};
 const next=await scrape(snapshot,{sources:[source],now:'2026-10-15T12:00:00Z',fetcher:async()=>new Response('<p>Date to be announced</p>')});
 assert.deepEqual(next.events,[existing]);assert.equal(next.updatedAt,snapshot.updatedAt);
 assert.equal(next.sources[0].id,'curated-funding');assert.equal(next.sources[1].status,'needs review');
});
test('redirects are bounded and stay on the configured organizer host',async()=>{
 const source=SECTOR_SOURCES.find(s=>s.id==='digital-health-barcelona');let calls=0;
 const snapshot={events:[],sources:[]};
 const good=await scrape(snapshot,{sources:[source],fetcher:async()=>++calls===1?new Response(null,{status:301,headers:{location:'/conference'}}):new Response('<p>3-4 November 2026</p>')});
 assert.equal(good.events.length,1);assert.equal(calls,2);
 const bad=await scrape(snapshot,{sources:[source],fetcher:async()=>new Response(null,{status:302,headers:{location:'https://untrusted.example/'}})});
 assert.equal(bad.events.length,0);assert.equal(bad.sources[0].status,'error');
});
test('public summit API imports announced dates and excludes unpublished or cancelled records',()=>{
 const source={url:'https://example.org/api/events',prefix:'summit',series:'Organizer',topics:['Fintech']};
 const record={id:'42',slug:'kigali-2026',name:'Africa Fintech Summit',isPublished:true,startDate:'2026-11-18',endDate:'2026-11-20',city:'Kigali',country:'Rwanda',venue:'Convention Centre'};
 const [e]=parseOrganizerAPI(record,source);assert.equal(e.country,'Rwanda');assert.equal(e.end,'2026-11-20');assert.ok(e.topics.includes('Fintech'));
 assert.equal(parseOrganizerAPI({...record,isPublished:false},source).length,0);
 assert.equal(parseOrganizerAPI({...record,status:'Cancelled'},source).length,0);
});
test('health and fintech classification uses the event subject rather than the host name',()=>{
 const topics=eventTopics({title:'AI for healthcare and open banking'}, {topics:['Development']});
 assert.ok(topics.includes('Digital health'));assert.ok(topics.includes('Fintech'));
 assert.ok(!eventTopics({title:'Web development'}, {topics:['Development']}).includes('Digital health'));
});
test('funding filters respect opening windows, regional eligibility and ticket-only coverage',()=>{
 const future={name:'Alumni award',region:'Global',topics:['Connectivity'],audience:['Professionals'],level:'Travel support',status:'Not yet open',opensAt:'2026-11-06',deadline:'2026-12-05'};
 const africa={...future,name:'Africa award',region:'Africa',eligibleContinents:['Africa'],status:'Open',opensAt:null};
 const ticket={...future,name:'Ticket waiver',level:'Ticket scholarship',status:'Contact organiser',opensAt:null,deadline:null};
 const europe={...africa,name:'European award',region:'Europe',eligibleContinents:['Europe']};
 assert.equal(fundingStatus(future,'2026-10-14'),'Not yet open');assert.equal(fundingStatus(future,'2026-11-06'),'Open');assert.equal(fundingStatus(future,'2026-12-06'),'Closed');
 assert.deepEqual(filterOpportunities([future,africa,ticket,europe],{country:'Malawi',funding:'open'},'2026-10-14').map(o=>o.name),['Africa award','Ticket waiver']);
 assert.deepEqual(filterOpportunities([africa,europe],{country:'Egypt'},'2026-10-14').map(o=>o.name),['Africa award']);
 assert.deepEqual(filterOpportunities([africa,europe],{country:'United Kingdom'},'2026-10-14').map(o=>o.name),['European award']);
 assert.equal(filterOpportunities([ticket],{funding:'travel'},'2026-10-14').length,0);
});
test('older persisted records cannot replace more recently verified seed dates',()=>{
 const event=SECTOR_SOURCES[0].records[0].event;
 assert.deepEqual(mergeEvents([event],[{...event,start:'2026-11-01',verifiedAt:'2026-10-13'}]),[event]);
});
test('catalogue contains dedicated health events in Malawi and SADC, global finance and real funding deadlines',async()=>{
 const d=JSON.parse(await readFile(new URL('../data/events.json',import.meta.url)));
 assert.ok(filterEvents(d.events,{topic:'Digital health'},'2026-10-14').length>=20);
 assert.ok(filterEvents(d.events,{topic:'Fintech'},'2026-10-14').length>=10);
 assert.ok(filterEvents(d.events,{topic:'Digital health',country:'Malawi'},'2026-10-14').length);
 assert.ok(filterEvents(d.events,{topic:'Fintech',region:'SADC'},'2026-10-14').length);
 assert.ok(d.opportunities.length>=10);
 const namibia=d.events.find(e=>e.id==='pycon-namibia-2027');assert.equal(namibia.funding.deadline,'2026-10-21');assert.match(namibia.funding.payment,/Reimbursement/);
 assert.equal(d.events.find(e=>e.id==='global-digital-health-forum-2026').funding.status,'Closed');
});
