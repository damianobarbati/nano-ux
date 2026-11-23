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

const defaultStrings = {
	email: "Email",
	contactSuccess: "Your message has been sent.",
	contactRateLimit: "Please wait before sending another message.",
	contactFailure: "We could not send your message. Please try again.",
	emailPlaceholder: "you@company.com",
	emailRequired: "Email is required",
	contactSubject: "Subject",
	contactSubjectPlaceholder: "How can we help?",
	contactSubjectRequired: "Subject is required.",
	contactSubjectMax: "Use at most 200 characters.",
	contactContent: "Content",
	contactContentPlaceholder: "Tell us how we can help.",
	contactContentRequired: "Message is required.",
	contactContentMax: "Use at most 5,000 characters.",
	contactWebsite: "Website",
	contactSending: "Sending...",
	contactSend: "Send message",
};

export type ContactFormProps = {
	onSubmit: (values: ContactValues) => Promise<void>;
	labels?: typeof defaultStrings;
	strings?: Partial<typeof defaultStrings>;
};

export const ContactForm = ({
	onSubmit,
	labels = defaultStrings,
	strings,
}: ContactFormProps) => {
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
		success: strings?.contactSuccess ?? labels.contactSuccess,
		limited: strings?.contactRateLimit ?? labels.contactRateLimit,
		error: strings?.contactFailure ?? labels.contactFailure,
	};

	const feedback = feedbackMessages[result];

	const submitLabel = form.formState.isSubmitting
		? (strings?.contactSending ?? labels.contactSending)
		: (strings?.contactSend ?? labels.contactSend);

	return (
		<FormProvider {...form}>
			<form className="mt-8 grid gap-5" onSubmit={submit}>
				<Input
					name="email"
					type="email"
					autoComplete="email"
					label={strings?.email ?? labels.email}
					placeholder={strings?.emailPlaceholder ?? labels.emailPlaceholder}
					rules={{ required: strings?.emailRequired ?? labels.emailRequired }}
				/>
				<Input
					name="subject"
					label={strings?.contactSubject ?? labels.contactSubject}
					placeholder={
						strings?.contactSubjectPlaceholder ??
						labels.contactSubjectPlaceholder
					}
					rules={{
						required:
							strings?.contactSubjectRequired ?? labels.contactSubjectRequired,
						maxLength: {
							value: 200,
							message: strings?.contactSubjectMax ?? labels.contactSubjectMax,
						},
					}}
				/>
				<Textarea
					label={strings?.contactContent ?? labels.contactContent}
					name="content"
					rows={15}
					maxLength={5_000}
					placeholder={
						strings?.contactContentPlaceholder ??
						labels.contactContentPlaceholder
					}
					rules={{
						required:
							strings?.contactContentRequired ?? labels.contactContentRequired,
						maxLength: {
							value: 5_000,
							message: strings?.contactContentMax ?? labels.contactContentMax,
						},
					}}
				/>
				<label className="sr-only">
					{strings?.contactWebsite ?? labels.contactWebsite}
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
