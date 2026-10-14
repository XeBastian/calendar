# Tech Calendar design direction

Preserve the calendar as the site's central experience. Mitengo is a reference for clarity, deliberate spacing and polished execution, rather than a template for the layout or content.

The original week/month/list structure, date picker, charcoal topic sidebar, pastel event colors, DM Sans and Korvexa assets remain recognizable. The calendar appears immediately on the homepage. There is no photographic hero, promotional story section or card catalogue replacing it.

Website refinements are limited to a clear top navigation, a compact footer, normal document scrolling and responsive controls. Mobile has a simple navigation menu, a compact week/month picker and readable events for the selected date. It has no fixed application bottom bar or squeezed desktop calendar.

The desktop week previews up to three events per day. Selecting a date or its “more” link reveals all that day's matching events below the calendar. This keeps the main week readable without separate scrolling columns. Search, filters, saved events, funding and calendar feeds retain their existing behavior and URLs.

The existing palette is kept for calendar categories. Corner radii, spacing, control sizes and focus states are calibrated consistently. Light/dark appearance uses semantic tokens. Reduced motion is respected.

Design settings: DESIGN_VARIANCE 3 to preserve the existing composition; MOTION_INTENSITY 3 for clear interaction feedback; VISUAL_DENSITY 5 for an informative calendar. Native CSS and the existing dependency-free JavaScript stack are retained.
