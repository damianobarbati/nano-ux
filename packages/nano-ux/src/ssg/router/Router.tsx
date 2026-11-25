import { Layout } from "virtual:ssg/layout";
import { pages, routeFor } from "virtual:ssg/routes";
import React from "react";
import type { Route } from "../routing/routes.ts";
import { appPath, ServerPath, usePathname } from "./navigation.ts";
import { RouteMetadata } from "./RouteMetadata.tsx";
import { RoutePage } from "./RoutePage.tsx";

type PageModules = Map<string, ReturnType<(typeof pages)[string]>>;
const hot = import.meta.env.SSR ? undefined : import.meta.hot;
const modules: PageModules = hot?.data.modules ?? new Map();

if (hot) hot.data.modules = modules;

const loadPage = (page: string) => {
	let pending = modules.get(page);

	if (!pending) {
		pending = pages[page]();
		modules.set(page, pending);
	}

	return pending;
};

type RouterProps = { ssrPath?: string };

type CurrentPageProps = { route: Route; page: string };

const CurrentPage = ({ route, page }: CurrentPageProps) => {
	const module = React.use(loadPage(page));
	return <RoutePage route={route} module={module} />;
};

const MatchedPage = ({ ssrPath }: RouterProps) => {
	const location = usePathname();
	const route = routeFor(location.replace(/\/+$/, "") || "/");

	if (!route?.page) {
		return (
			<main>
				<RouteMetadata route={{ pathname: "/404", status: 404, params: {} }} />
				<h1>Page not found</h1>
			</main>
		);
	}

	const page = <CurrentPage route={route} page={route.page} />;

	const pathname = ssrPath ? route.pathname : undefined;
	const content = Layout ? <Layout pathname={pathname}>{page}</Layout> : page;
	return content;
};

export const Router = ({ ssrPath }: RouterProps) => (
	<ServerPath value={appPath(ssrPath ?? "/")}>
		<MatchedPage ssrPath={ssrPath} />
	</ServerPath>
);
