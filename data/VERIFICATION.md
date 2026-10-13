# Event verification — 13 October 2026

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

## Validation

Automated checks cover dates, unique identities, future-event count, requested countries/topics, exact short-term search matching, local-date preservation, cohost deduplication, unknown admission/venues, private/test rejection, failed-feed retention, filtered calendar exports, and a clean Vercel build without any Sites configuration. Desktop and mobile browser checks cover separate scrolling, fixed headers, agenda selection, search and responsive layout.
