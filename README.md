# nano-ux

**Write less. Ship more.**

`nano-ux` is an opinionated UI kit built with React and Tailwind CSS.
Set your theme once with CSS variables, then use it across HTML elements and React components.

See live demo [here](https://damianobarbati.github.io/nano-ux/).

## Usage

Install:

```sh
npm add nano-ux
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
npm i
npm run stop
npm run dev
npm run demo
```

Storybook at <http://localhost:9000>.  
Demo at <http://localhost:9001>.

## Preview

```sh
npm run build
npm run build:demo
npm run build:storybook -- --output-dir demo/dist/storybook-static
npx -y vite preview ./demo --base /nano-ux/ --host 127.0.0.1 --port 9001
```

Preview at <http://localhost:9001>.

## Release

```sh
npm run build
npm publish --dry-run
npm version patch
npm publish
```