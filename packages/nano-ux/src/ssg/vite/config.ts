import { resolve } from "node:path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { compression } from "vite-plugin-compression2";
import { formatHtml } from "./formatHtml.ts";
import { ssg } from "./plugin.ts";

const workspaceRoot = searchForWorkspaceRoot(process.cwd());

export default defineConfig({
	root: "./src",
	envDir: workspaceRoot,
	build: { outDir: "../dist", emptyOutDir: true },
	server: { host: true, allowedHosts: true, port: 3000, strictPort: true },
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
		ssg(),
		formatHtml(),
		compression({ algorithms: ["br"] }),
		visualizer({
			filename: resolve(workspaceRoot, ".report/bundle.html"),
			brotliSize: true,
			open: false,
		}),
	],
});
