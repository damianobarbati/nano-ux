# nano-ux

**Write less. Ship more.**

`nano-ux` is an opinionated UI kit built with React and Tailwind CSS.
Set your theme once with CSS variables, then use it across HTML elements and React components.

See live demo [here](https://damianobarbati.github.io/nano-ux/).

## Usage

Install:

```sh
npm install nano-ux react react-dom react-hook-form swr
```

Configure:

```css
@import "nano-ux/theme.css";

:root {
    --color-brand: var(--theme-lime);
    --font-family: Georgia, serif;
}
```

Use:

```tsx
import { createRoot } from "react-dom/client";
import { Button } from "nano-ux";

const App = () => <Button>Save</Button>;

createRoot(document.getElementById("root")).render(<App/>);
```

## Development

```sh
fnm install --use
npm install -g corepack
corepack enable
pnpm install
pnpm run stop
pnpm run dev
pnpm run demo
```

Storybook at <http://localhost:9000>.  
Demo at <http://localhost:9001>.

## Preview

```sh
pnpm build
pnpm preview
```

Preview at <http://localhost:9001/nano-ux/>.

## Release

```sh
pnpm build
pnpm release --dry-run
# Increment the patch version in packages/nano-ux/package.json.
pnpm release
```