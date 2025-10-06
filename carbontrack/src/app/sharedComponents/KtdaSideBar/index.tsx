'use client';
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxDashboard } from "react-icons/rx";
import { FiCloud } from "react-icons/fi";
import { TbBuildingFactory } from "react-icons/tb";
import { GoVerified } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import ConfirmationModal, { performLogout } from '../ConfirmLogout';
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const navItems = [
    { href: "/ktda-dashboard", Icon: RxDashboard, label: "Dashboard" },
    { href: "/emissions", Icon: FiCloud, label: "Emissions" },
    { href: "/factory", Icon: TbBuildingFactory, label: "Factories" },
    { href: "/compliance_page", Icon: GoVerified, label: "Compliance" },
  ];
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    performLogout()
    router.push('/login');
    setShowLogoutModal(false);
  };
  return (
    <div className="flex h-screen bg-black">
      <div className="bg-[#2A4759] 2xl:w-64 xl:w-60 lg:w-43 min-h-full flex flex-col">
        <div className="flex justify-center select-none">
          <Image
            src="/Images/carbon-logo.svg"
            height={255}
            width={255}
            alt="carbon logo"
            draggable={false}
            style={{ userSelect: "none" }}
          />
        </div>
        <nav className="2xl:flex 2xl:flex-col 2xl:flex-grow 2xl:px-8 2xl:pt-7 xl:flex-col xl:flex-grow xl:px-8 xl:pt-7  lg:flex lg:flex-col lg:flex-grow lg:px-6 lg:pt-4">
          {navItems.map((item, index) => {
            const { href, label, Icon } = item;
            const isActive = pathname === href;
            const className =
              "flex items-center space-x-3 mb-5 group p-2 rounded-md transition-colors " +
              (isActive
                ? "bg-[#F79B72] border-l-4 border-[#F79B72]"
                : "hover:bg-[#F79B72] hover:border-l-4 hover:border-[#F79B72]");
            const iconClassName =
              "2xl:h-8 2xl:w-8 xl:h-8 xl:w-8 lg:h-7 lg:w-7 transition-colors " +
              (isActive
                ? "text-[#2A4759]"
                : "text-[#F79B72] group-hover:text-[#2A4759]");
            return (
              <Link
                key={index}
                href={href}
                className={className}>
                <Icon className={iconClassName} />
                <h1
                  className={`2xl:text-[22px] xl:text-[22px] lg:text-[13px] text-white font-semibold`}
                >
                  {label}
                </h1>
              </Link>
            );
          })}
          <div className="flex-grow" />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex cursor-pointer items-center space-x-3 mb-8 group p-2 rounded-md transition-colors hover:bg-[#F79B72] hover:border-l-4 hover:border-[#F79B72] w-full text-left"
          >
            <CiLogout className="2xl:h-8 2xl:w-8 xl:h-8 xl:w-8 lg:h-7 lg:w-7 text-[#F79B72] group-hover:text-[#2A4759]" />
            <h1 className="2xl:text-[22px] xl:text-[22px] lg:text-[13px] text-white font-semibold">Log Out</h1>
          </button>
          <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
            title="Log out from Ktda Dashboard?"
            message="Your session will end."
          />
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;