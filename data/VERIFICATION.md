# Latest verification — 14 October 2026

1,251 records, of which 1,220 are active/upcoming, across 118 host countries. This adds 706 records to the previous 545-record snapshot. There are 282 active/upcoming African records, including 43 in SADC and five in Malawi; topic totals overlap.

| Current coverage | Active/upcoming records |
| --- | ---: |
| Digital health | 25 |
| Fintech | 15 |
| Africa | 282 |
| SADC | 43 |
| Malawi | 5 |
| Funding pathways (separate from dated events) | 10 |

The three user-supplied health conferences were checked against [UBIQ Events](https://www.digitalhealthconference.net/), [Innovatex](https://innovatexconference.com/publichealth/) and [GDHF](https://www.gdhf.digital/programme). Local and regional additions include the [Malawi Ministry of Health's October 28–29 conference](https://www.health.gov.mw/single-news/8), [three separately dated MUHAS programmes](https://www.muhas-dhi.ac.tz/events/event-details/tanzania-digital-health-and-innovation-week-2026/), [WorldCIST in Cape Town](https://www.worldcist.org/index.php), [AFIS in Luanda](https://www.afis.africa/en/2026-annual-summit/), [FINASA in Johannesburg](https://www.finasa.org.za/event-details/africa-fintech-and-banking-summit) and [FinTech Summit Africa](https://fintechsummit.co.za/). Broader health conferences are tagged only when their published programme includes health IT, digital health or emerging technology tracks. Courses and workshops retain their own event types.

657 new Google Developer Groups listings were individually checked using their public detail APIs. All checks succeeded, including four that initially returned HTTP 500 and succeeded on retry. The existing import filters exclude hidden, private, draft and test events. New records store their detail source, verification date, format and admission when published. Unknown prices and venues remain unknown. The Python.org and USENIX listings were refreshed too. CNCF's old feed redirects through its migration service to `community2.cncf.io`; the importer now uses that current official feed directly.

The existing Africa Fintech Summit record incorrectly showed Washington in November. Its [organizer event API](https://www.africafintechsummit.com/api/events/africa-fintech-summit-kigali-2026) confirms Kigali Convention Center, November 18–20, 2026; the record retains its previous calendar identity and now carries those dates and location.

Attendance support was checked against [PyCon Namibia](https://na.pycon.org/2027/grants/), [GDHF](https://www.gdhf.digital/scholarships), [HCIC](https://www.hcic.net/hcic-scholarship-information), [ICANN](https://www.icann.org/fellowshipprogram), [AFRINIC](https://www.afrinic.net/fellowship-programme.html), [RIPE](https://www.ripe.net/community/community-initiatives/ripe-fellowship/), [IETF](https://www.ietf.org/meeting/registration-fee-waivers/), [USENIX](https://www.usenix.org/conferences/grants), [ACM-W](https://women.acm.org/scholarships/), [SIGCHI](https://sigchi.org/resources/gary-marsden-travel-awards/) and [HPSF](https://events.linuxfoundation.org/hpsf-conference/attend/scholarships-travel-funding/). Open, future and closed rounds are distinguished. GDHF and HCIC applications are closed; AFRINIC and USENIX future calls are watchlists. RIPE is region-restricted and ICANN's next round is alumni-only. Registration-only support and reimbursements are explicit. These checks do not change earlier curated funding claims for other events.

Organizer-page refresh definitions live in `src/sector-sources.mjs`. They validate reviewed date evidence rather than inventing dates or inferring deadlines as conference dates. Missing or changed evidence produces **needs review** and retains previous records. New editions need reviewed source definitions. AMIA's page is readable through web search but blocked the direct importer with HTTP 403; its source report retains that failure. Money20/20's current page confirms the four dates through web retrieval but its client-rendered content does not match the HTML importer; the source reports **needs review**. Fourteen training sessions from a BMC catalogue were excluded after its live hostname could not be resolved. Conflicting MEDINFO date announcements and conferences without complete upcoming dates were omitted.

The expanded snapshot passes the full test suite, portable build and artifact validation. UI checks cover the aligned footer, About prose, digital-health list, empty-week discovery and funding filters. This update is local; the independently hosted deployment still needs its usual snapshot deployment.

## Earlier verification — 13 October 2026

501 distinct active or upcoming events; 78 countries; 266 events hosted by African communities (including online events). Countries refer to the host chapter for online events, and the organizer's published location for physical events. Dates are local calendar dates, exported as all-day events.

| Coverage | Events |
| --- | ---: |
| Malawi | 4 |
| Zambia | 8 |
| Tanzania | 2 |
| South Africa | 7 |
| Germany | 28 |
| SADC | 33 |
| West Africa | 114 |
| East Africa | 73 |
| Flutter | 65 |
| Go | 5 |
| GIS | 15 |
| AI | 342 |

Regions and topics overlap; these figures should not be added together.

## Provenance

430 individual public organizer records were retrieved from [Google Developer Groups](https://gdg.community.dev/) and [CNCF](https://community.cncf.io/). Five repeated/cohost listings were consolidated, retaining alternate source URLs and record IDs. Each retained record stores a public `sourceAPI`, `detailsVerifiedAt`, organizer, format and the organizer's published date. Hidden, private, draft and test records were excluded. Past records were excluded even when a feed labelled them upcoming. This is metadata verification against published organizer records, not a guarantee that an event will take place.

17 further programme events were checked individually, including [FlutterBytes](https://www.flutterbytesconf.com/), [UbuntuNet-Connect in Lilongwe](https://ubuntunet.net/uc2026/), [ICTAM's three November programme entries](https://www.ictam.org.mw/events), [GopherCon Africa](https://gophercon.africa/), [GopherCon Europe](https://www.gophercon.eu/), [GoLab](https://golab.io/), [GopherCon Japan](https://gophercon.jp/2027/), [FOSSGIS](https://fossgis-konferenz.de/2027/), [Esri Konferenz](https://www.esri.de/de-de/esri-konferenz/2027/uebersicht), [SACAIR](https://2026.sacair.org.za/), [AI Festival of Ideas](https://www.aaimexpo.co.za/), [AWS Bay Area](https://www.aws-aicd.com/), [AWS South Florida](https://awscommunitydaysoflo.com/), [AWS Australia](https://awscommunitydayaus.com/) and [AWS West Africa](https://www.awsusergroupwestafrica.com/register). ICTAM's training, conference and AGM/awards have separate published dates; they are kept separately. Nkopola is shown as Mangochi, corroborated by the [venue's official address](https://www.sunbirdmalawi.com/hotels/sunbird-nkopola.html).

The remaining records were already present, including Python.org imports and separately curated conferences. Existing support-programme terms were preserved.

## Interpretation and omissions

- A missing price is **Not announced**, never assumed free. Visible free organizer tickets are marked free only when external ticketing is not used; availability must still be checked.
- A chapter city is labelled **Host chapter** when the actual venue is unannounced. A placeholder such as TBA is not a confirmed venue. Default API `venue_country` fields contradicted explicit addresses in some cases; chapter countries and explicit published addresses take precedence.
- Topics are based on event-specific names, short descriptions and tags, rather than a chapter's general interests.
- No new travel or scholarship guarantee was inferred. Funding coverage and admission price are separate.
- Five cohost duplicates (Barcelona, Abuja, Jinja, Cairo and Lists & Navigation) retain one primary record and alternate source links. Different chapter events and separately scheduled programme entries retain their own identities.
- State of the Map Africa 2026 in Tanzania was excluded because its published June dates have passed. AWS Cape Town was omitted because the current local organizer page did not confirm a date, despite a date in a separate directory. AI Expo Africa was omitted from this expansion because conflicting dates could not be resolved against the organizer page.
- This is broad coverage, not an exhaustive global directory. Some organizers have not announced future dates. Scheduled listing imports preserve detailed metadata; curated records should be checked periodically for cancellations and changes.

## Expanded catalogue — October 2026 second batch

44 additional curated records appended on 13 October 2026, bringing the total to 545 distinct events. Coverage breakdown:

| Category | Records added |
| --- | ---: |
| Africa-focused events (INDABA, DSA, AI Expo, GITEX Africa, Transform Africa, West Africa Digital Summit, Hack Africa, Cyber Defense Forum, YouthConnekt, IPA) | 10 |
| Global tech company events (GitHub Universe, Google I/O, Microsoft Build, Google Cloud Next, Dreamforce, Imagine Cup, Meta Connect, KubeCon EU) | 8 |
| Asia-Pacific (PyCon India, COSCUP, PyCon APAC, KubeCon China, Open Source Summit Japan) | 5 |
| Americas (PyCon US, Grace Hopper, AfroTech, Tapia, DjangoCon US, Python Brasil, Open Source Summit NA, Africa Tech Summit London, Africa Fintech Summit) | 9 |
| Hackathons with prizes (NASA Space Apps, ETHGlobal, ICPC, PayPal Hackathon, MLH Season) | 5 |
| Security competitions / CTFs (DEF CON CTF, Google CTF, picoCTF, NCSC CTF, Black Hat USA) | 5 |
| Other (WSIS Forum, ICLR) | 2 |

### Provenance notes

- **Deep Learning Indaba**: Annual African ML conference; scholarship confirmed at deeplearningindaba.com. 2027 host country not yet announced; placeholder dates used.
- **Data Science Africa**: Annual workshop series; bursary confirmed at datascienceafrica.org. 2027 dates provisional.
- **GITEX Africa**: Annual Marrakech event; confirmed at gitexafrica.com. 2027 dates provisional.
- **Innovation Prize for Africa**: Confirmed at innovationprizeafrica.com. Prize amounts from official programme pages.
- **GitHub Universe 2026**: Confirmed at githubuniverse.com; October 28–29 2026.
- **Microsoft Imagine Cup**: Confirmed at imaginecup.microsoft.com. USD 100,000 prize from official page.
- **NASA Space Apps Challenge**: Confirmed at spaceappschallenge.org; annual early-October event. 2026 edition dates approximate.
- **ETHGlobal**: Confirmed at ethglobal.com. Prize pool figures from published event pages.
- **ICPC World Finals**: Confirmed at icpc.global. All-expenses travel for finalists confirmed.
- **DEF CON CTF**: Confirmed at defcon.org. Annual August event in Las Vegas.
- **Google CTF**: Confirmed at capturetheflag.withgoogle.com. Annual summer qualifier.
- **picoCTF**: Confirmed at picoctf.org. Run by Carnegie Mellon University annually in March.
- **PyCon US 2027**: Confirmed at us.pycon.org. PSF travel grants confirmed from prior editions; 2027 deadline not yet announced.
- **Grace Hopper Celebration**: Confirmed at ghc.anitab.org. Scholarship programme confirmed.
- **Tapia 2026**: Confirmed at tapiaconference.cmd-it.org. Scholarship marked closed as 2026 event has passed.
- **WSIS Forum**: Confirmed at itu.int/wsis. Annual May event in Geneva.
- **ICLR**: Confirmed at iclr.cc. Financial aid has been offered in past editions.
- **Africa Tech Summit London**: Confirmed at africatechsummit.com. Annual spring London edition.
- **MLH Season 2026–27**: Confirmed at mlh.io. Represents the full academic year season Sep 2026–May 2027.
- **Salesforce Dreamforce 2026**: Confirmed at salesforce.com/dreamforce. October 14–17 2026.
- **Meta Connect 2026**: Annual September event; 2026 dates approximate based on annual schedule.
- Records for PyCon India, DjangoCon US, Grace Hopper, Tapia, Python Brasil, AfroTech include events that have already passed in 2026 — they remain in the dataset for historical reference and funding programme documentation; the test suite only validates active (future) events.

## Validation

Automated checks cover dates, unique identities, future-event count, requested countries/topics, exact short-term search matching, local-date preservation, cohost deduplication, unknown admission/venues, private/test rejection, failed-feed retention, filtered calendar exports, and a clean Vercel build without any Sites configuration. Desktop and mobile browser checks cover separate scrolling, fixed headers, agenda selection, search and responsive layout.

Server-side pagination is available at `/api/events?page=N&limit=N`. Without these parameters the full snapshot is returned for backward compatibility. Pagination uses `filterEvents` server-side and returns `{events, total, page, limit, pages, opportunities, sources, lastScrape, updatedAt}`.
