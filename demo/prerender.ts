import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin, type ResolvedConfig } from "vite";

export const prerenderDemo = (): Plugin => {
	let config: ResolvedConfig;
	return {
		name: "prerender-demo",
		apply: "build",
		configResolved(resolved) {
			config = resolved;
		},
		async transformIndexHtml(html) {
			const root = config.root;
			const outDir = await mkdtemp(join(root, ".prerender-"));

			try {
				await build({
					root,
					base: config.base,
					mode: config.mode,
					configFile: false,
					publicDir: false,
					build: { ssr: join(root, "render.tsx"), outDir },
				});

				const { render } = await import(
					pathToFileURL(join(outDir, "render.js")).href
				);

				const markup = await render();
				return html.replace("<!--app-html-->", () => markup);
			} finally {
				await rm(outDir, { recursive: true, force: true });
			}
		},
	};
};
