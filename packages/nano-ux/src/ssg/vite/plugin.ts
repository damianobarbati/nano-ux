import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import type { ComponentType, ReactNode } from "react";

import {
	type Connect,
	createServer,
	loadConfigFromFile,
	loadEnv,
	normalizePath,
	type Plugin,
	type PluginOption,
	type ResolvedConfig,
	type ViteDevServer,
} from "vite";

import {
	finalizeRoutes,
	findRoute,
	type Route,
	routeFile,
	validateLocales,
} from "../routing/routes.ts";

import { defaultExcerpts } from "../server/excerpts.ts";
import type { Excerpt, Rendered, Site } from "../server/files.ts";
import { enrichRobots, readRobots } from "../server/robots.ts";

import {
	type RuntimeOptions,
	runtimeMiddleware,
	withinBase,
} from "../server/runtime.ts";

import { entryId, virtualRoutes } from "./virtualRoutes.ts";

type Awaitable<T> = T | Promise<T>;

type Entry = {
	routes: Route[];
	Layout?: ComponentType<{ pathname: string; children: ReactNode }>;
	render: (route: Route, Layout?: Entry["Layout"]) => Awaitable<Rendered>;
	routeRobots?: (route: Route) => Awaitable<Route["robots"]>;
	excerpts?: (input: { route: Route; html: string }) => Awaitable<Excerpt[]>;
};

export type SsgOptions = RuntimeOptions & {
	site?: Site;
	publicEnv?: string[];
	excerpts?: string | Entry["excerpts"];
	rendererPlugins?: () => PluginOption[];
};

const htmlType = "text/html; charset=utf-8";

type LoadEntryInput = Pick<SsgOptions, "excerpts"> & {
	server: ViteDevServer;
	entry?: string;
	runtime: RuntimeOptions;
};

const loadExcerpts = async (
	server: ViteDevServer,
	path: string,
): Promise<NonNullable<Entry["excerpts"]>> => {
	if (!path.startsWith("/") || path.startsWith("//"))
		throw new Error(`Expected a Vite root-relative path for excerpts: ${path}`);

	const module = await server.ssrLoadModule(path);
	const result = module.excerpts;

	if (typeof result !== "function")
		throw new Error(`Missing excerpts export in ${path}`);

	return result;
};

const loadEntry = async ({
	server,
	entry,
	runtime,
	excerpts,
}: LoadEntryInput) => {
	const project: Partial<Entry> = entry
		? await server.ssrLoadModule(entry)
		: {};

	const defaults =
		project.routes && project.render
			? undefined
			: ((await server.ssrLoadModule(entryId)) as Entry);

	const app = { ...defaults, ...project } as Entry;

	const routes = project.routes
		? finalizeRoutes({
				routes: project.routes,
				locales: runtime.locales ?? [],
				redirects: runtime.redirects,
			})
		: app.routes;

	const routeRobots = project.routeRobots;
	const projectRoot = await server.ssrLoadModule("virtual:ssg/layout");
	const Layout = projectRoot.Layout ?? app.Layout;

	const configuredExcerpts =
		typeof excerpts === "string"
			? await loadExcerpts(server, excerpts)
			: excerpts;

	const result = {
		...app,
		routes,
		routeRobots,
		Layout,
		excerpts:
			configuredExcerpts ??
			app.excerpts ??
			(routes.some((route) => route.assistant) ? defaultExcerpts : undefined),
	};

	return result;
};

const renderPage = async ({ app, route }: { app: Entry; route: Route }) => {
	const rendered = await app.render(route, app.Layout);
	const result = route.render === "shell" ? { head: rendered.head } : rendered;
	return result;
};

const assistantFile = async ({
	app,
	html = new Map<string, string>(),
}: {
	app: Entry;
	html?: Map<string, string>;
}) => {
	const excerpts: Excerpt[] = [];

	if (!app.excerpts) return;

	for (const route of app.routes) {
		if (!route.assistant || route.status || route.render === "shell") continue;

		const text = html.get(route.pathname);
		const body = text ?? (await renderPage({ app, route })).body ?? "";
		const sections = await app.excerpts({ route, html: body });

		excerpts.push(...sections);
	}

	const result = JSON.stringify(excerpts);
	return result;
};

