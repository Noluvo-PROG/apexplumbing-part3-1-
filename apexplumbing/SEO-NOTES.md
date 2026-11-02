# SEO notes — Apex Plumbing & Drainage Solutions (Part 3)

This file records the keyword research and the on-page decisions behind the
five pages. The target local market is **Johannesburg, Gauteng, South Africa**:
homeowners, landlords, body corporates and small businesses looking for a
plumbing and drainage contractor.

## 1. Keyword plan

| Page | Primary keyword | Secondary keywords (4–6) | Search intent |
|---|---|---|---|
| `index.html` | plumber in Johannesburg | emergency plumber Johannesburg; blocked drains Johannesburg; leak repair Johannesburg; hot water repairs Johannesburg; plumbing contractor Gauteng; local plumber Gauteng | Commercial / transactional — the visitor wants a local plumber now |
| `about.html` | plumbing company in Johannesburg | plumbing contractor Johannesburg; Johannesburg plumbing company; established plumber Johannesburg; drainage company Johannesburg; plumbing team Gauteng | Informational / trust — the visitor checks who they are hiring |
| `services.html` | plumbing services in Johannesburg | blocked drain cleaning Johannesburg; geyser repair Johannesburg; leak detection Johannesburg; tap repair Johannesburg; drain camera inspection Gauteng; plumbing maintenance Johannesburg | Commercial investigation — the visitor compares service options and prices |
| `enquiry.html` | plumbing enquiry in Johannesburg | plumbing quote Johannesburg; call-out fee Johannesburg; emergency plumbing booking; plumber availability Gauteng; plumbing estimate Johannesburg | Transactional — the visitor is ready to describe a job |
| `contact.html` | contact a plumber in Johannesburg | plumber phone number Johannesburg; Apex Plumbing contact; plumbing complaint Johannesburg; plumbing quote request; Johannesburg drainage contractor | Navigational / transactional — the visitor wants a phone number or to send a message |

## 2. Title and meta description

Each page has one unique `<title>` (target 60 characters or fewer) and one
`<meta name="description">` (target 140–158 characters). Both contain the
page's primary keyword. The exact strings live in the `<head>` of each page.

| Page | Title | Title length | Description length |
|---|---|---|---|
| Home | Plumber in Johannesburg \| Apex Plumbing | 39 | 154 |
| About | About Apex Plumbing \| Plumbing Company in Johannesburg | 54 | 155 |
| Services | Plumbing Services in Johannesburg \| Apex Plumbing | 49 | 145 |
| Enquiry | Plumbing Enquiry in Johannesburg \| Apex Plumbing | 48 | 140 |
| Contact | Contact a Plumber in Johannesburg \| Apex Plumbing | 49 | 151 |

## 3. Heading structure

- One `<h1>` per page, containing the primary keyword.
- Sections use `<h2>`, and cards or sub-sections use `<h3>`. No level is skipped.
- The footer uses `<h2>` for column labels, which is valid after the main content.

## 4. Internal linking

- The main navigation links every page to every other page.
- Body links use descriptive anchor text, for example "see our drainage
  services", "compare plumbing services and indicative prices" and "contact the
  Johannesburg office". No "click here" links.
- Service cards link to `enquiry.html?service=<slug>`, and the enquiry form
  preselects that service.

## 5. Images

All seven supplied images were inspected and renamed to describe what they
actually show. They now live in `assets/images/`:

| File | What it shows |
|---|---|
| `plumber-working-on-pipes.jpg` | Plumber in a hard hat working on metal pipes |
| `brass-plumbing-fitting-in-hand.jpg` | Brass plumbing fitting held in a hand |
| `dripping-kitchen-tap.jpg` | Tap with a water droplet |
| `adjustable-wrench-illustration.png` | Illustration of an adjustable wrench |
| `cartoon-plumber-with-wrench.png` | Cartoon plumber holding a wrench |
| `plumber-workshop-illustration.png` | Illustration of a plumber at a workbench |
| `service-booking-form-screenshot.png` | Screenshot of a service booking form |

Every image has descriptive `alt` text, explicit `width` and `height`, and
`loading="lazy"` plus `decoding="async"`. The above-the-fold hero image is the
only exception: it loads eagerly and uses `fetchpriority="high"`.

## 6. Structured data

Every page carries the same JSON-LD `Plumber` block with the business name,
telephone, email, locality/region/country, `areaServed`,
`openingHoursSpecification` and `foundingDate` 2021. No street address or
postcode is invented. The opening hours are illustrative and should be
confirmed with the client.

## 7. Technical checks

- `robots.txt` allows all crawling and points to the absolute sitemap.
- `sitemap.xml` lists all five pages with absolute URLs, `lastmod`,
  `changefreq` and `priority`.
- Canonical, Open Graph and Twitter URLs all use the same base:
  `https://noluvo-prog.github.io/GitHub/apexplumbing/`.
- The stylesheet and script are local; the script is deferred. There are no
  render-blocking third-party assets.
- `netlify.toml` and `_headers` add CSP, `X-Content-Type-Options`,
  `X-Frame-Options` and `Referrer-Policy`. The CSP allows the Google Maps and
  YouTube frames.
