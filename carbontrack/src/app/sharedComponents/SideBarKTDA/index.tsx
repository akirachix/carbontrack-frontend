import Image from "next/image";
import { RxDashboard } from "react-icons/rx";
import { FiCloud } from "react-icons/fi";
import { TbBuildingFactory } from "react-icons/tb";
import { GoVerified } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
const Sidebar = () => {
    return (
        <div className="flex h-screen bg-black">
            <div className="bg-[#2A4759] w-64 min-h-full flex flex-col">
                <div className="flex justify-center ">
                    <Image
                        src="/Images/carbon-logo.svg"
                        height={255}
                        width={255}
                        alt="carbon logo"
                        priority/>
                </div>
                <nav className="flex flex-col flex-grow px-8 pt-7">
                    {[
                        { href: "#", Icon: RxDashboard, label: "Dashboard" },
                        { href: "#", Icon: FiCloud, label: "Emissions" },
                        { href: "#", Icon: TbBuildingFactory, label: "Factories" },
                        { href: "#", Icon: GoVerified, label: "Compliance" },
                    ].map(({ href, Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex items-center space-x-3 mb-5 group p-2 rounded-md hover:bg-[#F79B72] hover:mr-5 transition-all"
                        >
                            <Icon className="h-8 w-8 text-[#F79B72] group-hover:text-[#2A4759]" />
                            <h1 className="text-[22px] text-white">{label}</h1>
                        </Link>
                    ))}
                    <div className="flex-grow" />
                    <Link
                        href="#"
                        className="flex items-center space-x-3 mb-8 group p-2 rounded-md hover:bg-[#F79B72] hover:mr-5 transition-all"
                    >
                        <CiLogout className="h-8 w-8 text-[#F79B72] group-hover:text-[#2A4759]" />
                        <h1 className="text-[22px] text-white">Log Out</h1>
                    </Link>
                </nav>
            </div>
        </div>
    );
};
export default Sidebar;