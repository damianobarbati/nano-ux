import { fileURLToPath } from "node:url";
import type { Plugin, ViteDevServer } from "vite";
import type { Route, Site } from "../routing/routes.ts";
import type { RuntimeOptions } from "../server/runtime.ts";

const routesId = "virtual:ssg/routes";
export const entryId = "virtual:ssg/entry";

type RoutePluginOptions = {
	site?: Site;
	redirects?: RuntimeOptions["redirects"];
	timestamp: string;
	locales: string[];
	renderer?: () => ViteDevServer;
};

export const virtualRoutes = (getOptions: () => RoutePluginOptions): Plugin => {
	const compiled = import.meta.url.endsWith(".js");
	const extension = compiled ? "js" : "ts";
	const jsxExtension = compiled ? "js" : "tsx";
	let snapshot: string;

	const result: Plugin = {
		name: "ssg:routes",
		async hotUpdate({ type, modules, file, server }) {
			if (this.environment.name !== "client" || type !== "update" || !snapshot)
				return;

			const table = server.environments.client.moduleGraph.getModuleById(
				`\0${routesId}`,
			);

			if (
				!table ||
				!server.environments.ssr.moduleGraph.getModulesByFile(file)?.size
			)
				return;

			const { routes } = (await server.ssrLoadModule(routesId)) as {
				routes: Route[];
			};

			if (JSON.stringify(routes) === snapshot) return;

			return [...modules, table];
		},
		resolveId(id) {
			if (id === "virtual:ssg/client")
				return fileURLToPath(
					new URL(`../client.${jsxExtension}`, import.meta.url),
				);

			if (id === "virtual:ssg/router")
				return fileURLToPath(
					new URL(`../router/index.${extension}`, import.meta.url),
				);

			if (id === "virtual:ssg/layout") return "\0virtual:ssg/layout";

			if (id === entryId)
				return fileURLToPath(
					new URL(`../server/render.${extension}`, import.meta.url),
				);

			if (id === routesId) return `\0${id}`;
		},
		async load(id) {
			if (id === "\0virtual:ssg/layout") {
				const result = `
          const modules = import.meta.glob('/index.tsx', { eager: true });
          const entry = modules['/index.tsx'];
          export const Layout = entry && (entry.default ?? entry.Layout);
          if (entry && !Layout) throw new Error('Expected a default export or a named Layout export in /index.tsx.');
        `;

				return result;
			}

			if (id === `\0${routesId}`) {
				const { locales, renderer, site, timestamp, redirects } = getOptions();

				const helper = fileURLToPath(
					new URL(`../routing/routes.${extension}`, import.meta.url),
				);

				let table: string;

				if (this.environment.name === "client" && renderer) {
					const server = renderer();

					const { routes } = (await server.ssrLoadModule(routesId)) as {
						routes: Route[];
					};

					const module = server.environments.ssr.moduleGraph.getModuleById(
						`\0${routesId}`,
					);

					for (const dependency of module?.importedModules ?? []) {
						if (dependency.file) this.addWatchFile(dependency.file);
					}

					snapshot = JSON.stringify(routes);

					table = `
            const previous = window.__getReactRefreshIgnoredExports;
            window.__getReactRefreshIgnoredExports = (context) => {
              const ignored = previous?.(context) ?? [];
              return context.id.endsWith('.page.tsx') ? [...ignored, 'route'] : ignored;
            };
            export const routes = ${snapshot};
          `;
				} else {
					table = `
          const modules = import.meta.glob('/views/**/*.page.tsx', { eager: true });
          const options = Object.fromEntries(Object.entries(modules).map(([path, module]) => [path, module.route]));
          const discovered = discoverRoutes({ pages: Object.keys(pages), options, locales, site, timestamp: ${JSON.stringify(timestamp)} });
          export const routes = finalizeRoutes({routes: discovered, locales, redirects: ${JSON.stringify(redirects ?? [])}});
        `;
				}

				const result = `
        import { discoverRoutes, finalizeRoutes, findRoute } from ${JSON.stringify(`/@fs/${helper}`)};
        export const pages = import.meta.glob('/views/**/*.page.tsx');
        const locales = ${JSON.stringify(locales)};
        export const site = ${JSON.stringify(site)};
        ${table}
        export const routeFor = (pathname) => findRoute({ pathname, routes, locales });
      `;

				return result;
			}
		},
	};

	return result;
};
