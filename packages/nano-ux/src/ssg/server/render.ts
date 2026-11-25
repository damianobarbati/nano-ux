import { pages, routes } from "virtual:ssg/routes";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { prerender } from "react-dom/static";
import { ServerPath } from "../router/navigation.ts";

import { RoutePage } from "../router/RoutePage.tsx";

export { routes };

import type { ComponentType, ReactNode } from "react";
import type { Route } from "../routing/routes.ts";

export const render = async (
	route: Route,
	Layout?: ComponentType<{ pathname: string; children: ReactNode }>,
) => {
	if (!route.page) return { body: "<main><h1>Page not found</h1></main>" };

	const module = await pages[route.page]();
	const { Page, Head } = module;

	const props = {
		pathname: route.pathname,
		params: route.params,
		metadata: route.metadata,
	};

	const head = Head
		? renderToStaticMarkup(
				createElement(
					ServerPath,
					{ value: route.pathname },
					createElement(Head, props),
				),
			)
		: "";

	if (route.render === "shell") return { head };

	if (!Page) throw new Error(`Missing Page export in ${route.page}`);

	const page = createElement(RoutePage, { route, module });

	const content = Layout
		? createElement(Layout, { pathname: route.pathname, children: page })
		: page;

	const routed = createElement(ServerPath, {
		value: route.pathname,
		children: content,
	});

	const document = createElement(
		"html",
		null,
		createElement("body", null, routed),
	);

	const { prelude } = await prerender(document);
	const html = await new Response(prelude).text();
	const boundary = html.indexOf("</head><body>");

	const pageHead = html.slice(
		html.indexOf("<head>") + "<head>".length,
		boundary,
	);

	const body = html.slice(
		boundary + "</head><body>".length,
		html.lastIndexOf("</body>"),
	);

	return { head, pageHead, body };
};
