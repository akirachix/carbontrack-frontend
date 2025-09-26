
'use client'

import React, { useState } from 'react';
import useFactoryEmissions from '../hooks/useFetchFactoryData';
import { IoPersonOutline } from 'react-icons/io5';
import SidebarLayout from '../components/SideBarLayout';
import Link from 'next/link';
import Pagination from '../sharedComponents/Pagination';
import type { FactoryEmission } from '../types';
export default function FactoryEmissionLeaderboard() {
    const { factoryEmissions = [], loading, error } = useFactoryEmissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const filteredEmissions = factoryEmissions.filter((factory: FactoryEmission) => {
        if (searchTerm) {
            return factory.factoryName.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });
    const totalPages = Math.ceil(filteredEmissions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmissions.slice(indexOfFirstItem, indexOfLastItem);
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    const changeInPercent = (changePercent: number) => {
        const sign = changePercent >= 0 ? '+' : '';
        const colorClass = changePercent >= 0 ? 'text-red-400' : 'text-green-400';
        return (
            <td className={`p-3 border border-gray-700 2xl:text-[15px] xl:text-[15px] lg:text-[12px] ${colorClass}`}>
                {sign}{changePercent}%
            </td>
        );
    };
    return (
        <SidebarLayout>
            <div className="p-2 min-h-screen text-white mx-auto ml-10 2xl:pt-9 xl:pt-4">
                <div className="flex justify-end w-16 2xl:ml-350 xl:ml-220 lg:ml-170 space-x-4">
                    <Link href="#">
                        <IoPersonOutline className="text-[#F79B72] 2xl:w-7 2xl:h-7 xl:w-7 xl:h-7 lg:w-5 lg:h-5 cursor-pointer hover:text-[#2A4759]" />
                    </Link>
                </div>
                <h1 className='font-500 2xl:text-[48px] xl:text-[35px] lg:text-[25px] 2xl:mb-6 xl:mb-2 lg:mb-2'>Factory Emission Leaderboard</h1>
                <div className='flex space-x-20 2xl:mb-8 xl:mb-5 lg:mb-5'>
                    <div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(item) => setSearchTerm(item.target.value)}
                            placeholder="Search factory names..."
                            className="2xl:p-3 xl:p-3 lg:p-2 w-[25vw] border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
                        />
                    </div>
                </div>
                <table className="2xl:w-[80vw] xl:w-[75vw] lg:w-[75vw] table-fixed border-collapse border border-gray-700 text-left rounded-[10px]">
                    <thead>
                        <tr className="bg-[#2A4759] text-white border border-gray-700 2xl:text-[16px] xl:text-[16px] lg:text-[13px]">
                            <th className="2xl:p-5 xl:p-4 lg:p-3 w-1/3 border border-gray-700 ">Factory</th>
                            <th className="2xl:p-5 xl:p-4 lg:p-3  w-1/3 border border-gray-700">Total Emission(kg/s)</th>
                            <th className="2xl:p-5 xl:p-4 lg:p-3  w-1/3 border border-gray-700">Change from last month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            if (loading) return <tr><td colSpan={3} className="p-4 text-center border border-gray-700">Loading factories...</td></tr>;
                            if (error) return <tr><td colSpan={3} className="p-4 text-center text-red-400 border border-gray-700">{error}</td></tr>;
                            if (currentItems.length === 0) return <tr><td colSpan={3} className="p-4 text-center border border-gray-700">No matching factory found</td></tr>;
                            return currentItems.map((item, index) => (
                                <tr key={item.factoryId} className={`border border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} `}>
                                    <td className="2xl:p-5 xl:p-4 lg:p-2  font-semibold border border-gray-700 2xl:text-[15px] xl:text-[15px] lg:text-[12px]">{item.factoryName}</td>
                                    <td className="2xl:p-5 xl:p-4 lg:p-2  border border-gray-700 2xl:text-[15px] xl:text-[15px] lg:text-[12px]">{item.totalEmission.toFixed(4)}</td>
                                    {changeInPercent(item.changePercent)}
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
                <div className="mt-6">
                    <Pagination page={currentPage} totalPages={totalPages} isDark onPageChange={page => {
                        if (page >= 1 && page <= totalPages) setCurrentPage(page);
                    }} />
                </div>
            </div>
        </SidebarLayout>
    );
}