const robotsFile = async ({
	app,
	source,
	site,
	base,
}: {
	app: Entry;
	source: string;
	site?: Site;
	base: string;
}) => {
	const mount = base === "./" ? "" : base.replace(/\/$/, "");
	const paths: string[] = [];

	for (const route of app.routes) {
		if (route.status) continue;

		const rule =
			route.robots ??
			(app.routeRobots ? await app.routeRobots(route) : undefined);

		if (rule === "disallow") paths.push(`${mount}${route.pathname}`);
	}

	const sitemap = site ? new URL("/sitemap.xml", site.url).href : undefined;
	const result = enrichRobots({ source, paths, sitemap });
	return result;
};

const htmlRequestPath = ({
	request,
	pathname,
}: {
	request: Connect.IncomingMessage;
	pathname: string;
}) => {
	const accept = request.headers.accept;

	const acceptsHtml =
		(request.method === "GET" || request.method === "HEAD") &&
		(!accept || accept.includes("text/html") || accept.includes("*/*")) &&
		!pathname.startsWith("/@") &&
		!pathname.startsWith("/__vite") &&
		(!extname(pathname) ||
			pathname === "/index.html" ||
			pathname.endsWith("/404.html"));

	if (!acceptsHtml) return;

	if (pathname === "/index.html") return "/";

	const result = pathname.replace(/\/+$/, "") || "/";
	return result;
};

const readOptions = async (
	config: ResolvedConfig,
	path: string,
	overrides: SsgOptions,
) => {
	let file: SsgOptions = {};

	config.configFileDependencies.push(path);

	if (statSync(path, { throwIfNoEntry: false })) {
		try {
			const loaded = await loadConfigFromFile(
				config,
				path,
				config.root,
				config.logLevel,
				config.logger,
			);

			if (!loaded) throw new Error("Missing configuration.");

			file = loaded.config as SsgOptions;

			for (const dependency of loaded.dependencies) {
				const absolute = normalizePath(resolve(dependency));

				if (!config.configFileDependencies.includes(absolute))
					config.configFileDependencies.push(absolute);
			}
		} catch (cause) {
			throw new Error(
				`Cannot read ${path}: ${cause instanceof Error ? cause.message : cause}`,
				{ cause },
			);
		}
	}

	const {
		locales = [],
		env,
		publicEnv,
		redirects = [],
		...options
	} = { ...file, ...overrides };

	if ("layout" in options)
		throw new Error(
			"Export the layout as default from index.tsx in the Vite root and remove the layout option.",
		);

	const names = overrides.publicEnv ?? overrides.env ?? publicEnv ?? env ?? [];

	validateLocales(locales);

	if ("pages" in options)
		throw new Error(
			"Remove the pages option. SSG discovers *.page.tsx files under views/ in the Vite root.",
		);

	const result = { ...options, runtime: { locales, env: names, redirects } };
	return result;
};

const templatePath = (index: string) => {
	const result = statSync(index, { throwIfNoEntry: false })
		? index
		: new URL("./template.html", import.meta.url);

	return result;
};

