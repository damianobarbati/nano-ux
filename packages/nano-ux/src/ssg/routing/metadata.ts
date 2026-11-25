import type { Metadata, PageMetadata, Route, Site } from "./routes.ts";

export const mergeMetadata = (
	base: PageMetadata,
	override: PageMetadata,
): PageMetadata => {
	const result = { ...base, ...override };

	if (override.robots) result.robots = { ...base.robots, ...override.robots };

	if (override.llms) result.llms = { ...base.llms, ...override.llms };

	if (override.social) result.social = { ...base.social, ...override.social };

	return result;
};

export const resolveMetadata = (
	route: Route,
	input: PageMetadata,
	timestamp: string,
	site?: Site,
): Metadata => {
	const { title, description, robots = {}, llms = {} } = input;

	const indexable =
		!route.status && route.render !== "shell" && robots.index !== false;

	const canonical = site
		? new URL(input.canonical ?? route.pathname, site.url).href
		: input.canonical;

	const language = input.locale ?? route.locale ?? site?.locale;

	const result: Metadata = {
		title,
		description,
		canonical,
		indexable,
		follow: robots.follow,
		sitemap: input.sitemap,
		llms: llms.links || [],
		lastModified: input.lastModified ?? timestamp,
		language,
		direction:
			input.direction ??
			(language && /^(ar|he|ur|fa)(-|$)/i.test(language) ? "rtl" : undefined),
		contentId: input.contentId,
	};

	if (title && site?.titleTemplate)
		result.documentTitle = site.titleTemplate.replace("%s", () => title);

	if (input.jsonLd) result.jsonLd = input.jsonLd;
	else if (
		input.jsonLd !== false &&
		site &&
		title &&
		canonical &&
		!route.status &&
		route.render !== "shell"
	) {
		result.jsonLd = {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: title,
			url: canonical,
		};

		if (description) result.jsonLd.description = description;

		if (language) result.jsonLd.inLanguage = language;
	}

	if (site && title && input.social !== false) {
		const social = input.social ?? {};
		const image = social.image;

		result.social = {
			title: social.title ?? title,
			description: social.description ?? description,
			type: social.type ?? "website",
			card: social.card ?? "summary",
			image: image && { ...image, url: new URL(image.url, site.url).href },
		};

		result.siteName = site.name;
	}

	return result;
};

const absolute = ({ pathname, site }: { pathname: string; site: Site }) => {
	const result = new URL(pathname, site.url).href;
	return result;
};

export const canonical = ({ route, site }: { route: Route; site: Site }) => {
	const result = absolute({
		pathname: route.metadata?.canonical ?? route.pathname,
		site,
	});

	return result;
};

export const isIndexable = (route: Route) =>
	!route.status &&
	route.render !== "shell" &&
	route.metadata?.indexable !== false;

export const isCanonical = ({ route, site }: { route: Route; site: Site }) =>
	canonical({ route, site }) === absolute({ pathname: route.pathname, site });

export const alternates = ({
	route,
	routes,
	site,
}: {
	route: Route;
	routes: Route[];
	site: Site;
}) => {
	const content = route.metadata?.contentId;

	if (
		!content ||
		!route.locale ||
		!isIndexable(route) ||
		!isCanonical({ route, site })
	)
		return [];

	const result = routes.flatMap((candidate) => {
		if (
			candidate.metadata?.contentId !== content ||
			!candidate.locale ||
			!isIndexable(candidate) ||
			!isCanonical({ route: candidate, site })
		) {
			return [];
		}

		return [
			{ locale: candidate.locale, url: canonical({ route: candidate, site }) },
		];
	});

	return result;
};
