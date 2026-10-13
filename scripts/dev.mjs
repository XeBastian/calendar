import http from 'node:http';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {scrape} from '../src/scraper.mjs';
let worker,stamp=0,importing=false;
const runtimeFile=new URL('../.runtime/events.json',import.meta.url);
const bucket={async get(){try{const body=await readFile(runtimeFile,'utf8');return {json:async()=>JSON.parse(body)};}catch{return null;}},async put(key,value){await mkdir(new URL('../.runtime/',import.meta.url),{recursive:true});await writeFile(runtimeFile.pathname+'.tmp',value);await rename(runtimeFile.pathname+'.tmp',runtimeFile.pathname);}};
async function reload(){const r=spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});if(r.status!==0)throw Error('Build failed');worker=(await import('../worker/index.js?v='+(++stamp))).default;}
await reload();
const server=http.createServer(async(req,res)=>{try{const origin='http://localhost:'+(process.env.PORT||4173),request=new Request(origin+req.url,{method:req.method,headers:req.headers});const response=await worker.fetch(request,{BUCKET:bucket},{waitUntil:p=>p.catch(e=>console.error(e.message))});res.writeHead(response.status,{...Object.fromEntries(response.headers),'Cache-Control':'no-store'});res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Server error');}});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://localhost:'+(process.env.PORT||4173)));
const interval=setInterval(async()=>{if(importing)return;importing=true;try{const current=await bucket.get();const snapshot=current?await current.json():JSON.parse(await readFile('data/events.json','utf8'));const updated=await scrape(snapshot);await bucket.put('calendar/tech.json',JSON.stringify(updated));console.log('Daily import complete: '+updated.events.length+' events.');}catch(e){console.error('Import failed:',e.message);}finally{importing=false;}},86400000);interval.unref();
process.on('SIGINT',()=>{clearInterval(interval);server.close(()=>process.exit());});
