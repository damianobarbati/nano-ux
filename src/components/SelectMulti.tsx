"use client";

import cx from "clsx-tw";
import React from "react";
import { useController } from "react-hook-form";

import { type FormFieldProps } from "../hooks/useFormField.ts";

import {
	type SelectOption,
	type SelectOptionsFetcher,
	useSelectOptions,
} from "../hooks/useSelectOptions.ts";

import { ICheck, IChevronDown } from "../icons.tsx";
import { FieldMessage } from "./FieldMessage.tsx";
import { Spinner } from "./Spinner.tsx";

export type SelectMultiOption = SelectOption;

type SelectMultiBaseProps = FormFieldProps & {
	className?: string;

	onBlur?: () => void;
	placeholder?: string;
	searchable?: boolean;
	searchPlaceholder?: string;
	emptyLabel?: string;
	disabled?: boolean;
};

type SelectManyProps = SelectMultiBaseProps & {
	mode?: "many";
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
};

type SelectOneProps = SelectMultiBaseProps & {
	mode: "one";
	defaultValue?: string;
	onChange?: (value: string) => void;
};

type OptionsSource =
	| { options: SelectMultiOption[]; fetcher?: never }
	| { fetcher: SelectOptionsFetcher; options?: never };

export type SelectMultiProps = (SelectManyProps | SelectOneProps) &
	OptionsSource;

