# Calendar advertising setup

The app contains three placement hooks. They are hidden in normal use and visible with `?ads=preview` for layout review. These are labelled previews, not live ads or simulated ad views. No advertising scripts, requests, cookies or tracking are enabled yet.

| Hook | Position | Intended inventory |
| --- | --- | --- |
| `event-inline` | Below an event's date, venue, format and admission | Responsive AdSense display |
| `event-actions` | Below the event actions, separated from buttons | Responsive AdSense rectangle |
| `list-break` | After the first ten entries in the list | Responsive AdSense display |

Use one of the two event placements per visit initially. Keeping both available allows placement testing without filling the interface with ads. Avoid ads beside date controls or inside the agenda. Empty/unfilled slots should collapse; changing events must clean up old units instead of accidentally requesting duplicate ads.

## Public configuration needed

`public/ads-config.json` is a staging configuration for the future provider adapters. Entering IDs or changing `enabled` alone does **not** activate ads in the current implementation.

- **AdSense:** approved website/domain, publisher ID (`ca-pub-…`) and a separate display ad-slot ID for each position to use.
- **Ad Manager:** network code and rewarded ad-unit path (`/network-code/unit-name`), with eligible demand/line items configured in the account. A path alone does not guarantee ad availability.
- **Consent:** the selected Google-certified consent management platform and its configuration/integration for the domain. Event topics can support contextual placement; do not collect names, email addresses, phone numbers or precise location simply to serve ads.
- **Publisher files:** the exact provider-supplied `ads.txt` entries and privacy-policy URL. The provider account is where the owner supplies payee, identity, tax and payment details; do not put those details or passwords in this repository.

Before activation, implement the provider adapters, CMP integration, exact script/frame/connect domains required by those adapters in **both** the portable Worker and Vercel CSP, and an `/ads.txt` route/static asset. The current CSP deliberately permits no third-party ad scripts, so this preview cannot accidentally load ads.

## Rewarded calendar exports

Google requires rewards to be non-transferable and redeemable/usable within the publisher’s platform. An .ics file is used outside this website and can be shared, so its eligibility as a Google reward must be confirmed before implementing an export reward. Do not assume that an optional bulk-download offer automatically meets the policy. Start with event-page display ads and keep calendar exports available. A future rewarded feature could grant an eligible on-site feature or session entitlement, subject to the actual reward design and account requirements. Show the exact reward before opt-in and allow cancellation. Never require an ad click or replace an ordinary display ad with a custom countdown.

The Ad Manager adapter should:

1. Request a rewarded unit only after the consent integration permits the request; handle unsupported devices and no-fill.
2. Offer the voluntary reward once the SDK says the ad is ready.
3. Grant the eligible reward on `rewardedSlotGranted`, not on `rewardedSlotClosed`, a timer or an assumed video completion.
4. Deliver the promised reward once; handle navigation, failures and cancellation, then destroy the rewarded slot.
5. Keep public subscription feeds (`/calendar/tech.ics`) available to calendar clients, which cannot watch browser ads. A browser-only gate is not secure access control for a public endpoint. Any genuinely restricted premium export needs a separate server-authorized route and an appropriate verification design.

Frequency limits are a product decision; a reasonable starting point is one rewarded offer per session rather than an interruption on every event. This has not been enabled or represented as enforceable server-side access control.

## Official references

- [AdSense eligibility](https://support.google.com/adsense/answer/9724)
- [AdSense programme policies](https://support.google.com/adsense/answer/48182)
- [Google publisher policies](https://support.google.com/adsense/answer/10502938)
- [Rewarded-ad policies](https://support.google.com/adsense/answer/9121589)
- [Rewarded ads for web](https://support.google.com/admanager/answer/9116812)
- [Rewarded-slot SDK events](https://developers.google.com/publisher-tag/reference)
- [Certified consent-platform requirements](https://support.google.com/adsense/answer/13554116)

## This publisher's setup

- Calendar: `https://calendar.korvexa.dev`
- AdSense account: `pub-3654708143461818`
- Browser tag/client form: `ca-pub-3654708143461818`
- Privacy URL after deploying this update: `https://calendar.korvexa.dev/privacy`
- Calendar publisher declaration after deployment: `https://calendar.korvexa.dev/ads.txt`

The calendar HTML and privacy page contain Google's verification meta tag. The app does not load the AdSense SDK yet; the tag and publisher declaration can be used for ownership verification without requesting ads.

### Site and root-domain setup

In AdSense, open **Sites → +New site** and add `korvexa.dev` if it is not already listed. Standard subdomains such as `calendar.korvexa.dev` are not separate entries under Google's site-management rules. Complete the dashboard's ownership verification and review flow; a publisher ID alone does not establish approval.

Google starts publisher-declaration discovery at the root domain. Merge the lines in `docs/root-domain-ads.txt` into the root website's existing `ads.txt`, preserving any existing valid seller records. Publish it at `https://korvexa.dev/ads.txt`. Its `subdomain=calendar.korvexa.dev` declaration points Google's crawler to the calendar's own publisher declaration. This repository serves only the calendar; it cannot change the root website's deployment.

References: [site-management rules](https://support.google.com/adsense/answer/12170421), [adding a site](https://support.google.com/adsense/answer/12169212), [subdomain ads.txt discovery](https://support.google.com/adsense/answer/9785052).

### Display ad-slot IDs

Open **AdSense → Ads → By ad unit → Display ads**. Create responsive units named `calendar-event-inline`, `calendar-event-actions` and `calendar-list-break`, or only the placements you plan to use. Choose **Save and get code**. Copy the numeric value of `data-ad-slot` from each unit's code into the corresponding configuration field. Do not guess these IDs or reuse the publisher ID as a slot ID.

Reference: [create a display ad unit](https://support.google.com/adsense/answer/9274025).

### Rewarded ad-unit path

Use **Google Ad Manager**, which has its own account/network settings. In **Inventory → Ad units**, create an ad unit with a code such as `calendar_rewarded`, then open the unit and **Generate tags** to obtain its complete ad-unit path. The path includes the Ad Manager network code and any parent ad-unit codes; copy it exactly. You can find the network code under **Admin → Global settings**. It is separate from the AdSense publisher ID.

Configure eligible rewarded-web demand/line items using Google's current guide; creating an ad unit alone does not supply paying ads. SDK integration and reward eligibility still need to be completed before activating this feature. Google's documentation states that its built-in server-side reward verification is for apps and is unavailable for web, so a public-file reward cannot be described as a fraud-proof download gate.

References: [network code](https://support.google.com/admanager/answer/7674889), [generate tags](https://support.google.com/admanager/answer/177207), [rewarded web inventory](https://support.google.com/admanager/answer/9116812).

### Privacy and consent

The privacy page describes the present implementation: browser bookmarks, request metadata, external calendar links and disabled advertising. Korvexa's public business email, `hello@korvexa.com`, is used for enquiries. Confirm the operating/business details and production logging practices, and revise this policy when advertising or analytics is enabled.

In **AdSense → Privacy & messaging → European regulations**, create the appropriate consent message for the domain and supply the privacy-policy URL above. Google's consent message is available as a certified CMP option; its actual integration, applicable US-state choices and consent-revocation controls must be configured before live ads. Publishing a privacy page alone does not install a consent manager.

Reference: [create a European regulations message](https://support.google.com/adsense/answer/10960768).
