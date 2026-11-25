import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import react from "@vitejs/plugin-react";
import { build, createServer, type InlineConfig, preview } from "vite";
import { discoverRoutes, validateRoutes } from "../routing/routes.ts";
import { enrichRobots } from "../server/robots.ts";
import { fotoneFlags } from "../server/runtime.ts";
import { ssg } from "./index.ts";

test("maps folders to URL segments and Home to the folder index", () => {
	const pages = [
		"/views/docs/Home.page.tsx",
		"/views/docs/Setup.page.tsx",
		"/views/account/Setup.page.tsx",
	];

	const routes = discoverRoutes({ pages, options: {}, locales: [] });

	assert.deepEqual(
		routes.map(({ pathname }) => pathname),
		["/docs", "/docs/setup", "/account/setup"],
	);
});

test("rejects dotted filenames with a suggested location", () => {
	assert.throws(
		() =>
			discoverRoutes({
				pages: ["/views/Docs.Setup.page.tsx"],
				options: {},
				locales: [],
			}),
		/views\/docs\/Setup.page.tsx/,
	);
});

test("rejects pages that map to the same URL", () => {
	const pages = ["/views/Docs.page.tsx", "/views/docs/Home.page.tsx"];
	const routes = discoverRoutes({ pages, options: {}, locales: [] });

	assert.throws(
		() => validateRoutes({ routes, locales: [] }),
		/Duplicate SSG route/,
	);
});

test("reserves index.html for the root document even without a home page", () => {
	const routes = discoverRoutes({
		pages: ["/views/Index.page.tsx"],
		options: {},
		locales: [],
	});

	assert.throws(
		() => validateRoutes({ routes, locales: [] }),
		/conflicts with the root index.html/,
	);
});

test("resolves site, page and entry metadata independently for each URL", () => {
	const page = "/views/Guide.page.tsx";
	const timestamp = "2026-11-25T00:00:00.000Z";

	const routes = discoverRoutes({
		pages: [page],
		locales: [],
		timestamp,
		site: {
			url: "https://example.com",
			name: "Example",
			titleTemplate: "%s | Example",
			metadata: {
				social: {
					card: "summary_large_image",
					image: { url: "/cover.webp", alt: "Cover", width: 600 },
				},
			},
		},
		options: {
			[page]: {
				metadata: {
					title: "Guide",
					description: "Getting started",
					robots: { follow: false },
					llms: { links: [{ group: "Guides" }], content: true },
				},
				pattern: "/guide/:slug?",
				entries: [
					{ params: {} },
					{
						params: { slug: "setup" },
						metadata: {
							title: "Setup",
							robots: { crawl: false, index: false },
							llms: { links: false },
							social: { image: { url: "/setup.webp", alt: "Setup" } },
							lastModified: "2026-10-01",
							jsonLd: false,
						},
					},
				],
			},
		},
	});

	const [overview, setup] = routes;

	assert.equal(overview.metadata?.lastModified, timestamp);
	assert.deepEqual(overview.metadata?.llms, [{ group: "Guides" }]);
	assert.equal(setup.assistant, true);
	assert.equal(setup.robots, "disallow");
	assert.equal(setup.metadata?.indexable, false);
	assert.equal(setup.metadata?.follow, false);
	assert.deepEqual(setup.metadata?.llms, []);
	assert.equal(setup.metadata?.jsonLd, undefined);
	assert.equal(setup.metadata?.documentTitle, "Setup | Example");
	assert.equal(setup.metadata?.lastModified, "2026-10-01");
	assert.equal(setup.metadata?.social?.card, "summary_large_image");

	assert.deepEqual(setup.metadata?.social?.image, {
		url: "https://example.com/setup.webp",
		alt: "Setup",
	});
});