export const SelectMulti = (props: SelectMultiProps) => {
	const {
		className,
		label,
		helpText,
		error: customError,
		name,
		fetcher,
		mode = "many",
		placeholder = "Select options",
		searchable = true,
		searchPlaceholder = "Search options",
		emptyLabel = "No options found",
		disabled: fieldDisabled,
	} = props;

	const {
		options: fetchedOptions,
		loading,
		error: loadError,
	} = useSelectOptions(fetcher);

	const options = props.options ?? fetchedOptions ?? [];

	const { field, fieldState } = useController({
		name,
		rules: props.rules,
		disabled: fieldDisabled,
		defaultValue: props.defaultValue ?? (mode === "one" ? "" : []),
	});

	const disabled = field.disabled || loading;

	const error =
		loadError ??
		customError ??
		(fieldState.error && (fieldState.error.message || "Enter a valid value."));

	const onBlur = React.useCallback(() => {
		field.onBlur();
		props.onBlur?.();
	}, [field.onBlur, props.onBlur]);

	const [open, setOpen] = React.useState(false);
	const expanded = open && !disabled;
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(-1);
	const root = React.useRef<HTMLDivElement>(null);
	const trigger = React.useRef<HTMLButtonElement>(null);
	const search = React.useRef<HTMLInputElement>(null);
	const listbox = React.useRef<HTMLDivElement>(null);
	const bulkAction = React.useRef<HTMLButtonElement>(null);
	const id = React.useId();

	let selected: string[] = [];

	if (Array.isArray(field.value)) selected = field.value;
	else if (field.value) selected = [field.value];

	const selectedValues = new Set(selected);
	const searchTerm = searchable ? query.toLowerCase() : "";

	const filtered = options
		.map((option, index) => ({ option, optionId: `${id}-option-${index}` }))
		.filter(
			({ option }) =>
				!searchTerm || option.label.toLowerCase().includes(searchTerm),
		);

	const available = filtered.filter(({ option }) => !option.disabled);
	const selectable = options.filter((option) => !option.disabled);

	const selectedLabel = options
		.filter((option) => selectedValues.has(option.value))
		.map((option) => option.label)
		.join(", ");

	const hasBulkAction = mode === "many" && selectable.length > 0;

	const allSelected =
		selectable.length > 0 &&
		selectable.every((option) => selectedValues.has(option.value));

	const activeOption = available[active]?.option;
	const activeId = available[active]?.optionId;

	React.useEffect(() => {
		if (open) (search.current ?? listbox.current)?.focus();
	}, [open, searchable]);

	React.useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (
				root.current &&
				event.target instanceof Node &&
				!root.current.contains(event.target)
			) {
				setOpen(false);

				onBlur();
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open, onBlur]);

	React.useEffect(() => {
		if (!activeId || !open) return;

		const option = document.getElementById(activeId);
		if (option) option.scrollIntoView({ block: "nearest" });
	}, [activeId, open]);

	const change = (nextValue: string[]) => {
		if (props.mode === "one") {
			const value = nextValue[0] ?? "";

			field.onChange(value);
			props.onChange?.(value);
		} else {
			field.onChange(nextValue);
			props.onChange?.(nextValue);
		}
	};

	const toggleAll = () => {
		const enabledValues = new Set(selectable.map((option) => option.value));

		if (allSelected) {
			change(selected.filter((value) => !enabledValues.has(value)));
			return;
		}

		change([...new Set([...selected, ...enabledValues])]);
	};

	const closeMenu = () => {
		setOpen(false);
		trigger.current?.focus();
	};

	const choose = (option: SelectMultiOption) => {
		if (option.disabled) return;

		if (mode === "one") {
			change([option.value]);
			closeMenu();
			return;
		}

		const nextValue = selectedValues.has(option.value)
			? selected.filter((item) => item !== option.value)
			: [...selected, option.value];

		change(nextValue);
	};

	const openMenu = () => {
		setQuery("");
		setActive(0);
		setOpen(true);
	};

	// The bulk action sits immediately before the first enabled option.
	const firstRow = hasBulkAction ? -1 : 0;

	const focusRow = (index: number) => {
		setActive(index);

		if (hasBulkAction && index === -1) bulkAction.current?.focus();
		else listbox.current?.focus();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.nativeEvent.isComposing) return;

		if (open && event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			closeMenu();
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();

			if (event.repeat) return;

			if (!open) {
				trigger.current?.form?.requestSubmit();
				return;
			}

			if (
				event.target instanceof HTMLButtonElement &&
				event.target !== trigger.current
			)
				event.target.click();
			else if (activeOption) choose(activeOption);

			closeMenu();
			return;
		}

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();

			if (!open) {
				openMenu();
				return;
			}

			const direction = event.key === "ArrowDown" ? 1 : -1;

			const rowCount = available.length - firstRow;

			if (rowCount > 0) {
				const next = (active - firstRow + direction + rowCount) % rowCount;

				focusRow(firstRow + next);
			}

			return;
		}

		if (!open) return;

		if (
			(event.key === "Home" || event.key === "End") &&
			event.target !== search.current
		) {
			event.preventDefault();
			focusRow(event.key === "Home" ? firstRow : available.length - 1);
			return;
		}

		if (event.key === " ") {
			if (event.target === search.current && query.length > 0) return;

			if (
				event.target instanceof HTMLButtonElement &&
				event.target !== trigger.current
			)
				return;

			event.preventDefault();

			if (!event.repeat && activeOption) choose(activeOption);
		}
	};

	let indicator;

	if (loading) {
		indicator = <Spinner size="sm" label="Loading options" />;
	} else {
		indicator = <IChevronDown className="size-4 shrink-0 text-fg-muted" />;
	}

	return (
		<div
			className={cx("control relative grid-cols-1", className)}
			ref={root}
			onKeyDown={handleKeyDown}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setOpen(false);

					onBlur();
				}
			}}
		>
			{label && (
				<label htmlFor={id} className="control-label">
					{label}
				</label>
			)}
			<button
				type="button"
				id={id}
				name={name}
				aria-invalid={Boolean(error)}
				disabled={disabled}
				ref={(element) => {
					trigger.current = element;

					field.ref(element);
				}}
				className="control-field flex items-center justify-between gap-3 text-left"
				onClick={() => {
					if (open) setOpen(false);
					else openMenu();
				}}
			>
				<span className="relative min-w-0 flex-1">
					<span className="invisible block truncate">{placeholder}</span>
					<span
						className={cx(
							"absolute inset-0 truncate",
							!selectedLabel && "text-fg-muted",
						)}
					>
						{loading ? "Loading options…" : selectedLabel || placeholder}
					</span>
				</span>
				{indicator}
			</button>
			<div
				inert={!expanded}
				className={cx(
					"absolute top-full z-20 mt-2 w-full rounded-control border border-border bg-surface p-2 text-fg shadow-lg transition-[opacity,display] transition-discrete duration-150 ease-out motion-reduce:transition-none starting:opacity-0",
					!expanded && "hidden opacity-0",
				)}
			>
				{searchable && (
					<input
						ref={search}
						className="control-field mb-2 block"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActive(0);
						}}
						placeholder={searchPlaceholder}
					/>
				)}
				{hasBulkAction && (
					<button
						type="button"
						ref={bulkAction}
						onFocus={() => setActive(-1)}
						className="block w-full cursor-pointer rounded-control py-2 pr-3 pl-9 text-left text-sm font-medium text-fg hover:bg-layer focus:bg-layer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
						onClick={toggleAll}
					>
						{allSelected ? "Clear all" : "Select all"}
					</button>
				)}
				{filtered.length === 0 && (
					<p className="m-0 px-3 py-3 text-sm text-fg-muted">{emptyLabel}</p>
				)}
				<div
					id={`${id}-listbox`}
					ref={listbox}
					tabIndex={-1}
					className="max-h-56 overflow-y-auto focus:outline-none"
				>
					{filtered.map(({ option, optionId }) => (
						<button
							key={option.value}
							id={optionId}
							type="button"
							disabled={option.disabled}
							tabIndex={-1}
							className={cx(
								"flex w-full cursor-pointer items-center gap-2 rounded-control px-3 py-2 text-left text-sm text-fg hover:bg-layer disabled:cursor-not-allowed disabled:opacity-50",
								activeOption === option && "bg-layer",
							)}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => choose(option)}
						>
							{mode === "many" && (
								<ICheck
									className={cx(
										"size-4 shrink-0",
										!selectedValues.has(option.value) && "invisible",
									)}
								/>
							)}
							{option.content ?? option.label}
						</button>
					))}
				</div>
			</div>
			<FieldMessage error={error} helpText={helpText} />
		</div>
	);
};
