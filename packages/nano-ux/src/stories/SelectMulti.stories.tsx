import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SelectMulti } from "../components/SelectMulti.tsx";
import { AsyncSelectExample } from "./AsyncSelectExample.tsx";

const fiveOptions = [
	{
		value: "pulsio.io",
		label: "pulsio.io",
		content: (
			<>
				pulsio.io <span className="text-xs text-fg-muted">Primary</span>
			</>
		),
	},
	{ value: "example.com", label: "example.com" },
	{ value: "website.test", label: "website.test" },
	{ value: "acme.dev", label: "acme.dev" },
	{ value: "demo.app", label: "demo.app" },
];

const cityOptions = [
	"Abu Dhabi",
	"Abuja",
	"Accra",
	"Addis Ababa",
	"Algiers",
	"Amman",
	"Amsterdam",
	"Ankara",
	"Antwerp",
	"Aşgabat",
	"Asunción",
	"Athens",
	"Atlanta",
	"Auckland",
	"Austin",
	"Baghdad",
	"Baku",
	"Baltimore",
	"Bangkok",
	"Barcelona",
	"Beijing",
	"Beirut",
	"Belgrade",
	"Berlin",
	"Bern",
	"Bilbao",
	"Birmingham",
	"Bogotá",
	"Bologna",
	"Bordeaux",
	"Boston",
	"Brasília",
	"Bratislava",
	"Brisbane",
	"Brussels",
	"Bucharest",
	"Budapest",
	"Buenos Aires",
	"Busan",
	"Cairo",
	"Canberra",
	"Cannes",
	"Cape Town",
	"Caracas",
	"Cardiff",
	"Casablanca",
	"Chiang Mai",
	"Chicago",
	"Cologne",
	"Copenhagen",
	"Córdoba",
	"Dakar",
	"Dallas",
	"Damascus",
	"Denver",
	"Detroit",
	"Dhaka",
	"Doha",
	"Dresden",
	"Dubai",
	"Dublin",
	"Dubrovnik",
	"Düsseldorf",
	"Edinburgh",
	"Florence",
	"Frankfurt",
	"Fukuoka",
	"Geneva",
	"Genoa",
	"Glasgow",
	"Guadalajara",
	"Guatemala City",
	"Guayaquil",
	"Halifax",
	"Hamburg",
	"Hanoi",
	"Havana",
	"Helsinki",
	"Ho Chi Minh City",
	"Hong Kong",
	"Honolulu",
	"Houston",
	"Islamabad",
	"Istanbul",
	"Jakarta",
	"Jerusalem",
	"Johannesburg",
	"Johor Bahru",
	"Kabul",
	"Karachi",
	"Kathmandu",
	"Kigali",
	"Kingston",
	"Kinshasa",
	"Kolkata",
	"Kuala Lumpur",
	"Kuwait City",
	"Kyiv",
	"Kyoto",
	"La Paz",
	"Lagos",
	"Las Vegas",
	"Leeds",
	"Leipzig",
	"Lima",
	"Lisbon",
	"Liverpool",
	"Ljubljana",
	"London",
	"Los Angeles",
	"Luxembourg City",
	"Lyon",
	"Macau",
	"Madrid",
	"Málaga",
	"Malmo",
	"Manchester",
	"Manila",
	"Marrakesh",
	"Marseille",
	"Melbourne",
	"Memphis",
	"Mexico City",
	"Miami",
	"Milan",
	"Minneapolis",
	"Minsk",
	"Monaco",
	"Monterrey",
	"Montevideo",
	"Montreal",
	"Moscow",
	"Mumbai",
	"Munich",
	"Muscat",
	"Nairobi",
	"Naples",
	"Nashville",
	"New Delhi",
	"New Orleans",
	"New York",
	"Newcastle upon Tyne",
	"Nice",
	"Nicosia",
	"Oakland",
	"Oklahoma City",
	"Omaha",
	"Osaka",
	"Oslo",
	"Ottawa",
	"Palermo",
	"Panama City",
	"Paris",
	"Perth",
	"Philadelphia",
	"Phnom Penh",
	"Phoenix",
	"Pittsburgh",
	"Portland",
	"Porto",
	"Prague",
	"Quebec City",
	"Quito",
	"Rabat",
	"Recife",
	"Reykjavík",
	"Richmond",
	"Riga",
	"Rio de Janeiro",
	"Riyadh",
	"Rome",
	"Rotterdam",
	"Sacramento",
	"Salzburg",
	"San Antonio",
	"San Diego",
	"San Francisco",
	"San José",
	"San Juan",
	"Santa Fe",
	"Santiago",
	"São Paulo",
	"Sarajevo",
	"Seattle",
	"Seoul",
	"Seville",
	"Shanghai",
	"Sharjah",
	"Singapore",
	"Sofia",
	"St. Louis",
	"St. Petersburg",
	"Stockholm",
	"Strasbourg",
	"Sydney",
	"Taipei",
	"Tallinn",
	"Tbilisi",
	"Tehran",
	"Tel Aviv",
	"The Hague",
	"Thessaloniki",
	"Tirana",
	"Tokyo",
	"Toronto",
	"Toulouse",
	"Tunis",
	"Turin",
	"Ulaanbaatar",
	"Utrecht",
	"Valencia",
	"Valletta",
	"Vancouver",
	"Venice",
	"Verona",
	"Vienna",
	"Vilnius",
	"Warsaw",
	"Washington, D.C.",
	"Wellington",
	"Xi’an",
	"Yerevan",
	"Zagreb",
	"Zürich",
]
	.reverse()
	.map((city) => ({ value: city, label: city }));

