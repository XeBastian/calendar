import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import {cp, mkdtemp, readFile, rm, writeFile, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
let fixture, handler, seed, config;

before(async () => {
  fixture = await mkdtemp(join(tmpdir(), 'calendar-vercel-'));
  for (const directory of ['public', 'src', 'data', 'api']) {
    await cp(join(root, directory), join(fixture, directory), {recursive: true});
  }
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  // Reproduce a clean deployment checkout with no Sites configuration.
  const build = spawnSync(process.execPath, [join(root, 'scripts/build.mjs')], {
    cwd: fixture, encoding: 'utf8'
  });
  assert.equal(build.status, 0, build.stderr || build.stdout);
  handler = (await import(pathToFileURL(join(fixture, 'api/index.js')))).default;
  seed = JSON.parse(await readFile(join(fixture, 'data/events.json'), 'utf8'));
  config = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
});

after(async () => {
  if (fixture) await rm(fixture, {recursive: true, force: true});
});

function request(path, query = {}, method = 'GET') {
  const url = new URL('https://calendar.example/api/index');
  url.searchParams.set('__calendar_path', path);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return handler.fetch(new Request(url, {method}));
}

test('build produces Vercel static output without a Sites manifest', async () => {
  await assert.rejects(stat(join(fixture, '.openai')), {code: 'ENOENT'});
  await assert.rejects(stat(join(fixture, 'dist/.openai')), {code: 'ENOENT'});
  for (const name of ['index.html', 'style.css', 'app.js', 'calendar.mjs', 'ads.mjs', 'ads-config.json', 'ads.txt', 'privacy.html', 'privacy.js', 'favicon.svg', 'korvexa-logo.jpg', 'korvexa-mark.png']) {
    assert.ok((await readFile(join(fixture, config.outputDirectory, name))).length);
  }
  const html = await readFile(join(fixture, config.outputDirectory, 'index.html'), 'utf8');
  assert.match(html, /id="main"/);
  assert.match(html, /src="\/app.js/);
});

test('Vercel function serves health, event data and source status', async () => {
  const health = await request('/api/health');
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {ok: true, calendar: 'tech'});
  const events = await request('/api/events');
  assert.equal(events.status, 200);
  assert.equal(events.headers.get('cache-control'), 'no-store');
  assert.equal((await events.json()).events.length, seed.events.length);
  const sources = await request('/api/sources');
  assert.equal(sources.status, 200);
  assert.deepEqual((await sources.json()).sources, seed.sources);
});

test('Vercel calendar feed preserves filters and custom-domain links', async () => {
  const event = seed.events[0];
  const response = await request('/calendar/tech.ics', {ids: event.id, past: 'true'});
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/calendar/);
  const ics = (await response.text()).replace(/\r\n /g, '');
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(ics.includes(`UID:${event.id}@calendar.korvexa.com`));
  assert.ok(ics.includes(`URL:https://calendar.example/events/${encodeURIComponent(event.id)}`));
  const empty = await request('/calendar/tech.ics', {ids: 'none'});
  assert.doesNotMatch(await empty.text(), /BEGIN:VEVENT/);
});

test('individual event exports and unsupported requests retain correct responses', async () => {
  const event = seed.events[0];
  const response = await request(`/api/events/${event.id}.ics`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /attachment/);
  assert.equal((await request('/api/events/missing-event.ics')).status, 404);
  assert.equal((await request('/api/import', {}, 'POST')).status, 403);
  assert.equal((await request('/api/events', {}, 'POST')).status, 405);
});

test('detail page rewrites resolve to the app shell while API and feed use a function', async () => {
  const eventRewrite = config.rewrites.find(route => route.source === '/events/:id');
  const fundingRewrite = config.rewrites.find(route => route.source === '/opportunities/:id');
  for (const route of [eventRewrite, fundingRewrite]) {
    assert.ok(route);
    const html = await readFile(join(fixture, config.outputDirectory, route.destination), 'utf8');
    assert.match(html, /id="main"/);
  }
  const apiRewrite = config.rewrites.find(route => route.source === '/api/:path*');
  const response = await handler.fetch(new Request(
    'https://calendar.example' + apiRewrite.destination.replaceAll(':path*', 'health')
  ));
  assert.equal(response.status, 200);
  const feedRewrite = config.rewrites.find(route => route.source === '/calendar/tech.ics');
  const feed = await handler.fetch(new Request('https://calendar.example' + feedRewrite.destination));
  assert.equal(feed.status, 200);
  assert.match(feed.headers.get('content-type'), /^text\/calendar/);
});

test('official brand assets are served without binary corruption by the portable Worker',async()=>{for(const [name,type] of [['korvexa-logo.jpg','image/jpeg'],['korvexa-mark.png','image/png']]){const response=await request('/'+name);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),type);assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(join(fixture,'public',name)));}});


test('publisher setup serves consistent verification identifiers with ads active',async()=>{
 const config=await (await request('/ads-config.json')).json();
 assert.equal(config.adsense.publisherId,'ca-pub-3654708143461818');
 assert.equal(config.enabled,true);
 assert.equal(config.siteUrl,'https://calendar.korvexa.dev');
 const ads=await request('/ads.txt');
 assert.equal(ads.status,200);
 assert.match(ads.headers.get('content-type'),/^text\/plain/);
 assert.equal(await ads.text(),'google.com, pub-3654708143461818, DIRECT, f08c47fec0942fa0\n');
 const html=await readFile(join(fixture,'public/index.html'),'utf8');
 assert.match(html,/<meta name="google-adsense-account" content="ca-pub-3654708143461818">/);
 assert.match(html,/<script[^>]+src=["'][^"']*pagead2\.googlesyndication/i);
});

test('privacy routes work in the portable Worker and Vercel output, including HEAD',async()=>{
 for(const path of ['/privacy','/privacy/','/privacy.html']){
  const response=await request(path);
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/^text\/html/);
  const html=await response.text();
  assert.match(html,/Privacy, clearly/);
  assert.match(html,/This calendar uses Google AdSense/);
  assert.match(html,/mailto:hello@korvexa.com/);
 }
 const head=await request('/privacy',{},'HEAD');
 assert.equal(head.status,200);assert.equal(await head.text(),'');
 for(const path of ['/privacy','/privacy/']){
  const rewrite=config.rewrites.find(r=>r.source===path);assert.ok(rewrite);
  assert.ok((await readFile(join(fixture,config.outputDirectory,rewrite.destination))).length);
 }
});
