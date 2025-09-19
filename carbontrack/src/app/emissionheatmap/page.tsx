"use client";
import React, { useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useEmissionsData } from '../hooks/useFetchEmissionData';
import { blendColors } from '../utils/fetchEmissionData';
import SidebarLayout from '../components/SideBarLayout/layout';
import { IoPersonOutline, IoSettingsOutline } from 'react-icons/io5';
import Link from 'next/link';
import Calendar from '../sharedComponents/Calendar';

export default function EmissionsHeatmapPage() {
    const { factoryEmissions, loading, error, selectedDate, setSelectedDate, noDataForDate } = useEmissionsData();

    const totalBoxes = 67;
    const columns = 10;
    const rows = Math.ceil(totalBoxes / columns);
    const colors = {
        high: "#2A4759",
        medium: "#53BAFA",
        low: "#BEE3FA",
        zero: "#FFFFFF"
    };
    let avgEmission = 0;
    if (factoryEmissions.length > 0) {
        const totalEmission = factoryEmissions.reduce((sum, item) => sum + item.totalEmission, 0);
        avgEmission = totalEmission / factoryEmissions.length;
    }
   
    const getEmissionColor = (emissions: number) => {
        if (emissions === 0) return colors.zero;
        const ratio = emissions / avgEmission;
        if (ratio >= 2.0) return colors.high;
        if (ratio >= 1.0) return blendColors(colors.medium, colors.high, ratio - 1);
        if (ratio >= 0.5) return blendColors(colors.low, colors.medium, (ratio - 0.5) * 2);
        return blendColors(colors.zero, colors.low, ratio * 2);
    };
    const [hoveredBox, setHoveredBox] = useState<{ index: number; name: string; emission: number; } | null>(null);
    const boxes = factoryEmissions.map((item, index) => (
        <div
            key={index}
            className="relative rounded-[10px] w-[56px] h-[56px] cursor-pointer"
            style={{ background: noDataForDate ? colors.zero : getEmissionColor(item.totalEmission) }}
            onMouseEnter={() => !noDataForDate && setHoveredBox({
                index,
                name: item.factoryName,
                emission: item.totalEmission
            })}
            onMouseLeave={() => hoveredBox?.index === index && setHoveredBox(null)}
        >
            {hoveredBox && hoveredBox.index === index && !noDataForDate && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-blue-200 text-gray-800 p-3 rounded-lg shadow-lg z-10 w-48 pointer-events-none">
                    <div className="font-bold text-sm mb-1">{hoveredBox.name}</div>
                    <div className="text-xs">Emissions: {hoveredBox.emission.toFixed(4)} kg/s</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white" />
                </div>
            )}
        </div>
    ));
    if (factoryEmissions.length < totalBoxes) {
        const emptyBoxes = Array(totalBoxes - factoryEmissions.length).fill(null).map((item, index) => (
            <div
                key={factoryEmissions.length + index}
                className="rounded-[10px] w-[56px] h-[56px]"
                style={{ backgroundColor: colors.zero }}
            />
        ));
        boxes.push(...emptyBoxes);
    }
    const legendItems = [
        { color: colors.high, label: `≥${(avgEmission * 2).toFixed(0)} kg/s`, text: "High Emissions" },
        { color: colors.medium, label: `≥${avgEmission.toFixed(0)} kg/s`, text: "Average Emissions" },
        { color: colors.low, label: `≥${(avgEmission * 0.5).toFixed(0)} kg/s`, text: "Low Emissions" },
        { color: colors.zero, label: "0 kg/s", text: "No Emissions" },
    ];
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
    return (
        <SidebarLayout>
            <div className="flex flex-col items-center min-h-[calc(100vh-60px)] p-10">
                <div className="flex justify-end w-16 ml-350 space-x-4">
                    <Link href=""><IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" /></Link>
                    <Link href="#"><IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" /></Link>
                </div>
                <div className="font-bold text-[48px] mb-[15px] tracking-wide w-full">Factory Emissions</div>
                <div className="bg-[#161C22] text-white rounded-[18px] shadow-[0_2px_24px_#0003] p-[36px_40px] flex flex-col w-full max-w-screen-2xl mt-10">
                    <div className="mb-6 flex items-center">
                        <Calendar
                            selectedDate={selectedDateObj}
                            setSelectedDate={(date) => {
                                if (date) {
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                    const dd = String(date.getDate()).padStart(2, '0');
                                    setSelectedDate(`${yyyy}-${mm}-${dd}`);
                                } else {
                                    setSelectedDate('');
                                }
                            }}
                        />
                    </div>
                    {noDataForDate && <div className="mt-2 text-sm text-yellow-300">No emissions data available for the selected date</div>}
                    {loading ? (
                        <div className="text-lg text-center my-[54px]">Loading emissions data...</div>
                    ) : error ? (
                        <div className="text-lg text-center my-[54px] text-red-400">{error}</div>
                    ) : (
                        <div className="flex flex-row gap-[48px]">
                            <div
                                className="grid rounded-[14px] bg-[#232B34] p-[18px] border-2 border-[#232B34] shadow-[0_2px_8px_#0002] overflow-visible"
                                style={{
                                    gridTemplateColumns: `repeat(${columns}, 56px)`,
                                    gridAutoRows: '56px',
                                    minWidth: `${columns * 56 + (columns - 1) * 7 + 36}px`,
                                    minHeight: `${rows * 56 + (rows - 1) * 7 + 36}px`,
                                    gap: '7px',
                                }}
                            >
                                {boxes}
                            </div>
                            <div className="flex flex-row items-start ml-[2px] flex-grow">
                                <div className="relative h-[320px] ml-20">
                                    <div
                                        className="rounded-[6px] border border-white block mt-[12px] mr-[28px]"
                                        style={{
                                            width: '60px',
                                            height: '320px',
                                            background: `linear-gradient(to bottom, ${colors.high}, ${colors.medium}, ${colors.low}, ${colors.zero})`,
                                        }}
                                    />
                                    <span className="absolute left-[70px] text-white text-[15px] font-semibold whitespace-nowrap select-none" style={{ top: 0 }}>
                                        {(avgEmission * 2).toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white text-[15px] font-semibold whitespace-nowrap select-none" style={{ top: 106 }}>
                                        {avgEmission.toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white text-[15px] font-semibold whitespace-nowrap select-none" style={{ top: 213 }}>
                                        {(avgEmission * 0.5).toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white text-[15px] font-semibold whitespace-nowrap select-none" style={{ top: 304 }}>
                                        0 kg/s
                                    </span>
                                </div>
                                <div className="ml-[280px] mt-[12px] flex-grow">
                                    {legendItems.map((item, index) => (
                                        <div key={index} className="flex items-center mb-[32px]">
                                            <div className="w-[48px] h-[48px] rounded-[8px] border-2 border-white mr-[20px]" style={{ background: item.color }} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[18px] text-white">{item.text}</span>
                                                <span className="font-normal text-[17px] text-[#B2B2B2]">{item.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}