import type { Route } from "../routing/routes.ts";
import type { Excerpt } from "./files.ts";

export const excerptText = (html: string) => {
	const text = html
		.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
		.replace(/<\/t[hd]>\s*(?=<t[hd]\b)/g, " | ")
		.replace(/<\/(?:p|li|caption|tr|pre|h[1-6])>/g, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#x27;/g, "'")
		.replace(/&amp;/g, "&")
		.trim();

	return text;
};

export const defaultExcerpts = ({
	route,
	html,
}: {
	route: Route;
	html: string;
}): Excerpt[] => {
	const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
	const text = excerptText(main ? main[1] : html);

	const result = text
		? [
				{
					title: route.metadata?.title ?? route.pathname,
					href: route.pathname,
					text,
				},
			]
		: [];

	return result;
};
