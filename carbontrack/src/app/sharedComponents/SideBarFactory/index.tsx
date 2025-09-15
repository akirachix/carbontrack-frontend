import Image from "next/image";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { BsDatabaseFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";

const navItems = [
  { href: "#", Icon: RxDashboard, label: "Dashboard" },
  { href: "/records", Icon: BsDatabaseFill, label: "Records" },
];

const Sidebar = () => (
  <aside className="bg-[#214A5A] w-64 min-h-screen flex flex-col">
    <div className="flex flex-col">
      <div className="flex justify-center items-center bg-[#e7e7e7] w-full h-[150px]">
        <Image
          src="/Images/carbon-logo.svg"
          width={256}
          height={128}
          alt="carbon logo"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          priority
        />
      </div>
      <div style={{ marginBottom: "38px" }} />
    </div>

    <nav className="flex flex-col flex-grow px-8 pt-4 gap-2">
      {navItems.map(({ href, Icon, label }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-all
            hover:bg-[#13303A] hover:text-[#F79B72] group"
        >
          <Icon className="h-8 w-8 text-[#F79B72] group-hover:text-[#13303A]" />
          <span className="text-[22px] text-white group-hover:text-[#F79B72] font-semibold">{label}</span>
        </Link>
      ))}
      <div className="flex-grow" />
      <Link
        href="#"
        className="flex items-center space-x-3 mb-8 p-2 rounded-md cursor-pointer transition-all
          hover:bg-[#13303A] hover:text-[#F79B72] group"
      >
        <CiLogout className="h-8 w-8 text-[#F79B72] group-hover:text-[#13303A]" />
        <span className="text-[22px] text-white group-hover:text-[#F79B72] font-semibold">Log Out</span>
      </Link>
    </nav>
  </aside>
);

export default Sidebar;