import React from "react";

export const ServerPath = React.createContext("/");

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const prefix = base.startsWith("/") ? base : "";

export const appPath = (pathname: string) => {
	if (pathname === prefix) return "/";

	const result =
		prefix && pathname.startsWith(`${prefix}/`)
			? pathname.slice(prefix.length)
			: pathname;

	return result;
};

export const linkHref = (href: string) => {
	const result =
		href.startsWith("/") && !href.startsWith("//") ? prefix + href : href;

	return result;
};

const subscribe = (update: () => void) => {
	window.addEventListener("popstate", update);
	window.addEventListener("ssg:navigate", update);

	return () => {
		window.removeEventListener("popstate", update);
		window.removeEventListener("ssg:navigate", update);
	};
};

const pathname = () => appPath(window.location.pathname);
const search = () => window.location.search.slice(1);

export const usePathname = () => {
	const initial = React.useContext(ServerPath);
	const result = React.useSyncExternalStore(subscribe, pathname, () => initial);
	return result;
};

export const useSearch = () => {
	const result = React.useSyncExternalStore(subscribe, search, () => "");
	return result;
};

export const navigate = (href: string, { replace = false } = {}) => {
	const url = new URL(linkHref(href), document.baseURI);

	if (
		url.origin !== location.origin ||
		!["http:", "https:"].includes(url.protocol)
	) {
		throw new Error("Expected a same-origin HTTP URL.");
	}

	if (url.href === location.href) return;

	if (replace) history.replaceState(null, "", url);
	else history.pushState(null, "", url);

	window.dispatchEvent(new Event("ssg:navigate"));
};
