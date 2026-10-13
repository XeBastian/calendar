import {readdir,readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {parseBevy,mergeEvents} from '../src/scraper.mjs';

const directory=process.argv[2];
if(!directory)throw new Error('Usage: node scripts/import-organizer-records.mjs <downloaded-organizer-records-directory>');
const now=new Date().toISOString();
const snapshot=JSON.parse(await readFile('data/events.json','utf8'));
const incoming=[];
const counts={};
for(const file of (await readdir(directory)).filter(name=>name.endsWith('.json')).sort()){
 const record=JSON.parse(await readFile(join(directory,file),'utf8'));
 const host=new URL(record.url).hostname;
 const google=host==='gdg.community.dev';
 if(!google&&!['community.cncf.io','community2.cncf.io'].includes(host))continue;
 const source={url:google?'https://gdg.community.dev/':'https://community.cncf.io/',name:google?'Google Developer Groups':'CNCF',series:google?'Google Developer Groups':'CNCF',prefix:google?'gdg':'cncf',topics:google?['Development']:['Cloud & DevOps','Open source']};
 const parsed=parseBevy(record,source,now).filter(e=>e.end>=now.slice(0,10));
 incoming.push(...parsed);counts[source.name]=(counts[source.name]||0)+parsed.length;
}
const events=mergeEvents(snapshot.events,incoming).sort((a,b)=>a.start.localeCompare(b.start)||a.name.localeCompare(b.name));
const sources=snapshot.sources.filter(s=>!['gdg-records','cncf-records'].includes(s.id));
for(const [name,count] of Object.entries(counts))sources.push({id:name==='CNCF'?'cncf-records':'gdg-records',name:name+' · individual organizer records',url:name==='CNCF'?'https://community.cncf.io/':'https://gdg.community.dev/',status:'ok',count,checkedAt:now});
await writeFile('data/events.json.tmp',JSON.stringify({...snapshot,events,sources,updatedAt:now},null,2)+'\n');
await rename('data/events.json.tmp','data/events.json');
console.log(JSON.stringify({verifiedRecords:incoming.length,added:events.length-snapshot.events.length,total:events.length,sources:counts},null,2));
