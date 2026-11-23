# Suyash Pradhan — clay portfolio

A responsive, single-page portfolio built as a small interactive claymation playground. The project uses React, TypeScript, Next.js-compatible Vinext, lightweight CSS motion, and procedural Web Audio.

## Run it locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Run the complete lint, type, and production-build check with `npm test`.

## Project data

All homepage projects live in `app/projects.ts`. Each project has this shape:

```ts
{
  slug,
  title,
  eyebrow,
  description,
  tags,
  image,
  imageSmall,
  alt,
  accent,
  ink,
}
```

The desktop project playground and mobile project chapters are both generated from this one array.

### Add a project

1. Add optimized images to `public/clay`.
2. Add one entry to the `projects` array in `app/projects.ts`.
3. Keep the image at a 4:3 aspect ratio for the best scene composition.
4. Write concise alt text that describes what is visible in the image.

### Replace an image

Replace the full-size and `-720` versions in `public/clay`, or update that project’s `image` and `imageSmall` values. The original supplied PNGs remain untouched in `assets`.

## Theme

Theme colors, dark-studio colors, shadows, type stacks, motion speeds, and the shared spring easing are CSS variables at the top of `app/globals.css`.

The theme initializer in `app/layout.tsx`:

- uses a saved `suyash-theme` preference when present;
- otherwise respects `prefers-color-scheme`;
- applies the theme before the page paints to avoid a flash;
- stores later toggle changes in `localStorage`.

## Sound

Sound is always off when the page loads. `app/Portfolio.tsx` creates short, quiet oscillator tones with the Web Audio API only after the visitor enables sound. No audio files are loaded and no sound autoplays.

The `toneConfig` object controls frequency, duration, and volume for button presses, toggles, and project changes.

## Animation settings

Motion tokens live near the top of `app/globals.css`:

- `--fast` for presses and hover feedback;
- `--normal` for state changes;
- `--large` for scene movement;
- `--spring` and `--ease` for the shared physical motion language.

The project index is driven by native scroll in `app/Portfolio.tsx`. Mobile switches to normal vertical chapters at `820px`, avoiding pinned horizontal interactions on touch devices. The `prefers-reduced-motion` rules at the end of `app/globals.css` remove smooth scrolling, parallax, and nonessential animation.

## Content and contact links

Homepage copy lives in `app/Portfolio.tsx`; project copy lives in `app/projects.ts`. Contact links are intentionally omitted until verified URLs or an email address are available, so the production page does not ship guessed personal information.
