import { usePathname } from "virtual:ssg/router";
import { Nav, ThemeSelector } from "nano-ux";
import { initNavScroll } from "nano-ux/helpers";
import { IGitHub, ILinkedIn } from "nano-ux/icons";
import React from "react";
import { ContactButton } from "./components/ContactButton.tsx";

const darkLogo = `${import.meta.env.BASE_URL}logo-dark.svg`;

type LayoutProps = { className?: string; children: React.ReactNode };

export const Layout = ({ className, children }: LayoutProps) => {
	const pathname = usePathname();

	React.useEffect(initNavScroll, []);

	if (pathname.replace(/\/+$/, "") === "/theme-preview") return children;

	return (
		<>
			<header className="relative z-30 flex h-14 items-center gap-3 border-b border-border bg-bg pr-13 sm:gap-6 lg:h-auto lg:py-4 lg:[reading-flow:flex-visual]">
				<Nav
					label="Page sections"
					className="text-sm lg:flex-wrap max-lg:[&>a]:px-2 max-lg:[&>a]:py-3"
				>
					<a href="./#theme">Theme</a>
					<a href="./#colors">Colors</a>
					<a href="./#typography">Typography</a>
					<a href="./#new-profile">Form</a>
					<a href="./#feedback">Feedback</a>
					<a href="./#dashboard">Dashboard</a>
					<a href="./documentation">Documentation</a>
				</Nav>
				<a
					href="./"
					className="inline-flex items-center gap-1 text-xl font-semibold no-underline lg:order-first"
				>
					<img
						className="brand-logo size-[32px] max-lg:order-last"
						src={darkLogo}
						alt=""
					/>
					<span className="text-box-trim leading-none max-lg:trim-ex">
						nano-ux
					</span>
				</a>
				<div className="ms-auto flex shrink-0 items-center gap-3 text-sm sm:gap-5">
					<ContactButton />
					<a
						className="inline-flex items-center gap-2"
						href="https://github.com/damianobarbati/nano-ux"
						target="_blank"
						rel="noopener noreferrer"
					>
						<IGitHub aria-hidden="true" size="1em" />
						<span className="max-sm:sr-only">GitHub</span>
					</a>
					<ThemeSelector
						className="top-1.5 bottom-auto sm:right-8 lg:top-4"
						defaultTheme="dark"
						tooltipPlacement="bottom"
					/>
				</div>
			</header>
			<main id="top" className={className}>
				{children}
			</main>
			<footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border py-6">
				<div className="flex items-center gap-2 font-semibold">
					<img className="brand-logo size-8" src={darkLogo} alt="" />
					<span>nano-ux</span>
				</div>
				<p className="m-0 text-sm">
					Copyright{" "}
					<strong className="font-bold">
						<a
							className="no-underline"
							href="https://damianobarbati.github.io/hq/"
						>
							Damiano Barbati
						</a>
					</strong>
				</p>
				<div className="ms-auto flex items-center gap-4 text-sm">
					<a
						className="inline-flex items-center gap-2"
						href="https://linkedin.com/in/damianobarbati"
					>
						<ILinkedIn className="size-5 shrink-0" aria-hidden="true" />
						<span>LinkedIn</span>
					</a>
					<ContactButton />
				</div>
			</footer>
		</>
	);
};