const Examples = () => {
	const form = useForm({
		defaultValues: {
			cities: ["Zürich", "Berlin"],
			website: "",
			zero: [],
			withoutSearch: [],
			asyncWebsites: ["website.test"],
			cardCities: [],
			bottomCardCities: [],
			bottom: [],
		},
	});

	return (
		<FormProvider {...form}>
			<div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_auto_1fr] items-start gap-4 p-4 md:grid-cols-[minmax(0,20rem)_1fr] md:grid-rows-[1fr_auto]">
				<div className="grid w-full max-w-80 gap-4">
					<div className="overflow-hidden">
						<SelectMulti name="cities" label="Cities" options={cityOptions} />
					</div>
					<SelectMulti
						name="website"
						label="Single selection"
						placeholder="Select a website"
						options={fiveOptions}
						mode="one"
						searchable={false}
					/>
					<SelectMulti name="zero" label="Zero options" options={[]} />
					<SelectMulti
						name="withoutSearch"
						label="Without search"
						options={fiveOptions}
						searchable={false}
					/>
					<AsyncSelectExample>
						{(fetcher) => (
							<SelectMulti
								name="asyncWebsites"
								label="Async"
								fetcher={fetcher}
							/>
						)}
					</AsyncSelectExample>
				</div>
				<div className="flex w-full max-w-80 flex-col justify-between gap-4 md:row-span-2 md:self-stretch md:justify-self-end">
					{(
						[
							["cardCities", "Cities in parent with overflow:hidden"],
							["bottomCardCities", "Cities in parent with overflow:hidden"],
						] as const
					).map(([name, label]) => (
						<div key={name} className="card h-32 overflow-hidden">
							<SelectMulti name={name} label={label} options={cityOptions} />
						</div>
					))}
				</div>

				<div className="w-full max-w-80 self-end overflow-hidden">
					<SelectMulti
						name="bottom"
						label="Cities at bottom"
						options={cityOptions}
					/>
				</div>
			</div>
		</FormProvider>
	);
};

export default { title: "Controls / SelectMulti", component: SelectMulti };

export const Variants = {
	name: "SelectMulti",
	parameters: { layout: "fullscreen" },
	render: () => <Examples />,
};

export const SingleSelectionInteraction = {
	...Variants,
	name: "Single selection interaction",
	tags: ["!dev"],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole("button", { name: "Single selection" });

		await userEvent.click(trigger);

		const menu = within(
			canvas.getByRole("dialog", { name: "Single selection" }),
		);

		await userEvent.click(menu.getByRole("button", { name: "website.test" }));
		await expect(trigger).toHaveTextContent("website.test");
		await userEvent.click(trigger);

		await expect(
			menu.getAllByRole("button").map((row) => row.textContent),
		).toEqual([
			"pulsio.io Primary",
			"example.com",
			"website.test",
			"acme.dev",
			"demo.app",
		]);
	},
};

