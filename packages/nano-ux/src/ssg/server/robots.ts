import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type RobotsRule = { name: "allow" | "disallow"; pattern: string; line: number };
type RobotsGroup = { agents: string[]; rules: RobotsRule[]; end: number };

export const readRobots = async (publicDir: string) => {
	if (!publicDir) return;

	try {
		const source = await readFile(resolve(publicDir, "robots.txt"), "utf8");
		return source;
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "ENOENT"))
			throw error;
	}
};

const groupsFrom = (lines: string[]) => {
	const groups: RobotsGroup[] = [];
	let group: RobotsGroup | undefined;

	for (const [line, text] of lines.entries()) {
		const match = /^\s*(user-agent|allow|disallow)\s*:\s*([^#]*)/i.exec(text);
		if (!match) continue;

		const name = match[1].toLowerCase();
		const value = match[2].trim();

		if (name === "user-agent") {
			if (!group || group.rules.length) {
				group = { agents: [], rules: [], end: line };
				groups.push(group);
			}

			group.agents.push(value);
			group.end = line;
		} else if (group) {
			group.rules.push({
				name: name === "allow" ? "allow" : "disallow",
				pattern: value,
				line,
			});

			group.end = line;
		}
	}

	return groups;
};

const matchLength = ({
	pattern,
	pathname,
}: {
	pattern: string;
	pathname: string;
}) => {
	if (!pattern) return -1;

	const exact = pattern.endsWith("$");
	const path = exact ? pattern.slice(0, -1) : pattern;
	const parts = path.split("*").map((part) => RegExp.escape(part));

	const matches = new RegExp(`^${parts.join(".*")}${exact ? "$" : ""}`).test(
		pathname,
	);

	return matches ? pattern.replaceAll("*", "").length : -1;
};

const allowed = ({
	rules,
	pathname,
}: {
	rules: RobotsRule[];
	pathname: string;
}) => {
	let allow = -1;
	let disallow = -1;

	for (const { name, pattern } of rules) {
		const length = matchLength({ pattern, pathname });

		if (name === "allow") allow = Math.max(allow, length);
		else disallow = Math.max(disallow, length);
	}

	return allow >= disallow;
};

export const enrichRobots = ({
	source,
	paths,
	sitemap,
}: {
	source: string;
	paths: string[];
	sitemap?: string;
}) => {
	const newline = source.includes("\r\n") ? "\r\n" : "\n";
	const lines = source.split(/\r?\n/);
	const groups = groupsFrom(lines);
	const additions: string[] = [];

	if (
		sitemap &&
		!lines.some(
			(line) =>
				/^\s*sitemap\s*:/i.test(line) &&
				line.slice(line.indexOf(":") + 1).trim() === sitemap,
		)
	) {
		additions.push(`Sitemap: ${sitemap}`);
	}

	if (paths.length && !groups.some(({ agents }) => agents.includes("*"))) {
		additions.unshift(
			"User-agent: *",
			...paths.map((path) => `Disallow: ${path}$`),
		);
	}

	for (const { rules, end } of groups.reverse()) {
		const generated: string[] = [];

		for (const pathname of paths) {
			if (!allowed({ rules, pathname })) continue;

			const exact = rules.filter(
				({ name, pattern }) => name === "allow" && pattern === `${pathname}$`,
			);

			if (!exact.length) {
				generated.push(`Disallow: ${pathname}$`);
				continue;
			}

			for (const { line } of exact) {
				lines[line] = lines[line].replace(/^(\s*)allow(?=\s*:)/i, "$1Disallow");
			}
		}

		lines.splice(end + 1, 0, ...generated);
	}

	if (additions.length) {
		if (lines.at(-1) === "") lines.pop();

		if (lines.length) lines.push("");

		lines.push(...additions, "");
	}

	const result = lines.join(newline);
	return result;
};
