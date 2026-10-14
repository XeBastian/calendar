import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cleanDisplayText, cleanDisplayRecords} from '../public/display.mjs';

test('imported emoji decoration is removed without damaging international event wording', () => {
  assert.equal(cleanDisplayText('🌱 Build & Scale Agentic AI 🚀'), 'Build & Scale Agentic AI');
  assert.equal(cleanDisplayText('2026 AI Agent 系列課程（觀念篇）✨'), '2026 AI Agent 系列課程（觀念篇）');
  assert.equal(cleanDisplayText('☁️ Cloud 👩🏽‍💻 🇲🇼 1️⃣ Meetup'), 'Cloud Meetup');
  assert.equal(cleanDisplayText('DevFest Münster — AI + Art 2026'), 'DevFest Münster - AI + Art 2026');
});

test('presentation cleaning preserves source identity, URLs, and original records', () => {
  const source = {id: 'source-🚀', url: 'https://example.com/🚀', name: 'Code Together 🚀', start: '2026-10-13', topics: ['Development']};
  const [result] = cleanDisplayRecords([source]);
  assert.equal(result.name, 'Code Together');
  assert.equal(result.id, source.id);
  assert.equal(result.url, source.url);
  assert.equal(result.start, source.start);
  assert.deepEqual(result.topics, source.topics);
  assert.equal(source.name, 'Code Together 🚀');
});

test('all bundled event names can be displayed without emoji or empty titles', async () => {
  const data = JSON.parse(await readFile(new URL('../data/events.json', import.meta.url), 'utf8'));
  for (const event of cleanDisplayRecords(data.events)) {
    assert.ok(event.name.length, event.id);
    assert.doesNotMatch(event.name, /\p{Extended_Pictographic}|\p{Regional_Indicator}/u);
  }
});