export const PlacementInteraction = {
	...Variants,
	name: "Placement interaction",
	tags: ["!dev"],
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const top = canvas.getByRole("button", { name: "Cities", exact: true });
		const bottom = canvas.getByRole("button", { name: "Cities at bottom" });
		const parent = top.closest(".overflow-hidden");
		if (!parent) throw new Error("Missing clipping parent");

		const parentBounds = parent.getBoundingClientRect();

		await userEvent.click(top);

		const topPanel = canvas.getByRole("dialog", {
			name: "Cities",
			exact: true,
		});

		const firstOptions = () => {
			const result = Array.from(
				topPanel.querySelectorAll("button[aria-pressed]"),
				(row) => row.textContent,
			).slice(0, 3);

			return result;
		};

		const mobile = window.matchMedia("(width < 768px)").matches;

		const abuDhabi = within(topPanel).getByRole("button", {
			name: "Abu Dhabi",
		});

		await expect(firstOptions()).toEqual(["Berlin", "Zürich", "Abu Dhabi"]);

		await expect(parent.getBoundingClientRect().toJSON()).toEqual(
			parentBounds.toJSON(),
		);

		if (mobile) {
			await expect(topPanel.matches(":modal")).toEqual(true);

			await expect(
				within(topPanel).getByRole("button", { name: "Close" }),
			).toHaveFocus();

			const optionsList = abuDhabi.closest('[id$="-listbox"]');
			if (!optionsList) throw new Error("Missing options list");

			const listBounds = optionsList.getBoundingClientRect();

			const padding = Number.parseFloat(
				getComputedStyle(topPanel).paddingBottom,
			);

			const room = Math.max(
				0,
				topPanel.getBoundingClientRect().bottom - padding - listBounds.top,
			);

			const expectedHeight = Math.min(room, optionsList.scrollHeight);

			await expect(Math.abs(listBounds.height - expectedHeight)).toBeLessThan(
				1,
			);
		} else {
			const row = abuDhabi.getBoundingClientRect();

			await expect(topPanel.getBoundingClientRect().top).toBeGreaterThan(
				parentBounds.bottom,
			);

			await expect(
				canvasElement.ownerDocument
					.elementFromPoint(row.x + 15, row.y + 15)
					?.closest("button"),
			).toBe(abuDhabi);
		}

		await userEvent.click(abuDhabi);
		await expect(firstOptions()).toEqual(["Berlin", "Zürich", "Abu Dhabi"]);
		await userEvent.keyboard("{Escape}");
		await expect(top).toHaveFocus();
		await userEvent.click(top);
		await expect(firstOptions()).toEqual(["Abu Dhabi", "Berlin", "Zürich"]);
		await userEvent.keyboard("{Escape}");
		await userEvent.click(bottom);

		const bottomPanel = canvas.getByRole("dialog", {
			name: "Cities at bottom",
		});

		if (mobile) {
			await userEvent.click(
				within(bottomPanel).getByRole("button", { name: "Close" }),
			);

			await expect(bottom).toHaveFocus();
		} else {
			await expect(bottomPanel.getBoundingClientRect().bottom).toBeLessThan(
				bottom.getBoundingClientRect().top,
			);

			await userEvent.keyboard("{Escape}");
		}
	},
};

const mobileDisplayOptions = Array.from({ length: 9 }, (_, index) => ({
	value: String(index + 1),
	label: `Option ${index + 1}`,
}));

