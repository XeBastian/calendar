let memorySnapshot=null,refreshing=null;
async function readSnapshot(env){
 if(env.BUCKET){const object=await env.BUCKET.get('calendar/tech.json');if(object){
  const persisted=await object.json();
  const sources=new Map(SEED.sources.map(s=>[s.id,s]));
  for(const source of persisted.sources||[]){const previous=sources.get(source.id);if(!previous||source.checkedAt>previous.checkedAt)sources.set(source.id,source);}
  return {...persisted,events:mergeEvents(SEED.events,persisted.events),opportunities:persisted.opportunities||SEED.opportunities,sources:[...sources.values()],updatedAt:[SEED.updatedAt,persisted.updatedAt].filter(Boolean).sort().at(-1)};
 }}
 return memorySnapshot||SEED;
}
async function refreshSnapshot(env){if(refreshing)return refreshing;refreshing=(async()=>{const snapshot=await readSnapshot(env);const next=await scrape(snapshot);if(env.BUCKET)await env.BUCKET.put('calendar/tech.json',JSON.stringify(next),{httpMetadata:{contentType:'application/json'}});memorySnapshot=next;return next;})();try{return await refreshing;}finally{refreshing=null;}}
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"};
function reply(body,status=200,headers={}){return new Response(body,{status,headers:{...security,...headers}});}
export default {
 async fetch(request,env={},ctx={waitUntil(){}}){
  const url=new URL(request.url),path=url.pathname;
  if(path==='/api/import'&&request.method==='POST'){
   // Sites' private dispatch authenticates this route, including service callers.
   // Self-hosting keeps the endpoint off and uses the scheduled handler instead.
   if(env.IMPORT_MODE!=='private-site'||!url.hostname.endsWith('.chatgpt.site'))return reply('Importer endpoint disabled',403);
   try{const next=await refreshSnapshot(env);return reply(JSON.stringify({events:next.events.length,lastScrape:next.lastScrape,sources:next.sources}),200,{'Content-Type':'application/json','Cache-Control':'no-store'});}catch{return reply('Import failed',503);}
  }
  if(!['GET','HEAD'].includes(request.method))return reply('Method not allowed',405,{'Allow':'GET, HEAD'});
  try{
   if(path==='/api/health')return reply(JSON.stringify({ok:true,calendar:'tech'}),200,{'Content-Type':'application/json'});
   if(path==='/api/events'||path==='/api/sources'||path==='/calendar/tech.ics'||/^\/api\/events\/[^/]+\.ics$/.test(path)){
    const snapshot=await readSnapshot(env);const stale=!snapshot.lastScrape||Date.now()-Date.parse(snapshot.lastScrape)>86400000;
    if(stale&&env.BUCKET)ctx.waitUntil(refreshSnapshot(env).catch(err=>console.error('Import failed:',err.message)));
    if(path==='/api/sources')return reply(JSON.stringify({lastScrape:snapshot.lastScrape,sources:snapshot.sources}),200,{'Content-Type':'application/json','Cache-Control':'no-store'});
    if(path==='/api/events')return reply(JSON.stringify(snapshot),200,{'Content-Type':'application/json','Cache-Control':'no-store'});
    let events=filterEvents(snapshot.events,url.searchParams);
    if(path.startsWith('/api/events/')){const id=decodeURIComponent(path.split('/').at(-1).replace(/\.ics$/,''));events=snapshot.events.filter(e=>e.id===id);if(!events.length)return reply('Event not found',404);}
    if(url.searchParams.has('ids')){const ids=new Set(url.searchParams.get('ids').split(','));events=events.filter(e=>ids.has(e.id));}
    return reply(toICS(events,url.origin),200,{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'attachment; filename="korvexa-tech-calendar.ics"','Cache-Control':'public, max-age=300'});
   }
   if(path==='/privacy'||path==='/privacy/')return reply(request.method==='HEAD'?null:ASSETS['/privacy.html'],200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
   if(BINARY_ASSETS[path])return reply(request.method==='HEAD'?null:Uint8Array.from(atob(BINARY_ASSETS[path]),c=>c.charCodeAt(0)),200,{'Content-Type':path.endsWith('.png')?'image/png':'image/jpeg','Cache-Control':'public, max-age=86400'});
   const types={'html':'text/html','css':'text/css','js':'text/javascript','mjs':'text/javascript','svg':'image/svg+xml','json':'application/json','txt':'text/plain'};
   if(ASSETS[path])return reply(request.method==='HEAD'?null:ASSETS[path],200,{'Content-Type':types[path.split('.').at(-1)]+'; charset=utf-8','Cache-Control':'public, max-age=300'});
   if(path==='/'||/^\/(events|opportunities)\/[^/]+$/.test(path))return reply(request.method==='HEAD'?null:ASSETS['/index.html'],200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
   return reply('Not found',404);
  }catch(error){console.error(error.message);return reply(JSON.stringify({error:'Calendar temporarily unavailable'}),503,{'Content-Type':'application/json','Retry-After':'60'});}
 },
 async scheduled(controller,env,ctx){ctx.waitUntil(refreshSnapshot(env));}
};
