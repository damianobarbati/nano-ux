import React from "react";
import { prerender } from "react-dom/static";
import { App } from "./index.tsx";

export const render = async () => {
	const { prelude } = await prerender(<App />);
	const html = await new Response(prelude).text();
	return html;
};
