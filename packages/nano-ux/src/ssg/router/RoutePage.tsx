import type { pages } from "virtual:ssg/routes";
import type { Route } from "../routing/routes.ts";
import { RouteMetadata } from "./RouteMetadata.tsx";

type RoutePageProps = {
	route: Route;
	module: Awaited<ReturnType<(typeof pages)[string]>>;
};

export const RoutePage = ({
	route,
	module: { Page, Head },
}: RoutePageProps) => (
	<>
		<RouteMetadata route={route} Head={Head} />
		<Page
			pathname={route.pathname}
			params={route.params}
			metadata={route.metadata}
		/>
	</>
);
