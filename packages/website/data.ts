import type { TablePageRequest } from "nano-ux";

export type Profile = {
	id: string;
	name: string;
	email: string;
	interests: string[];
};

export const interestOptions = [
	"Design",
	"Music",
	"Technology",
	"Travel",
	"Art",
	"Sports",
].map((label) => ({ label, value: label }));

export const sampleProfile = {
	full_name: "Jamie Parker",
	gender: "Female",
	email: "jamie@example.com",
	password: "DemoProfile42!",
	birth_date: "1995-04-18T00:00:00",
	interests: ["Design", "Travel"],
	bio: "I design travel guides and illustrate maps.",
	volume: 75,
	accept_terms: true,
	notifications: true,
};

export const emptyProfile: typeof sampleProfile = {
	full_name: "",
	gender: "",
	email: "",
	password: "",
	birth_date: "",
	interests: [],
	bio: "",
	volume: 50,
	accept_terms: false,
	notifications: false,
};

function createProfiles(): Profile[] {
	const names = [
		"Alex Morgan",
		"Sam Rivera",
		"Jordan Lee",
		"Casey Brooks",
		"Taylor Chen",
	];

	const result = Array.from({ length: 10_000 }, (_, index) => ({
		id: String(index + 1),
		name: names[index % names.length],
		email: `member${index + 1}@example.com`,
		interests: [interestOptions[index % interestOptions.length].value],
	}));

	return result;
}

export const dailySignups = [
	{ timestamp: "2026-09-21", values: [12] },
	{ timestamp: "2026-09-22", values: [19] },
	{ timestamp: "2026-09-23", values: [14] },
	{ timestamp: "2026-09-24", values: [25] },
	{ timestamp: "2026-09-25", values: [18] },
	{ timestamp: "2026-09-26", values: [10] },
	{ timestamp: "2026-09-27", values: [15] },
];

export const signupSeries = [{ name: "Signups" }];

export const profileSeries = [{ name: "Profiles" }];

export const signupActivityByCountry = [
	{ country: "US", intensity: 100 },
	{ country: "IT", intensity: 95 },
	{ country: "BR", intensity: 90 },
	{ country: "IN", intensity: 85 },
	{ country: "AU", intensity: 80 },
	{ country: "CA", intensity: 75 },
	{ country: "CN", intensity: 70 },
	{ country: "DE", intensity: 65 },
	{ country: "JP", intensity: 60 },
	{ country: "MX", intensity: 55 },
	{ country: "ZA", intensity: 50 },
	{ country: "FR", intensity: 45 },
	{ country: "AR", intensity: 40 },
	{ country: "ID", intensity: 35 },
	{ country: "EG", intensity: 30 },
	{ country: "SE", intensity: 25 },
	{ country: "ES", intensity: 20 },
	{ country: "NG", intensity: 15 },
	{ country: "CL", intensity: 10 },
	{ country: "NZ", intensity: 5 },
];

export const profiles = createProfiles();

export const listProfiles = ({
	rows,
	sort,
	offset,
	limit,
}: TablePageRequest & { rows: Profile[] }) => {
	const [sorter] = sort;
	let ordered = rows;

	if (sorter) {
		const [column, direction] = sorter;

		if (column === "name" || column === "email" || column === "interests") {
			const factor = direction === "asc" ? 1 : -1;

			ordered = rows.toSorted(
				(a, b) => factor * String(a[column]).localeCompare(String(b[column])),
			);
		}
	}

	const page = ordered.slice(offset, offset + limit);
	return page;
};
