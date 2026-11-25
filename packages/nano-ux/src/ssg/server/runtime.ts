import type { IncomingMessage, ServerResponse } from "node:http";

export type RuntimeOptions = {
	locales?: string[];
	env?: string[];
	redirects?: {
		from: string;
		to: string;
		status?: 301 | 302 | 303 | 307 | 308;
	}[];
};

type RuntimeInput = {
	options: RuntimeOptions;
	values: Record<string, string | undefined>;
	base?: string;
};

export const fotoneFlags = ({ locales, env }: RuntimeOptions) => {
	const flags: string[] = [];

	if (locales?.length) flags.push("--langs", locales.join(","));

	if (env?.length) flags.push("--env-json", env.join(","));

	return flags;
};

const language = ({
	header,
	locales,
}: {
	header: string | undefined;
	locales: string[];
}) => {
	const preferences = (header ?? "")
		.split(",")
		.flatMap((part) => {
			const match =
				/^([a-z]{1,8}(?:-[a-z0-9]{1,8})*)(?:[ \t]*;[ \t]*q=(0(?:\.[0-9]{0,3})?|1(?:\.0{0,3})?))?$/.exec(
					part.trim().toLowerCase(),
				);

			if (!match) return [];

			const [, tag, weight] = match;
			const quality = weight === undefined ? 1 : Number(weight);
			if (quality === 0) return [];

			return [{ tag, quality }];
		})
		.sort((left, right) => right.quality - left.quality);

	for (const { tag } of preferences) {
		let candidate = tag;

		while (candidate) {
			const match = locales.find(
				(locale) => locale.toLowerCase() === candidate,
			);

			if (match) return match;

			const separator = candidate.lastIndexOf("-");

			candidate = separator < 0 ? "" : candidate.slice(0, separator);
		}
	}

	return locales[0];
};

export const withinBase = ({
	pathname,
	base,
}: {
	pathname: string;
	base: string;
}) => {
	const prefix = base === "./" ? "" : base.replace(/\/$/, "");
	if (pathname === prefix) return "/";

	if (!pathname.startsWith(`${prefix}/`)) return;

	const result = pathname.slice(prefix.length);
	return result;
};

export const runtimeMiddleware = ({
	options,
	values,
	base = "/",
}: RuntimeInput) => {
	const { locales = [], env = [], redirects = [] } = options;
	const variables: [string, string][] = [];

	for (const name of env) {
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
			throw new Error(`Invalid environment variable name: ${name}.`);

		const value = values[name];

		if (value === undefined)
			throw new Error(`Missing environment variable: ${name}.`);

		variables.push([name, value]);
	}

	const payload = JSON.stringify(Object.fromEntries(variables));
	const prefix = base === "./" ? "" : base.replace(/\/$/, "");

	const middleware = (
		request: IncomingMessage,
		response: ServerResponse,
		next: () => void,
	) => {
		const url = new URL(request.url ?? "/", "http://localhost");
		const path = withinBase({ pathname: url.pathname, base });

		if (path === undefined) {
			next();
			return;
		}

		const envRequest = path === "/env" && env.length > 0;
		const redirect = redirects.find(({ from }) => from === path);
		const localeRequest = path === "/" && locales.length > 0;

		if (!envRequest && !redirect && !localeRequest) {
			next();
			return;
		}

		if (request.method !== "GET" && request.method !== "HEAD") {
			response.writeHead(405, { Allow: "GET, HEAD" }).end();
			return;
		}

		if (envRequest) {
			response.writeHead(200, {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
			});

			response.end(request.method === "HEAD" ? undefined : payload);
			return;
		}

		if (redirect) {
			response
				.writeHead(redirect.status ?? 302, { Location: redirect.to })
				.end();

			return;
		}

		const locale = language({
			header: request.headers["accept-language"],
			locales,
		});

		const vary = response.getHeader("Vary");

		const fields =
			vary === undefined
				? []
				: String(vary)
						.split(",")
						.map((value) => value.trim());

		if (
			!fields.some(
				(value) => value === "*" || value.toLowerCase() === "accept-language",
			)
		) {
			fields.push("Accept-Language");
		}

		response
			.writeHead(302, {
				Location: `${prefix}/${locale}${url.search}`,
				Vary: fields.join(", "),
				"Cache-Control": "no-store",
			})
			.end();
	};

	return middleware;
};
