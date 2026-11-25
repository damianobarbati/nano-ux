import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PageMeta } from "../routing/head.ts";

import {
	alternates,
	canonical,
	isCanonical,
	isIndexable,
} from "../routing/metadata.ts";

import { type Route, routeFile, type Site } from "../routing/routes.ts";
import type { RuntimeOptions } from "./runtime.ts";

export const llmsIndexFile = "llms-index.json";

export type { Site } from "../routing/routes.ts";

export type Excerpt = { title: string; href: string; text: string };

export type Rendered = { body?: string; head?: string; pageHead?: string };

type StaticFile = { body: string; type: string };

const xml = (value: string) => {
	const result = value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

	return result;
};

const markPrerenderedHead = (html: string) => {
	const result = html.replace(
		/<!--[\s\S]*?-->|<(script|style|title|textarea|noscript)(?=[\s>])(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<[a-z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>/gi,
		(tag) => {
			const marked = tag.replace(
				/^<(title|meta|link|script)(?=[\s/>])/i,
				"<$1 data-ssg-head",
			);

			return marked;
		},
	);

	return result;
};

export const renderDocument = ({
	template,
	route,
	routes,
	rendered,
	site,
}: {
	template: string;
	route: Route;
	routes: Route[];
	rendered: Rendered;
	site?: Site;
}) => {
	const head = "<!--route-metadata-->";
	const body = "<!--route-ssg-->";

	for (const marker of [head, body]) {
		if (
			template.indexOf(marker) === -1 ||
			template.indexOf(marker) !== template.lastIndexOf(marker)
		) {
			throw new Error(`Expected one ${marker} marker in SSG template.`);
		}
	}

	const language = route.metadata?.language ?? route.locale ?? site?.locale;

	const direction =
		route.metadata?.direction ??
		(language && /^(ar|fa|he|ur)(-|$)/i.test(language) ? "rtl" : undefined);

	const attributes = { lang: language, dir: direction };

	const html = template.replace(/<html\b[^>]*>/i, (tag) => {
		let result = tag;

		for (const [name, value] of Object.entries(attributes)) {
			if (value === undefined) continue;

			result = result.replace(
				new RegExp(`\\s+${name}=(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "i"),
				"",
			);

			result = `${result.slice(0, -1)} ${name}="${xml(value)}">`;
		}

		return result;
	});

	const tags = renderToStaticMarkup(
		createElement(PageMeta, {
			route,
			alternates: site ? alternates({ route, routes, site }) : [],
		}),
	);

	const routeHead = markPrerenderedHead(
		tags + (rendered.head ?? "") + (rendered.pageHead ?? ""),
	);

	const result = html.replace(
		/<!--route-metadata-->|<!--route-ssg-->/g,
		(marker) => {
			const content = marker === head ? routeHead : (rendered.body ?? "");
			return content;
		},
	);

	return result;
};

const sitemap = ({ routes, site }: { routes: Route[]; site: Site }) => {
	const entries = routes.flatMap((route) => {
		if (
			route.metadata?.sitemap === false ||
			!isIndexable(route) ||
			!isCanonical({ route, site })
		)
			return [];

		const lastModified = route.metadata?.lastModified;

		const links = alternates({ route, routes, site }).map(
			({ locale, url }) =>
				`<xhtml:link rel="alternate" hreflang="${xml(locale)}" href="${xml(url)}"/>`,
		);

		return [
			`<url><loc>${xml(canonical({ route, site }))}</loc>${lastModified ? `<lastmod>${xml(lastModified)}</lastmod>` : ""}${links.join("")}</url>`,
		];
	});

	const result = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...entries,
		"</urlset>",
		"",
	].join("\n");

	return result;
};

const markdown = (value: string) => {
	const result = value.replace(/[\r\n]+/g, " ").replace(/[\\[\]<>]/g, "\\$&");
	return result;
};

const llms = ({ routes, site }: { routes: Route[]; site: Site }) => {
	const groups = new Map<string, string[]>();

	for (const route of routes) {
		if (route.status || route.render === "shell") continue;

		const metadata = route.metadata;

		for (const link of metadata?.llms ?? []) {
			const section = groups.get(link.group) ?? [];
			const url = new URL(canonical({ route, site }));
			const description = link.description ?? metadata?.description;

			if (link.anchor) url.hash = link.anchor;

			section.push(
				`- [${markdown(link.title ?? metadata?.title ?? route.pathname)}](<${url.href}>)${description ? `: ${markdown(description)}` : ""}`,
			);

			groups.set(link.group, section);
		}
	}

	if (!groups.size) return;

	const result = [
		`# ${markdown(site.name)}`,
		...(site.summary ? ["", `> ${markdown(site.summary)}`] : []),
		...Array.from(groups, ([group, links]) => [
			"",
			`## ${markdown(group)}`,
			...links,
		]).flat(),
		"",
	].join("\n");

	return result;
};

export const manifestFile = ({
	routes,
	runtime,
	base,
}: {
	routes: Route[];
	runtime: RuntimeOptions;
	base: string;
}) => {
	const result = JSON.stringify({
		base,
		runtime,
		routes: routes.map(({ pathname, locale, status, ...route }) => ({
			pathname,
			file: routeFile({ pathname, locale, status, ...route }),
			status: status ?? 200,
			locale,
		})),
	});

	return result;
};

export const siteFiles = ({
	routes,
	site,
	runtime,
	base,
}: {
	routes: Route[];
	site?: Site;
	runtime: RuntimeOptions;
	base: string;
}) => {
	const files: Record<string, StaticFile> = {
		"routes.json": {
			body: manifestFile({ routes, runtime, base }),
			type: "application/json",
		},
	};

	if (!site) return files;

	files["sitemap.xml"] = {
		body: sitemap({ routes, site }),
		type: "application/xml",
	};

	const links = llms({ routes, site });
	if (links) files["llms.txt"] = { body: links, type: "text/plain" };

	return files;
};
