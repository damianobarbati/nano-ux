import "@fontsource-variable/montserrat";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./index.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element in the demo page.");

if (import.meta.env.DEV) {
	createRoot(root).render(<App />);
} else {
	hydrateRoot(root, <App />);
}
