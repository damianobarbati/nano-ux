import cx from "clsx-tw";
import { IChevronDown } from "nano-ux/icons";
import React from "react";
import { referenceLinks } from "./Reference.tsx";

type ReferenceNavigationProps = {
	className?: string;
	onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const ReferenceNavigation = ({
	className,
	onNavigate,
}: ReferenceNavigationProps) => {
	const dropdown = React.useRef<HTMLDetailsElement>(null);
	return (
		<div
			className={cx("relative flex items-center", className)}
			onPointerEnter={(event) => {
				if (event.pointerType === "mouse" && dropdown.current) {
					dropdown.current.open = true;
				}
			}}
			onPointerLeave={(event) => {
				if (event.pointerType === "mouse" && dropdown.current) {
					dropdown.current.open = false;
				}
			}}
		>
			<a className="ps-2 max-lg:py-3" href="#reference" onClick={onNavigate}>
				Reference
			</a>
			<details
				className="group"
				ref={dropdown}
				onBlur={(event) => {
					if (
						event.relatedTarget &&
						!event.currentTarget.contains(event.relatedTarget)
					) {
						event.currentTarget.open = false;
					}
				}}
				onKeyDown={(event) => {
					if (event.key !== "Escape" || !event.currentTarget.open) return;

					event.stopPropagation();
					event.currentTarget.open = false;

					const toggle = event.currentTarget.querySelector("summary");
					if (toggle) toggle.focus();
				}}
			>
				<summary
					className="flex size-9 cursor-pointer list-none items-center ps-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden"
					aria-label="Toggle Reference links"
				>
					<IChevronDown
						className="size-4 group-open:rotate-180"
						aria-hidden="true"
					/>
				</summary>
				<ul
					className="card-outline absolute inset-x-0 top-full z-10 m-0 max-h-[50dvh] list-none overflow-y-auto overscroll-contain bg-bg py-3 lg:end-auto lg:w-max lg:max-w-xs"
					aria-label="Reference links"
				>
					{referenceLinks.map(({ id, kind, title }) => (
						<li key={id}>
							<a
								className="block rounded-control px-2 py-2 wrap-anywhere hover:bg-layer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
								href={`#${id}`}
								onClick={(event) => {
									onNavigate(event);

									if (dropdown.current) dropdown.current.open = false;
								}}
							>
								<span className="reference-kind">{kind}</span> {title}
							</a>
						</li>
					))}
				</ul>
			</details>
		</div>
	);
};
