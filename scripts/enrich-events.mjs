import {readFile,writeFile,rename} from 'node:fs/promises';
import {parseBevy,mergeEvents} from '../src/scraper.mjs';

// Fetch detail records for new community listings without claiming that a
// listing alone confirms admission, the venue or the participation format.
const snapshot=JSON.parse(await readFile('data/events.json','utf8'));
const pending=snapshot.events.filter(e=>e.sourceAPI&&!e.detailsVerifiedAt&&['Google Developer Groups','CNCF'].includes(e.series));
const errors=[];let verified=0;
async function save(){
 await writeFile('data/events.json.tmp',JSON.stringify(snapshot,null,2)+'\n');
 await rename('data/events.json.tmp','data/events.json');
}
for(let i=0;i<pending.length;i+=3){
 await Promise.all(pending.slice(i,i+3).map(async event=>{
  try{
   const url=new URL(event.sourceAPI);
   if(url.protocol!=='https:'||!['gdg.community.dev','community.cncf.io','community2.cncf.io'].includes(url.hostname)||!/^\/api\/event\/\d+\/$/.test(url.pathname))throw Error('Unexpected public detail URL');
   const response=await fetch(url,{signal:AbortSignal.timeout(15000),redirect:'error'});
   if(!response.ok)throw Error('HTTP '+response.status);
   if(Number(response.headers.get('content-length')||0)>8000000)throw Error('Record too large');
   const body=await response.text();if(body.length>8000000)throw Error('Record too large');
   const source={name:event.series,series:event.series,prefix:event.id.split('-')[0],url:url.origin,topics:event.series==='CNCF'?['Cloud & DevOps','Open source']:['Development']};
   const parsed=parseBevy(body,source).filter(e=>e.id===event.id&&e.detailsVerifiedAt);
   if(parsed.length!==1)throw Error('No published detail record');
   snapshot.events=mergeEvents(snapshot.events,parsed);verified++;
  }catch(error){errors.push({id:event.id,url:event.sourceAPI,error:error.message});}
 }));
 if(i%60===0){await save();console.log('Details checked: '+Math.min(i+3,pending.length)+' / '+pending.length+'; verified '+verified);}
}
await save();
console.log(JSON.stringify({requested:pending.length,verified,failed:errors.length,errors},null,2));
