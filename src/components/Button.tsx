"use client";

import cx from "clsx-tw";
import React from "react";
import type { IconType } from "react-icons";
import { Spinner } from "./Spinner.tsx";

export { cx };

type ButtonIcon =
	| IconType
	| { icon: IconType; visible: boolean; hideAfterMs?: number };

type ButtonBaseProps = {
	leftIcon?: ButtonIcon;
	rightIcon?: ButtonIcon;
	children?: React.ReactNode;
	className?: string;
	size?: "sm" | "md" | "lg";
	mobileSize?: "sm" | "md" | "lg";
	pulse?: boolean;
	variant?: "solid" | "outline" | "ghost";
	color?:
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger"
		| "cocoa"
		| "mint"
		| "cyan"
		| "ocean"
		| "violet"
		| "berry";
};

type ActionButtonProps = ButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
		as?: "button";
		loading?: boolean;
		loadingPosition?: "left" | "right";
	};

type NavigationButtonProps = ButtonBaseProps &
	Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		keyof ButtonBaseProps | "href"
	> & {
		as: "a";
		href: string;
		loading?: never;
	};

export type ButtonProps = ActionButtonProps | NavigationButtonProps;

const colorClasses = {
	primary: "button-primary",
	secondary: "button-secondary",
	success: "button-success",
	warning: "button-warning",
	danger: "button-danger",
	cocoa: "button-cocoa",
	mint: "button-mint",
	cyan: "button-cyan",
	ocean: "button-ocean",
	violet: "button-violet",
	berry: "button-berry",
};

const variantClasses = {
	solid: "button-solid",
	outline: "button-outline",
	ghost: "button-ghost",
};

const sizeClasses = {
	sm: "button-sm",
	md: "button-md",
	lg: "button-lg",
};

const desktopSizeClasses = {
	sm: "button-desktop-sm",
	md: "button-desktop-md",
	lg: "button-desktop-lg",
};

const getButtonClassName = ({
	className,
	variant = "solid",
	size = "md",
	mobileSize,
	color = "primary",
	pulse,
}: ButtonBaseProps) =>
	cx(
		"button rounded-control",
		colorClasses[color],
		variantClasses[variant],
		sizeClasses[mobileSize ?? size],
		mobileSize && desktopSizeClasses[size],
		pulse && "button-pulse",
		className,
	);

type IconSlotProps = {
	icon?: ButtonIcon;
	side: "left" | "right";
	loading?: boolean;
};

const IconSlot = ({ icon, side, loading }: IconSlotProps) => {
	const config = typeof icon === "object" ? icon : undefined;
	const Icon = typeof icon === "function" ? icon : config?.icon;
	const showIcon = !!Icon && !loading && (config?.visible ?? true);
	const duration = config?.hideAfterMs;
	const [expired, setExpired] = React.useState(false);

	React.useEffect(() => {
		setExpired(false);

		if (showIcon && duration !== undefined) {
			const timer = window.setTimeout(() => setExpired(true), duration);
			return () => window.clearTimeout(timer);
		}
	}, [showIcon, duration, Icon]);

	return (
		<span
			className="button-icon"
			data-side={side}
			data-visible={!!loading || (showIcon && !expired)}
		>
			{loading && <Spinner size="sm" />}
			{!loading && Icon && <Icon size="1rem" />}
		</span>
	);
};

type ButtonContentProps = Pick<
	ButtonBaseProps,
	"children" | "leftIcon" | "rightIcon"
> & {
	loading?: boolean;
	loadingPosition?: "left" | "right";
};

const ButtonContent = ({
	children,
	leftIcon,
	rightIcon,
	loading,
	loadingPosition,
}: ButtonContentProps) => {
	const spinnerSide =
		loadingPosition ?? (loading !== undefined ? "right" : undefined);

	if (!leftIcon && !rightIcon && !spinnerSide) return <>{children}</>;

	return (
		<span className="button-content">
			{(leftIcon || spinnerSide === "left") && (
				<IconSlot
					side="left"
					icon={leftIcon}
					loading={spinnerSide === "left" && loading}
				/>
			)}
			{children}
			{(rightIcon || spinnerSide === "right") && (
				<IconSlot
					side="right"
					icon={rightIcon}
					loading={spinnerSide === "right" && loading}
				/>
			)}
		</span>
	);
};

export const Button = (props: ButtonProps) => {
	if (props.as === "a") {
		const {
			as: _as,
			children,
			leftIcon,
			rightIcon,
			className,
			variant,
			href,
			size,
			mobileSize,
			color,
			pulse,
			...anchorProps
		} = props;

		const buttonClassName = getButtonClassName({
			className,
			variant,
			size,
			mobileSize,
			color,
			pulse,
		});

		return (
			<a className={buttonClassName} href={href} {...anchorProps}>
				<ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
					{children}
				</ButtonContent>
			</a>
		);
	}

	const {
		as: _as,
		children,
		className,
		disabled,
		variant,
		loading,
		loadingPosition,
		leftIcon,
		rightIcon,
		pulse,
		size,
		mobileSize,
		type = "button",
		color,
		...buttonProps
	} = props;

	return (
		<button
			{...buttonProps}
			className={getButtonClassName({
				className,
				variant,
				size,
				mobileSize,
				color,
				pulse,
			})}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			type={type}
		>
			<ButtonContent
				loading={loading}
				loadingPosition={loadingPosition}
				leftIcon={leftIcon}
				rightIcon={rightIcon}
			>
				{children}
			</ButtonContent>
		</button>
	);
};
