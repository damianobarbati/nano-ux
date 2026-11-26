import React from "react";
import type { IconType } from "react-icons";
import * as z from "zod/mini";
import type { ButtonProps } from "../../components/Button.tsx";

import {
	Button,
	ButtonPropsSchema,
	buttonColors,
	cx,
} from "../../components/Button.tsx";

import { ICheck, IClose } from "../../icons.tsx";

type ButtonColor = NonNullable<ButtonProps["color"]>;

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

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

export const Preview = () => (
	<main className="grid min-h-screen grid-cols-2">
		{(["light", "dark"] as const).map((theme) => (
			<section
				className={cx(
					theme,
					"grid min-w-0 content-start gap-6 bg-bg p-2 text-fg sm:p-4 lg:p-6",
				)}
				key={theme}
			>
				<h2>{theme === "light" ? "Light theme" : "Dark theme"}</h2>
				{buttonColors.map((color) => (
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
);

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

export const layout = "fullscreen";

export const schema = z.pick(ButtonPropsSchema, {
	size: true,
	mobileSize: true,
	loading: true,
	disabled: true,
	loadingPosition: true,
	color: true,
	variant: true,
	pulse: true,
});

export const playgroundLayout = "fullscreen";

export const Playground = (props: z.infer<typeof schema>) => (
	<div className="grid min-h-screen grid-cols-2">
		{(["light", "dark"] as const).map((theme) => (
			<section
				key={theme}
				className={cx(theme, "grid min-w-0 place-items-center bg-bg text-fg")}
				aria-label={theme === "light" ? "Light theme" : "Dark theme"}
			>
				<Button {...props}>Save</Button>
			</section>
		))}
	</div>
);

export const section = "Foundation";
