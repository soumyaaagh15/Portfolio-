# Soumya — Editorial Portfolio

A dark, editorial-style personal portfolio for Soumya Ghosh, a Computer Science Engineering student. The site presents an animated introduction, a pixel-based portrait treatment, an about section, and a visual list of current learning areas.

## Highlights

- Editorial poster-style opening sequence with a skip-intro option.
- Responsive single-page layout with anchor navigation.
- Canvas-rendered pixel portrait animation with a replaceable image source.
- GSAP entrance and scroll-triggered motion.
- Hover/focus text-scramble interactions.
- Dark theme with accessible labels and reduced-motion handling.
- React, TypeScript, Vite, Tailwind CSS, and Express production server.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 and custom CSS |
| Animation | GSAP + ScrollTrigger |
| Routing | Wouter |
| Components | Radix UI primitives and custom components |
| Production server | Express |
| Package manager | pnpm |

## Getting started

### Requirements

- Node.js 20 or newer
- pnpm 10 or newer

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Vite will print the local URL in the terminal. The default port is `3000`, but Vite can select another available port.

### Type-check the project

```bash
pnpm check
```

### Create a production build

```bash
pnpm build
```

The client bundle is generated in `dist/public`, and the Express server bundle is generated as `dist/index.js`. Build output is intentionally ignored by Git.

### Run the production server

```bash
pnpm start
```

The server uses `PORT=3000` by default. To use another port:

```bash
PORT=8080 pnpm start
```

## Project structure

```text
.
├── client/
│   ├── index.html              # HTML entry point and page title
│   ├── public/                 # Static public assets
│   └── src/
│       ├── components/         # Shared UI and portfolio components
│       ├── contexts/           # Theme context
│       ├── hooks/              # Reusable React hooks
│       ├── lib/                # Small utilities
│       ├── pages/              # Home and fallback pages
│       ├── App.tsx             # App shell and routes
│       ├── index.css           # Global styles and design tokens
│       └── main.tsx            # React bootstrap
├── docs/
│   ├── CONTENT-CUSTOMIZATION.md
│   └── PROJECT-OVERVIEW.md
├── server/index.ts             # Express static server
├── shared/                     # Shared constants
├── package.json                # Scripts and dependencies
├── pnpm-lock.yaml              # Locked dependency versions
└── vite.config.ts              # Vite, aliases, and build configuration
```

## Customization

The main portfolio content is in [`client/src/pages/Home.tsx`](client/src/pages/Home.tsx). The visual system and responsive rules are in [`client/src/index.css`](client/src/index.css). See [`docs/CONTENT-CUSTOMIZATION.md`](docs/CONTENT-CUSTOMIZATION.md) for a focused editing guide.

The portrait currently uses an intentional abstract fallback. To replace it with a real portrait, update `PORTRAIT_SRC` in `Home.tsx` to a hosted or imported image URL and confirm that the image is licensed for use.

## Notes for GitHub Pages

This repository includes an Express production server, so it is best suited to platforms that can run Node.js, such as Render, Railway, Fly.io, or a VPS. GitHub Pages can host the Vite client as a static site, but the Express server is not used there; configure the deployment to publish `dist/public` after running `pnpm build`.

## License

This project is released under the MIT License. See [`LICENSE`](LICENSE).

## Credits

Built with curiosity by Soumya Ghosh.