test("rejects ambiguous or incorrectly prefixed localized entries", () => {
	const page = "/views/Guide.page.tsx";

	const discover = (route: import("../routing/routes.ts").PageRoute) => {
		const routes = discoverRoutes({
			pages: [page],
			options: { [page]: route },
			locales: ["en", "it"],
		});

		return routes;
	};

	assert.throws(
		() => discover({ entries: [{ path: "/help" }] }),
		/Specify locale/,
	);

	assert.throws(
		() => discover({ entries: [{ path: "/en/help", locale: "it" }] }),
		/Expected locale prefix/,
	);

	// @ts-expect-error JavaScript callers must receive the same validation.
	assert.throws(
		() => discover({ pattern: "/help", entries: [{ path: "/en/help" }] }),
		/Choose a path or pattern/,
	);
});

test("enriches crawler groups while preserving existing blocks", () => {
	const source = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /account",
		"",
		"User-agent: SearchBot",
		"Allow: /account$ # Account rule",
		"Allow: /",
		"Disallow: /private/*",
		"",
	].join("\n");

	const result = enrichRobots({
		source,
		paths: ["/account", "/private/settings"],
	});

	assert.equal(
		result,
		[
			"User-agent: *",
			"Allow: /",
			"Disallow: /account",
			"Disallow: /private/settings$",
			"",
			"User-agent: SearchBot",
			"Disallow: /account$ # Account rule",
			"Allow: /",
			"Disallow: /private/*",
			"",
		].join("\n"),
	);
});

