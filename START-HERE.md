# The House Beneath the Water — Vercel edition

This is still a hand-coded multi-page site. Vercel is the host and the place where small server-side features can live; it is **not** a React/Next.js rebuild.

## The three places you actually need to know

- `public/assets/js/edit-me.js` — everyday text edits.
- `public/` — the actual website. Every existing HTML room still lives here.
- `api/` — server-side Vercel functions. `api/house-state.js` is the first one.

## Deploy

1. Put this project in a GitHub repository (recommended) or import the project into Vercel another way.
2. In Vercel, import the repository as a new project.
3. Vercel will read `vercel.json`, run `npm run build`, and publish `public/`.
4. The build installs p5 from npm and copies it to `/assets/vendor/p5.min.js`, so the deployed animations do not normally depend on an outside CDN.

No environment variables or database are required for this version.

## What changed from Neocities

- Existing pages and URLs are preserved.
- p5.js is installed at build time and served from your own site.
- `/api/house-state` supplies a small shared server-time state for the house.
- `site.js` keeps a browser-local memory of visits, discovered rooms, last visit, and treasures.

The browser memory is intentionally local for now. A future database layer can make guestbook entries or opted-in visitor state persist across devices.

## Ordinary updates

For normal writing changes, edit only:

`public/assets/js/edit-me.js`

The giant comment near the middle tells you when to stop scrolling.

## Important distinction

The API's `houseTide` is a fictional site-state cycle. It is not astronomical or real ocean tide data.
