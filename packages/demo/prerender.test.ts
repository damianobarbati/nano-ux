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

		assert.match(html, /<div id="root"><header\b/);
		assert.match(html, /<button\b[^>]*\baria-label="Theme: System"/);
		assert.match(html, /<noscript><code>import /);
		assert.match(html, /href="\.\/storybook-static\/index\.html"/);
		assert.match(html, /src="\/nano-ux\/assets\/[^"]+\.js"/);
	} finally {
		await rm(outDir, { recursive: true, force: true });
	}
});
