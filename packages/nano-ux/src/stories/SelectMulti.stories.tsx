import { FormProvider, useForm } from "react-hook-form";
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
	"Accra",
	"Addis Ababa",
	"Amsterdam",
	"Athens",
	"Atlanta",
	"Auckland",
	"Austin",
	"Bangkok",
	"Barcelona",
	"Beijing",
	"Berlin",
	"Bologna",
	"Boston",
	"Brisbane",
	"Brussels",
	"Budapest",
	"Buenos Aires",
	"Busan",
	"Cairo",
	"Cape Town",
	"Casablanca",
	"Chiang Mai",
	"Chicago",
	"Copenhagen",
	"Dakar",
	"Denver",
	"Dubai",
	"Dublin",
	"Edinburgh",
	"Florence",
	"Geneva",
	"Genoa",
	"Hamburg",
	"Hanoi",
	"Havana",
	"Helsinki",
	"Ho Chi Minh City",
	"Hong Kong",
	"Istanbul",
	"Jakarta",
	"Johannesburg",
	"Kuala Lumpur",
	"Kyoto",
	"Lagos",
	"Lima",
	"Lisbon",
	"London",
	"Los Angeles",
	"Lyon",
	"Madrid",
	"Manchester",
	"Manila",
	"Marrakesh",
	"Marseille",
	"Melbourne",
	"Mexico City",
	"Miami",
	"Milan",
	"Montreal",
	"Mumbai",
	"Munich",
	"Nairobi",
	"Naples",
	"New Delhi",
	"New Orleans",
	"New York",
	"Osaka",
	"Oslo",
	"Ottawa",
	"Palermo",
	"Paris",
	"Philadelphia",
	"Porto",
	"Prague",
	"Reykjavík",
	"Riga",
	"Rio de Janeiro",
	"Rome",
	"San Diego",
	"San Francisco",
	"Santiago",
	"São Paulo",
	"Seattle",
	"Seoul",
	"Seville",
	"Shanghai",
	"Singapore",
	"Stockholm",
	"Sydney",
	"Taipei",
	"Tallinn",
	"Tokyo",
	"Toronto",
	"Turin",
	"Vancouver",
	"Venice",
	"Vienna",
	"Warsaw",
	"Washington, D.C.",
	"Wellington",
].map((city) => ({ value: city, label: city }));

const Examples = () => {
	const form = useForm({
		defaultValues: {
			website: "",
			cities: [],
			zero: [],
			withoutSearch: [],
			asyncWebsites: ["website.test"],
		},
	});

	return (
		<FormProvider {...form}>
			<div className="w-80 space-y-4">
				<SelectMulti
					name="website"
					label="Single selection"
					placeholder="Select a website"
					options={fiveOptions}
					mode="one"
					searchable={false}
				/>
				<SelectMulti name="cities" label="Cities" options={cityOptions} />
				<SelectMulti name="zero" label="Zero options" options={[]} />
				<SelectMulti
					name="withoutSearch"
					label="Without search"
					options={fiveOptions}
					searchable={false}
				/>
				<AsyncSelectExample>
					{(fetcher) => (
						<SelectMulti name="asyncWebsites" label="Async" fetcher={fetcher} />
					)}
				</AsyncSelectExample>
			</div>
		</FormProvider>
	);
};

export default { title: "Controls / SelectMulti", component: SelectMulti };

export const Variants = { name: "SelectMulti", render: () => <Examples /> };
