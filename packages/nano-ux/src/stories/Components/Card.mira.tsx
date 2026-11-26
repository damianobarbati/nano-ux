import cx from "clsx-tw";

import { Code } from "../../components/Code.tsx";

import { Mockup } from "../../components/Mockup.tsx";

const examples = [
	{ name: "Theme primary" },
	{ name: "Cocoa", hue: "cocoa" },
	{ name: "Mint", hue: "mint" },
	{ name: "Mintlight", hue: "mintlight" },
	{ name: "Lime", hue: "lime" },
	{ name: "Cyan", hue: "cyan" },
	{ name: "Ocean", hue: "ocean" },
	{ name: "Violet", hue: "violet" },
	{ name: "Berry", hue: "berry" },
	{ name: "Without glow", flat: true },
];

export const Preview = () => (
	<main className="mx-auto grid max-w-5xl gap-6 p-6">
		{examples.map(({ name, hue, flat }) => {
			const tintClass = hue && `tint-${hue}`;
			const glowClass = !flat && (hue ? `glow-${hue}` : "glow");
			const appearance = cx("card-tint", tintClass, glowClass);

			const modifiers = ["card-tint", tintClass, glowClass]
				.filter(Boolean)
				.join(" and .");

			return (
				<div key={name} className="grid gap-6 sm:grid-cols-3">
					<article className={cx("card grid content-start gap-2", appearance)}>
						<h2>{name}</h2>
						<p>This is .card with .{modifiers}.</p>
					</article>
					<Mockup className={cx("card-shell", appearance)} variant="terminal">
						{'$ echo "Server ready"\nServer ready'}
					</Mockup>
					<figure
						className={cx(
							"card grid min-w-0 content-start gap-2 p-4",
							appearance,
						)}
					>
						<figcaption className="font-mono text-sm text-fg-muted">
							index.ts
						</figcaption>
						<Code
							className="p-0"
							copyable={false}
							language="typescript"
							text={
								"const ports = [8080];\nconst [port] = ports;\nconsole.log(port);"
							}
						/>
					</figure>
				</div>
			);
		})}
	</main>
);

export const layout = "fullscreen";

export const section = "Components";
