CYCLONITE TECH — WEBSITE HANDOVER
20 October 2026

PUBLICATION STATUS
The website is built and tested locally. It has NOT been published: this session's approval policy blocked the Sites source-upload helper. No public URL or successful production deployment is claimed.
The reserved Sites origin in site-config.json is https://cyclonite-tech-manjung.blush-luck-8644.chatgpt.site. It is not live. Replace it with your actual workers.dev address before deploying to your Cloudflare account.
The transferable package includes a ready-built dist folder and a wrangler.jsonc configuration for your own Cloudflare Worker.

WHAT IS INCLUDED
26 indexable pages: English and Malay versions of home, about, services, six individual service pages, portfolio, contact, Manjung/Perak, and privacy. Custom 404 pages are included for both languages.
Original company logo and all 50 unique photographs from the supplied Drive collection, plus one PDF training image; illustrative underwater background; responsive layouts; large body text; reduced-motion support; mobile menu; filtered portfolio with keyboard-accessible photo viewer; WhatsApp enquiry drafting; telephone, email and directions links; capability PDF download.
Per-page titles, descriptions and canonical URLs; Open Graph metadata; crawlable HTML; LocalBusiness, WebSite, WebPage, BreadcrumbList and Service JSON-LD; sitemap.xml and robots.txt; responsive WebP images.
The enquiry form opens a WhatsApp draft. A visitor must press Send in WhatsApp. It does not save leads to a database or send email automatically.

DEPLOY TO YOUR CLOUDFLARE WORKER
1. Extract Cyclonite-Website-Source.zip into a new directory.
2. Use your Cloudflare account to choose your Worker name and workers.dev subdomain. Change the name in wrangler.jsonc if desired.
3. In site-config.json set origin to the exact HTTPS workers.dev address, without a trailing slash. Keep google_site_verification empty until you receive your real token.
4. Run: python build.py
   This updates every canonical URL, structured-data URL, share URL, sitemap and robots sitemap reference. Python 3 is required only for this build; the deployed website has no Python runtime dependency.
5. With Node.js installed, authenticate using the official Wrangler CLI:
   npx wrangler login
6. Publish from the extracted project directory:
   npx wrangler deploy
   Wrangler uses the dist folder configured in wrangler.jsonc. No database, paid API key or application backend is required. Your Cloudflare plan's limits still apply.
7. Confirm the homepage, a service page, /sitemap.xml and /robots.txt load publicly. A made-up URL must return HTTP 404, not the homepage with HTTP 200.
8. Use one primary public origin. Keep the URLs in Search Console aligned with your selected primary host. The reserved Sites origin is not a second live publication.

GOOGLE SEARCH CONSOLE
Search Console is not yet connected. Account ownership verification cannot be completed without your Google account and actual verification token.
1. Sign in at https://search.google.com/search-console/ using the account that should own the property.
2. Add a URL-prefix property for the exact public origin, including https://. Use your workers.dev origin after deployment, not the unpublished reserved Sites origin. A URL-prefix property is appropriate for a hosted subdomain you do not own at the parent-domain DNS level.
3. Select HTML tag verification. Copy only the content value from Google's google-site-verification tag into site-config.json > google_site_verification.
4. Run python build.py and redeploy. Confirm the tag is present in the homepage's HTML source, then choose Verify in Search Console.
   Alternatively, if Google offers an HTML file, place that exact unmodified file in dist and redeploy before verifying.
5. In Sitemaps submit sitemap.xml on your live Worker origin.
6. Use URL Inspection > Test Live URL on the home page and key service pages. Request indexing after verification. Review indexing and performance as Google collects data.
7. When you later use a custom domain, update origin and rebuild/redeploy. Add/verify the new property and submit its sitemap; arrange host redirects for the migration.
Verification, sitemap acceptance and public access do not guarantee indexing or rankings. Search Console needs real Google data before it can report performance.

LOCAL SEO AND ANSWER DISCOVERY
Read local-search-research.txt for verified competitor sources, English/Malay keyword clusters, page mapping and a 90-day plan. Priority topics implemented include underwater contractor Manjung, commercial diving Perak, underwater inspection Lumut, marine salvage Perak and marine electronics repair Manjung.
The site's nearby-area language reflects one Seri Manjung office. It does not invent separate offices or claim permanent availability elsewhere.
Next business-owned steps: verify and maintain a legitimate Google Business Profile, keep name/address/phone consistent, request honest customer reviews, and add approved project case studies with real scope and outcomes. Only claim credentials or approvals supported by current records.
Visible question-and-answer content helps visitors and gives search systems clear answers. There is no special markup that guarantees AI recommendations or a higher rank. This build does not claim FAQ rich-result eligibility.

EDITING THE WEBSITE
build.py contains page content, navigation, structured data and the gallery list.
dist/assets/site.css and refinements.css contain the design and fluid responsive typography.
localize_site.py and ms-translations.txt generate Malay pages and reciprocal language links.
extra-gallery.json and photo-inventory.json map the additional photos to the complete gallery.
The hero is an AI-enhanced composition; original documentary photos remain in the gallery.
dist/assets/site.js contains menu, gallery, animation and enquiry behaviour.
site-config.json contains the primary origin and optional Search Console token.
assets-source contains original selected assets; dist/assets contains the ready-to-serve WebP sizes. Preserve dist/assets when rebuilding: build.py generates HTML and search files, not the image conversions or stylesheet.
dist/downloads contains the company PDFs.
The source package deliberately excludes hosting credentials and Sites repository metadata.

REFERENCE DOCUMENTATION
Cloudflare static assets: https://developers.cloudflare.com/workers/static-assets/
Cloudflare routing: https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/
Search Console ownership: https://support.google.com/webmasters/answer/9008080
Google sitemap guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
Google local visibility: https://support.google.com/business/answer/7091

Revision 3: portfolio-groups.json controls the eight activity groups; generated showcase and background images are documented in AI-ASSET-NOTES.txt. The contact page includes an embedded Google Map.
