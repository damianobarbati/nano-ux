import type { pages } from "virtual:ssg/routes";
import { routes, site } from "virtual:ssg/routes";
import React from "react";
import { createPortal } from "react-dom";
import { PageMeta } from "../routing/head.ts";
import { alternates } from "../routing/metadata.ts";
import type { Route } from "../routing/routes.ts";
import { clearPrerenderedHead } from "./prerenderedHead.ts";

type RouteMetadataProps = {
	route: Route;
	Head?: Awaited<ReturnType<(typeof pages)[string]>>["Head"];
};

export const RouteMetadata = ({ route, Head }: RouteMetadataProps) => {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		clearPrerenderedHead();
		setMounted(true);
	}, []);

	const metadata = route.metadata;
	const language = metadata?.language;
	const direction = metadata?.direction;

	React.useLayoutEffect(() => {
		const root = document.documentElement;

		if (language) root.lang = language;

		if (direction) root.dir = direction;
		else root.removeAttribute("dir");
	}, [language, direction]);

	if (!mounted) return null;

	const links = site ? alternates({ route, routes, site }) : [];

	const result = createPortal(
		<>
			<PageMeta route={route} alternates={links} />
			{!!Head && (
				<Head
					pathname={route.pathname}
					params={route.params}
					metadata={metadata}
				/>
			)}
		</>,
		document.head,
	);

	return result;
};
