export { routeFor } from "virtual:ssg/routes";

export type {
	Metadata,
	PageMetadata,
	PageProps,
	PageRoute,
	Params,
	Route,
	Site,
} from "../routing/routes.ts";

export { Link, linkProps } from "./Link.tsx";
export { NavLink } from "./NavLink.tsx";
export { navigate, usePathname, useSearch } from "./navigation.ts";
export { Redirect } from "./Redirect.tsx";
export { Router } from "./Router.tsx";
