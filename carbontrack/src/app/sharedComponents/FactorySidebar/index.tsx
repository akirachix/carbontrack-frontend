'use client';
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RxDashboard } from "react-icons/rx";
import { GoDatabase } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import ConfirmationModal, { performLogout } from "../ConfirmLogout";
import Link from "next/link";

const FactorySidebar = () => {
    const pathname = usePathname();
    const navItems = [
        { href: "/factory-dashboard", Icon: RxDashboard, label: "Dashboard" },
        { href: "/records", Icon: GoDatabase, label: "Records" },
    ];
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        performLogout()
        router.push("/login");
        setShowLogoutModal(false);
    };

    return (
        <div className="flex h-screen bg-black">
            <div className="bg-[#2A4759] w-64 min-h-full flex flex-col">
                <div className="flex justify-center select-none">
                    <Image
                        src="/Images/carbon-logo.svg"
                        height={55}
                        width={265}
                        alt="carbon logo"
                        draggable={false}  
                        style={{ userSelect: "none" }} 
                    />
                </div>
                <nav className="flex flex-col flex-grow px-6 pt-7">
                    {navItems.map((item, index) => {
                        const { href, label, Icon } = item;
                        const isActive = pathname === href;
                        const ClassName =
                          "flex items-center space-x-3 mb-3 group p-3 rounded-md transition-colors " +
                          (isActive
                            ? "bg-[#F79B72] border-l-4 border-[#F79B72]"
                            : "hover:bg-[#F79B72] hover:border-l-4 hover:border-[#F79B72]");
                        const iconClassName =
                          "h-8 w-8 transition-colors " +
                          (isActive
                            ? "text-[#2A4759]"
                            : "text-[#F79B72] group-hover:text-[#2A4759]");
                        return (
                            <Link
                                key={index}
                                href={href}
                                className={ClassName}>
                                <Icon className={iconClassName} />
                                <h1 className="text-[18px] text-white font-semibold">{label}</h1>
                            </Link>
                        );
                    })}
                    <div className="flex-grow" />
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex cursor-pointer items-center space-x-3 mb-8 group p-3 rounded-md transition-colors hover:bg-[#F79B72] hover:border-l-4 hover:border-[#F79B72] w-full text-left"
                    >
                        <CiLogout className="h-8 w-8 text-[#F79B72] group-hover:text-[#2A4759]" />
                        <h1 className="text-[18px] text-white font-semibold">Log Out</h1>
                    </button>
                    <ConfirmationModal
                        isOpen={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={handleLogout}
                        title="Log out from Factory Dashboard?"
                        message="Your session will end."
                    />
                </nav>
            </div>
        </div>
    );
};
export default FactorySidebar;