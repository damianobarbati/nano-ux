import { mergeMetadata, resolveMetadata } from "./metadata.ts";
export type Params = Record<string, string>;

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

type LlmLink = {
	group: string;
	anchor?: string;
	title?: string;
	description?: string;
};

type Social = {
	title?: string;
	description?: string;
	type?: string;
	card?: "summary" | "summary_large_image";
	image?: {
		url: string;
		alt: string;
		width?: number;
		height?: number;
		type?: string;
	};
};

export type PageMetadata = {
	title?: string;
	description?: string;
	canonical?: string;
	lastModified?: string;
	robots?: { crawl?: boolean; index?: boolean; follow?: boolean };
	sitemap?: boolean;
	social?: false | Social;
	jsonLd?: false | JsonObject | JsonObject[];
	locale?: string;
	direction?: "ltr" | "rtl";
	contentId?: string;
	llms?: { links?: false | LlmLink[]; content?: boolean };
};

export type Site = {
	url: string;
	name: string;
	summary?: string;
	locale?: string;
	titleTemplate?: string;
	metadata?: PageMetadata;
};

export type Metadata = {
	documentTitle?: string;
	follow?: boolean;
	sitemap?: boolean;
	social?: Social;
	siteName?: string;
	title?: string;
	description?: string;
	canonical?: string;
	indexable?: boolean;
	jsonLd?: JsonObject | JsonObject[];
	lastModified?: string;
	contentId?: string;
	language?: string;
	direction?: "ltr" | "rtl";
	llms?: {
		group: string;
		anchor?: string;
		title?: string;
		description?: string;
	}[];
};

export type Route = {
	pathname: string;
	params: Params;
	locale?: string;
	page?: string;
	status?: 404;
	render?: "shell";
	robots?: "disallow";
	assistant?: boolean;
	metadata?: Metadata;
};

type Entry = {
	path?: string;
	params?: Params;
	locale?: string;
	metadata?: PageMetadata;
};

export type PageProps = Pick<Route, "pathname" | "params" | "metadata">;

export type PageRoute = {
	locales?: false | string[];
	render?: "shell";
	metadata?: PageMetadata | ((route: Route) => PageMetadata);
} & (
	| { pattern?: never; entries?: Entry[] }
	| { pattern: string; entries?: (Entry & { path?: never })[] }
);

type DiscoverRoutesInput = {
	site?: Site;
	timestamp?: string;
	pages: string[];
	options: Record<string, PageRoute | undefined>;
	locales: string[];
};

const segment = /^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u;
const parameter = /^:([a-zA-Z][a-zA-Z0-9_]*)(\?)?$/;

const kebab = (value: string) => {
	const result = value
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.replace(/([a-z\d])([A-Z])/g, "$1-$2")
		.toLowerCase();

	return result;
};

const renderPattern = ({
	pattern,
	params,
	source,
}: {
	pattern: string;
	params: Params;
	source: string;
}) => {
	if (pattern === "/") return "/";

	if (!pattern.startsWith("/"))
		throw new Error(`Expected absolute route pattern in ${source}.`);

	const parts = pattern
		.slice(1)
		.split("/")
		.flatMap((part) => {
			const token = parameter.exec(part);
			const value = token ? params[token[1]] : part;
			if (value === undefined && token && token[2]) return [];

			if (!value || !segment.test(value))
				throw new Error(`Invalid or missing segment "${part}" in ${source}.`);

			return [encodeURIComponent(value)];
		});

	const result = `/${parts.join("/")}`;
	return result;
};

export const validateLocales = (locales: string[]) => {
	const normalized = new Set<string>();

	for (const locale of locales) {
		let tag: string;

		try {
			[tag] = Intl.getCanonicalLocales(locale);
		} catch {
			throw new Error(`Invalid locale "${locale}".`);
		}

		if (!tag || normalized.has(tag))
			throw new Error(`Invalid or duplicate locale "${locale}".`);

		normalized.add(tag);
	}
};

type EntryPathInput = {
	path?: string;
	pattern: string;
	params: Params;
	locale?: string;
	page: string;
};

const entryPath = ({ path, pattern, params, locale, page }: EntryPathInput) => {
	if (path !== undefined) {
		if (locale && path !== `/${locale}` && !path.startsWith(`/${locale}/`)) {
			throw new Error(`Expected locale prefix in "${path}" in ${page}.`);
		}

		return path;
	}

	const pathname = renderPattern({ pattern, params, source: page });
	const hasPrefix = pattern === "/:lang" || pattern.startsWith("/:lang/");

	const result =
		locale && !hasPrefix
			? `/${locale}${pathname === "/" ? "" : pathname}`
			: pathname;

	return result;
};

