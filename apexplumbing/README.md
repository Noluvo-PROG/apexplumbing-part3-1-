# Apex Plumbing website — Part 3

## Student details

- Name: **Noluvo Mirriam Kupiso**
- Student number: **ST10498449**
- Module: **WEDE**
- Existing project: https://github.com/Noluvo-PROG/GitHub/tree/main/apexplumbing

## Part 3 update

This copy carries the Apex Plumbing site into Part 3. It contains the five pages from the brief: Home, About, Services, Enquiry and Contact. The writing is aimed at a local customer who may not know plumbing terms. It explains what details help, what the next step could be, and where the form's limits are.

The shared stylesheet adapts the layout for narrower screens and includes a mobile menu. The JavaScript adds service search, South African phone number checks, browser form validation and a feedback message. The contact form prepares an email draft; the visitor reviews it and chooses whether to send. The enquiry form is a front-end demonstration and does not transmit or save bookings. Contact includes a Google Maps embed and two example map links.

SEO elements include a page-specific title and description, language and viewport metadata, plus `robots.txt` and `sitemap.xml`. The decorative homepage artwork is made with CSS; no external photos or copied code snippets are included.

## Before submission or publishing

This folder is a prepared copy. The GitHub repository itself was not changed. Please add your student details and replace the example email, addresses, service locations and `example.com` sitemap domain with verified information. The business profile is illustrative; confirm all claims with the organisation. Enable a real form backend before accepting bookings. Also add screenshots of desktop, tablet and mobile layouts and include any lecturer feedback and resulting edits.

## Structure

- `index.html`, `about.html`, `services.html`, `enquiry.html`, `contact.html`
- `assets/css/styles.css` — common responsive styles
- `assets/js/site.js` — menu, search and form interactions
- `robots.txt`, `sitemap.xml` — update sitemap URLs after choosing a domain

## Change log — Part 3, 1 November 2026

- Replaced planning notes and invalid markup on the home page with customer-facing content and service links.
- Added accessible service search and responsive mobile navigation.
- Rebuilt the enquiry and contact forms with native validation and JavaScript feedback.
- Added a contact map, sample two-area links and search engine files.
- Clearly labelled unverified business and contact details as examples.

## Sources (Harvard style, IIE adapted)

- Google Search Central (n.d.) *SEO Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 1 November 2026).
- Google Search Central (n.d.) *Build and submit a sitemap*. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (Accessed: 1 November 2026).
- MDN Web Docs (n.d.) *Constraint validation*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation (Accessed: 1 November 2026).
- MDN Web Docs (n.d.) *Using media queries*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: 1 November 2026).
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 1 November 2026).

## Viewing the site

Open `index.html` in a browser. The Google Maps embed needs internet access. Update the links and example details before publishing. The forms are demonstrations only; they are not connected to a server.

## Final proposal

The editable final proposal is included in this folder. It gives the project rationale, audience, page scope, success measures, relative timeline, hosting estimate and Harvard-style sources. Replace the student placeholders and confirm the organisation's details before submission.

---

# Part 3 — Adding Functionality and SEO

This section records what Part 3 added, where each feature lives and how the
site is deployed. The earlier Part 3 notes above are kept for history.

## 1. Feature map

