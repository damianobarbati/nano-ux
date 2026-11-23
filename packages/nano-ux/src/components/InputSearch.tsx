import { ISearch } from "../icons.tsx";
import { Input, type InputProps } from "./Input.tsx";

export type InputSearchProps = Omit<InputProps, "type" | "leadingIcon">;

export const InputSearch = (props: InputSearchProps) => (
	<Input
		{...props}
		type="search"
		leadingIcon={<ISearch className="size-4" />}
	/>
);
