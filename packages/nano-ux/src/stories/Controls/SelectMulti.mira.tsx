import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";

import {
	SelectMulti,
	SelectMultiPropsSchema,
} from "../../controls/SelectMulti.tsx";

import { AsyncSelectExample } from "../AsyncSelectExample.tsx";

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

export const Preview = () => <Examples />;
export const layout = "fullscreen";

export const schema = z.pick(SelectMultiPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
	mobileDisplay: true,
	placeholder: true,
});

export const defaults = { label: "SelectMulti" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<SelectMulti name="example" options={fiveOptions} {...props} />
		</FormProvider>
	);
};

export const section = "Controls";