export const ssg = (overrides: SsgOptions = {}): Plugin[] => {
	const timestamp = new Date().toISOString();
	let options: Awaited<ReturnType<typeof readOptions>>;
	let indexPath: string;
	let entry: string | undefined;
	let publicDir = "";
	let renderer: ViteDevServer;

	const plugin: Plugin = {
		name: "ssg",
		enforce: "post",
		config(_config, { command }) {
			if (command === "serve")
				return { optimizeDeps: { include: ["react-dom/client"] } };
		},
		async configResolved(config) {
			const directory = config.configFile
				? dirname(config.configFile)
				: config.root;

			const settingsPath = normalizePath(resolve(directory, "ssg.config.ts"));

			indexPath = normalizePath(resolve(config.root, "index.html"));
			options = await readOptions(config, settingsPath, overrides);

			if (
				config.command === "serve" &&
				!config.environments.client.optimizeDeps.entries &&
				!config.build.rolldownOptions.input
			) {
				const entries = ["views/**/*.page.tsx"];

				if (
					statSync(resolve(config.root, "index.tsx"), { throwIfNoEntry: false })
				)
					entries.push("index.tsx");

				if (statSync(indexPath, { throwIfNoEntry: false }))
					entries.push("index.html");

				config.environments.client.optimizeDeps.entries = entries;
			}

			const path = resolve(directory, "entry-server.tsx");
			const file = statSync(path, { throwIfNoEntry: false });

			entry = file ? `/@fs/${path}` : undefined;
			publicDir = config.publicDir;
		},
		applyToEnvironment(environment) {
			return environment.name === "client";
		},
		async buildStart() {
			if (this.environment.config.command !== "build") return;

			const { base, root, mode, resolve: resolution } = this.environment.config;

			const {
				site,
				runtime: { locales, redirects },
				rendererPlugins,
			} = options;

			renderer = await createServer({
				configFile: false,
				root,
				mode,
				base,
				resolve: { alias: resolution.alias },
				oxc: { jsx: { runtime: "automatic" } },
				appType: "custom",
				server: { middlewareMode: true, watch: null, ws: false },
				optimizeDeps: { noDiscovery: true, include: [] },
				plugins: [
					{
						name: "ssg:skip-global-css",
						enforce: "pre",
						load(id) {
							if (
								id.endsWith(".css") &&
								!id.endsWith(".module.css") &&
								!id.includes("?")
							)
								return "";
						},
					},
					virtualRoutes(() => ({ locales, site, timestamp, redirects })),
					...(rendererPlugins ? rendererPlugins() : []),
				],
			});
		},
		async closeBundle() {
			if (this.environment.config.command === "build" && renderer)
				await renderer.close();
		},
		async configureServer(server) {
			const { llmsIndexFile, renderDocument, siteFiles } = await import(
				"../server/files.ts"
			);

			renderer = server;

			const { runtime, excerpts, site } = options;
			const { locales, env } = runtime;

			const { base, mode, envDir } = server.config;
			const values = loadEnv(mode, envDir, env);

			server.middlewares.use(
				runtimeMiddleware({ options: runtime, values, base }),
			);

			server.middlewares.use(async (request, response, next) => {
				const url = new URL(request.url ?? "/", "http://localhost");
				const path = withinBase({ pathname: url.pathname, base });

				if (
					!path ||
					url.searchParams.has("html-proxy") ||
					path.startsWith("/@") ||
					path.startsWith("/__vite")
				)
					return next();

				try {
					if (
						(request.method === "GET" || request.method === "HEAD") &&
						[
							"/routes.json",
							"/sitemap.xml",
							"/robots.txt",
							"/llms.txt",
							`/${llmsIndexFile}`,
						].includes(path)
					) {
						const robots =
							path === "/robots.txt" ? await readRobots(publicDir) : undefined;

						const app = await loadEntry({ server, entry, runtime, excerpts });

						const files = siteFiles({
							routes: app.routes,
							site,
							runtime,
							base,
						});

						let file = files[path.slice(1)];

						if (path === "/robots.txt")
							file = {
								body: await robotsFile({
									app,
									source: robots ?? "",
									site,
									base,
								}),
								type: "text/plain",
							};

						if (path === `/${llmsIndexFile}`) {
							const body = await assistantFile({ app });
							if (body === undefined) return next();
							file = { body, type: "application/json" };
						}

						if (!file || file.body === undefined) return next();

						response.writeHead(200, {
							"Content-Type": `${file.type}; charset=utf-8`,
						});

						response.end(request.method === "HEAD" ? undefined : file.body);
						return;
					}

					const pathname = htmlRequestPath({ request, pathname: path });
					if (!pathname) return next();

					const app = await loadEntry({ server, entry, runtime, excerpts });
					const route = findRoute({ pathname, routes: app.routes, locales });
					if (!route) return next();

					const template = await readFile(templatePath(indexPath), "utf8");

					const transformed = await server.transformIndexHtml(
						request.url ?? "/",
						template,
					);

					const rendered = await renderPage({ app, route });

					const source = renderDocument({
						template: transformed,
						route,
						routes: app.routes,
						rendered,
						site,
					});

					response.writeHead(route.status ?? 200, { "Content-Type": htmlType });
					response.end(request.method === "HEAD" ? undefined : source);
				} catch (error) {
					next(error);
				}
			});
		},
		async configurePreviewServer(server) {
			const { runtime } = options;
			const { locales, env } = runtime;
			const { base, root, build, mode, envDir } = server.config;
			const values = loadEnv(mode, envDir, env);
			const outDir = resolve(root, build.outDir);

			const manifest = JSON.parse(
				await readFile(resolve(outDir, "routes.json"), "utf8"),
			) as {
				routes: {
					pathname: string;
					file: string;
					status: number;
					locale?: string;
				}[];
			};

			server.middlewares.use(
				runtimeMiddleware({ options: runtime, values, base }),
			);

			server.middlewares.use(async (request, response, next) => {
				const url = new URL(request.url ?? "/", "http://localhost");
				const path = withinBase({ pathname: url.pathname, base });
				if (!path) return next();

				const pathname = htmlRequestPath({ request, pathname: path });
				if (!pathname) return next();

				const route = findRoute({ pathname, routes: manifest.routes, locales });
				if (!route) return next();

				try {
					const source = await readFile(resolve(outDir, route.file));

					response.writeHead(route.status, { "Content-Type": htmlType });
					response.end(request.method === "HEAD" ? undefined : source);
				} catch (error) {
					next(error);
				}
			});
		},
		generateBundle: {
			order: "post",
			async handler(_output, bundle) {
				const { llmsIndexFile, renderDocument, siteFiles } = await import(
					"../server/files.ts"
				);

				const { runtime, excerpts, site } = options;
				const index = bundle["index.html"];

				if (index?.type !== "asset")
					throw new Error("Missing index.html for SSG.");

				const template = Buffer.from(index.source).toString();
				const server = renderer;
				const { base } = this.environment.config;

				const app = await loadEntry({ server, entry, runtime, excerpts });
				const bodies = new Map<string, string>();

				for (const route of app.routes) {
					const rendered = await renderPage({ app, route });

					const source = renderDocument({
						template,
						route,
						routes: app.routes,
						rendered,
						site,
					});

					if (app.excerpts && route.assistant)
						bodies.set(route.pathname, rendered.body ?? "");

					if (route.pathname === "/" && !route.status) index.source = source;
					else
						this.emitFile({
							type: "asset",
							fileName: routeFile(route),
							source,
						});
				}

				if (!app.routes.some((route) => route.pathname === "/")) {
					const route: Route = { pathname: "/", params: {}, render: "shell" };

					index.source = renderDocument({
						template,
						route,
						routes: app.routes,
						rendered: {},
						site,
					});
				}

				const files = siteFiles({ routes: app.routes, site, runtime, base });

				for (const [fileName, { body }] of Object.entries(files)) {
					this.emitFile({ type: "asset", fileName, source: body });
				}

				const robots = await readRobots(publicDir);

				{
					const source = await robotsFile({
						app,
						source: robots ?? "",
						site,
						base,
					});

					this.emitFile({ type: "asset", fileName: "robots.txt", source });
				}

				const indexSource = await assistantFile({ app, html: bodies });

				if (indexSource !== undefined)
					this.emitFile({
						type: "asset",
						fileName: llmsIndexFile,
						source: indexSource,
					});
			},
		},
	};

	const result: Plugin[] = [
		{
			name: "ssg:html-entry",
			apply: "build",
			enforce: "pre",
			resolveId(id) {
				if (id === indexPath) return indexPath;
			},
			async load(id) {
				if (id !== indexPath) return;

				const source = templatePath(indexPath);
				if (source === indexPath) return;

				const html = await readFile(source, "utf8");
				return html;
			},
		},
		virtualRoutes(() => ({
			locales: options.runtime.locales,
			redirects: options.runtime.redirects,
			site: options.site,
			timestamp,
			renderer: () => renderer,
		})),
		plugin,
	];

	return result;
};
