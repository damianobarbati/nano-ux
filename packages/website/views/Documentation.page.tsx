import React from "react";
import { Reference } from "../components/Reference.tsx";

type DocumentationProps = { className?: string };

export const route = { metadata: { title: "Documentation | nano-ux" } };

export const Page = ({ className }: DocumentationProps) => (
	<Reference className={className} />
);