export const discoverRoutes = ({
	pages,
	options,
	locales,
	site,
	timestamp = new Date().toISOString(),
}: DiscoverRoutesInput): Route[] => {
	validateLocales(locales);

	const routes = pages.flatMap((page) => {
		const relativeName = page.slice("/views/".length, -".page.tsx".length);
		const parts = relativeName.split("/");
		const filename = parts[parts.length - 1];
		const folders = parts.slice(0, -1);

		if (filename.includes(".")) {
			const names = filename.split(".");

			const suggestion = [
				...folders,
				...names.slice(0, -1).map(kebab),
				names.at(-1),
			].join("/");

			throw new Error(
				`Move ${page} to /views/${suggestion}.page.tsx. Use folders for nested routes.`,
			);
		}

		const settings = options[page] ?? {};
		const fallback = !folders.length && filename === "NotFound";

		if (filename !== "Home") folders.push(fallback ? "404" : filename);

		const inferred = `/${folders.map(kebab).join("/")}`;
		const pattern = settings.pattern ?? inferred;
		const entries = settings.entries ?? [{}];

		const pageLocales =
			settings.locales === false ? [] : (settings.locales ?? locales);

		validateLocales(pageLocales);

		for (const locale of pageLocales) {
			if (!locales.includes(locale))
				throw new Error(`Unknown locale "${locale}" in ${page}.`);
		}

		const result = entries.flatMap((entry) => {
			if (entry.path !== undefined && settings.pattern !== undefined)
				throw new Error(`Choose a path or pattern in ${page}.`);

			if (entry.locale !== undefined && !pageLocales.includes(entry.locale))
				throw new Error(
					`Unknown or disabled locale "${entry.locale}" in ${page}.`,
				);

			const languages = entry.locale ? [entry.locale] : pageLocales;

			if (entry.path !== undefined && languages.length && !entry.locale)
				throw new Error(
					`Specify locale for localized path "${entry.path}" in ${page}.`,
				);

			const result = (languages.length ? languages : [undefined]).map(
				(locale) => {
					const params = { ...entry.params };

					if (locale) params.lang = locale;

					const pathname = entryPath({
						path: entry.path,
						pattern,
						params,
						locale,
						page,
					});

					const route: Route = {
						pathname,
						params,
						locale,
						page,
						render: settings.render,
					};

					if (fallback) route.status = 404;

					const pageMetadata =
						typeof settings.metadata === "function"
							? settings.metadata(route)
							: settings.metadata;

					const base = mergeMetadata(site?.metadata ?? {}, pageMetadata ?? {});
					const input = mergeMetadata(base, entry.metadata ?? {});

					if ((pageMetadata || entry.metadata) && !input.title?.trim()) {
						throw new Error(`Missing metadata title for ${pathname}.`);
					}

					route.metadata = resolveMetadata(route, input, timestamp, site);

					if (input.robots?.crawl !== undefined)
						route.robots = input.robots.crawl ? undefined : "disallow";

					route.assistant = input.llms?.content;

					if (locale && !settings.entries && !route.metadata?.contentId) {
						route.metadata = { ...route.metadata, contentId: relativeName };
					}

					return route;
				},
			);

			return result;
		});

		return result;
	});

	return routes;
};

export const routeFile = (route: Route) => {
	if (route.status === 404) {
		const result = `${route.locale ? `${route.locale}/` : ""}404.html`;
		return result;
	}

	if (route.pathname === "/") return "index.html";

	const result = `${decodeURIComponent(route.pathname.slice(1))}.html`;
	return result;
};

export const validateRoutes = ({
	routes,
	locales,
}: {
	routes: Route[];
	locales: string[];
}) => {
	const paths = new Map<string, Route>();
	const files = new Map<string, Route>();

	for (const route of routes) {
		const { pathname } = route;
		const segments = pathname.slice(1).split("/");

		if (
			!pathname.startsWith("/") ||
			(pathname !== "/" &&
				segments.some((part) => {
					try {
						const decoded = decodeURIComponent(part);
						return (
							!segment.test(decoded) || encodeURIComponent(decoded) !== part
						);
					} catch {
						return true;
					}
				})) ||
			(route.locale && !locales.includes(route.locale))
		) {
			throw new Error(
				`Invalid SSG route "${pathname}" in ${route.page ?? "server entry"}.`,
			);
		}

		const file = routeFile(route);

		if (file === "index.html" && pathname !== "/") {
			throw new Error(
				`SSG route "${pathname}" conflicts with the root index.html.`,
			);
		}

		const previous = paths.get(pathname) ?? files.get(file);

		if (previous) {
			throw new Error(
				`Duplicate SSG route or output "${pathname}" between ${previous.page ?? previous.pathname} and ${route.page ?? pathname}.`,
			);
		}

		paths.set(pathname, route);
		files.set(file, route);
	}
};

export const finalizeRoutes = ({
	routes: input,
	locales,
	redirects,
}: {
	routes: Route[];
	locales: string[];
	redirects?: { from: string }[];
}) => {
	const redirectPaths = new Set(redirects?.map(({ from }) => from));
	const routes = input.filter(({ pathname }) => !redirectPaths.has(pathname));

	if (!routes.some((route) => route.status === 404)) {
		routes.push({ pathname: "/404", status: 404, params: {} });
	}

	validateRoutes({ routes, locales });
	return routes;
};

export const findRoute = <
	T extends { pathname: string; locale?: string; status?: number },
>({
	pathname,
	routes,
	locales,
}: {
	pathname: string;
	routes: T[];
	locales: string[];
}) => {
	const exact = routes.find((route) => route.pathname === pathname);
	if (exact) return exact;

	const locale = pathname.split("/")[1];
	const language = locales.includes(locale) ? locale : locales[0];

	const result =
		routes.find((route) => route.status === 404 && route.locale === language) ??
		routes.find((route) => route.status === 404 && !route.locale);

	return result;
};
