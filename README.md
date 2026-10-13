# Korvexa Calendar

A small, dependency-free technology calendar with an event directory, event details and funding pathways. Built with native browser JavaScript and a portable Cloudflare Worker; Node 22 runs the same application locally.

## Run

```sh
npm run dev
```

Open http://localhost:4173. The local server persists imported data in `.runtime/events.json`, refreshes stale data when requested, and runs a daily importer while the process is running. Restart after source edits.

```sh
npm run scrape   # Fetch organizer data into the tracked seed dataset
npm test         # Calendar, filters, parser and failure-handling checks
npm run build    # Bundle the UI, shared logic, seed and server into worker/index.js
npm run validate
```

## Features

- Search by event, location and topic; filter continent, country (including UAE), year, event type, admission, support, applicant group and format.
- Week, month and list views; bookmark events on the current device. Week is the opening view, and searching opens the list. Calendar arrows and the date picker share the current date without changing subscription filters.
- Event details link directly to organizer and financial-support sources.
- Google Calendar event links and Apple/Outlook-compatible `.ics` downloads.
- Filtered subscription feed at `/calendar/tech.ics`; query parameters match directory filters. `ids` exports a saved selection.
- All-day calendar events use an exclusive end date, stable UIDs, escaped content and UTF-8 byte-safe RFC 5545 folding.
- Funding opportunities distinguish free admission, ticket scholarships, partial travel grants, fully funded awards and reimbursement. Expired applications automatically display as closed.

## Importer

`src/scraper.mjs` configures trusted sources: Python.org conferences and meetups (two listing pages each), USENIX and organizer JSON-LD from CES, MWC, GITEX, PyHo, Africa Tech Summit, FOSDEM and Web Summit. It makes bounded HTTPS requests, validates dates and URLs, strips HTML, deduplicates, and preserves curated financial-support details. Sources without usable structured events are reported rather than guessed. Add new trusted source entries and a parser when needed.

This is a bounded organizer importer, not an unrestricted search-engine crawler. It discovers new events published in these listings, updates previously imported dates, and records errors. Funding terms, deadlines, ticket prices and eligibility remain curated: structured event data is not reliable evidence of an award's coverage. Some listings do not publish complete location or pricing data; those fields are displayed as unspecified.

`data/events.json` is the initial snapshot; hosted imports persist in the R2 `BUCKET` binding at `calendar/tech.json`. Events do not require republishing to update. An unsuccessful run leaves the prior event collection in place and records source errors. New scheduled imports should read back `/api/sources` to verify `lastScrape` and source statuses.

## Private Sites preview and unattended imports

The private Sites publication uses its platform authentication boundary. Setting `IMPORT_MODE=private-site` enables `POST /api/import` only on a `.chatgpt.site` hostname. It accepts no visitor-supplied sources or event data. A Sites-linked cloud task can obtain the current Site's supported service access using `get_site`, call this endpoint, and read back `/api/sources`. Keep that credential in memory and pass it only as `OAI-Sites-Authorization: Bearer …` to this Site.

**Before making the preview public, remove `IMPORT_MODE`.** Public self-hosting leaves the manual import endpoint disabled and invokes `scheduled()` through Cloudflare Cron Triggers. This avoids a public write endpoint. Never place service credentials in source, feed URLs, prompts or browser code.

## Hosting at calendar.korvexa.com

The custom domain has not been provisioned by this repository. To use your own Cloudflare account:

1. Create an R2 bucket named `korvexa-calendar`; configure the `BUCKET` binding.
2. Build the Worker with `npm run build`.
3. Deploy `worker/index.js` with the included `wrangler.jsonc` (Wrangler is a deployment tool, not a runtime dependency).
4. Attach `calendar.korvexa.com` as a Worker custom domain in the account that owns `korvexa.com`. DNS and account access are required.
5. Verify the public feed and configure the daily cron at 06:00 UTC (08:00 Africa/Blantyre).

Private Sites URLs require sign-in and cannot be fetched by Google/Apple subscription servers. Individual event Google links and `.ics` downloads work in the preview; external feed subscriptions require public hosting. Calendar services choose their own refresh cadence, which can take many hours.

## Other domains later

Every event has a `calendar` key. Calendar definitions live in `src/calendar.mjs`; events, importer sources, UI topics and feed routing can be extended to additional domain calendars without changing the event model. This release intentionally exposes only the technology calendar.

## Data provenance

Organizer-confirmed seed records were checked October 13, 2026. Every event has a source link and verification date. General programme pathways have no fixed event dates and therefore are not exported as calendar events. Application links open official programme pages; the app does not submit applications for users.
