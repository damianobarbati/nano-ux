"use client";

import cx from "clsx-tw";
import type PrismInstance from "prismjs";
import React from "react";
import { createPortal } from "react-dom";
import * as z from "zod/mini";
import { ICopy } from "../icons.tsx";
import { Toast } from "./Toast.tsx";

const codeClassName =
	"prism-code min-w-0 overflow-x-auto rounded-control p-6 font-mono text-sm leading-6 whitespace-pre text-fg max-md:whitespace-pre-wrap max-md:wrap-anywhere";

const grammarNames: Record<string, string> = {
	html: "markup",
	shell: "bash",
};

export const CodePropsSchema = z.object({
	text: z.string(),
	language: z.string(),
	className: z.optional(z.string()),
	strings: z.optional(
		z.object({
			loading: z.optional(z.string()),
			copy: z.optional(z.string()),
			copied: z.optional(z.string()),
			copyFailed: z.optional(z.string()),
			dismiss: z.optional(z.string()),
		}),
	),
	copyable: z.optional(z.boolean()),
});

export type CodeProps = z.infer<typeof CodePropsSchema>;

export const Code = ({
	className,
	text,
	language,
	copyable = true,
	strings,
}: CodeProps) => {
	const [prism, setPrism] = React.useState<typeof PrismInstance | null>(null);

	React.useEffect(() => {
		let mounted = true;

		const loadPrism = async () => {
			try {
				const { Prism } = await import("../helpers/prismLanguages.ts");

				if (mounted) setPrism(Prism);
			} catch {
				if (mounted) setPrism(null);
			}
		};

		void loadPrism();

		return () => {
			mounted = false;
		};
	}, []);

	const grammarName = grammarNames[language] ?? language;

	const grammar =
		prism && Object.hasOwn(prism.languages, grammarName)
			? prism.languages[grammarName]
			: undefined;

	let code;

	if (prism && grammar && typeof grammar === "object") {
		code = (
			<code
				dangerouslySetInnerHTML={{
					__html: prism.highlight(text, grammar, grammarName),
				}}
			/>
		);
	} else {
		code = <code>{text}</code>;
	}

	if (!copyable)
		return <pre className={cx(codeClassName, className)}>{code}</pre>;

	return (
		<div
			className={cx(
				"code-frame relative min-w-0 rounded-control pr-14",
				className,
			)}
		>
			<pre className={codeClassName}>{code}</pre>
			<CopyCode strings={strings} text={text} />
		</div>
	);
};

const CopyCode = ({ text, strings }: Pick<CodeProps, "text" | "strings">) => {
	const [copying, setCopying] = React.useState(false);

	const [notice, setNotice] = React.useState<{
		timestamp: number;
		tone: "success" | "warning";
	}>();

	const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const timestamp = event.timeStamp;

		setCopying(true);

		try {
			await navigator.clipboard.writeText(text);
			setNotice({ timestamp, tone: "success" });
		} catch {
			setNotice({
				timestamp,
				tone: "warning",
			});
		} finally {
			setCopying(false);
		}
	};

	return (
		<>
			<button
				type="button"
				className="button button-secondary button-outline absolute top-2 right-2 size-11 rounded-control p-0"
				title={strings?.copy ?? "Copy code"}
				disabled={copying}
				onClick={copy}
			>
				<ICopy className="size-4 shrink-0" />
			</button>
			{notice &&
				createPortal(
					<Toast
						key={notice.timestamp}
						strings={strings}
						message={
							notice.tone === "success"
								? (strings?.copied ?? "Code copied.")
								: (strings?.copyFailed ??
									"Could not copy. Select and copy the code manually.")
						}
						tone={notice.tone}
						duration={5000}
						onClose={() => setNotice(undefined)}
					/>,
					document.body,
				)}
		</>
	);
};
