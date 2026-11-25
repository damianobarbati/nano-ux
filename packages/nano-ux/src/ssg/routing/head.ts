import { Fragment, createElement as h, type ReactNode } from "react";
import { isIndexable } from "./metadata.ts";
import type { Route } from "./routes.ts";

type PageMetaProps = {
	route: Route;
	alternates: { locale: string; url: string }[];
};

export const PageMeta = ({ route, alternates }: PageMetaProps) => {
	const metadata = route.metadata ?? {};
	const { social, canonical, language } = metadata;
	const tags: ReactNode[] = [];
	const directives: string[] = [];

	if (!isIndexable(route)) directives.push("noindex");

	if (metadata.follow === false) directives.push("nofollow");

	if (metadata.title)
		tags.push(
			h("title", { key: "title" }, metadata.documentTitle ?? metadata.title),
		);

	if (metadata.description)
		tags.push(
			h("meta", {
				key: "description",
				name: "description",
				content: metadata.description,
			}),
		);

	if (directives.length)
		tags.push(
			h("meta", {
				key: "robots",
				name: "robots",
				content: directives.join(", "),
			}),
		);

	if (canonical)
		tags.push(
			h("link", { key: "canonical", rel: "canonical", href: canonical }),
		);

	for (const { locale, url } of alternates) {
		tags.push(
			h("link", { key: locale, rel: "alternate", hrefLang: locale, href: url }),
		);
	}

	if (social) {
		const image = social.image;

		const properties = {
			"og:type": social.type,
			"og:site_name": metadata.siteName,
			"og:title": social.title,
			"og:description": social.description,
			"og:url": canonical,
			"og:image": image?.url,
			"og:image:alt": image?.alt,
			"og:image:width": image?.width,
			"og:image:height": image?.height,
			"og:image:type": image?.type,
			"og:locale": language?.includes("-")
				? language.replaceAll("-", "_")
				: undefined,
		};

		for (const [property, content] of Object.entries(properties)) {
			if (content !== undefined)
				tags.push(
					h("meta", { key: property, property, content: String(content) }),
				);
		}

		for (const { locale } of alternates) {
			if (locale !== language && locale.includes("-"))
				tags.push(
					h("meta", {
						key: `og:${locale}`,
						property: "og:locale:alternate",
						content: locale.replaceAll("-", "_"),
					}),
				);
		}

		const card = {
			"twitter:card": social.card,
			"twitter:title": social.title,
			"twitter:description": social.description,
			"twitter:image": image?.url,
			"twitter:image:alt": image?.alt,
		};

		for (const [name, content] of Object.entries(card)) {
			if (content !== undefined)
				tags.push(h("meta", { key: name, name, content }));
		}
	}

	if (metadata.jsonLd) {
		const json = JSON.stringify(metadata.jsonLd).replaceAll("<", "\\u003c");

		tags.push(
			h("script", {
				key: "jsonLd",
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: json },
			}),
		);
	}

	const result = h(Fragment, null, ...tags);
	return result;
};
