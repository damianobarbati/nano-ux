"use client";

import cx from "clsx-tw";
import React from "react";
import { useController } from "react-hook-form";
import * as z from "zod/mini";
import { Spinner } from "../components/Spinner.tsx";

import {
	controlPropsSchema,
	type FormFieldProps,
} from "../hooks/useFormField.ts";

import {
	type SelectOption,
	type SelectOptionsFetcher,
	useSelectOptions,
} from "../hooks/useSelectOptions.ts";

import { ICheck, IChevronDown } from "../icons.tsx";
import { FieldMessage } from "./FieldMessage.tsx";

import {
	hideSelectMultiPanel,
	positionSelectMultiPanel,
	selectMultiMaxPopoverRows,
} from "./selectMultiPanel.ts";

export type SelectMultiOption = SelectOption;

type SelectMultiBaseProps = FormFieldProps & {
	strings?: {
		loading?: string;
		empty?: string;
		loadError?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		clearAll?: string;
		selectAll?: string;
		close?: string;
	};
	className?: string;

	onBlur?: () => void;
	placeholder?: string;
	searchable?: boolean;
	searchPlaceholder?: string;
	emptyLabel?: string;
	disabled?: boolean;
	/** Below 768 px, auto uses fullscreen when more than eight options exist at opening. */
	mobileDisplay?: "auto" | "popover" | "fullscreen";
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

export const SelectMultiPropsSchema = z.extend(controlPropsSchema, {
	placeholder: z.optional(z.string()),
	mobileDisplay: z.optional(z.enum(["auto", "popover", "fullscreen"])),
});

export type SelectMultiProps = z.infer<typeof SelectMultiPropsSchema> &
	((SelectManyProps | SelectOneProps) & OptionsSource);

const optionLabels = new Intl.Collator(undefined, { sensitivity: "base" });

export const SelectMulti = (props: SelectMultiProps) => {
	const {
		strings,
		className,
		label,
		helpText,
		error: customError,
		name,
		fetcher,
		mode = "many",
		mobileDisplay = "auto",
		placeholder = strings?.placeholder ?? "Select options",
		searchable = true,
		searchPlaceholder = strings?.searchPlaceholder ?? "Search options",
		emptyLabel = strings?.empty ?? "No options found",
		disabled: fieldDisabled,
	} = props;

	const {
		options: fetchedOptions,
		loading,
		error: loadError,
	} = useSelectOptions(fetcher, strings?.loadError);

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
		(fieldState.error &&
			(fieldState.error.message ||
				(strings?.invalidValue ?? "Enter a valid value.")));

	const onBlur = React.useCallback(() => {
		field.onBlur();
		props.onBlur?.();
	}, [field.onBlur, props.onBlur]);

	const [open, setOpen] = React.useState(false);
	const [optionCountOnOpen, setOptionCountOnOpen] = React.useState(0);
	const expanded = open && !disabled;

	const fullscreenOnMobile =
		mobileDisplay === "fullscreen" ||
		(mobileDisplay === "auto" && optionCountOnOpen > selectMultiMaxPopoverRows);

	const [selectedOnOpen, setSelectedOnOpen] = React.useState(
		() => new Set<string>(),
	);

	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(-1);
	const root = React.useRef<HTMLDivElement>(null);
	const trigger = React.useRef<HTMLButtonElement>(null);
	const panel = React.useRef<HTMLDialogElement>(null);
	const controls = React.useRef<HTMLDivElement>(null);
	const rows = React.useRef<HTMLDivElement>(null);
	const closeButton = React.useRef<HTMLButtonElement>(null);
	const search = React.useRef<HTMLInputElement>(null);
	const listbox = React.useRef<HTMLDivElement>(null);
	const bulkAction = React.useRef<HTMLButtonElement>(null);
	const movingFocus = React.useRef(false);
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

	if (expanded && mode === "many") {
		filtered.sort(({ option: first }, { option: second }) => {
			const result =
				Number(selectedOnOpen.has(second.value)) -
					Number(selectedOnOpen.has(first.value)) ||
				optionLabels.compare(first.label, second.label);

			return result;
		});
	}

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

	React.useLayoutEffect(() => {
		const menu = panel.current;
		const anchor = trigger.current;
		const menuControls = controls.current;
		const optionList = listbox.current;
		const optionRows = rows.current;

		if (
			!expanded ||
			!menu ||
			!anchor ||
			!menuControls ||
			!optionList ||
			!optionRows
		)
			return;

		const mobile = window.matchMedia("(width < 768px)");
		const viewport = window.visualViewport;
		let frame = 0;

		const position = () => {
			positionSelectMultiPanel({
				panel: menu,
				trigger: anchor,
				controls: menuControls,
				listbox: optionList,
				rows: optionRows,
			});
		};

		const schedulePosition = () => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(position);
		};

		const handleScroll = (event: Event) => {
			if (!(event.target instanceof Node) || !menu.contains(event.target))
				schedulePosition();
		};

		const showPanel = () => {
			const isMobile = mobile.matches;
			const fullscreen = fullscreenOnMobile && isMobile;

			movingFocus.current = true;
			hideSelectMultiPanel(menu);
			menu.toggleAttribute("data-fullscreen", fullscreen);
			optionList.toggleAttribute("autofocus", isMobile && !fullscreen);

			if (fullscreen) menu.showModal();
			else menu.showPopover();

			position();

			const initialFocus = fullscreen ? closeButton.current : optionList;
			const focusTarget = isMobile ? initialFocus : search.current;

			(focusTarget ?? optionList).focus({ preventScroll: true });
			movingFocus.current = false;
		};

		showPanel();
		optionList.scrollTop = 0;

		const observer = new ResizeObserver(schedulePosition);
		observer.observe(anchor);
		observer.observe(menuControls);
		observer.observe(optionRows);

		if (fullscreenOnMobile) mobile.addEventListener("change", showPanel);
		window.addEventListener("resize", schedulePosition);
		window.addEventListener("scroll", handleScroll, true);

		if (viewport) {
			viewport.addEventListener("resize", schedulePosition);
			viewport.addEventListener("scroll", schedulePosition);
		}

		return () => {
			observer.disconnect();
			mobile.removeEventListener("change", showPanel);
			window.removeEventListener("resize", schedulePosition);
			window.removeEventListener("scroll", handleScroll, true);
			window.cancelAnimationFrame(frame);

			if (viewport) {
				viewport.removeEventListener("resize", schedulePosition);
				viewport.removeEventListener("scroll", schedulePosition);
			}

			movingFocus.current = true;
			hideSelectMultiPanel(menu);
			movingFocus.current = false;
		};
	}, [expanded, fullscreenOnMobile]);

	React.useEffect(() => {
		if (!expanded) return;

		const handlePointerDown = (event: PointerEvent) => {
			if (panel.current && panel.current.open) return;

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
	}, [expanded, onBlur]);

	React.useEffect(() => {
		if (!activeId || !expanded || !listbox.current) return;

		const option = document.getElementById(activeId);
		if (!option) return;

		const list = listbox.current;
		const row = option.getBoundingClientRect();
		const viewport = list.getBoundingClientRect();

		if (row.top < viewport.top) list.scrollTop += row.top - viewport.top;
		else if (row.bottom > viewport.bottom)
			list.scrollTop += row.bottom - viewport.bottom;
	}, [activeId, expanded]);

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
		movingFocus.current = true;

		if (panel.current) hideSelectMultiPanel(panel.current);

		if (trigger.current) trigger.current.focus({ preventScroll: true });

		movingFocus.current = false;
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
		const selectedIndex =
			mode === "one"
				? selectable.findIndex((option) => selectedValues.has(option.value))
				: -1;

		setSelectedOnOpen(selectedValues);
		setOptionCountOnOpen(options.length);
		setQuery("");
		setActive(Math.max(0, selectedIndex));
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
		indicator = (
			<Spinner
				centered={false}
				size="sm"
				label={strings?.loading ?? "Loading options"}
			/>
		);
	} else {
		indicator = <IChevronDown className="size-4 shrink-0 text-fg-muted" />;
	}

	return (
		<div
			className={cx("control relative grid-cols-1", className)}
			ref={root}
			onKeyDown={handleKeyDown}
			onBlur={(event) => {
				if (movingFocus.current || (panel.current && panel.current.open))
					return;

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
				aria-expanded={expanded}
				aria-controls={`${id}-options`}
				aria-haspopup="dialog"
				disabled={disabled}
				ref={(element) => {
					trigger.current = element;

					field.ref(element);
				}}
				className="control-field flex items-center justify-between gap-3 text-left"
				onPointerDown={(event) => {
					if (expanded && event.button === 0) event.preventDefault();
				}}
				onClick={() => {
					if (open) closeMenu();
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
						{loading
							? (strings?.loading ?? "Loading options…")
							: selectedLabel || placeholder}
					</span>
				</span>
				{indicator}
			</button>
			<dialog
				id={`${id}-options`}
				className="group fixed inset-auto m-0 max-h-none max-w-none flex-col overflow-auto overscroll-contain rounded-control border border-border bg-surface p-2 text-fg shadow-lg transition-opacity duration-150 ease-out data-fullscreen:rounded-none data-fullscreen:border-0 data-fullscreen:px-4 data-fullscreen:pt-[max(1rem,env(safe-area-inset-top))] data-fullscreen:pb-[max(1rem,env(safe-area-inset-bottom))] motion-reduce:transition-none starting:opacity-0 [&:is(:modal,:popover-open)]:flex"
				ref={panel}
				popover="manual"
				aria-label={label || placeholder}
				onCancel={(event) => {
					event.preventDefault();
					event.stopPropagation();
					closeMenu();
				}}
			>
				<div className="shrink-0" ref={controls}>
					<button
						className="control-field mb-2 hidden group-data-fullscreen:block"
						type="button"
						ref={closeButton}
						onClick={closeMenu}
					>
						{strings?.close ?? "Close"}
					</button>
					{searchable && (
						<input
							className="control-field mb-2"
							ref={search}
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
							className="block w-full cursor-pointer rounded-control py-2 pr-3 pl-9 text-left text-sm font-medium text-fg hover:bg-layer focus:bg-layer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
							type="button"
							ref={bulkAction}
							onFocus={() => {
								if (!movingFocus.current) setActive(-1);
							}}
							onClick={toggleAll}
						>
							{allSelected
								? (strings?.clearAll ?? "Clear all")
								: (strings?.selectAll ?? "Select all")}
						</button>
					)}
					{filtered.length === 0 && (
						<p className="m-0 px-3 py-3 text-sm text-fg-muted">{emptyLabel}</p>
					)}
				</div>
				<div
					id={`${id}-listbox`}
					className="min-h-0 overflow-y-auto overscroll-contain focus:outline-none"
					ref={listbox}
					tabIndex={-1}
				>
					<div className="grid auto-rows-fr" ref={rows}>
						{filtered.map(({ option, optionId }) => (
							<button
								key={option.value}
								id={optionId}
								type="button"
								disabled={option.disabled}
								aria-pressed={selectedValues.has(option.value)}
								tabIndex={-1}
								className={cx(
									"flex w-full cursor-pointer items-center gap-2 rounded-control px-3 py-2 text-left text-sm text-fg hover:bg-layer disabled:cursor-not-allowed disabled:opacity-50",
									activeOption === option && "bg-layer",
								)}
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => choose(option)}
							>
								<ICheck
									className={cx(
										"size-4 shrink-0",
										!selectedValues.has(option.value) && "invisible",
									)}
									aria-hidden="true"
								/>
								{option.content ?? option.label}
							</button>
						))}
					</div>
				</div>
			</dialog>
			<FieldMessage error={error} helpText={helpText} />
		</div>
	);
};
