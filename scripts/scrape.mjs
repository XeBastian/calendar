import {readFile,writeFile,rename} from 'node:fs/promises';
import {scrape} from '../src/scraper.mjs';
const snapshot=JSON.parse(await readFile('data/events.json','utf8'));const updated=await scrape(snapshot);const good=updated.sources.filter(s=>s.status==='ok');
await writeFile('data/events.json.tmp',JSON.stringify(updated,null,2)+'\n');await rename('data/events.json.tmp','data/events.json');
console.log(JSON.stringify({events:updated.events.length,added:updated.events.length-snapshot.events.length,sources:updated.sources},null,2));
if(!good.length){console.error('No sources yielded events; existing data was retained.');process.exitCode=1;}
