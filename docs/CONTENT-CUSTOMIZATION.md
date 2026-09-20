# Content customization guide

## Edit the introduction

Open `client/src/pages/Home.tsx` and locate the `hero-underlay` section. The name, role, and short description are rendered there:

- `SOUMYA / GHOSH` is the main heading.
- `Computer Science Engineering Student` is the role line.
- The following paragraph is the hero description.

The poster copy appears a few lines above the hero underlay and includes `HELLO`, `NAMASTE`, and `HALLO`.

## Edit the about section

The about copy starts in the `about-grid` section. Update the lead paragraph and the following paragraphs to reflect the current biography, interests, and goals. Keep the copy concise so the editorial layout remains balanced on smaller screens.

## Edit the learning list

The current list is defined near the top of `Home.tsx`:

```ts
const learningList = [
  "DSA",
  "WEB DEVELOPMENT",
  "AI + APIS",
  "BACKEND",
  "UI/UX",
  "CREATIVE TECHNOLOGY",
];
```

Replace or reorder these strings as the learning focus changes. The list automatically numbers each item.

## Add a portrait

The `PixelPortrait` component can use an image source when `PORTRAIT_SRC` is non-empty. Recommended workflow:

1. Add a licensed image to `client/public/`.
2. Set `PORTRAIT_SRC` to its public path, such as `/portrait.jpg`.
3. Keep the source portrait appropriately cropped for the tall portrait frame.
4. Run `pnpm check` and `pnpm build`.
5. Test the animation on both desktop and mobile widths.

Do not commit private or unlicensed images.

## Update navigation

The visible navigation is generated from `navItems` in `Home.tsx`. Each item links to a page anchor based on its lowercase name, except `ABOUT`, which explicitly links to `#about`. If you add a new navigation item, also add a section with the matching `id`.

## Update visual styling

Global colors, type, spacing, paper textures, responsive breakpoints, and motion-related CSS classes live in `client/src/index.css`. Prefer editing the existing design tokens and named component classes rather than adding one-off inline styles.

## Verify changes

After content or design changes:

```bash
pnpm check
pnpm build
```

Then use `pnpm dev` and test the intro skip link, keyboard focus states, anchor navigation, reduced-motion behavior, and narrow-screen layout.
