"use client";

import cx from "clsx-tw";
import type PrismInstance from "prismjs";
import React from "react";
import { createPortal } from "react-dom";
import { ICopy } from "../icons.tsx";
import { Spinner } from "./Spinner.tsx";
import { Toast } from "./Toast.tsx";

const codeClassName =
	"prism-code min-w-0 overflow-x-auto rounded-control bg-layer p-6 font-mono text-sm leading-6 whitespace-pre text-fg";

const grammarNames: Record<string, string> = {
	html: "markup",
	shell: "bash",
};

export type CodeProps = {
	text: string;
	language: string;
	className?: string;
	strings?: {
		loading?: string;
		copy?: string;
		copied?: string;
		copyFailed?: string;
		dismiss?: string;
	};
	copyable?: boolean;
};

export const Code = ({
	className,
	text,
	language,
	copyable = true,
	strings,
}: CodeProps) => {
	const [prism, setPrism] = React.useState<typeof PrismInstance | null>();

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

	if (prism === undefined) {
		code = <Spinner centered label={strings?.loading} />;
	} else if (prism && grammar && typeof grammar === "object") {
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
				"relative min-w-0 rounded-control bg-layer pr-14",
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
