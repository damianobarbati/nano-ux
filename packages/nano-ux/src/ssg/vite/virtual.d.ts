declare module "virtual:ssg/client" {}

declare module "virtual:ssg/routes" {
	type Route = import("../routing/routes.ts").Route;
	type PageProps = import("../routing/routes.ts").PageProps;
	export type PageMetadata = import("../routing/routes.ts").PageMetadata;
	export type PageRoute = import("../routing/routes.ts").PageRoute;
	type Component = import("react").ComponentType<PageProps>;

	export const site: import("../routing/routes.ts").Site | undefined;
	export const routes: Route[];

	export const pages: Record<
		string,
		() => Promise<{ Page: Component; Head?: Component; route?: PageRoute }>
	>;

	export const routeFor: (pathname: string) => Route | undefined;
}

declare module "virtual:ssg/layout" {
	export const Layout:
		| import("react").ComponentType<{
				pathname?: string;
				children: import("react").ReactNode;
		  }>
		| undefined;
}

declare module "virtual:ssg/router" {
	export type PageProps = import("../routing/routes.ts").PageProps;
	export type Metadata = import("../routing/routes.ts").Metadata;
	export type PageMetadata = import("../routing/routes.ts").PageMetadata;
	export type PageRoute = import("../routing/routes.ts").PageRoute;
	export type Params = import("../routing/routes.ts").Params;
	export type Route = import("../routing/routes.ts").Route;
	export type Site = import("../routing/routes.ts").Site;

	export const routeFor: typeof import("virtual:ssg/routes").routeFor;
	export const Router: typeof import("../router/Router.tsx").Router;
	export const Link: typeof import("../router/Link.tsx").Link;
	export const linkProps: typeof import("../router/Link.tsx").linkProps;
	export const NavLink: typeof import("../router/NavLink.tsx").NavLink;
	export const Redirect: typeof import("../router/Redirect.tsx").Redirect;
	export const usePathname: typeof import("../router/navigation.ts").usePathname;
	export const useSearch: typeof import("../router/navigation.ts").useSearch;
	export const navigate: typeof import("../router/navigation.ts").navigate;
}