test("generates route output and serves matching dev and preview responses", async (context) => {
	const root = await mkdtemp(join(import.meta.dirname, ".ssg-test-"));

	context.after(async () => {
		await rm(root, { recursive: true, force: true });
	});

	await mkdir(join(root, "views"));
	await mkdir(join(root, "views", "legal"), { recursive: true });
	await mkdir(join(root, "public"));

	await writeFile(
		join(root, "public/robots.txt"),
		"User-agent: *\nAllow: /\nDisallow: /en/account\nSitemap: https://example.com/other.xml\n",
	);

	const template =
		'<!doctype html><html lang="en"><head><!--route-metadata--></head><body><div id="root"><!--route-ssg--></div><script type="module" src="/main.ts"></script></body></html>';

	await writeFile(join(root, "index.html"), template);

	await writeFile(
		join(root, ".env"),
		"SSG_PUBLIC_KEY=staging\nSSG_PRIVATE_KEY=internal\n",
	);

	await writeFile(join(root, "main.ts"), 'import "virtual:ssg/client";');

	await writeFile(
		join(root, "views/Home.page.tsx"),
		'export const route = { metadata: {title: "Home"} }; export const Page = () => <h1>Home</h1>;',
	);

	await writeFile(
		join(root, "views/legal/Terms.page.tsx"),
		'export const Page = () => <h1>Terms</h1>; export const route = { locales: false, metadata: { title: "Legal terms" } };',
	);

	await writeFile(
		join(root, "views/Account.page.tsx"),
		'export const Page = () => <h1>Account</h1>; export const route = { metadata: { title: "Account", robots: {crawl: false} }, render: "shell" };',
	);

	await writeFile(
		join(root, "views/NotFound.page.tsx"),
		'export const Page = ({ params }) => <h1>{params.lang + " missing page"}</h1>;',
	);

	await writeFile(
		join(root, "views/Solution.page.tsx"),
		`
    export const Page = ({ params }) => <><meta name="twitter:title" content={params.slug} /><h1>{params.slug}</h1></>;
    export const Head = ({ params }) => <meta property="og:title" content={params.slug} />;
    export const route = {
      entries: [
        { locale: 'en', path: '/en/solution/enterprise/hiring', params: { slug: 'hiring' } },
        { locale: 'en', path: '/en/solution/dating', params: { slug: 'dating' } },
        { locale: 'it', path: '/it/soluzioni/incontri', params: { slug: 'incontri' } },
      ],
      metadata: ({ params }) => ({
        contentId: params.slug === 'hiring' ? 'hiring' : 'dating',
        title: params.slug,
        description: 'Solution',
        jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: params.slug + ' </script>' },
        llms: {content: true, links: params.lang === 'en' ? [{ group: 'Solutions' }] : []},
      }),
    };
  `,
	);

	const runtime = { locales: ["en", "it"], env: ["SSG_PUBLIC_KEY"] };

	const directory = join(root, "config");

	await mkdir(directory);

	const configFile = join(directory, "vite.config.ts");

	await writeFile(configFile, "export default {};");

	await writeFile(
		join(root, "runtime.ts"),
		`export const runtime = ${JSON.stringify(runtime)} as const;`,
	);

	await writeFile(
		join(directory, "ssg.config.ts"),
		`import { runtime } from '../runtime.ts';
     export default { locales: runtime.locales, publicEnv: runtime.env, site: { url: 'https://example.com', name: 'Example' }, excerpts: '/overridden.ts' };`,
	);

	const config: InlineConfig = {
		configFile,
		root,
		logLevel: "silent",
		plugins: [
			react(),
			ssg({
				excerpts: ({ route, html }) => [
					{ href: route.pathname, title: route.params.slug, text: html },
				],
			}),
		],
	};

	const jsonLdScript = /<script type="application\/ld\+json">([^<]*)<\/script>/;
	let devRobots: string;

	const server = await createServer({
		...config,
		server: { host: "127.0.0.1", port: 0 },
	});

	try {
		await server.listen();
		assert.ok(server.httpServer);

		const { port } = server.httpServer.address() as AddressInfo;
		const origin = `http://127.0.0.1:${port}`;
		const robots = await fetch(`${origin}/robots.txt`);

		assert.equal(robots.status, 200);
		devRobots = await robots.text();

		const redirect = await fetch(`${origin}/?ref=a%20b`, {
			headers: { "Accept-Language": "en;q=0.2, it-IT;q=0.8" },
			redirect: "manual",
		});

		assert.equal(redirect.status, 302);
		assert.equal(redirect.headers.get("Location"), "/it?ref=a%20b");

		assert.match(
			redirect.headers.get("Vary") ?? "",
			/(?:^|, )Accept-Language(?:,|$)/i,
		);

		assert.deepEqual(await (await fetch(`${origin}/env`)).json(), {
			SSG_PUBLIC_KEY: "staging",
		});

		assert.equal(
			await (await fetch(`${origin}/env`, { method: "HEAD" })).text(),
			"",
		);

		assert.equal(
			(await fetch(`${origin}/env`, { method: "POST" })).status,
			405,
		);

		const page = await (await fetch(`${origin}/it/soluzioni/incontri`)).text();

		assert.match(
			page,
			/<head>[\s\S]*<title>incontri<\/title>[\s\S]*og:title[\s\S]*<\/head>/,
		);

		assert.match(page.split("</head>")[0], jsonLdScript);

		assert.match(
			page.split("</head>")[0],
			/name="twitter:title" content="incontri"/,
		);

		assert.match(page, /<h1>incontri<\/h1>/);
		assert.match(page, /@vite\/client/);
		assert.match(page, /@react-refresh/);

		const index = await (await fetch(`${origin}/llms-index.json`)).json();

		assert.equal(index.length, 3);

		const missing = await fetch(`${origin}/it/soluzioni/hiring`);

		assert.equal(missing.status, 404);
		assert.match(await missing.text(), /it missing page/);

		assert.match(
			await (await fetch(`${origin}/legal/terms`)).text(),
			/<title>Legal terms<\/title>/,
		);

		assert.match(
			await (await fetch(`${origin}/en`)).text(),
			/<title>Home<\/title>/,
		);

		const clientRoutes = `${origin}/@id/__x00__virtual:ssg/routes`;

		assert.match(await (await fetch(clientRoutes)).text(), /Legal terms/);

		await writeFile(
			join(root, "views/legal/Terms.page.tsx"),
			'export const Page = () => <h1>Terms</h1>; export const route = { locales: false, metadata: { title: "Updated terms" } };',
		);

		let updated = "";

		for (let attempt = 0; attempt < 20; attempt += 1) {
			updated = await (await fetch(clientRoutes)).text();

			if (updated.includes("Updated terms")) break;
			await setTimeout(25);
		}

		assert.match(updated, /Updated terms/);

		await writeFile(
			join(root, "views/About.page.tsx"),
			"export const Page = () => <h1>About</h1>;",
		);

		let added = await fetch(`${origin}/en/about`);

		for (let attempt = 0; added.status === 404 && attempt < 20; attempt += 1) {
			await added.arrayBuffer();
			await setTimeout(25);
			added = await fetch(`${origin}/en/about`);
		}

		assert.match(await added.text(), /<h1>About<\/h1>/);

		assert.match(
			await (await fetch(clientRoutes)).text(),
			/"pathname":"\/en\/about"/,
		);
	} finally {
		await server.close();
	}

	await build(config);

	const italian = await readFile(
		join(root, "dist/it/soluzioni/incontri.html"),
		"utf8",
	);

	const script = jsonLdScript.exec(italian.split("</head>")[0]);

	assert.ok(script);

	assert.deepEqual(JSON.parse(script[1]), {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "incontri </script>",
	});

	assert.match(
		italian,
		/href[Ll]ang="en" href="https:\/\/example\.com\/en\/solution\/dating"/,
	);

	assert.match(italian, /lang="it"/);

	assert.match(
		await readFile(
			join(root, "dist/en/solution/enterprise/hiring.html"),
			"utf8",
		),
		/<h1>hiring<\/h1>/,
	);

	assert.match(
		await readFile(join(root, "dist/en/account.html"), "utf8"),
		/<div id="root"><\/div>/,
	);

	assert.match(
		await readFile(join(root, "dist/legal/terms.html"), "utf8"),
		/<title>Updated terms<\/title>/,
	);

	assert.match(
		await readFile(join(root, "dist/it/404.html"), "utf8"),
		/it missing page/,
	);

	assert.doesNotMatch(
		await readFile(join(root, "dist/sitemap.xml"), "utf8"),
		/account|404/,
	);

	assert.match(
		await readFile(join(root, "dist/llms.txt"), "utf8"),
		/## Solutions/,
	);

	const index = JSON.parse(
		await readFile(join(root, "dist/llms-index.json"), "utf8"),
	);

	assert.deepEqual(index[2], {
		href: "/it/soluzioni/incontri",
		title: "incontri",
		text: "<h1>incontri</h1>",
	});

	const robots = await readFile(join(root, "dist/robots.txt"), "utf8");

	assert.equal(robots, devRobots);
	assert.match(robots, /^Disallow: \/it\/account\$$/m);
	assert.doesNotMatch(robots, /^Disallow: \/en\/account\$$/m);
	assert.match(robots, /Sitemap: https:\/\/example\.com\/sitemap\.xml/);
	assert.match(robots, /Sitemap: https:\/\/example\.com\/other\.xml/);

	assert.doesNotMatch(
		await readFile(join(root, "dist/routes.json"), "utf8"),
		/staging|internal|SSG_PRIVATE_KEY/,
	);

	assert.deepEqual(fotoneFlags(runtime), [
		"--langs",
		"en,it",
		"--env-json",
		"SSG_PUBLIC_KEY",
	]);

	const built = await preview({
		...config,
		preview: { host: "127.0.0.1", port: 0 },
	});

	try {
		const { port } = built.httpServer.address() as AddressInfo;
		const origin = `http://127.0.0.1:${port}`;

		assert.equal((await fetch(`${origin}/it/missing`)).status, 404);
		assert.equal((await fetch(`${origin}/en/solution/dating`)).status, 200);

		assert.deepEqual(await (await fetch(`${origin}/env`)).json(), {
			SSG_PUBLIC_KEY: "staging",
		});
	} finally {
		await built.close();
	}
});

