# Project overview

## Purpose

Soumya Editorial Portfolio is a personal portfolio microsite designed to feel closer to an editorial poster than a conventional developer template. Its visual language combines a near-black canvas, warm paper tones, pink portrait accents, technical labels, and deliberate motion.

## User experience

The landing section begins with a short poster-like intro. The curtains then open to reveal the portfolio identity, animated portrait, navigation, and a skip link for visitors who prefer immediate access to the content. The about section continues the paper/editorial treatment and introduces Soumya's learning interests.

The page is currently a focused portfolio foundation rather than a CMS-backed site. The existing navigation includes `WORK`, `ABOUT`, `JOURNEY`, and `CONTACT` anchors; the current page content is primarily the intro and about experience, with the visual skills envelope component at the end of the page.

## Motion and accessibility

Motion is implemented with GSAP and the Canvas API. The page also checks the user's `prefers-reduced-motion` preference before starting the larger scroll-based animation sequence. Interactive labels can be triggered with hover or keyboard focus, and the portrait canvas has accessible labels.

## Important implementation detail

`PORTRAIT_SRC` in `client/src/pages/Home.tsx` is currently empty. When it is empty, the site renders an abstract fallback portrait with the text `replace with portrait`. This is intentional and makes the repository safe to publish without bundling a personal image that has not been supplied.

## Build model

Vite uses `client/` as its root and writes the browser build to `dist/public`. The Express server in `server/index.ts` serves that directory in production and falls back to `index.html` for client-side routes. `dist/` is generated output and should not be committed.
