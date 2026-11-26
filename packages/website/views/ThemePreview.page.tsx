import { Header } from "../components/reference/Header.tsx";

export const route = {
	render: "shell",
	metadata: { title: "ThemeSelector preview" },
} as const;

export const Page = () => <Header className="py-3" />;
