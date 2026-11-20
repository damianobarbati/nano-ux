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
		publicDir: "../dist",
		plugins,
		server: { host: true, allowedHosts: true },
		build: { rolldownOptions: { output: { strictExecutionOrder: true } } },
	};
});
