'use client';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useEmissionsData } from '../hooks/useFetchEmissionData';
import { blendColors } from '../utils/fetchEmissionData';
import SidebarLayout from '../components/SideBarLayout';
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
                className="rounded-[10px] 2xl:w-[56px] 2xl:h-[56px] xl:w-[56px] xl:h-[56px] lg:w-[46px] lg:h-[6px]"
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
               
                <div className="font-bold 2xl:text-[48px] xl:text-[40px] lg:text-[19px] 2xl:ml-0 xl:ml-0 lg:ml-12 2xl:mb-[15px] xl:mb-[10px] lg:mb-[0px] tracking-wide w-full">Factory Emissions</div>
                <div className="bg-[#161C22] text-white rounded-[18px] shadow-[0_2px_24px_#0003] 2xl:p-[36px_40px] xl:p-[36px_40px] lg:p-[0px_0px] flex flex-col w-full 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-0.5xl 2xl:mt-10 xl:mt-1 lg:mt-0">
                    <div className="2xl:mb-6 xl:mb-1 lg:mb-0 2xl:ml-0 xl:ml-0 lg:ml-5 2xl:pt-0 xl:pt-0 lg:pt-0.5  flex items-center">
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
                    {noDataForDate && <div className="2xl:mt-2 xl:mt-2 lg:mt-0 text-sm text-yellow-300">No emissions data available for the selected date</div>}
                    {loading ? (
                        <div className="text-lg text-center my-[54px]">Loading emissions data...</div>
                    ) : error ? (
                        <div className="text-lg text-center my-[54px] text-red-400">{error}</div>
                    ) : (
                        <div className="2xl:flex 2xl:flex-row 2xl:gap-[48px] xl:flex xl:flex-row xl:gap-[2px] lg:flex lg:flex-row lg:gap-[0px]">
                            <div
                                className="grid rounded-[14px] bg-[#232B34] 2xl:p-[18px] xl:p-[10px] lg:p-[17px] border-2 border-[#232B34] shadow-[0_2px_8px_#0002] overflow-visible"
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
                            <div className="2xl:flex 2xl:flex-row xl:flex xl:flex-row lg:flex lg:flex-row items-start 2xl:ml-[2px] xl:ml-[px] lg:ml-[0px] flex-grow">
                                <div className="relative 2xl:h-[320px] xl:h-[120px] lg:h-[120px] 2xl:ml-20 xl:ml-10 lg:ml-0 ">
                                    <div
                                        className="rounded-[6px] border border-white block mt-[12px] 2xl:mr-[28px] xl:mr-[2px] lg:mr-[0px]"
                                        style={{
                                            width: '60px',
                                            height: '320px',
                                            background: `linear-gradient(to bottom, ${colors.high}, ${colors.medium}, ${colors.low}, ${colors.zero})`,
                                        }}
                                    />
                                    <span className="absolute left-[70px] text-white 2xl:text-[15px] xl:text-[11px] lg:text-[8px] font-semibold whitespace-nowrap select-none" style={{ top: 0 }}>
                                        {(avgEmission * 2).toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white 2xl:text-[15px] xl:text-[11px] lg:text-[8px] font-semibold whitespace-nowrap select-none" style={{ top: 106 }}>
                                        {avgEmission.toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white 2xl:text-[15px] xl:text-[11px] lg:text-[8px] font-semibold whitespace-nowrap select-none" style={{ top: 213 }}>
                                        {(avgEmission * 0.5).toFixed(0)} kg/s
                                    </span>
                                    <span className="absolute left-[70px] text-white 2xl:text-[15px] xl:text-[11px] lg:text-[8px] font-semibold whitespace-nowrap select-none" style={{ top: 304 }}>
                                        0 kg/s
                                    </span>
                                </div>
                                <div className="2xl:ml-[280px] xl:ml-[40px] lg:ml-[20px]  2xl:mt-[12px] xl:mt-[12px] lg:mt-[20px] flex-grow">
                                    {legendItems.map((item, index) => (
                                        <div key={index} className="flex items-center 2xl:mb-[32px] xl:mb-[25px] lg:mb-[20px] 2xl:w-[100%] xl:w-[100%] lg:w-[80%]">
                                            <div className="2xl:w-[48px] xl:w-[40px] lg:w-[30px] 2xl:h-[48px] xl:h-[40px] lg:h-[20px] rounded-[8px] border-2 border-white 2xl:mr-[20px] xl:mr-[0px] 2xl:ml-0 xl:ml-10 lg:ml-5" style={{ background: item.color }} />
                                            <div className="flex flex-col 2xl:gap-0 xl:gap-3 lg:gap-7">
                                                <span className="font-bold 2xl:text-[18px] xl:text-[13px] lg:text-[10px] text-white">{item.text}</span>
                                                <span className="font-normal 2xl:text-[17px] xl:text-[12px] lg:text-[9px] text-[#B2B2B2]">{item.label}</span>
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