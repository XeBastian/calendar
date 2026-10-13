# Korvexa Calendar

A small, dependency-free technology calendar with an event directory, event details and funding pathways. Built with native browser JavaScript and shared server logic. Deploy to Vercel with a custom domain, or use the portable Cloudflare Worker. Node 22 runs the same application locally.

## Run

```sh
npm run dev
```

Open http://localhost:4173. The local server persists imported data in `.runtime/events.json`, refreshes stale data when requested, and runs a daily importer while the process is running. Restart after source edits.

```sh
npm run scrape   # Fetch organizer data into the tracked seed dataset
npm test         # Calendar, filters, parser and failure-handling checks
npm run build    # Build static assets in dist/client and the shared server in worker/index.js
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

`data/events.json` is the deployed snapshot on Vercel. Run `npm run scrape`, commit the updated dataset, and redeploy to refresh events. Cloudflare deployments with an R2 `BUCKET` binding persist hosted imports at `calendar/tech.json` without republishing. An unsuccessful run leaves the prior event collection in place and records source errors. New scheduled imports should read back `/api/sources` to verify `lastScrape` and source statuses.

## Deploy to Vercel

Import this repository into Vercel. The checked-in `vercel.json` selects the Other framework preset, runs `npm run build`, and serves `dist/client`. Node is pinned to `22.x`. No `.openai` directory or Sites manifest is required.

`api/index.js` adapts the shared server to a Vercel Function. Rewrites preserve `/api/events`, `/api/sources`, `/api/health`, individual event `.ics` downloads and `/calendar/tech.ics`, including query filters. Event and funding detail URLs return the app shell for direct visits and reloads. Calendar links use the incoming request origin, including your custom domain.

After pushing the changes, redeploy and attach your domain in Vercel's Project Settings → Domains. Verify `/api/health`, `/api/events`, an event detail URL, and `/calendar/tech.ics` on that domain. Public feeds can be subscribed to by Google and Apple Calendar; deployment protection must allow those services to fetch the feed.

Vercel serves the event snapshot included in the build. The local daily importer and Cloudflare Cron Triggers do not run in a Vercel Function. Refresh with `npm run scrape` and redeploy; unattended imports require a separately configured scheduler and durable storage. The manual import endpoint remains disabled on self-hosted deployments.

## Hosting at calendar.korvexa.com

The custom domain has not been provisioned by this repository. To use your own Cloudflare account:

1. Create an R2 bucket named `korvexa-calendar`; configure the `BUCKET` binding.
2. Build the Worker with `npm run build`.
3. Deploy `worker/index.js` with the included `wrangler.jsonc` (Wrangler is a deployment tool, not a runtime dependency).
4. Attach `calendar.korvexa.com` as a Worker custom domain in the account that owns `korvexa.com`. DNS and account access are required.
5. Verify the public feed and configure the daily cron at 06:00 UTC (08:00 Africa/Blantyre).

Calendar services choose their own refresh cadence, which can take many hours.

## Other domains later

Every event has a `calendar` key. Calendar definitions live in `src/calendar.mjs`; events, importer sources, UI topics and feed routing can be extended to additional domain calendars without changing the event model. This release intentionally exposes only the technology calendar.

## Data provenance

Organizer-confirmed seed records were checked October 13, 2026. Every event has a source link and verification date. General programme pathways have no fixed event dates and therefore are not exported as calendar events. Application links open official programme pages; the app does not submit applications for users.
