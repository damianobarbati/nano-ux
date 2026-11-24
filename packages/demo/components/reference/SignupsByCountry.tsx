import cx from "clsx-tw";
import { WorldMap } from "nano-ux/charts/world-map";

type SignupsByCountryProps = { className?: string };

export const SignupsByCountry = ({ className }: SignupsByCountryProps) => (
	<div className={cx("aspect-[802/405] w-full", className)}>
		<WorldMap
			label="Relative signup activity by country"
			data={[
				{ country: "US", intensity: 100 },
				{ country: "IT", intensity: 60 },
			]}
		/>
	</div>
);
