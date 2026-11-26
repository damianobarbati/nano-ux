import * as z from "zod/mini";
import { ISearch } from "../icons.tsx";
import { Input, type InputProps, InputPropsSchema } from "./Input.tsx";

export const InputSearchPropsSchema = InputPropsSchema;

export type InputSearchProps = z.infer<typeof InputSearchPropsSchema> &
	Omit<InputProps, "type" | "leadingIcon">;

export const InputSearch = (props: InputSearchProps) => (
	<Input
		{...props}
		type="search"
		leadingIcon={<ISearch className="size-4" />}
	/>
);
