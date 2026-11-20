import React from "react";
import type { IconType } from "react-icons";
import type { ButtonProps } from "../components/Button.tsx";
import { Button, cx } from "../components/Button.tsx";
import { ICheck, IClose } from "../icons.tsx";

type ButtonColor = NonNullable<ButtonProps["color"]>;

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

const colors: ButtonColor[] = [
	"primary",
	"secondary",
	"success",
	"warning",
	"danger",
	"cocoa",
	"mint",
	"cyan",
	"ocean",
	"violet",
	"berry",
];

const variants: ButtonVariant[] = ["solid", "outline"];

type ButtonStatesProps = { color: ButtonColor; variant: ButtonVariant };

const ButtonStates = ({ color, variant }: ButtonStatesProps) => (
	<div className="flex flex-wrap items-center gap-4">
		<Button variant={variant} color={color}>
			Save
		</Button>
		<Button className="button-preview-hover" variant={variant} color={color}>
			Hover
		</Button>
		<Button className="button-preview-focus" variant={variant} color={color}>
			Focus
		</Button>
		<Button disabled variant={variant} color={color}>
			Disabled
		</Button>
		<Button variant={variant} loading color={color}>
			Loading
		</Button>
		<Button variant={variant} pulse color={color}>
			Pulse
		</Button>
		{(["sm", "lg"] as const).map((size) => (
			<Button variant={variant} key={size} size={size} color={color}>
				Save
			</Button>
		))}
		<Button variant="ghost" color={color}>
			Ghost
		</Button>
	</div>
);

export default {
	title: "Foundation / Buttons",
	component: Button,
	parameters: { layout: "fullscreen" },
};

export const Buttons = {
	render: () => (
		<main className="theme-panels grid grid-cols-2 items-start gap-6 bg-bg p-6 text-fg">
			{(["light", "dark"] as const).map((theme) => (
				<section
					className={cx(
						theme,
						theme === "light" ? "theme-panel-light" : "theme-panel-dark",
						"grid gap-6 rounded-card border border-border bg-bg p-6 text-fg",
					)}
					key={theme}
				>
					<h2>{theme === "light" ? "Light theme" : "Dark theme"}</h2>
					{colors.map((color) => (
						<section className="grid gap-3" key={color}>
							<h3>{color}</h3>
							{variants.map((variant) => (
								<ButtonStates variant={variant} key={variant} color={color} />
							))}
						</section>
					))}
					<div className="flex flex-wrap items-start justify-start gap-4 [&_h3]:whitespace-nowrap">
						<section className="grid w-min content-start justify-items-start gap-3">
							<h3>Fixed icon</h3>
							<Button rightIcon={ICheck}>Save</Button>
						</section>
						<section className="grid w-min content-start justify-items-start gap-3">
							<h3>Success</h3>
							<SaveButton outcome="success" />
						</section>
						<section className="grid w-min content-start justify-items-start gap-3">
							<h3>Failure</h3>
							<SaveButton outcome="error" />
						</section>
					</div>
				</section>
			))}
		</main>
	),
};

type SaveStatus = "idle" | "saving" | "success" | "error";

const GreenCheck: IconType = (props) => (
	<ICheck {...props} className="text-success" />
);

const RedX: IconType = (props) => <IClose {...props} className="text-danger" />;

type SaveButtonProps = {
	outcome: "success" | "error";
};

const SaveButton = ({ outcome }: SaveButtonProps) => {
	const [status, setStatus] = React.useState<SaveStatus>("idle");

	React.useEffect(() => {
		if (status === "saving") {
			const timer = window.setTimeout(() => setStatus(outcome), 700);
			return () => window.clearTimeout(timer);
		}
	}, [status, outcome]);

	return (
		<Button
			loading={status === "saving"}
			onClick={() => setStatus("saving")}
			rightIcon={{
				icon: outcome === "error" ? RedX : GreenCheck,
				visible: status === "success" || status === "error",
				hideAfterMs: 3000,
			}}
		>
			Save
		</Button>
	);
};
