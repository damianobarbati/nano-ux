import * as icons from "../../icons.tsx";

const sources = {
	ILinkedIn: "LinkedIn",
	IAndroid: "SiAndroid",
	IApple: "SiApple",
	IArrowDown: "HiOutlineArrowDown",
	IArrowRight: "FiArrowRight",
	IArrowUp: "HiOutlineArrowUp",
	IArrowUpRight: "HiOutlineArrowUpRight",
	IBarChart: "HiOutlineChartBar",
	IBolt: "FiZap",
	IBranch: "FiGitBranch",
	IBrave: "SiBrave",
	ICalendar: "HiOutlineCalendarDays",
	ICard: "FiCreditCard",
	ICheck: "FiCheck",
	IChevronDown: "FiChevronDown",
	IChrome: "SiGooglechrome",
	IClose: "FiX",
	ICode: "HiOutlineCodeBracket",
	ICodeFile: "LuFileCode2",
	ICopy: "FiCopy",
	IDatabase: "LuDatabase",
	IDocument: "FiFileText",
	IDownload: "HiOutlineArrowDownTray",
	IEdge: "FaEdge",
	IEllipsis: "HiOutlineEllipsisVertical",
	IExchange: "LuArrowLeftRight",
	IExpand: "HiOutlineArrowsPointingOut",
	IFaceScan: "TbFaceId",
	IFilter: "HiOutlineAdjustmentsHorizontal",
	IFirefox: "SiFirefoxbrowser",
	IGamepad: "LuGamepad2",
	IGrip: "LuGripVertical",
	IGear: "HiOutlineCog6Tooth",
	IGitHub: "SiGithub",
	IGlobe: "FiGlobe",
	IGoogle: "FcGoogle",
	IGrid: "FiGrid",
	IGroup: "HiOutlineUsers",
	IHome: "HiOutlineHome",
	IIdCard: "LuIdCard",
	IKey: "LuKeyRound",
	ILaptop: "FaLaptop",
	ILayers: "FiLayers",
	ILink: "FiLink",
	ILinux: "SiLinux",
	ILock: "FiLock",
	ILogoutLeft: "HiOutlineArrowLeftOnRectangle",
	ILogoutRight: "FiLogOut",
	IMenu: "FiMenu",
	IMonitor: "LuMonitor",
	IMoon: "LuMoon",
	INetwork: "LuNetwork",
	IOpera: "SiOpera",
	IPencil: "HiOutlinePencilSquare",
	IPhone: "FaMobileScreenButton",
	IPlus: "HiOutlinePlus",
	IPulse: "RiPulseAiFill",
	IRefresh: "FiRefreshCw",
	ISafari: "SiSafari",
	ISamsung: "SiSamsung",
	ISearch: "HiOutlineMagnifyingGlass",
	ISend: "LuSend",
	IServer: "FiServer",
	IShieldCheck: "HiOutlineShieldCheck",
	IShuffle: "LuShuffle",
	ISpinner: "CgSpinner",
	ISpinnerArc: "—",
	ISpinnerRing: "—",
	ISplit: "LuSplit",
	ISun: "LuSun",
	ITablet: "FaTabletScreenButton",
	ITerminal: "LuTerminal",
	ITilde: "PiTildeLight",
	ITrash: "HiOutlineTrash",
	IUbuntu: "SiUbuntu",
	IUser: "FiUser",
	IWand: "LuWandSparkles",
	IWebhook: "LuWebhook",
	IWindows: "FaWindows",
} satisfies Record<keyof typeof icons, string>;

const inventory = Object.keys(sources) as (keyof typeof icons)[];

export const Preview = () => (
	<main className="p-4">
		<h1>Icons</h1>
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead>
					<tr>
						{["Icon", "Name", "Source"].map((label) => (
							<th key={label} scope="col" className="p-2">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{inventory.map((name) => {
						const Icon = icons[name];
						return (
							<tr className="border-t border-border" key={name}>
								<td className="p-2">
									<Icon aria-hidden="true" className="size-6" />
								</td>
								<th className="p-2" scope="row">
									<code>{name}</code>
								</th>
								<td className="p-2">
									<code>{sources[name]}</code>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	</main>
);

export const layout = "fullscreen";

export const section = "Foundation";
