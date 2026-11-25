import React from "react";
import { navigate } from "./navigation.ts";

type RedirectProps = { to: string; replace?: boolean };

export const Redirect = ({ to, replace }: RedirectProps) => {
	React.useEffect(() => {
		navigate(to, { replace });
	}, [to, replace]);

	return null;
};
