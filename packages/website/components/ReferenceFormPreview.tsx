import cx from "clsx-tw";
import { Button, Form, SelectMulti } from "nano-ux";
import React from "react";
import { useForm } from "react-hook-form";

type ReferenceFormPreviewProps = { className?: string };

type ColorFormValues = {
	color: string;
	colors: string[];
	colorsWithoutSearch: string[];
	asyncColors: string[];
};

export const ReferenceFormPreview = ({
	className,
}: ReferenceFormPreviewProps) => {
	const form = useForm<ColorFormValues>({
		defaultValues: {
			color: "",
			colors: [],
			colorsWithoutSearch: [],
			asyncColors: [],
		},
	});

	const [fetcher, setFetcher] = React.useState(() => loadColors);
	const [savedColors, setSavedColors] = React.useState<ColorFormValues>();
	const reloadOptions = () => setFetcher(() => () => loadColors());

	return (
		<Form
			className={cx("grid justify-items-start gap-3", className)}
			form={form}
			onSubmit={setSavedColors}
		>
			<SelectMulti
				className="w-full"
				name="color"
				label="Single selection"
				mode="one"
				options={colorOptions}
				searchable={false}
			/>
			<SelectMulti
				className="w-full"
				name="colors"
				label="Multiple selection"
				mode="many"
				options={colorOptions}
			/>
			<SelectMulti
				className="w-full"
				name="colorsWithoutSearch"
				label="Multiple selection without search"
				mode="many"
				options={colorOptions}
				searchable={false}
			/>
			<div className="relative w-full">
				<SelectMulti
					name="asyncColors"
					label="Async options"
					mode="many"
					fetcher={fetcher}
				/>
				<button
					className="anchor absolute end-0 top-0 text-sm"
					type="button"
					onClick={reloadOptions}
				>
					Reload options
				</button>
			</div>
			<Button className="justify-self-end" type="submit">
				Save
			</Button>
			{!!savedColors && (
				<output className="min-w-0 font-mono text-sm wrap-anywhere whitespace-pre-wrap">
					{JSON.stringify(savedColors, null, 2)}
				</output>
			)}
		</Form>
	);
};

const loadColors = async () => {
	const { promise, resolve } = Promise.withResolvers<void>();

	window.setTimeout(resolve, 2000);
	await promise;
	return colorOptions;
};

export const colorOptions = [
	{ label: "Black", value: "black" },
	{ label: "Blue", value: "blue" },
	{ label: "Brown", value: "brown" },
	{ label: "Gray", value: "gray" },
	{ label: "Green", value: "green" },
	{ label: "Orange", value: "orange" },
	{ label: "Pink", value: "pink" },
	{ label: "Purple", value: "purple" },
	{ label: "Red", value: "red" },
	{ label: "Teal", value: "teal" },
	{ label: "White", value: "white" },
	{ label: "Yellow", value: "yellow" },
];
