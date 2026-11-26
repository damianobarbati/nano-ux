import cx from "clsx-tw";
import * as z from "zod/mini";
import { Code, CodePropsSchema } from "../../components/Code.tsx";

const examples = [
	{ language: "html", text: '<script src="/app.ts"></script>' },
	{
		language: "typescript",
		text: 'const count: number = 12;\nconsole.log("Ready", count);',
	},
	{ language: "javascript", text: "const result = await loadProject(id);" },
	{
		language: "shell",
		text: 'curl -H "Authorization: Bearer token" https://api.example.com/health',
	},
	{ language: "json", text: '{"matched": true, "score": 0.98}' },
	{ language: "text", text: '<script>alert("Text stays escaped")</script>' },
];

export const Preview = () => (
	<main className="grid min-w-0 gap-6 p-6 lg:grid-cols-2">
		{(["light", "dark"] as const).map((theme) => (
			<section
				className={cx(
					theme,
					"grid min-w-0 gap-6 rounded-card bg-bg p-6 text-fg",
				)}
				key={theme}
			>
				<h2>{theme === "light" ? "Light theme" : "Dark theme"}</h2>
				{examples.map(({ language, text }) => (
					<section className="min-w-0" key={language}>
						<h3>{language}</h3>
						<Code language={language} text={text} />
					</section>
				))}
				<section className="min-w-0">
					<h3>Without copy</h3>
					<Code {...defaults} copyable={false} />
				</section>
				<section className="card card-tint tint-mint grid min-w-0 gap-2">
					<h3>Mint card</h3>
					<Code {...defaults} />
					<Code {...defaults} copyable={false} />
				</section>
			</section>
		))}
	</main>
);

export const layout = "fullscreen";

export const schema = z.pick(CodePropsSchema, {
	text: true,
	language: true,
	copyable: true,
});

export const defaults = { text: "const count = 12;", language: "typescript" };

export const Playground = (props: z.infer<typeof schema>) => (
	<Code {...props} />
);

export const section = "Components";
