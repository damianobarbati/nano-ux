import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "vite";

test("demo build includes readable content before JavaScript runs", async () => {
	const outDir = await mkdtemp(join(tmpdir(), "nano-ux-demo-"));

	try {
		await build({
			root: import.meta.dirname,
			base: "/nano-ux/",
			build: { outDir },
		});

		const html = await readFile(join(outDir, "index.html"), "utf8");

		const themePreview = await readFile(
			join(outDir, "theme-preview.html"),
			"utf8",
		);

		assert.match(
			themePreview,
			/<script type="module"[^>]+src="\/nano-ux\/assets\/[^"]+\.js"/,
		);

		assert.match(html, /<html lang="en" class="dark">/);
		assert.match(html, /<div id="root"><header\b/);

		assert.match(
			html,
			/<header\b[^>]*>(?:(?!<\/header>).)*<button\b[^>]*\baria-label="Theme: Dark"/s,
		);

		assert.match(html, /<noscript><code>import /);

		assert.doesNotMatch(
			html,
			/<header\b[^>]*>(?:(?!<\/header>).)*>Storybook<\/a>/s,
		);

		assert.match(
			html,
			/<span>Contact me<\/span><\/button><a\b[^>]*href="https:\/\/github\.com\/damianobarbati\/nano-ux"/,
		);

		assert.match(html, /src="\/nano-ux\/assets\/[^"]+\.js"/);
		assert.match(html, /<a\b[^>]*href="#reference">Reference<\/a>/);
		assert.doesNotMatch(html, />Code examples<\//);

		const footer = html.match(/<\/main><footer\b[^>]*>(.*?)<\/footer>/s);

		assert.ok(footer);

		assert.match(
			footer[1],
			/<img\b[^>]*class="brand-logo [^"]+"[^>]*\/><span>nano-ux<\/span>/,
		);

		assert.match(
			footer[1],
			/<p\b[^>]*>Copyright(?:<!-- -->)? (?:<!-- -->)?<strong\b[^>]*><a\b[^>]*href="https:\/\/damianobarbati\.github\.io\/hq\/">Damiano Barbati<\/a><\/strong><\/p>/,
		);

		assert.match(
			footer[1],
			/<a\b[^>]*href="https:\/\/linkedin\.com\/in\/damianobarbati"><svg\b[^>]*aria-hidden="true"[^>]*>.*?<\/svg><span>LinkedIn<\/span><\/a><button\b[^>]*type="button"><svg\b[^>]*aria-hidden="true"[^>]*>.*?<\/svg><span>Contact me<\/span><\/button>/s,
		);

		assert.doesNotMatch(html, /mailto:|damiano\.barbati@gmail\.com/);

		assert.match(
			html,
			/<section id="reference"[^>]*><h2 id="quick-reference"[^>]*>Reference<\/h2>/,
		);

		const classCatalog = html.slice(
			html.indexOf('id="reference-classes"'),
			html.indexOf('<article id="reference-theme"'),
		);

		const classHeadings = Array.from(
			classCatalog.matchAll(
				/<h3\b[^>]*><span class="reference-kind">CSS<\/span> (?:<!-- -->)?([^<]+)<\/h3>/g,
			),
			([, title]) => title,
		);

		assert.deepEqual(classHeadings, [
			".card, .card-shell, .card-outline, .card-ghost, .card-tint",
			".tint, .tint-cocoa, .tint-mint, .tint-mintlight, .tint-lime, .tint-cyan, .tint-ocean, .tint-violet, .tint-berry",
			".glow, .glow-cocoa, .glow-mint, .glow-mintlight, .glow-lime, .glow-cyan, .glow-ocean, .glow-violet, .glow-berry",
			".text-glow, .text-glow-brand, .text-glow-*",
			".anchor",
			".typo-lg, .prose, .heading-hero, .text-box-trim, .trim-ex",
			".light, .dark, .invert",
			".bg-surface, .text-fg-muted, .border-border, .rounded-card",
		]);

		assert.match(
			classCatalog,
			/<a class="anchor" href="#typography">Typography<\/a>/,
		);

		assert.match(
			classCatalog,
			/<code class="text-glow-\[#0ff\]">\.text-glow-\[#0ff\]<\/code>/,
		);

		assert.match(
			classCatalog,
			/<article id="reference-css-tints"[^>]*>(?:(?!<\/article>).)*?<ul[^>]*><li class="tint [^"]*"><code>\.tint<\/code><\/li>/s,
		);

		assert.match(
			classCatalog,
			/<li class="tint [^"]*\btint-\[#0ff\]"><code>\.tint-\[#0ff\]<\/code><\/li>/,
		);

		assert.match(
			classCatalog,
			/<li class="card card-tint [^"]*\bglow-\[#0ff\]"><code>\.glow-\[#0ff\]<\/code><\/li>/,
		);

		assert.doesNotMatch(
			classCatalog,
			/<code>\.(?:empty-state|badge|button|control)(?:-|<)/,
		);

		assert.doesNotMatch(classCatalog, /<code\b[^>]*>(?!\.)/);

		const reference = html.slice(html.indexOf('<section id="reference"'));

		assert.match(
			reference,
			/<iframe\b[^>]*src="\/nano-ux\/theme-preview\.html"[^>]*title="ThemeSelector preview"/,
		);

		const dropdown = html.match(
			/<ul\b[^>]*aria-label="Reference links"[^>]*>(.*?)<\/ul>/s,
		);

		assert.ok(dropdown);

		const linkedIds = Array.from(
			dropdown[1].matchAll(/href="#([^"]+)"/g),
			([, id]) => id,
		);

		const entryIds = Array.from(
			reference.matchAll(/<article\b[^>]*\bid="(reference-[^"]+)"/g),
			([, id]) => id,
		);

		assert.deepEqual(linkedIds, entryIds);

		assert.deepEqual(entryIds.slice(classHeadings.length), [
			"reference-theme",
			"reference-dialog",
			"reference-toast",
			"reference-mockup",
			"reference-code",
			"reference-form",
			"reference-selectmulti",
			"reference-button",
			"reference-accordion",
			"reference-tooltip",
			"reference-chart-line",
			"reference-chart-bar",
			"reference-chart-pie",
			"reference-world-map",
			"reference-table",
			"reference-table-virtual",
			"reference-use-in-view-once",
			"reference-keys-to-date",
		]);

		assert.match(
			dropdown[1],
			/href="#reference-css-anchor"><span class="reference-kind">CSS<\/span> (?:<!-- -->)?\.anchor<\/a>/,
		);

		assert.match(
			dropdown[1],
			/href="#reference-mockup"><span class="reference-kind">Component<\/span> (?:<!-- -->)?Mockup<\/a>/,
		);

		const entryKinds = Array.from(
			reference.matchAll(
				/<h3\b[^>]*><span class="reference-kind">([^<]+)<\/span>/g,
			),
			([, kind]) => kind,
		);

		assert.deepEqual(entryKinds, [
			...classHeadings.map(() => "CSS"),
			...Array(16).fill("Component"),
			"Hook",
			"Function",
		]);

		assert.match(
			reference,
			/<article id="reference-table-virtual"[^>]*>(?:(?!<\/article>).)*<div class="table-footer"><span>10,000 results<\/span><\/div>/s,
		);

		for (const [id, snippet] of [
			["theme", "import { ThemeSelector } from &quot;nano-ux&quot;"],
			["form", "import { Button, Form, Input } from &quot;nano-ux&quot;"],
			["dialog", "import { Button, Dialog } from &quot;nano-ux&quot;"],
			["button", "import { Button } from &quot;nano-ux&quot;"],
			["accordion", "import { Accordion } from &quot;nano-ux&quot;"],
			["tooltip", "import { Button, Tooltip } from &quot;nano-ux&quot;"],
			["table", "import { Table, type TableColumn } from &quot;nano-ux&quot;"],
			["chart-bar", "from &quot;nano-ux/charts/bar&quot;"],
			["chart-line", "from &quot;nano-ux/charts/line&quot;"],
			["chart-pie", "import { ChartPie } from &quot;nano-ux&quot;"],
			["world-map", "from &quot;nano-ux/charts/world-map&quot;"],
			["code", "import { Code } from &quot;nano-ux&quot;"],
		]) {
			const start = reference.indexOf(`<article id="reference-${id}"`);

			const article = reference.slice(
				start,
				reference.indexOf("</article>", start),
			);

			const source = article.match(
				/<noscript><code>(.*?)<\/code><\/noscript>/s,
			);

			assert.ok(source && source[1].includes(snippet), id);
		}

		const colorForm = Array.from(
			reference.matchAll(/<noscript><code>(.*?)<\/code><\/noscript>/gs),
		).find(([, snippet]) => snippet.includes("export const ColorForm"));

		assert.ok(colorForm);

		assert.match(
			colorForm[1],
			/mode=&quot;one&quot; options=\{options\} searchable=\{false\}/,
		);

		assert.match(colorForm[1], /mode=&quot;many&quot; options=\{options\}/);
		assert.match(colorForm[1], /options=\{options\} searchable=\{false\}/);
		assert.match(colorForm[1], /mode=&quot;many&quot; fetcher=\{fetcher\}/);
		assert.match(colorForm[1], /Reload options[\s\S]+Save/);
		assert.match(colorForm[1], /setTimeout\(resolve, 2000\)/);

		const options = colorForm[1].match(
			/\nconst options = \[([^\n]+)\]\.map[^\n]+;$/,
		);

		assert.ok(options);

		assert.ok(
			Array.from(options[1].matchAll(/&quot;[^&]+&quot;/g)).length >= 10,
		);

		const mockupArticle = html.match(
			/<article\b[^>]*><h3\b[^>]*><span\b[^>]*>Component<\/span> (?:<!-- -->)?Mockup<\/h3>.*?<\/article>/s,
		);

		assert.ok(mockupArticle);

		const previewLabels = Array.from(
			mockupArticle[0].matchAll(
				/<figcaption[^>]*><code>([^<]+)<\/code><\/figcaption>/g,
			),
			([, label]) => label,
		);

		assert.deepEqual(previewLabels, ["terminal", "browser", "smartphone"]);

		assert.match(
			mockupArticle[0],
			/<figcaption[^>]*><code>browser<\/code><\/figcaption>.*?>Project overview<\/p>/,
		);

		assert.match(
			mockupArticle[0],
			/<figcaption[^>]*><code>smartphone<\/code><\/figcaption>.*?>Mobile inbox<\/p>/,
		);

		assert.match(
			mockupArticle[0],
			/<figcaption[^>]*><code>terminal<\/code><\/figcaption>.*?>\$ pnpm build\nBuild complete\.<\/div>/,
		);
	} finally {
		await rm(outDir, { recursive: true, force: true });
	}
});
