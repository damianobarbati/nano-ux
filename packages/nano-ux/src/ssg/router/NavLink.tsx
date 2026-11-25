import { Link, type LinkProps } from "./Link.tsx";
import { usePathname } from "./navigation.ts";

type NavLinkProps = LinkProps;

export const NavLink = ({ href, ...props }: NavLinkProps) => {
	const pathname = usePathname();
	const base = new URL(pathname, "https://ssg.invalid");
	const target = new URL(href, base);

	const active =
		target.origin === base.origin &&
		target.pathname.replace(/\/+$/, "") === pathname.replace(/\/+$/, "");

	return (
		<Link {...props} href={href} aria-current={active ? "page" : undefined} />
	);
};