test("uses built-in rendering and supports optional project overrides", async (context) => {
	const root = await mkdtemp(join(import.meta.dirname, ".ssg-test-"));

	context.after(async () => {
		await rm(root, { recursive: true, force: true });
	});

	await mkdir(join(root, "views"));

	await writeFile(
		join(root, "views/About.page.tsx"),
		`
    import { NavLink } from "virtual:ssg/router";
    export const Page = () => <><header><NavLink href="/about">About</NavLink><NavLink href="/">Menu</NavLink></header><main>About us</main></>;
    export const route = { metadata: { title: 'About', llms: { content: true } } };
  `,
	);

	const config: InlineConfig = {
		root,
		configFile: false,
		logLevel: "silent",
		oxc: { jsx: { runtime: "automatic" } },
	};

	const server = await createServer({
		...config,
		plugins: [ssg()],
		optimizeDeps: { include: ["react"] },
		server: { host: "127.0.0.1", port: 0 },
	});

	try {
		await server.listen();

		const includes = server.environments.client.config.optimizeDeps.include;

		assert.ok(includes.includes("react-dom/client"));
		assert.ok(includes.includes("react"));
		assert.ok(server.httpServer);

		const { port } = server.httpServer.address() as AddressInfo;
		const origin = `http://127.0.0.1:${port}`;
		const html = await (await fetch(`${origin}/about`)).text();

		assert.match(html, /<main>About us<\/main>/);

		const client = html.match(/src="([^"]+html-proxy[^"]+)"/);

		assert.ok(client);

		const script = await fetch(
			new URL(client[1].replaceAll("&amp;", "&"), origin),
		);

		assert.match(await script.text(), /client\.tsx/);
	} finally {
		await server.close();
	}

	await build({ ...config, plugins: [ssg()] });

	const about = await readFile(join(root, "dist/about.html"), "utf8");

	assert.match(
		about,
		/<a [^>]*aria-current="page"[^>]*>About<\/a><a href="\/">Menu<\/a>/,
	);

	const index = JSON.parse(
		await readFile(join(root, "dist/llms-index.json"), "utf8"),
	);

	assert.deepEqual(index, [
		{ title: "About", href: "/about", text: "About us" },
	]);

	await writeFile(
		join(root, "entry-server.tsx"),
		"export const Layout = ({children}) => <section>{children}</section>;",
	);

	await build({ ...config, plugins: [ssg()] });

	assert.match(
		await readFile(join(root, "dist/about.html"), "utf8"),
		/<section><header>/,
	);

	await writeFile(
		join(root, "index.tsx"),
		"export const Layout = ({children}) => <article>{children}</article>;",
	);

	await writeFile(
		join(root, "text.ts"),
		'export const excerpts = () => [{ title: "Custom", text: "Excerpt", href: "/about" }];',
	);

	await writeFile(
		join(root, "ssg.config.ts"),
		"import { excerpts } from './text.ts'; export default { excerpts };",
	);

	await build({ ...config, plugins: [ssg()] });

	assert.match(
		await readFile(join(root, "dist/about.html"), "utf8"),
		/<article><header>/,
	);

	assert.deepEqual(
		JSON.parse(await readFile(join(root, "dist/llms-index.json"), "utf8")),
		[{ title: "Custom", text: "Excerpt", href: "/about" }],
	);

	await assert.rejects(
		build({ ...config, plugins: [ssg({ excerpts: "/index.tsx" })] }),
		/Missing excerpts export in \/index\.tsx/,
	);

	const rootComponent =
		"export default function Shell({children}) { return <aside>{children}</aside>; }";

	await writeFile(join(root, "index.tsx"), rootComponent);
	await build({ ...config, plugins: [ssg()] });

	assert.match(
		await readFile(join(root, "dist/about.html"), "utf8"),
		/<aside><header>/,
	);

	await writeFile(
		join(root, "index.tsx"),
		`${rootComponent}\nexport const Layout = ({children}) => <nav>{children}</nav>;`,
	);

	await build({ ...config, plugins: [ssg()] });

	assert.match(
		await readFile(join(root, "dist/about.html"), "utf8"),
		/<aside><header>/,
	);

	await writeFile(
		join(root, "index.tsx"),
		"export const Shell = ({children}) => <aside>{children}</aside>;",
	);

	await assert.rejects(
		build({ ...config, plugins: [ssg()] }),
		/Expected a default export or a named Layout export in \/index\.tsx/,
	);

	await writeFile(join(root, "ssg.config.ts"), "{");

	await assert.rejects(
		build({ ...config, plugins: [ssg()] }),
		/Cannot read .*ssg\.config\.ts/,
	);
});