const MobileDisplayExamples = () => {
	const form = useForm();
	const [optionCount, setOptionCount] = React.useState(8);
	return (
		<FormProvider {...form}>
			<div className="flex min-h-dvh w-full max-w-[22rem] flex-col gap-4 p-4">
				<SelectMulti
					name="count"
					label="Automatic display"
					options={mobileDisplayOptions.slice(0, optionCount)}
					onChange={() => setOptionCount(9)}
				/>
				<SelectMulti
					name="fullscreen"
					label="Fullscreen override"
					options={fiveOptions}
					mobileDisplay="fullscreen"
				/>
				<AsyncSelectExample>
					{(fetcher) => (
						<SelectMulti name="async" label="Async options" fetcher={fetcher} />
					)}
				</AsyncSelectExample>
				<SelectMulti
					className="mt-auto"
					name="popover"
					label="Popover override"
					options={mobileDisplayOptions}
					mobileDisplay="popover"
					searchable={false}
				/>
			</div>
		</FormProvider>
	);
};

export const MobileDisplayInteraction = {
	parameters: { layout: "fullscreen" },
	tags: ["!dev"],
	render: () => <MobileDisplayExamples />,
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const mobile = window.matchMedia("(width < 768px)").matches;
		const automatic = canvas.getByRole("button", { name: "Automatic display" });

		await userEvent.click(automatic);

		const automaticPanel = canvas.getByRole("dialog", {
			name: "Automatic display",
		});

		const options = within(automaticPanel);
		const search = options.getByRole("textbox");
		const optionList = automaticPanel.querySelector('[id$="-listbox"]');

		await expect(automaticPanel.matches(":popover-open")).toEqual(true);
		await expect(mobile ? optionList : search).toHaveFocus();

		await expect(automaticPanel.getBoundingClientRect().top).toBeGreaterThan(
			automatic.getBoundingClientRect().bottom,
		);

		const chevron = automatic.querySelector("svg");
		if (!chevron) throw new Error("Missing selector chevron");

		await userEvent.click(chevron);
		await expect(automatic).toHaveAttribute("aria-expanded", "false");
		await userEvent.click(chevron);
		await userEvent.click(options.getByRole("button", { name: "Option 1" }));

		await expect(
			options.getByRole("button", { name: "Option 9" }),
		).toBeInTheDocument();

		await expect(automaticPanel.matches(":popover-open")).toEqual(true);
		await userEvent.keyboard("{Escape}");
		await expect(automatic).toHaveFocus();

		await userEvent.click(automatic);

		await expect(automaticPanel.matches(":modal")).toEqual(mobile);
		await userEvent.click(search);

		if (!(search instanceof HTMLInputElement))
			throw new Error("Missing search input");

		search.setRangeText("9", 0, search.value.length);
		search.dispatchEvent(new InputEvent("input", { bubbles: true }));

		await waitFor(() =>
			expect(
				options.queryByRole("button", { name: "Option 1" }),
			).not.toBeInTheDocument(),
		);

		await expect(automaticPanel.matches(":modal")).toEqual(mobile);
		await userEvent.keyboard("{Escape}");

		const fullscreen = canvas.getByRole("button", {
			name: "Fullscreen override",
		});

		await userEvent.click(fullscreen);

		const fullscreenPanel = canvas.getByRole("dialog", {
			name: "Fullscreen override",
		});

		await expect(
			fullscreenPanel.matches(mobile ? ":modal" : ":popover-open"),
		).toEqual(true);

		await userEvent.keyboard("{Escape}");

		const popover = canvas.getByRole("button", { name: "Popover override" });

		await userEvent.click(popover);

		const popoverPanel = canvas.getByRole("dialog", {
			name: "Popover override",
		});

		await expect(popoverPanel.matches(":popover-open")).toEqual(true);

		await expect(popoverPanel.getBoundingClientRect().bottom).toBeLessThan(
			popover.getBoundingClientRect().top,
		);

		await expect(popoverPanel.querySelector('[id$="-listbox"]')).toHaveFocus();
		await userEvent.keyboard("{Escape}");

		const asyncOptions = canvas.getByRole("button", { name: "Async options" });

		await waitFor(() => expect(asyncOptions).toBeEnabled(), { timeout: 4000 });
		await userEvent.click(asyncOptions);

		const asyncPanel = canvas.getByRole("dialog", { name: "Async options" });

		await expect(asyncPanel.matches(":popover-open")).toEqual(true);
		await userEvent.keyboard("{Escape}");
	},
};
