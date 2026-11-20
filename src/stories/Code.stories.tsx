import type { Meta, StoryObj } from "@storybook/react-vite";
import cx from "clsx-tw";
import { Code } from "../components/Code.tsx";

const meta = {
	title: "Components / Code",
	component: Code,
	args: { language: "typescript", text: "const count: number = 12;" },
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Code>;

export default meta;

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

export const Variants: StoryObj<typeof meta> = {
	name: "Code",
	render: () => (
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
						<Code {...meta.args} copyable={false} />
					</section>
				</section>
			))}
		</main>
	),
};