| Requirement | Where it is implemented |
|---|---|
| Complete mobile-first stylesheet, design tokens, responsive layout | `assets/styles.css` — see the section banner comments at the top of the file |
| Accordion | `services.html` FAQ + `initAccordion()` in `assets/js/site.js` |
| Tabs | `index.html` "At a glance" section + `initTabs()` |
| Modal call-back form | Shared footer markup + `initModal()` and `initCallbackForm()` |
| Gallery and lightbox | `about.html` gallery + `initGallery()` |
| Scroll reveal, count-up, smooth scroll | `initReveal()`, `initCountUp()`, `initSmoothScroll()` |
| Dynamic service listing, search, category filter, sort | `SERVICE_CATALOGUE` and `initServices()` |
| Mobile nav, sticky header, back-to-top, active link, year, lazy images | `initNavigation()`, `initStickyHeader()`, `initBackToTop()`, `initActiveNav()`, `initYear()`, `initLazyImages()` |
| Enquiry form, validation, estimate | `enquiry.html` + `initEnquiryForm()` and `renderEstimate()` |
| Contact form, validation, mailto draft | `contact.html` + `initContactForm()` and `buildMailto()` |
| Async submission with in-flight state | `FORM_ENDPOINT`, `postForm()` and `setBusy()` |
| On-page SEO, Open Graph, Twitter, canonical, JSON-LD | `<head>` of all five pages; keyword plan in `SEO-NOTES.md` |
| Technical SEO | `robots.txt`, `sitemap.xml`, `netlify.toml`, `_headers`, `404.html` |
| Accessibility | Skip link, visible `:focus-visible` outlines, ARIA states, focus trap, `prefers-reduced-motion` — all pages, `styles.css` and `site.js` |
| Google Maps embed | `contact.html` |
| YouTube embed | `about.html` |

## 2. Changelog — Part 3, 2 November 2026

- Created `assets/css/styles.css` with the full visual system for all five pages:
  deep blue, steel grey and warm amber palette, fluid type scale, cards, service
  grid, forms, alerts, accordion, tabs, modal, lightbox, gallery, sticky header
  and back-to-top.
- Created `assets/js/site.js` with the service catalogue, live search, category
  filter, sort, accessible tabs and accordion, focus-trapped modal, gallery
  lightbox, scroll reveal, count-up, smooth scrolling and mobile navigation.
- Rebuilt the enquiry form with fieldsets, native constraints, JavaScript
  validation, an indicative estimate and a simulated asynchronous submission.
- Rebuilt the contact form with a message-type select, subject, validation and a
  properly encoded `mailto:` draft.
- Added unique titles, meta descriptions, canonicals, Open Graph, Twitter cards
  and JSON-LD `Plumber` data to every page.
- Renamed all seven images to descriptive filenames under `assets/images/`, added
  dimensions, lazy loading and meaningful alt text.
- Replaced the `example.com` sitemap with the GitHub Pages base URL and added
  `robots.txt`, `netlify.toml`, `_headers` and a styled `404.html`.
- Added the Google Maps embed on the contact page and a plumbing maintenance
  video on the about page.
- Added `SEO-NOTES.md` with the keyword plan and on-page decisions.

## 3. Why vanilla JavaScript

The brief allows "jQuery or other possible JavaScript frameworks". This build
uses plain ES2015+ JavaScript with no library and no build step. That keeps the
download small, removes a third-party dependency from the security surface and
makes the code easier to mark line by line. Every feature is guarded, so the
single file can serve all five pages without errors on pages that lack a
particular component.

## 4. Off-page SEO plan

These are recommendations for the client; nothing here has been faked or
pre-published.

- **Google Business Profile:** claim the Johannesburg listing, use the real
  phone number and email, choose the closest service categories, add the
  verified address or service area, and post the same opening hours used in the
  JSON-LD.
- **Local citations:** keep the name, address and phone number identical on
  South African directories such as Brabys, Yellow Pages South Africa, Snupit
  and any Johannesburg chamber of commerce listing. Consistency matters more
  than volume.
- **Backlinks:** ask plumbing suppliers, local hardware stores and community
  organisations for relevant links. Sponsor a local sports team or community
  event and ask for a link from the sponsor page. Avoid paid link schemes.
- **Social profiles:** create Facebook, Instagram and LinkedIn profiles with the
  same business name, phone number and website URL. Link back to the site and
  publish job photos with permission.
- **Reviews:** ask satisfied customers for Google reviews after each job. Reply
  to every review, including complaints, in a calm and factual tone.
- **Content:** add short, useful articles about seasonal maintenance, warning
  signs of a blocked drain and how to isolate water in an emergency. Link each
  article to the relevant service page.

