import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";

import { prerenderDemo } from "./prerender.ts";

export default defineConfig(async ({ command, mode }) => {
	const plugins: PluginOption[] = [tailwindcss(), prerenderDemo()];

	if (command === "build" && mode === "analyze") {
		const { visualizer } = await import("rollup-plugin-visualizer");

		plugins.push(
			visualizer({
				emitFile: true,
				filename: "bundle-report.html",
				title: "nano-ux demo bundle",
				template: "treemap",
				gzipSize: true,
			}),
		);
	}

	return {
		base: "/nano-ux/",
		plugins,
		server: { host: true, allowedHosts: true },
		build: {
			rolldownOptions: {
				input: {
					index: fileURLToPath(new URL("./index.html", import.meta.url)),
					themePreview: fileURLToPath(
						new URL("./theme-preview.html", import.meta.url),
					),
				},
				output: { strictExecutionOrder: true },
			},
		},
	};
});
