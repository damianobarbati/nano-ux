import type React from "react";
import { linkHref, navigate } from "./navigation.ts";

export type LinkProps = React.ComponentPropsWithRef<"a"> & {
	href: string;
	replace?: boolean;
};

export const linkProps = ({
	href,
	replace,
	onClick,
}: Pick<LinkProps, "href" | "replace" | "onClick">) => {
	const click = (event: React.MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);

		const anchor = event.currentTarget;

		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.altKey ||
			event.shiftKey
		)
			return;

		if (
			anchor.hasAttribute("download") ||
			(anchor.target && anchor.target !== "_self")
		)
			return;

		const url = new URL(anchor.href);

		if (
			url.origin !== location.origin ||
			!["http:", "https:"].includes(url.protocol)
		)
			return;

		if (
			url.hash &&
			url.pathname === location.pathname &&
			url.search === location.search
		)
			return;

		event.preventDefault();
		navigate(href, { replace });
	};

	const result = { href: linkHref(href), onClick: click };
	return result;
};

export const Link = ({ href, replace, onClick, ...props }: LinkProps) => {
	return <a {...props} {...linkProps({ href, replace, onClick })} />;
};