## 5. Deployment

### GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and the repository root.
4. The site is published at
   `https://noluvo-prog.github.io/GitHub/apexplumbing/`.
5. Keep the `apexplumbing/` folder name, because the canonical, Open Graph,
   Twitter, JSON-LD and sitemap URLs all use that base.

### Netlify

1. Create a new site from the repository, or drag the `apexplumbing` folder into
   the Netlify dashboard.
2. Set the publish directory to `apexplumbing` and leave the build command
   empty.
3. `netlify.toml` supplies the security headers and `_headers` repeats them for
   hosts that read that file.
4. Netlify serves `404.html` automatically for unknown paths.

### Changing the base URL or address

- Search the project for `https://noluvo-prog.github.io/GitHub/apexplumbing/`
  and replace it in every canonical, Open Graph, Twitter, JSON-LD, `robots.txt`
  and `sitemap.xml` entry.
- The map embed is centred on Johannesburg, not on a street address. Replace the
  `q=` value in `contact.html` once the client's exact address is confirmed.
- The opening hours in the JSON-LD and footer are illustrative. Confirm them
  with the client before publishing.
- The forms are front-end demonstrations. Connect `FORM_ENDPOINT` in
  `assets/js/site.js` to a real handler before accepting bookings.

## 6. Testing performed

- `node --check assets/js/site.js` passes.
- Every page was parsed and checked for exactly one `<h1>`, a `<title>`, a meta
  description, a canonical link and a JSON-LD block.
- Every `src` and `href` that points to a local file was checked against the
  files on disk.
- The form validation rules were exercised with valid and invalid samples for
  name, email, South African phone numbers, past dates and short messages.
- The layout was checked at 360px, 768px, 1024px and 1440px widths.


## 6a. Notes on earlier text in this README

Two statements in the earlier Part 3 notes are superseded by this build:

- The earlier note said the homepage artwork was made only with CSS and that no
  external photos were used. Part 3 now uses the seven supplied images under
  `assets/images/` and one embedded YouTube video on the about page.
- The earlier note asked for the `example.com` sitemap domain and example email
  to be replaced. Part 3 now uses the GitHub Pages base URL and
  `request@apexpds.com`. The street address, exact service area and opening
  hours still need confirmation from the client.
- The earlier note mentions a separate final proposal file and layout
  screenshots. Neither is part of this folder; add them before submission if
  the lecturer requires them.

## 7. References (Harvard style, IIE adapted)

- Google Search Central (n.d.) *SEO Starter Guide*. Available at:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  (Accessed: 2 November 2026).
- Google Search Central (n.d.) *Build and submit a sitemap*. Available at:
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
  (Accessed: 2 November 2026).
- MDN Web Docs (n.d.) *Constraint validation*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation
  (Accessed: 2 November 2026).
- MDN Web Docs (n.d.) *Intersection Observer API*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  (Accessed: 2 November 2026).
- MDN Web Docs (n.d.) *Using the Fetch API*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  (Accessed: 2 November 2026).
- MDN Web Docs (n.d.) *Using media queries*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
  (Accessed: 2 November 2026).
- Schema.org (n.d.) *Plumber*. Available at: https://schema.org/Plumber
  (Accessed: 2 November 2026).
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at:
  https://www.w3.org/TR/WCAG22/ (Accessed: 2 November 2026).
- KG Hub / Kingsgate Luxury Homes (n.d.) *Essential Plumbing Maintenance
  Checklist* [YouTube video]. Available at:
  https://www.youtube.com/watch?v=a5BwAxdb3Lk (Accessed: 2 November 2026).
- Google Maps (n.d.) *Johannesburg, Gauteng, South Africa* [map]. Available at:
  https://www.google.com/maps?q=Johannesburg,Gauteng,SouthAfrica
  (Accessed: 2 November 2026).

The seven photographs and illustrations were supplied with the student project
and are used for academic purposes only. Their original creators should be
credited before any commercial publication.
