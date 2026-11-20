import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./Button.tsx";
import { Input } from "./Input.tsx";
import { Textarea } from "./Textarea.tsx";

export type ContactValues = {
	email: string;
	subject: string;
	content: string;
	website: string;
};

const getContactDefaults = () => {
	const search = typeof window === "undefined" ? "" : window.location.search;
	const query = new URLSearchParams(search);
	return {
		email: query.get("email") ?? "",
		subject: query.get("subject") ?? "",
		content: query.get("content") ?? "",
		website: "",
	};
};

export type ContactFormProps = {
	onSubmit: (values: ContactValues) => Promise<void>;
	labels: Record<
		| "email"
		| "contactSuccess"
		| "contactRateLimit"
		| "contactFailure"
		| "emailPlaceholder"
		| "emailRequired"
		| "contactSubject"
		| "contactSubjectPlaceholder"
		| "contactSubjectRequired"
		| "contactSubjectMax"
		| "contactContent"
		| "contactContentPlaceholder"
		| "contactContentRequired"
		| "contactContentMax"
		| "contactWebsite"
		| "contactSending"
		| "contactSend",
		string
	>;
};

export const ContactForm = ({ onSubmit, labels }: ContactFormProps) => {
	const [result, setResult] = React.useState<
		"idle" | "success" | "limited" | "error"
	>("idle");

	const form = useForm<ContactValues>({ defaultValues: getContactDefaults() });

	const submit = form.handleSubmit(async (values) => {
		setResult("idle");

		try {
			await onSubmit(values);
			form.reset();
			setResult("success");
		} catch (error) {
			setResult(
				error instanceof Error && error.message === "429" ? "limited" : "error",
			);
		}
	});

	const feedbackMessages = {
		idle: "",
		success: labels.contactSuccess,
		limited: labels.contactRateLimit,
		error: labels.contactFailure,
	};

	const feedback = feedbackMessages[result];

	const submitLabel = form.formState.isSubmitting
		? labels.contactSending
		: labels.contactSend;

	return (
		<FormProvider {...form}>
			<form className="mt-8 grid gap-5" onSubmit={submit}>
				<Input
					name="email"
					type="email"
					autoComplete="email"
					label={labels.email}
					placeholder={labels.emailPlaceholder}
					rules={{ required: labels.emailRequired }}
				/>
				<Input
					name="subject"
					label={labels.contactSubject}
					placeholder={labels.contactSubjectPlaceholder}
					rules={{
						required: labels.contactSubjectRequired,
						maxLength: { value: 200, message: labels.contactSubjectMax },
					}}
				/>
				<Textarea
					label={labels.contactContent}
					name="content"
					rows={15}
					maxLength={5_000}
					placeholder={labels.contactContentPlaceholder}
					rules={{
						required: labels.contactContentRequired,
						maxLength: { value: 5_000, message: labels.contactContentMax },
					}}
				/>
				<label className="sr-only">
					{labels.contactWebsite}
					<input
						autoComplete="off"
						tabIndex={-1}
						{...form.register("website")}
					/>
				</label>
				<Button
					className="justify-self-start"
					type="submit"
					disabled={form.formState.isSubmitting}
				>
					{submitLabel}
				</Button>
				{!!feedback && (
					<p className={result === "success" ? "text-success" : "text-danger"}>
						{feedback}
					</p>
				)}
			</form>
		</FormProvider>
	);
};
