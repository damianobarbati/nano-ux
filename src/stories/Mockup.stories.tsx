import { Mockup } from "../components/Mockup.tsx";

export default { title: "Components / Mockup", component: Mockup };

export const Variants = {
	name: "Mockup",
	render: () => (
		<div className="grid w-[min(44rem,calc(100vw-2rem))] items-start gap-6 sm:grid-cols-[1fr_12rem]">
			<section>
				<h2>Browser</h2>
				<Mockup address="https://example.com">
					<div className="grid min-h-32 place-items-center">
						Hello, browser!
					</div>
				</Mockup>
			</section>
			<section className="sm:col-start-2 sm:row-span-2">
				<h2>Smartphone</h2>
				<Mockup variant="smartphone">
					<div className="grid h-full place-items-center">Hello, mobile!</div>
				</Mockup>
			</section>
			<section>
				<h2>Browser without address</h2>
				<Mockup>
					<div className="grid min-h-32 place-items-center">
						Hello, browser!
					</div>
				</Mockup>
			</section>
			<section>
				<h2>Terminal</h2>
				<Mockup variant="terminal">
					{'$ echo "Hello, terminal!"\nHello, terminal!'}
				</Mockup>
			</section>
		</div>
	),
};
