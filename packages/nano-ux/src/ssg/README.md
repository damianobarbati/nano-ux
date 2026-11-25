# Static site generation with nano-ux

Generate static HTML from React pages. Folders define URLs. The browser hydrates each page and handles internal navigation.

## Quick start

Start with an ESM project that uses Vite 8, React 19, React DOM 19, and `@vitejs/plugin-react`. Install the plugin as a development dependency.

```sh
npm install nano-ux
```

Add the plugin to `vite.config.ts`.

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ssg } from 'nano-ux/ssg';

export default defineConfig({ root: 'src', build: { outDir: '../dist' }, plugins: [react(), ssg()] });
```

Create `src/views/docs/Setup.page.tsx`.

```tsx
export const Page = () => (
  <main>
    <h1>Setup</h1>
  </main>
);

export const route = { metadata: { title: 'Setup' } };
```

Run `npx vite` and open `/docs/setup`. Run `npx vite build` to generate `dist/docs/setup.html`. The plugin supplies the HTML template and browser entry.

## How routing works

The plugin discovers `*.page.tsx` files inside `views/` under the Vite root. In the quick start, the Vite root is `src/`. Each folder adds a URL segment. Names use kebab case in URLs. Use folders for nesting. Dotted page names such as `Docs.Setup.page.tsx` cause an error.

| File under `src/views/` | URL           | File under `dist/` |
| ----------------------- | ------------- | ------------------ |
| `Home.page.tsx`         | `/`           | `index.html`       |
| `SignIn.page.tsx`       | `/sign-in`    | `sign-in.html`     |
| `docs/Home.page.tsx`    | `/docs`       | `docs.html`        |
| `docs/Setup.page.tsx`   | `/docs/setup` | `docs/setup.html`  |
| `NotFound.page.tsx`     | Unmatched URL | `404.html`         |

Every page exports `Page`. The optional `route` export controls metadata, URLs, and rendering. Import `PageProps`, `PageRoute`, and navigation helpers from `virtual:ssg/router`. If your app has a separate TypeScript project for browser code, add `nano-ux/ssg/types` to its `compilerOptions.types`.

## One page with several URLs

Use `entries[].path` when your content already has final URLs. Each entry can supply its own metadata and parameters.

```tsx
import type { PageProps, PageRoute } from 'virtual:ssg/router';

export const route = {
  entries: [
    { path: '/guides/install', metadata: { title: 'Install' } },
    { path: '/reference/config', metadata: { title: 'Configuration' } },
  ],
} satisfies PageRoute;

export const Page = ({ metadata = {} }: PageProps) => (
  <main>
    <h1>{metadata.title}</h1>
  </main>
);
```

Use `pattern` and `entries[].params` when your content has slugs. This example generates `/docs` and `/docs/setup`. A trailing `?` marks an optional parameter.

```ts
import type { PageRoute } from 'virtual:ssg/router';

export const route = {
  pattern: '/docs/:slug?',
  entries: [{ params: {} }, { params: { slug: 'setup' } }],
} satisfies PageRoute;
```

## Project files

```text
vite.config.ts
ssg.config.ts         Optional site and runtime settings
src/                  Vite root in the quick start
  views/              Page components
  index.tsx           Optional shared layout
  index.html          Optional HTML template
  content/excerpts.ts Optional custom excerpt function
```

Export the layout as the default component from `index.tsx`. It receives `children` and the current `pathname`. A named `Layout` export also works. The default export takes precedence.

To customize the HTML, place `<!--route-metadata-->` in the head and `<!--route-ssg-->` inside `#root`, each exactly once. Link global styles in the head. Include `<script type="module">import 'virtual:ssg/client';</script>` for hydration. Omit the script for a static-only site.

## Navigation and rendering

Use `Link` and `NavLink` with an `href`. An exact pathname match gives `NavLink` the attribute `aria-current="page"`. Use `navigate(href)` in event handlers, `Redirect` for a component redirect, and `usePathname()` or `useSearch()` to read the current URL. The page receives `pathname`, `params`, and `metadata`. Use `routeFor(pathname)` for a lookup and `virtual:ssg/routes` for the full route table.

Set `route.render` to `'shell'` for a page that renders in the browser. A custom browser entry can hydrate with `<Router ssrPath={window.location.pathname} />` or mount an empty shell with `<Router />`. Advanced integrations can supply custom routes or rendering in `entry-server.tsx` beside the Vite config.

## Configuration

Place `ssg.config.ts` beside `vite.config.ts`, or in the Vite root when there is no Vite config file. Options passed to `ssg()` override the matching top-level settings.

```ts
import type { SsgOptions } from 'nano-ux/ssg';

export default {
  site: { name: 'Example', url: 'https://example.com' },
  publicEnv: ['PUBLIC_API_URL'],
} satisfies SsgOptions;
```

- `site` supplies metadata defaults and enables sitemap generation. Page metadata overrides site defaults. Entry metadata overrides page metadata.
- `publicEnv` lists environment variables that anyone can read as JSON at `/env` in development and preview. Each listed variable must have a value. Production hosting must provide the endpoint if your app uses it. The previous option name `env` remains supported.
- `locales: ['en', 'it']` expands inferred routes and patterns for each language. An explicit localized entry must include both the prefixed path and its locale. Give translations the same `metadata.contentId` for alternate links. Set `route.locales: false` to keep a page unprefixed.
- `redirects` accepts entries such as `{ from: '/old', to: '/new', status: 301 }`. Development and preview serve these redirects. The build records them in `routes.json` for your production server.
- `route.metadata.llms.content: true` includes a prerendered page in `llms-index.json`. The default excerpt uses the first main element or the rendered body. Set `excerpts: '/content/excerpts.ts'` to load a named `excerpts({ route, html })` export relative to the Vite root. It returns an array of `{ title, href, text }` records. A callback in the config also works.

## Optional Vite preset

To use the shared preset, put `export { default } from 'nano-ux/ssg/config';` in `vite.config.ts`. It sets the Vite root to `src`, writes to `dist`, loads environment files from the workspace root, and serves on port 3000 on all interfaces with all hostnames allowed. It enables React Compiler, Tailwind CSS, Brotli compression, and a bundle report at `.report/bundle.html` in the workspace root.

The preset requires `@vitejs/plugin-react`, `@rolldown/plugin-babel`, `@babel/core`, `babel-plugin-react-compiler`, `@tailwindcss/vite`, `vite-plugin-compression2`, and `rollup-plugin-visualizer`.
