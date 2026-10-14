import {readFile, writeFile, mkdir, rm, cp, copyFile} from 'node:fs/promises';

const assets = {};
for (const name of ['index.html', 'style.css', 'app.js', 'display.mjs', 'dropdowns.mjs', 'theme.mjs', 'ads.mjs', 'ads-config.json', 'ads.txt', 'privacy.html', 'privacy.js', 'favicon.svg', '404.html']) {
  assets['/' + name] = await readFile('public/' + name, 'utf8');
}
assets['/calendar.mjs'] = await readFile('src/calendar.mjs', 'utf8');
const binaryAssets = {};
for (const name of ['korvexa-logo.jpg', 'korvexa-mark.png']) {
  binaryAssets['/' + name] = (await readFile('public/' + name)).toString('base64');
}
const seed = JSON.parse(await readFile('data/events.json', 'utf8'));
const core = (await readFile('src/calendar.mjs', 'utf8')).replace(/^export /gm, '');
const sectorSources = (await readFile('src/sector-sources.mjs', 'utf8')).replace(/^export /gm, '');
const scraper = (await readFile('src/scraper.mjs', 'utf8')).replace(/^import .*sector-sources\.mjs';\n/m, '').replace(/^export /gm, '');
const runtime = await readFile('src/worker.mjs', 'utf8');
const worker = 'const BINARY_ASSETS=' + JSON.stringify(binaryAssets) + ';\nconst ASSETS=' + JSON.stringify(assets) + ';\nconst SEED=' +
  JSON.stringify(seed) + ';\n' + core + '\n' + sectorSources + '\n' + scraper + '\n' + runtime;

await mkdir('worker', {recursive: true});
await writeFile('worker/index.js', worker);
await rm('dist', {recursive: true, force: true});
await mkdir('dist/server', {recursive: true});
await writeFile('dist/server/index.js', worker);
await cp('public', 'dist/client', {recursive: true});
await copyFile('src/calendar.mjs', 'dist/client/calendar.mjs');
console.log('Built Korvexa Calendar: ' + seed.events.length +
  ' events, static assets in dist/client, ' + Buffer.byteLength(worker) + ' byte Worker.');
