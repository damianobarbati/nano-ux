import React from "react";
import { Reference } from "../components/Reference.tsx";
import { SiteLayout } from "../components/SiteLayout.tsx";

type DocumentationProps = { className?: string };

export const route = { metadata: { title: "Documentation | nano-ux" } };

export const Page = ({ className }: DocumentationProps) => (
	<SiteLayout className={className}>
		<Reference />
	</SiteLayout>
);
