// A private Site's supported service access is read from hidden stdin only.
import readline from 'node:readline';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdout.write('Ready for private Site import JSON on stdin (input is hidden).\n');
let body='';process.stdin.setEncoding('utf8');process.stdin.on('data',async chunk=>{
 body+=chunk;if(!body.includes('\n'))return;process.stdin.pause();
 try{const {url,token}=JSON.parse(body.trim());const origin=new URL(url);if(origin.protocol!=='https:'||!origin.hostname.endsWith('.chatgpt.site'))throw Error('Expected private Sites origin');const headers={'OAI-Sites-Authorization':'Bearer '+token};const response=await fetch(origin.origin+'/api/import',{method:'POST',headers,signal:AbortSignal.timeout(90000)});if(!response.ok)throw Error('Import HTTP '+response.status);const result=await response.json();const check=await fetch(origin.origin+'/api/sources',{headers});const readback=await check.json();if(readback.lastScrape!==result.lastScrape)throw Error('Readback mismatch');console.log(JSON.stringify({verified:true,...result}));process.exit(0);}catch(e){console.error(e.message);process.exit(1);}
});
