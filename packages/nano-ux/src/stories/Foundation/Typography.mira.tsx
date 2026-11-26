import { Code } from "../../components/Code.tsx";

export const Preview = () => (
	<main className="grid min-h-screen items-start gap-10 p-6 lg:grid-cols-2">
		<section
			className="typo-lg min-h-screen max-w-5xl min-w-0 p-6"
			aria-label="Expanded type scale"
		>
			<h1 className="max-w-4xl">Project workspace</h1>
			<h2>Organizing your work</h2>
			<h3>Designed for people and products</h3>
			<p className="prose">
				The larger body and heading sizes create more room for content,
				storytelling and a stronger visual hierarchy.
			</p>
			<p className="prose">
				Use <strong>strong text</strong> to highlight a key phrase and{" "}
				<a href="/docs">read the documentation</a> for more detail.
			</p>
			<hr />
			<ul>
				<li>Shared project notes</li>
				<li>Quick task updates</li>
				<li>Readable results for every operator</li>
			</ul>
			<ol>
				<li>Open the project</li>
				<li>Review the captured information</li>
				<li>Confirm the result</li>
			</ol>
			<span className="prose block">
				Supporting text can sit in the flow without adding a bottom gutter.
			</span>
			<small>Changes are saved automatically.</small>
			<blockquote>Write down decisions while the details are fresh.</blockquote>
			<Code
				language="javascript"
				text="const result = await loadProject(id);"
			/>
		</section>

		<section
			className="min-h-screen max-w-5xl min-w-0 p-6"
			aria-label="Default type scale"
		>
			<h1 className="max-w-4xl">Project overview</h1>
			<h2>Recent project activity</h2>
			<h3>Last 30 days</h3>
			<p className="prose">
				Body text stays slightly smaller to support dense application interfaces
				while remaining comfortable to read.
			</p>
			<p className="prose">
				Review <strong>approved sessions</strong> or{" "}
				<a href="/docs">open the documentation</a> for the full workflow.
			</p>
			<hr />
			<ul>
				<li>Approved sessions</li>
				<li>Rejected sessions</li>
				<li>Sessions requiring review</li>
			</ul>
			<ol>
				<li>Open the session</li>
				<li>Check the evidence</li>
				<li>Resolve the review</li>
			</ol>
			<span className="prose block">
				Supporting text without an additional bottom gutter.
			</span>
			<small>Updated moments ago.</small>
			<blockquote>Write down decisions while the details are fresh.</blockquote>
			<Code language="javascript" text={'status = "approved"'} />
		</section>
	</main>
);

export const layout = "fullscreen";

export const section = "Foundation";
