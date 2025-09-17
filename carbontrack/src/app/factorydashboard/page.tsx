"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, } from "recharts";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import useFetchEmissions from "../hooks/useFetchEmissions";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import Sidebar from "../sharedComponents/FactorySidebar"
import Link from "next/link";

export default function DashboardPage() {
  const { selectedDate, setSelectedDate, barData, lineData, error: emissionsError, loading: emissionsLoading, todayTotal, monthTotal, } = useFetchEmissions();
  const { totalCO2, loading, error, } = useFetchEnergyEntries(selectedDate);

  return (
    <div className="bg-black text-white w-full md:w-full  min-h-screen flex ">
      
    
      <main className="flex-1 p-6 md:p-8 overflow-auto w-full mx-auto">

          <div className="flex justify-end w-16 ml-270 space-x-4">
                    <Link href="">
                        <IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
                    </Link>
                    <Link href="/profile">
                        <IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
                    </Link>
        </div>
        <h2 className="text-2xl font-bold mb-2 truncate">Factory Dashboard</h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Real-time monitoring for individual factory operations
        </p>

              
        <div className="mb-6 flex items-center flex-wrap gap-2">
          <FaRegCalendarAlt size={20} className="text-gray-400" />
          {/* <label className="text-gray-300 mr-2">Select date:</label> */}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Choose a date"
            maxDate={new Date()}
            isClearable
            className="p-2 rounded-md bg-gray-700 border border-gray-600 text-white min-w-[150px]"
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-300">Today’s total CO2 emissions</p>
            <p className="text-2xl font-bold mt-2 truncate">
              {todayTotal !== null ? `${todayTotal.toFixed(6)} kgs` : emissionsLoading}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-300">This month total CO2 emissions</p>
            <p className="text-2xl font-bold mt-2 truncate">
              {monthTotal !== null ? `${monthTotal.toFixed(6)} kgs` : emissionsLoading}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-300">Indirect Emissions</p>
            <p className="text-2xl font-bold mt-2 truncate">
              {totalCO2 !== null ? `${totalCO2.toFixed(6)} kgs`: emissionsLoading}
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-white truncate">
              CO2 Levels Over Time
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="month"
                  stroke="#aaa"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" fill="#F79B72" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className="bg-slate-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 w-full h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-white truncate">
              Current CO2 Emissions
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 43 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="time"
                  stroke="#aaa"
                  height={40}
                  tick={{ fontSize: 12 }} />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#F79B72" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}